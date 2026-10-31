import { FormEvent, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { track } from "@/lib/analytics";
import { useLocale } from "@/lib/i18n";
import { arrivalOla } from "@/lib/participation";
import { flatten, makeReference, sendRequest } from "@/lib/requests";
import { CONTACT } from "@/lib/siteConfig";
import { AltavozInvite } from "./Share";

/**
 * Forms of the programmes (laboratory, social economy, ideas). Spanish only, by decision of the association.
 * Each "tipo" is stored in its own tab of the Google Sheet by the Apps Script (see apps-script/Code.gs).
 */
export type ProgramFieldKind = "text" | "email" | "tel" | "textarea" | "one" | "many";
export type ProgramField = { name: string; label: string; kind: ProgramFieldKind; required?: boolean; options?: string[]; placeholder?: string; hint?: string };
export type ProgramFormConfig = {
  tipo: "aprender" | "ensenar" | "colabora_lab" | "economia" | "idea";
  fields: ProgramField[];
  /** Ask the person to confirm they are 18 or older. */
  adult?: boolean;
  submit: string;
  done: string;
  /** Show only the first field until the person starts writing (inviting, not a long questionnaire). */
  reveal?: boolean;
};

const CONTACT_FIELDS: ProgramField[] = [
  { name: "nombre", label: "Nombre y apellidos", kind: "text", required: true },
  { name: "email", label: "Email", kind: "email", required: true },
  { name: "telefono", label: "Teléfono (opcional)", kind: "tel" },
  { name: "ciudad", label: "Municipio", kind: "text" },
];

const fieldClass = "mt-2 w-full rounded-xl border border-[#D6B25E]/20 bg-[#060A12] px-4 py-3 text-base text-[#EEE7D7] outline-none transition placeholder:text-slate-500 focus:border-[#D6B25E] focus:ring-2 focus:ring-[#D6B25E]/40";
type Values = Record<string, string | string[] | boolean>;

export function ProgramForm({ config, project, contactFirst = false }: { config: ProgramFormConfig; project?: string; contactFirst?: boolean }) {
  const [locale] = useLocale();
  const [values, setValues] = useState<Values>({});
  const [shown, setShown] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [mailFallback, setMailFallback] = useState("");
  const [reference, setReference] = useState<string>();
  const formRef = useRef<HTMLFormElement>(null);

  const contact = CONTACT_FIELDS.filter(field => !config.fields.some(own => own.name === field.name));
  const fields = contactFirst ? [...contact, ...config.fields] : [...config.fields, ...contact];
  const started = !config.reveal || fields.slice(0, 1).some(field => has(values[field.name]));
  const visible = started ? fields : fields.slice(0, 1);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    for (const field of fields) {
      const value = values[field.name];
      if (field.required && !has(value)) e[field.name] = field.kind === "one" || field.kind === "many" ? "Elige una opción." : "Este campo es obligatorio.";
    }
    const email = typeof values.email === "string" ? values.email.trim() : "";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = "Revisa el email.";
    const name = typeof values.nombre === "string" ? values.nombre.trim() : "";
    if (name && name.length < 2) e.nombre = "Escribe tu nombre.";
    if (values.consentimiento !== true) e.consentimiento = "Necesitamos tu consentimiento para guardar tus datos.";
    if (config.adult && values.mayor_18 !== true) e.mayor_18 = "Este programa es para personas mayores de 18 años.";
    return e;
  }, [values, fields, config.adult]);

  const set = (name: string, value: string | string[] | boolean) => setValues(current => ({ ...current, [name]: value }));
  const err = (name: string) => (shown ? errors[name] : undefined);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (Object.keys(errors).length) {
      setShown(true);
      setTimeout(() => formRef.current?.querySelector<HTMLElement>('[data-error="true"]')?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      return;
    }
    if (values.website) return; // honeypot
    const ref = makeReference();
    const payload = { ...values, referencia: ref, tipo: config.tipo, proyecto: project, ola: arrivalOla(), idioma: locale, pagina: typeof window !== "undefined" ? window.location.pathname : "" };
    delete (payload as Values).website;
    setState("sending");
    try {
      await sendRequest(payload);
      track("generate_lead", { tipo: config.tipo });
      setReference(ref);
      setState("idle");
    } catch {
      const body = Object.entries(flatten(payload)).map(([key, value]) => `${key}: ${value}`).join("\n");
      setMailFallback(`mailto:${CONTACT.requestsEmail}?subject=${encodeURIComponent(`Solicitud web ${ref} (${config.tipo})`)}&body=${encodeURIComponent(body)}`);
      setState("error");
    }
  };

  if (reference) return <div className="rounded-3xl bg-[#0C1320] p-8 text-center ring-1 ring-[#D6B25E]/20">
    <CheckCircle2 className="mx-auto h-14 w-14 text-[#D6B25E]" />
    <h3 className="mt-4 font-serif text-4xl text-[#EEE7D7]">¡Gracias por sumarte!</h3>
    <p className="mx-auto mt-4 max-w-md leading-7 text-slate-300">{config.done}</p>
    <p className="mt-4 text-sm text-slate-400">Referencia: <span className="font-mono font-semibold text-[#EEE7D7]">{reference}</span></p>
    <AltavozInvite />
  </div>;

  return <form ref={formRef} onSubmit={submit} noValidate className="space-y-5 rounded-3xl bg-[#0C1320] p-6 ring-1 ring-[#D6B25E]/20 sm:p-8">
    {project && <p className="inline-flex rounded-full bg-[#060A12] px-3 py-1 text-xs font-bold text-[#D6B25E]">Proyecto: {project}</p>}
    {visible.map(field => <FieldInput key={field.name} field={field} value={values[field.name]} error={err(field.name)} onChange={value => set(field.name, value)} />)}
    {started && <>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" onChange={e => set("website", e.target.value)} />
      <div className="space-y-3 border-t border-[#D6B25E]/15 pt-5">
        <Check name="consentimiento" error={err("consentimiento")} checked={values.consentimiento === true} onChange={value => set("consentimiento", value)}>He leído y acepto la <Link href="/privacidad" className="underline decoration-[#D6B25E] underline-offset-4">política de privacidad</Link>. Inicia Foundation tratará mis datos para gestionar esta solicitud. *</Check>
        {config.adult && <Check name="mayor_18" error={err("mayor_18")} checked={values.mayor_18 === true} onChange={value => set("mayor_18", value)}>Declaro ser mayor de 18 años. *</Check>}
        <Check name="novedades" checked={values.novedades === true} onChange={value => set("novedades", value)}>Quiero recibir por email novedades del proyecto (opcional).</Check>
        <p className="text-xs leading-5 text-slate-400">Responsable: Inicia Foundation (NIF G05426242). Finalidad: gestionar tu participación y contactar contigo. Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a {CONTACT.email}.</p>
      </div>
      {shown && Object.keys(errors).length > 0 && <p role="alert" className="flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200"><AlertCircle className="h-4 w-4 shrink-0" />Revisa los campos marcados.</p>}
      {state === "error" && <div role="alert" className="rounded-xl border border-[#D6B25E]/40 bg-[#D6B25E]/10 p-4 text-sm leading-6 text-[#F0D893]">No hemos podido enviar el formulario. Puedes enviarlo por correo con un clic: <a href={mailFallback} className="font-bold underline">enviar por email</a>, o escribirnos por <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="font-bold underline">WhatsApp</a>.</div>}
      <button type="submit" disabled={state === "sending"} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#D6B25E] px-7 text-sm font-bold text-[#120D05] disabled:opacity-60">{state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{config.submit}</button>
    </>}
  </form>;
}

function has(value: unknown) {
  return Array.isArray(value) ? value.length > 0 : typeof value === "string" ? value.trim().length > 0 : value === true;
}

function FieldInput({ field, value, error, onChange }: { field: ProgramField; value: Values[string] | undefined; error?: string; onChange: (value: string | string[]) => void }) {
  const label = <>{field.label}{field.required && <span className="text-[#D6B25E]"> *</span>}</>;
  const errorText = error ? <span className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-300"><AlertCircle className="h-3.5 w-3.5" />{error}</span> : null;
  if (field.kind === "one" || field.kind === "many") {
    const list = Array.isArray(value) ? value : [];
    const isOn = (option: string) => (field.kind === "many" ? list.includes(option) : value === option);
    const toggle = (option: string) => field.kind === "many" ? onChange(list.includes(option) ? list.filter(item => item !== option) : [...list, option]) : onChange(option);
    return <fieldset data-error={error ? "true" : undefined}><legend className="text-sm font-semibold text-[#EEE7D7]">{label}</legend>{field.hint && <p className="mt-1 text-xs text-slate-400">{field.hint}</p>}
      <div className={`mt-3 flex flex-wrap gap-2 ${error ? "rounded-2xl p-2 ring-2 ring-red-400/60" : ""}`}>{field.options?.map(option => <button key={option} type="button" aria-pressed={isOn(option)} onClick={() => toggle(option)} className={`min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition ${isOn(option) ? "border-[#D6B25E] bg-[#D6B25E] text-[#120D05]" : "border-[#D6B25E]/25 bg-[#060A12] text-[#EEE7D7] hover:border-[#D6B25E]"}`}>{option}</button>)}</div>{errorText}</fieldset>;
  }
  const text = typeof value === "string" ? value : "";
  return <label data-error={error ? "true" : undefined} className="block text-sm font-semibold text-[#EEE7D7]">{label}{field.hint && <span className="mt-1 block text-xs font-normal text-slate-400">{field.hint}</span>}
    {field.kind === "textarea"
      ? <textarea rows={field.name === "idea" ? 5 : 4} value={text} placeholder={field.placeholder} onChange={e => onChange(e.target.value)} className={`${fieldClass} ${error ? "border-red-400" : ""}`} />
      : <input type={field.kind} value={text} placeholder={field.placeholder} autoComplete={field.kind === "email" ? "email" : field.kind === "tel" ? "tel" : field.name === "nombre" ? "name" : undefined} onChange={e => onChange(e.target.value)} className={`${fieldClass} ${error ? "border-red-400" : ""}`} />}
    {errorText}</label>;
}

function Check({ name, checked, onChange, error, children }: { name: string; checked: boolean; onChange: (value: boolean) => void; error?: string; children: React.ReactNode }) {
  return <label data-error={error ? "true" : undefined} className="flex items-start gap-3 text-sm leading-6 text-slate-200"><input type="checkbox" name={name} checked={checked} onChange={e => onChange(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#D6B25E]" /><span>{children}{error && <span className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-red-300"><AlertCircle className="h-3.5 w-3.5" />{error}</span>}</span></label>;
}
