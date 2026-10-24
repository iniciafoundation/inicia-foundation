const body = "<!doctype html><html lang=\"es\"><head><meta charset=\"utf-8\"><title>Documento no publicado</title></head><body><main><h1>Documento no publicado</h1><p>Este documento no está publicado actualmente. Para información de identidad y contacto de INICIA Foundation, visita <a href=\"/identidad\">la página de identidad</a>.</p></main></body></html>";

export default async () => new Response(body, { status: 410, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });

export const config = { path: "/legal/*" };
