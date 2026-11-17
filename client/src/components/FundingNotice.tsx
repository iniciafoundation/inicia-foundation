import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";

/**
 * Projects financed by a public body must show the funder's logo and legend on every page about them
 * (e.g. FMCEYUP Gijón/Xixón: logo + «Actividad subvencionada por…»). Keyed by project slug.
 */
type Funding = { logo: { es: string; ast: string }; logoAlt: string; legend: Record<Locale, string>; signup?: string };

const FMCEYUP_LEGEND_ES = "Actividad subvencionada por la Fundación Municipal de Cultura, Educación y Universidad Popular del Ayuntamiento de Gijón/Xixón";

export const FUNDED_PROJECTS: Record<string, Funding> = {
  "reutiliza-y-forma": {
    logo: { es: "/assets/partners/gijon-juventud", ast: "/assets/partners/xixon-juventud" },
    logoAlt: "Ayuntamiento de Gijón/Xixón — Juventud",
    legend: {
      es: FMCEYUP_LEGEND_ES,
      en: FMCEYUP_LEGEND_ES,
      ru: FMCEYUP_LEGEND_ES,
      uk: FMCEYUP_LEGEND_ES,
      ast: "Actividá subvencionada pola Fundación Municipal de Cultura, Educación y Universidá Popular del Ayuntamientu de Xixón",
    },
    signup: "https://docs.google.com/forms/d/e/1FAIpQLSeQ6huzd4WSB_1RW6XD3lszU84JuPCafGdF-Wd4doCsEgWuZw/viewform",
  },
};

const signupLabel: Record<Locale, string> = { es: "Inscríbete gratis", en: "Sign up for free", ru: "Записаться бесплатно", uk: "Записатися безкоштовно", ast: "Apúntate de baldre" };
const supportedBy: Record<Locale, string> = { es: "Con el apoyo de", en: "Supported by", ru: "При поддержке", uk: "За підтримки", ast: "Col sofitu de" };

export function FundingNotice({ slug, locale, compact = false }: { slug: string; locale: Locale; compact?: boolean }) {
  const funding = FUNDED_PROJECTS[slug];
  if (!funding) return null;
  const base = locale === "ast" ? funding.logo.ast : funding.logo.es;
  return <aside className={`flex flex-col gap-4 rounded-3xl bg-white p-5 text-[#1B2433] shadow-sm sm:flex-row sm:items-center sm:justify-between ${compact ? "" : "sm:p-6"}`}>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="shrink-0"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">{supportedBy[locale]}</p><img src={`${base}-480.webp`} srcSet={`${base}-480.webp 480w, ${base}-960.webp 960w`} sizes="240px" width={240} height={51} alt={funding.logoAlt} className="mt-2 h-auto w-[200px] sm:w-[240px]" /></div>
      <p className="text-sm font-semibold leading-6 sm:border-l sm:border-slate-200 sm:pl-5">{funding.legend[locale]}.</p>
    </div>
    {funding.signup && !compact && <a href={funding.signup} target="_blank" rel="noreferrer" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0B1E3A] px-6 text-sm font-bold text-white">{signupLabel[locale]}<ArrowUpRight className="h-4 w-4" /></a>}
  </aside>;
}
