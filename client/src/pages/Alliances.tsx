import { Link } from "wouter";
import { ArrowRight, Building2, Cpu, GraduationCap, HeartHandshake } from "lucide-react";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SpiralMark } from "@/components/SpiralMark";
import { type Locale, useLocale } from "@/lib/i18n";

type L = Record<Locale, string>;

/**
 * How INICIA's network of collaborations has grown, told in general terms
 * (no organisation names or places). Each stage builds on the previous one.
 */
export type Milestone = { step: L; title: L; text: L };
export const milestones: Milestone[] = [
  {
    step: { es: "Origen", en: "Origin", ru: "Начало", uk: "Початок", ast: "Orixe" },
    title: { es: "Solidaridad que se contagia", en: "Solidarity that spreads", ru: "Солидарность, которая объединяет", uk: "Солідарність, що об’єднує", ast: "Solidaridá que se contaxa" },
    text: {
      es: "Las primeras campañas solidarias sumaron el apoyo de entidades deportivas, vecinales y ciudadanas. Así nació una comunidad dispuesta a acompañar a las familias que más lo necesitaban.",
      en: "Our first charity campaigns drew support from sports clubs, neighbourhood groups and citizens. That is how a community ready to stand by the families most in need was born.",
      ru: "Первые благотворительные кампании поддержали спортивные, соседские и гражданские организации. Так родилось сообщество, готовое быть рядом с семьями, которым больше всего нужна помощь.",
      uk: "Перші благодійні кампанії підтримали спортивні, сусідські та громадські організації. Так народилася спільнота, готова бути поруч із родинами, яким найбільше потрібна допомога.",
      ast: "Les primeres campañes solidaries axuntaron l'apoyu d'entidaes deportives, vecinales y ciudadanes. Asina nació una comunidá dispuesta a acompañar a les families que más lo precisaben.",
    },
  },
  {
    step: { es: "Crecimiento", en: "Growth", ru: "Рост", uk: "Зростання", ast: "Crecimientu" },
    title: { es: "Red social y de salud", en: "A social and health network", ru: "Социальная сеть и здоровье", uk: "Соціальна мережа та здоров’я", ast: "Rede social y de salú" },
    text: {
      es: "Unimos fuerzas con grandes entidades del sector social en proyectos de envejecimiento activo, salud de las familias y alimentación saludable. Cada colaboración amplió nuestro alcance y nuestra experiencia.",
      en: "We joined forces with major social-sector organisations on projects for active ageing, family health and healthy eating. Each collaboration broadened our reach and our experience.",
      ru: "Мы объединили усилия с крупными социальными организациями в проектах активного долголетия, здоровья семей и здорового питания. Каждое сотрудничество расширяло наш охват и опыт.",
      uk: "Ми об’єднали зусилля з великими соціальними організаціями в проєктах активного довголіття, здоров’я родин і здорового харчування. Кожна співпраця розширювала наш охоплення та досвід.",
      ast: "Xunimos fuercies con grandes entidaes del sector social en proyeutos d'avieyamientu activu, salú de les families y alimentación saludable. Cada collaboración amplió el nuestru algame y la nuestra esperiencia.",
    },
  },
  {
    step: { es: "Consolidación", en: "Consolidation", ru: "Укрепление", uk: "Зміцнення", ast: "Consolidación" },
    title: { es: "Alianzas estables", en: "Lasting partnerships", ru: "Долгосрочные альянсы", uk: "Довгострокові альянси", ast: "Alianzes estables" },
    text: {
      es: "Firmamos convenios con el sector empresarial que convierten los excedentes de alimentos en apoyo continuo para las familias. La colaboración puntual se transforma en compromiso duradero.",
      en: "We signed agreements with businesses that turn surplus food into ongoing support for families. One-off help is becoming a lasting commitment.",
      ru: "Мы заключили соглашения с бизнесом, благодаря которым излишки продуктов превращаются в постоянную поддержку семей. Разовая помощь становится долгосрочным обязательством.",
      uk: "Ми уклали угоди з бізнесом, завдяки яким надлишки продуктів перетворюються на постійну підтримку родин. Разова допомога стає довгостроковим зобов’язанням.",
      ast: "Roblamos convenios col sector empresarial que convierten los escedentes d'alimentos n'apoyu continuu pa les families. La collaboración puntual tresfórmase en compromisu duraderu.",
    },
  },
  {
    step: { es: "Horizonte", en: "Horizon", ru: "Горизонт", uk: "Горизонт", ast: "Horizonte" },
    title: { es: "Una red que se expande", en: "A network that keeps growing", ru: "Сеть, которая растёт", uk: "Мережа, що зростає", ast: "Una rede que s'espande" },
    text: {
      es: "Hoy tendemos puentes con instituciones, centros educativos, empresas tecnológicas y programas europeos. Cada nueva alianza abre la puerta a proyectos de mayor escala e impacto.",
      en: "Today we are building bridges with public bodies, schools, tech companies and European programmes. Every new partnership opens the door to projects of greater scale and impact.",
      ru: "Сегодня мы выстраиваем мосты с учреждениями, учебными заведениями, технологическими компаниями и европейскими программами. Каждый новый союз открывает путь к проектам большего масштаба и влияния.",
      uk: "Сьогодні ми будуємо мости з установами, навчальними закладами, технологічними компаніями та європейськими програмами. Кожен новий союз відкриває шлях до проєктів більшого масштабу та впливу.",
      ast: "Güei tendemos pontes con instituciones, centros educativos, empreses teunolóxiques y programes européos. Cada nueva alianza abre la puerta a proyeutos de mayor escala ya impactu.",
    },
  },
];

/** Stages of INICIA's growing reach, without naming specific places. */
export const reach: Record<Locale, string[]> = {
  es: ["Comunidad", "Ciudad", "Región", "País", "Europa"],
  en: ["Community", "City", "Region", "Country", "Europe"],
  ru: ["Сообщество", "Город", "Регион", "Страна", "Европа"],
  uk: ["Громада", "Місто", "Регіон", "Країна", "Європа"],
  ast: ["Comunidá", "Ciudá", "Rexón", "País", "Europa"],
};

const ICONS = [Building2, HeartHandshake, GraduationCap, Cpu];

export const allianceCopy: Record<Locale, { eyebrow: string; title: string; accent: string; intro: string; areasLabel: string; areas: [string, string][]; listLabel: string; empty: string; note: string; citiesLabel: string; citiesText: string; ctaTitle: string; ctaText: string; cta: string; homeIntro: string; homeCta: string }> = {
  es: { note: "Cada etapa se apoya en la anterior: lo que empezó como solidaridad cercana es hoy una red de colaboración en crecimiento.", citiesLabel: "Un alcance que crece", citiesText: "Nacimos de la acción local y avanzamos paso a paso: de la comunidad más cercana a una red que conecta ciudades, territorios rurales y cooperación europea.", eyebrow: "Alianzas", title: "Con quién", accent: "trabajamos.", intro: "Nuestro trabajo es posible gracias a la colaboración con instituciones, entidades sociales, centros educativos y empresas que comparten el compromiso con la inclusión y el desarrollo comunitario.", areasLabel: "Ámbitos de colaboración", areas: [["Instituciones públicas", "Administraciones y servicios públicos con los que coordinamos programas de inclusión, formación y empleo."], ["Entidades sociales", "Asociaciones, fundaciones y redes con las que compartimos acompañamiento a familias y voluntariado."], ["Educación e investigación", "Universidades, centros de formación y proyectos europeos de juventud y aprendizaje."], ["Empresas y tecnología", "Empresas y equipos tecnológicos que aportan conocimiento, herramientas e inclusión digital."]], listLabel: "Una red que crece", empty: "Publicaremos aquí las entidades con las que hemos colaborado, siempre con su autorización.", ctaTitle: "¿Colaboramos?", ctaText: "Si tu organización quiere sumar esfuerzos en inclusión, formación, desarrollo rural o innovación social, escríbenos.", cta: "Proponer una colaboración", homeIntro: "Colaboramos con instituciones, entidades sociales, centros educativos y empresas que comparten el compromiso con la inclusión y el desarrollo comunitario.", homeCta: "Ver alianzas" },
  en: { note: "Each stage builds on the last: what began as neighbourly solidarity is now a growing network of collaboration.", citiesLabel: "A growing reach", citiesText: "We were born from local action and keep moving forward step by step: from the closest community to a network linking cities, rural areas and European cooperation.", eyebrow: "Partners", title: "Who we", accent: "work with.", intro: "Our work is possible thanks to collaboration with public bodies, social organisations, schools and companies that share our commitment to inclusion and community development.", areasLabel: "Areas of collaboration", areas: [["Public bodies", "Public administrations and services we coordinate inclusion, training and employment programmes with."], ["Social organisations", "Associations, foundations and networks we share family support and volunteering with."], ["Education and research", "Universities, training centres and European youth and learning projects."], ["Companies and technology", "Companies and tech teams that contribute knowledge, tools and digital inclusion."]], listLabel: "A growing network", empty: "We will list the organisations we have worked with here, always with their permission.", ctaTitle: "Shall we work together?", ctaText: "If your organisation wants to join forces on inclusion, training, rural development or social innovation, write to us.", cta: "Propose a collaboration", homeIntro: "We work with public bodies, social organisations, schools and companies that share our commitment to inclusion and community development.", homeCta: "See partners" },
  ru: { note: "Каждый этап опирается на предыдущий: то, что начиналось как соседская солидарность, сегодня — растущая сеть сотрудничества.", citiesLabel: "Растущий охват", citiesText: "Мы выросли из местной инициативы и движемся шаг за шагом: от ближайшего сообщества к сети, объединяющей города, сельские территории и европейское сотрудничество.", eyebrow: "Партнёры", title: "С кем мы", accent: "работаем.", intro: "Наша работа возможна благодаря сотрудничеству с государственными учреждениями, социальными организациями, учебными заведениями и компаниями, которые разделяют наши ценности инклюзии и развития сообществ.", areasLabel: "Направления сотрудничества", areas: [["Государственные учреждения", "Органы власти и государственные службы, с которыми мы координируем программы инклюзии, обучения и занятости."], ["Социальные организации", "Ассоциации, фонды и сети, с которыми мы вместе поддерживаем семьи и развиваем волонтёрство."], ["Образование и исследования", "Университеты, учебные центры и европейские молодёжные и образовательные проекты."], ["Компании и технологии", "Компании и технологические команды, которые делятся знаниями, инструментами и помогают с цифровой инклюзией."]], listLabel: "Сеть, которая растёт", empty: "Здесь появятся организации, с которыми мы сотрудничали, — только с их согласия.", ctaTitle: "Сотрудничаем?", ctaText: "Если ваша организация хочет объединить усилия в инклюзии, обучении, развитии сельских территорий или социальных инновациях — напишите нам.", cta: "Предложить сотрудничество", homeIntro: "Мы сотрудничаем с госучреждениями, социальными организациями, учебными заведениями и компаниями, которые разделяют наши ценности.", homeCta: "Все партнёры" },
  uk: { note: "Кожен етап спирається на попередній: те, що починалося як сусідська солідарність, сьогодні — мережа співпраці, що зростає.", citiesLabel: "Охоплення, що зростає", citiesText: "Ми виросли з місцевої ініціативи та рухаємося крок за кроком: від найближчої громади до мережі, що об’єднує міста, сільські території та європейську співпрацю.", eyebrow: "Партнери", title: "З ким ми", accent: "працюємо.", intro: "Наша робота можлива завдяки співпраці з державними установами, соціальними організаціями, навчальними закладами та компаніями, які поділяють наші цінності інклюзії та розвитку громад.", areasLabel: "Напрями співпраці", areas: [["Державні установи", "Органи влади та державні служби, з якими ми координуємо програми інклюзії, навчання та зайнятості."], ["Соціальні організації", "Асоціації, фонди та мережі, з якими ми разом підтримуємо родини та розвиваємо волонтерство."], ["Освіта та дослідження", "Університети, навчальні центри та європейські молодіжні й освітні проєкти."], ["Компанії та технології", "Компанії та технологічні команди, які діляться знаннями, інструментами та допомагають із цифровою інклюзією."]], listLabel: "Мережа, що зростає", empty: "Тут з’являться організації, з якими ми співпрацювали, — лише з їхньої згоди.", ctaTitle: "Співпрацюємо?", ctaText: "Якщо ваша організація хоче об’єднати зусилля в інклюзії, навчанні, розвитку сільських територій або соціальних інноваціях — напишіть нам.", cta: "Запропонувати співпрацю", homeIntro: "Ми співпрацюємо з держустановами, соціальними організаціями, навчальними закладами та компаніями, які поділяють наші цінності.", homeCta: "Усі партнери" },
  ast: { note: "Cada etapa sofítase na anterior: lo qu'empezó como solidaridá cercana ye güei una rede de collaboración en crecimientu.", citiesLabel: "Un algame que crez", citiesText: "Nacimos de l'aición llocal y avanzamos pasu ente pasu: de la comunidá más cercana a una rede que coneuta ciudaes, territorios rurales y cooperación europea.", eyebrow: "Alianzes", title: "Con quién", accent: "trabayamos.", intro: "El nuestru trabayu ye posible gracies a la collaboración con instituciones, entidaes sociales, centros educativos y empreses que comparten el compromisu cola inclusión y el desendolcu comunitariu.", areasLabel: "Ámbitos de collaboración", areas: [["Instituciones públiques", "Alministraciones y servicios públicos colos que coordinamos programes d'inclusión, formación y empleu."], ["Entidaes sociales", "Asociaciones, fundaciones y redes coles que compartimos l'acompañamientu a families y el voluntariáu."], ["Educación ya investigación", "Universidaes, centros de formación y proyeutos europeos de mocedá y aprendizaxe."], ["Empreses y teunoloxía", "Empreses y equipos teunolóxicos qu'apurren conocimientu, ferramientes ya inclusión dixital."]], listLabel: "Una rede que crez", empty: "Equí espublizaremos les entidaes coles que collaboramos, siempre cola so autorización.", ctaTitle: "¿Collaboramos?", ctaText: "Si la to organización quier xunir esfuerzos n'inclusión, formación, desendolcu rural o innovación social, escríbinos.", cta: "Proponer una collaboración", homeIntro: "Collaboramos con instituciones, entidaes sociales, centros educativos y empreses que comparten el compromisu cola inclusión y el desendolcu comunitariu.", homeCta: "Ver alianzes" },
};

export function AllianceAreas({ compact = false }: { compact?: boolean }) {
  const [locale] = useLocale();
  const t = allianceCopy[locale];
  return <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-4 ${compact ? "" : "mt-6"}`}>{t.areas.map(([title, text], index) => { const Icon = ICONS[index]; return <article key={title} className="rounded-3xl border border-[#D6B25E]/20 bg-[#0C1320] p-7 shadow-sm"><Icon className="h-7 w-7 text-[#D6B25E]" /><h3 className="mt-4 font-serif text-2xl">{title}</h3>{!compact && <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>}</article>; })}</div>;
}

export default function Alliances() {
  const [locale] = useLocale();
  const t = allianceCopy[locale];
  return <main className="min-h-screen bg-[#060A12] text-[#EEE7D7]"><OriginalSiteNavigation dark />
    <section className="relative isolate overflow-hidden bg-[#060A12] bg-[#08101E] px-5 pt-28 pb-24 text-white"><img src="/assets/photos/team-1920.webp" srcSet="/assets/photos/team-960.webp 960w, /assets/photos/team-1920.webp 1920w" sizes="100vw" alt="" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#060A12] via-[#060A12]/80 to-[#060A12]/25" /><div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#060A12] to-transparent" /><SpiralMark className="pointer-events-none absolute -right-20 -top-6 -z-10 hidden h-[400px] w-[400px] opacity-40 md:block" /><div className="relative mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#D6B25E]">{t.eyebrow}</p><h1 className="mt-4 max-w-3xl font-serif text-5xl md:text-6xl">{t.title} <span className="italic text-[#F0D893]">{t.accent}</span></h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">{t.intro}</p></div></section>
    <section className="mx-auto max-w-7xl px-5 py-16"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.areasLabel}</p><AllianceAreas /></section>
    <section className="mx-auto max-w-7xl px-5 pb-16"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.listLabel}</p>
      <ol className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{milestones.map((m, index) => <li key={m.step.es} className="relative flex flex-col rounded-3xl border border-[#D6B25E]/20 bg-gradient-to-br from-[#0E1729] to-[#090F1B] p-7"><p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[.16em] text-[#D6B25E]"><span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#D6B25E]/50 font-serif text-base normal-case tracking-normal text-[#F0D893]">{index + 1}</span>{m.step[locale]}</p><h2 className="mt-4 font-serif text-3xl leading-tight">{m.title[locale]}</h2><p className="mt-3 text-sm leading-6 text-slate-300">{m.text[locale]}</p></li>)}</ol>
      <p className="mt-5 max-w-3xl text-xs leading-5 text-slate-400">{t.note}</p>
    </section>

    <section className="mx-auto max-w-7xl px-5 pb-20"><div className="flex flex-col gap-6 rounded-3xl border border-[#D6B25E]/20 bg-[#0A1424] p-8 md:flex-row md:items-center md:justify-between"><div className="max-w-md"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.citiesLabel}</p><p className="mt-2 text-sm leading-6 text-slate-300">{t.citiesText}</p></div><div className="flex flex-wrap items-center gap-2">{reach[locale].map((stage, index) => <span key={stage} className="inline-flex items-center gap-2">{index > 0 && <ArrowRight className="h-4 w-4 text-[#D6B25E]/70" aria-hidden="true" />}<span className="rounded-full border border-[#D6B25E]/40 px-4 py-2 font-serif text-xl text-[#F0D893]" style={{ opacity: 0.55 + index * 0.11 }}>{stage}</span></span>)}</div></div></section>
    <section className="bg-[#0A1424] px-5 py-16 text-white"><div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between"><div><h2 className="font-serif text-4xl">{t.ctaTitle}</h2><p className="mt-3 max-w-2xl leading-7 text-slate-200">{t.ctaText}</p></div><Link href="/contacto?tipo=organizacion" className="inline-flex min-h-12 w-fit items-center rounded-full bg-[#D6B25E] px-6 text-sm font-bold text-[#120D05]">{t.cta} <ArrowRight className="ml-2 h-4 w-4" /></Link></div></section>
    <SiteFooter />
  </main>;
}
