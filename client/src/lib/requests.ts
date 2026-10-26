import { SHEETS_ENDPOINT } from "./siteConfig";

export type RequestType = "ayuda" | "voluntariado" | "organizacion" | "donar" | "otro";
export const REQUEST_TYPES: RequestType[] = ["ayuda", "voluntariado", "organizacion", "donar", "otro"];
export const isRequestType = (value: unknown): value is RequestType => typeof value === "string" && (REQUEST_TYPES as string[]).includes(value);

export type RequestPayload = Record<string, string | string[] | boolean | number | undefined>;

export function makeReference(date = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `INI-${String(date.getFullYear()).slice(2)}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${random}`;
}

/** Flatten arrays/booleans so every backend receives plain text values. */
export function flatten(payload: RequestPayload): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === "") continue;
    out[key] = Array.isArray(value) ? value.join(", ") : typeof value === "boolean" ? (value ? "sí" : "no") : String(value);
  }
  return out;
}

/** Sends a request to the foundation's Google Sheet. Throws if the sheet does not confirm it,
 * so the form can offer the "send by e-mail" fallback instead. */
export async function sendRequest(payload: RequestPayload, endpoint = SHEETS_ENDPOINT): Promise<void> {
  if (!endpoint) throw new Error("No endpoint configured");
  // text/plain avoids a CORS preflight, which Apps Script web apps do not answer.
  const response = await fetch(endpoint, { method: "POST", body: JSON.stringify(flatten(payload)), headers: { "Content-Type": "text/plain;charset=utf-8" } });
  const result = await response.json(); // an HTML error page (script not deployed correctly) throws here
  if (!response.ok || !result || result.ok !== true) throw new Error(result?.error || `Request failed: ${response.status}`);
}
