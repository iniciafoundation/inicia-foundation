import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SpiralMark } from "@/components/SpiralMark";
import { type Locale, useLocale } from "@/lib/i18n";
import { AllianceAreas, allianceCopy } from "@/components/AllianceAreas";
export { AllianceAreas, allianceCopy };

type L = Record<Locale, string>;

/**
 * Organisations INICIA works with, described in general terms that show the
 * continuity and growth of each relationship (no dates, places or one-off details).
 */
export type Partner = { name: string; url?: string; type: L; title: L; text: L };
export const partners: Partner[] = [
  {
    name: "Fundación Alimerka", url: "https://www.fundacionalimerka.es/",
    type: { es: "Alianza estable", en: "Lasting partnership", ru: "Долгосрочное партнёрство", uk: "Довгострокове партнерство", ast: "Alianza estable" },
    title: { es: "Alimentos que llegan a quien los necesita", en: "Food that reaches those in need", ru: "Продукты — тем, кому они нужны", uk: "Продукти — тим, кому вони потрібні", ast: "Alimentos que lleguen a quien los precisa" },
    text: {
      es: "Una colaboración continuada y fructífera: juntos convertimos el aprovechamiento de alimentos en un apoyo constante para las familias que acompañamos. Una alianza que crece con cada temporada.",
      en: "A continued and fruitful collaboration: together we turn food recovery into steady support for the families we work with. A partnership that grows season after season.",
      ru: "Продолжительное и плодотворное сотрудничество: вместе мы превращаем спасение продуктов в постоянную поддержку семей, которых сопровождаем. Партнёрство, которое крепнет с каждым сезоном.",
      uk: "Тривала та плідна співпраця: разом ми перетворюємо порятунок продуктів на постійну підтримку родин, яких супроводжуємо. Партнерство, що міцнішає з кожним сезоном.",
      ast: "Una collaboración continuada y fructífera: xuntos convertimos l'aprovechamientu d'alimentos n'apoyu constante pa les families qu'acompañamos. Una alianza que crez con cada temporada.",
    },
  },
  {
    name: "Cruz Roja", url: "https://www.cruzroja.es/",
    type: { es: "Colaboración profesional", en: "Professional collaboration", ru: "Профессиональное сотрудничество", uk: "Професійна співпраця", ast: "Collaboración profesional" },
    title: { es: "Experiencia al servicio de la salud y la inclusión", en: "Expertise for health and inclusion", ru: "Опыт на службе здоровья и инклюзии", uk: "Досвід на службі здоров’я та інклюзії", ast: "Esperiencia al serviciu de la salú y la inclusión" },
    text: {
      es: "Participamos junto a Cruz Roja como entidad especializada, aportando nuestro conocimiento y respaldo a iniciativas de salud, envejecimiento activo, alimentación saludable e inclusión de personas migrantes. Una relación de confianza entre profesionales del sector social.",
      en: "We have worked alongside the Red Cross as a specialised organisation, contributing our knowledge and support to initiatives on health, active ageing, healthy eating and the inclusion of migrants. A relationship of trust between social-sector professionals.",
      ru: "Мы работали вместе с Красным Крестом как профильная организация, вкладывая свои знания и поддержку в инициативы в сфере здоровья, активного долголетия, здорового питания и инклюзии мигрантов. Отношения доверия между профессионалами социальной сферы.",
      uk: "Ми працювали разом із Червоним Хрестом як профільна організація, вкладаючи свої знання та підтримку в ініціативи у сфері здоров’я, активного довголіття, здорового харчування та інклюзії мігрантів. Стосунки довіри між професіоналами соціальної сфери.",
      ast: "Participamos xunto a Cruz Roja como entidá especializada, apurriendo'l nuestru conocimientu y sofitu a iniciatives de salú, avieyamientu activu, alimentación saludable ya inclusión de persones migrantes. Una rellación de confianza ente profesionales del sector social.",
    },
  },
  {
    name: "Real Sporting · Fundación Escuela de Mareo", url: "https://www.realsporting.com/",
    type: { es: "Solidaridad deportiva", en: "Sport and solidarity", ru: "Спорт и солидарность", uk: "Спорт і солідарність", ast: "Solidaridá deportiva" },
    title: { es: "El deporte se suma a la causa", en: "Sport joins the cause", ru: "Спорт присоединяется к делу", uk: "Спорт долучається до справи", ast: "El deporte xúnese a la causa" },
    text: {
      es: "El club y su fundación se unieron a nuestras acciones solidarias con las familias ucranianas desde el primer momento, demostrando que la solidaridad mueve a toda una comunidad.",
      en: "The club and its foundation joined our solidarity actions for Ukrainian families from the very start, showing that solidarity moves a whole community.",
      ru: "Клуб и его фонд с самого начала присоединились к нашим акциям солидарности с украинскими семьями — доказав, что солидарность объединяет целое сообщество.",
      uk: "Клуб і його фонд від самого початку долучилися до наших акцій солідарності з українськими родинами — довівши, що солідарність об’єднує цілу громаду.",
      ast: "El club y la so fundación xuniéronse a les nuestres aiciones solidaries coles families ucraínes dende'l primer momentu, demostrando que la solidaridá mueve a tola comunidá.",
    },
  },
];

/** Closing card: the network keeps expanding. */
export const nextPartners: Record<Locale, { type: string; title: string; text: string }> = {
  es: { type: "Horizonte", title: "Una red que se expande", text: "Hoy tendemos puentes con instituciones, centros educativos, empresas tecnológicas y programas europeos. Cada nueva alianza abre la puerta a proyectos de mayor escala e impacto." },
  en: { type: "Horizon", title: "A network that keeps growing", text: "Today we are building bridges with public bodies, schools, tech companies and European programmes. Every new partnership opens the door to projects of greater scale and impact." },
  ru: { type: "Горизонт", title: "Сеть, которая растёт", text: "Сегодня мы выстраиваем мосты с учреждениями, учебными заведениями, технологическими компаниями и европейскими программами. Каждый новый союз открывает путь к проектам большего масштаба и влияния." },
  uk: { type: "Горизонт", title: "Мережа, що зростає", text: "Сьогодні ми будуємо мости з установами, навчальними закладами, технологічними компаніями та європейськими програмами. Кожен новий союз відкриває шлях до проєктів більшого масштабу та впливу." },
  ast: { type: "Horizonte", title: "Una rede que s'espande", text: "Güei tendemos pontes con instituciones, centros educativos, empreses teunolóxiques y programes européos. Cada nueva alianza abre la puerta a proyeutos de mayor escala ya impactu." },
};

/** Stages of INICIA's growing reach, without naming specific places. */
export const reach: Record<Locale, string[]> = {
  es: ["Comunidad", "Ciudad", "Región", "País", "Europa"],
  en: ["Community", "City", "Region", "Country", "Europe"],
  ru: ["Сообщество", "Город", "Регион", "Страна", "Европа"],
  uk: ["Громада", "Місто", "Регіон", "Країна", "Європа"],
  ast: ["Comunidá", "Ciudá", "Rexón", "País", "Europa"],
};

export default function Alliances() {
  const [locale] = useLocale();
  const t = allianceCopy[locale];
  return <main className="min-h-screen bg-[#060A12] text-[#EEE7D7]"><OriginalSiteNavigation dark />
    <section className="relative isolate overflow-hidden bg-[#060A12] bg-[#08101E] px-5 pt-28 pb-24 text-white"><img src="/assets/photos/earth-1920.webp" srcSet="/assets/photos/earth-480.webp 480w, /assets/photos/earth-720.webp 720w, /assets/photos/earth-960.webp 960w, /assets/photos/earth-1920.webp 1920w" sizes="100vw" alt="La Tierra vista desde el espacio: red de alianzas de INICIA Foundation" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#060A12] via-[#060A12]/80 to-[#060A12]/25" /><div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#060A12] to-transparent" /><SpiralMark className="pointer-events-none absolute -right-20 -top-6 -z-10 hidden h-[400px] w-[400px] opacity-40 md:block" /><div className="relative mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#D6B25E]">{t.eyebrow}</p><h1 className="mt-4 max-w-3xl font-serif text-5xl md:text-6xl">{t.title} <span className="italic text-[#F0D893]">{t.accent}</span></h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">{t.intro}</p></div></section>
    <section className="mx-auto max-w-7xl px-5 py-16"><h2 className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.areasLabel}</h2><AllianceAreas /></section>
    <section className="mx-auto max-w-7xl px-5 pb-16"><h2 className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.listLabel}</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{partners.map(p => <article key={p.name} className="flex flex-col rounded-3xl border border-[#D6B25E]/20 bg-gradient-to-br from-[#0E1729] to-[#090F1B] p-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#D6B25E]">{p.type[locale]}</p><h3 className="mt-3 font-serif text-3xl leading-tight">{p.url ? <a href={p.url} target="_blank" rel="noreferrer" className="underline decoration-[#D6B25E]/60 decoration-1 underline-offset-4 hover:decoration-[#D6B25E]">{p.name}</a> : p.name}</h3><p className="mt-3 font-semibold text-[#F0D893]">{p.title[locale]}</p><p className="mt-2 text-sm leading-6 text-slate-300">{p.text[locale]}</p></article>)}<article className="flex flex-col rounded-3xl border border-dashed border-[#D6B25E]/40 bg-[#0A1424] p-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#D6B25E]">{nextPartners[locale].type}</p><h3 className="mt-3 font-serif text-3xl leading-tight">{nextPartners[locale].title}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{nextPartners[locale].text}</p><Link href="/contacto?tipo=organizacion" className="mt-auto inline-flex items-center pt-5 text-sm font-bold text-[#F0D893]">{t.cta}<ArrowRight className="ml-2 h-4 w-4" /></Link></article></div>
      <p className="mt-5 max-w-3xl text-xs leading-5 text-slate-400">{t.note}</p>
    </section>

    <section className="mx-auto max-w-7xl px-5 pb-20"><div className="flex flex-col gap-6 rounded-3xl border border-[#D6B25E]/20 bg-[#0A1424] p-8 md:flex-row md:items-center md:justify-between"><div className="max-w-md"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.citiesLabel}</p><p className="mt-2 text-sm leading-6 text-slate-300">{t.citiesText}</p></div><div className="flex flex-wrap items-center gap-2">{reach[locale].map((stage, index) => <span key={stage} className="inline-flex items-center gap-2">{index > 0 && <ArrowRight className="h-4 w-4 text-[#D6B25E]/70" aria-hidden="true" />}<span className="rounded-full border border-[#D6B25E]/40 px-4 py-2 font-serif text-xl text-[#F0D893]" style={{ opacity: 0.55 + index * 0.11 }}>{stage}</span></span>)}</div></div></section>
    <section className="bg-[#0A1424] px-5 py-16 text-white"><div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between"><div><h2 className="font-serif text-4xl">{t.ctaTitle}</h2><p className="mt-3 max-w-2xl leading-7 text-slate-200">{t.ctaText}</p></div><Link href="/contacto?tipo=organizacion" className="inline-flex min-h-12 w-fit items-center rounded-full bg-[#D6B25E] px-6 text-sm font-bold text-[#120D05]">{t.cta} <ArrowRight className="ml-2 h-4 w-4" /></Link></div></section>
    <SiteFooter />
  </main>;
}
