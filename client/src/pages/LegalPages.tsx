import type { ReactNode } from "react";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { SiteFooter } from "@/components/SiteFooter";
import { type Locale, useLocale } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/* Shared types and helpers                                            */
/* ------------------------------------------------------------------ */

type Section = { h: string; paragraphs: string[]; list?: string[] };
type PageCopy = { eyebrow: string; title: string; intro: string; sections: Section[] };
type CookieRow = { name: string; category: string; purpose: string; consent: boolean };
type CookieCopy = PageCopy & {
  tableTitle: string;
  columns: [string, string, string, string];
  always: string;
  onlyWithConsent: string;
  rows: CookieRow[];
};

const UPDATED: Record<Locale, string> = {
  es: "Última actualización: 26 de octubre de 2026",
  en: "Last updated: 26 October 2026",
  ru: "Последнее обновление: 26 октября 2026 г.",
  uk: "Останнє оновлення: 26 жовтня 2026 р.",
};

const LINK_CLASS = "underline decoration-[#D6B25E] decoration-2 underline-offset-4 hover:text-[#0B1E3A]";
const LINK_PATTERN = /([\w.+-]+@iniciafoundation\.org|www\.aepd\.es|iniciafoundation\.org|\+34 624 865 051)/g;

/** Turns e-mail addresses, the AEPD website, our domain and our phone into links. */
function linkify(text: string): ReactNode[] {
  return text.split(LINK_PATTERN).map((part, index) => {
    if (index % 2 === 0) return part;
    if (part.includes("@")) return <a key={index} href={`mailto:${part}`} className={LINK_CLASS}>{part}</a>;
    if (part.startsWith("+")) return <a key={index} href={`tel:${part.replace(/\s/g, "")}`} className={LINK_CLASS}>{part}</a>;
    const href = part === "www.aepd.es" ? "https://www.aepd.es" : "https://iniciafoundation.org";
    return <a key={index} href={href} target="_blank" rel="noreferrer" className={LINK_CLASS}>{part}</a>;
  });
}

function LegalLayout({ page, children }: { page: PageCopy; children?: ReactNode }) {
  const [locale] = useLocale();
  return <main className="min-h-screen bg-[#F7F3EA] text-[#0B1E3A]"><OriginalSiteNavigation dark />
    <section className="bg-[#0B1E3A] px-5 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-[#D6B25E]">{page.eyebrow}</p>
        <h1 className="mt-4 font-serif text-4xl text-white md:text-5xl">{page.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">{page.intro}</p>
      </div>
    </section>
    <section className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
      <article className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-[#0B1E3A]/10 sm:p-10">
        <p className="text-sm font-semibold text-slate-500">{UPDATED[locale]}</p>
        {page.sections.map(section => <section key={section.h} className="mt-8 first:mt-6">
          <h2 className="font-serif text-2xl text-[#0B1E3A]">{section.h}</h2>
          {section.paragraphs.map(p => <p key={p} className="mt-3 leading-7 text-slate-700">{linkify(p)}</p>)}
          {section.list && <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-slate-700">{section.list.map(item => <li key={item}>{linkify(item)}</li>)}</ul>}
        </section>)}
        {children}
      </article>
    </section>
    <SiteFooter />
  </main>;
}

/* ------------------------------------------------------------------ */
/* Privacy policy                                                      */
/* ------------------------------------------------------------------ */

const privacyCopy: Record<Locale, PageCopy> = {
  es: {
    eyebrow: "Protección de datos",
    title: "Política de privacidad",
    intro: "Explicamos cómo la Asociación Inicia Foundation trata los datos personales que recibe a través de este sitio web, de acuerdo con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).",
    sections: [
      { h: "1. Responsable del tratamiento", paragraphs: [
        "Asociación Inicia Foundation, NIF G05426242, inscrita en el Registro de Asociaciones del Principado de Asturias con el nº 13148.",
        "Domicilio: Avenida Manuel Llaneza, 68, 33208 Gijón (Asturias), España.",
        "Contacto para protección de datos y ejercicio de derechos: direccion@iniciafoundation.org. Contacto general: info@iniciafoundation.org. Teléfono: +34 624 865 051. Sitio web: iniciafoundation.org.",
      ] },
      { h: "2. Datos que tratamos", paragraphs: [
        "A través de los formularios del sitio (solicitud de ayuda, voluntariado, organizaciones, donaciones en especie o interés en hacerse socio/a y otras consultas) recogemos: nombre, correo electrónico, teléfono, ciudad, canal e idioma de contacto preferidos, y la información que la propia persona escribe en su mensaje.",
        "Los formularios piden expresamente que no se envíen datos de salud ni documentos de identidad. Le rogamos que no incluya este tipo de información en sus mensajes.",
      ] },
      { h: "3. Finalidades", paragraphs: ["Utilizamos los datos únicamente para:"], list: [
        "atender y responder a las solicitudes y consultas recibidas;",
        "gestionar el voluntariado, la condición de socio/a y la colaboración con personas y organizaciones;",
        "informar sobre nuestras actividades, solo si la persona lo ha solicitado.",
      ] },
      { h: "4. Base jurídica", paragraphs: ["Conforme al artículo 6 del RGPD, el tratamiento se basa en:"], list: [
        "el consentimiento de la persona interesada, otorgado mediante la casilla del formulario;",
        "la aplicación de medidas precontractuales o contractuales, en el caso de voluntarios/as y socios/as;",
        "el interés legítimo en responder a las organizaciones que contactan con nosotros;",
        "el cumplimiento de obligaciones legales, como las contables y fiscales relativas a las donaciones.",
      ] },
      { h: "5. Dónde se guardan los datos", paragraphs: [
        "Los datos enviados mediante los formularios se almacenan en el entorno Google Workspace de la asociación (Google Sheets), y las notificaciones de nuevas solicitudes se envían por correo electrónico al equipo de la entidad.",
      ] },
      { h: "6. Plazo de conservación", paragraphs: [
        "Conservamos los datos durante el tiempo necesario para gestionar la solicitud y, después, durante un máximo de 2 años, salvo que una obligación legal exija un plazo mayor (por ejemplo, los registros contables de las donaciones).",
      ] },
      { h: "7. Destinatarios y transferencias internacionales", paragraphs: [
        "No vendemos ni cedemos datos personales a terceros. Para prestar el servicio trabajamos con los siguientes encargados del tratamiento: Google (Google Workspace), Netlify (alojamiento web) y, en su caso, Cloudflare (alojamiento o analítica).",
        "Cuando estos proveedores tratan datos fuera del Espacio Económico Europeo, las transferencias están amparadas por las cláusulas contractuales tipo de la Comisión Europea o por el Marco de Privacidad de Datos UE-EE. UU.",
      ] },
      { h: "8. Sus derechos", paragraphs: [
        "Puede ejercer en cualquier momento sus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, así como retirar el consentimiento prestado, escribiendo a direccion@iniciafoundation.org. La retirada del consentimiento no afecta a la licitud del tratamiento previo.",
        "Si considera que sus derechos no han sido debidamente atendidos, puede presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).",
      ] },
      { h: "9. Menores de edad", paragraphs: [
        "De acuerdo con el artículo 7 de la LOPDGDD, las personas menores de 14 años no pueden prestar su consentimiento por sí mismas. En ese caso, la solicitud debe realizarla su madre, padre o tutor/a legal.",
      ] },
    ],
  },
  en: {
    eyebrow: "Data protection",
    title: "Privacy policy",
    intro: "This policy explains how Asociación Inicia Foundation processes the personal data it receives through this website, in accordance with Regulation (EU) 2016/679 (GDPR) and Spanish Organic Law 3/2018 on the Protection of Personal Data and Guarantee of Digital Rights (LOPDGDD).",
    sections: [
      { h: "1. Data controller", paragraphs: [
        "Asociación Inicia Foundation, NIF G05426242, registered in the Registro de Asociaciones del Principado de Asturias under no. 13148.",
        "Address: Avenida Manuel Llaneza, 68, 33208 Gijón (Asturias), España.",
        "Contact for data protection and exercising your rights: direccion@iniciafoundation.org. General contact: info@iniciafoundation.org. Phone: +34 624 865 051. Website: iniciafoundation.org.",
      ] },
      { h: "2. Data we process", paragraphs: [
        "Through the website forms (requests for help, volunteering, organisations, in-kind donations or interest in becoming a member, and other enquiries) we collect: name, email address, phone number, city, preferred contact channel and language, and whatever the person writes in their message.",
        "The forms expressly ask people not to send health data or identity documents. Please do not include this kind of information in your messages.",
      ] },
      { h: "3. Purposes", paragraphs: ["We use the data only to:"], list: [
        "handle and reply to the requests and enquiries we receive;",
        "manage volunteering, membership and collaboration with individuals and organisations;",
        "inform about our activities, only if the person has asked for it.",
      ] },
      { h: "4. Legal basis", paragraphs: ["Under Article 6 GDPR, processing is based on:"], list: [
        "the consent of the data subject, given through the form checkbox;",
        "pre-contractual or contractual measures, in the case of volunteers and members;",
        "our legitimate interest in replying to organisations that contact us;",
        "compliance with legal obligations, such as accounting and tax obligations relating to donations.",
      ] },
      { h: "5. Where the data is stored", paragraphs: [
        "Data sent through the forms is stored in the association's Google Workspace environment (Google Sheets), and notifications of new requests are sent by email to the organisation's team.",
      ] },
      { h: "6. Retention period", paragraphs: [
        "We keep the data for as long as needed to handle the request and then for up to 2 years, unless a legal obligation requires a longer period (for example, accounting records for donations).",
      ] },
      { h: "7. Recipients and international transfers", paragraphs: [
        "We do not sell or pass personal data on to third parties. To provide the service we work with the following data processors: Google (Google Workspace), Netlify (web hosting) and, where applicable, Cloudflare (hosting or analytics).",
        "Where these providers process data outside the European Economic Area, transfers are covered by the European Commission's standard contractual clauses or by the EU-US Data Privacy Framework.",
      ] },
      { h: "8. Your rights", paragraphs: [
        "You may at any time exercise your rights of access, rectification, erasure, objection, restriction of processing and portability, and withdraw any consent given, by writing to direccion@iniciafoundation.org. Withdrawing consent does not affect the lawfulness of processing carried out before.",
        "If you believe your rights have not been properly respected, you may lodge a complaint with the Spanish Data Protection Agency, Agencia Española de Protección de Datos (www.aepd.es).",
      ] },
      { h: "9. Minors", paragraphs: [
        "Under Article 7 LOPDGDD, children under 14 cannot give consent themselves. In that case, the request must be made by their mother, father or legal guardian.",
      ] },
    ],
  },
  ru: {
    eyebrow: "Защита данных",
    title: "Политика конфиденциальности",
    intro: "Здесь описано, как Asociación Inicia Foundation обрабатывает персональные данные, полученные через этот сайт, в соответствии с Регламентом (ЕС) 2016/679 (GDPR) и Органическим законом Испании 3/2018 о защите персональных данных и гарантиях цифровых прав (LOPDGDD).",
    sections: [
      { h: "1. Оператор данных", paragraphs: [
        "Asociación Inicia Foundation, NIF G05426242, зарегистрирована в Registro de Asociaciones del Principado de Asturias под № 13148.",
        "Адрес: Avenida Manuel Llaneza, 68, 33208 Gijón (Asturias), España.",
        "Контакт по вопросам защиты данных и реализации прав: direccion@iniciafoundation.org. Общий контакт: info@iniciafoundation.org. Телефон: +34 624 865 051. Сайт: iniciafoundation.org.",
      ] },
      { h: "2. Какие данные мы обрабатываем", paragraphs: [
        "Через формы на сайте (запрос помощи, волонтёрство, организации, пожертвования в натуральной форме или интерес к членству, другие обращения) мы получаем: имя, адрес электронной почты, телефон, город, предпочтительный канал и язык связи, а также то, что человек сам пишет в сообщении.",
        "В формах прямо указано, что не следует отправлять данные о здоровье и документы, удостоверяющие личность. Просим не включать такую информацию в сообщения.",
      ] },
      { h: "3. Цели обработки", paragraphs: ["Мы используем данные исключительно для того, чтобы:"], list: [
        "рассматривать полученные запросы и обращения и отвечать на них;",
        "организовывать волонтёрство, членство и сотрудничество с людьми и организациями;",
        "информировать о нашей деятельности — только если человек сам об этом попросил.",
      ] },
      { h: "4. Правовые основания", paragraphs: ["В соответствии со статьёй 6 GDPR обработка основана на:"], list: [
        "согласии субъекта данных, выраженном отметкой в форме;",
        "преддоговорных или договорных мерах — в отношении волонтёров и членов ассоциации;",
        "законном интересе в ответе организациям, которые к нам обращаются;",
        "исполнении юридических обязанностей, например бухгалтерских и налоговых, связанных с пожертвованиями.",
      ] },
      { h: "5. Где хранятся данные", paragraphs: [
        "Данные из форм хранятся в среде Google Workspace ассоциации (Google Sheets), а уведомления о новых обращениях отправляются команде организации по электронной почте.",
      ] },
      { h: "6. Срок хранения", paragraphs: [
        "Мы храним данные столько, сколько необходимо для рассмотрения обращения, а затем не более 2 лет, если только закон не требует более длительного срока (например, для бухгалтерских записей о пожертвованиях).",
      ] },
      { h: "7. Получатели и международная передача данных", paragraphs: [
        "Мы не продаём и не передаём персональные данные третьим лицам. Для работы сервиса мы привлекаем следующих обработчиков данных: Google (Google Workspace), Netlify (хостинг сайта) и, при использовании, Cloudflare (хостинг или аналитика).",
        "Если эти поставщики обрабатывают данные за пределами Европейской экономической зоны, передача осуществляется на основании стандартных договорных условий Европейской комиссии или Рамочного соглашения ЕС–США о конфиденциальности данных (EU-US Data Privacy Framework).",
      ] },
      { h: "8. Ваши права", paragraphs: [
        "Вы в любой момент можете воспользоваться правом на доступ, исправление, удаление, возражение, ограничение обработки и переносимость данных, а также отозвать данное согласие, написав на direccion@iniciafoundation.org. Отзыв согласия не влияет на законность обработки, проведённой до этого.",
        "Если вы считаете, что ваши права были нарушены, вы можете подать жалобу в Испанское агентство по защите данных — Agencia Española de Protección de Datos (www.aepd.es).",
      ] },
      { h: "9. Несовершеннолетние", paragraphs: [
        "Согласно статье 7 LOPDGDD, лица младше 14 лет не могут самостоятельно давать согласие на обработку данных. В этом случае обращение должен направить их родитель или законный представитель.",
      ] },
    ],
  },
  uk: {
    eyebrow: "Захист даних",
    title: "Політика конфіденційності",
    intro: "Тут описано, як Asociación Inicia Foundation обробляє персональні дані, отримані через цей сайт, відповідно до Регламенту (ЄС) 2016/679 (GDPR) та Органічного закону Іспанії 3/2018 про захист персональних даних і гарантії цифрових прав (LOPDGDD).",
    sections: [
      { h: "1. Володілець даних", paragraphs: [
        "Asociación Inicia Foundation, NIF G05426242, зареєстрована в Registro de Asociaciones del Principado de Asturias за № 13148.",
        "Адреса: Avenida Manuel Llaneza, 68, 33208 Gijón (Asturias), España.",
        "Контакт з питань захисту даних і реалізації прав: direccion@iniciafoundation.org. Загальний контакт: info@iniciafoundation.org. Телефон: +34 624 865 051. Сайт: iniciafoundation.org.",
      ] },
      { h: "2. Які дані ми обробляємо", paragraphs: [
        "Через форми на сайті (запит допомоги, волонтерство, організації, пожертви в натуральній формі або інтерес до членства, інші звернення) ми отримуємо: ім’я, адресу електронної пошти, телефон, місто, бажаний канал і мову зв’язку, а також те, що людина сама пише в повідомленні.",
        "У формах прямо зазначено, що не слід надсилати дані про здоров’я та документи, що посвідчують особу. Просимо не додавати таку інформацію до повідомлень.",
      ] },
      { h: "3. Мета обробки", paragraphs: ["Ми використовуємо дані виключно для того, щоб:"], list: [
        "розглядати отримані запити та звернення й відповідати на них;",
        "організовувати волонтерство, членство та співпрацю з людьми й організаціями;",
        "інформувати про нашу діяльність — лише якщо людина сама про це попросила.",
      ] },
      { h: "4. Правові підстави", paragraphs: ["Відповідно до статті 6 GDPR обробка ґрунтується на:"], list: [
        "згоді суб’єкта даних, наданій позначкою у формі;",
        "переддоговірних або договірних заходах — щодо волонтерів і членів асоціації;",
        "законному інтересі у відповіді організаціям, які до нас звертаються;",
        "виконанні юридичних обов’язків, наприклад бухгалтерських і податкових, пов’язаних із пожертвами.",
      ] },
      { h: "5. Де зберігаються дані", paragraphs: [
        "Дані з форм зберігаються в середовищі Google Workspace асоціації (Google Sheets), а сповіщення про нові звернення надсилаються команді організації електронною поштою.",
      ] },
      { h: "6. Строк зберігання", paragraphs: [
        "Ми зберігаємо дані стільки, скільки потрібно для розгляду звернення, а потім не довше 2 років, якщо закон не вимагає довшого строку (наприклад, для бухгалтерських записів про пожертви).",
      ] },
      { h: "7. Одержувачі та міжнародна передача даних", paragraphs: [
        "Ми не продаємо й не передаємо персональні дані третім особам. Для роботи сервісу ми залучаємо таких розпорядників даних: Google (Google Workspace), Netlify (хостинг сайту) та, у разі використання, Cloudflare (хостинг або аналітика).",
        "Якщо ці постачальники обробляють дані за межами Європейської економічної зони, передача здійснюється на підставі стандартних договірних умов Європейської комісії або Рамкової угоди ЄС–США про конфіденційність даних (EU-US Data Privacy Framework).",
      ] },
      { h: "8. Ваші права", paragraphs: [
        "Ви будь-коли можете скористатися правом на доступ, виправлення, видалення, заперечення, обмеження обробки та перенесення даних, а також відкликати надану згоду, написавши на direccion@iniciafoundation.org. Відкликання згоди не впливає на законність обробки, здійсненої до цього.",
        "Якщо ви вважаєте, що ваші права порушено, ви можете подати скаргу до Іспанського агентства із захисту даних — Agencia Española de Protección de Datos (www.aepd.es).",
      ] },
      { h: "9. Неповнолітні", paragraphs: [
        "Згідно зі статтею 7 LOPDGDD, особи, молодші за 14 років, не можуть самостійно надавати згоду на обробку даних. У такому разі звернення має надіслати їхній батько, мати або законний представник.",
      ] },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Cookie policy                                                       */
/* ------------------------------------------------------------------ */

const cookieCopy: Record<Locale, CookieCopy> = {
  es: {
    eyebrow: "Cookies",
    title: "Política de cookies",
    intro: "Esta página explica qué cookies y tecnologías de almacenamiento similares utiliza el sitio web de la Asociación Inicia Foundation y cómo puede decidir sobre su uso.",
    sections: [
      { h: "1. Qué son las cookies", paragraphs: [
        "Las cookies y tecnologías similares, como el almacenamiento local del navegador (localStorage), permiten guardar pequeñas cantidades de información en el dispositivo de la persona que visita el sitio.",
      ] },
      { h: "2. Almacenamiento técnicamente necesario", paragraphs: [
        "Para que el sitio funcione guardamos en el localStorage de su navegador el idioma elegido y su decisión sobre las cookies. Esta información no se envía a terceros y no requiere consentimiento, al ser estrictamente necesaria para prestar el servicio solicitado.",
      ] },
      { h: "3. Analítica y medición de conversiones", paragraphs: [
        "Utilizamos Google Analytics 4 para conocer de forma agregada cómo se usa el sitio, y la medición de conversiones de Google Ads para saber si nuestras campañas funcionan. Estas herramientas solo se activan si usted lo acepta en el banner de cookies. Si no lo acepta, no se cargan.",
      ] },
      { h: "4. Vídeos de YouTube", paragraphs: [
        "Los vídeos incrustados se sirven desde el dominio youtube-nocookie.com y solo se cargan cuando usted pulsa sobre ellos. Hasta ese momento, YouTube no recibe ningún dato de su visita.",
      ] },
      { h: "5. Cómo cambiar su elección", paragraphs: [
        "Puede modificar o retirar su consentimiento en cualquier momento mediante el enlace «Configurar cookies» situado en el pie de página. También puede borrar las cookies y el almacenamiento local desde la configuración de su navegador.",
        "Para más información sobre el tratamiento de sus datos, consulte nuestra Política de privacidad o escriba a direccion@iniciafoundation.org.",
      ] },
    ],
    tableTitle: "Cookies y almacenamiento utilizados",
    columns: ["Nombre", "Categoría", "Finalidad", "Uso"],
    always: "Siempre",
    onlyWithConsent: "Solo con consentimiento",
    rows: [
      { name: "inicia-lang", category: "Necesaria", purpose: "Recordar el idioma elegido (localStorage).", consent: false },
      { name: "inicia-consent", category: "Necesaria", purpose: "Recordar su decisión sobre las cookies (localStorage).", consent: false },
      { name: "_ga, _ga_*", category: "Analítica", purpose: "Google Analytics 4: estadísticas agregadas de uso del sitio.", consent: true },
      { name: "_gcl_au", category: "Publicidad / conversión", purpose: "Google Ads: medición de conversiones de campañas.", consent: true },
    ],
  },
  en: {
    eyebrow: "Cookies",
    title: "Cookie policy",
    intro: "This page explains which cookies and similar storage technologies the website of Asociación Inicia Foundation uses and how you can decide on their use.",
    sections: [
      { h: "1. What cookies are", paragraphs: [
        "Cookies and similar technologies, such as the browser's local storage (localStorage), make it possible to save small amounts of information on the visitor's device.",
      ] },
      { h: "2. Strictly necessary storage", paragraphs: [
        "For the site to work, we save the language you choose and your cookie choice in your browser's localStorage. This information is not sent to third parties and does not require consent, as it is strictly necessary to provide the service you request.",
      ] },
      { h: "3. Analytics and conversion measurement", paragraphs: [
        "We use Google Analytics 4 to understand, in aggregate, how the site is used, and Google Ads conversion measurement to know whether our campaigns work. These tools are activated only if you accept them in the cookie banner. If you do not accept, they are not loaded.",
      ] },
      { h: "4. YouTube videos", paragraphs: [
        "Embedded videos are served from the youtube-nocookie.com domain and load only when you click on them. Until then, YouTube receives no data about your visit.",
      ] },
      { h: "5. How to change your choice", paragraphs: [
        "You can change or withdraw your consent at any time using the “Configurar cookies” (cookie settings) link in the footer. You can also delete cookies and local storage in your browser settings.",
        "For more information on how we process your data, see our Privacy policy or write to direccion@iniciafoundation.org.",
      ] },
    ],
    tableTitle: "Cookies and storage used",
    columns: ["Name", "Category", "Purpose", "Use"],
    always: "Always",
    onlyWithConsent: "Only with consent",
    rows: [
      { name: "inicia-lang", category: "Necessary", purpose: "Remembers the chosen language (localStorage).", consent: false },
      { name: "inicia-consent", category: "Necessary", purpose: "Remembers your cookie choice (localStorage).", consent: false },
      { name: "_ga, _ga_*", category: "Analytics", purpose: "Google Analytics 4: aggregate website usage statistics.", consent: true },
      { name: "_gcl_au", category: "Advertising / conversion", purpose: "Google Ads: campaign conversion measurement.", consent: true },
    ],
  },
  ru: {
    eyebrow: "Cookies",
    title: "Политика использования cookies",
    intro: "На этой странице описано, какие файлы cookie и аналогичные технологии хранения использует сайт Asociación Inicia Foundation и как вы можете управлять их использованием.",
    sections: [
      { h: "1. Что такое cookies", paragraphs: [
        "Файлы cookie и аналогичные технологии, например локальное хранилище браузера (localStorage), позволяют сохранять небольшие объёмы информации на устройстве посетителя сайта.",
      ] },
      { h: "2. Технически необходимое хранение", paragraphs: [
        "Для работы сайта мы сохраняем в localStorage вашего браузера выбранный язык и ваше решение относительно cookies. Эта информация не передаётся третьим лицам и не требует согласия, поскольку строго необходима для предоставления запрошенной услуги.",
      ] },
      { h: "3. Аналитика и измерение конверсий", paragraphs: [
        "Мы используем Google Analytics 4, чтобы в обобщённом виде понимать, как используется сайт, и измерение конверсий Google Ads, чтобы оценивать эффективность наших кампаний. Эти инструменты включаются только если вы дадите согласие в баннере cookies. Без согласия они не загружаются.",
      ] },
      { h: "4. Видео YouTube", paragraphs: [
        "Встроенные видео загружаются с домена youtube-nocookie.com и только после того, как вы нажмёте на них. До этого YouTube не получает никаких данных о вашем посещении.",
      ] },
      { h: "5. Как изменить свой выбор", paragraphs: [
        "Вы можете в любой момент изменить или отозвать согласие по ссылке «Configurar cookies» (настройки cookies) в нижней части сайта. Также cookies и локальное хранилище можно удалить в настройках браузера.",
        "Подробнее об обработке ваших данных — в нашей Политике конфиденциальности или по адресу direccion@iniciafoundation.org.",
      ] },
    ],
    tableTitle: "Используемые cookies и хранилище",
    columns: ["Название", "Категория", "Назначение", "Использование"],
    always: "Всегда",
    onlyWithConsent: "Только с согласия",
    rows: [
      { name: "inicia-lang", category: "Необходимые", purpose: "Запоминает выбранный язык (localStorage).", consent: false },
      { name: "inicia-consent", category: "Необходимые", purpose: "Запоминает ваш выбор относительно cookies (localStorage).", consent: false },
      { name: "_ga, _ga_*", category: "Аналитика", purpose: "Google Analytics 4: обобщённая статистика использования сайта.", consent: true },
      { name: "_gcl_au", category: "Реклама / конверсии", purpose: "Google Ads: измерение конверсий рекламных кампаний.", consent: true },
    ],
  },
  uk: {
    eyebrow: "Cookies",
    title: "Політика використання cookies",
    intro: "На цій сторінці описано, які файли cookie та подібні технології зберігання використовує сайт Asociación Inicia Foundation і як ви можете керувати їх використанням.",
    sections: [
      { h: "1. Що таке cookies", paragraphs: [
        "Файли cookie та подібні технології, наприклад локальне сховище браузера (localStorage), дають змогу зберігати невеликі обсяги інформації на пристрої відвідувача сайту.",
      ] },
      { h: "2. Технічно необхідне зберігання", paragraphs: [
        "Для роботи сайту ми зберігаємо в localStorage вашого браузера обрану мову та ваше рішення щодо cookies. Ця інформація не передається третім особам і не потребує згоди, оскільки є суворо необхідною для надання запитаної послуги.",
      ] },
      { h: "3. Аналітика та вимірювання конверсій", paragraphs: [
        "Ми використовуємо Google Analytics 4, щоб в узагальненому вигляді розуміти, як використовується сайт, і вимірювання конверсій Google Ads, щоб оцінювати ефективність наших кампаній. Ці інструменти вмикаються лише якщо ви погодитеся в банері cookies. Без згоди вони не завантажуються.",
      ] },
      { h: "4. Відео YouTube", paragraphs: [
        "Вбудовані відео завантажуються з домену youtube-nocookie.com і лише після того, як ви натиснете на них. До цього YouTube не отримує жодних даних про ваше відвідування.",
      ] },
      { h: "5. Як змінити свій вибір", paragraphs: [
        "Ви будь-коли можете змінити або відкликати згоду за посиланням «Configurar cookies» (налаштування cookies) у нижній частині сайту. Також cookies і локальне сховище можна видалити в налаштуваннях браузера.",
        "Докладніше про обробку ваших даних — у нашій Політиці конфіденційності або за адресою direccion@iniciafoundation.org.",
      ] },
    ],
    tableTitle: "Використовувані cookies і сховище",
    columns: ["Назва", "Категорія", "Призначення", "Використання"],
    always: "Завжди",
    onlyWithConsent: "Лише за згодою",
    rows: [
      { name: "inicia-lang", category: "Необхідні", purpose: "Запам’ятовує обрану мову (localStorage).", consent: false },
      { name: "inicia-consent", category: "Необхідні", purpose: "Запам’ятовує ваш вибір щодо cookies (localStorage).", consent: false },
      { name: "_ga, _ga_*", category: "Аналітика", purpose: "Google Analytics 4: узагальнена статистика використання сайту.", consent: true },
      { name: "_gcl_au", category: "Реклама / конверсії", purpose: "Google Ads: вимірювання конверсій рекламних кампаній.", consent: true },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Legal notice (LSSI-CE, Ley 34/2002, art. 10)                        */
/* ------------------------------------------------------------------ */

const legalCopy: Record<Locale, PageCopy> = {
  es: {
    eyebrow: "Información legal",
    title: "Aviso legal",
    intro: "En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), se facilitan los datos del titular de este sitio web y las condiciones que regulan su uso.",
    sections: [
      { h: "1. Titular del sitio web", paragraphs: [
        "Asociación Inicia Foundation, NIF G05426242, inscrita en el Registro de Asociaciones del Principado de Asturias con el nº 13148.",
        "Domicilio: Avenida Manuel Llaneza, 68, 33208 Gijón (Asturias), España.",
        "Correo electrónico: info@iniciafoundation.org. Teléfono: +34 624 865 051. Sitio web: iniciafoundation.org.",
      ] },
      { h: "2. Objeto del sitio", paragraphs: [
        "Este sitio web ofrece información sobre la asociación, sus proyectos y las formas de colaborar con ella. El acceso es gratuito y no exige registro; el envío de formularios se rige por nuestra Política de privacidad.",
      ] },
      { h: "3. Propiedad intelectual e industrial", paragraphs: [
        "Salvo que se indique lo contrario, los textos, imágenes, logotipos y demás contenidos de este sitio pertenecen a la Asociación Inicia Foundation. Algunas imágenes tienen carácter meramente ilustrativo.",
        "No está permitida la reproducción, distribución o transformación de los contenidos con fines comerciales sin autorización previa y por escrito de la asociación.",
      ] },
      { h: "4. Enlaces externos", paragraphs: [
        "Este sitio puede incluir enlaces a páginas de terceros. La asociación no controla dichos sitios y no se hace responsable de sus contenidos, de su disponibilidad ni de sus políticas de privacidad. Si tiene conocimiento de algún enlace que conduzca a contenidos ilícitos, le rogamos que nos lo comunique a info@iniciafoundation.org.",
      ] },
      { h: "5. Protección de datos y cookies", paragraphs: [
        "El tratamiento de los datos personales y el uso de cookies se describen en la Política de privacidad y en la Política de cookies de este sitio.",
      ] },
      { h: "6. Legislación aplicable y jurisdicción", paragraphs: [
        "Este aviso legal se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales de Gijón, salvo que la normativa de protección de las personas consumidoras establezca otro fuero.",
      ] },
    ],
  },
  en: {
    eyebrow: "Legal information",
    title: "Legal notice",
    intro: "In compliance with Article 10 of Spanish Law 34/2002 of 11 July on Information Society Services and Electronic Commerce (LSSI-CE), we provide the details of the owner of this website and the conditions governing its use.",
    sections: [
      { h: "1. Website owner", paragraphs: [
        "Asociación Inicia Foundation, NIF G05426242, registered in the Registro de Asociaciones del Principado de Asturias under no. 13148.",
        "Address: Avenida Manuel Llaneza, 68, 33208 Gijón (Asturias), España.",
        "Email: info@iniciafoundation.org. Phone: +34 624 865 051. Website: iniciafoundation.org.",
      ] },
      { h: "2. Purpose of the website", paragraphs: [
        "This website provides information about the association, its projects and the ways to collaborate with it. Access is free and requires no registration; submitting forms is governed by our Privacy policy.",
      ] },
      { h: "3. Intellectual and industrial property", paragraphs: [
        "Unless otherwise stated, the texts, images, logos and other content of this website belong to Asociación Inicia Foundation. Some images are for illustrative purposes only.",
        "Reproduction, distribution or modification of the content for commercial purposes is not permitted without the association's prior written authorisation.",
      ] },
      { h: "4. External links", paragraphs: [
        "This website may include links to third-party pages. The association does not control those sites and is not responsible for their content, availability or privacy policies. If you become aware of a link leading to unlawful content, please let us know at info@iniciafoundation.org.",
      ] },
      { h: "5. Data protection and cookies", paragraphs: [
        "The processing of personal data and the use of cookies are described in this website's Privacy policy and Cookie policy.",
      ] },
      { h: "6. Applicable law and jurisdiction", paragraphs: [
        "This legal notice is governed by Spanish law. Any dispute shall be submitted to the courts of Gijón, unless consumer protection law provides for a different jurisdiction.",
      ] },
    ],
  },
  ru: {
    eyebrow: "Правовая информация",
    title: "Правовое уведомление",
    intro: "В соответствии со статьёй 10 Закона Испании 34/2002 от 11 июля об услугах информационного общества и электронной торговле (LSSI-CE) приводим данные владельца этого сайта и условия его использования.",
    sections: [
      { h: "1. Владелец сайта", paragraphs: [
        "Asociación Inicia Foundation, NIF G05426242, зарегистрирована в Registro de Asociaciones del Principado de Asturias под № 13148.",
        "Адрес: Avenida Manuel Llaneza, 68, 33208 Gijón (Asturias), España.",
        "Электронная почта: info@iniciafoundation.org. Телефон: +34 624 865 051. Сайт: iniciafoundation.org.",
      ] },
      { h: "2. Назначение сайта", paragraphs: [
        "Сайт содержит информацию об ассоциации, её проектах и способах сотрудничества с ней. Доступ бесплатный и не требует регистрации; отправка форм регулируется нашей Политикой конфиденциальности.",
      ] },
      { h: "3. Интеллектуальная и промышленная собственность", paragraphs: [
        "Если не указано иное, тексты, изображения, логотипы и другие материалы сайта принадлежат Asociación Inicia Foundation. Некоторые изображения носят исключительно иллюстративный характер.",
        "Воспроизведение, распространение или переработка материалов в коммерческих целях без предварительного письменного разрешения ассоциации не допускается.",
      ] },
      { h: "4. Внешние ссылки", paragraphs: [
        "Сайт может содержать ссылки на страницы третьих лиц. Ассоциация не контролирует такие сайты и не несёт ответственности за их содержание, доступность и политику конфиденциальности. Если вы обнаружите ссылку на незаконный контент, сообщите нам об этом по адресу info@iniciafoundation.org.",
      ] },
      { h: "5. Защита данных и cookies", paragraphs: [
        "Обработка персональных данных и использование cookies описаны в Политике конфиденциальности и Политике использования cookies этого сайта.",
      ] },
      { h: "6. Применимое право и подсудность", paragraphs: [
        "Настоящее уведомление регулируется законодательством Испании. Споры рассматриваются судами Хихона (Gijón), если законодательство о защите прав потребителей не предусматривает иную подсудность.",
      ] },
    ],
  },
  uk: {
    eyebrow: "Правова інформація",
    title: "Правове повідомлення",
    intro: "Відповідно до статті 10 Закону Іспанії 34/2002 від 11 липня про послуги інформаційного суспільства та електронну комерцію (LSSI-CE) наводимо дані власника цього сайту та умови його використання.",
    sections: [
      { h: "1. Власник сайту", paragraphs: [
        "Asociación Inicia Foundation, NIF G05426242, зареєстрована в Registro de Asociaciones del Principado de Asturias за № 13148.",
        "Адреса: Avenida Manuel Llaneza, 68, 33208 Gijón (Asturias), España.",
        "Електронна пошта: info@iniciafoundation.org. Телефон: +34 624 865 051. Сайт: iniciafoundation.org.",
      ] },
      { h: "2. Призначення сайту", paragraphs: [
        "Сайт містить інформацію про асоціацію, її проєкти та способи співпраці з нею. Доступ безкоштовний і не потребує реєстрації; надсилання форм регулюється нашою Політикою конфіденційності.",
      ] },
      { h: "3. Інтелектуальна та промислова власність", paragraphs: [
        "Якщо не зазначено інше, тексти, зображення, логотипи та інші матеріали сайту належать Asociación Inicia Foundation. Деякі зображення мають суто ілюстративний характер.",
        "Відтворення, поширення або перероблення матеріалів у комерційних цілях без попереднього письмового дозволу асоціації не допускається.",
      ] },
      { h: "4. Зовнішні посилання", paragraphs: [
        "Сайт може містити посилання на сторінки третіх осіб. Асоціація не контролює такі сайти й не несе відповідальності за їхній зміст, доступність і політику конфіденційності. Якщо ви виявите посилання на незаконний контент, повідомте нам про це за адресою info@iniciafoundation.org.",
      ] },
      { h: "5. Захист даних і cookies", paragraphs: [
        "Обробку персональних даних і використання cookies описано в Політиці конфіденційності та Політиці використання cookies цього сайту.",
      ] },
      { h: "6. Застосовне право та підсудність", paragraphs: [
        "Це повідомлення регулюється законодавством Іспанії. Спори розглядаються судами Хіхона (Gijón), якщо законодавство про захист прав споживачів не передбачає іншої підсудності.",
      ] },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Page components                                                     */
/* ------------------------------------------------------------------ */

export function PrivacyPolicy() {
  const [locale] = useLocale();
  return <LegalLayout page={privacyCopy[locale]} />;
}

export function CookiePolicy() {
  const [locale] = useLocale();
  const t = cookieCopy[locale];
  return <LegalLayout page={t}>
    <section className="mt-10">
      <h2 className="font-serif text-2xl text-[#0B1E3A]">{t.tableTitle}</h2>
      <dl className="mt-4 divide-y divide-[#0B1E3A]/10 rounded-2xl ring-1 ring-[#0B1E3A]/10">
        {t.rows.map(row => <div key={row.name} className="grid gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
          <dt className="font-mono text-sm font-semibold text-[#0B1E3A]">{row.name}</dt>
          <dd className="text-sm leading-6 text-slate-700">
            <span className="font-semibold">{t.columns[1]}:</span> {row.category}<br />
            <span className="font-semibold">{t.columns[2]}:</span> {row.purpose}<br />
            <span className="font-semibold">{t.columns[3]}:</span>{" "}
            <span className={row.consent ? "rounded-full bg-[#D6B25E]/20 px-2 py-0.5 font-semibold text-[#6B5420]" : "rounded-full bg-[#0B1E3A]/10 px-2 py-0.5 font-semibold text-[#0B1E3A]"}>{row.consent ? t.onlyWithConsent : t.always}</span>
          </dd>
        </div>)}
      </dl>
    </section>
  </LegalLayout>;
}

export function LegalNotice() {
  const [locale] = useLocale();
  return <LegalLayout page={legalCopy[locale]} />;
}
