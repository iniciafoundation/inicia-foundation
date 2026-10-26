import { useSyncExternalStore } from "react";

export type Locale = "es" | "en" | "ru" | "uk" | "ast";
export const LOCALES: Locale[] = ["es", "en", "ru", "uk", "ast"];
/** Project texts come from the catalog, which has no Asturian yet: Asturian falls back to Spanish there. */
export const contentLocale = (locale: Locale): "es" | "en" | "ru" | "uk" => (locale === "ast" ? "es" : locale);
const KEY = "inicia-lang";

const isLocale = (value: unknown): value is Locale => typeof value === "string" && (LOCALES as string[]).includes(value);

function initial(): Locale {
  if (typeof window === "undefined") return "es";
  const fromUrl = new URLSearchParams(window.location.search).get("lang");
  if (isLocale(fromUrl)) return fromUrl;
  try {
    const stored = window.localStorage.getItem(KEY);
    if (isLocale(stored)) return stored;
  } catch { /* storage unavailable */ }
  return "es";
}

let current: Locale = initial();
const listeners = new Set<() => void>();
if (typeof document !== "undefined") document.documentElement.lang = current;

export function setLocale(next: Locale) {
  if (next === current) return;
  current = next;
  try { window.localStorage.setItem(KEY, next); } catch { /* ignore */ }
  document.documentElement.lang = next;
  listeners.forEach(listener => listener());
}

export function getLocale() { return current; }

export function useLocale(): [Locale, (next: Locale) => void] {
  const locale = useSyncExternalStore(
    listener => { listeners.add(listener); return () => listeners.delete(listener); },
    () => current,
    () => "es" as Locale,
  );
  return [locale, setLocale];
}

/** Pick the string for the active locale from a {es,en,ru,uk} record. */
export function useT<T>(dict: Record<Locale, T>): T {
  const [locale] = useLocale();
  return dict[locale];
}
