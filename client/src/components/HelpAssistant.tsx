import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { showsMobileBar } from "@/components/MobileActionBar";
import { ArrowLeft, ArrowRight, MessageCircle, Search, Sparkles, X } from "lucide-react";
import { forLocale, useSiteContent } from "@/lib/content";
import { type Locale, useLocale } from "@/lib/i18n";
import { CONTACT } from "@/lib/siteConfig";

type Answer = { q: string; a: string; href?: string; cta?: string; keys: string };

const ui: Record<Locale, { open: string; title: string; hello: string; search: string; none: string; whatsapp: string; back: string; close: string }> = {
  es: { open: "Pregúntanos", title: "Asistente INICIA", hello: "Hola. ¿En qué podemos ayudarte? Elige un tema o escribe tu pregunta.", search: "Escribe tu pregunta…", none: "No hemos encontrado una respuesta. Escríbenos y te contestamos personalmente.", whatsapp: "Hablar con una persona (WhatsApp)", back: "Volver", close: "Cerrar" },
  en: { open: "Ask us", title: "INICIA assistant", hello: "Hello. How can we help? Choose a topic or type your question.", search: "Type your question…", none: "We could not find an answer. Write to us and a person will reply.", whatsapp: "Talk to a person (WhatsApp)", back: "Back", close: "Close" },
  ru: { open: "Спросите нас", title: "Помощник INICIA", hello: "Здравствуйте! Чем можем помочь? Выберите тему или напишите вопрос.", search: "Напишите ваш вопрос…", none: "Мы не нашли ответа. Напишите нам — ответит человек.", whatsapp: "Связаться с человеком (WhatsApp)", back: "Назад", close: "Закрыть" },
  uk: { open: "Запитайте нас", title: "Помічник INICIA", hello: "Вітаємо! Чим можемо допомогти? Оберіть тему або напишіть запитання.", search: "Напишіть ваше запитання…", none: "Ми не знайшли відповіді. Напишіть нам — відповість людина.", whatsapp: "Зв’язатися з людиною (WhatsApp)", back: "Назад", close: "Закрити" },
  ast: { open: "Entrúganos", title: "Asistente INICIA", hello: "Hola. ¿En qué te podemos ayudar? Escueyi un tema o escribi la to entruga.", search: "Escribi la to entruga…", none: "Nun alcontramos una rempuesta. Escríbinos y contestámoste personalmente.", whatsapp: "Falar con una persona (WhatsApp)", back: "Volver", close: "Zarrar" },
};

/** Built-in answers; the team can add more in the "Asistente" tab of the Google Sheet without republishing. */
const base: Record<Locale, Answer[]> = {
  es: [
    { q: "Necesito ayuda", a: "Cuéntanos tu situación en el formulario: alimentos, trámites, empleo o acompañamiento familiar. Te contactamos por el medio que elijas. Si es urgente, escríbenos también por WhatsApp.", href: "/contacto?tipo=ayuda", cta: "Pedir ayuda", keys: "ayuda necesito alimentos comida tramites documentos empleo trabajo familia urgente" },
    { q: "Quiero ser voluntario/a", a: "Rellena el formulario de voluntariado en dos minutos: elige áreas (logística, idiomas, formación, tecnología…) y disponibilidad. Te contactaremos para conocerte.", href: "/contacto?tipo=voluntariado", cta: "Apuntarme", keys: "voluntario voluntaria voluntariado ayudar colaborar tiempo" },
    { q: "Quiero donar", a: "Puedes donar por transferencia bancaria (IBAN con botón de copiar y código QR) o aportar material y alimentos. Cada aportación se destina a los programas de la asociación.", href: "/donar", cta: "Formas de donar", keys: "donar donacion dinero iban transferencia bizum tarjeta paypal material socio cuota" },
    { q: "Soy una organización", a: "Instituciones, empresas, universidades y entidades sociales pueden proponernos proyectos conjuntos, patrocinio, voluntariado corporativo o cesión de espacios.", href: "/contacto?tipo=organizacion", cta: "Proponer colaboración", keys: "empresa organizacion entidad institucion universidad patrocinio alianza colaboracion" },
    { q: "¿Dónde estáis?", a: "Sede en Av. Manuel Llaneza, 68 · 33208 Gijón (Asturias). Atendemos también en Avilés y Oviedo, y en Madrid, Barcelona y Valencia con cita previa.", href: "/contacto", cta: "Contacto", keys: "donde direccion sede gijon aviles oviedo madrid barcelona valencia horario cita oficina" },
    { q: "¿Qué proyectos tenéis?", a: "Trabajamos en inclusión social, formación, desarrollo rural, economía circular e innovación digital. Puedes ver todas las iniciativas y su estado.", href: "/proyectos", cta: "Ver proyectos", keys: "proyectos programas iniciativas que haceis neara inicia lab coopastur nucleo" },
  ],
  en: [
    { q: "I need help", a: "Tell us about your situation in the form: food, paperwork, jobs or family support. We will contact you through the channel you choose. If it is urgent, also write to us on WhatsApp.", href: "/contacto?tipo=ayuda", cta: "Ask for help", keys: "help need food paperwork documents job work family urgent" },
    { q: "I want to volunteer", a: "Fill in the volunteering form in two minutes: choose areas (logistics, languages, teaching, technology…) and availability. We will contact you.", href: "/contacto?tipo=voluntariado", cta: "Sign up", keys: "volunteer volunteering help time" },
    { q: "I want to donate", a: "You can donate by bank transfer (IBAN with a copy button and QR code) or give goods and food. Every contribution goes to the association’s programmes.", href: "/donar", cta: "Ways to donate", keys: "donate donation money iban transfer bizum card paypal goods member fee" },
    { q: "I represent an organisation", a: "Public bodies, companies, universities and NGOs can propose joint projects, sponsorship, corporate volunteering or premises.", href: "/contacto?tipo=organizacion", cta: "Propose a collaboration", keys: "company organisation organization institution university sponsor partnership" },
    { q: "Where are you?", a: "Office at Av. Manuel Llaneza, 68 · 33208 Gijón (Asturias, Spain). We also work in Avilés and Oviedo, and in Madrid, Barcelona and Valencia by appointment.", href: "/contacto", cta: "Contact", keys: "where address office gijon aviles oviedo madrid barcelona valencia hours appointment" },
    { q: "What projects do you have?", a: "We work on social inclusion, training, rural development, circular economy and digital innovation. See all initiatives and their status.", href: "/proyectos", cta: "See projects", keys: "projects programmes initiatives what do you do neara" },
  ],
  ru: [
    { q: "Мне нужна помощь", a: "Опишите ситуацию в форме: продукты, документы, работа или поддержка семьи. Мы свяжемся с вами удобным способом. Если срочно — напишите также в WhatsApp.", href: "/contacto?tipo=ayuda", cta: "Попросить помощь", keys: "помощь нужна продукты еда документы бумаги работа семья срочно" },
    { q: "Хочу стать волонтёром", a: "Заполните форму волонтёра за две минуты: выберите направления (логистика, переводы, обучение, IT…) и удобное время. Мы свяжемся с вами.", href: "/contacto?tipo=voluntariado", cta: "Записаться", keys: "волонтер волонтёр помогать время участвовать" },
    { q: "Хочу пожертвовать", a: "Можно сделать банковский перевод (IBAN с кнопкой «Скопировать» и QR-кодом) или передать вещи и продукты. Все средства идут на программы ассоциации.", href: "/donar", cta: "Способы пожертвования", keys: "пожертвовать деньги iban перевод bizum карта paypal вещи взнос член" },
    { q: "Я представляю организацию", a: "Учреждения, компании, университеты и НКО могут предложить совместный проект, спонсорство, корпоративное волонтёрство или помещение.", href: "/contacto?tipo=organizacion", cta: "Предложить сотрудничество", keys: "компания организация учреждение университет спонсор партнерство сотрудничество" },
    { q: "Где вы находитесь?", a: "Офис: Av. Manuel Llaneza, 68 · 33208 Хихон (Астурия). Мы также работаем в Авилесе и Овьедо, а в Мадриде, Барселоне и Валенсии — по записи.", href: "/contacto", cta: "Контакты", keys: "где адрес офис хихон авилес овьедо мадрид барселона валенсия запись" },
    { q: "Какие у вас проекты?", a: "Социальная инклюзия, обучение, развитие сельских территорий, экономика замкнутого цикла и цифровые инновации. Посмотрите все инициативы и их статус.", href: "/proyectos", cta: "Проекты", keys: "проекты программы инициативы чем занимаетесь neara" },
  ],
  uk: [
    { q: "Мені потрібна допомога", a: "Опишіть ситуацію у формі: продукти, документи, робота чи підтримка родини. Ми зв’яжемося з вами зручним способом. Якщо терміново — напишіть також у WhatsApp.", href: "/contacto?tipo=ayuda", cta: "Попросити допомогу", keys: "допомога потрібна продукти їжа документи робота родина терміново" },
    { q: "Хочу бути волонтером", a: "Заповніть форму волонтера за дві хвилини: оберіть напрями (логістика, переклади, навчання, IT…) і зручний час. Ми зв’яжемося з вами.", href: "/contacto?tipo=voluntariado", cta: "Записатися", keys: "волонтер допомагати час долучитися" },
    { q: "Хочу пожертвувати", a: "Можна зробити банківський переказ (IBAN з кнопкою «Копіювати» і QR-кодом) або передати речі та продукти. Усі кошти йдуть на програми асоціації.", href: "/donar", cta: "Способи пожертви", keys: "пожертвувати гроші iban переказ bizum картка paypal речі внесок член" },
    { q: "Я представляю організацію", a: "Установи, компанії, університети та НГО можуть запропонувати спільний проєкт, спонсорство, корпоративне волонтерство або приміщення.", href: "/contacto?tipo=organizacion", cta: "Запропонувати співпрацю", keys: "компанія організація установа університет спонсор партнерство співпраця" },
    { q: "Де ви знаходитеся?", a: "Офіс: Av. Manuel Llaneza, 68 · 33208 Хіхон (Астурія). Ми також працюємо в Авілесі та Ов’єдо, а в Мадриді, Барселоні та Валенсії — за записом.", href: "/contacto", cta: "Контакти", keys: "де адреса офіс хіхон авілес овєдо мадрид барселона валенсія запис" },
    { q: "Які у вас проєкти?", a: "Соціальна інклюзія, навчання, розвиток сільських територій, циркулярна економіка та цифрові інновації. Перегляньте всі ініціативи та їхній статус.", href: "/proyectos", cta: "Проєкти", keys: "проєкти програми ініціативи чим займаєтесь neara" },
  ],
  ast: [
    { q: "Preciso ayuda", a: "Cuéntanos la to situación nel formulariu: alimentos, trámites, emplegu o acompañamientu familiar. Contactámoste pel mediu qu'escueyas. Si ye urxente, escríbinos tamién per WhatsApp.", href: "/contacto?tipo=ayuda", cta: "Pidir ayuda", keys: "ayuda preciso precisar alimentos comida tramites documentos emplegu trabayu familia urxente necesito empleo trabajo urgente" },
    { q: "Quiero ser voluntariu/a", a: "Rellena'l formulariu de voluntariáu en dos minutos: escueyi árees (loxística, llingües, formación, teunoloxía…) y disponibilidá. Contactarémoste pa conocete.", href: "/contacto?tipo=voluntariado", cta: "Apuntame", keys: "voluntariu voluntaria voluntariau ayudar collaborar tiempu voluntario voluntariado colaborar tiempo" },
    { q: "Quiero donar", a: "Pues donar per tresferencia bancaria (IBAN con botón de copiar y códigu QR) o apurrir material y alimentos. Cada aportación destínase a los programes de l'asociación.", href: "/donar", cta: "Formes de donar", keys: "donar donacion dineru iban tresferencia bizum tarxeta paypal material sociu cuota dinero transferencia tarjeta socio" },
    { q: "Soi una organización", a: "Instituciones, empreses, universidaes y entidaes sociales puen proponenos proyectos conxuntos, patrociniu, voluntariáu corporativu o cesión d'espacios.", href: "/contacto?tipo=organizacion", cta: "Proponer collaboración", keys: "empresa organizacion entida institucion universida patrociniu alianza collaboracion entidad universidad patrocinio colaboracion" },
    { q: "¿Ónde tais?", a: "Sede en Av. Manuel Llaneza, 68 · 33208 Gijón (Asturias). Atendemos tamién n'Avilés y Uviéu, y en Madrid, Barcelona y Valencia con cita previa.", href: "/contacto", cta: "Contactu", keys: "onde direicion sede xixon gijon aviles uvieu oviedo madrid barcelona valencia horariu cita oficina donde direccion horario" },
    { q: "¿Qué proyectos tenéis?", a: "Trabayamos n'inclusión social, formación, desendolcu rural, economía circular ya innovación dixital. Pues ver toles iniciatives y el so estáu.", href: "/proyectos", cta: "Ver proyectos", keys: "proyectos programes iniciatives que faceis neara inicia lab coopastur nucleo programas iniciativas haceis" },
  ],
};

const norm = (value: string) => value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’'`ʼ]/g, "").replace(/[.,;:!?¿¡()«»"“”/\\-]/g, " ");

/** Finds the best answers by word overlap (prefix match, accent-insensitive). */
export function findAnswers(query: string, answers: Answer[]): Answer[] {
  const words = norm(query).split(/\s+/).filter(w => w.length >= 3);
  if (!words.length) return [];
  return answers
    .map(item => { const hay = norm(`${item.q} ${item.keys} ${item.a}`).split(/\s+/); const score = words.reduce((sum, w) => sum + (hay.some(h => h.startsWith(w.slice(0, Math.max(4, w.length - 2)))) ? 1 : 0), 0); return { item, score }; })
    .filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 3).map(x => x.item);
}

/** Free FAQ assistant (no AI, no data stored). Extra Q&A come from the sheet tab "Asistente". */
export function HelpAssistant() {
  const [locale] = useLocale();
  const t = ui[locale];
  const { data } = useSiteContent();
  const answers = useMemo(() => [...base[locale], ...forLocale(data?.faq ?? [], locale).map(f => ({ q: f.pregunta, a: f.respuesta, href: f.enlace || undefined, cta: f.enlace ? "→" : undefined, keys: f.palabras_clave }))], [locale, data?.faq]);
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<Answer>();
  const results = query ? findAnswers(query, answers) : [];
  const internal = (href?: string) => Boolean(href && href.startsWith("/"));
  const close = () => { setOpen(false); setPicked(undefined); setQuery(""); };

  return <div className={`fixed right-4 z-40 md:bottom-4 ${showsMobileBar(location) ? "bottom-20" : "bottom-4"}`}>
    {open && <div role="dialog" aria-label={t.title} className="mb-3 flex max-h-[70vh] w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl border border-[#D6B25E]/30 bg-[#0A1120] text-[#EEE7D7] shadow-[0_30px_80px_rgba(0,0,0,.6)]">
      <div className="flex items-center justify-between border-b border-[#D6B25E]/20 px-5 py-4"><p className="flex items-center gap-2 font-serif text-xl text-[#F0D893]"><Sparkles className="h-4 w-4 text-[#D6B25E]" />{t.title}</p><button type="button" onClick={close} aria-label={t.close} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10"><X className="h-4 w-4" /></button></div>
      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4 text-sm leading-6">
        {picked ? <>
          <button type="button" onClick={() => setPicked(undefined)} className="inline-flex items-center gap-1 text-xs font-bold text-[#D6B25E]"><ArrowLeft className="h-3 w-3" />{t.back}</button>
          <p className="font-semibold text-white">{picked.q}</p><p className="text-slate-200">{picked.a}</p>
          {picked.href && (internal(picked.href) ? <Link href={picked.href} onClick={close} className="inline-flex min-h-10 items-center rounded-full bg-[#D6B25E] px-4 text-xs font-bold text-[#120D05]">{picked.cta}<ArrowRight className="ml-1 h-3 w-3" /></Link> : <a href={picked.href} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center rounded-full bg-[#D6B25E] px-4 text-xs font-bold text-[#120D05]">{picked.cta}<ArrowRight className="ml-1 h-3 w-3" /></a>)}
        </> : <>
          <p className="text-slate-200">{t.hello}</p>
          <div className="flex items-center gap-2 rounded-full border border-[#D6B25E]/30 bg-[#060A12] px-3"><Search className="h-4 w-4 text-[#D6B25E]" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.search} aria-label={t.search} className="min-h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500" /></div>
          {query ? (results.length ? results.map(item => <button key={item.q} type="button" onClick={() => setPicked(item)} className="block w-full rounded-2xl border border-[#D6B25E]/20 px-4 py-3 text-left hover:border-[#D6B25E]">{item.q}</button>) : <p className="text-slate-300">{t.none}</p>)
            : <div className="flex flex-wrap gap-2">{answers.map(item => <button key={item.q} type="button" onClick={() => setPicked(item)} className="rounded-full border border-[#D6B25E]/30 px-3 py-1.5 text-left text-xs font-semibold hover:border-[#D6B25E] hover:text-[#F0D893]">{item.q}</button>)}</div>}
        </>}
      </div>
      <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 border-t border-[#D6B25E]/20 px-5 py-3 text-xs font-bold text-[#F0D893] hover:bg-white/5"><MessageCircle className="h-4 w-4" />{t.whatsapp}</a>
    </div>}
    {!open && <button type="button" onClick={() => setOpen(true)} className="flex min-h-12 items-center gap-2 rounded-full border border-[#D6B25E]/50 bg-[#0A1120] px-5 text-sm font-bold text-[#F0D893] shadow-xl transition hover:bg-[#111C30]"><Sparkles className="h-4 w-4 text-[#D6B25E]" />{t.open}</button>}
  </div>;
}
