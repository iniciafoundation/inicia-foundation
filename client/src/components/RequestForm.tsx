import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { AlertCircle, ArrowLeft, ArrowRight, Building2, CheckCircle2, HandHeart, HeartHandshake, LifeBuoy, Loader2, MessageCircle, Send } from "lucide-react";
import { useLocale } from "@/lib/i18n";
import { requestCopy } from "@/lib/requestCopy";
import { type RequestType, flatten, makeReference, sendRequest } from "@/lib/requests";
import { CONTACT, MEMBERSHIP, ZONES } from "@/lib/siteConfig";
import { track } from "@/lib/analytics";

type Values = Record<string, string | string[] | boolean>;

const ICONS: Record<RequestType, typeof LifeBuoy> = { ayuda: LifeBuoy, voluntariado: HandHeart, organizacion: Building2, donar: HeartHandshake, otro: MessageCircle };
const MAIN_TYPES: RequestType[] = ["ayuda", "voluntariado", "organizacion", "donar"];

const fieldClass = "mt-2 w-full rounded-xl border border-[#D6B25E]/20 bg-[#0C1320] px-4 py-3 text-base text-[#EEE7D7] outline-none transition focus:border-[#D6B25E] focus:ring-2 focus:ring-[#D6B25E]/40";

function ErrorText({ text }: { text?: string }) {
  return text ? <span role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-300"><AlertCircle className="h-3.5 w-3.5 shrink-0" />{text}</span> : null;
}

function Summary({ title, items }: { title: string; items: string[] }) {
  return <div role="alert" className="rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200"><p className="flex items-center gap-2 font-semibold"><AlertCircle className="h-4 w-4" />{title}</p>{items.length > 0 && <ul className="mt-2 list-disc space-y-0.5 pl-6">{items.map(item => <li key={item}>{item}</li>)}</ul>}</div>;
}

function Field({ label, children, required, error }: { label: string; children: ReactNode; required?: boolean; error?: string }) {
  return <label data-error={error ? "true" : undefined} className={`block scroll-mt-32 text-sm font-semibold text-[#EEE7D7] ${error ? "[&_input]:border-red-400 [&_input]:ring-2 [&_input]:ring-red-400/30 [&_input:focus]:border-red-400 [&_input:focus]:ring-red-400/40 [&_textarea]:border-red-400 [&_textarea]:ring-2 [&_textarea]:ring-red-400/30 [&_textarea:focus]:border-red-400 [&_textarea:focus]:ring-red-400/40" : ""}`}>{label}{required && <span className="text-[#D6B25E]"> *</span>}{children}<ErrorText text={error} /></label>;
}

function Chips({ label, options, value, onChange, multiple = false, required, error }: { label: string; options: [string, string][]; value: string | string[] | undefined; onChange: (next: string | string[]) => void; multiple?: boolean; required?: boolean; error?: string }) {
  const selected = (key: string) => (multiple ? Array.isArray(value) && value.includes(key) : value === key);
  const toggle = (key: string) => {
    if (!multiple) return onChange(key);
    const list = Array.isArray(value) ? value : [];
    onChange(list.includes(key) ? list.filter(item => item !== key) : [...list, key]);
  };
  return <fieldset data-error={error ? "true" : undefined} className="scroll-mt-32"><legend className="text-sm font-semibold text-[#EEE7D7]">{label}{required && <span className="text-[#D6B25E]"> *</span>}</legend>
    <div className={`mt-3 flex flex-wrap gap-2 ${error ? "rounded-2xl p-2 ring-2 ring-red-400/60" : ""}`}>{options.map(([key, text]) => <button key={key} type="button" aria-pressed={selected(key)} onClick={() => toggle(key)} className={`min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition ${selected(key) ? "border-[#D6B25E] bg-[#D6B25E] text-[#120D05]" : "border-[#D6B25E]/20 bg-[#0C1320] text-[#EEE7D7] hover:border-[#D6B25E]"}`}>{text}</button>)}</div>
    <ErrorText text={error} />
  </fieldset>;
}

export function RequestForm({ initialType, project, compact = false }: { initialType?: RequestType; project?: string; compact?: boolean }) {
  const [locale] = useLocale();
  const t = requestCopy[locale];
  const [type, setType] = useState<RequestType | undefined>(initialType);
  const [step, setStep] = useState(initialType ? 2 : 1);
  const [values, setValues] = useState<Values>(() => {
    // Deep links such as /contacto?tipo=donar&modo=socio&plan=colaborador preselect options.
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const start: Values = { canal: "whatsapp" };
    const modo = params.get("modo"); if (modo && ["dinero", "especie", "socio"].includes(modo)) start.modo = modo;
    const plan = params.get("plan"); if (plan && ["pleno", "colaborador", "reducida", "empresa"].includes(plan)) { start.modo = "socio"; start.plan = plan; }
    const zona = params.get("zona"); if (zona && (ZONES as readonly string[]).includes(zona)) start.zona = zona;
    return start;
  });
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [failedMail, setFailedMail] = useState("");
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

  type ErrKind = Exclude<keyof typeof t.errors, "summary" | "consentLabel">;
  const errors2 = useMemo(() => {
    const e: Record<string, ErrKind> = {};
    const need = (key: string, kind: ErrKind = "required") => { if (!has(key)) e[key] = kind; };
    switch (type) {
      case "ayuda": need("necesidad", "choose"); need("mensaje"); break;
      case "voluntariado": need("areas", "choose"); need("disponibilidad", "choose"); break;
      case "organizacion": need("entidad"); need("tipo_entidad", "choose"); need("mensaje"); break;
      case "donar":
        if (v("modo") === "especie") { need("que_dona", "choose"); need("descripcion"); }
        else if (v("modo") === "socio") {
          need("plan", "choose");
          if (v("plan") === "colaborador") {
            need("cuota", "choose"); need("periodicidad", "choose");
            if (v("cuota") === "otra") { if (!has("cuota_otra")) e.cuota_otra = "required"; else if (Number(s("cuota_otra")) < MEMBERSHIP.minAmount) e.cuota_otra = "minAmount"; }
          }
          if (v("plan") === "empresa") {
            need("entidad"); need("cuota", "choose");
            if (v("cuota") === "otra") { if (!has("cuota_otra")) e.cuota_otra = "required"; else if (Number(s("cuota_otra")) < MEMBERSHIP.companyMin) e.cuota_otra = "companyMin"; }
          }
        }
        else if (v("modo") !== "dinero") need("modo", "choose");
        break;
      case "otro": need("tema", "choose"); need("mensaje"); break;
    }
    return e;
  }, [type, values]); // eslint-disable-line react-hooks/exhaustive-deps
  const errors3 = useMemo(() => {
    const e: Record<string, ErrKind> = {};
    const name = s("nombre").trim();
    if (!name) e.nombre = "required"; else if (name.length < 2) e.nombre = "name";
    const email = s("email").trim();
    if (!email) e.email = "required"; else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = "email";
    if (v("consentimiento") !== true) e.consentimiento = "consent";
    return e;
  }, [values]); // eslint-disable-line react-hooks/exhaustive-deps
  const step2Valid = Object.keys(errors2).length === 0;
  const step3Valid = Object.keys(errors3).length === 0;
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const touch = (key: string) => () => setTouched(current => ({ ...current, [key]: true }));
  /** Error text for a field: shown after a failed "continue/send", or after leaving a field that was filled wrong. */
  const err = (key: string) => {
    const kind = (step === 3 ? errors3 : errors2)[key];
    if (!kind) return undefined;
    if (showRequired || (touched[key] && has(key))) return t.errors[kind];
    return undefined;
  };
  const focusFirstError = () => setTimeout(() => {
    const first = formRef.current?.querySelector<HTMLElement>('[data-error="true"]');
    first?.scrollIntoView({ behavior: "smooth", block: "center" });
    first?.querySelector<HTMLElement>("input, textarea, button")?.focus({ preventScroll: true });
  }, 50);
  const errorLabels = (errs: Record<string, ErrKind>, labels: Record<string, string>) => Object.keys(errs).map(key => labels[key]).filter(Boolean);
  const labels2: Record<string, string> = type ? {
    necesidad: t.ayuda.needLabel, mensaje: type === "ayuda" ? t.ayuda.message : type === "organizacion" ? t.organizacion.message : t.otro.message,
    areas: t.voluntariado.areasLabel, disponibilidad: t.voluntariado.whenLabel, tipo_entidad: t.organizacion.entityType,
    modo: t.donar.modeLabel, que_dona: t.donar.goodsLabel, descripcion: t.donar.goodsDesc, plan: t.donar.planLabel, cuota_otra: v("plan") === "empresa" ? t.donar.companyOther : t.donar.otherAmount, cuota: t.donar.feeLabel, entidad: type === "donar" ? t.donar.companyName : t.organizacion.entity, periodicidad: t.donar.periodLabel, tema: t.otro.topicLabel,
  } : {};
  const labels3: Record<string, string> = { nombre: t.contact.name, email: t.contact.email, consentimiento: t.errors.consentLabel };

  const choose = (next: RequestType) => { setType(next); setStep(2); setShowRequired(false); };
  const goNext = () => { if (!step2Valid) { setShowRequired(true); return focusFirstError(); } setShowRequired(false); setTouched({}); setStep(3); };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!step3Valid || !type) { setShowRequired(true); return focusFirstError(); }
    if (s("website")) return; // honeypot
    const ref = makeReference();
    setState("sending");
    const socio = type === "donar" && v("modo") === "socio";
    const fixedPlan = socio && v("plan") === "pleno" ? { cuota: String(MEMBERSHIP.fullAmount), periodicidad: MEMBERSHIP.fullPeriod, cuota_otra: undefined }
      : socio && v("plan") === "reducida" ? { cuota: String(MEMBERSHIP.reducedAmount), periodicidad: "mensual", cuota_otra: undefined }
      : socio && v("plan") === "empresa" ? { periodicidad: "mensual" } : {};
    const payload = { referencia: ref, tipo: type, proyecto: project, idioma: locale, pagina: typeof window !== "undefined" ? window.location.pathname : "", ...Object.fromEntries(Object.entries(values).filter(([key]) => key !== "website")), ...fixedPlan };
    try {
      await sendRequest(payload);
      track("generate_lead", { tipo: type });
      setReference(ref);
      setState("idle");
    } catch {
      // Last resort: let the person send the same request from their own e-mail app.
      const body = Object.entries(flatten(payload)).map(([key, value]) => `${key}: ${value}`).join("\n");
      setFailedMail(`mailto:${CONTACT.requestsEmail}?subject=${encodeURIComponent(`Solicitud web ${ref} (${type})`)}&body=${encodeURIComponent(body)}`);
      setState("error");
    }
  };

  const reset = () => { setValues({ canal: "whatsapp" }); setReference(undefined); setType(initialType); setStep(initialType ? 2 : 1); setShowRequired(false); setTouched({}); };

  if (reference) return <div className="scroll-mt-28 rounded-3xl bg-[#0C1320] p-8 text-center shadow-sm ring-1 ring-[#D6B25E]/20">
    <CheckCircle2 className="mx-auto h-14 w-14 text-[#D6B25E]" />
    <h2 className="mt-4 font-serif text-4xl text-[#EEE7D7]">{t.done.title}</h2>
    <p className="mt-4 text-sm text-slate-300">{t.done.reference}</p>
    <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-[#EEE7D7]">{reference}</p>
    <p className="mx-auto mt-4 max-w-md leading-7 text-slate-300">{t.done.next}</p>
    <div className="mt-7 flex flex-wrap justify-center gap-3"><button type="button" onClick={reset} className="min-h-11 rounded-full border border-[#D6B25E]/20 px-5 py-2 text-sm font-bold text-[#EEE7D7]">{t.done.again}</button><Link href="/" className="inline-flex min-h-11 items-center rounded-full bg-[#D6B25E] px-5 py-2 text-sm font-bold text-[#120D05]">{t.done.home}</Link></div>
  </div>;

  return <form ref={formRef} onSubmit={submit} noValidate className={`scroll-mt-28 rounded-3xl bg-[#0C1320] shadow-sm ring-1 ring-[#D6B25E]/20 ${compact ? "p-6" : "p-6 sm:p-9"}`}>
    <ol className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em]" aria-label="progress">
      {t.steps.map((label, index) => <li key={label} className={`flex items-center gap-2 ${step === index + 1 ? "text-[#EEE7D7]" : "text-slate-400"}`}><span className={`flex h-7 w-7 items-center justify-center rounded-full ${step > index ? "bg-[#D6B25E] text-[#120D05]" : "border border-current"}`}>{index + 1}</span><span className="hidden sm:inline">{label}</span>{index < 2 && <span className="mx-1 h-px w-6 bg-slate-300" aria-hidden />}</li>)}
    </ol>

    {project && <p className="mt-5 inline-flex rounded-full bg-[#060A12] px-3 py-1 text-xs font-bold text-[#D6B25E]">{t.projectChip}: {project}</p>}

    {step === 1 && <div className="mt-7">
      <h2 className="font-serif text-4xl text-[#EEE7D7]">{t.question}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">{MAIN_TYPES.map(key => { const Icon = ICONS[key]; return <button key={key} type="button" onClick={() => choose(key)} className="group flex min-h-36 flex-col items-start rounded-2xl border border-[#D6B25E]/20 bg-[#060A12] p-6 text-left transition hover:-translate-y-0.5 hover:border-[#D6B25E] hover:bg-[#111C30] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-[#D6B25E]"><Icon className="h-8 w-8 text-[#D6B25E] group-hover:text-[#D6B25E]" /><span className="mt-4 font-serif text-2xl text-[#EEE7D7] group-hover:text-[#F0D893]">{t.types[key].title}</span><span className="mt-1 text-sm leading-6 text-slate-300 group-hover:text-slate-200">{t.types[key].text}</span></button>; })}</div>
      <button type="button" onClick={() => choose("otro")} className="mt-5 text-sm font-bold text-[#EEE7D7] underline decoration-[#D6B25E] decoration-2 underline-offset-4">{t.otherLink}</button>
    </div>}

    {step === 2 && type && <div className="mt-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-serif text-3xl text-[#EEE7D7]">{t.types[type].title}</h2>{!initialType && <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-[#D6B25E] underline underline-offset-4">{t.change}</button>}</div>

      {type === "ayuda" && <>
        <Chips label={t.ayuda.needLabel} options={t.ayuda.needs} value={v("necesidad") as string} onChange={set("necesidad")} required error={err("necesidad")} />
        <div className="grid gap-5 sm:grid-cols-2"><Field label={t.ayuda.people}><input type="number" min={1} max={20} inputMode="numeric" className={fieldClass} value={s("personas")} onChange={e => set("personas")(e.target.value)} /></Field>
          <label className="flex min-h-11 items-center gap-3 self-end text-sm font-semibold"><input type="checkbox" className="h-5 w-5 accent-[#D6B25E]" checked={v("urgente") === true} onChange={e => set("urgente")(e.target.checked)} />{t.ayuda.urgent}</label></div>
        {v("urgente") === true && <p className="rounded-xl bg-[#D6B25E]/10 p-4 text-sm leading-6 text-[#F0D893]">{t.ayuda.urgentNote} <a className="font-bold underline" href={CONTACT.phoneHref}>{CONTACT.phone}</a> · <a className="font-bold underline" href={CONTACT.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></p>}
        <Field label={t.ayuda.message} required error={err("mensaje")}><textarea className={`${fieldClass} min-h-32`} value={s("mensaje")} onChange={e => set("mensaje")(e.target.value)} onBlur={touch("mensaje")} /><span className="mt-1 block text-xs font-normal text-slate-400">{t.ayuda.messageHint}</span></Field>
      </>}

      {type === "voluntariado" && <>
        <Chips label={t.voluntariado.areasLabel} options={t.voluntariado.areas} value={v("areas") as string[]} onChange={set("areas")} multiple required error={err("areas")} />
        <Chips label={t.voluntariado.whenLabel} options={t.voluntariado.when} value={v("disponibilidad") as string[]} onChange={set("disponibilidad")} multiple required error={err("disponibilidad")} />
        <Chips label={t.voluntariado.modeLabel} options={t.voluntariado.modes} value={v("modalidad") as string} onChange={set("modalidad")} />
        <Field label={t.voluntariado.languages}><input className={fieldClass} value={s("idiomas_habla")} onChange={e => set("idiomas_habla")(e.target.value)} /></Field>
        <label className="flex min-h-11 items-center gap-3 text-sm font-semibold"><input type="checkbox" className="h-5 w-5 accent-[#D6B25E]" checked={v("mayor_18") !== false} onChange={e => set("mayor_18")(e.target.checked)} />{t.voluntariado.adult}</label>
        {v("mayor_18") === false && <p className="rounded-xl bg-[#060A12] p-4 text-sm leading-6 text-slate-200">{t.voluntariado.minorNote}</p>}
        <Field label={t.voluntariado.message}><textarea className={`${fieldClass} min-h-24`} value={s("mensaje")} onChange={e => set("mensaje")(e.target.value)} /></Field>
      </>}

      {type === "organizacion" && <>
        <div className="grid gap-5 sm:grid-cols-2"><Field label={t.organizacion.entity} required error={err("entidad")}><input className={fieldClass} value={s("entidad")} onChange={e => set("entidad")(e.target.value)} onBlur={touch("entidad")} /></Field><Field label={t.organizacion.web}><input type="url" inputMode="url" className={fieldClass} value={s("web")} onChange={e => set("web")(e.target.value)} /></Field></div>
        <Chips label={t.organizacion.entityType} options={t.organizacion.entityTypes} value={v("tipo_entidad") as string} onChange={set("tipo_entidad")} required error={err("tipo_entidad")} />
        <Chips label={t.organizacion.offerLabel} options={t.organizacion.offers} value={v("colaboracion") as string[]} onChange={set("colaboracion")} multiple />
        <Field label={t.organizacion.role}><input className={fieldClass} value={s("cargo")} onChange={e => set("cargo")(e.target.value)} /></Field>
        <Field label={t.organizacion.message} required error={err("mensaje")}><textarea className={`${fieldClass} min-h-32`} value={s("mensaje")} onChange={e => set("mensaje")(e.target.value)} onBlur={touch("mensaje")} /></Field>
      </>}

      {type === "donar" && <>
        <Chips label={t.donar.modeLabel} options={t.donar.modes} value={v("modo") as string} onChange={set("modo")} required error={err("modo")} />
        {v("modo") === "dinero" && <div className="rounded-2xl bg-[#08101E] p-6 text-white"><p className="leading-7">{t.donar.moneyText}</p><Link href="/donar" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#D6B25E] px-5 py-2 text-sm font-bold text-[#120D05]">{t.donar.moneyCta}<ArrowRight className="ml-2 h-4 w-4" /></Link></div>}
        {v("modo") === "especie" && <>
          <Chips label={t.donar.goodsLabel} options={t.donar.goods} value={v("que_dona") as string[]} onChange={set("que_dona")} multiple required error={err("que_dona")} />
          <Field label={t.donar.goodsDesc} required error={err("descripcion")}><textarea className={`${fieldClass} min-h-24`} value={s("descripcion")} onChange={e => set("descripcion")(e.target.value)} onBlur={touch("descripcion")} /></Field>
          <Chips label={t.donar.deliveryLabel} options={t.donar.delivery} value={v("entrega") as string} onChange={set("entrega")} />
        </>}
        {v("modo") === "socio" && <>
          <fieldset data-error={err("plan") ? "true" : undefined} className="scroll-mt-32"><legend className="text-sm font-semibold text-[#EEE7D7]">{t.donar.planLabel}<span className="text-[#D6B25E]"> *</span></legend>
            <div className={`mt-3 grid gap-3 sm:grid-cols-2 ${err("plan") ? "rounded-2xl p-2 ring-2 ring-red-400/60" : ""}`}>{t.donar.plans.map(plan => { const active = v("plan") === plan.key; return <button key={plan.key} type="button" aria-pressed={active} onClick={() => setValues(current => ({ ...current, plan: plan.key, cuota: undefined as unknown as string, cuota_otra: "" }))} className={`flex flex-col items-start rounded-2xl border p-5 text-left transition ${active ? "border-[#D6B25E] bg-[#D6B25E]/10" : "border-[#D6B25E]/20 bg-[#060A12] hover:border-[#D6B25E]"}`}><span className="font-serif text-2xl text-[#EEE7D7]">{plan.title}</span><span className="mt-1 text-sm font-bold text-[#F0D893]">{plan.price}</span><span className="mt-2 text-sm leading-6 text-slate-300">{plan.text}</span></button>; })}</div>
            <ErrorText text={err("plan")} />
          </fieldset>
          {v("plan") === "empresa" && <>
            <Field label={t.donar.companyName} required error={err("entidad")}><input className={fieldClass} autoComplete="organization" value={s("entidad")} onChange={e => set("entidad")(e.target.value)} onBlur={touch("entidad")} /></Field>
            <Chips label={t.donar.feeLabel} options={t.donar.companyFees} value={v("cuota") as string} onChange={set("cuota")} required error={err("cuota")} />
            {v("cuota") === "otra" && <Field label={t.donar.companyOther} required error={err("cuota_otra")}><input type="number" min={MEMBERSHIP.companyMin} step={1} inputMode="numeric" className={fieldClass} value={s("cuota_otra")} onChange={e => set("cuota_otra")(e.target.value)} onBlur={touch("cuota_otra")} /></Field>}
          </>}
          {v("plan") === "colaborador" && <>
            <Chips label={t.donar.feeLabel} options={t.donar.fees} value={v("cuota") as string} onChange={set("cuota")} required error={err("cuota")} />
            {v("cuota") === "otra" && <Field label={t.donar.otherAmount} required error={err("cuota_otra")}><input type="number" min={MEMBERSHIP.minAmount} step={1} inputMode="numeric" className={fieldClass} value={s("cuota_otra")} onChange={e => set("cuota_otra")(e.target.value)} onBlur={touch("cuota_otra")} /></Field>}
            <Chips label={t.donar.periodLabel} options={t.donar.periods} value={v("periodicidad") as string} onChange={set("periodicidad")} required error={err("periodicidad")} />
          </>}
          <p className="rounded-xl bg-[#060A12] p-4 text-sm leading-6 text-slate-200">{t.donar.socioNote}</p>
        </>}
      </>}

      {type === "otro" && <>
        <Chips label={t.otro.topicLabel} options={t.otro.topics} value={v("tema") as string} onChange={set("tema")} required error={err("tema")} />
        <Field label={t.otro.message} required error={err("mensaje")}><textarea className={`${fieldClass} min-h-32`} value={s("mensaje")} onChange={e => set("mensaje")(e.target.value)} onBlur={touch("mensaje")} /></Field>
      </>}

      {showRequired && !step2Valid && <Summary title={t.errors.summary} items={errorLabels(errors2, labels2)} />}
      {!(type === "donar" && v("modo") === "dinero") && <div className="flex flex-wrap justify-between gap-3">{!initialType ? <button type="button" onClick={() => setStep(1)} className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold text-[#EEE7D7]"><ArrowLeft className="mr-1 h-4 w-4" />{t.back}</button> : <span />}<button type="button" onClick={goNext} className="inline-flex min-h-12 items-center rounded-full bg-[#D6B25E] px-6 text-sm font-bold text-[#120D05]">{t.next}<ArrowRight className="ml-2 h-4 w-4" /></button></div>}
    </div>}

    {step === 3 && <div className="mt-7 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.contact.name} required error={err("nombre")}><input autoComplete="name" aria-invalid={Boolean(err("nombre"))} className={fieldClass} value={s("nombre")} onChange={e => set("nombre")(e.target.value)} onBlur={touch("nombre")} /></Field>
        <Field label={t.contact.email} required error={err("email")}><input type="email" autoComplete="email" inputMode="email" aria-invalid={Boolean(err("email"))} className={fieldClass} value={s("email")} onChange={e => set("email")(e.target.value)} onBlur={touch("email")} /></Field>
        <Field label={t.contact.phone}><input type="tel" autoComplete="tel" inputMode="tel" className={fieldClass} value={s("telefono")} onChange={e => set("telefono")(e.target.value)} /></Field>
        <Field label={t.contact.city}><input autoComplete="address-level2" className={fieldClass} value={s("ciudad")} onChange={e => set("ciudad")(e.target.value)} /></Field>
      </div>
      <Chips label={t.contact.zoneLabel} options={t.contact.zones} value={v("zona") as string} onChange={set("zona")} />
      <Chips label={t.contact.channelLabel} options={t.contact.channels} value={v("canal") as string} onChange={set("canal")} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={s("website")} onChange={e => set("website")(e.target.value)} />
      <p className="text-xs leading-5 text-slate-400">{t.contact.sensitive}</p>
      <div data-error={err("consentimiento") ? "true" : undefined} className={`scroll-mt-32 rounded-xl ${err("consentimiento") ? "p-3 ring-2 ring-red-400/60" : ""}`}><label className="flex items-start gap-3 text-sm leading-6 text-slate-200"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#D6B25E]" checked={v("consentimiento") === true} onChange={e => set("consentimiento")(e.target.checked)} /><span>{t.contact.consent} <Link className="underline" href="/privacidad">{t.contact.privacyLink}</Link></span></label><ErrorText text={err("consentimiento")} /></div>
      {showRequired && !step3Valid && <Summary title={t.errors.summary} items={errorLabels(errors3, labels3)} />}
      {state === "error" && <div className="rounded-xl bg-red-500/10 p-4 text-sm text-red-200"><p>{t.error}</p><div className="mt-3 flex flex-wrap gap-2">{failedMail && <a className="inline-flex min-h-10 items-center rounded-full bg-[#D6B25E] px-4 text-xs font-bold text-[#120D05]" href={failedMail}>{t.sendByEmail}</a>}<a className="inline-flex min-h-10 items-center rounded-full border border-[#D6B25E]/50 px-4 text-xs font-bold text-[#F0D893]" href={CONTACT.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></div></div>}
      <div className="flex flex-wrap justify-between gap-3"><button type="button" onClick={() => setStep(2)} className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold text-[#EEE7D7]"><ArrowLeft className="mr-1 h-4 w-4" />{t.back}</button><button type="submit" disabled={state === "sending"} className="inline-flex min-h-12 items-center rounded-full bg-[#D6B25E] px-7 text-sm font-bold text-[#120D05] shadow-[0_8px_22px_rgba(214,178,94,.35)] disabled:opacity-60">{state === "sending" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.sending}</> : <><Send className="mr-2 h-4 w-4" />{t.send}</>}</button></div>
    </div>}
  </form>;
}
