import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Check, Copy, Download, Facebook, Linkedin, Mail, Megaphone, MessageCircle, Send, Share2, Sparkles, Twitter, Waves } from "lucide-react";
import { useSiteContent } from "@/lib/content";
import { type Locale, useT } from "@/lib/i18n";
import { SHEETS_ENDPOINT } from "@/lib/siteConfig";
import { track } from "@/lib/analytics";
import { DEFAULT_SHARE_TEXT, SITE_URL, type ShareTarget, countArrival, newOlaCode, olaLink, readMyOla, saveMyOla, shareUrl } from "@/lib/participation";

type ShareCopy = { eyebrow: string; title: string; body: string[]; cta: string; share: string; copy: string; copied: string; email: string; invite: string; inviteCta: string };

const shareCopy: Record<Locale, ShareCopy> = {
  es: { eyebrow: "Sé nuestro altavoz", title: "Tu voz llega donde nosotros no llegamos", body: ["Una persona que comparte es una puerta que se abre. Detrás de cada mensaje que reenvías puede haber una familia que encuentra apoyo, alguien que vuelve a trabajar o una persona que descubre que puede enseñar lo que sabe.", "No hace falta mucho: un clic, un mensaje a un amigo, una publicación en tus redes. Cada pequeño gesto se suma a los demás, y juntos llegan muy lejos."], cta: "¡Sé nuestro altavoz!", share: "Compartir", copy: "Copiar enlace", copied: "Enlace copiado", email: "Correo", invite: "¿Nos ayudas a llegar a más personas? Comparte Inicia con quien quieras.", inviteCta: "Sé nuestro altavoz" },
  en: { eyebrow: "Be our voice", title: "Your voice reaches where we cannot", body: ["Every person who shares opens a door. Behind each message you pass on there may be a family finding support, someone getting back to work, or a person discovering they can teach what they know.", "It doesn't take much: a click, a message to a friend, a post on your social media. Every small gesture adds up, and together they go a long way."], cta: "Be our voice!", share: "Share", copy: "Copy link", copied: "Link copied", email: "Email", invite: "Will you help us reach more people? Share Inicia with anyone you like.", inviteCta: "Be our voice" },
  ru: { eyebrow: "Станьте нашим голосом", title: "Ваш голос доходит туда, куда мы не можем", body: ["Каждый, кто делится, открывает дверь. За каждым пересланным сообщением может стоять семья, которая нашла поддержку, человек, вернувшийся к работе, или тот, кто понял, что может учить других.", "Нужно совсем немного: клик, сообщение другу, пост в соцсетях. Каждый маленький шаг складывается с другими, и вместе они доходят очень далеко."], cta: "Станьте нашим голосом!", share: "Поделиться", copy: "Скопировать ссылку", copied: "Ссылка скопирована", email: "Почта", invite: "Поможете нам дойти до большего числа людей? Поделитесь Inicia с кем хотите.", inviteCta: "Станьте нашим голосом" },
  uk: { eyebrow: "Станьте нашим голосом", title: "Ваш голос доходить туди, куди ми не можемо", body: ["Кожен, хто ділиться, відчиняє двері. За кожним пересланим повідомленням може стояти родина, яка знайшла підтримку, людина, що повернулася до роботи, або той, хто зрозумів, що може навчати інших.", "Потрібно зовсім небагато: клік, повідомлення другові, допис у соцмережах. Кожен маленький крок додається до інших, і разом вони сягають дуже далеко."], cta: "Станьте нашим голосом!", share: "Поділитися", copy: "Скопіювати посилання", copied: "Посилання скопійовано", email: "Пошта", invite: "Допоможете нам дійти до більшої кількості людей? Поділіться Inicia з ким забажаєте.", inviteCta: "Станьте нашим голосом" },
  ast: { eyebrow: "Sé'l nuestru altavoz", title: "La to voz llega onde nós nun llegamos", body: ["Una persona que comparte ye una puerta que s'abre. Detrás de cada mensaxe que reunvies pue haber una familia qu'atopa sofitu, daquién que vuelve trabayar o una persona que descubre que pue enseñar lo que sabe.", "Nun fai falta muncho: un clic, un mensaxe a un amigu, una publicación nes tos redes. Cada xestu pequeñu súmase a los demás, y xuntos lleguen mui lloñe."], cta: "¡Sé'l nuestru altavoz!", share: "Compartir", copy: "Copiar enllaz", copied: "Enllaz copiáu", email: "Corréu", invite: "¿Ayúdesnos a llegar a más persones? Comparte Inicia con quien quieras.", inviteCta: "Sé'l nuestru altavoz" },
};

const TARGETS: { key: ShareTarget; label: string; Icon: typeof Send }[] = [
  { key: "whatsapp", label: "WhatsApp", Icon: MessageCircle },
  { key: "telegram", label: "Telegram", Icon: Send },
  { key: "facebook", label: "Facebook", Icon: Facebook },
  { key: "x", label: "X", Icon: Twitter },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
];

async function copyText(value: string) {
  try { await navigator.clipboard.writeText(value); }
  catch { const area = document.createElement("textarea"); area.value = value; document.body.appendChild(area); area.select(); document.execCommand("copy"); area.remove(); }
}

/** Share buttons: the phone's own share menu when available, plus direct links to each network. */
export function ShareButtons({ url, text = DEFAULT_SHARE_TEXT, tag = "general" }: { url: string; text?: string; tag?: string }) {
  const t = useT(shareCopy);
  const [copied, setCopied] = useState(false);
  const [native, setNative] = useState(false);
  useEffect(() => { setNative(typeof navigator !== "undefined" && typeof navigator.share === "function"); }, []);
  const done = (method: string) => track("share", { method, content_type: tag });
  const btn = "inline-flex min-h-11 items-center gap-2 rounded-full border border-[#D6B25E]/40 px-4 text-sm font-bold text-[#EEE7D7] transition hover:border-[#D6B25E] hover:bg-[#D6B25E]/10";
  return <div className="flex flex-wrap gap-2">
    {native && <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#D6B25E] px-5 text-sm font-bold text-[#120D05]" onClick={() => navigator.share({ title: "Inicia Foundation", text, url }).then(() => done("native")).catch(() => undefined)}><Share2 className="h-4 w-4" />{t.share}</button>}
    {TARGETS.map(({ key, label, Icon }) => <a key={key} href={shareUrl(key, url, text)} target="_blank" rel="noreferrer" onClick={() => done(key)} className={btn}><Icon className="h-4 w-4 text-[#D6B25E]" />{label}</a>)}
    <a href={shareUrl("email", url, text)} onClick={() => done("email")} className={btn}><Mail className="h-4 w-4 text-[#D6B25E]" />{t.email}</a>
    <button type="button" className={btn} onClick={() => copyText(url).then(() => { done("copy"); setCopied(true); setTimeout(() => setCopied(false), 1800); })}>{copied ? <Check className="h-4 w-4 text-[#D6B25E]" /> : <Copy className="h-4 w-4 text-[#D6B25E]" />}{copied ? t.copied : t.copy}</button>
  </div>;
}

/** The "Be our voice" message with share buttons. */
export function ShareBlock({ url = SITE_URL, text, tag, compact = false }: { url?: string; text?: string; tag?: string; compact?: boolean }) {
  const t = useT(shareCopy);
  return <section className={`overflow-hidden rounded-3xl bg-gradient-to-br from-[#0E1729] to-[#090F1B] ring-1 ring-[#D6B25E]/25 ${compact ? "p-6 sm:p-8" : "p-7 sm:p-10"}`}>
    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-[#D6B25E]"><Megaphone className="h-4 w-4" />{t.eyebrow}</p>
    <h2 className={`mt-3 font-serif text-[#EEE7D7] ${compact ? "text-3xl" : "text-4xl md:text-5xl"}`}>{t.title}</h2>
    {t.body.map(line => <p key={line} className="mt-4 max-w-3xl leading-7 text-slate-300">{line}</p>)}
    <p className="mt-5 font-serif text-2xl italic text-[#F0D893]">{t.cta}</p>
    <div className="mt-6"><ShareButtons url={url} text={text} tag={tag} /></div>
  </section>;
}

/** Short invitation shown after someone sends a form. */
export function AltavozInvite() {
  const t = useT(shareCopy);
  return <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[#D6B25E]/30 bg-[#060A12] p-5 text-left"><p className="flex items-start gap-2 text-sm leading-6 text-slate-200"><Megaphone className="mt-0.5 h-4 w-4 shrink-0 text-[#D6B25E]" />{t.invite}</p><Link href="/altavoz" className="mt-3 inline-flex min-h-11 items-center rounded-full bg-[#D6B25E] px-5 text-sm font-bold text-[#120D05]">{t.inviteCta}</Link></div>;
}

/* ---------- Share card "Soy altavoz de Inicia" ---------- */

const cardCopy: Record<Locale, { eyebrow: string; title: string; text: string; download: string; shareImage: string; lines: [string, string, string] }> = {
  es: { eyebrow: "Tu tarjeta", title: "Soy altavoz de Inicia", text: "Descarga esta imagen y compártela en tus redes o estados. Cada persona que la ve puede ser la próxima en sumarse.", download: "Descargar imagen", shareImage: "Compartir imagen", lines: ["SOY ALTAVOZ DE", "Cada gesto suma.", "Únete en"] },
  en: { eyebrow: "Your card", title: "I am Inicia's voice", text: "Download this image and share it on your social media or status. Everyone who sees it could be the next to join.", download: "Download image", shareImage: "Share image", lines: ["I AM THE VOICE OF", "Every gesture counts.", "Join at"] },
  ru: { eyebrow: "Ваша карточка", title: "Я — голос Inicia", text: "Скачайте картинку и поделитесь ею в соцсетях или статусе. Каждый, кто её увидит, может стать следующим.", download: "Скачать картинку", shareImage: "Поделиться картинкой", lines: ["Я — ГОЛОС", "Каждый шаг важен.", "Присоединяйтесь:"] },
  uk: { eyebrow: "Ваша картка", title: "Я — голос Inicia", text: "Завантажте картинку та поділіться нею в соцмережах чи статусі. Кожен, хто її побачить, може стати наступним.", download: "Завантажити картинку", shareImage: "Поділитися картинкою", lines: ["Я — ГОЛОС", "Кожен крок важливий.", "Долучайтеся:"] },
  ast: { eyebrow: "La to tarxeta", title: "Soi altavoz d'Inicia", text: "Descarga esta imaxe y compártila nes tos redes o estaos. Cada persona que la ve pue ser la próxima en sumase.", download: "Descargar imaxe", shareImage: "Compartir imaxe", lines: ["SOI ALTAVOZ DE", "Cada xestu suma.", "Xúntate en"] },
};

async function drawCard(lines: [string, string, string]) {
  const size = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;
  try { await Promise.all([document.fonts.load("600 120px 'Cormorant Garamond'"), document.fonts.load("700 40px Manrope")]); } catch { /* system fonts */ }
  const bg = ctx.createLinearGradient(0, 0, size, size);
  bg.addColorStop(0, "#0E1729"); bg.addColorStop(1, "#04070D");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, size, size);
  // Golden spiral hint: concentric arcs.
  ctx.strokeStyle = "rgba(214,178,94,0.18)"; ctx.lineWidth = 3;
  for (let r = 120; r < 900; r *= 1.38) { ctx.beginPath(); ctx.arc(size - 140, 160, r, 0, Math.PI * 2); ctx.stroke(); }
  ctx.strokeStyle = "#D6B25E"; ctx.lineWidth = 6; ctx.strokeRect(48, 48, size - 96, size - 96);
  ctx.textAlign = "center"; ctx.fillStyle = "#D6B25E";
  ctx.font = "700 44px Manrope, Arial, sans-serif"; ctx.fillText(lines[0], size / 2, 380);
  ctx.fillStyle = "#F0D893"; ctx.font = "600 132px 'Cormorant Garamond', Georgia, serif"; ctx.fillText("Inicia", size / 2, 520); ctx.fillText("Foundation", size / 2, 650);
  ctx.fillStyle = "#EEE7D7"; ctx.font = "italic 600 64px 'Cormorant Garamond', Georgia, serif"; ctx.fillText(lines[1], size / 2, 780);
  ctx.fillStyle = "#CBD5E1"; ctx.font = "500 36px Manrope, Arial, sans-serif"; ctx.fillText(`${lines[2]} iniciafoundation.org`, size / 2, 930);
  return new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/png"));
}

export function ShareCard() {
  const t = useT(cardCopy);
  const [image, setImage] = useState<{ blob: Blob; url: string }>();
  const [canShareFile, setCanShareFile] = useState(false);
  useEffect(() => {
    let url = "";
    let cancelled = false;
    drawCard(t.lines).then(blob => {
      if (!blob || cancelled) return;
      url = URL.createObjectURL(blob);
      setImage({ blob, url });
      const file = new File([blob], "soy-altavoz-inicia.png", { type: "image/png" });
      setCanShareFile(typeof navigator !== "undefined" && typeof navigator.canShare === "function" && navigator.canShare({ files: [file] }));
    });
    return () => { cancelled = true; if (url) URL.revokeObjectURL(url); };
  }, [t]);
  const shareFile = () => {
    if (!image) return;
    const file = new File([image.blob], "soy-altavoz-inicia.png", { type: "image/png" });
    navigator.share({ files: [file], title: "Inicia Foundation", text: `${SITE_URL}` }).then(() => track("share", { method: "card" })).catch(() => undefined);
  };
  return <section className="grid gap-8 rounded-3xl bg-[#0C1320] p-7 ring-1 ring-[#D6B25E]/20 sm:p-10 md:grid-cols-[.9fr_1.1fr] md:items-center">
    <div className="mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl ring-1 ring-[#D6B25E]/30">{image ? <img src={image.url} alt={t.title} className="h-full w-full object-cover" /> : <div className="h-full w-full animate-pulse bg-[#0E1729]" />}</div>
    <div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-[#D6B25E]"><Sparkles className="h-4 w-4" />{t.eyebrow}</p><h2 className="mt-3 font-serif text-4xl text-[#EEE7D7]">{t.title}</h2><p className="mt-4 leading-7 text-slate-300">{t.text}</p>
      <div className="mt-6 flex flex-wrap gap-3">{canShareFile && <button type="button" onClick={shareFile} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#D6B25E] px-6 text-sm font-bold text-[#120D05]"><Share2 className="h-4 w-4" />{t.shareImage}</button>}{image && <a href={image.url} download="soy-altavoz-inicia.png" onClick={() => track("share", { method: "card_download" })} className={`inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-sm font-bold ${canShareFile ? "border border-[#D6B25E]/50 text-[#F0D893]" : "bg-[#D6B25E] text-[#120D05]"}`}><Download className="h-4 w-4" />{t.download}</a>}</div>
    </div>
  </section>;
}

/* ---------- Tu ola: a personal link that shows its own effect ---------- */

const olaCopy: Record<Locale, { eyebrow: string; title: string; text: string; create: string; yourLink: string; result: (visits: number, joined: number) => string; empty: string; privacy: string }> = {
  es: { eyebrow: "Tu ola", title: "Mira hasta dónde llega lo que compartes", text: "Crea tu enlace personal y compártelo. Aquí verás cuántas personas han conocido Inicia gracias a ti y cuántas se han sumado.", create: "Crear mi enlace", yourLink: "Tu enlace personal", result: (v, j) => `Gracias a ti, ${v} ${v === 1 ? "persona ha" : "personas han"} conocido Inicia y ${j} ${j === 1 ? "se ha" : "se han"} sumado.`, empty: "Tu ola acaba de empezar. Comparte tu enlace y vuelve a esta página para verla crecer.", privacy: "El enlace no guarda datos personales: solo cuenta visitas y altas." },
  en: { eyebrow: "Your wave", title: "See how far what you share goes", text: "Create your personal link and share it. Here you will see how many people discovered Inicia thanks to you and how many joined.", create: "Create my link", yourLink: "Your personal link", result: (v, j) => `Thanks to you, ${v} ${v === 1 ? "person has" : "people have"} discovered Inicia and ${j} ${j === 1 ? "has" : "have"} joined.`, empty: "Your wave has just started. Share your link and come back to watch it grow.", privacy: "The link stores no personal data: it only counts visits and sign-ups." },
  ru: { eyebrow: "Ваша волна", title: "Посмотрите, как далеко доходит то, чем вы делитесь", text: "Создайте личную ссылку и поделитесь ею. Здесь вы увидите, сколько людей узнали об Inicia благодаря вам и сколько присоединились.", create: "Создать мою ссылку", yourLink: "Ваша личная ссылка", result: (v, j) => `Благодаря вам об Inicia узнали ${v} чел., присоединились — ${j}.`, empty: "Ваша волна только началась. Поделитесь ссылкой и возвращайтесь посмотреть, как она растёт.", privacy: "Ссылка не хранит персональных данных: она считает только переходы и регистрации." },
  uk: { eyebrow: "Ваша хвиля", title: "Подивіться, як далеко сягає те, чим ви ділитеся", text: "Створіть особисте посилання й поділіться ним. Тут ви побачите, скільки людей дізналися про Inicia завдяки вам і скільки долучилися.", create: "Створити моє посилання", yourLink: "Ваше особисте посилання", result: (v, j) => `Завдяки вам про Inicia дізналися ${v} осіб, долучилися — ${j}.`, empty: "Ваша хвиля щойно почалася. Поділіться посиланням і повертайтеся подивитися, як вона росте.", privacy: "Посилання не зберігає персональних даних: воно рахує лише переходи та реєстрації." },
  ast: { eyebrow: "La to ola", title: "Mira hasta ónde llega lo que compartes", text: "Crea'l to enllaz personal y compártelu. Equí vas ver cuántes persones conocieron Inicia gracies a ti y cuántes se sumaron.", create: "Crear el mio enllaz", yourLink: "El to enllaz personal", result: (v, j) => `Gracies a ti, ${v} persones conocieron Inicia y ${j} se sumaron.`, empty: "La to ola acaba d'entamar. Comparte'l to enllaz y vuelve a esta páxina pa vela crecer.", privacy: "L'enllaz nun guarda datos personales: namás cuenta visites y altes." },
};

/** Personal link with its own counter. Shown only once the deployed Apps Script supports it (features.ola). */
export function TuOla() {
  const t = useT(olaCopy);
  const { data } = useSiteContent();
  const [code, setCode] = useState<string>();
  const [stats, setStats] = useState<{ visitas: number; unidos: number }>();
  useEffect(() => { setCode(readMyOla()); }, []);
  useEffect(() => {
    if (!code || !SHEETS_ENDPOINT) return;
    let cancelled = false;
    fetch(`${SHEETS_ENDPOINT}?action=ola&ref=${code}`).then(r => r.json()).then(r => { if (!cancelled && r?.ok) setStats({ visitas: Number(r.visitas) || 0, unidos: Number(r.unidos) || 0 }); }).catch(() => undefined);
    return () => { cancelled = true; };
  }, [code]);
  if (data.features?.ola !== true) return null;
  const create = () => { const next = newOlaCode(); saveMyOla(next); setCode(next); track("ola_created"); };
  const link = code ? olaLink(code) : "";
  return <section className="rounded-3xl bg-gradient-to-br from-[#16233A] to-[#0A1120] p-7 ring-1 ring-[#D6B25E]/30 sm:p-10">
    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-[#D6B25E]"><Waves className="h-4 w-4" />{t.eyebrow}</p>
    <h2 className="mt-3 font-serif text-4xl text-[#EEE7D7]">{t.title}</h2>
    <p className="mt-4 max-w-2xl leading-7 text-slate-300">{t.text}</p>
    {!code ? <button type="button" onClick={create} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#D6B25E] px-6 text-sm font-bold text-[#120D05]"><Waves className="h-4 w-4" />{t.create}</button> : <div className="mt-6 space-y-5">
      <div className="rounded-2xl border border-[#D6B25E]/25 bg-[#060A12] px-4 py-3"><p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#D6B25E]">{t.yourLink}</p><p className="mt-1 break-all font-mono text-base text-[#EEE7D7]">{link}</p></div>
      <p className="font-serif text-2xl leading-snug text-[#F0D893]">{stats && (stats.visitas || stats.unidos) ? t.result(stats.visitas, stats.unidos) : t.empty}</p>
      <ShareButtons url={link} tag="ola" />
    </div>}
    <p className="mt-5 text-xs text-slate-400">{t.privacy}</p>
  </section>;
}

/** Counts one visit for the personal link a visitor arrived with. Renders nothing. */
export function OlaArrival() {
  useEffect(() => { countArrival(SHEETS_ENDPOINT); }, []);
  return null;
}

/* ---------- Hidden until switched on in the "Ajustes" tab ---------- */

const counterCopy: Record<Locale, { title: string; labels: [string, string, string, string] }> = {
  es: { title: "Una comunidad que crece", labels: ["socios y socias", "voluntarios y voluntarias", "mentores", "participantes"] },
  en: { title: "A growing community", labels: ["members", "volunteers", "mentors", "participants"] },
  ru: { title: "Сообщество, которое растёт", labels: ["членов", "волонтёров", "наставников", "участников"] },
  uk: { title: "Спільнота, що зростає", labels: ["членів", "волонтерів", "наставників", "учасників"] },
  ast: { title: "Una comunidá que crez", labels: ["socios y socies", "voluntarios y voluntaries", "mentores", "participantes"] },
};

/** Live community counter: rendered only when "contador_mostrar" = "si" in the sheet's "Ajustes" tab. */
export function CommunityCounter() {
  const t = useT(counterCopy);
  const { data } = useSiteContent();
  const c = data.comunidad;
  if ((data.settings.contador_mostrar || "").toLowerCase() !== "si" || !c) return null;
  const values = [c.socios, c.voluntarios, c.mentores, c.participantes];
  const items = values.map((value, i) => [value, t.labels[i]] as const).filter(([value]) => value > 0);
  if (!items.length) return null;
  return <section className="rounded-3xl bg-[#0C1320] p-7 ring-1 ring-[#D6B25E]/20"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#D6B25E]">{t.title}</p><dl className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-4">{items.map(([value, label]) => <div key={label} className="flex flex-col-reverse"><dt className="text-sm text-slate-300">{label}</dt><dd className="font-serif text-5xl text-[#F0D893]">{value}</dd></div>)}</dl></section>;
}

const impactCopy: Record<Locale, string> = { es: "Qué hace tu aportación", en: "What your gift does", ru: "Что даёт ваш вклад", uk: "Що дає ваш внесок", ast: "Qué fai la to aportación" };

/** "10 € = …" examples: rendered only when "impacto_mostrar" = "si" and rows impacto_1…impacto_6 ("10|texto") exist in "Ajustes". */
export function ImpactExamples() {
  const title = useT(impactCopy);
  const { data } = useSiteContent();
  const s = data.settings;
  if ((s.impacto_mostrar || "").toLowerCase() !== "si") return null;
  const items = [1, 2, 3, 4, 5, 6].map(i => (s[`impacto_${i}`] || "").split("|")).filter(([amount, text]) => /^\d{1,5}$/.test((amount || "").trim()) && text?.trim()).map(([amount, text]) => [Number(amount), text.trim().slice(0, 140)] as const);
  if (!items.length) return null;
  return <div className="mt-6 rounded-2xl border border-[#D6B25E]/25 bg-[#060A12] p-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#D6B25E]">{title}</p><ul className="mt-3 space-y-2">{items.map(([amount, text]) => <li key={amount} className="flex gap-3 text-sm leading-6 text-slate-200"><span className="min-w-14 font-serif text-xl text-[#F0D893]">{amount} €</span><span>{text}</span></li>)}</ul></div>;
}
