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
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${escapeAttr(meta.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${escapeAttr(meta.description)}" />`)
    // Home: start downloading the hero photo right away (it is the largest element on screen).
    .replace("</head>", route === "/" ? '    <link rel="preload" as="image" href="/assets/photos/earth-960.webp" imagesrcset="/assets/photos/earth-960.webp 960w, /assets/photos/earth-1920.webp 1920w" imagesizes="100vw" fetchpriority="high" />\n  </head>' : "</head>")
    .replace('<div id="root"></div>', `<div id="root">${body}</div><script>window.__INICIA_PRERENDER__=${json({ projects, content: content ?? null })}</script>`);
  if (!html.includes(body)) throw new Error(`Could not inject prerendered HTML for ${route}`);
  const file = route === "/" ? path.join(outDir, "index.html") : path.join(outDir, route.slice(1), "index.html");
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html);
  count += 1;
}

await fs.rm(serverDir, { recursive: true, force: true });
console.log(`Prerendered ${count} pages into dist/public`);
