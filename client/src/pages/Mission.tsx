import { CtaBand } from "@/components/CtaBand";
import { ArrowRight, HeartHandshake, Leaf, Scale, ShieldAlert, UsersRound } from "lucide-react";
import { Link } from "wouter";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { SiteFooter } from "@/components/SiteFooter";
import { type Locale, useLocale } from "@/lib/i18n";

const AREA_ICONS = [Leaf, ShieldAlert, Scale, UsersRound, HeartHandshake, ShieldAlert];

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
    title: "Misión y fines estatutarios.",
    intro: "Nuestra misión se fundamenta en la dignidad humana, la justicia social, la sostenibilidad ambiental, la paz, la participación y la prevención responsable de riesgos globales. INICIA desarrolla su contribución desde el ámbito cívico, comunitario y de interés público.",
    areasEyebrow: "Texto íntegro estructurado",
    areasTitle: "Ámbitos de actuación definidos en los fines de la organización.",
    areasIntro: "Los siguientes ámbitos recogen de forma estructurada los objetivos remitidos por la organización. No significan que INICIA afirme resolver por sí sola problemas globales; expresan el marco social, educativo, comunitario y de sensibilización desde el que orienta sus iniciativas.",
    areas: [
      ["Medio ambiente, biodiversidad y clima", "Promover la sensibilización ante la contaminación ambiental y del aire, la degradación de mares y océanos, la disminución de la biodiversidad, el calentamiento global, el efecto invernadero, los agujeros de ozono y la contaminación radiactiva."],
      ["Paz y seguridad humana", "Contribuir a una cultura de paz, prevenir la amenaza de guerra nuclear y fomentar la conciencia sobre la proliferación no autorizada de tecnologías nucleares y otros riesgos que afectan a todos los pueblos."],
      ["Igualdad, desarrollo y derechos", "Abordar la brecha Norte-Sur, el atraso de territorios y comunidades, el hambre, la desnutrición, el analfabetismo, la desigualdad social, el desempleo, la violencia y el crimen organizado desde la sensibilización, la cooperación y la participación cívica."],
      ["Recursos, alimentación y demografía", "Favorecer la reflexión sobre el acceso justo a alimentos, agua y recursos naturales; el agotamiento de recursos energéticos y materiales; los desafíos demográficos, el envejecimiento y la escasa conciencia social sobre esta etapa de la vida."],
      ["Salud y bienestar colectivo", "Impulsar la conciencia pública sobre grandes desafíos de salud y bienestar, incluidos el envejecimiento y enfermedades de alto impacto social. INICIA no realiza diagnósticos, tratamientos ni asesoramiento clínico."],
      ["Tecnología y riesgos globales", "Promover una mirada responsable sobre catástrofes globales, amenazas a la existencia humana y tecnologías emergentes —incluida la inteligencia artificial— sin sustituir a autoridades, especialistas ni instituciones competentes."],
    ],
    objectivesEyebrow: "Relación completa de fines remitidos por la organización",
    objectivesTitle: "Objetivos estatutarios, sin omisiones temáticas.",
    objectivesIntro: "Esta relación conserva de forma completa los ámbitos que la organización ha proporcionado. Su publicación expresa un marco de fines y sensibilización; no atribuye a INICIA la resolución individual o exclusiva de estos desafíos.",
    objectives: [
      "Problemas ambientales globales: contaminación ambiental, disminución de la biodiversidad, contaminación del aire, contaminación de mares y océanos, calentamiento global, efecto invernadero y agujeros de ozono.",
      "Evitar la amenaza de la guerra nuclear y asegurar la paz para todos los pueblos, evitando a la comunidad mundial la proliferación no autorizada de tecnologías nucleares y la contaminación radiactiva del medio ambiente.",
      "El problema del atraso de los países del tercer mundo y los problemas demográficos de la humanidad: crecimiento demográfico en los países en desarrollo y crisis demográfica en los países desarrollados.",
      "Hambre y desnutrición; suministro de recursos a la humanidad; agotamiento de petróleo, gas natural, carbón, madera y metales no ferrosos; escasez de recursos acuáticos; uso responsable de los recursos del océano y exploración espacial.",
      "El problema no resuelto del envejecimiento humano y la escasa conciencia pública sobre el envejecimiento.",
      "El problema Norte-Sur: la brecha de desarrollo entre países ricos y pobres, el hambre y el analfabetismo.",
      "El calentamiento global, los agujeros de ozono, las enfermedades cardiovasculares, el cáncer y el SIDA; el terrorismo y el peligro de asteroides.",
      "La subestimación de amenazas a la existencia humana, como el desarrollo de inteligencia artificial hostil y las catástrofes globales.",
      "La desigualdad social —incluida la brecha entre el 1 % más rico y el resto de la humanidad—, el aumento del desempleo, la violencia y el crimen organizado.",
    ],
    commitmentEyebrow: "Compromiso de actuación",
    commitment: "INICIA orienta sus proyectos hacia la inclusión, el apoyo social, el desarrollo comunitario, la cooperación responsable y la defensa del interés público, dentro de sus capacidades, recursos disponibles y marcos legales aplicables.",
    cta: "Leer Ideología",
  },
  en: {
    title: "Mission and statutory purposes.",
    intro: "Our mission is grounded in human dignity, social justice, environmental sustainability, peace, participation and the responsible prevention of global risks. INICIA makes its contribution through civic and community action in the public interest.",
    areasEyebrow: "Full text, structured",
    areasTitle: "Areas of action defined in the organisation's purposes.",
    areasIntro: "The following areas present, in structured form, the objectives submitted by the organisation. They do not mean that INICIA claims to solve global problems on its own; they set out the social, educational, community and awareness-raising framework that guides its initiatives.",
    areas: [
      ["Environment, biodiversity and climate", "Raising awareness of environmental and air pollution, the degradation of seas and oceans, biodiversity loss, global warming, the greenhouse effect, ozone holes and radioactive contamination."],
      ["Peace and human security", "Contributing to a culture of peace, preventing the threat of nuclear war and raising awareness of the unauthorised proliferation of nuclear technologies and other risks affecting all peoples."],
      ["Equality, development and rights", "Addressing the North–South divide, the lagging development of territories and communities, hunger, malnutrition, illiteracy, social inequality, unemployment, violence and organised crime through awareness-raising, cooperation and civic participation."],
      ["Resources, food and demography", "Encouraging reflection on fair access to food, water and natural resources; the depletion of energy and material resources; demographic challenges, ageing and the limited public awareness of this stage of life."],
      ["Health and collective well-being", "Promoting public awareness of major health and well-being challenges, including ageing and diseases with a high social impact. INICIA does not provide diagnoses, treatment or clinical advice."],
      ["Technology and global risks", "Promoting a responsible outlook on global catastrophes, threats to human existence and emerging technologies — including artificial intelligence — without replacing the competent authorities, specialists or institutions."],
    ],
    objectivesEyebrow: "Complete list of purposes submitted by the organisation",
    objectivesTitle: "Statutory objectives, with no topics omitted.",
    objectivesIntro: "This list preserves in full the areas provided by the organisation. Its publication sets out a framework of purposes and awareness-raising; it does not attribute to INICIA the individual or exclusive resolution of these challenges.",
    objectives: [
      "Global environmental problems: environmental pollution, biodiversity loss, air pollution, pollution of seas and oceans, global warming, the greenhouse effect and ozone holes.",
      "Averting the threat of nuclear war and securing peace for all peoples, protecting the world community from the unauthorised proliferation of nuclear technologies and the radioactive contamination of the environment.",
      "The problem of the underdevelopment of developing countries and humanity's demographic problems: population growth in developing countries and demographic crisis in developed countries.",
      "Hunger and malnutrition; supplying humanity with resources; the depletion of oil, natural gas, coal, timber and non-ferrous metals; scarcity of water resources; responsible use of ocean resources and space exploration.",
      "The unresolved problem of human ageing and the limited public awareness of ageing.",
      "The North–South problem: the development gap between rich and poor countries, hunger and illiteracy.",
      "Global warming, ozone holes, cardiovascular disease, cancer and AIDS; terrorism and the danger of asteroids.",
      "The underestimation of threats to human existence, such as the development of hostile artificial intelligence and global catastrophes.",
      "Social inequality — including the gap between the richest 1% and the rest of humanity — rising unemployment, violence and organised crime.",
    ],
    commitmentEyebrow: "Commitment to action",
    commitment: "INICIA directs its projects towards inclusion, social support, community development, responsible cooperation and the defence of the public interest, within its capacities, available resources and applicable legal frameworks.",
    cta: "Read our Ideology",
  },
  ru: {
    title: "Миссия и уставные цели.",
    intro: "Наша миссия основана на человеческом достоинстве, социальной справедливости, экологической устойчивости, мире, участии и ответственном предотвращении глобальных рисков. INICIA вносит свой вклад в рамках гражданской, общественной и общественно полезной деятельности.",
    areasEyebrow: "Полный текст в структурированном виде",
    areasTitle: "Направления деятельности, определённые целями организации.",
    areasIntro: "Ниже в структурированном виде представлены цели, сформулированные организацией. Это не означает, что INICIA претендует на самостоятельное решение глобальных проблем; они определяют социальные, образовательные, общественные и просветительские рамки, которыми организация руководствуется в своих инициативах.",
    areas: [
      ["Окружающая среда, биоразнообразие и климат", "Повышение осведомлённости о загрязнении окружающей среды и воздуха, деградации морей и океанов, сокращении биоразнообразия, глобальном потеплении, парниковом эффекте, озоновых дырах и радиоактивном загрязнении."],
      ["Мир и безопасность человека", "Содействие культуре мира, предотвращение угрозы ядерной войны и повышение осведомлённости о несанкционированном распространении ядерных технологий и других рисках, затрагивающих все народы."],
      ["Равенство, развитие и права", "Работа с проблемами разрыва между Севером и Югом, отставания территорий и сообществ, голода, недоедания, неграмотности, социального неравенства, безработицы, насилия и организованной преступности через просвещение, сотрудничество и гражданское участие."],
      ["Ресурсы, продовольствие и демография", "Содействие осмыслению справедливого доступа к продовольствию, воде и природным ресурсам; истощения энергетических и материальных ресурсов; демографических вызовов, старения и недостаточной общественной осведомлённости об этом этапе жизни."],
      ["Здоровье и общее благополучие", "Повышение общественной осведомлённости о крупных вызовах в сфере здоровья и благополучия, включая старение и заболевания с высокой социальной значимостью. INICIA не проводит диагностику, лечение и не даёт клинических консультаций."],
      ["Технологии и глобальные риски", "Продвижение ответственного взгляда на глобальные катастрофы, угрозы существованию человечества и новые технологии — включая искусственный интеллект — без подмены компетентных органов, специалистов и учреждений."],
    ],
    objectivesEyebrow: "Полный перечень целей, представленных организацией",
    objectivesTitle: "Уставные цели без тематических пропусков.",
    objectivesIntro: "Этот перечень полностью сохраняет направления, представленные организацией. Его публикация отражает рамки целей и просветительской работы и не приписывает INICIA единоличного или исключительного решения этих проблем.",
    objectives: [
      "Глобальные экологические проблемы: загрязнение окружающей среды, сокращение биоразнообразия, загрязнение воздуха, загрязнение морей и океанов, глобальное потепление, парниковый эффект и озоновые дыры.",
      "Предотвращение угрозы ядерной войны и обеспечение мира для всех народов, защита мирового сообщества от несанкционированного распространения ядерных технологий и радиоактивного загрязнения окружающей среды.",
      "Проблема отсталости стран третьего мира и демографические проблемы человечества: рост населения в развивающихся странах и демографический кризис в развитых странах.",
      "Голод и недоедание; обеспечение человечества ресурсами; истощение запасов нефти, природного газа, угля, древесины и цветных металлов; нехватка водных ресурсов; ответственное использование ресурсов океана и освоение космоса.",
      "Нерешённая проблема старения человека и недостаточная общественная осведомлённость о старении.",
      "Проблема «Север — Юг»: разрыв в развитии между богатыми и бедными странами, голод и неграмотность.",
      "Глобальное потепление, озоновые дыры, сердечно-сосудистые заболевания, рак и СПИД; терроризм и астероидная опасность.",
      "Недооценка угроз существованию человечества, таких как создание враждебного искусственного интеллекта и глобальные катастрофы.",
      "Социальное неравенство — включая разрыв между 1 % самых богатых и остальным человечеством, — рост безработицы, насилие и организованная преступность.",
    ],
    commitmentEyebrow: "Обязательства в действии",
    commitment: "INICIA направляет свои проекты на инклюзию, социальную поддержку, развитие сообществ, ответственное сотрудничество и защиту общественных интересов в пределах своих возможностей, доступных ресурсов и применимой правовой базы.",
    cta: "Читать об идеологии",
  },
  uk: {
    title: "Місія та статутні цілі.",
    intro: "Наша місія ґрунтується на людській гідності, соціальній справедливості, екологічній сталості, мирі, участі та відповідальному запобіганні глобальним ризикам. INICIA робить свій внесок у межах громадянської, громадської та суспільно корисної діяльності.",
    areasEyebrow: "Повний текст у структурованому вигляді",
    areasTitle: "Напрями діяльності, визначені цілями організації.",
    areasIntro: "Нижче у структурованому вигляді наведено цілі, сформульовані організацією. Це не означає, що INICIA претендує на самостійне розв’язання глобальних проблем; вони визначають соціальні, освітні, громадські та просвітницькі рамки, якими організація керується у своїх ініціативах.",
    areas: [
      ["Довкілля, біорізноманіття та клімат", "Підвищення обізнаності щодо забруднення довкілля й повітря, деградації морів і океанів, скорочення біорізноманіття, глобального потепління, парникового ефекту, озонових дір і радіоактивного забруднення."],
      ["Мир і безпека людини", "Сприяння культурі миру, запобігання загрозі ядерної війни та підвищення обізнаності щодо несанкціонованого поширення ядерних технологій та інших ризиків, що стосуються всіх народів."],
      ["Рівність, розвиток і права", "Робота з проблемами розриву між Північчю та Півднем, відставання територій і громад, голоду, недоїдання, неписьменності, соціальної нерівності, безробіття, насильства та організованої злочинності через просвіту, співпрацю та громадянську участь."],
      ["Ресурси, продовольство та демографія", "Сприяння осмисленню справедливого доступу до продовольства, води та природних ресурсів; виснаження енергетичних і матеріальних ресурсів; демографічних викликів, старіння та недостатньої суспільної обізнаності про цей етап життя."],
      ["Здоров’я та спільний добробут", "Підвищення суспільної обізнаності щодо великих викликів у сфері здоров’я та добробуту, зокрема старіння та захворювань із високою соціальною значущістю. INICIA не проводить діагностики, лікування та не надає клінічних консультацій."],
      ["Технології та глобальні ризики", "Просування відповідального погляду на глобальні катастрофи, загрози існуванню людства та нові технології — зокрема штучний інтелект — без підміни компетентних органів, фахівців та установ."],
    ],
    objectivesEyebrow: "Повний перелік цілей, наданих організацією",
    objectivesTitle: "Статутні цілі без тематичних пропусків.",
    objectivesIntro: "Цей перелік повністю зберігає напрями, надані організацією. Його публікація відображає рамки цілей і просвітницької роботи та не приписує INICIA одноосібного чи виключного розв’язання цих проблем.",
    objectives: [
      "Глобальні екологічні проблеми: забруднення довкілля, скорочення біорізноманіття, забруднення повітря, забруднення морів і океанів, глобальне потепління, парниковий ефект і озонові діри.",
      "Запобігання загрозі ядерної війни та забезпечення миру для всіх народів, захист світової спільноти від несанкціонованого поширення ядерних технологій і радіоактивного забруднення довкілля.",
      "Проблема відсталості країн третього світу та демографічні проблеми людства: зростання населення в країнах, що розвиваються, і демографічна криза в розвинених країнах.",
      "Голод і недоїдання; забезпечення людства ресурсами; виснаження запасів нафти, природного газу, вугілля, деревини та кольорових металів; нестача водних ресурсів; відповідальне використання ресурсів океану та освоєння космосу.",
      "Невирішена проблема старіння людини та недостатня суспільна обізнаність про старіння.",
      "Проблема «Північ — Південь»: розрив у розвитку між багатими та бідними країнами, голод і неписьменність.",
      "Глобальне потепління, озонові діри, серцево-судинні захворювання, рак і СНІД; тероризм і астероїдна небезпека.",
      "Недооцінка загроз існуванню людства, таких як створення ворожого штучного інтелекту та глобальні катастрофи.",
      "Соціальна нерівність — зокрема розрив між 1 % найбагатших і рештою людства, — зростання безробіття, насильство та організована злочинність.",
    ],
    commitmentEyebrow: "Зобов’язання в дії",
    commitment: "INICIA спрямовує свої проєкти на інклюзію, соціальну підтримку, розвиток громад, відповідальну співпрацю та захист суспільних інтересів у межах своїх можливостей, доступних ресурсів і чинної правової бази.",
    cta: "Читати про ідеологію",
  },
  ast: {
    title: "Misión y fines estatutarios.",
    intro: "La nuestra misión fundaméntase na dignidá humana, la xusticia social, la sostenibilidá ambiental, la paz, la participación y la prevención responsable de riesgos globales. INICIA desendolca la so contribución dende l'ámbitu cívicu, comunitariu y d'interés públicu.",
    areasEyebrow: "Testu íntegru estructuráu",
    areasTitle: "Ámbitos d'actuación definíos nos fines de la organización.",
    areasIntro: "Los ámbitos siguientes recueyen de forma estructurada los oxetivos unviaos pola organización. Nun significa qu'INICIA afirme resolver sola problemes globales; espresen el marcu social, educativu, comunitariu y de sensibilización dende'l qu'orienta les sos iniciatives.",
    areas: [
      ["Mediu ambiente, biodiversidá y clima", "Promover la sensibilización énte la contaminación ambiental y del aire, la degradación de mares y océanos, la mengua de la biodiversidá, el calentamientu global, l'efeutu ivernaderu, los furacos d'ozonu y la contaminación radiactiva."],
      ["Paz y seguridá humana", "Contribuyir a una cultura de paz, prevenir l'amenaza de guerra nuclear y fomentar la conciencia sobre la proliferación non autorizada de teunoloxíes nucleares y otros riesgos qu'afeuten a tolos pueblos."],
      ["Igualdá, desendolcu y derechos", "Abordar la fienda Norte-Sur, l'atrasu de territorios y comunidaes, la fame, la desnutrición, l'analfabetismu, la desigualdá social, el desempléu, la violencia y el crime organizáu dende la sensibilización, la cooperación y la participación cívica."],
      ["Recursos, alimentación y demografía", "Favorecer la reflexón sobre l'accesu xustu a alimentos, agua y recursos naturales; l'escosamientu de recursos enerxéticos y materiales; los retos demográficos, l'avieyamientu y la poca conciencia social sobre esta etapa de la vida."],
      ["Salú y bienestar coleutivu", "Impulsar la conciencia pública sobre grandes retos de salú y bienestar, incluyíos l'avieyamientu y enfermedaes d'altu impactu social. INICIA nun fai diagnósticos, tratamientos nin asesoramientu clínicu."],
      ["Teunoloxía y riesgos globales", "Promover una mirada responsable sobre catástrofes globales, amenaces a la esistencia humana y teunoloxíes emerxentes —incluyida la intelixencia artificial— ensin sustituyir a autoridaes, especialistes nin instituciones competentes."],
    ],
    objectivesEyebrow: "Rellación completa de fines unviaos pola organización",
    objectivesTitle: "Oxetivos estatutarios, ensin omisiones temátiques.",
    objectivesIntro: "Esta rellación caltién de forma completa los ámbitos que la organización proporcionó. La so publicación espresa un marcu de fines y sensibilización; nun-y atribuye a INICIA la resolución individual o esclusiva d'estos retos.",
    objectives: [
      "Problemes ambientales globales: contaminación ambiental, mengua de la biodiversidá, contaminación del aire, contaminación de mares y océanos, calentamientu global, efeutu ivernaderu y furacos d'ozonu.",
      "Evitar l'amenaza de la guerra nuclear y asegurar la paz pa tolos pueblos, evitándo-y a la comunidá mundial la proliferación non autorizada de teunoloxíes nucleares y la contaminación radiactiva del mediu ambiente.",
      "El problema del atrasu de los países del tercer mundu y los problemes demográficos de la humanidá: crecimientu demográficu nos países en desendolcu y crisis demográfica nos países desendolcaos.",
      "Fame y desnutrición; suministru de recursos a la humanidá; escosamientu de petróleu, gas natural, carbón, madera y metales non ferrosos; escasez de recursos acuáticos; usu responsable de los recursos del océanu y esploración espacial.",
      "El problema ensin resolver del avieyamientu humanu y la poca conciencia pública sobre l'avieyamientu.",
      "El problema Norte-Sur: la fienda de desendolcu ente países ricos y probes, la fame y l'analfabetismu.",
      "El calentamientu global, los furacos d'ozonu, les enfermedaes cardiovasculares, el cáncer y el SIDA; el terrorismu y el peligru d'asteroides.",
      "La infravaloración d'amenaces a la esistencia humana, como'l desendolcu d'intelixencia artificial hostil y les catástrofes globales.",
      "La desigualdá social —incluyida la fienda ente l'1 % más ricu y el restu de la humanidá—, l'aumentu del desempléu, la violencia y el crime organizáu.",
    ],
    commitmentEyebrow: "Compromisu d'actuación",
    commitment: "INICIA orienta los sos proyeutos a la inclusión, l'apoyu social, el desendolcu comunitariu, la cooperación responsable y la defensa del interés públicu, dientro de les sos capacidaes, recursos disponibles y marcos llegales aplicables.",
    cta: "Lleer Ideoloxía",
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
