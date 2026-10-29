// Prerender public pages to static HTML after `vite build`.
// Usage: node scripts/prerender.mjs  (run from the repository root)
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";

const root = process.cwd();
const outDir = path.resolve(root, "dist/public");
const serverDir = path.resolve(root, "dist/prerender");

// 1) Build the server-side entry with the same Vite config (aliases, Tailwind, React).
await build({
  configFile: path.resolve(root, "vite.config.ts"),
  logLevel: "warn",
  build: {
    ssr: path.resolve(root, "client/src/entry-server.tsx"),
    outDir: serverDir,
    emptyOutDir: true,
    copyPublicDir: false,
    rollupOptions: { output: { format: "esm", entryFileNames: "entry-server.mjs" } },
  },
  ssr: { noExternal: true },
});

const { render, getSiteMetadata, SHEETS_ENDPOINT } = await import(pathToFileURL(path.join(serverDir, "entry-server.mjs")).href);

// 2) Public project catalogue (same fallback the Netlify function serves), in Spanish.
const seed = JSON.parse(await fs.readFile(path.resolve(root, "netlify/database/seed/public-catalog.json"), "utf8"));
const statusEs = { development: "En desarrollo", preparation: "En preparación", implemented: "Programa implementado" };
const translationsEs = new Map(seed.translations.filter(t => t.locale === "es").map(t => [t.projectId, t]));
const projects = seed.projects
  .filter(p => p.visibility === "published")
  .map(p => {
    const t = translationsEs.get(p.id);
    return { ...p, title: t?.title || p.title, category: t?.category || p.category, shortDescription: t?.shortDescription || p.shortDescription, bodyHtml: t?.bodyHtml || p.bodyHtml, status: statusEs[p.status] ?? p.status };
  });

// Static project files for the browser (/data/projects-xx.json): public pages read these instead of calling the API.
const statusLabels = {
  es: statusEs,
  en: { development: "In development", preparation: "In preparation", implemented: "Implemented programme" },
  ru: { development: "В разработке", preparation: "В подготовке", implemented: "Реализованная программа" },
  uk: { development: "У розробці", preparation: "У підготовці", implemented: "Реалізована програма" },
};
await fs.mkdir(path.join(outDir, "data"), { recursive: true });
for (const lang of ["es", "en", "ru", "uk"]) {
  const byProject = new Map(seed.translations.filter(t => t.locale === lang).map(t => [t.projectId, t]));
  const list = seed.projects.filter(p => p.visibility === "published").map(p => {
    const t = byProject.get(p.id);
    return { ...p, title: t?.title || p.title, category: t?.category || p.category, shortDescription: t?.shortDescription || p.shortDescription, bodyHtml: t?.bodyHtml || p.bodyHtml, status: statusLabels[lang][p.status] ?? p.status };
  });
  await fs.writeFile(path.join(outDir, "data", `projects-${lang}.json`), JSON.stringify(list));
}

// News, fundraising and settings from the Google Sheet. If it cannot be reached,
// pages are still prerendered and the browser loads this content as before.
let content;
try {
  const response = await fetch(`${SHEETS_ENDPOINT}?action=content`, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  content = { news: data.news ?? [], fundraising: data.fundraising ?? [], events: data.events ?? [], faq: data.faq ?? [], settings: data.settings ?? {} };
  console.log(`Sheet content: ${content.news.length} news items`);
} catch (error) {
  console.warn(`Sheet content not prerendered (${error.message}); it will load in the browser.`);
}

const projectBySlug = new Map(projects.map(p => [p.slug, p]));
const plainText = value => String(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const routes = [
  "/", "/mision", "/ideologia", "/proyectos", "/alianzas", "/colaborar", "/contacto", "/donar",
  "/noticias", "/identidad", "/aviso-legal", "/privacidad", "/cookies",
  ...projects.map(p => `/proyectos/${p.slug}`),
];

// 3) Keep the empty app shell for routes that are not prerendered (login, admin, 404).
const template = await fs.readFile(path.join(outDir, "index.html"), "utf8");
await fs.writeFile(path.join(outDir, "spa.html"), template);

const escapeAttr = value => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const escapeText = value => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const json = value => JSON.stringify(value).replace(/</g, "\\u003c");

/** <link rel=preload> for the first image marked fetchpriority="high" in the page. */
function heroPreload(body) {
  const img = body.match(/<img\b[^>]*fetchPriority="high"[^>]*>/i)?.[0];
  if (!img) return "";
  const attr = name => img.match(new RegExp(`\\s${name}="([^"]*)"`, "i"))?.[1];
  const src = attr("src"); const srcset = attr("srcSet"); const sizes = attr("sizes");
  if (!src) return "";
  return `  <link rel="preload" as="image" href="${src}"${srcset ? ` imagesrcset="${srcset}"` : ""}${sizes ? ` imagesizes="${sizes}"` : ""} fetchpriority="high" />\n  `;
}

/**
 * The page is already fully rendered in HTML, so the app script is started only after the first paint.
 * Phones then show text and the main photo without waiting for JavaScript (better PageSpeed / LCP).
 */
function deferAppScript(html) {
  return html.replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/, (_, src) =>
    `<script>(function(){var d=0;function go(){if(d)return;if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",go);return}d=1;var s=document.createElement("script");s.type="module";s.crossOrigin="";s.src=${JSON.stringify(src)};document.head.appendChild(s)}requestAnimationFrame(function(){setTimeout(go,0)});setTimeout(go,1500)})()</script>`);
}

let count = 0;
for (const route of routes) {
  const body = await render(route, { projects, content });
  const meta = { ...getSiteMetadata(route) };
  const project = route.startsWith("/proyectos/") ? projectBySlug.get(route.slice("/proyectos/".length)) : undefined;
  if (project) {
    meta.title = `${project.title} | INICIA Foundation`;
    meta.description = plainText(project.shortDescription).slice(0, 300);
  }
  const canonical = `https://iniciafoundation.org${route}`;
  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeText(meta.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${escapeAttr(meta.description)}" />`)
    .replace(/<meta name="robots" content="[^"]*"\s*\/?>/, `<meta name="robots" content="${escapeAttr(meta.robots)}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${escapeAttr(meta.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${escapeAttr(meta.description)}" />`)
    // Start downloading the page's hero photo right away (it is the largest element on screen).
    .replace("</head>", heroPreload(body) + "</head>")
    .replace('<div id="root"></div>', `<div id="root">${body}</div><script>window.__INICIA_PRERENDER__=${json({ projects, content: content ?? null })}</script>`);
  if (!html.includes(body)) throw new Error(`Could not inject prerendered HTML for ${route}`);
  // "/mision" -> mision.html (Netlify serves it at /mision without a trailing-slash redirect).
  const file = route === "/" ? path.join(outDir, "index.html") : path.join(outDir, `${route.slice(1)}.html`);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, deferAppScript(html));
  count += 1;
}

// Real "page not found": Netlify serves 404.html with HTTP status 404 for unknown addresses.
{
  const body = await render("/404", { projects, content });
  const meta = getSiteMetadata("/404");
  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeText(meta.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${escapeAttr(meta.description)}" />`)
    .replace(/<meta name="robots" content="[^"]*"\s*\/?>/, `<meta name="robots" content="${escapeAttr(meta.robots)}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>\s*/, "")
    .replace('<div id="root"></div>', `<div id="root">${body}</div><script>window.__INICIA_PRERENDER__=${json({ projects, content: content ?? null })}</script>`);
  if (!html.includes(body)) throw new Error("Could not inject prerendered HTML for 404");
  await fs.writeFile(path.join(outDir, "404.html"), deferAppScript(html));
}

// Sitemap with every prerendered public page (legal pages are lower priority).
const today = new Date().toISOString().slice(0, 10);
const priority = route => (route === "/" ? "1.0" : ["/aviso-legal", "/privacidad", "/cookies"].includes(route) ? "0.3" : route.startsWith("/proyectos/") ? "0.7" : "0.8");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => `  <url><loc>https://iniciafoundation.org${route}</loc><lastmod>${today}</lastmod><priority>${priority(route)}</priority></url>`).join("\n")}\n</urlset>\n`;
await fs.writeFile(path.join(outDir, "sitemap.xml"), sitemap);

await fs.rm(serverDir, { recursive: true, force: true });
console.log(`Prerendered ${count} pages into dist/public`);
