import { useEffect } from "react";
import { useLocation } from "wouter";
import { getSiteMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n";

const publicOrigin = "https://iniciafoundation.org";

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element!.setAttribute(key, value));
}

function upsertCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = href;
}

export function SiteMetadata() {
  const [pathname] = useLocation();

  useEffect(() => {
    const metadata = getSiteMetadata(pathname);
    const canonical = `${publicOrigin}${pathname === "/" ? "/" : pathname.replace(/\/$/, "")}`;
    // A prerendered page already carries its exact title and description
    // (e.g. each project's own name), so keep them on the first load.
    const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (existing?.getAttribute("href") === canonical && pathname.startsWith("/proyectos/")) {
      document.documentElement.lang = getLocale();
      return;
    }
    document.title = metadata.title;
    document.documentElement.lang = getLocale();
    upsertMeta('meta[name="description"]', { name: "description", content: metadata.description });
    upsertMeta('meta[name="robots"]', { name: "robots", content: metadata.robots });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: metadata.title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: metadata.description });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: brand });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    upsertCanonical(canonical);
  }, [pathname]);

  return null;
}

const brand = "INICIA Foundation";
