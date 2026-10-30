import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { Locale } from "./i18n";
import { DEFAULT_SETTINGS, SHEETS_ENDPOINT, SOCIAL_NETWORKS } from "./siteConfig";
import { withSiteNews } from "./siteNews";

export type NewsItem = { id: string; fecha: string; titulo: string; resumen: string; texto: string; imagen: string; enlace: string; proyecto: string; idioma: string };
export type Fundraiser = { proyecto: string; objetivo: number; recaudado: number; donantes: number; nota_es?: string; nota_en?: string; nota_ru?: string; nota_uk?: string };
export type EventItem = { fecha: string; hora: string; titulo: string; lugar: string; enlace: string; idioma: string };
export type FaqItem = { idioma: string; pregunta: string; palabras_clave: string; respuesta: string; enlace: string };
/** features: what the deployed Apps Script supports (e.g. sepa = signed SEPA mandates), so the site never offers something the backend cannot store. */
export type SiteContent = { news: NewsItem[]; fundraising: Fundraiser[]; events: EventItem[]; faq: FaqItem[]; settings: Record<string, string>; features?: { sepa?: boolean } };

const EMPTY: SiteContent = { news: [], fundraising: [], events: [], faq: [], settings: {} };

/** Public content managed in the Google Sheet (tabs Noticias, Recaudacion, Eventos). */
export function useSiteContent(endpoint = SHEETS_ENDPOINT) {
  const query = useQuery({
    queryKey: ["site-content", endpoint],
    enabled: Boolean(endpoint),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    queryFn: async (): Promise<SiteContent> => {
      const response = await fetch(`${endpoint}?action=content`);
      if (!response.ok) throw new Error(`Content ${response.status}`);
      const data = await response.json();
      return { news: data.news ?? [], fundraising: data.fundraising ?? [], events: data.events ?? [], faq: data.faq ?? [], settings: data.settings ?? {}, features: data.features ?? {} };
    },
    placeholderData: EMPTY,
  });
  // News written into the website are always shown, alongside the sheet's,
  // even while the sheet is loading or cannot be reached.
  const base = query.data ?? EMPTY;
  const data = useMemo(() => ({ ...base, news: withSiteNews(base.news) }), [base]);
  return { ...query, data };
}

/** Items in the visitor's language, or marked for all languages; falls back to Spanish. */
export function forLocale<T extends { idioma: string }>(items: T[], locale: Locale): T[] {
  const match = items.filter(item => item.idioma === locale || item.idioma === "todos" || item.idioma === "");
  if (!match.length && locale === "ast") return items.filter(item => item.idioma === "es");
  return match.length ? match : items.filter(item => item.idioma === "es");
}

export function formatDate(value: string, locale: Locale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString({ es: "es-ES", en: "en-GB", ru: "ru-RU", uk: "uk-UA", ast: "ast-ES" }[locale], { day: "numeric", month: "long", year: "numeric" });
}

/** Only http(s) links are accepted from the sheet. */
const safeUrl = (value?: string) => (value && /^https:\/\/[^\s"'<>]+$/i.test(value.trim()) ? value.trim() : "");

/** Site settings: defaults in siteConfig, overridden by the "Ajustes" tab of the Google Sheet (no republish needed). */
export function useSettings() {
  const { data } = useSiteContent();
  const s = { ...DEFAULT_SETTINGS, ...(data?.settings ?? {}) } as Record<string, string>;
  const url = (key: string) => safeUrl(s[key]);
  return {
    social: SOCIAL_NETWORKS.map(n => ({ ...n, href: url(n.key) })).filter(n => n.href),
    bizumCode: (s.pago_bizum_codigo || "").replace(/[^0-9]/g, "").slice(0, 8),
    cardLink: url("pago_tarjeta_enlace"),
    paypalLink: url("pago_paypal_enlace"),
    teamingLink: url("pago_teaming_enlace"),
    otherName: (s.pago_otro_nombre || "").slice(0, 40),
    otherLink: url("pago_otro_enlace"),
    homeVideo: youtubeId(s.video_inicio_youtube),
    ga4: /^G-[A-Z0-9]{4,}$/i.test(s.analitica_ga4 || "") ? s.analitica_ga4 : "",
    adsConversion: /^AW-[0-9]+(\/[\w-]+)?$/i.test(s.google_ads_conversion || "") ? s.google_ads_conversion : "",
    banner: (s.aviso_banner || "").slice(0, 180),
  };
}

export function youtubeId(value?: string) {
  if (!value) return "";
  const match = value.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return match ? match[1] : /^[\w-]{11}$/.test(value.trim()) ? value.trim() : "";
}
