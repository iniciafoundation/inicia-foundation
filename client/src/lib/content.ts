import { useQuery } from "@tanstack/react-query";
import type { Locale } from "./i18n";
import { SHEETS_ENDPOINT } from "./siteConfig";

export type NewsItem = { id: string; fecha: string; titulo: string; resumen: string; texto: string; imagen: string; enlace: string; proyecto: string; idioma: string };
export type Fundraiser = { proyecto: string; objetivo: number; recaudado: number; donantes: number; nota_es?: string; nota_en?: string; nota_ru?: string; nota_uk?: string };
export type EventItem = { fecha: string; hora: string; titulo: string; lugar: string; enlace: string; idioma: string };
export type SiteContent = { news: NewsItem[]; fundraising: Fundraiser[]; events: EventItem[] };

const EMPTY: SiteContent = { news: [], fundraising: [], events: [] };

/** Public content managed in the Google Sheet (tabs Noticias, Recaudacion, Eventos). */
export function useSiteContent(endpoint = SHEETS_ENDPOINT) {
  return useQuery({
    queryKey: ["site-content", endpoint],
    enabled: Boolean(endpoint),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    queryFn: async (): Promise<SiteContent> => {
      const response = await fetch(`${endpoint}?action=content`);
      if (!response.ok) throw new Error(`Content ${response.status}`);
      const data = await response.json();
      return { news: data.news ?? [], fundraising: data.fundraising ?? [], events: data.events ?? [] };
    },
    placeholderData: EMPTY,
  });
}

/** Items in the visitor's language, or marked for all languages; falls back to Spanish. */
export function forLocale<T extends { idioma: string }>(items: T[], locale: Locale): T[] {
  const match = items.filter(item => item.idioma === locale || item.idioma === "todos" || item.idioma === "");
  return match.length ? match : items.filter(item => item.idioma === "es");
}

export function formatDate(value: string, locale: Locale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString({ es: "es-ES", en: "en-GB", ru: "ru-RU", uk: "uk-UA" }[locale], { day: "numeric", month: "long", year: "numeric" });
}
