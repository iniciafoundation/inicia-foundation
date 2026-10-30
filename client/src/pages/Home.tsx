import { ArrowRight, Building2, HandHeart, HeartHandshake, LifeBuoy, Lightbulb, MapPin, MessageCircle, Phone, ShieldCheck, Target, UsersRound } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { ProjectVisual } from "@/components/ProjectVisual";
import { SiteFooter } from "@/components/SiteFooter";
import { SocialLinks } from "@/components/SocialLinks";
import { SpiralMark } from "@/components/SpiralMark";
import { forLocale, formatDate, useSettings, useSiteContent } from "@/lib/content";
import { YouTubeLite } from "@/components/YouTubeLite";
import { type Locale, useLocale, contentLocale } from "@/lib/i18n";
import { publicAssets } from "@/lib/publicAssets";
import { type PhotoName, photo } from "@/lib/photos";
import { CONTACT } from "@/lib/siteConfig";
import { useProjects } from "@/lib/projects";
import { AllianceAreas, allianceCopy } from "@/components/AllianceAreas";

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
    badge: "ONG · Asturias, España · desde 2021", heroTitle: "Acompañamos a familias que", heroAccent: "empiezan de nuevo.", heroText: "INICIA Foundation es una asociación sin ánimo de lucro de Gijón (Asturias). Desde 2021 ayudamos a familias desplazadas por la guerra de Ucrania, a personas migrantes y a vecinos en situación de vulnerabilidad con trámites, acceso a recursos, empleo y ayuda material.", ctaHelp: "Necesito ayuda", ctaSupport: "Quiero ayudar", ctaProjects: "Ver proyectos",
    stats: [["2561", "familias ucranianas acompañadas"], ["1380", "familias de otros orígenes y vecinos"], ["20", "iniciativas en marcha y en diseño"], ["2021", "año de fundación"]],
    ribbon: "Inclusión · Comunidad · Formación · Colaboración · Asturias",
    routeTitle: "¿Qué te trae a INICIA?", routes: [["Necesito ayuda", "Alimentos, trámites, empleo o acompañamiento.", "/contacto?tipo=ayuda"], ["Quiero ser voluntario/a", "Tu tiempo y tus habilidades en proyectos reales.", "/contacto?tipo=voluntariado"], ["Soy una organización", "Alianzas, patrocinio y proyectos conjuntos.", "/contacto?tipo=organizacion"], ["Quiero donar", "Bizum, transferencia o material.", "/donar"]],
    aboutEyebrow: "Quiénes somos", aboutTitle: "Una asociación de voluntarios al lado de las familias.", aboutText: "Nacimos en Gijón en 2021. Desde 2022 la mayor parte de nuestro trabajo se centra en las familias que llegan a Asturias huyendo de la guerra en Ucrania, y en personas migrantes y vecinos que necesitan apoyo. Todo lo hacen personas voluntarias, y la atención es gratuita.",
    pillars: [["Trámites y recursos", "Acompañamos en trámites administrativos y en el acceso a vivienda, escolarización, salud y ayudas sociales."], ["Ayuda material", "Ropa, enseres y alimentos donados por particulares y entidades, entregados a las familias que lo necesitan."], ["Empleo y formación", "Currículum, búsqueda de trabajo y derivación a los servicios públicos de empleo y a cursos."]],
    missionEyebrow: "Nuestra misión", missionTitle: "Que nadie tenga que empezar de cero solo.", missionText: "Ayudamos a las personas que llegan o atraviesan un momento difícil en Asturias a orientarse, ejercer sus derechos y ganar autonomía, con información clara, acompañamiento en su idioma y una red de voluntariado y entidades colaboradoras.",
    mission: [["A quién ayudamos", "Familias desplazadas por la guerra en Ucrania, personas migrantes y refugiadas y vecinos de Asturias en situación de vulnerabilidad."], ["Cómo trabajamos", "Atención gratuita, en español, ucraniano, ruso e inglés, realizada por personas voluntarias y coordinada con los servicios públicos."], ["Resultados", "2.561 familias ucranianas y 1.380 familias de otros orígenes y vecinos acompañadas desde 2021."]],
    ideologyLink: "Consultar la sección de Ideología", areasLabel: "Qué hacemos cada día",
    areas: [["Trámites", "Información y acompañamiento en gestiones administrativas y en el acceso a los servicios públicos."], ["Vivienda y escuela", "Orientación en la búsqueda de vivienda y en la escolarización de los niños."], ["Salud", "Ayuda para acceder a la atención sanitaria pública. No realizamos diagnóstico ni tratamiento."], ["Empleo", "Currículum, entrevistas y derivación a servicios de empleo y formación."], ["Traducción", "Voluntarios que traducen y acompañan a las familias a citas y gestiones."], ["Ayuda material", "Recogida y entrega de ropa, enseres y alimentos donados."]],
    projectsEyebrow: "Proyectos destacados", projectsTitle: "Tres iniciativas para conocer INICIA.", projectsText: "El catálogo completo reúne 20 iniciativas y muestra el estado de cada una.", projectsCta: "Explorar todos los proyectos", viewProject: "Ver proyecto", projectImageAlt: "Personas organizando una iniciativa comunitaria",
    newsEyebrow: "Noticias", newsTitle: "Lo último de INICIA.", newsCta: "Todas las noticias",
    partnersEyebrow: "Alianzas", partnersTitle: "Con quién trabajamos.",
    donateEyebrow: "Donar", donateTitle: "Tu apoyo lo hace posible.", donateText: "Dona en segundos por Bizum o transferencia, o aporta material, alimentos o tu tiempo.", donateCta: "Donar ahora", donateOther: "Otras formas de apoyar",
    contactEyebrow: "Contacto", contactTitle: "Hablemos.", contactText: "Gijón: Av. Manuel Llaneza, 68. Avilés, Oviedo, Madrid, Barcelona y Valencia: con cita previa.", whatsapp: "WhatsApp", directions: "Cómo llegar", follow: "Síguenos", formCta: "Escribirnos",
  },
  en: {
    badge: "NGO · Asturias, Spain · since 2021", heroTitle: "We support families who are", heroAccent: "starting again.", heroText: "INICIA Foundation is a non-profit association in Gijón (Asturias, Spain). Since 2021 we have helped families displaced by the war in Ukraine, migrants and local residents in vulnerable situations with paperwork, access to services, employment and material aid.", ctaHelp: "I need help", ctaSupport: "I want to help", ctaProjects: "See projects",
    stats: [["2561", "Ukrainian families supported"], ["1380", "families of other origins and neighbours"], ["20", "initiatives running or in design"], ["2021", "year founded"]],
    ribbon: "Inclusion · Community · Training · Collaboration · Asturias",
    routeTitle: "What brings you to INICIA?", routes: [["I need help", "Food, paperwork, jobs or support.", "/contacto?tipo=ayuda"], ["I want to volunteer", "Your time and skills in real projects.", "/contacto?tipo=voluntariado"], ["I represent an organisation", "Partnerships, sponsorship and joint projects.", "/contacto?tipo=organizacion"], ["I want to donate", "Bizum, bank transfer or goods.", "/donar"]],
    aboutEyebrow: "Who we are", aboutTitle: "A volunteer association standing by families.", aboutText: "We were founded in Gijón in 2021. Since 2022 most of our work has focused on families arriving in Asturias after fleeing the war in Ukraine, as well as migrants and local residents who need support. All our work is done by volunteers and our help is free.",
    pillars: [["Paperwork and services", "We accompany people through administrative procedures and access to housing, schooling, healthcare and social benefits."], ["Material aid", "Clothes, household items and food donated by individuals and organisations, delivered to families in need."], ["Jobs and training", "CVs, job searching and referral to public employment services and courses."]],
    missionEyebrow: "Our mission", missionTitle: "No one should have to start from zero alone.", missionText: "We help people who arrive in Asturias or are going through a hard time to find their way, exercise their rights and become independent, with clear information, support in their own language and a network of volunteers and partner organisations.",
    mission: [["Who we help", "Families displaced by the war in Ukraine, migrants and refugees, and residents of Asturias in vulnerable situations."], ["How we work", "Free support in Spanish, Ukrainian, Russian and English, provided by volunteers and coordinated with public services."], ["Results", "2,561 Ukrainian families and 1,380 families of other origins and local residents supported since 2021."]],
    ideologyLink: "Read our Ideology", areasLabel: "What we do every day",
    areas: [["Paperwork", "Information and accompaniment with administrative procedures and access to public services."], ["Housing and school", "Guidance on finding housing and enrolling children at school."], ["Health", "Help to access public healthcare. We do not diagnose or treat."], ["Employment", "CVs, interviews and referral to employment and training services."], ["Translation", "Volunteers who translate and go with families to appointments."], ["Material aid", "Collection and delivery of donated clothes, household items and food."]],
    projectsEyebrow: "Featured projects", projectsTitle: "Three initiatives to get to know INICIA.", projectsText: "The full portfolio brings together 20 initiatives and shows the status of each.", projectsCta: "Explore all projects", viewProject: "View project", projectImageAlt: "People organising a community initiative",
    newsEyebrow: "News", newsTitle: "Latest from INICIA.", newsCta: "All news",
    partnersEyebrow: "Partners", partnersTitle: "Who we work with.",
    donateEyebrow: "Donate", donateTitle: "Your support makes it possible.", donateText: "Donate in seconds by Bizum or bank transfer, or give goods, food or your time.", donateCta: "Donate now", donateOther: "Other ways to help",
    contactEyebrow: "Contact", contactTitle: "Let's talk.", contactText: "Gijón: Av. Manuel Llaneza, 68. Avilés, Oviedo, Madrid, Barcelona and Valencia: by appointment.", whatsapp: "WhatsApp", directions: "Get directions", follow: "Follow us", formCta: "Write to us",
  },
  ru: {
    badge: "НКО · Астурия, Испания · с 2021 года", heroTitle: "Мы помогаем семьям,", heroAccent: "которые начинают заново.", heroText: "INICIA Foundation — некоммерческая ассоциация из Хихона (Астурия, Испания). С 2021 года мы помогаем семьям, вынужденно покинувшим Украину из-за войны, мигрантам и местным жителям в трудной ситуации: с документами, доступом к услугам, работой и материальной поддержкой.", ctaHelp: "Мне нужна помощь", ctaSupport: "Хочу помочь", ctaProjects: "Проекты",
    stats: [["2561", "украинских семей получили поддержку"], ["1380", "семей другого происхождения и местных жителей"], ["20", "инициатив в работе и в разработке"], ["2021", "год основания"]],
    ribbon: "Инклюзия · Сообщество · Обучение · Сотрудничество · Астурия",
    routeTitle: "Что привело вас в INICIA?", routes: [["Мне нужна помощь", "Продукты, документы, работа, сопровождение.", "/contacto?tipo=ayuda"], ["Хочу стать волонтёром", "Ваше время и навыки — в реальные проекты.", "/contacto?tipo=voluntariado"], ["Я представляю организацию", "Партнёрство, спонсорство, совместные проекты.", "/contacto?tipo=organizacion"], ["Хочу поддержать", "Bizum, перевод или вещи.", "/donar"]],
    aboutEyebrow: "Кто мы", aboutTitle: "Ассоциация волонтёров рядом с семьями.", aboutText: "Мы основаны в Хихоне в 2021 году. С 2022 года основная часть нашей работы — помощь семьям, приехавшим в Астурию, спасаясь от войны в Украине, а также мигрантам и местным жителям, которым нужна поддержка. Всю работу выполняют волонтёры, помощь бесплатная.",
    pillars: [["Документы и услуги", "Сопровождаем при оформлении документов и получении жилья, места в школе, медицинской помощи и пособий."], ["Материальная помощь", "Одежда, вещи для дома и продукты от частных лиц и организаций — для семей, которым это нужно."], ["Работа и обучение", "Резюме, поиск работы и направление в службы занятости и на курсы."]],
    missionEyebrow: "Наша миссия", missionTitle: "Никто не должен начинать с нуля в одиночку.", missionText: "Мы помогаем людям, которые приехали в Астурию или переживают трудный период, сориентироваться, воспользоваться своими правами и стать самостоятельными — с понятной информацией, поддержкой на родном языке и сетью волонтёров и партнёрских организаций.",
    mission: [["Кому мы помогаем", "Семьям, вынужденно покинувшим Украину из-за войны, мигрантам и беженцам, жителям Астурии в трудной ситуации."], ["Как мы работаем", "Бесплатно, на испанском, украинском, русском и английском, силами волонтёров и в координации с государственными службами."], ["Результаты", "С 2021 года — помощь 2 561 украинской семье и 1 380 семьям другого происхождения и местным жителям."]],
    ideologyLink: "Подробнее об идеологии", areasLabel: "Что мы делаем каждый день",
    areas: [["Документы", "Информация и сопровождение при оформлении документов и обращении в государственные службы."], ["Жильё и школа", "Помощь в поиске жилья и устройстве детей в школу."], ["Здоровье", "Помощь в доступе к государственной медицине. Мы не ставим диагнозы и не лечим."], ["Работа", "Резюме, собеседования и направление в службы занятости и на обучение."], ["Перевод", "Волонтёры переводят и сопровождают семьи на приёмы."], ["Материальная помощь", "Сбор и передача одежды, вещей для дома и продуктов."]],
    projectsEyebrow: "Избранные проекты", projectsTitle: "Три инициативы, чтобы узнать INICIA.", projectsText: "В полном каталоге 20 инициатив и статус каждой из них.", projectsCta: "Все проекты", viewProject: "Подробнее", projectImageAlt: "Люди организуют местную инициативу",
    newsEyebrow: "Новости", newsTitle: "Последние новости INICIA.", newsCta: "Все новости",
    partnersEyebrow: "Партнёры", partnersTitle: "С кем мы работаем.",
    donateEyebrow: "Поддержать", donateTitle: "Ваша поддержка делает это возможным.", donateText: "Пожертвуйте за пару секунд через Bizum или перевод — или помогите вещами, продуктами или своим временем.", donateCta: "Поддержать", donateOther: "Другие способы помочь",
    contactEyebrow: "Контакты", contactTitle: "Давайте поговорим.", contactText: "Хихон: Av. Manuel Llaneza, 68. Авилес, Овьедо, Мадрид, Барселона и Валенсия — по предварительной записи.", whatsapp: "WhatsApp", directions: "Как добраться", follow: "Мы в соцсетях", formCta: "Написать нам",
  },
  uk: {
    badge: "НГО · Астурія, Іспанія · з 2021 року", heroTitle: "Ми допомагаємо родинам,", heroAccent: "які починають заново.", heroText: "INICIA Foundation — неприбуткова асоціація з Хіхона (Астурія, Іспанія). З 2021 року ми допомагаємо родинам, які вимушено виїхали з України через війну, мігрантам і місцевим мешканцям у скрутному становищі: з документами, доступом до послуг, роботою та матеріальною підтримкою.", ctaHelp: "Мені потрібна допомога", ctaSupport: "Хочу допомогти", ctaProjects: "Проєкти",
    stats: [["2561", "українських родин отримали підтримку"], ["1380", "родин іншого походження та місцевих мешканців"], ["20", "ініціатив у роботі та розробці"], ["2021", "рік заснування"]],
    ribbon: "Інклюзія · Громада · Навчання · Співпраця · Астурія",
    routeTitle: "Що привело вас до INICIA?", routes: [["Мені потрібна допомога", "Продукти, документи, робота, супровід.", "/contacto?tipo=ayuda"], ["Хочу бути волонтером", "Ваш час і навички — у реальні проєкти.", "/contacto?tipo=voluntariado"], ["Я представляю організацію", "Партнерство, спонсорство, спільні проєкти.", "/contacto?tipo=organizacion"], ["Хочу підтримати", "Bizum, переказ або речі.", "/donar"]],
    aboutEyebrow: "Хто ми", aboutTitle: "Асоціація волонтерів поруч із родинами.", aboutText: "Ми засновані в Хіхоні у 2021 році. З 2022 року основна частина нашої роботи — допомога родинам, які приїхали до Астурії, рятуючись від війни в Україні, а також мігрантам і місцевим мешканцям, яким потрібна підтримка. Усю роботу виконують волонтери, допомога безкоштовна.",
    pillars: [["Документи та послуги", "Супроводжуємо під час оформлення документів і отримання житла, місця в школі, медичної допомоги та виплат."], ["Матеріальна допомога", "Одяг, речі для дому та продукти від приватних осіб і організацій — для родин, яким це потрібно."], ["Робота та навчання", "Резюме, пошук роботи та скерування до служб зайнятості й на курси."]],
    missionEyebrow: "Наша місія", missionTitle: "Ніхто не повинен починати з нуля наодинці.", missionText: "Ми допомагаємо людям, які приїхали до Астурії або переживають складний період, зорієнтуватися, скористатися своїми правами та стати самостійними — з зрозумілою інформацією, підтримкою рідною мовою та мережею волонтерів і партнерських організацій.",
    mission: [["Кому ми допомагаємо", "Родинам, які вимушено виїхали з України через війну, мігрантам і біженцям, мешканцям Астурії у скрутному становищі."], ["Як ми працюємо", "Безкоштовно, іспанською, українською, російською та англійською, силами волонтерів і в координації з державними службами."], ["Результати", "З 2021 року — допомога 2 561 українській родині та 1 380 родинам іншого походження й місцевим мешканцям."]],
    ideologyLink: "Детальніше про ідеологію", areasLabel: "Що ми робимо щодня",
    areas: [["Документи", "Інформація та супровід під час оформлення документів і звернення до державних служб."], ["Житло та школа", "Допомога в пошуку житла та влаштуванні дітей до школи."], ["Здоров’я", "Допомога в доступі до державної медицини. Ми не ставимо діагнозів і не лікуємо."], ["Робота", "Резюме, співбесіди та скерування до служб зайнятості й на навчання."], ["Переклад", "Волонтери перекладають і супроводжують родини на прийоми."], ["Матеріальна допомога", "Збір і передача одягу, речей для дому та продуктів."]],
    projectsEyebrow: "Вибрані проєкти", projectsTitle: "Три ініціативи, щоб познайомитися з INICIA.", projectsText: "У повному каталозі 20 ініціатив і статус кожної з них.", projectsCta: "Усі проєкти", viewProject: "Детальніше", projectImageAlt: "Люди організовують місцеву ініціативу",
    newsEyebrow: "Новини", newsTitle: "Останні новини INICIA.", newsCta: "Усі новини",
    partnersEyebrow: "Партнери", partnersTitle: "З ким ми працюємо.",
    donateEyebrow: "Підтримати", donateTitle: "Ваша підтримка робить це можливим.", donateText: "Пожертвуйте за кілька секунд через Bizum або переказ — або допоможіть речами, продуктами чи своїм часом.", donateCta: "Підтримати", donateOther: "Інші способи допомогти",
    contactEyebrow: "Контакти", contactTitle: "Поговорімо.", contactText: "Хіхон: Av. Manuel Llaneza, 68. Авілес, Ов’єдо, Мадрид, Барселона та Валенсія — за попереднім записом.", whatsapp: "WhatsApp", directions: "Як дістатися", follow: "Ми в соцмережах", formCta: "Написати нам",
  },
  ast: {
    badge: "ONG · Asturies, España · dende 2021", heroTitle: "Acompañamos a families qu'", heroAccent: "entamen de nuevo.", heroText: "INICIA Foundation ye una asociación ensin ánimu de llucru de Xixón (Asturies). Dende 2021 ayudamos a families desplazaes pola guerra d'Ucraína, a persones migrantes y a vecinos en situación de vulnerabilidá con trámites, accesu a recursos, empléu y ayuda material.", ctaHelp: "Preciso ayuda", ctaSupport: "Quiero ayudar", ctaProjects: "Ver proyeutos",
    stats: [["2561", "families ucraínes acompañaes"], ["1380", "families d'otros oríxenes y vecinos"], ["20", "iniciatives en marcha y en diseñu"], ["2021", "añu de fundación"]],
    ribbon: "Inclusión · Comunidá · Formación · Collaboración · Asturies",
    routeTitle: "¿Qué te trai a INICIA?", routes: [["Preciso ayuda", "Alimentos, trámites, empleu o acompañamientu.", "/contacto?tipo=ayuda"], ["Quiero ser voluntariu/a", "El to tiempu y les tos habilidaes en proyeutos reales.", "/contacto?tipo=voluntariado"], ["Soi una organización", "Alianzes, patrociniu y proyeutos conxuntos.", "/contacto?tipo=organizacion"], ["Quiero donar", "Bizum, tresferencia o material.", "/donar"]],
    aboutEyebrow: "Quién somos", aboutTitle: "Una asociación de voluntarios al llau de les families.", aboutText: "Naciemos en Xixón en 2021. Dende 2022 la mayor parte del nuestru trabayu céntrase nes families que lleguen a Asturies fuyendo de la guerra n'Ucraína, y en persones migrantes y vecinos que precisen sofitu. Too lo faen persones voluntaries, y l'atención ye de baldre.",
    pillars: [["Trámites y recursos", "Acompañamos en trámites alministrativos y nel accesu a vivienda, escolarización, salú y ayudes sociales."], ["Ayuda material", "Ropa, enseres y alimentos donaos por particulares y entidaes, entregaos a les families que lo precisen."], ["Empléu y formación", "Currículum, busca de trabayu y derivación a los servicios públicos d'empléu y a cursos."]],
    missionEyebrow: "La nuestra misión", missionTitle: "Que naide tenga qu'entamar de cero solu.", missionText: "Ayudamos a les persones que lleguen o pasen por un momentu difícil n'Asturies a orientase, exercer los sos derechos y ganar autonomía, con información clara, acompañamientu na so llingua y una rede de voluntariáu y entidaes collaboradores.",
    mission: [["A quién ayudamos", "Families desplazaes pola guerra n'Ucraína, persones migrantes y refuxaes y vecinos d'Asturies en situación de vulnerabilidá."], ["Cómo trabayamos", "Atención de baldre, en castellán, ucraín, rusu ya inglés, fecha por persones voluntaries y coordinada colos servicios públicos."], ["Resultaos", "2.561 families ucraínes y 1.380 families d'otros oríxenes y vecinos acompañaes dende 2021."]],
    ideologyLink: "Consultar la seición d'Ideoloxía", areasLabel: "Qué facemos cada día",
    areas: [["Trámites", "Información y acompañamientu en xestiones alministratives y nel accesu a los servicios públicos."], ["Vivienda y escuela", "Orientación na busca de vivienda y na escolarización de los neños."], ["Salú", "Ayuda p'acceder a l'atención sanitaria pública. Nun facemos diagnósticu nin tratamientu."], ["Empléu", "Currículum, entrevistes y derivación a servicios d'empléu y formación."], ["Traducción", "Voluntarios que traducen y acompañen a les families a cites y xestiones."], ["Ayuda material", "Recoyida y entrega de ropa, enseres y alimentos donaos."]],
    projectsEyebrow: "Proyeutos destacaos", projectsTitle: "Trés iniciatives pa conocer INICIA.", projectsText: "El catálogu completu axunta 20 iniciatives y amuesa l'estáu de caúna.", projectsCta: "Esplorar tolos proyeutos", viewProject: "Ver proyeutu", projectImageAlt: "Persones organizando una iniciativa comunitaria",
    newsEyebrow: "Noticies", newsTitle: "Lo últimu d'INICIA.", newsCta: "Toles noticies",
    partnersEyebrow: "Alianzes", partnersTitle: "Con quién trabayamos.",
    donateEyebrow: "Donar", donateTitle: "El to apoyu failo posible.", donateText: "Dona en segundos per Bizum o tresferencia, o apurre material, alimentos o el to tiempu.", donateCta: "Donar agora", donateOther: "Otres formes d'apoyar",
    contactEyebrow: "Contactu", contactTitle: "Falemos.", contactText: "Xixón: Av. Manuel Llaneza, 68. Avilés, Uviéu, Madrid, Barcelona y Valencia: con cita previa.", whatsapp: "WhatsApp", directions: "Cómo llegar", follow: "Síguinos", formCta: "Escribinos",
  },
};

const EARTH = photo("earth");
const HORIZON = photo("horizon");
const LEARNING = photo("learning");
const ENERGY = photo("energy");
const SEEDLING = photo("seedling");
const ROUTE_PHOTOS: PhotoName[] = ["community", "planting", "team", "seedling"];
const TAGLINE: Record<Locale, string> = { es: "Asociación sin ánimo de lucro · Gijón, Asturias", en: "Non-profit association · Gijón, Asturias", ru: "Некоммерческая ассоциация · Хихон, Астурия", uk: "Неприбуткова асоціація · Хіхон, Астурія", ast: "Asociación ensin ánimu de llucru · Xixón, Asturies" };
const ROUTE_ICONS = [LifeBuoy, HandHeart, Building2, HeartHandshake];
const PILLAR_ICONS = [UsersRound, HeartHandshake, ShieldCheck];
const MISSION_ICONS = [HeartHandshake, Target, Lightbulb];

const MAP_BUTTON: Record<Locale, string> = { es: "Mostrar el mapa", en: "Show the map", ru: "Показать карту", uk: "Показати карту", ast: "Amosar el mapa" };

/** The Google map loads only after a click: faster page and no Google cookies before the visitor chooses. */
function FoundationMap({ label }: { label: string }) {
  const [locale] = useLocale();
  const [show, setShow] = useState(false);
  return <div className="relative min-h-[360px] overflow-hidden rounded-3xl bg-[#08101E] shadow-sm ring-1 ring-[#D6B25E]/25">
    {show ? <iframe title="Mapa INICIA Foundation" src="https://www.google.com/maps?q=ONG%20Inicia%20Foundation%2C%20Av.%20Manuel%20Llaneza%2C%2068%2C%20Gij%C3%B3n&output=embed" className="absolute inset-0 h-full w-full border-0 opacity-85" />
      : <button type="button" onClick={() => setShow(true)} className="absolute inset-0 flex items-start justify-center pt-24 text-sm font-bold text-[#F0D893]" style={{ backgroundImage: "radial-gradient(circle at 50% 35%, rgba(214,178,94,.18), transparent 55%), repeating-linear-gradient(0deg, rgba(214,178,94,.06) 0 1px, transparent 1px 48px), repeating-linear-gradient(90deg, rgba(214,178,94,.06) 0 1px, transparent 1px 48px)" }}><span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#D6B25E]/50 bg-[#060A12]/80 px-5"><MapPin className="h-4 w-4" />{MAP_BUTTON[locale]}</span></button>}
    <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-[#060A12]/95 p-4 text-white"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#D6B25E]">INICIA Foundation</p><p className="mt-1 text-sm">Av. Manuel Llaneza, 68 · 33208 Gijón</p><a className="mt-3 inline-flex min-h-10 items-center rounded-full bg-[#D6B25E] px-4 text-xs font-bold text-[#120D05]" href="https://maps.app.goo.gl/kqzE7HTLe2PHM5BJ8" target="_blank" rel="noreferrer">{label}</a></div>
  </div>;
}

export default function Home() {
  const [locale] = useLocale();
  const t = copy[locale];
  const partners = allianceCopy[locale];
  const projects = useProjects(locale).data ?? [];
  const featuredSlugs = ["nucleo", "coopastur-agrosocial", "rural-futures"];
  const featured = projects.filter(project => featuredSlugs.includes(project.slug));
  const displayedProjects = featured.length ? featured : projects.slice(0, 3);
  const { data: content } = useSiteContent();
  const settings = useSettings();
  const latestNews = forLocale(content?.news ?? [], locale).slice(0, 3);

  return <main className="min-h-screen bg-[#060A12] text-[#EEE7D7]">
    <OriginalSiteNavigation />

    <section className="relative isolate overflow-hidden bg-[#060A12]">
      <img src={EARTH.src} srcSet={EARTH.srcSet} sizes="100vw" alt="La Tierra vista desde el espacio con redes de luz: INICIA Foundation conecta personas y comunidades" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center] opacity-90" />
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
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{t.routes.map(([title, text, href], index) => { const Icon = ROUTE_ICONS[index]; const img = photo(ROUTE_PHOTOS[index]); return <Link key={href} href={href} className="group relative isolate flex min-h-[340px] flex-col justify-end overflow-hidden rounded-3xl border border-[#D6B25E]/20 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#D6B25E]/60 hover:shadow-[0_20px_60px_rgba(0,0,0,.55)]"><img src={img.src} srcSet={img.srcSet} sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" alt={title} loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#060A12] via-[#060A12]/70 to-[#060A12]/10" /><Icon className="h-8 w-8 text-[#D6B25E]" /><span className="mt-4 font-serif text-3xl leading-tight text-white">{title}</span><span className="mt-2 text-sm leading-6 text-slate-200">{text}</span><span className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D6B25E]/50 text-[#F0D893] transition group-hover:bg-[#D6B25E] group-hover:text-[#120D05]"><ArrowRight className="h-4 w-4" /></span></Link>; })}</div>
    </section>

    {settings.homeVideo && <section className="mx-auto max-w-5xl px-5 pb-24"><YouTubeLite id={settings.homeVideo} title="INICIA Foundation" /></section>}

    <section id="quienes-somos" className="mx-auto grid max-w-7xl gap-10 px-5 pb-24 md:grid-cols-2">
      <div className="relative isolate flex min-h-[460px] flex-col justify-end overflow-hidden rounded-3xl border border-[#D6B25E]/20 p-10 text-white"><img src={HORIZON.src} srcSet={HORIZON.srcSet} sizes="(min-width:768px) 50vw, 100vw" alt={t.aboutTitle} loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover" /><div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#060A12] via-[#060A12]/60 to-transparent" /><p className="text-[11px] font-semibold uppercase tracking-[.3em] text-[#D6B25E]">{t.aboutEyebrow}</p><h2 className="relative mt-4 font-serif text-5xl">{t.aboutTitle}</h2><p className="relative mt-5 max-w-xl leading-8 text-slate-200">{t.aboutText}</p></div>
      <div className="grid content-center gap-5">{t.pillars.map(([title, text], index) => { const Icon = PILLAR_ICONS[index]; return <article key={title} className="flex gap-5 rounded-3xl border border-[#D6B25E]/15 bg-gradient-to-br from-[#0E1729] to-[#090F1B] p-7"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D6B25E]/40"><Icon className="h-5 w-5 text-[#D6B25E]" /></span><div><h3 className="font-serif text-3xl">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-300">{text}</p></div></article>; })}</div>
    </section>

    <section id="mision" className="bg-[#0C1320] py-20"><div className="mx-auto max-w-7xl px-5">
      <div className="max-w-4xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.missionEyebrow}</p><h2 className="mt-3 font-serif text-4xl md:text-5xl">{t.missionTitle}</h2><p className="mt-5 text-lg leading-8 text-slate-200">{t.missionText}</p></div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">{t.mission.map(([title, text], index) => { const Icon = MISSION_ICONS[index]; return <article key={title} className="rounded-3xl bg-[#060A12] p-7"><Icon className="h-7 w-7 text-[#D6B25E]" /><h3 className="mt-5 font-serif text-3xl">{title}</h3><p className="mt-3 leading-7 text-slate-300">{text}</p>{index === 2 && <Link className="mt-5 inline-flex text-sm font-bold underline decoration-[#D6B25E] decoration-2 underline-offset-4" href="/ideologia">{t.ideologyLink} →</Link>}</article>; })}</div>
      <div className="relative isolate mt-12 h-56 overflow-hidden rounded-3xl border border-[#D6B25E]/20 md:h-72"><img src={ENERGY.src} srcSet={ENERGY.srcSet} sizes="100vw" alt={t.missionTitle} loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-[#060A12]/70 to-transparent" /></div><div className="mt-12 border-t border-[#D6B25E]/20 pt-10"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.areasLabel}</p><div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{t.areas.map(([title, text]) => <article key={title} className="rounded-3xl border border-[#D6B25E]/20 p-6"><h3 className="font-serif text-2xl">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{text}</p></article>)}</div></div>
    </div></section>

    <section id="proyectos" className="py-20"><div className="mx-auto max-w-7xl px-5">
      <div className="grid gap-10 md:grid-cols-[.9fr_1.1fr]"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.projectsEyebrow}</p><h2 className="mt-3 font-serif text-4xl md:text-5xl">{t.projectsTitle}</h2><p className="mt-5 leading-7 text-slate-300">{t.projectsText}</p><Link href="/proyectos" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-[#D6B25E] px-6 text-sm font-bold text-[#120D05]">{t.projectsCta} <ArrowRight className="ml-2 h-4 w-4" /></Link></div><img src={LEARNING.src} srcSet={LEARNING.srcSet} sizes="(min-width:768px) 55vw, 100vw" alt={t.projectImageAlt} loading="lazy" className="h-full min-h-80 w-full rounded-3xl border border-[#D6B25E]/20 object-cover" /></div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">{displayedProjects.map(project => <article key={project.id} className="group overflow-hidden rounded-3xl bg-[#0C1320] shadow-sm ring-1 ring-[#D6B25E]/20 transition duration-200 hover:-translate-y-1 hover:shadow-lg"><ProjectVisual category={project.category} status={project.status} slug={project.slug} /><div className="p-6"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#D6B25E]">{project.category}</p><h3 className="mt-3 font-serif text-2xl">{project.title}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{project.shortDescription}</p><Link href={`/proyectos/${project.slug}`} className="mt-5 inline-flex items-center text-sm font-bold underline decoration-[#D6B25E] decoration-2 underline-offset-4">{t.viewProject} <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link></div></article>)}</div>
    </div></section>

    {latestNews.length > 0 && <section className="bg-[#0C1320] py-20"><div className="mx-auto max-w-7xl px-5"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.newsEyebrow}</p><h2 className="mt-3 font-serif text-4xl md:text-5xl">{t.newsTitle}</h2></div><Link href="/noticias" className="text-sm font-bold underline decoration-[#D6B25E] decoration-2 underline-offset-4">{t.newsCta} →</Link></div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">{latestNews.map(item => <Link key={item.id} href="/noticias" className="overflow-hidden rounded-3xl bg-[#060A12] transition hover:-translate-y-1">{item.imagen && <img src={item.imagen} alt={item.titulo} loading="lazy" className="aspect-[16/10] w-full object-cover" />}<div className="p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#D6B25E]">{formatDate(item.fecha, locale)}</p><h3 className="mt-2 font-serif text-2xl leading-tight">{item.titulo}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{item.resumen}</p></div></Link>)}</div>
    </div></section>}

    <section id="alianzas" className="py-20"><div className="mx-auto max-w-7xl px-5"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.partnersEyebrow}</p><h2 className="mt-3 font-serif text-4xl md:text-5xl">{t.partnersTitle}</h2><p className="mt-5 max-w-2xl leading-7 text-slate-300">{partners.homeIntro}</p><div className="mt-8"><AllianceAreas compact /></div><Link href="/alianzas" className="mt-8 inline-flex min-h-12 items-center rounded-full border border-[#D6B25E]/20 px-6 text-sm font-bold">{partners.homeCta}</Link></div></section>

    <section id="donar" className="relative isolate overflow-hidden py-28 text-white"><img src={SEEDLING.src} srcSet={SEEDLING.srcSet} sizes="100vw" alt={t.donateTitle} loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#060A12] via-[#060A12]/85 to-[#060A12]/30" /><div className="relative mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-[1.2fr_.8fr] md:items-center"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.donateEyebrow}</p><h2 className="mt-3 font-serif text-5xl">{t.donateTitle}</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">{t.donateText}</p></div><div className="flex flex-col gap-3 md:items-end"><Link href="/donar" className="inline-flex min-h-14 items-center rounded-full bg-[#D6B25E] px-8 text-base font-bold text-[#120D05] shadow-[0_10px_30px_rgba(214,178,94,.35)]">{t.donateCta}<ArrowRight className="ml-2 h-5 w-5" /></Link><Link href="/donar#material" className="text-sm font-bold text-[#F0D893] underline underline-offset-4">{t.donateOther}</Link></div></div></section>

    <section id="contacto" className="mx-auto grid max-w-7xl gap-9 px-5 py-20 lg:grid-cols-[.85fr_1.15fr]"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.contactEyebrow}</p><h2 className="mt-3 font-serif text-5xl">{t.contactTitle}</h2><p className="mt-5 leading-7 text-slate-300">{t.contactText}</p>
      <div className="mt-6 flex flex-wrap gap-3"><Link href="/contacto" className="inline-flex min-h-12 items-center rounded-full bg-[#D6B25E] px-5 text-sm font-bold text-[#120D05]">{t.formCta}</Link><a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#D6B25E]/20 px-5 text-sm font-bold"><MessageCircle className="h-4 w-4 text-[#D6B25E]" />{t.whatsapp}</a><a href={CONTACT.phoneHref} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#D6B25E]/20 px-5 text-sm font-bold"><Phone className="h-4 w-4 text-[#D6B25E]" />{CONTACT.phone}</a></div>
      <a className="mt-5 inline-flex items-center gap-2 text-sm font-bold" href="https://maps.app.goo.gl/kqzE7HTLe2PHM5BJ8" target="_blank" rel="noreferrer"><MapPin className="h-4 w-4 text-[#D6B25E]" />{t.directions}</a>
      <div className="mt-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#D6B25E]">{t.follow}</p><div className="mt-3"><SocialLinks /></div></div></div><FoundationMap label={t.directions} /></section>

    <SiteFooter />
  </main>;
}
