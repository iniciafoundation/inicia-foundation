import type { Express } from "express";

/**
 * Maps only public legacy paths whose destination changes in the new portal.
 * The map is applied at the HTTP layer before Vite/static SPA fallback so
 * crawlers and visitors receive a genuine permanent redirect.
 */
export const LEGACY_ROUTE_REDIRECTS: Record<string, string> = {
  "/quienes-somos": "/#quienes-somos",
  "/proyectos/coopastur": "/proyectos/coopastur-agrosocial",
  "/presentation/conecta.html": "/proyectos/conecta-asturias",
  "/presentation/coopastur.html": "/proyectos/coopastur-agrosocial",
  "/presentation/nucleo.html": "/proyectos/reutiliza-y-forma",
};

export const LEGACY_UNAVAILABLE_LEGAL_PATHS = new Set([
  "/legal/aviso-legal.html",
  "/legal/privacidad.html",
  "/legal/cookies.html",
]);

export const LEGACY_UNAVAILABLE_ARCHIVE_PATHS = new Set([
  "/index_congreso.html",
  "/presentation/index.html",
  "/presentation/index copia.html",
  "/presentation/index%20copia.html",
]);

const TRAILING_SLASH_CANONICAL_PATHS = new Set([
  "/proyectos",
  "/galeria",
  "/colaborar",
  "/contacto",
  "/ideologia",
  "/proyectos/conecta-asturias",
  "/proyectos/nucleo",
  "/proyectos/rural-futures",
]);

export function getLegacyRedirectTarget(pathname: string): string | undefined {
  const canonicalPath =
    pathname === "/" ? "/" : pathname.replace(/\/+$/, "");

  if (
    pathname !== canonicalPath &&
    TRAILING_SLASH_CANONICAL_PATHS.has(canonicalPath)
  ) {
    return canonicalPath;
  }

  return LEGACY_ROUTE_REDIRECTS[canonicalPath];
}

export function isLegacyUnavailableLegalPath(pathname: string) {
  return LEGACY_UNAVAILABLE_LEGAL_PATHS.has(pathname);
}

export function isLegacyUnavailableArchivePath(pathname: string) {
  return LEGACY_UNAVAILABLE_ARCHIVE_PATHS.has(pathname);
}

export function registerLegacyRedirects(app: Express) {
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }

    if (isLegacyUnavailableLegalPath(req.path)) {
      res
        .status(410)
        .type("html")
        .send("<!doctype html><html lang=\"es\"><head><meta charset=\"utf-8\"><title>Documento no publicado</title></head><body><main><h1>Documento no publicado</h1><p>Este documento no está publicado actualmente. Para información de identidad y contacto de INICIA Foundation, visita <a href=\"/identidad\">la página de identidad</a>.</p></main></body></html>");
      return;
    }

    if (isLegacyUnavailableArchivePath(req.path)) {
      res
        .status(410)
        .type("html")
        .send("<!doctype html><html lang=\"es\"><head><meta charset=\"utf-8\"><title>Página no publicada</title></head><body><main><h1>Página no publicada</h1><p>Esta página no se publica actualmente en el nuevo sitio. Puedes consultar las iniciativas vigentes en <a href=\"/proyectos\">el catálogo de proyectos</a>.</p></main></body></html>");
      return;
    }

    const destination = getLegacyRedirectTarget(req.path);
    if (!destination) {
      next();
      return;
    }

    res.redirect(308, destination);
  });
}
