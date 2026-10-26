import { ArrowRight, Building2, HandHeart, HeartHandshake, LifeBuoy, Lightbulb, MapPin, MessageCircle, Phone, ShieldCheck, Target, UsersRound } from "lucide-react";
import { Link } from "wouter";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { ProjectVisual } from "@/components/ProjectVisual";
import { SiteFooter } from "@/components/SiteFooter";
import { SocialLinks } from "@/components/SocialLinks";
import { SpiralMark } from "@/components/SpiralMark";
import { forLocale, formatDate, useSettings, useSiteContent } from "@/lib/content";
import { YouTubeLite } from "@/components/YouTubeLite";
import { type Locale, useLocale } from "@/lib/i18n";
import { publicAssets } from "@/lib/publicAssets";
import { type PhotoName, photo } from "@/lib/photos";
import { CONTACT } from "@/lib/siteConfig";
import { trpc } from "@/lib/trpc";
import { AllianceAreas, allianceCopy } from "./Alliances";

const HERO_IMAGE = publicAssets.heroCommunity;

type Card = [title: string, text: string];
type HomeCopy = {
  badge: string; heroTitle: string; heroAccent: string; heroText: string; ctaHelp: string; ctaSupport: string; ctaProjects: string;
  stats: [string, string][]; ribbon: string;
  routeTitle: string; routes: [title: string, text: string, href: string][];
  aboutEyebrow: string; aboutTitle: string; aboutText: string; pillars: Card[];
  missionEyebrow: string; missionTitle: string; missionText: string; mission: Card[]; ideologyLink: string; areasLabel: string; areas: Card[];
  projectsEyebrow: string; projectsTitle: string; projectsText: string; projectsCta: string; viewProject: string; projectImageAlt: string;
  newsEyebrow: string; newsTitle: string; newsCta: string;
  partnersEyebrow: string; partnersTitle: string;
  donateEyebrow: string; donateTitle: string; donateText: string; donateCta: string; donateOther: string;
  contactEyebrow: string; contactTitle: string; contactText: string; whatsapp: string; directions: string; follow: string; formCta: string;
};

const copy: Record<Locale, HomeCopy> = {
  es: {
    badge: "ONG · Asturias, España · desde 2021", heroTitle: "Iniciamos el cambio que", heroAccent: "la sociedad necesita.", heroText: "INICIA Foundation trabaja por la inclusión, el desarrollo comunitario y el apoyo a personas en situación de vulnerabilidad.", ctaHelp: "Necesito ayuda", ctaSupport: "Quiero ayudar", ctaProjects: "Ver proyectos",
    stats: [["317", "familias ucranianas acompañadas"], ["129", "familias de otros orígenes y vecinos"], ["20", "iniciativas en marcha y en diseño"], ["2021", "año de fundación"]],
    ribbon: "Inclusión · Comunidad · Formación · Colaboración · Asturias",
    routeTitle: "¿Qué te trae a INICIA?", routes: [["Necesito ayuda", "Alimentos, trámites, empleo o acompañamiento.", "/contacto?tipo=ayuda"], ["Quiero ser voluntario/a", "Tu tiempo y tus habilidades en proyectos reales.", "/contacto?tipo=voluntariado"], ["Soy una organización", "Alianzas, patrocinio y proyectos conjuntos.", "/contacto?tipo=organizacion"], ["Quiero donar", "Bizum, transferencia o material.", "/donar"]],
    aboutEyebrow: "Quiénes somos", aboutTitle: "Una organización nacida para transformar vidas.", aboutText: "Somos una entidad sin ánimo de lucro con sede en Asturias. Impulsamos proyectos sociales, desarrollo comunitario y colaboración institucional.",
    pillars: [["Desarrollo comunitario", "Iniciativas que conectan capacidades locales, familias y recursos sociales."], ["Colaboración institucional", "Alianzas responsables para ampliar el alcance de las iniciativas sociales."], ["Apoyo y orientación", "Información clara y procesos trazables para la participación ciudadana."]],
    missionEyebrow: "Misión, objetivos e ideología", missionTitle: "Una acción cívica ante desafíos humanos, sociales y globales.", missionText: "Los fines estatutarios de INICIA Foundation conectan la dignidad humana, la justicia social, la sostenibilidad ambiental, la participación y la prevención responsable de riesgos globales.",
    mission: [["Misión", "Promover la inclusión, el desarrollo comunitario, la cooperación y el apoyo social desde una entidad sin ánimo de lucro con sede en Asturias."], ["Fines estatutarios", "Contribuir a una sociedad más sostenible, pacífica, justa e informada mediante iniciativas sociales, comunitarias, educativas y de sensibilización."], ["Ideología", "Compromiso con la dignidad, la participación ciudadana, la cooperación responsable y la mejora de las condiciones de vida en la comunidad."]],
    ideologyLink: "Consultar la sección de Ideología", areasLabel: "Ámbitos de los fines estatutarios",
    areas: [["Medio ambiente y clima", "Sensibilización ante la contaminación, la pérdida de biodiversidad, el calentamiento global y el uso responsable de los recursos naturales."], ["Paz y seguridad humana", "Promoción de una cultura de paz y de la conciencia pública sobre riesgos que afectan a todos los pueblos."], ["Igualdad y desarrollo", "Atención a la desigualdad social, la pobreza, el hambre, el desempleo y los factores de exclusión."], ["Recursos y demografía", "Seguridad alimentaria, acceso equitativo a recursos y retos demográficos y del envejecimiento."], ["Salud y bienestar social", "Sensibilización sobre el envejecimiento y la salud pública. INICIA no realiza diagnóstico ni tratamiento."], ["Tecnología y riesgos globales", "Una mirada responsable hacia las tecnologías emergentes, incluida la inteligencia artificial."]],
    projectsEyebrow: "Proyectos destacados", projectsTitle: "Tres iniciativas para conocer INICIA.", projectsText: "El catálogo completo reúne 20 iniciativas y muestra el estado de cada una.", projectsCta: "Explorar todos los proyectos", viewProject: "Ver proyecto", projectImageAlt: "Personas organizando una iniciativa comunitaria",
    newsEyebrow: "Noticias", newsTitle: "Lo último de INICIA.", newsCta: "Todas las noticias",
    partnersEyebrow: "Alianzas", partnersTitle: "Con quién trabajamos.",
    donateEyebrow: "Donar", donateTitle: "Tu apoyo lo hace posible.", donateText: "Dona en segundos por Bizum o transferencia, o aporta material, alimentos o tu tiempo.", donateCta: "Donar ahora", donateOther: "Otras formas de apoyar",
    contactEyebrow: "Contacto", contactTitle: "Hablemos.", contactText: "Gijón: Av. Manuel Llaneza, 68. Oviedo, Madrid, Barcelona y Valencia: con cita previa.", whatsapp: "WhatsApp", directions: "Cómo llegar", follow: "Síguenos", formCta: "Escribirnos",
  },
  en: {
    badge: "NGO · Asturias, Spain · since 2021", heroTitle: "We start the change", heroAccent: "society needs.", heroText: "INICIA Foundation works for inclusion, community development and support for people in vulnerable situations.", ctaHelp: "I need help", ctaSupport: "I want to help", ctaProjects: "See projects",
    stats: [["317", "Ukrainian families supported"], ["129", "families of other origins and neighbours"], ["20", "initiatives running or in design"], ["2021", "year founded"]],
    ribbon: "Inclusion · Community · Training · Collaboration · Asturias",
    routeTitle: "What brings you to INICIA?", routes: [["I need help", "Food, paperwork, jobs or support.", "/contacto?tipo=ayuda"], ["I want to volunteer", "Your time and skills in real projects.", "/contacto?tipo=voluntariado"], ["I represent an organisation", "Partnerships, sponsorship and joint projects.", "/contacto?tipo=organizacion"], ["I want to donate", "Bizum, bank transfer or goods.", "/donar"]],
    aboutEyebrow: "About us", aboutTitle: "An organisation born to transform lives.", aboutText: "We are a non-profit organisation based in Asturias. We drive social projects, community development and institutional collaboration.",
    pillars: [["Community development", "Initiatives connecting local skills, families and social resources."], ["Institutional collaboration", "Responsible partnerships that extend the reach of social initiatives."], ["Support and guidance", "Clear information and traceable processes for civic participation."]],
    missionEyebrow: "Mission, goals and ideology", missionTitle: "Civic action in the face of human, social and global challenges.", missionText: "INICIA Foundation's statutory aims link human dignity, social justice, environmental sustainability, participation and the responsible prevention of global risks.",
    mission: [["Mission", "To promote inclusion, community development, cooperation and social support as a non-profit organisation based in Asturias."], ["Statutory aims", "To contribute to a more sustainable, peaceful, fair and informed society through social, community, educational and awareness initiatives."], ["Ideology", "Commitment to dignity, civic participation, responsible cooperation and better living conditions in the community."]],
    ideologyLink: "Read our Ideology", areasLabel: "Areas of our statutory aims",
    areas: [["Environment and climate", "Awareness of pollution, biodiversity loss, global warming and the responsible use of natural resources."], ["Peace and human security", "Promoting a culture of peace and public awareness of risks that affect all peoples."], ["Equality and development", "Addressing social inequality, poverty, hunger, unemployment and the factors of exclusion."], ["Resources and demography", "Food security, fair access to resources, and demographic and ageing challenges."], ["Health and social wellbeing", "Awareness of ageing and public health. INICIA does not diagnose or treat."], ["Technology and global risks", "A responsible view of emerging technologies, including artificial intelligence."]],
    projectsEyebrow: "Featured projects", projectsTitle: "Three initiatives to get to know INICIA.", projectsText: "The full portfolio brings together 20 initiatives and shows the status of each.", projectsCta: "Explore all projects", viewProject: "View project", projectImageAlt: "People organising a community initiative",
    newsEyebrow: "News", newsTitle: "Latest from INICIA.", newsCta: "All news",
    partnersEyebrow: "Partners", partnersTitle: "Who we work with.",
    donateEyebrow: "Donate", donateTitle: "Your support makes it possible.", donateText: "Donate in seconds by Bizum or bank transfer, or give goods, food or your time.", donateCta: "Donate now", donateOther: "Other ways to help",
    contactEyebrow: "Contact", contactTitle: "Let's talk.", contactText: "Gijón: Av. Manuel Llaneza, 68. Oviedo, Madrid, Barcelona and Valencia: by appointment.", whatsapp: "WhatsApp", directions: "Get directions", follow: "Follow us", formCta: "Write to us",
  },
  ru: {
    badge: "НКО · Астурия, Испания · с 2021 года", heroTitle: "Мы начинаем перемены, которые", heroAccent: "нужны обществу.", heroText: "INICIA Foundation работает ради инклюзии, развития сообществ и поддержки людей в трудной ситуации.", ctaHelp: "Мне нужна помощь", ctaSupport: "Хочу помочь", ctaProjects: "Проекты",
    stats: [["317", "украинских семей получили поддержку"], ["129", "семей другого происхождения и местных жителей"], ["20", "инициатив в работе и в разработке"], ["2021", "год основания"]],
    ribbon: "Инклюзия · Сообщество · Обучение · Сотрудничество · Астурия",
    routeTitle: "Что привело вас в INICIA?", routes: [["Мне нужна помощь", "Продукты, документы, работа, сопровождение.", "/contacto?tipo=ayuda"], ["Хочу стать волонтёром", "Ваше время и навыки — в реальные проекты.", "/contacto?tipo=voluntariado"], ["Я представляю организацию", "Партнёрство, спонсорство, совместные проекты.", "/contacto?tipo=organizacion"], ["Хочу поддержать", "Bizum, перевод или вещи.", "/donar"]],
    aboutEyebrow: "О нас", aboutTitle: "Организация, созданная, чтобы менять жизни.", aboutText: "Мы — некоммерческая организация из Астурии. Развиваем социальные проекты, местные сообщества и сотрудничество с учреждениями.",
    pillars: [["Развитие сообществ", "Инициативы, которые объединяют местные возможности, семьи и социальные ресурсы."], ["Сотрудничество с учреждениями", "Ответственные партнёрства, расширяющие охват социальных инициатив."], ["Поддержка и консультации", "Понятная информация и прозрачные процессы для участия граждан."]],
    missionEyebrow: "Миссия, цели и идеология", missionTitle: "Гражданское действие перед лицом человеческих, социальных и глобальных вызовов.", missionText: "Уставные цели INICIA Foundation объединяют человеческое достоинство, социальную справедливость, экологическую устойчивость, участие граждан и ответственное предотвращение глобальных рисков.",
    mission: [["Миссия", "Продвигать инклюзию, развитие сообществ, сотрудничество и социальную поддержку как некоммерческая организация из Астурии."], ["Уставные цели", "Способствовать более устойчивому, мирному, справедливому и информированному обществу через социальные, образовательные и просветительские инициативы."], ["Идеология", "Приверженность достоинству, гражданскому участию, ответственному сотрудничеству и улучшению условий жизни в сообществе."]],
    ideologyLink: "Подробнее об идеологии", areasLabel: "Направления уставных целей",
    areas: [["Экология и климат", "Просвещение о загрязнении, утрате биоразнообразия, глобальном потеплении и бережном использовании ресурсов."], ["Мир и безопасность человека", "Культура мира и осведомлённость общества о рисках, которые касаются всех народов."], ["Равенство и развитие", "Борьба с неравенством, бедностью, голодом, безработицей и причинами социальной изоляции."], ["Ресурсы и демография", "Продовольственная безопасность, справедливый доступ к ресурсам, демографические вызовы и старение."], ["Здоровье и благополучие", "Просвещение о старении и общественном здоровье. INICIA не ставит диагнозов и не лечит."], ["Технологии и глобальные риски", "Ответственный взгляд на новые технологии, включая искусственный интеллект."]],
    projectsEyebrow: "Избранные проекты", projectsTitle: "Три инициативы, чтобы узнать INICIA.", projectsText: "В полном каталоге 20 инициатив и статус каждой из них.", projectsCta: "Все проекты", viewProject: "Подробнее", projectImageAlt: "Люди организуют местную инициативу",
    newsEyebrow: "Новости", newsTitle: "Последние новости INICIA.", newsCta: "Все новости",
    partnersEyebrow: "Партнёры", partnersTitle: "С кем мы работаем.",
    donateEyebrow: "Поддержать", donateTitle: "Ваша поддержка делает это возможным.", donateText: "Пожертвуйте за пару секунд через Bizum или перевод — или помогите вещами, продуктами или своим временем.", donateCta: "Поддержать", donateOther: "Другие способы помочь",
    contactEyebrow: "Контакты", contactTitle: "Давайте поговорим.", contactText: "Хихон: Av. Manuel Llaneza, 68. Овьедо, Мадрид, Барселона и Валенсия — по предварительной записи.", whatsapp: "WhatsApp", directions: "Как добраться", follow: "Мы в соцсетях", formCta: "Написать нам",
  },
  uk: {
    badge: "НГО · Астурія, Іспанія · з 2021 року", heroTitle: "Ми починаємо зміни, яких", heroAccent: "потребує суспільство.", heroText: "INICIA Foundation працює заради інклюзії, розвитку громад і підтримки людей у складних обставинах.", ctaHelp: "Мені потрібна допомога", ctaSupport: "Хочу допомогти", ctaProjects: "Проєкти",
    stats: [["317", "українських родин отримали підтримку"], ["129", "родин іншого походження та місцевих мешканців"], ["20", "ініціатив у роботі та розробці"], ["2021", "рік заснування"]],
    ribbon: "Інклюзія · Громада · Навчання · Співпраця · Астурія",
    routeTitle: "Що привело вас до INICIA?", routes: [["Мені потрібна допомога", "Продукти, документи, робота, супровід.", "/contacto?tipo=ayuda"], ["Хочу бути волонтером", "Ваш час і навички — у реальні проєкти.", "/contacto?tipo=voluntariado"], ["Я представляю організацію", "Партнерство, спонсорство, спільні проєкти.", "/contacto?tipo=organizacion"], ["Хочу підтримати", "Bizum, переказ або речі.", "/donar"]],
    aboutEyebrow: "Про нас", aboutTitle: "Організація, створена, щоб змінювати життя.", aboutText: "Ми — неприбуткова організація з Астурії. Розвиваємо соціальні проєкти, місцеві громади та співпрацю з установами.",
    pillars: [["Розвиток громад", "Ініціативи, що об’єднують місцеві можливості, родини та соціальні ресурси."], ["Співпраця з установами", "Відповідальні партнерства, що розширюють охоплення соціальних ініціатив."], ["Підтримка та консультації", "Зрозуміла інформація та прозорі процеси для участі громадян."]],
    missionEyebrow: "Місія, цілі та ідеологія", missionTitle: "Громадська дія перед людськими, соціальними та глобальними викликами.", missionText: "Статутні цілі INICIA Foundation поєднують людську гідність, соціальну справедливість, екологічну сталість, участь громадян і відповідальне запобігання глобальним ризикам.",
    mission: [["Місія", "Сприяти інклюзії, розвитку громад, співпраці та соціальній підтримці як неприбуткова організація з Астурії."], ["Статутні цілі", "Сприяти сталішому, мирнішому, справедливішому та поінформованому суспільству через соціальні, освітні та просвітницькі ініціативи."], ["Ідеологія", "Відданість гідності, громадській участі, відповідальній співпраці та покращенню умов життя в громаді."]],
    ideologyLink: "Детальніше про ідеологію", areasLabel: "Напрями статутних цілей",
    areas: [["Екологія та клімат", "Просвіта щодо забруднення, втрати біорізноманіття, глобального потепління та дбайливого використання ресурсів."], ["Мир і безпека людини", "Культура миру та обізнаність суспільства щодо ризиків, які стосуються всіх народів."], ["Рівність і розвиток", "Протидія нерівності, бідності, голоду, безробіттю та причинам соціальної ізоляції."], ["Ресурси та демографія", "Продовольча безпека, справедливий доступ до ресурсів, демографічні виклики та старіння."], ["Здоров’я та добробут", "Просвіта щодо старіння та громадського здоров’я. INICIA не ставить діагнозів і не лікує."], ["Технології та глобальні ризики", "Відповідальний погляд на нові технології, зокрема штучний інтелект."]],
    projectsEyebrow: "Вибрані проєкти", projectsTitle: "Три ініціативи, щоб познайомитися з INICIA.", projectsText: "У повному каталозі 20 ініціатив і статус кожної з них.", projectsCta: "Усі проєкти", viewProject: "Детальніше", projectImageAlt: "Люди організовують місцеву ініціативу",
    newsEyebrow: "Новини", newsTitle: "Останні новини INICIA.", newsCta: "Усі новини",
    partnersEyebrow: "Партнери", partnersTitle: "З ким ми працюємо.",
    donateEyebrow: "Підтримати", donateTitle: "Ваша підтримка робить це можливим.", donateText: "Пожертвуйте за кілька секунд через Bizum або переказ — або допоможіть речами, продуктами чи своїм часом.", donateCta: "Підтримати", donateOther: "Інші способи допомогти",
    contactEyebrow: "Контакти", contactTitle: "Поговорімо.", contactText: "Хіхон: Av. Manuel Llaneza, 68. Ов’єдо, Мадрид, Барселона та Валенсія — за попереднім записом.", whatsapp: "WhatsApp", directions: "Як дістатися", follow: "Ми в соцмережах", formCta: "Написати нам",
  },
};

const EARTH = photo("earth");
const HORIZON = photo("horizon");
const LEARNING = photo("learning");
const ENERGY = photo("energy");
const SEEDLING = photo("seedling");
const ROUTE_PHOTOS: PhotoName[] = ["community", "planting", "team", "seedling"];
const TAGLINE: Record<Locale, string> = { es: "Personas · Planeta · Innovación", en: "People · Planet · Innovation", ru: "Люди · Планета · Инновации", uk: "Люди · Планета · Інновації" };
const ROUTE_ICONS = [LifeBuoy, HandHeart, Building2, HeartHandshake];
const PILLAR_ICONS = [UsersRound, HeartHandshake, ShieldCheck];
const MISSION_ICONS = [HeartHandshake, Target, Lightbulb];

function FoundationMap({ label }: { label: string }) {
  return <div className="relative min-h-[360px] overflow-hidden rounded-3xl bg-[#08101E] shadow-sm ring-1 ring-[#D6B25E]/25">
    <iframe title="Mapa INICIA Foundation" src="https://www.google.com/maps?q=ONG%20Inicia%20Foundation%2C%20Av.%20Manuel%20Llaneza%2C%2068%2C%20Gij%C3%B3n&output=embed" className="absolute inset-0 h-full w-full border-0 opacity-85" loading="lazy" />
    <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-[#060A12]/95 p-4 text-white"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#D6B25E]">INICIA Foundation</p><p className="mt-1 text-sm">Av. Manuel Llaneza, 68 · 33208 Gijón</p><a className="mt-3 inline-flex min-h-10 items-center rounded-full bg-[#D6B25E] px-4 text-xs font-bold text-[#120D05]" href="https://maps.app.goo.gl/kqzE7HTLe2PHM5BJ8" target="_blank" rel="noreferrer">{label}</a></div>
  </div>;
}

export default function Home() {
  const [locale] = useLocale();
  const t = copy[locale];
  const partners = allianceCopy[locale];
  const projects = trpc.crm.public.projects.useQuery({ locale }).data ?? [];
  const featuredSlugs = ["nucleo", "coopastur-agrosocial", "rural-futures"];
  const featured = projects.filter(project => featuredSlugs.includes(project.slug));
  const displayedProjects = featured.length ? featured : projects.slice(0, 3);
  const { data: content } = useSiteContent();
  const settings = useSettings();
  const latestNews = forLocale(content?.news ?? [], locale).slice(0, 3);

  return <main className="min-h-screen bg-[#060A12] text-[#EEE7D7]">
    <OriginalSiteNavigation />

    <section className="relative isolate overflow-hidden bg-[#060A12]">
      <img src={EARTH.src} srcSet={EARTH.srcSet} sizes="100vw" alt="" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center] opacity-90" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#060A12] via-[#060A12]/85 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-[#060A12] to-transparent" />
      <SpiralMark className="pointer-events-none absolute right-[4%] top-[12%] -z-10 hidden h-[560px] w-[560px] opacity-60 lg:block" />
      <div className="relative mx-auto grid min-h-[680px] max-w-7xl content-center px-5 pb-36 pt-24">
        <div className="max-w-2xl text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[.34em] text-[#D6B25E]">{TAGLINE[locale]}</p>
          <h1 className="mt-6 font-serif text-6xl leading-[0.98] md:text-8xl">{t.heroTitle} <span className="italic text-[#F0D893]">{t.heroAccent}</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-200">{t.heroText}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/contacto?tipo=ayuda" className="inline-flex min-h-12 items-center rounded-full bg-[#D6B25E] px-7 text-sm font-bold text-[#120D05] shadow-[0_10px_40px_rgba(214,178,94,.35)] transition hover:bg-[#F0D893]">{t.ctaHelp}<ArrowRight className="ml-2 h-4 w-4" /></Link>
            <Link href="/donar" className="inline-flex min-h-12 items-center rounded-full border border-[#D6B25E]/60 bg-[#060A12]/40 px-7 text-sm font-bold text-[#F0D893] backdrop-blur transition hover:border-[#F0D893]">{t.ctaSupport}</Link>
            <Link href="/proyectos" className="inline-flex min-h-12 items-center px-3 text-sm font-semibold text-white underline decoration-[#D6B25E] decoration-1 underline-offset-8">{t.ctaProjects}</Link>
          </div>
          <p className="mt-10 text-xs uppercase tracking-[.24em] text-slate-400">{t.badge}</p>
        </div>
      </div>
    </section>

    <section className="relative z-10 mx-auto -mt-24 max-w-6xl px-5"><dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-[#D6B25E]/25 bg-[#D6B25E]/15 shadow-[0_30px_80px_rgba(0,0,0,.5)] backdrop-blur md:grid-cols-4">{t.stats.map(([value, label]) => <div key={label} className="bg-[#0A1120]/90 p-6 md:p-8"><dd className="font-serif text-5xl text-[#F0D893] md:text-6xl">{value}</dd><dt className="mt-2 text-xs uppercase leading-5 tracking-[.12em] text-slate-300">{label}</dt></div>)}</dl></section>

    <section className="mx-auto max-w-7xl px-5 py-24"><p className="text-[11px] font-semibold uppercase tracking-[.3em] text-[#D6B25E]">INICIA</p><h2 className="mt-3 font-serif text-5xl md:text-6xl">{t.routeTitle}</h2>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{t.routes.map(([title, text, href], index) => { const Icon = ROUTE_ICONS[index]; const img = photo(ROUTE_PHOTOS[index]); return <Link key={href} href={href} className="group relative isolate flex min-h-[340px] flex-col justify-end overflow-hidden rounded-3xl border border-[#D6B25E]/20 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#D6B25E]/60 hover:shadow-[0_20px_60px_rgba(0,0,0,.55)]"><img src={img.src} srcSet={img.srcSet} sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#060A12] via-[#060A12]/70 to-[#060A12]/10" /><Icon className="h-8 w-8 text-[#D6B25E]" /><span className="mt-4 font-serif text-3xl leading-tight text-white">{title}</span><span className="mt-2 text-sm leading-6 text-slate-200">{text}</span><span className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D6B25E]/50 text-[#F0D893] transition group-hover:bg-[#D6B25E] group-hover:text-[#120D05]"><ArrowRight className="h-4 w-4" /></span></Link>; })}</div>
    </section>

    {settings.homeVideo && <section className="mx-auto max-w-5xl px-5 pb-24"><YouTubeLite id={settings.homeVideo} title="INICIA Foundation" /></section>}

    <section id="quienes-somos" className="mx-auto grid max-w-7xl gap-10 px-5 pb-24 md:grid-cols-2">
      <div className="relative isolate flex min-h-[460px] flex-col justify-end overflow-hidden rounded-3xl border border-[#D6B25E]/20 p-10 text-white"><img src={HORIZON.src} srcSet={HORIZON.srcSet} sizes="(min-width:768px) 50vw, 100vw" alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover" /><div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#060A12] via-[#060A12]/60 to-transparent" /><p className="text-[11px] font-semibold uppercase tracking-[.3em] text-[#D6B25E]">{t.aboutEyebrow}</p><h2 className="relative mt-4 font-serif text-5xl">{t.aboutTitle}</h2><p className="relative mt-5 max-w-xl leading-8 text-slate-200">{t.aboutText}</p></div>
      <div className="grid content-center gap-5">{t.pillars.map(([title, text], index) => { const Icon = PILLAR_ICONS[index]; return <article key={title} className="flex gap-5 rounded-3xl border border-[#D6B25E]/15 bg-gradient-to-br from-[#0E1729] to-[#090F1B] p-7"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D6B25E]/40"><Icon className="h-5 w-5 text-[#D6B25E]" /></span><div><h3 className="font-serif text-3xl">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-300">{text}</p></div></article>; })}</div>
    </section>

    <section id="mision" className="bg-[#0C1320] py-20"><div className="mx-auto max-w-7xl px-5">
      <div className="max-w-4xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.missionEyebrow}</p><h2 className="mt-3 font-serif text-4xl md:text-5xl">{t.missionTitle}</h2><p className="mt-5 text-lg leading-8 text-slate-200">{t.missionText}</p></div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">{t.mission.map(([title, text], index) => { const Icon = MISSION_ICONS[index]; return <article key={title} className="rounded-3xl bg-[#060A12] p-7"><Icon className="h-7 w-7 text-[#D6B25E]" /><h3 className="mt-5 font-serif text-3xl">{title}</h3><p className="mt-3 leading-7 text-slate-300">{text}</p>{index === 2 && <Link className="mt-5 inline-flex text-sm font-bold underline decoration-[#D6B25E] decoration-2 underline-offset-4" href="/ideologia">{t.ideologyLink} →</Link>}</article>; })}</div>
      <div className="relative isolate mt-12 h-56 overflow-hidden rounded-3xl border border-[#D6B25E]/20 md:h-72"><img src={ENERGY.src} srcSet={ENERGY.srcSet} sizes="100vw" alt="" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-[#060A12]/70 to-transparent" /></div><div className="mt-12 border-t border-[#D6B25E]/20 pt-10"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.areasLabel}</p><div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{t.areas.map(([title, text]) => <article key={title} className="rounded-3xl border border-[#D6B25E]/20 p-6"><h3 className="font-serif text-2xl">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{text}</p></article>)}</div></div>
    </div></section>

    <section id="proyectos" className="py-20"><div className="mx-auto max-w-7xl px-5">
      <div className="grid gap-10 md:grid-cols-[.9fr_1.1fr]"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.projectsEyebrow}</p><h2 className="mt-3 font-serif text-4xl md:text-5xl">{t.projectsTitle}</h2><p className="mt-5 leading-7 text-slate-300">{t.projectsText}</p><Link href="/proyectos" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-[#D6B25E] px-6 text-sm font-bold text-[#120D05]">{t.projectsCta} <ArrowRight className="ml-2 h-4 w-4" /></Link></div><img src={LEARNING.src} srcSet={LEARNING.srcSet} sizes="(min-width:768px) 55vw, 100vw" alt="" loading="lazy" className="h-full min-h-80 w-full rounded-3xl border border-[#D6B25E]/20 object-cover" /></div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">{displayedProjects.map(project => <article key={project.id} className="group overflow-hidden rounded-3xl bg-[#0C1320] shadow-sm ring-1 ring-[#D6B25E]/20 transition duration-200 hover:-translate-y-1 hover:shadow-lg"><ProjectVisual category={project.category} status={project.status} slug={project.slug} /><div className="p-6"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#D6B25E]">{project.category}</p><h3 className="mt-3 font-serif text-2xl">{project.title}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{project.shortDescription}</p><Link href={`/proyectos/${project.slug}`} className="mt-5 inline-flex items-center text-sm font-bold underline decoration-[#D6B25E] decoration-2 underline-offset-4">{t.viewProject} <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link></div></article>)}</div>
    </div></section>

    {latestNews.length > 0 && <section className="bg-[#0C1320] py-20"><div className="mx-auto max-w-7xl px-5"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.newsEyebrow}</p><h2 className="mt-3 font-serif text-4xl md:text-5xl">{t.newsTitle}</h2></div><Link href="/noticias" className="text-sm font-bold underline decoration-[#D6B25E] decoration-2 underline-offset-4">{t.newsCta} →</Link></div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">{latestNews.map(item => <Link key={item.id} href="/noticias" className="overflow-hidden rounded-3xl bg-[#060A12] transition hover:-translate-y-1">{item.imagen && <img src={item.imagen} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />}<div className="p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#D6B25E]">{formatDate(item.fecha, locale)}</p><h3 className="mt-2 font-serif text-2xl leading-tight">{item.titulo}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{item.resumen}</p></div></Link>)}</div>
    </div></section>}

    <section id="alianzas" className="py-20"><div className="mx-auto max-w-7xl px-5"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.partnersEyebrow}</p><h2 className="mt-3 font-serif text-4xl md:text-5xl">{t.partnersTitle}</h2><p className="mt-5 max-w-2xl leading-7 text-slate-300">{partners.homeIntro}</p><div className="mt-8"><AllianceAreas compact /></div><Link href="/alianzas" className="mt-8 inline-flex min-h-12 items-center rounded-full border border-[#D6B25E]/20 px-6 text-sm font-bold">{partners.homeCta}</Link></div></section>

    <section id="donar" className="relative isolate overflow-hidden py-28 text-white"><img src={SEEDLING.src} srcSet={SEEDLING.srcSet} sizes="100vw" alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#060A12] via-[#060A12]/85 to-[#060A12]/30" /><div className="relative mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-[1.2fr_.8fr] md:items-center"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.donateEyebrow}</p><h2 className="mt-3 font-serif text-5xl">{t.donateTitle}</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">{t.donateText}</p></div><div className="flex flex-col gap-3 md:items-end"><Link href="/donar" className="inline-flex min-h-14 items-center rounded-full bg-[#D6B25E] px-8 text-base font-bold text-[#120D05] shadow-[0_10px_30px_rgba(214,178,94,.35)]">{t.donateCta}<ArrowRight className="ml-2 h-5 w-5" /></Link><Link href="/donar#material" className="text-sm font-bold text-[#F0D893] underline underline-offset-4">{t.donateOther}</Link></div></div></section>

    <section id="contacto" className="mx-auto grid max-w-7xl gap-9 px-5 py-20 lg:grid-cols-[.85fr_1.15fr]"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.contactEyebrow}</p><h2 className="mt-3 font-serif text-5xl">{t.contactTitle}</h2><p className="mt-5 leading-7 text-slate-300">{t.contactText}</p>
      <div className="mt-6 flex flex-wrap gap-3"><Link href="/contacto" className="inline-flex min-h-12 items-center rounded-full bg-[#D6B25E] px-5 text-sm font-bold text-[#120D05]">{t.formCta}</Link><a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#D6B25E]/20 px-5 text-sm font-bold"><MessageCircle className="h-4 w-4 text-[#D6B25E]" />{t.whatsapp}</a><a href={CONTACT.phoneHref} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#D6B25E]/20 px-5 text-sm font-bold"><Phone className="h-4 w-4 text-[#D6B25E]" />{CONTACT.phone}</a></div>
      <a className="mt-5 inline-flex items-center gap-2 text-sm font-bold" href="https://maps.app.goo.gl/kqzE7HTLe2PHM5BJ8" target="_blank" rel="noreferrer"><MapPin className="h-4 w-4 text-[#D6B25E]" />{t.directions}</a>
      <div className="mt-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#D6B25E]">{t.follow}</p><div className="mt-3"><SocialLinks /></div></div></div><FoundationMap label={t.directions} /></section>

    <SiteFooter />
  </main>;
}
