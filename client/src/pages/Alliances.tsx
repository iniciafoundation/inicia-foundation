import { Link } from "wouter";
import { ArrowRight, Building2, Cpu, GraduationCap, HeartHandshake } from "lucide-react";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SpiralMark } from "@/components/SpiralMark";
import { type Locale, useLocale } from "@/lib/i18n";

/**
 * Organisations INICIA Foundation has worked with.
 * Add one only with its permission to appear on the website.
 * Example: { name: "Entity name", type: "Institución pública", work: "What we did together", year: "2025", url: "https://..." }
 */
type L = Record<Locale, string>;
type Partner = { name: string; type: L; work: L; year: string; url?: string };
/** Organisations INICIA has actually worked with (verified in the foundation's records). Facts only, no logos. */
export const partners: Partner[] = [
  {
    name: "Fundación Alimerka", year: "2026", url: "https://www.fundacionalimerka.es/",
    type: { es: "Fundación empresarial", en: "Corporate foundation", ru: "Корпоративный фонд", uk: "Корпоративний фонд" },
    work: {
      es: "Convenio del programa «Alimentos sin desperdicio»: desde febrero de 2026 recogemos excedentes de alimentos en supermercados Alimerka de Grado y Salas para las familias que acompañamos.",
      en: "“Alimentos sin desperdicio” (food without waste) agreement: since February 2026 we collect surplus food at Alimerka supermarkets in Grado and Salas for the families we support.",
      ru: "Соглашение по программе «Alimentos sin desperdicio» («Еда без отходов»): с февраля 2026 года мы забираем излишки продуктов в супермаркетах Alimerka в Градо и Салас для семей, которых сопровождаем.",
      uk: "Угода за програмою «Alimentos sin desperdicio» («Їжа без відходів»): з лютого 2026 року ми забираємо надлишки продуктів у супермаркетах Alimerka в Градо і Салас для родин, яких супроводжуємо.",
    },
  },
  {
    name: "Cruz Roja Asturias", year: "2023",
    type: { es: "Entidad social", en: "Social organisation", ru: "Социальная организация", uk: "Соціальна організація" },
    work: {
      es: "INICIA respaldó con cartas de aval cuatro proyectos de salud de Cruz Roja Asturias: envejecimiento activo, prevención de la fragilidad en personas mayores, salud de mujeres monomarentales y alimentación saludable en población migrante.",
      en: "INICIA supported four Cruz Roja Asturias health projects with letters of endorsement: active ageing, frailty prevention in older people, health of single mothers and healthy eating among migrants.",
      ru: "INICIA поддержала письмами-рекомендациями четыре проекта Красного Креста Астурии в сфере здоровья: активное долголетие, профилактика хрупкости у пожилых, здоровье матерей-одиночек и здоровое питание мигрантов.",
      uk: "INICIA підтримала рекомендаційними листами чотири проєкти Червоного Хреста Астурії у сфері здоров’я: активне довголіття, профілактика крихкості в літніх людей, здоров’я матерів-одиначок і здорове харчування мігрантів.",
    },
  },
  {
    name: "Fundación Escuela de Mareo – Real Sporting de Gijón", year: "2022",
    type: { es: "Fundación deportiva", en: "Sports foundation", ru: "Спортивный фонд", uk: "Спортивний фонд" },
    work: {
      es: "Donó una camiseta firmada por la primera plantilla para un sorteo solidario de INICIA a favor de familias ucranianas.",
      en: "Donated a shirt signed by the first team for an INICIA charity raffle in support of Ukrainian families.",
      ru: "Передал футболку с автографами основного состава для благотворительного розыгрыша INICIA в поддержку украинских семей.",
      uk: "Передав футболку з автографами основного складу для благодійного розіграшу INICIA на підтримку українських родин.",
    },
  },
];

/** Cities where INICIA works. */
export const cities = ["Gijón", "Avilés", "Oviedo"];

const ICONS = [Building2, HeartHandshake, GraduationCap, Cpu];

export const allianceCopy: Record<Locale, { eyebrow: string; title: string; accent: string; intro: string; areasLabel: string; areas: [string, string][]; listLabel: string; empty: string; note: string; citiesLabel: string; citiesText: string; ctaTitle: string; ctaText: string; cta: string; homeIntro: string; homeCta: string }> = {
  es: { note: "Colaboraciones concretas, puntuales o en curso. Mencionarlas no implica que estas entidades patrocinen ni respalden el conjunto de actividades de INICIA.", citiesLabel: "Dónde trabajamos", citiesText: "Asturias, España", eyebrow: "Alianzas", title: "Con quién", accent: "trabajamos.", intro: "Nuestro trabajo es posible gracias a la colaboración con instituciones, entidades sociales, centros educativos y empresas que comparten el compromiso con la inclusión y el desarrollo comunitario.", areasLabel: "Ámbitos de colaboración", areas: [["Instituciones públicas", "Administraciones y servicios públicos con los que coordinamos programas de inclusión, formación y empleo."], ["Entidades sociales", "Asociaciones, fundaciones y redes con las que compartimos acompañamiento a familias y voluntariado."], ["Educación e investigación", "Universidades, centros de formación y proyectos europeos de juventud y aprendizaje."], ["Empresas y tecnología", "Empresas y equipos tecnológicos que aportan conocimiento, herramientas e inclusión digital."]], listLabel: "Entidades con las que hemos colaborado", empty: "Publicaremos aquí las entidades con las que hemos colaborado, siempre con su autorización.", ctaTitle: "¿Colaboramos?", ctaText: "Si tu organización quiere sumar esfuerzos en inclusión, formación, desarrollo rural o innovación social, escríbenos.", cta: "Proponer una colaboración", homeIntro: "Colaboramos con instituciones, entidades sociales, centros educativos y empresas que comparten el compromiso con la inclusión y el desarrollo comunitario.", homeCta: "Ver alianzas" },
  en: { note: "Specific collaborations, one-off or ongoing. Listing them does not mean these organisations sponsor or endorse all of INICIA’s activities.", citiesLabel: "Where we work", citiesText: "Asturias, Spain", eyebrow: "Partners", title: "Who we", accent: "work with.", intro: "Our work is possible thanks to collaboration with public bodies, social organisations, schools and companies that share our commitment to inclusion and community development.", areasLabel: "Areas of collaboration", areas: [["Public bodies", "Public administrations and services we coordinate inclusion, training and employment programmes with."], ["Social organisations", "Associations, foundations and networks we share family support and volunteering with."], ["Education and research", "Universities, training centres and European youth and learning projects."], ["Companies and technology", "Companies and tech teams that contribute knowledge, tools and digital inclusion."]], listLabel: "Organisations we have worked with", empty: "We will list the organisations we have worked with here, always with their permission.", ctaTitle: "Shall we work together?", ctaText: "If your organisation wants to join forces on inclusion, training, rural development or social innovation, write to us.", cta: "Propose a collaboration", homeIntro: "We work with public bodies, social organisations, schools and companies that share our commitment to inclusion and community development.", homeCta: "See partners" },
  ru: { note: "Конкретные разовые или текущие проекты сотрудничества. Упоминание не означает, что эти организации спонсируют или поддерживают всю деятельность INICIA.", citiesLabel: "Где мы работаем", citiesText: "Астурия, Испания", eyebrow: "Партнёры", title: "С кем мы", accent: "работаем.", intro: "Наша работа возможна благодаря сотрудничеству с государственными учреждениями, социальными организациями, учебными заведениями и компаниями, которые разделяют наши ценности инклюзии и развития сообществ.", areasLabel: "Направления сотрудничества", areas: [["Государственные учреждения", "Органы власти и государственные службы, с которыми мы координируем программы инклюзии, обучения и занятости."], ["Социальные организации", "Ассоциации, фонды и сети, с которыми мы вместе поддерживаем семьи и развиваем волонтёрство."], ["Образование и исследования", "Университеты, учебные центры и европейские молодёжные и образовательные проекты."], ["Компании и технологии", "Компании и технологические команды, которые делятся знаниями, инструментами и помогают с цифровой инклюзией."]], listLabel: "С кем мы сотрудничали", empty: "Здесь появятся организации, с которыми мы сотрудничали, — только с их согласия.", ctaTitle: "Сотрудничаем?", ctaText: "Если ваша организация хочет объединить усилия в инклюзии, обучении, развитии сельских территорий или социальных инновациях — напишите нам.", cta: "Предложить сотрудничество", homeIntro: "Мы сотрудничаем с госучреждениями, социальными организациями, учебными заведениями и компаниями, которые разделяют наши ценности.", homeCta: "Все партнёры" },
  uk: { note: "Конкретні разові або поточні проєкти співпраці. Згадка не означає, що ці організації спонсорують або підтримують усю діяльність INICIA.", citiesLabel: "Де ми працюємо", citiesText: "Астурія, Іспанія", eyebrow: "Партнери", title: "З ким ми", accent: "працюємо.", intro: "Наша робота можлива завдяки співпраці з державними установами, соціальними організаціями, навчальними закладами та компаніями, які поділяють наші цінності інклюзії та розвитку громад.", areasLabel: "Напрями співпраці", areas: [["Державні установи", "Органи влади та державні служби, з якими ми координуємо програми інклюзії, навчання та зайнятості."], ["Соціальні організації", "Асоціації, фонди та мережі, з якими ми разом підтримуємо родини та розвиваємо волонтерство."], ["Освіта та дослідження", "Університети, навчальні центри та європейські молодіжні й освітні проєкти."], ["Компанії та технології", "Компанії та технологічні команди, які діляться знаннями, інструментами та допомагають із цифровою інклюзією."]], listLabel: "З ким ми співпрацювали", empty: "Тут з’являться організації, з якими ми співпрацювали, — лише з їхньої згоди.", ctaTitle: "Співпрацюємо?", ctaText: "Якщо ваша організація хоче об’єднати зусилля в інклюзії, навчанні, розвитку сільських територій або соціальних інноваціях — напишіть нам.", cta: "Запропонувати співпрацю", homeIntro: "Ми співпрацюємо з держустановами, соціальними організаціями, навчальними закладами та компаніями, які поділяють наші цінності.", homeCta: "Усі партнери" },
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
      <div className="mt-6 grid gap-5 md:grid-cols-3">{partners.map(p => <article key={p.name} className="flex flex-col rounded-3xl border border-[#D6B25E]/20 bg-gradient-to-br from-[#0E1729] to-[#090F1B] p-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#D6B25E]">{p.type[locale]} · {p.year}</p><h2 className="mt-3 font-serif text-3xl leading-tight">{p.url ? <a href={p.url} target="_blank" rel="noreferrer" className="underline decoration-[#D6B25E]/60 decoration-1 underline-offset-4 hover:decoration-[#D6B25E]">{p.name}</a> : p.name}</h2><p className="mt-3 text-sm leading-6 text-slate-300">{p.work[locale]}</p></article>)}</div>
      <p className="mt-5 max-w-3xl text-xs leading-5 text-slate-400">{t.note}</p>
    </section>

    <section className="mx-auto max-w-7xl px-5 pb-20"><div className="flex flex-col gap-6 rounded-3xl border border-[#D6B25E]/20 bg-[#0A1424] p-8 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.citiesLabel}</p><p className="mt-2 text-sm text-slate-300">{t.citiesText}</p></div><div className="flex flex-wrap gap-3">{cities.map(city => <span key={city} className="rounded-full border border-[#D6B25E]/40 px-5 py-2 font-serif text-2xl text-[#F0D893]">{city}</span>)}</div></div></section>
    <section className="bg-[#0A1424] px-5 py-16 text-white"><div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between"><div><h2 className="font-serif text-4xl">{t.ctaTitle}</h2><p className="mt-3 max-w-2xl leading-7 text-slate-200">{t.ctaText}</p></div><Link href="/contacto?tipo=organizacion" className="inline-flex min-h-12 w-fit items-center rounded-full bg-[#D6B25E] px-6 text-sm font-bold text-[#120D05]">{t.cta} <ArrowRight className="ml-2 h-4 w-4" /></Link></div></section>
    <SiteFooter />
  </main>;
}
