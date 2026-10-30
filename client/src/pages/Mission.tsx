import { CtaBand } from "@/components/CtaBand";
import { ArrowRight, Briefcase, FileText, HandHeart, Languages, Package, Sprout } from "lucide-react";
import { Link } from "wouter";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { SiteFooter } from "@/components/SiteFooter";
import { type Locale, useLocale } from "@/lib/i18n";

const AREA_ICONS = [FileText, Package, Briefcase, Languages, HandHeart, Sprout];

type MissionCopy = {
  title: string;
  intro: string;
  areasEyebrow: string;
  areasTitle: string;
  areasIntro: string;
  areas: [string, string][];
  objectivesEyebrow: string;
  objectivesTitle: string;
  objectivesIntro: string;
  objectives: string[];
  commitmentEyebrow: string;
  commitment: string;
  cta: string;
};

const copy: Record<Locale, MissionCopy> = {
  es: {
    title: "Nuestra misión.",
    intro: "INICIA Foundation es una asociación sin ánimo de lucro creada en Gijón (Asturias) en 2021. Acompañamos a personas y familias en situación de vulnerabilidad —sobre todo familias desplazadas por la guerra de Ucrania y personas migrantes— para que puedan empezar de nuevo en Asturias: les ayudamos con los trámites, el acceso a los servicios públicos, la vivienda, la escolarización, la salud, el empleo y la ayuda material. Desde 2021 hemos acompañado a 2.561 familias ucranianas y a 1.380 familias de otros orígenes y vecinos.",
    areasEyebrow: "Qué hacemos",
    areasTitle: "Seis líneas de trabajo concretas.",
    areasIntro: "Cada familia llega con una situación distinta. Escuchamos, explicamos los pasos en su idioma y la acompañamos hasta que puede moverse sola por los servicios y recursos de la comunidad.",
    areas: [
      ["Trámites y acceso a recursos", "Información, orientación y acompañamiento en trámites administrativos y en el acceso a los recursos públicos: vivienda, escolarización de los niños, atención sanitaria y ayudas sociales. Cuando corresponde, derivamos a los servicios sociales y públicos competentes."],
      ["Ayuda material", "Recogemos y entregamos ropa, enseres, alimentos y otros bienes donados por particulares y entidades colaboradoras, y organizamos el intercambio de bienes y servicios en favor de las familias que acompañamos."],
      ["Orientación para el empleo", "Apoyo en la búsqueda de trabajo, preparación del currículum y de entrevistas, y derivación a los servicios públicos de empleo y a programas de formación."],
      ["Traducción y acompañamiento", "Personas voluntarias acompañan a las familias a citas y gestiones, traducen entre ucraniano, ruso, inglés y español y ayudan con el transporte cuando es necesario."],
      ["Comunidad y voluntariado", "Organizamos acciones solidarias y de convivencia con entidades de Asturias y coordinamos a las personas voluntarias que hacen posible todo nuestro trabajo."],
      ["Nuevos programas", "Preparamos CoopAstur AgroSocial, una cooperativa agroecológica para crear formación y empleo en el medio rural, y programas de inclusión digital para personas con menos acceso a la tecnología."],
    ],
    objectivesEyebrow: "A quién atendemos y cómo trabajamos",
    objectivesTitle: "Cerca de las personas, con medios voluntarios.",
    objectivesIntro: "Así funciona INICIA Foundation en el día a día:",
    objectives: [
      "Atendemos a familias desplazadas por la guerra en Ucrania, a personas migrantes y refugiadas y a vecinos de Asturias en situación de vulnerabilidad.",
      "La atención es gratuita y no exige ser socio o socia de la asociación.",
      "Respondemos en español, ucraniano, ruso e inglés, por WhatsApp, teléfono, correo electrónico o en persona.",
      "Todo el trabajo lo realizan personas voluntarias. Entre 2021 y 2025 la asociación no tuvo personal asalariado ni recibió subvenciones: los gastos los asumieron las propias personas asociadas.",
      "Colaboramos con entidades sociales, deportivas y empresas de Asturias, y derivamos a los servicios públicos cuando la necesidad lo requiere.",
      "Cada solicitud que llega por la web recibe un número de referencia y una respuesta personal.",
      "Somos una entidad inscrita en el Registro de Asociaciones del Principado de Asturias (nº 13148), con NIF G05426242.",
    ],
    commitmentEyebrow: "Fines estatutarios",
    commitment: "Nuestros estatutos recogen, además de la inclusión social y la ayuda a las personas, fines de sensibilización sobre el medio ambiente, la paz, la igualdad, la salud y el uso responsable de la tecnología. Los desarrollamos con proyectos concretos a medida que contamos con medios.",
    cta: "Leer nuestros principios",
  },
  en: {
    title: "Our mission.",
    intro: "INICIA Foundation is a non-profit association founded in Gijón (Asturias, Spain) in 2021. We support vulnerable people and families —above all families displaced by the war in Ukraine and migrants— so that they can start again in Asturias: we help them with paperwork, access to public services, housing, schooling, healthcare, employment and material aid. Since 2021 we have supported 2,561 Ukrainian families and 1,380 families of other origins and local residents.",
    areasEyebrow: "What we do",
    areasTitle: "Six concrete lines of work.",
    areasIntro: "Every family arrives with a different situation. We listen, explain the steps in their language and stay with them until they can find their own way around the services and resources of the community.",
    areas: [
      ["Paperwork and access to services", "Information, guidance and accompaniment with administrative procedures and access to public resources: housing, school places for children, healthcare and social benefits. When appropriate, we refer people to the competent social and public services."],
      ["Material aid", "We collect and deliver clothes, household items, food and other goods donated by individuals and partner organisations, and organise exchanges of goods and services for the families we support."],
      ["Employment guidance", "Help with job searching, CVs and interviews, and referral to public employment services and training programmes."],
      ["Translation and accompaniment", "Volunteers go with families to appointments, translate between Ukrainian, Russian, English and Spanish and help with transport when needed."],
      ["Community and volunteering", "We organise solidarity and community activities with organisations in Asturias and coordinate the volunteers who make all our work possible."],
      ["New programmes", "We are preparing CoopAstur AgroSocial, an agroecological cooperative to create training and jobs in rural areas, and digital inclusion programmes for people with less access to technology."],
    ],
    objectivesEyebrow: "Who we help and how we work",
    objectivesTitle: "Close to people, run by volunteers.",
    objectivesIntro: "This is how INICIA Foundation works day to day:",
    objectives: [
      "We help families displaced by the war in Ukraine, migrants and refugees, and residents of Asturias in vulnerable situations.",
      "Our support is free and you do not need to be a member of the association.",
      "We answer in Spanish, Ukrainian, Russian and English, by WhatsApp, phone, e-mail or in person.",
      "All our work is done by volunteers. Between 2021 and 2025 the association had no paid staff and received no grants: costs were covered by the members themselves.",
      "We work with social, sports and business organisations in Asturias and refer people to public services when their needs require it.",
      "Every request sent through the website receives a reference number and a personal reply.",
      "We are registered in the Register of Associations of the Principality of Asturias (no. 13148), tax number G05426242.",
    ],
    commitmentEyebrow: "Statutory purposes",
    commitment: "Besides social inclusion and direct help to people, our statutes include awareness-raising purposes on the environment, peace, equality, health and the responsible use of technology. We develop them through concrete projects as resources allow.",
    cta: "Read our principles",
  },
  ru: {
    title: "Наша миссия.",
    intro: "INICIA Foundation — некоммерческая ассоциация, основанная в Хихоне (Астурия, Испания) в 2021 году. Мы сопровождаем людей и семьи в трудной ситуации — прежде всего семьи, вынужденно покинувшие Украину из-за войны, и мигрантов, — чтобы они могли начать жизнь заново в Астурии: помогаем с документами, доступом к государственным службам, жильём, школой для детей, медицинской помощью, работой и материальной поддержкой. С 2021 года мы помогли 2 561 украинской семье и 1 380 семьям другого происхождения и местным жителям.",
    areasEyebrow: "Что мы делаем",
    areasTitle: "Шесть конкретных направлений работы.",
    areasIntro: "У каждой семьи своя ситуация. Мы выслушиваем, объясняем шаги на родном языке и сопровождаем до тех пор, пока человек не сможет сам ориентироваться в службах и ресурсах.",
    areas: [
      ["Документы и доступ к услугам", "Информация, консультации и сопровождение при оформлении документов и получении государственных услуг: жильё, место в школе для детей, медицинская помощь и социальные пособия. При необходимости направляем в профильные социальные и государственные службы."],
      ["Материальная помощь", "Собираем и передаём одежду, вещи для дома, продукты и другие пожертвования частных лиц и организаций-партнёров, организуем обмен вещами и услугами для семей."],
      ["Помощь в трудоустройстве", "Поиск работы, резюме и подготовка к собеседованиям, направление в государственные службы занятости и на программы обучения."],
      ["Перевод и сопровождение", "Волонтёры сопровождают семьи на приёмы, переводят с украинского, русского и английского на испанский и помогают с транспортом."],
      ["Сообщество и волонтёрство", "Проводим благотворительные и общественные мероприятия с организациями Астурии и координируем волонтёров, благодаря которым возможна вся наша работа."],
      ["Новые программы", "Готовим CoopAstur AgroSocial — агроэкологический кооператив для обучения и рабочих мест в сельской местности — и программы цифровой грамотности для людей с ограниченным доступом к технологиям."],
    ],
    objectivesEyebrow: "Кому мы помогаем и как работаем",
    objectivesTitle: "Рядом с людьми, силами волонтёров.",
    objectivesIntro: "Так INICIA Foundation работает каждый день:",
    objectives: [
      "Мы помогаем семьям, вынужденно покинувшим Украину из-за войны, мигрантам и беженцам, а также жителям Астурии в трудной ситуации.",
      "Помощь бесплатная и не требует членства в ассоциации.",
      "Отвечаем на испанском, украинском, русском и английском — в WhatsApp, по телефону, электронной почте или лично.",
      "Вся работа ведётся волонтёрами. С 2021 по 2025 год у ассоциации не было наёмных сотрудников и грантов: расходы покрывали сами члены ассоциации.",
      "Сотрудничаем с социальными и спортивными организациями и компаниями Астурии, направляем в государственные службы, когда это нужно.",
      "Каждая заявка с сайта получает номер и личный ответ.",
      "Ассоциация зарегистрирована в Реестре ассоциаций Княжества Астурия (№ 13148), NIF G05426242.",
    ],
    commitmentEyebrow: "Уставные цели",
    commitment: "Помимо социальной интеграции и прямой помощи людям, наш устав включает просветительские цели в области экологии, мира, равенства, здоровья и ответственного использования технологий. Мы развиваем их через конкретные проекты по мере появления ресурсов.",
    cta: "Наши принципы",
  },
  uk: {
    title: "Наша місія.",
    intro: "INICIA Foundation — неприбуткова асоціація, заснована в Хіхоні (Астурія, Іспанія) у 2021 році. Ми супроводжуємо людей і родини у скрутному становищі — насамперед родини, які вимушено виїхали з України через війну, та мігрантів, — щоб вони могли почати життя заново в Астурії: допомагаємо з документами, доступом до державних служб, житлом, школою для дітей, медичною допомогою, роботою та матеріальною підтримкою. З 2021 року ми допомогли 2 561 українській родині та 1 380 родинам іншого походження й місцевим мешканцям.",
    areasEyebrow: "Що ми робимо",
    areasTitle: "Шість конкретних напрямів роботи.",
    areasIntro: "У кожної родини своя ситуація. Ми вислуховуємо, пояснюємо кроки рідною мовою і супроводжуємо доти, доки людина не зможе сама орієнтуватися в службах і ресурсах.",
    areas: [
      ["Документи та доступ до послуг", "Інформація, консультації та супровід під час оформлення документів і отримання державних послуг: житло, місце в школі для дітей, медична допомога та соціальні виплати. За потреби скеровуємо до профільних соціальних і державних служб."],
      ["Матеріальна допомога", "Збираємо й передаємо одяг, речі для дому, продукти та інші пожертви приватних осіб і організацій-партнерів, організовуємо обмін речами та послугами для родин."],
      ["Допомога з працевлаштуванням", "Пошук роботи, резюме та підготовка до співбесід, скерування до державних служб зайнятості та на програми навчання."],
      ["Переклад і супровід", "Волонтери супроводжують родини на прийоми, перекладають з української, російської та англійської на іспанську й допомагають із транспортом."],
      ["Громада та волонтерство", "Проводимо благодійні та громадські заходи з організаціями Астурії й координуємо волонтерів, завдяки яким можлива вся наша робота."],
      ["Нові програми", "Готуємо CoopAstur AgroSocial — агроекологічний кооператив для навчання й робочих місць у сільській місцевості — та програми цифрової грамотності для людей з обмеженим доступом до технологій."],
    ],
    objectivesEyebrow: "Кому ми допомагаємо і як працюємо",
    objectivesTitle: "Поруч із людьми, силами волонтерів.",
    objectivesIntro: "Так INICIA Foundation працює щодня:",
    objectives: [
      "Ми допомагаємо родинам, які вимушено виїхали з України через війну, мігрантам і біженцям, а також мешканцям Астурії у скрутному становищі.",
      "Допомога безкоштовна і не вимагає членства в асоціації.",
      "Відповідаємо іспанською, українською, російською та англійською — у WhatsApp, телефоном, електронною поштою або особисто.",
      "Уся робота ведеться волонтерами. З 2021 по 2025 рік асоціація не мала найманих працівників і грантів: витрати покривали самі члени асоціації.",
      "Співпрацюємо із соціальними та спортивними організаціями й компаніями Астурії, скеровуємо до державних служб, коли це потрібно.",
      "Кожна заявка з сайту отримує номер і особисту відповідь.",
      "Асоціацію зареєстровано в Реєстрі асоціацій Князівства Астурія (№ 13148), NIF G05426242.",
    ],
    commitmentEyebrow: "Статутні цілі",
    commitment: "Окрім соціальної інтеграції та прямої допомоги людям, наш статут містить просвітницькі цілі у сфері довкілля, миру, рівності, здоров’я та відповідального використання технологій. Ми розвиваємо їх через конкретні проєкти в міру появи ресурсів.",
    cta: "Наші принципи",
  },
  ast: {
    title: "La nuestra misión.",
    intro: "INICIA Foundation ye una asociación ensin ánimu de llucru creada en Xixón (Asturies) en 2021. Acompañamos a persones y families en situación de vulnerabilidá —sobre too families desplazaes pola guerra d'Ucraína y persones migrantes— pa que puedan entamar de nuevo n'Asturies: ayudámos-yos colos trámites, l'accesu a los servicios públicos, la vivienda, la escolarización, la salú, l'empléu y l'ayuda material. Dende 2021 acompañemos a 2.561 families ucraínes y a 1.380 families d'otros oríxenes y vecinos.",
    areasEyebrow: "Qué facemos",
    areasTitle: "Seis llinies de trabayu concretes.",
    areasIntro: "Cada familia llega con una situación distinta. Escuchamos, esplicamos los pasos na so llingua y acompañámosla hasta que puede movese sola pelos servicios y recursos de la comunidá.",
    areas: [
      ["Trámites y accesu a recursos", "Información, orientación y acompañamientu en trámites alministrativos y nel accesu a los recursos públicos: vivienda, escolarización de los neños, atención sanitaria y ayudes sociales. Cuando correspuende, derivamos a los servicios sociales y públicos competentes."],
      ["Ayuda material", "Recoyemos y entregamos ropa, enseres, alimentos y otros bienes donaos por particulares y entidaes collaboradores, y organizamos l'intercambiu de bienes y servicios en favor de les families que acompañamos."],
      ["Orientación pal empléu", "Sofitu na busca de trabayu, preparación del currículum y de les entrevistes, y derivación a los servicios públicos d'empléu y a programes de formación."],
      ["Traducción y acompañamientu", "Persones voluntaries acompañen a les families a cites y xestiones, traducen ente ucraín, rusu, inglés y castellán y ayuden col tresporte cuando fai falta."],
      ["Comunidá y voluntariáu", "Organizamos aiciones solidaries y de convivencia con entidaes d'Asturies y coordinamos a les persones voluntaries que faen posible tol nuestru trabayu."],
      ["Programes nuevos", "Preparamos CoopAstur AgroSocial, una cooperativa agroecolóxica pa crear formación y empléu nel mediu rural, y programes d'inclusión dixital pa persones con menos accesu a la teunoloxía."],
    ],
    objectivesEyebrow: "A quién atendemos y cómo trabayamos",
    objectivesTitle: "Cerca de les persones, con medios voluntarios.",
    objectivesIntro: "Asina funciona INICIA Foundation cada día:",
    objectives: [
      "Atendemos a families desplazaes pola guerra n'Ucraína, a persones migrantes y refuxaes y a vecinos d'Asturies en situación de vulnerabilidá.",
      "L'atención ye de baldre y nun esixe ser sociu o socia de l'asociación.",
      "Contestamos en castellán, ucraín, rusu ya inglés, per WhatsApp, teléfonu, corréu electrónicu o en persona.",
      "Tol trabayu faenlu persones voluntaries. Ente 2021 y 2025 l'asociación nun tuvo personal asalariáu nin recibió subvenciones: los gastos asumiéronlos les mesmes persones asociaes.",
      "Collaboramos con entidaes sociales, deportives y empreses d'Asturies, y derivamos a los servicios públicos cuando la necesidá lo pide.",
      "Cada solicitú que llega pela web recibe un númberu de referencia y una rempuesta personal.",
      "Somos una entidá inscrita nel Rexistru d'Asociaciones del Principáu d'Asturies (nº 13148), con NIF G05426242.",
    ],
    commitmentEyebrow: "Fines estatutarios",
    commitment: "Los nuestros estatutos recueyen, amás de la inclusión social y l'ayuda a les persones, fines de sensibilización sobre'l mediu ambiente, la paz, la igualdá, la salú y l'usu responsable de la teunoloxía. Desendolcámoslos con proyeutos concretos a midida que tenemos medios.",
    cta: "Lleer los nuestros principios",
  },
};

export default function Mission() {
  const [locale] = useLocale();
  const t = copy[locale];
  return <main className="min-h-screen bg-[#060A12] text-[#EEE7D7]"><OriginalSiteNavigation />
    <section className="relative isolate overflow-hidden bg-[#060A12] bg-[#08101E] pt-28 pb-24 text-white"><img src="/assets/photos/whale-1920.webp" srcSet="/assets/photos/whale-480.webp 480w, /assets/photos/whale-720.webp 720w, /assets/photos/whale-960.webp 960w, /assets/photos/whale-1920.webp 1920w" sizes="100vw" alt="Ballena en el océano iluminada por el sol: misión y fines de INICIA Foundation" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#060A12] via-[#060A12]/80 to-[#060A12]/25" /><div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#060A12] to-transparent" /><div className="mx-auto max-w-7xl px-5"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#D6B25E]">INICIA Foundation</p><h1 className="mt-4 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">{t.title}</h1><p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200">{t.intro}</p></div></section>
    <section className="mx-auto max-w-7xl px-5 py-20"><div className="max-w-4xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.areasEyebrow}</p><h2 className="mt-3 font-serif text-4xl md:text-5xl">{t.areasTitle}</h2><p className="mt-6 leading-8 text-slate-200">{t.areasIntro}</p></div>
      <div className="mt-12 grid gap-5 md:grid-cols-2">{t.areas.map(([title, text], index) => { const Icon = AREA_ICONS[index]; return <article key={title} className="rounded-3xl border border-[#D6B25E]/20 bg-[#0C1320] p-8 shadow-sm"><Icon className="h-7 w-7 text-[#D6B25E]" /><h3 className="mt-5 font-serif text-3xl">{title}</h3><p className="mt-4 leading-7 text-slate-300">{text}</p></article>; })}</div>
      <section className="mt-16 border-t border-[#D6B25E]/20 pt-12"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.objectivesEyebrow}</p><h2 className="mt-3 max-w-4xl font-serif text-4xl">{t.objectivesTitle}</h2><p className="mt-5 max-w-4xl leading-8 text-slate-200">{t.objectivesIntro}</p><ol className="mt-8 grid gap-4 md:grid-cols-2">{t.objectives.map((objective, index) => <li key={objective} className="flex gap-4 rounded-2xl bg-[#0C1320] p-6 shadow-sm"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#D6B25E] text-sm font-bold text-[#120D05]">{index + 1}</span><p className="text-sm leading-7 text-slate-300">{objective}</p></li>)}</ol></section>
      <div className="mt-12 rounded-3xl border border-[#D6B25E]/40 bg-[#D6B25E]/10 p-8 md:p-10"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.commitmentEyebrow}</p><p className="mt-4 max-w-4xl font-serif text-3xl leading-tight">{t.commitment}</p><Link href="/ideologia" className="mt-7 inline-flex items-center rounded-full bg-[#08101E] px-5 py-3 text-sm font-bold text-white">{t.cta} <ArrowRight className="ml-2 h-4 w-4" /></Link></div>
    </section>
    <CtaBand /><SiteFooter />
  </main>;
}
