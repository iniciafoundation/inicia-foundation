import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Building2, Check, Copy, CreditCard, HandHeart, Landmark, Package, Smartphone, UsersRound } from "lucide-react";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { RequestForm } from "@/components/RequestForm";
import { SpiralMark } from "@/components/SpiralMark";
import { useT } from "@/lib/i18n";
import { CONTACT, DONATION } from "@/lib/siteConfig";

type Method = "bizum" | "transfer" | "card";

const copy = {
  es: {
    eyebrow: "Donar", title: "Tu apoyo, convertido en", accent: "ayuda real.", intro: "Cada aportación sostiene el acompañamiento a familias, la formación y los proyectos comunitarios de INICIA.",
    stats: [["317", "familias ucranianas acompañadas"], ["129", "familias de otros orígenes y vecinos"], ["2021", "trabajando desde"]],
    amountLabel: "Elige un importe", other: "Otro", amountNote: "Indica este importe en Bizum o en tu transferencia.",
    methods: { bizum: "Bizum", transfer: "Transferencia", card: "Tarjeta" },
    bizumSteps: ["Abre la app de tu banco y entra en Bizum.", "Elige «Donar a una ONG» o «Donativos».", "Introduce nuestro código y el importe."],
    bizumCode: "Código Bizum ONG",
    transferSteps: ["Copia el IBAN y el titular.", "Haz la transferencia desde tu banco.", "En el concepto escribe «Donativo» y, si quieres, el proyecto."],
    holder: "Titular", iban: "IBAN", bic: "BIC", concept: "Concepto", conceptValue: "Donativo",
    qr: "Escanea con la app de tu banco",
    card: "Pago seguro con tarjeta desde cualquier país.", cardCta: "Donar con tarjeta",
    soon: "Estamos activando este método. Mientras tanto, escríbenos y te indicamos cómo donar.", soonCta: "Escribir por WhatsApp",
    copy: "Copiar", copied: "Copiado",
    teaming: "Dona 1 € al mes con Teaming", teamingText: "Microdonaciones de 1 € al mes. Pequeño para ti, enorme sumado.",
    ways: "Otras formas de apoyar",
    wayItems: [["Material y alimentos", "Ropa, alimentos, material escolar o equipos informáticos.", "/contacto?tipo=donar"], ["Hazte socio/a", "Una cuota periódica que nos da estabilidad.", "/contacto?tipo=donar"], ["Empresas y entidades", "Patrocinio, voluntariado corporativo o proyectos conjuntos.", "/contacto?tipo=organizacion"], ["Voluntariado", "Tu tiempo y tus habilidades también suman.", "/contacto?tipo=voluntariado"]],
    formTitle: "Donar material o hacerte socio/a", formIntro: "Cuéntanos qué quieres aportar y te contactamos para organizarlo.",
    trust: "INICIA Foundation · Asociación sin ánimo de lucro · NIF G05426242 · Registro de Asociaciones del Principado de Asturias nº 13148",
  },
  en: {
    eyebrow: "Donate", title: "Your support, turned into", accent: "real help.", intro: "Every contribution sustains INICIA's support for families, training and community projects.",
    stats: [["317", "Ukrainian families supported"], ["129", "families of other origins and neighbours"], ["2021", "working since"]],
    amountLabel: "Choose an amount", other: "Other", amountNote: "Enter this amount in Bizum or in your transfer.",
    methods: { bizum: "Bizum", transfer: "Bank transfer", card: "Card" },
    bizumSteps: ["Open your banking app and go to Bizum.", "Choose “Donate to an NGO” (Donar a una ONG).", "Enter our code and the amount."],
    bizumCode: "Bizum NGO code",
    transferSteps: ["Copy the IBAN and account holder.", "Make the transfer from your bank.", "Write “Donativo” as the reference and, if you like, the project."],
    holder: "Account holder", iban: "IBAN", bic: "BIC", concept: "Reference", conceptValue: "Donativo",
    qr: "Scan with your banking app",
    card: "Secure card payment from any country.", cardCta: "Donate by card",
    soon: "We are activating this method. Meanwhile, write to us and we will tell you how to donate.", soonCta: "Write on WhatsApp",
    copy: "Copy", copied: "Copied",
    teaming: "Give €1 a month with Teaming", teamingText: "€1 monthly micro-donations. Small for you, huge together.",
    ways: "Other ways to help",
    wayItems: [["Goods and food", "Clothes, food, school supplies or computers.", "/contacto?tipo=donar"], ["Become a member", "A regular fee that gives us stability.", "/contacto?tipo=donar"], ["Companies and organisations", "Sponsorship, corporate volunteering or joint projects.", "/contacto?tipo=organizacion"], ["Volunteering", "Your time and skills count too.", "/contacto?tipo=voluntariado"]],
    formTitle: "Donate goods or become a member", formIntro: "Tell us what you would like to give and we will contact you to arrange it.",
    trust: "INICIA Foundation · Non-profit association · Tax ID G05426242 · Registered in the Principality of Asturias, no. 13148",
  },
  ru: {
    eyebrow: "Поддержать", title: "Ваша поддержка превращается в", accent: "реальную помощь.", intro: "Каждый взнос помогает INICIA сопровождать семьи, проводить обучение и развивать местные проекты.",
    stats: [["317", "украинских семей получили поддержку"], ["129", "семей другого происхождения и местных жителей"], ["2021", "работаем с"]],
    amountLabel: "Выберите сумму", other: "Другая", amountNote: "Укажите эту сумму в Bizum или в переводе.",
    methods: { bizum: "Bizum", transfer: "Перевод", card: "Карта" },
    bizumSteps: ["Откройте приложение своего банка и раздел Bizum.", "Выберите «Donar a una ONG» (пожертвование НКО).", "Введите наш код и сумму."],
    bizumCode: "Код Bizum для НКО",
    transferSteps: ["Скопируйте IBAN и получателя.", "Сделайте перевод из своего банка.", "В назначении платежа напишите «Donativo» и, если хотите, название проекта."],
    holder: "Получатель", iban: "IBAN", bic: "BIC", concept: "Назначение", conceptValue: "Donativo",
    qr: "Отсканируйте в приложении банка",
    card: "Безопасная оплата картой из любой страны.", cardCta: "Пожертвовать картой",
    soon: "Мы подключаем этот способ. Пока напишите нам — подскажем, как сделать пожертвование.", soonCta: "Написать в WhatsApp",
    copy: "Копировать", copied: "Скопировано",
    teaming: "1 € в месяц через Teaming", teamingText: "Микропожертвования по 1 € в месяц. Немного для вас — много вместе.",
    ways: "Другие способы помочь",
    wayItems: [["Вещи и продукты", "Одежда, продукты, школьные принадлежности, техника.", "/contacto?tipo=donar"], ["Стать членом фонда", "Регулярный взнос, который даёт нам стабильность.", "/contacto?tipo=donar"], ["Компании и организации", "Спонсорство, корпоративное волонтёрство, совместные проекты.", "/contacto?tipo=organizacion"], ["Волонтёрство", "Ваше время и навыки тоже помогают.", "/contacto?tipo=voluntariado"]],
    formTitle: "Передать вещи или стать членом фонда", formIntro: "Расскажите, чем хотите помочь, и мы свяжемся с вами, чтобы всё организовать.",
    trust: "INICIA Foundation · Некоммерческая ассоциация · NIF G05426242 · Реестр ассоциаций Астурии № 13148",
  },
  uk: {
    eyebrow: "Підтримати", title: "Ваша підтримка перетворюється на", accent: "реальну допомогу.", intro: "Кожен внесок допомагає INICIA супроводжувати родини, проводити навчання та розвивати місцеві проєкти.",
    stats: [["317", "українських родин отримали підтримку"], ["129", "родин іншого походження та місцевих мешканців"], ["2021", "працюємо з"]],
    amountLabel: "Оберіть суму", other: "Інша", amountNote: "Вкажіть цю суму в Bizum або в переказі.",
    methods: { bizum: "Bizum", transfer: "Переказ", card: "Картка" },
    bizumSteps: ["Відкрийте застосунок свого банку та розділ Bizum.", "Оберіть «Donar a una ONG» (пожертва НГО).", "Введіть наш код і суму."],
    bizumCode: "Код Bizum для НГО",
    transferSteps: ["Скопіюйте IBAN та отримувача.", "Зробіть переказ зі свого банку.", "У призначенні платежу напишіть «Donativo» і, за бажанням, назву проєкту."],
    holder: "Отримувач", iban: "IBAN", bic: "BIC", concept: "Призначення", conceptValue: "Donativo",
    qr: "Відскануйте в застосунку банку",
    card: "Безпечна оплата карткою з будь-якої країни.", cardCta: "Пожертвувати карткою",
    soon: "Ми підключаємо цей спосіб. Поки що напишіть нам — підкажемо, як зробити пожертву.", soonCta: "Написати у WhatsApp",
    copy: "Копіювати", copied: "Скопійовано",
    teaming: "1 € на місяць через Teaming", teamingText: "Мікропожертви по 1 € на місяць. Небагато для вас — багато разом.",
    ways: "Інші способи допомогти",
    wayItems: [["Речі та продукти", "Одяг, продукти, шкільне приладдя, техніка.", "/contacto?tipo=donar"], ["Стати членом фонду", "Регулярний внесок, що дає нам стабільність.", "/contacto?tipo=donar"], ["Компанії та організації", "Спонсорство, корпоративне волонтерство, спільні проєкти.", "/contacto?tipo=organizacion"], ["Волонтерство", "Ваш час і навички теж допомагають.", "/contacto?tipo=voluntariado"]],
    formTitle: "Передати речі або стати членом фонду", formIntro: "Розкажіть, чим хочете допомогти, і ми зв’яжемося з вами, щоб усе організувати.",
    trust: "INICIA Foundation · Неприбуткова асоціація · NIF G05426242 · Реєстр асоціацій Астурії № 13148",
  },
};

const WAY_ICONS = [Package, UsersRound, Building2, HandHeart];

function CopyRow({ label, value, copyLabel, copiedLabel }: { label: string; value: string; copyLabel: string; copiedLabel: string }) {
  const [done, setDone] = useState(false);
  const copyValue = async () => {
    try { await navigator.clipboard.writeText(value.replace(/\s/g, label === "IBAN" ? "" : " ")); }
    catch { const area = document.createElement("textarea"); area.value = value; document.body.appendChild(area); area.select(); document.execCommand("copy"); area.remove(); }
    setDone(true); setTimeout(() => setDone(false), 1800);
  };
  return <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#0B1E3A]/10 bg-[#F7F3EA] px-4 py-3"><div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#7E5F1E]">{label}</p><p className="mt-0.5 break-all font-mono text-base font-semibold text-[#0B1E3A]">{value}</p></div><button type="button" onClick={copyValue} className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-[#0B1E3A] px-4 text-xs font-bold text-[#F0D893]">{done ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{done ? copiedLabel : copyLabel}</button></div>;
}

function Soon({ text, cta }: { text: string; cta: string }) {
  return <div className="rounded-2xl border border-dashed border-[#D6B25E] bg-[#FFFBF1] p-5"><p className="leading-7 text-slate-700">{text}</p><a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#0B1E3A] px-5 text-sm font-bold text-[#F0D893]">{cta}</a></div>;
}

/** EPC (SEPA credit transfer) QR payload, readable by many European banking apps. */
export function epcPayload(iban: string, bic: string, holder: string, amount: number | undefined, reference: string) {
  return ["BCD", "002", "1", "SCT", bic, holder.slice(0, 70), iban.replace(/\s/g, ""), amount ? `EUR${amount.toFixed(2)}` : "", "", "", reference.slice(0, 140)].join("\n");
}

function TransferQr({ amount, reference }: { amount?: number; reference: string }) {
  const [src, setSrc] = useState<string>();
  useEffect(() => {
    if (!DONATION.iban) return;
    let cancelled = false;
    import("qrcode").then(({ toDataURL }) => toDataURL(epcPayload(DONATION.iban, DONATION.bic, DONATION.holder, amount, reference), { margin: 1, width: 220, color: { dark: "#0B1E3A", light: "#FFFFFF" } })).then(url => { if (!cancelled) setSrc(url); }).catch(() => undefined);
    return () => { cancelled = true; };
  }, [amount, reference]);
  return src ? <img src={src} alt="QR" width={180} height={180} className="rounded-xl border border-[#0B1E3A]/10" /> : null;
}

export default function Donate() {
  const t = useT(copy);
  const [amount, setAmount] = useState<number | undefined>(25);
  const [custom, setCustom] = useState("");
  const methods: Method[] = DONATION.cardLink ? ["bizum", "transfer", "card"] : ["bizum", "transfer"];
  const [method, setMethod] = useState<Method>("bizum");
  const finalAmount = custom ? Number(custom) || undefined : amount;

  return <main className="min-h-screen bg-[#F7F3EA] text-[#0B1E3A]">
    <OriginalSiteNavigation dark />
    <section className="relative overflow-hidden bg-[#0B1E3A] px-5 pb-36 pt-16 text-white">
      <SpiralMark className="pointer-events-none absolute -right-20 top-0 h-[460px] w-[460px] opacity-20" />
      <div className="relative mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#D6B25E]">{t.eyebrow}</p><h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.02] md:text-6xl">{t.title} <span className="text-[#F0D893]">{t.accent}</span></h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">{t.intro}</p>
        <dl className="mt-10 grid max-w-3xl grid-cols-3 gap-4 border-t border-[#D6B25E]/30 pt-6">{t.stats.map(([value, label]) => <div key={label}><dt className="sr-only">{label}</dt><dd className="font-serif text-4xl text-[#F0D893] md:text-5xl">{value}</dd><p className="mt-1 text-xs leading-5 text-slate-300 md:text-sm">{label}</p></div>)}</dl>
      </div>
    </section>

    <section className="relative z-10 mx-auto -mt-24 max-w-6xl px-5">
      <div className="grid gap-8 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-[#0B1E3A]/10 sm:p-9 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold text-[#0B1E3A]">{t.amountLabel}</p>
          <div className="mt-4 grid grid-cols-4 gap-2">{[10, 25, 50].map(value => <button key={value} type="button" aria-pressed={!custom && amount === value} onClick={() => { setAmount(value); setCustom(""); }} className={`min-h-14 rounded-2xl border text-lg font-bold transition ${!custom && amount === value ? "border-[#0B1E3A] bg-[#0B1E3A] text-[#F0D893]" : "border-[#0B1E3A]/15 hover:border-[#D6B25E]"}`}>{value} €</button>)}
            <input aria-label={t.other} placeholder={t.other} inputMode="numeric" value={custom} onChange={e => setCustom(e.target.value.replace(/[^0-9]/g, ""))} className={`min-h-14 rounded-2xl border px-3 text-center text-lg font-bold outline-none focus:border-[#D6B25E] ${custom ? "border-[#0B1E3A]" : "border-[#0B1E3A]/15"}`} /></div>
          <p className="mt-3 text-sm text-slate-500">{t.amountNote}</p>
          {DONATION.teamingLink && <a href={DONATION.teamingLink} target="_blank" rel="noreferrer" className="mt-6 block rounded-2xl bg-[#F7F3EA] p-5 transition hover:ring-2 hover:ring-[#D6B25E]"><p className="font-serif text-2xl">{t.teaming}</p><p className="mt-1 text-sm text-slate-600">{t.teamingText}</p></a>}
        </div>
        <div>
          <div role="tablist" className="grid gap-2" style={{ gridTemplateColumns: `repeat(${methods.length}, minmax(0, 1fr))` }}>{methods.map(key => { const Icon = key === "bizum" ? Smartphone : key === "transfer" ? Landmark : CreditCard; return <button key={key} role="tab" type="button" aria-selected={method === key} onClick={() => setMethod(key)} className={`flex min-h-12 items-center justify-center gap-2 rounded-full text-sm font-bold transition ${method === key ? "bg-[#D6B25E] text-[#0B1E3A]" : "bg-[#F7F3EA] text-[#0B1E3A] hover:bg-[#EFE3C4]"}`}><Icon className="h-4 w-4" />{t.methods[key]}</button>; })}</div>
          <div className="mt-6 space-y-4" role="tabpanel">
            {method === "bizum" && <>{DONATION.bizumCode ? <><ol className="space-y-2">{t.bizumSteps.map((line, index) => <li key={line} className="flex gap-3 text-sm leading-6"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0B1E3A] text-xs font-bold text-[#F0D893]">{index + 1}</span>{line}</li>)}</ol><CopyRow label={t.bizumCode} value={DONATION.bizumCode} copyLabel={t.copy} copiedLabel={t.copied} />{finalAmount && <p className="text-sm text-slate-600">{finalAmount} €</p>}</> : <Soon text={t.soon} cta={t.soonCta} />}</>}
            {method === "transfer" && <>{DONATION.iban ? <><ol className="space-y-2">{t.transferSteps.map((line, index) => <li key={line} className="flex gap-3 text-sm leading-6"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0B1E3A] text-xs font-bold text-[#F0D893]">{index + 1}</span>{line}</li>)}</ol><CopyRow label={t.iban} value={DONATION.iban} copyLabel={t.copy} copiedLabel={t.copied} /><CopyRow label={t.holder} value={DONATION.holder} copyLabel={t.copy} copiedLabel={t.copied} /><CopyRow label={t.concept} value={t.conceptValue} copyLabel={t.copy} copiedLabel={t.copied} /><div className="hidden items-center gap-4 sm:flex"><TransferQr amount={finalAmount} reference={t.conceptValue} /><p className="text-sm text-slate-600">{t.qr}</p></div></> : <Soon text={t.soon} cta={t.soonCta} />}</>}
            {method === "card" && DONATION.cardLink && <div><p className="leading-7 text-slate-700">{t.card}</p><a href={DONATION.cardLink} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-12 items-center rounded-full bg-[#0B1E3A] px-6 text-sm font-bold text-[#F0D893]">{t.cardCta}<ArrowRight className="ml-2 h-4 w-4" /></a></div>}
          </div>
        </div>
      </div>
      <p className="mt-5 text-center text-xs leading-5 text-slate-500">{t.trust}</p>
    </section>

    <section className="mx-auto max-w-6xl px-5 py-20"><h2 className="font-serif text-4xl md:text-5xl">{t.ways}</h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{t.wayItems.map(([title, text, href], index) => { const Icon = WAY_ICONS[index]; return <Link key={title} href={href} className="group rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#0B1E3A]/10 transition hover:-translate-y-0.5 hover:ring-[#D6B25E]"><Icon className="h-7 w-7 text-[#7E5F1E]" /><h3 className="mt-4 font-serif text-2xl">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p><ArrowRight className="mt-4 h-4 w-4 text-[#7E5F1E] transition group-hover:translate-x-1" /></Link>; })}</div>
    </section>

    <section id="material" className="bg-[#0F274A] px-5 py-20"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.7fr_1.3fr]"><div className="text-white"><h2 className="font-serif text-4xl md:text-5xl">{t.formTitle}</h2><p className="mt-4 leading-7 text-slate-200">{t.formIntro}</p></div><RequestForm initialType="donar" compact /></div></section>
  </main>;
}
