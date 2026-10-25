import { ArrowRight, HandHeart, Scale, Sprout, Users } from "lucide-react";
import { Link } from "wouter";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { SiteFooter } from "@/components/SiteFooter";
import { type Locale, useLocale } from "@/lib/i18n";

const PRINCIPLE_ICONS = [HandHeart, Scale, Sprout, Users];

type IdeologyCopy = {
  title: string;
  intro: string;
  principles: [string, string][];
  practiceTitle: string;
  practiceText: string;
  cta: string;
};

const copy: Record<Locale, IdeologyCopy> = {
  es: {
    title: "Ideología y principios de acción.",
    intro: "Un compromiso cívico con la dignidad, la cooperación, la igualdad de oportunidades, la sostenibilidad y la mejora responsable de las condiciones de vida.",
    principles: [
      ["Dignidad y solidaridad", "Las personas, sus derechos y su participación activa están en el centro de la acción social y comunitaria."],
      ["Justicia e inclusión", "La organización orienta sus iniciativas a reducir barreras, desigualdades y situaciones de vulnerabilidad mediante información, acompañamiento y cooperación responsable."],
      ["Sostenibilidad y responsabilidad", "La acción cívica incorpora la protección ambiental, el uso responsable de recursos y la conciencia sobre riesgos compartidos por la sociedad."],
      ["Comunidad y participación", "INICIA valora la cooperación entre personas, comunidades, entidades e instituciones para construir respuestas realistas de interés público."],
    ],
    practiceTitle: "De los principios a la práctica.",
    practiceText: "Los principios no sustituyen la evaluación individual de cada situación, la normativa aplicable ni la competencia de servicios públicos o profesionales especializados. Guían la forma en que INICIA informa, colabora y diseña sus iniciativas.",
    cta: "Consultar misión y fines",
  },
  en: {
    title: "Ideology and principles of action.",
    intro: "A civic commitment to dignity, cooperation, equal opportunities, sustainability and the responsible improvement of living conditions.",
    principles: [
      ["Dignity and solidarity", "People, their rights and their active participation are at the heart of social and community action."],
      ["Justice and inclusion", "The organisation directs its initiatives towards reducing barriers, inequalities and situations of vulnerability through information, support and responsible cooperation."],
      ["Sustainability and responsibility", "Civic action incorporates environmental protection, the responsible use of resources and awareness of the risks shared by society."],
      ["Community and participation", "INICIA values cooperation between people, communities, organisations and institutions to build realistic responses in the public interest."],
    ],
    practiceTitle: "From principles to practice.",
    practiceText: "These principles do not replace the individual assessment of each situation, the applicable regulations or the competence of public services and specialised professionals. They guide the way INICIA informs, collaborates and designs its initiatives.",
    cta: "See our mission and purposes",
  },
  ru: {
    title: "Идеология и принципы деятельности.",
    intro: "Гражданская приверженность достоинству, сотрудничеству, равенству возможностей, устойчивому развитию и ответственному улучшению условий жизни.",
    principles: [
      ["Достоинство и солидарность", "Люди, их права и активное участие находятся в центре социальной и общественной деятельности."],
      ["Справедливость и инклюзия", "Организация направляет свои инициативы на снижение барьеров, неравенства и уязвимости посредством информирования, сопровождения и ответственного сотрудничества."],
      ["Устойчивость и ответственность", "Гражданская деятельность включает защиту окружающей среды, ответственное использование ресурсов и осознание рисков, общих для всего общества."],
      ["Сообщество и участие", "INICIA ценит сотрудничество между людьми, сообществами, организациями и учреждениями для выработки реалистичных решений в общественных интересах."],
    ],
    practiceTitle: "От принципов к практике.",
    practiceText: "Принципы не заменяют индивидуальной оценки каждой ситуации, применимых норм и компетенции государственных служб или профильных специалистов. Они определяют то, как INICIA информирует, сотрудничает и разрабатывает свои инициативы.",
    cta: "Миссия и уставные цели",
  },
  uk: {
    title: "Ідеологія та принципи діяльності.",
    intro: "Громадянська відданість гідності, співпраці, рівності можливостей, сталому розвитку та відповідальному покращенню умов життя.",
    principles: [
      ["Гідність і солідарність", "Люди, їхні права та активна участь перебувають у центрі соціальної та громадської діяльності."],
      ["Справедливість та інклюзія", "Організація спрямовує свої ініціативи на зменшення бар’єрів, нерівності та вразливості шляхом інформування, супроводу та відповідальної співпраці."],
      ["Сталість і відповідальність", "Громадянська діяльність охоплює захист довкілля, відповідальне використання ресурсів та усвідомлення ризиків, спільних для всього суспільства."],
      ["Громада та участь", "INICIA цінує співпрацю між людьми, громадами, організаціями та установами для вироблення реалістичних рішень у суспільних інтересах."],
    ],
    practiceTitle: "Від принципів до практики.",
    practiceText: "Принципи не замінюють індивідуальної оцінки кожної ситуації, чинних норм і компетенції державних служб чи профільних фахівців. Вони визначають те, як INICIA інформує, співпрацює та розробляє свої ініціативи.",
    cta: "Місія та статутні цілі",
  },
};

export default function Ideology() {
  const [locale] = useLocale();
  const t = copy[locale];
  return <main className="min-h-screen bg-[#F7F3EA] text-[#0B1E3A]"><OriginalSiteNavigation />
    <section className="border-b border-[#D6B25E]/30 bg-[#F0D893]/35 py-20"><div className="mx-auto max-w-7xl px-5"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#7E5F1E]">INICIA Foundation</p><h1 className="mt-4 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">{t.title}</h1><p className="mt-7 max-w-3xl text-lg leading-8 text-slate-700">{t.intro}</p></div></section>
    <section className="mx-auto max-w-7xl px-5 py-20"><div className="grid gap-5 md:grid-cols-2">{t.principles.map(([title, text], index) => { const Icon = PRINCIPLE_ICONS[index]; return <article key={title} className="rounded-3xl border border-[#0B1E3A]/10 bg-white p-8 shadow-sm"><Icon className="h-7 w-7 text-[#7E5F1E]" /><h2 className="mt-5 font-serif text-3xl">{title}</h2><p className="mt-4 leading-7 text-slate-600">{text}</p></article>; })}</div>
      <div className="mt-12 rounded-3xl bg-[#0B1E3A] p-8 text-white md:p-10"><h2 className="font-serif text-4xl">{t.practiceTitle}</h2><p className="mt-5 max-w-3xl leading-8 text-slate-200">{t.practiceText}</p><Link href="/mision" className="mt-7 inline-flex items-center rounded-full bg-[#D6B25E] px-5 py-3 text-sm font-bold text-[#0B1E3A]">{t.cta} <ArrowRight className="ml-2 h-4 w-4" /></Link></div>
    </section>
    <SiteFooter />
  </main>;
}
