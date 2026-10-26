import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Building2, Check, Copy, CreditCard, Globe, HandHeart, Landmark, Package, Smartphone, UsersRound, Wallet } from "lucide-react";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { RequestForm } from "@/components/RequestForm";
import { SpiralMark } from "@/components/SpiralMark";
import { useLocale, useT } from "@/lib/i18n";
import { requestCopy } from "@/lib/requestCopy";
import { useSettings } from "@/lib/content";
import { track } from "@/lib/analytics";
import { CONTACT, DONATION } from "@/lib/siteConfig";

type Method = "bizum" | "transfer" | "card" | "paypal" | "other";

const copy = {
  es: { membersEyebrow: "Hazte socio/a", membersTitle: "Apoyo constante, cada mes.", membersIntro: "Las cuotas de socios dan estabilidad a los programas. La cuota se cobra por domiciliación bancaria: no tienes que acordarte de transferir.", membersCta: "Hacerme socio/a", membersNote: "Tras enviar la solicitud te contactamos para firmar la orden de domiciliación SEPA. Puedes darte de baja cuando quieras.", 
    eyebrow: "Donar", title: "Tu apoyo, convertido en", accent: "ayuda real.", intro: "Cada aportación sostiene el acompañamiento a familias, la formación y los proyectos comunitarios de INICIA.",
    stats: [["317", "familias ucranianas acompañadas"], ["129", "familias de otros orígenes y vecinos"], ["2021", "trabajando desde"]],
    amountLabel: "Elige un importe", other: "Otro", amountNote: "Indica este importe en Bizum o en tu transferencia.",
    methods: { bizum: "Bizum", transfer: "Transferencia", card: "Tarjeta", paypal: "PayPal", other: "Otra" },
    bizumSteps: ["Abre la app de tu banco y entra en Bizum.", "Elige «Donar a una ONG» o «Donativos».", "Introduce nuestro código y el importe."],
    bizumCode: "Código Bizum ONG",
    transferSteps: ["Copia el IBAN y el titular.", "Haz la transferencia desde tu banco.", "En el concepto escribe «Donativo» y, si quieres, el proyecto."],
    holder: "Titular", iban: "IBAN", bic: "BIC", concept: "Concepto", conceptValue: "Donativo",
    qr: "Escanea con la app de tu banco",
    card: "Pago seguro con tarjeta, Apple Pay o Google Pay desde cualquier país.", cardCta: "Donar con tarjeta",
    linkQr: "Escanea con el móvil para pagar", paypal: "Dona con tu cuenta de PayPal o con tarjeta a través de PayPal.", paypalCta: "Donar con PayPal", otherText: "Dona a través de esta plataforma de donaciones.", otherCta: "Ir a la plataforma", pageQr: "¿Estás en el ordenador? Escanea este código y dona desde tu móvil.",
    soon: "Estamos activando este método. Mientras tanto, escríbenos y te indicamos cómo donar.", soonCta: "Escribir por WhatsApp",
    copy: "Copiar", copied: "Copiado",
    teaming: "Dona 1 € al mes con Teaming", teamingText: "Microdonaciones de 1 € al mes. Pequeño para ti, enorme sumado.",
    ways: "Otras formas de apoyar",
    wayItems: [["Material y alimentos", "Ropa, alimentos, material escolar o equipos informáticos.", "/contacto?tipo=donar"], ["Hazte socio/a", "Una cuota periódica que nos da estabilidad.", "/contacto?tipo=donar"], ["Empresas y entidades", "Patrocinio, voluntariado corporativo o proyectos conjuntos.", "/contacto?tipo=organizacion"], ["Voluntariado", "Tu tiempo y tus habilidades también suman.", "/contacto?tipo=voluntariado"]],
    formTitle: "Donar material o hacerte socio/a", formIntro: "Cuéntanos qué quieres aportar y te contactamos para organizarlo.",
    trust: "INICIA Foundation · Asociación sin ánimo de lucro · NIF G05426242 · Registro de Asociaciones del Principado de Asturias nº 13148",
  },
  en: { membersEyebrow: "Become a member", membersTitle: "Steady support, every month.", membersIntro: "Membership fees give the programmes stability. The fee is collected by direct debit, so you never have to remember a transfer.", membersCta: "Become a member", membersNote: "After you send the request we will contact you to sign the SEPA direct debit mandate. You can cancel at any time.", 
    eyebrow: "Donate", title: "Your support, turned into", accent: "real help.", intro: "Every contribution sustains INICIA's support for families, training and community projects.",
    stats: [["317", "Ukrainian families supported"], ["129", "families of other origins and neighbours"], ["2021", "working since"]],
    amountLabel: "Choose an amount", other: "Other", amountNote: "Enter this amount in Bizum or in your transfer.",
    methods: { bizum: "Bizum", transfer: "Bank transfer", card: "Card", paypal: "PayPal", other: "Other" },
    bizumSteps: ["Open your banking app and go to Bizum.", "Choose “Donate to an NGO” (Donar a una ONG).", "Enter our code and the amount."],
    bizumCode: "Bizum NGO code",
    transferSteps: ["Copy the IBAN and account holder.", "Make the transfer from your bank.", "Write “Donativo” as the reference and, if you like, the project."],
    holder: "Account holder", iban: "IBAN", bic: "BIC", concept: "Reference", conceptValue: "Donativo",
    qr: "Scan with your banking app",
    card: "Secure payment by card, Apple Pay or Google Pay from any country.", cardCta: "Donate by card",
    linkQr: "Scan with your phone to pay", paypal: "Donate with your PayPal account or by card via PayPal.", paypalCta: "Donate with PayPal", otherText: "Donate through this donation platform.", otherCta: "Go to the platform", pageQr: "On a computer? Scan this code to donate from your phone.",
    soon: "We are activating this method. Meanwhile, write to us and we will tell you how to donate.", soonCta: "Write on WhatsApp",
    copy: "Copy", copied: "Copied",
    teaming: "Give €1 a month with Teaming", teamingText: "€1 monthly micro-donations. Small for you, huge together.",
    ways: "Other ways to help",
    wayItems: [["Goods and food", "Clothes, food, school supplies or computers.", "/contacto?tipo=donar"], ["Become a member", "A regular fee that gives us stability.", "/contacto?tipo=donar"], ["Companies and organisations", "Sponsorship, corporate volunteering or joint projects.", "/contacto?tipo=organizacion"], ["Volunteering", "Your time and skills count too.", "/contacto?tipo=voluntariado"]],
    formTitle: "Donate goods or become a member", formIntro: "Tell us what you would like to give and we will contact you to arrange it.",
    trust: "INICIA Foundation · Non-profit association · Tax ID G05426242 · Registered in the Principality of Asturias, no. 13148",
  },
  ru: { membersEyebrow: "Стать членом фонда", membersTitle: "Постоянная поддержка каждый месяц.", membersIntro: "Членские взносы дают программам стабильность. Взнос списывается автоматически с банковского счёта — не нужно помнить о переводах.", membersCta: "Стать членом фонда", membersNote: "После заявки мы свяжемся с вами, чтобы подписать поручение на автосписание SEPA. Отказаться можно в любой момент.", 
    eyebrow: "Поддержать", title: "Ваша поддержка превращается в", accent: "реальную помощь.", intro: "Каждый взнос помогает INICIA сопровождать семьи, проводить обучение и развивать местные проекты.",
    stats: [["317", "украинских семей получили поддержку"], ["129", "семей другого происхождения и местных жителей"], ["2021", "работаем с"]],
    amountLabel: "Выберите сумму", other: "Другая", amountNote: "Укажите эту сумму в Bizum или в переводе.",
    methods: { bizum: "Bizum", transfer: "Перевод", card: "Карта", paypal: "PayPal", other: "Другое" },
    bizumSteps: ["Откройте приложение своего банка и раздел Bizum.", "Выберите «Donar a una ONG» (пожертвование НКО).", "Введите наш код и сумму."],
    bizumCode: "Код Bizum для НКО",
    transferSteps: ["Скопируйте IBAN и получателя.", "Сделайте перевод из своего банка.", "В назначении платежа напишите «Donativo» и, если хотите, название проекта."],
    holder: "Получатель", iban: "IBAN", bic: "BIC", concept: "Назначение", conceptValue: "Donativo",
    qr: "Отсканируйте в приложении банка",
    card: "Безопасная оплата картой, Apple Pay или Google Pay из любой страны.", cardCta: "Пожертвовать картой",
    linkQr: "Отсканируйте телефоном, чтобы оплатить", paypal: "Пожертвуйте со своего счёта PayPal или картой через PayPal.", paypalCta: "Пожертвовать через PayPal", otherText: "Пожертвуйте через эту платформу пожертвований.", otherCta: "Перейти на платформу", pageQr: "Вы за компьютером? Отсканируйте код и пожертвуйте с телефона.",
    soon: "Мы подключаем этот способ. Пока напишите нам — подскажем, как сделать пожертвование.", soonCta: "Написать в WhatsApp",
    copy: "Копировать", copied: "Скопировано",
    teaming: "1 € в месяц через Teaming", teamingText: "Микропожертвования по 1 € в месяц. Немного для вас — много вместе.",
    ways: "Другие способы помочь",
    wayItems: [["Вещи и продукты", "Одежда, продукты, школьные принадлежности, техника.", "/contacto?tipo=donar"], ["Стать членом фонда", "Регулярный взнос, который даёт нам стабильность.", "/contacto?tipo=donar"], ["Компании и организации", "Спонсорство, корпоративное волонтёрство, совместные проекты.", "/contacto?tipo=organizacion"], ["Волонтёрство", "Ваше время и навыки тоже помогают.", "/contacto?tipo=voluntariado"]],
    formTitle: "Передать вещи или стать членом фонда", formIntro: "Расскажите, чем хотите помочь, и мы свяжемся с вами, чтобы всё организовать.",
    trust: "INICIA Foundation · Некоммерческая ассоциация · NIF G05426242 · Реестр ассоциаций Астурии № 13148",
  },
  uk: { membersEyebrow: "Стати членом фонду", membersTitle: "Постійна підтримка щомісяця.", membersIntro: "Членські внески дають програмам стабільність. Внесок списується автоматично з банківського рахунку — не треба пам’ятати про перекази.", membersCta: "Стати членом фонду", membersNote: "Після заявки ми зв’яжемося з вами, щоб підписати доручення на автосписання SEPA. Відмовитися можна будь-коли.", 
    eyebrow: "Підтримати", title: "Ваша підтримка перетворюється на", accent: "реальну допомогу.", intro: "Кожен внесок допомагає INICIA супроводжувати родини, проводити навчання та розвивати місцеві проєкти.",
    stats: [["317", "українських родин отримали підтримку"], ["129", "родин іншого походження та місцевих мешканців"], ["2021", "працюємо з"]],
    amountLabel: "Оберіть суму", other: "Інша", amountNote: "Вкажіть цю суму в Bizum або в переказі.",
    methods: { bizum: "Bizum", transfer: "Переказ", card: "Картка", paypal: "PayPal", other: "Інше" },
    bizumSteps: ["Відкрийте застосунок свого банку та розділ Bizum.", "Оберіть «Donar a una ONG» (пожертва НГО).", "Введіть наш код і суму."],
    bizumCode: "Код Bizum для НГО",
    transferSteps: ["Скопіюйте IBAN та отримувача.", "Зробіть переказ зі свого банку.", "У призначенні платежу напишіть «Donativo» і, за бажанням, назву проєкту."],
    holder: "Отримувач", iban: "IBAN", bic: "BIC", concept: "Призначення", conceptValue: "Donativo",
    qr: "Відскануйте в застосунку банку",
    card: "Безпечна оплата карткою, Apple Pay або Google Pay з будь-якої країни.", cardCta: "Пожертвувати карткою",
    linkQr: "Відскануйте телефоном, щоб оплатити", paypal: "Пожертвуйте зі свого рахунку PayPal або карткою через PayPal.", paypalCta: "Пожертвувати через PayPal", otherText: "Пожертвуйте через цю платформу пожертв.", otherCta: "Перейти на платформу", pageQr: "Ви за комп’ютером? Відскануйте код і пожертвуйте з телефона.",
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

function CopyRow({ label, value, copyLabel, copiedLabel, onCopy }: { label: string; value: string; copyLabel: string; copiedLabel: string; onCopy?: () => void }) {
  const [done, setDone] = useState(false);
  const copyValue = async () => {
    try { await navigator.clipboard.writeText(value.replace(/\s/g, label === "IBAN" ? "" : " ")); }
    catch { const area = document.createElement("textarea"); area.value = value; document.body.appendChild(area); area.select(); document.execCommand("copy"); area.remove(); }
    onCopy?.(); setDone(true); setTimeout(() => setDone(false), 1800);
  };
  return <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#D6B25E]/20 bg-[#060A12] px-4 py-3"><div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#D6B25E]">{label}</p><p className="mt-0.5 break-all font-mono text-base font-semibold text-[#EEE7D7]">{value}</p></div><button type="button" onClick={copyValue} className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-[#D6B25E] px-4 text-xs font-bold text-[#120D05]">{done ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{done ? copiedLabel : copyLabel}</button></div>;
}

function Soon({ text, cta }: { text: string; cta: string }) {
  return <div className="rounded-2xl border border-dashed border-[#D6B25E] bg-[#D6B25E]/10 p-5"><p className="leading-7 text-slate-200">{text}</p><a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#D6B25E] px-5 text-sm font-bold text-[#120D05]">{cta}</a></div>;
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
  return src ? <img src={src} alt="QR" width={180} height={180} className="rounded-xl border border-[#D6B25E]/20" /> : null;
}

function LinkQr({ value, label }: { value: string; label: string }) {
  const [src, setSrc] = useState<string>();
  useEffect(() => {
    let cancelled = false;
    import("qrcode").then(({ toDataURL }) => toDataURL(value, { margin: 1, width: 220, color: { dark: "#0B1E3A", light: "#FFFFFF" } })).then(url => { if (!cancelled) setSrc(url); }).catch(() => undefined);
    return () => { cancelled = true; };
  }, [value]);
  return src ? <div className="flex items-center gap-4"><img src={src} alt="QR" width={150} height={150} className="rounded-xl border border-[#D6B25E]/20" /><p className="text-sm text-slate-300">{label}</p></div> : null;
}

function LinkMethod({ text, cta, href, qr, method }: { text: string; cta: string; href: string; qr: string; method: string }) {
  return <div className="space-y-5"><p className="leading-7 text-slate-200">{text}</p><a href={href} target="_blank" rel="noreferrer" onClick={() => track("donate_intent", { method })} className="inline-flex min-h-12 items-center rounded-full bg-[#D6B25E] px-6 text-sm font-bold text-[#120D05]">{cta}<ArrowRight className="ml-2 h-4 w-4" /></a><div className="hidden sm:block"><LinkQr value={href} label={qr} /></div></div>;
}

export default function Donate() {
  const t = useT(copy);
  const [amount, setAmount] = useState<number | undefined>(25);
  const [custom, setCustom] = useState("");
  const settings = useSettings();
  const [locale] = useLocale();
  const plans = requestCopy[locale].donar.plans;
  const available: Record<Method, boolean> = { bizum: Boolean(settings.bizumCode), transfer: Boolean(DONATION.iban), card: Boolean(settings.cardLink), paypal: Boolean(settings.paypalLink), other: Boolean(settings.otherLink) };
  const methods = (["bizum", "transfer", "card", "paypal", "other"] as Method[]).filter(key => available[key]);
  const [chosen, setMethod] = useState<Method>();
  const method = chosen && available[chosen] ? chosen : methods[0];
  const finalAmount = custom ? Number(custom) || undefined : amount;

  return <main className="min-h-screen bg-[#060A12] text-[#EEE7D7]">
    <OriginalSiteNavigation dark />
    <section className="relative isolate overflow-hidden bg-[#060A12] bg-[#08101E] px-5 pb-36 pt-16 text-white"><img src="/assets/photos/seedling-1920.webp" srcSet="/assets/photos/seedling-960.webp 960w, /assets/photos/seedling-1920.webp 1920w" sizes="100vw" alt="" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#060A12] via-[#060A12]/80 to-[#060A12]/25" /><div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#060A12] to-transparent" />
      <SpiralMark className="pointer-events-none absolute -right-20 top-0 -z-10 hidden h-[460px] w-[460px] opacity-40 md:block" />
      <div className="relative mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#D6B25E]">{t.eyebrow}</p><h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.02] md:text-6xl">{t.title} <span className="italic text-[#F0D893]">{t.accent}</span></h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">{t.intro}</p>
        <dl className="mt-10 grid max-w-3xl grid-cols-3 gap-4 border-t border-[#D6B25E]/30 pt-6">{t.stats.map(([value, label]) => <div key={label}><dt className="sr-only">{label}</dt><dd className="font-serif text-4xl text-[#F0D893] md:text-5xl">{value}</dd><p className="mt-1 text-xs leading-5 text-slate-300 md:text-sm">{label}</p></div>)}</dl>
      </div>
    </section>

    <section className="relative z-10 mx-auto -mt-24 max-w-6xl px-5">
      <div className="grid gap-8 rounded-3xl bg-[#0C1320] p-6 shadow-xl ring-1 ring-[#D6B25E]/20 sm:p-9 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold text-[#EEE7D7]">{t.amountLabel}</p>
          <div className="mt-4 grid grid-cols-4 gap-2">{[10, 25, 50].map(value => <button key={value} type="button" aria-pressed={!custom && amount === value} onClick={() => { setAmount(value); setCustom(""); }} className={`min-h-14 rounded-2xl border text-lg font-bold transition ${!custom && amount === value ? "border-[#D6B25E] bg-[#D6B25E] text-[#120D05]" : "border-[#D6B25E]/20 hover:border-[#D6B25E]"}`}>{value} €</button>)}
            <input aria-label={t.other} placeholder={t.other} inputMode="numeric" value={custom} onChange={e => setCustom(e.target.value.replace(/[^0-9]/g, ""))} className={`min-h-14 rounded-2xl border px-3 text-center text-lg font-bold outline-none focus:border-[#D6B25E] bg-transparent ${custom ? "border-[#D6B25E]" : "border-[#D6B25E]/20"}`} /></div>
          <p className="mt-3 text-sm text-slate-400">{t.amountNote}</p>
          <div className="mt-8 hidden border-t border-[#D6B25E]/20 pt-6 lg:block"><LinkQr value="https://iniciafoundation.org/donar" label={t.pageQr} /></div>
          {settings.teamingLink && <a href={settings.teamingLink} onClick={() => track("donate_intent", { method: "teaming" })} target="_blank" rel="noreferrer" className="mt-6 block rounded-2xl bg-[#060A12] p-5 transition hover:ring-2 hover:ring-[#D6B25E]"><p className="font-serif text-2xl">{t.teaming}</p><p className="mt-1 text-sm text-slate-300">{t.teamingText}</p></a>}
        </div>
        <div>
          <div role="tablist" className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(methods.length, 3)}, minmax(0, 1fr))` }}>{methods.map(key => { const Icon = key === "bizum" ? Smartphone : key === "transfer" ? Landmark : key === "card" ? CreditCard : key === "paypal" ? Wallet : Globe; return <button key={key} role="tab" type="button" aria-selected={method === key} onClick={() => setMethod(key)} className={`flex min-h-12 items-center justify-center gap-2 rounded-full text-sm font-bold transition ${method === key ? "bg-[#D6B25E] text-[#120D05]" : "bg-[#060A12] text-[#EEE7D7] hover:bg-[#1A2436]"}`}><Icon className="h-4 w-4" />{key === "other" && settings.otherName ? settings.otherName : t.methods[key]}</button>; })}</div>
          <div className="mt-6 space-y-4" role="tabpanel">
            {method === "bizum" && <>{settings.bizumCode ? <><ol className="space-y-2">{t.bizumSteps.map((line, index) => <li key={line} className="flex gap-3 text-sm leading-6"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D6B25E] text-xs font-bold text-[#120D05]">{index + 1}</span>{line}</li>)}</ol><CopyRow label={t.bizumCode} value={settings.bizumCode} copyLabel={t.copy} copiedLabel={t.copied} />{finalAmount && <p className="text-sm text-slate-300">{finalAmount} €</p>}</> : <Soon text={t.soon} cta={t.soonCta} />}</>}
            {method === "transfer" && <>{DONATION.iban ? <><ol className="space-y-2">{t.transferSteps.map((line, index) => <li key={line} className="flex gap-3 text-sm leading-6"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D6B25E] text-xs font-bold text-[#120D05]">{index + 1}</span>{line}</li>)}</ol><CopyRow label={t.iban} value={DONATION.iban} copyLabel={t.copy} copiedLabel={t.copied} onCopy={() => track("donate_intent", { method: "transfer" })} /><CopyRow label={t.holder} value={DONATION.holder} copyLabel={t.copy} copiedLabel={t.copied} />{DONATION.bank && <p className="px-1 text-sm text-slate-300">{DONATION.bank}</p>}<CopyRow label={t.concept} value={t.conceptValue} copyLabel={t.copy} copiedLabel={t.copied} /><div className="hidden items-center gap-4 sm:flex"><TransferQr amount={finalAmount} reference={t.conceptValue} /><p className="text-sm text-slate-300">{t.qr}</p></div></> : <Soon text={t.soon} cta={t.soonCta} />}</>}
            {method === "card" && <LinkMethod text={t.card} cta={t.cardCta} href={settings.cardLink} qr={t.linkQr} method="card" />}
            {method === "paypal" && <LinkMethod text={t.paypal} cta={t.paypalCta} href={settings.paypalLink} qr={t.linkQr} method="paypal" />}
            {method === "other" && <LinkMethod text={t.otherText} cta={settings.otherName || t.otherCta} href={settings.otherLink} qr={t.linkQr} method="other" />}
          </div>
        </div>
      </div>
      <p className="mt-5 text-center text-xs leading-5 text-slate-400">{t.trust}</p>
    </section>

    <section id="socios" className="mx-auto max-w-6xl scroll-mt-28 px-5 pt-20"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#D6B25E]">{t.membersEyebrow}</p><h2 className="mt-3 font-serif text-4xl md:text-5xl">{t.membersTitle}</h2><p className="mt-4 max-w-2xl leading-7 text-slate-300">{t.membersIntro}</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">{plans.map(plan => <article key={plan.key} className="flex flex-col rounded-3xl border border-[#D6B25E]/25 bg-gradient-to-br from-[#0E1729] to-[#090F1B] p-8"><h3 className="font-serif text-3xl">{plan.title}</h3><p className="mt-2 font-serif text-4xl text-[#F0D893]">{plan.price}</p><p className="mt-4 flex-1 leading-7 text-slate-300">{plan.text}</p><Link href={`/contacto?tipo=donar&plan=${plan.key}`} className="mt-6 inline-flex min-h-12 w-fit items-center rounded-full bg-[#D6B25E] px-6 text-sm font-bold text-[#120D05]">{t.membersCta}<ArrowRight className="ml-2 h-4 w-4" /></Link></article>)}</div>
      <p className="mt-4 text-xs leading-5 text-slate-400">{t.membersNote}</p>
    </section>

    <section className="mx-auto max-w-6xl px-5 py-20"><h2 className="font-serif text-4xl md:text-5xl">{t.ways}</h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{t.wayItems.map(([title, text, href], index) => { const Icon = WAY_ICONS[index]; return <Link key={title} href={href} className="group rounded-3xl bg-[#0C1320] p-6 shadow-sm ring-1 ring-[#D6B25E]/20 transition hover:-translate-y-0.5 hover:ring-[#D6B25E]"><Icon className="h-7 w-7 text-[#D6B25E]" /><h3 className="mt-4 font-serif text-2xl">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{text}</p><ArrowRight className="mt-4 h-4 w-4 text-[#D6B25E] transition group-hover:translate-x-1" /></Link>; })}</div>
    </section>

    <section id="material" className="bg-[#0A1424] px-5 py-20"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.7fr_1.3fr]"><div className="text-white"><h2 className="font-serif text-4xl md:text-5xl">{t.formTitle}</h2><p className="mt-4 leading-7 text-slate-200">{t.formIntro}</p></div><RequestForm initialType="donar" compact /></div></section>
  </main>;
}
