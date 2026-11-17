/**
 * Helpers for donations to a specific project, sharing and the personal "Tu ola" link.
 *
 * Privacy: the "ola" code of a visitor who arrives through someone's link is kept only in memory
 * (never written to the device). A person's own code is stored in localStorage only after they
 * press "Crear mi enlace", because they asked for it.
 */

export const SITE_URL = "https://iniciafoundation.org";

/** Bank reference for a donation to one project. Spanish banks usually accept 35 characters. */
export function donationReference(projectTitle?: string) {
  return (projectTitle ? `Donativo ${projectTitle}` : "Donativo").slice(0, 35).trim();
}

/** Stripe Payment Links accept ?client_reference_id=…, which then appears on each payment in Stripe:
 * that is how a card donation is assigned to a project without a separate link per project. */
export function cardLinkFor(link: string, projectSlug?: string) {
  if (!link || !projectSlug) return link;
  try {
    const url = new URL(link);
    if (!/(^|\.)stripe\.com$/.test(url.hostname)) return link;
    url.searchParams.set("client_reference_id", projectSlug.replace(/[^a-z0-9-]/gi, "").slice(0, 200));
    return url.toString();
  } catch {
    return link;
  }
}

/* ---------- Tu ola: personal share link ---------- */

const OLA_PATTERN = /^[a-z0-9]{8}$/;
const OLA_KEY = "inicia-ola";
export const isOlaCode = (value: unknown): value is string => typeof value === "string" && OLA_PATTERN.test(value);

let arrivedWith: string | undefined;
let pinged = false;

/** Code of the link this visitor arrived with (memory only, for this visit). */
export function arrivalOla() {
  if (arrivedWith === undefined && typeof window !== "undefined") {
    const ref = new URLSearchParams(window.location.search).get("ref")?.toLowerCase();
    arrivedWith = isOlaCode(ref) ? ref : "";
  }
  return arrivedWith || undefined;
}

/** Counts one visit for the link the visitor arrived with (once per page load). No personal data is sent. */
export function countArrival(endpoint: string) {
  const code = arrivalOla();
  if (!code || pinged || !endpoint || typeof fetch === "undefined") return;
  pinged = true;
  fetch(`${endpoint}?action=visita&ref=${code}`, { method: "GET", keepalive: true }).catch(() => undefined);
}

export function newOlaCode() {
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
  const bytes = new Uint8Array(8);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  return Array.from(bytes, byte => alphabet[byte % alphabet.length]).join("");
}

export function readMyOla() {
  try { const value = window.localStorage.getItem(OLA_KEY); return isOlaCode(value) ? value : undefined; } catch { return undefined; }
}

export function saveMyOla(code: string) {
  try { window.localStorage.setItem(OLA_KEY, code); } catch { /* storage unavailable: the link still works this time */ }
}

export const olaLink = (code: string, path = "/") => `${SITE_URL}${path}?ref=${code}`;

/* ---------- Sharing ---------- */

export type ShareTarget = "whatsapp" | "telegram" | "facebook" | "x" | "linkedin" | "email";

/** Plain share links: no third-party widgets, so no cookies and nothing extra to load. */
export function shareUrl(target: ShareTarget, url: string, text: string) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  switch (target) {
    case "whatsapp": return `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
    case "telegram": return `https://t.me/share/url?url=${u}&text=${t}`;
    case "facebook": return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
    case "x": return `https://x.com/intent/post?url=${u}&text=${t}`;
    case "linkedin": return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
    case "email": return `mailto:?subject=${encodeURIComponent("Inicia Foundation")}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
  }
}

export const DEFAULT_SHARE_TEXT = "Conoce Inicia Foundation: acompañan a personas y familias en Asturias desde la ayuda urgente hasta un trabajo propio. Puedes ayudar, aprender o enseñar 👉";
export const projectShareText = (title: string) => `Mira este proyecto de Inicia Foundation en Asturias: «${title}». Puedes apoyarlo o participar 👉`;
