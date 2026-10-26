import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, HandHeart, HeartHandshake, LifeBuoy, Loader2, MessageCircle, Send } from "lucide-react";
import { useLocale } from "@/lib/i18n";
import { requestCopy } from "@/lib/requestCopy";
import { type RequestType, makeReference, sendRequest } from "@/lib/requests";
import { CONTACT } from "@/lib/siteConfig";
import { track } from "@/lib/analytics";

type Values = Record<string, string | string[] | boolean>;

const ICONS: Record<RequestType, typeof LifeBuoy> = { ayuda: LifeBuoy, voluntariado: HandHeart, organizacion: Building2, donar: HeartHandshake, otro: MessageCircle };
const MAIN_TYPES: RequestType[] = ["ayuda", "voluntariado", "organizacion", "donar"];

const fieldClass = "mt-2 w-full rounded-xl border border-[#0B1E3A]/15 bg-white px-4 py-3 text-base text-[#0B1E3A] outline-none transition focus:border-[#D6B25E] focus:ring-2 focus:ring-[#D6B25E]/40";

function Field({ label, children, required }: { label: string; children: ReactNode; required?: boolean }) {
  return <label className="block text-sm font-semibold text-[#0B1E3A]">{label}{required && <span className="text-[#7E5F1E]"> *</span>}{children}</label>;
}

function Chips({ label, options, value, onChange, multiple = false, required }: { label: string; options: [string, string][]; value: string | string[] | undefined; onChange: (next: string | string[]) => void; multiple?: boolean; required?: boolean }) {
  const selected = (key: string) => (multiple ? Array.isArray(value) && value.includes(key) : value === key);
  const toggle = (key: string) => {
    if (!multiple) return onChange(key);
    const list = Array.isArray(value) ? value : [];
    onChange(list.includes(key) ? list.filter(item => item !== key) : [...list, key]);
  };
  return <fieldset><legend className="text-sm font-semibold text-[#0B1E3A]">{label}{required && <span className="text-[#7E5F1E]"> *</span>}</legend>
    <div className="mt-3 flex flex-wrap gap-2">{options.map(([key, text]) => <button key={key} type="button" aria-pressed={selected(key)} onClick={() => toggle(key)} className={`min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition ${selected(key) ? "border-[#0B1E3A] bg-[#0B1E3A] text-[#F0D893]" : "border-[#0B1E3A]/15 bg-white text-[#0B1E3A] hover:border-[#D6B25E]"}`}>{text}</button>)}</div>
  </fieldset>;
}

export function RequestForm({ initialType, project, compact = false }: { initialType?: RequestType; project?: string; compact?: boolean }) {
  const [locale] = useLocale();
  const t = requestCopy[locale];
  const [type, setType] = useState<RequestType | undefined>(initialType);
  const [step, setStep] = useState(initialType ? 2 : 1);
  const [values, setValues] = useState<Values>({ canal: "whatsapp" });
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [showRequired, setShowRequired] = useState(false);
  const [reference, setReference] = useState<string>();
  const formRef = useRef<HTMLFormElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const top = formRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step, reference]);

  const v = (key: string) => values[key];
  const s = (key: string) => (typeof values[key] === "string" ? (values[key] as string) : "");
  const set = (key: string) => (next: string | string[] | boolean) => setValues(current => ({ ...current, [key]: next }));
  const has = (key: string) => { const value = values[key]; return Array.isArray(value) ? value.length > 0 : typeof value === "string" ? value.trim().length > 0 : value === true; };

  const step2Valid = useMemo(() => {
    switch (type) {
      case "ayuda": return has("necesidad") && has("mensaje");
      case "voluntariado": return has("areas") && has("disponibilidad");
      case "organizacion": return has("entidad") && has("tipo_entidad") && has("mensaje");
      case "donar": return v("modo") === "especie" ? has("que_dona") && has("descripcion") : v("modo") === "socio" ? has("cuota") && has("periodicidad") : false;
      case "otro": return has("tema") && has("mensaje");
      default: return false;
    }
  }, [type, values]); // eslint-disable-line react-hooks/exhaustive-deps
  const step3Valid = s("nombre").trim().length >= 2 && /\S+@\S+\.\S+/.test(s("email")) && v("consentimiento") === true;

  const choose = (next: RequestType) => { setType(next); setStep(2); setShowRequired(false); };
  const goNext = () => { if (!step2Valid) return setShowRequired(true); setShowRequired(false); setStep(3); };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!step3Valid || !type) return setShowRequired(true);
    if (s("website")) return; // honeypot
    const ref = makeReference();
    setState("sending");
    try {
      await sendRequest({ referencia: ref, tipo: type, proyecto: project, idioma: locale, pagina: typeof window !== "undefined" ? window.location.pathname : "", ...Object.fromEntries(Object.entries(values).filter(([key]) => key !== "website")) });
      track("generate_lead", { tipo: type });
      setReference(ref);
      setState("idle");
    } catch {
      setState("error");
    }
  };

  const reset = () => { setValues({ canal: "whatsapp" }); setReference(undefined); setType(initialType); setStep(initialType ? 2 : 1); setShowRequired(false); };

  if (reference) return <div className="scroll-mt-28 rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-[#0B1E3A]/10">
    <CheckCircle2 className="mx-auto h-14 w-14 text-[#7E5F1E]" />
    <h2 className="mt-4 font-serif text-4xl text-[#0B1E3A]">{t.done.title}</h2>
    <p className="mt-4 text-sm text-slate-600">{t.done.reference}</p>
    <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-[#0B1E3A]">{reference}</p>
    <p className="mx-auto mt-4 max-w-md leading-7 text-slate-600">{t.done.next}</p>
    <div className="mt-7 flex flex-wrap justify-center gap-3"><button type="button" onClick={reset} className="min-h-11 rounded-full border border-[#0B1E3A]/20 px-5 py-2 text-sm font-bold text-[#0B1E3A]">{t.done.again}</button><Link href="/" className="inline-flex min-h-11 items-center rounded-full bg-[#0B1E3A] px-5 py-2 text-sm font-bold text-[#F0D893]">{t.done.home}</Link></div>
  </div>;

  return <form ref={formRef} onSubmit={submit} noValidate className={`scroll-mt-28 rounded-3xl bg-white shadow-sm ring-1 ring-[#0B1E3A]/10 ${compact ? "p-6" : "p-6 sm:p-9"}`}>
    <ol className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em]" aria-label="progress">
      {t.steps.map((label, index) => <li key={label} className={`flex items-center gap-2 ${step === index + 1 ? "text-[#0B1E3A]" : "text-slate-400"}`}><span className={`flex h-7 w-7 items-center justify-center rounded-full ${step > index ? "bg-[#D6B25E] text-[#0B1E3A]" : "border border-current"}`}>{index + 1}</span><span className="hidden sm:inline">{label}</span>{index < 2 && <span className="mx-1 h-px w-6 bg-slate-300" aria-hidden />}</li>)}
    </ol>

    {project && <p className="mt-5 inline-flex rounded-full bg-[#F7F3EA] px-3 py-1 text-xs font-bold text-[#7E5F1E]">{t.projectChip}: {project}</p>}

    {step === 1 && <div className="mt-7">
      <h2 className="font-serif text-4xl text-[#0B1E3A]">{t.question}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">{MAIN_TYPES.map(key => { const Icon = ICONS[key]; return <button key={key} type="button" onClick={() => choose(key)} className="group flex min-h-36 flex-col items-start rounded-2xl border border-[#0B1E3A]/10 bg-[#F7F3EA] p-6 text-left transition hover:-translate-y-0.5 hover:border-[#D6B25E] hover:bg-[#0B1E3A] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-[#D6B25E]"><Icon className="h-8 w-8 text-[#7E5F1E] group-hover:text-[#D6B25E]" /><span className="mt-4 font-serif text-2xl text-[#0B1E3A] group-hover:text-[#F0D893]">{t.types[key].title}</span><span className="mt-1 text-sm leading-6 text-slate-600 group-hover:text-slate-200">{t.types[key].text}</span></button>; })}</div>
      <button type="button" onClick={() => choose("otro")} className="mt-5 text-sm font-bold text-[#0B1E3A] underline decoration-[#D6B25E] decoration-2 underline-offset-4">{t.otherLink}</button>
    </div>}

    {step === 2 && type && <div className="mt-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-serif text-3xl text-[#0B1E3A]">{t.types[type].title}</h2>{!initialType && <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-[#7E5F1E] underline underline-offset-4">{t.change}</button>}</div>

      {type === "ayuda" && <>
        <Chips label={t.ayuda.needLabel} options={t.ayuda.needs} value={v("necesidad") as string} onChange={set("necesidad")} required />
        <div className="grid gap-5 sm:grid-cols-2"><Field label={t.ayuda.people}><input type="number" min={1} max={20} inputMode="numeric" className={fieldClass} value={s("personas")} onChange={e => set("personas")(e.target.value)} /></Field>
          <label className="flex min-h-11 items-center gap-3 self-end text-sm font-semibold"><input type="checkbox" className="h-5 w-5 accent-[#0B1E3A]" checked={v("urgente") === true} onChange={e => set("urgente")(e.target.checked)} />{t.ayuda.urgent}</label></div>
        {v("urgente") === true && <p className="rounded-xl bg-[#FFF4E0] p-4 text-sm leading-6 text-[#6E531C]">{t.ayuda.urgentNote} <a className="font-bold underline" href={CONTACT.phoneHref}>{CONTACT.phone}</a> · <a className="font-bold underline" href={CONTACT.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></p>}
        <Field label={t.ayuda.message} required><textarea className={`${fieldClass} min-h-32`} value={s("mensaje")} onChange={e => set("mensaje")(e.target.value)} /><span className="mt-1 block text-xs font-normal text-slate-500">{t.ayuda.messageHint}</span></Field>
      </>}

      {type === "voluntariado" && <>
        <Chips label={t.voluntariado.areasLabel} options={t.voluntariado.areas} value={v("areas") as string[]} onChange={set("areas")} multiple required />
        <Chips label={t.voluntariado.whenLabel} options={t.voluntariado.when} value={v("disponibilidad") as string[]} onChange={set("disponibilidad")} multiple required />
        <Chips label={t.voluntariado.modeLabel} options={t.voluntariado.modes} value={v("modalidad") as string} onChange={set("modalidad")} />
        <Field label={t.voluntariado.languages}><input className={fieldClass} value={s("idiomas_habla")} onChange={e => set("idiomas_habla")(e.target.value)} /></Field>
        <label className="flex min-h-11 items-center gap-3 text-sm font-semibold"><input type="checkbox" className="h-5 w-5 accent-[#0B1E3A]" checked={v("mayor_18") !== false} onChange={e => set("mayor_18")(e.target.checked)} />{t.voluntariado.adult}</label>
        {v("mayor_18") === false && <p className="rounded-xl bg-[#F7F3EA] p-4 text-sm leading-6 text-slate-700">{t.voluntariado.minorNote}</p>}
        <Field label={t.voluntariado.message}><textarea className={`${fieldClass} min-h-24`} value={s("mensaje")} onChange={e => set("mensaje")(e.target.value)} /></Field>
      </>}

      {type === "organizacion" && <>
        <div className="grid gap-5 sm:grid-cols-2"><Field label={t.organizacion.entity} required><input className={fieldClass} value={s("entidad")} onChange={e => set("entidad")(e.target.value)} /></Field><Field label={t.organizacion.web}><input type="url" inputMode="url" className={fieldClass} value={s("web")} onChange={e => set("web")(e.target.value)} /></Field></div>
        <Chips label={t.organizacion.entityType} options={t.organizacion.entityTypes} value={v("tipo_entidad") as string} onChange={set("tipo_entidad")} required />
        <Chips label={t.organizacion.offerLabel} options={t.organizacion.offers} value={v("colaboracion") as string[]} onChange={set("colaboracion")} multiple />
        <Field label={t.organizacion.role}><input className={fieldClass} value={s("cargo")} onChange={e => set("cargo")(e.target.value)} /></Field>
        <Field label={t.organizacion.message} required><textarea className={`${fieldClass} min-h-32`} value={s("mensaje")} onChange={e => set("mensaje")(e.target.value)} /></Field>
      </>}

      {type === "donar" && <>
        <Chips label={t.donar.modeLabel} options={t.donar.modes} value={v("modo") as string} onChange={set("modo")} required />
        {v("modo") === "dinero" && <div className="rounded-2xl bg-[#0B1E3A] p-6 text-white"><p className="leading-7">{t.donar.moneyText}</p><Link href="/donar" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#D6B25E] px-5 py-2 text-sm font-bold text-[#0B1E3A]">{t.donar.moneyCta}<ArrowRight className="ml-2 h-4 w-4" /></Link></div>}
        {v("modo") === "especie" && <>
          <Chips label={t.donar.goodsLabel} options={t.donar.goods} value={v("que_dona") as string[]} onChange={set("que_dona")} multiple required />
          <Field label={t.donar.goodsDesc} required><textarea className={`${fieldClass} min-h-24`} value={s("descripcion")} onChange={e => set("descripcion")(e.target.value)} /></Field>
          <Chips label={t.donar.deliveryLabel} options={t.donar.delivery} value={v("entrega") as string} onChange={set("entrega")} />
        </>}
        {v("modo") === "socio" && <>
          <Chips label={t.donar.feeLabel} options={t.donar.fees} value={v("cuota") as string} onChange={set("cuota")} required />
          {v("cuota") === "otra" && <Field label={t.donar.fees[3][1]}><input type="number" min={1} inputMode="numeric" className={fieldClass} value={s("cuota_otra")} onChange={e => set("cuota_otra")(e.target.value)} /></Field>}
          <Chips label={t.donar.periodLabel} options={t.donar.periods} value={v("periodicidad") as string} onChange={set("periodicidad")} required />
          <p className="rounded-xl bg-[#F7F3EA] p-4 text-sm leading-6 text-slate-700">{t.donar.socioNote}</p>
        </>}
      </>}

      {type === "otro" && <>
        <Chips label={t.otro.topicLabel} options={t.otro.topics} value={v("tema") as string} onChange={set("tema")} required />
        <Field label={t.otro.message} required><textarea className={`${fieldClass} min-h-32`} value={s("mensaje")} onChange={e => set("mensaje")(e.target.value)} /></Field>
      </>}

      {showRequired && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{t.required}</p>}
      {!(type === "donar" && v("modo") === "dinero") && <div className="flex flex-wrap justify-between gap-3">{!initialType ? <button type="button" onClick={() => setStep(1)} className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold text-[#0B1E3A]"><ArrowLeft className="mr-1 h-4 w-4" />{t.back}</button> : <span />}<button type="button" onClick={goNext} className="inline-flex min-h-12 items-center rounded-full bg-[#0B1E3A] px-6 text-sm font-bold text-[#F0D893]">{t.next}<ArrowRight className="ml-2 h-4 w-4" /></button></div>}
    </div>}

    {step === 3 && <div className="mt-7 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.contact.name} required><input autoComplete="name" className={fieldClass} value={s("nombre")} onChange={e => set("nombre")(e.target.value)} /></Field>
        <Field label={t.contact.email} required><input type="email" autoComplete="email" inputMode="email" className={fieldClass} value={s("email")} onChange={e => set("email")(e.target.value)} /></Field>
        <Field label={t.contact.phone}><input type="tel" autoComplete="tel" inputMode="tel" className={fieldClass} value={s("telefono")} onChange={e => set("telefono")(e.target.value)} /></Field>
        <Field label={t.contact.city}><input autoComplete="address-level2" className={fieldClass} value={s("ciudad")} onChange={e => set("ciudad")(e.target.value)} /></Field>
      </div>
      <Chips label={t.contact.channelLabel} options={t.contact.channels} value={v("canal") as string} onChange={set("canal")} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={s("website")} onChange={e => set("website")(e.target.value)} />
      <p className="text-xs leading-5 text-slate-500">{t.contact.sensitive}</p>
      <label className="flex items-start gap-3 text-sm leading-6 text-slate-700"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#0B1E3A]" checked={v("consentimiento") === true} onChange={e => set("consentimiento")(e.target.checked)} /><span>{t.contact.consent} <Link className="underline" href="/identidad">{t.contact.privacyLink}</Link></span></label>
      {showRequired && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{t.required}</p>}
      {state === "error" && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{t.error} <a className="font-bold underline" href={CONTACT.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></p>}
      <div className="flex flex-wrap justify-between gap-3"><button type="button" onClick={() => setStep(2)} className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold text-[#0B1E3A]"><ArrowLeft className="mr-1 h-4 w-4" />{t.back}</button><button type="submit" disabled={state === "sending"} className="inline-flex min-h-12 items-center rounded-full bg-[#D6B25E] px-7 text-sm font-bold text-[#0B1E3A] shadow-[0_8px_22px_rgba(214,178,94,.35)] disabled:opacity-60">{state === "sending" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.sending}</> : <><Send className="mr-2 h-4 w-4" />{t.send}</>}</button></div>
    </div>}
  </form>;
}
