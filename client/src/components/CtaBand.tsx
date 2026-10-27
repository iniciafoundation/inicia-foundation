import { ArrowRight, HandHeart, HeartHandshake, LifeBuoy, UsersRound } from "lucide-react";
import { Link } from "wouter";
import { type Locale, useT } from "@/lib/i18n";

const copy: Record<Locale, { eyebrow: string; title: string; text: string; actions: [string, string, string][] }> = {
  es: { eyebrow: "Pasa a la acción", title: "¿Cómo quieres participar hoy?", text: "Cada gesto cuenta: unas horas de tu tiempo, una donación o una cuota mensual sostienen el acompañamiento a familias en Asturias y en toda España.", actions: [["Dona ahora", "Bizum o transferencia, desde 1 €", "/donar"], ["Hazte voluntario/a", "Tu tiempo y tus habilidades", "/contacto?tipo=voluntariado"], ["Hazte socio/a", "Apoyo mensual desde 5 €", "/donar#socios"], ["Necesito ayuda", "Te respondemos personalmente", "/contacto?tipo=ayuda"]] },
  en: { eyebrow: "Take action", title: "How would you like to take part today?", text: "Every gesture counts: a few hours of your time, a donation or a monthly membership support families in Asturias and across Spain.", actions: [["Donate now", "Bizum or bank transfer, from €1", "/donar"], ["Volunteer", "Your time and skills", "/contacto?tipo=voluntariado"], ["Become a member", "Monthly support from €5", "/donar#socios"], ["I need help", "We reply personally", "/contacto?tipo=ayuda"]] },
  ru: { eyebrow: "Действуйте", title: "Как вы хотите участвовать сегодня?", text: "Важен каждый шаг: несколько часов вашего времени, пожертвование или ежемесячный взнос помогают семьям в Астурии и по всей Испании.", actions: [["Пожертвовать", "Bizum или перевод, от 1 €", "/donar"], ["Стать волонтёром", "Ваше время и навыки", "/contacto?tipo=voluntariado"], ["Стать членом фонда", "Ежемесячная поддержка от 5 €", "/donar#socios"], ["Мне нужна помощь", "Ответим лично", "/contacto?tipo=ayuda"]] },
  uk: { eyebrow: "Дійте", title: "Як ви хочете долучитися сьогодні?", text: "Важливий кожен крок: кілька годин вашого часу, пожертва чи щомісячний внесок допомагають родинам в Астурії та по всій Іспанії.", actions: [["Пожертвувати", "Bizum або переказ, від 1 €", "/donar"], ["Стати волонтером", "Ваш час і навички", "/contacto?tipo=voluntariado"], ["Стати членом фонду", "Щомісячна підтримка від 5 €", "/donar#socios"], ["Мені потрібна допомога", "Відповімо особисто", "/contacto?tipo=ayuda"]] },
  ast: { eyebrow: "Pasa a l'aición", title: "¿Cómo quies participar güei?", text: "Cada xestu cuenta: delles hores del to tiempu, una donación o una cuota mensual sofiten l'acompañamientu a families n'Asturies y en toa España.", actions: [["Dona agora", "Bizum o tresferencia, dende 1 €", "/donar"], ["Faite voluntariu/a", "El to tiempu y les tos habilidaes", "/contacto?tipo=voluntariado"], ["Faite sociu/a", "Sofitu mensual dende 5 €", "/donar#socios"], ["Preciso ayuda", "Contestámoste personalmente", "/contacto?tipo=ayuda"]] },
};
const ICONS = [HandHeart, HeartHandshake, UsersRound, LifeBuoy];

/** Call-to-action band shown before the footer of content pages. */
export function CtaBand() {
  const t = useT(copy);
  return <section className="border-t border-[#D6B25E]/15 bg-gradient-to-b from-[#0A1424] to-[#060A12] px-5 py-20 text-[#EEE7D7]">
    <div className="mx-auto max-w-6xl">
      <p className="text-[11px] font-semibold uppercase tracking-[.3em] text-[#D6B25E]">{t.eyebrow}</p>
      <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t.title}</h2>
      <p className="mt-4 max-w-2xl leading-7 text-slate-300">{t.text}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{t.actions.map(([title, text, href], index) => { const Icon = ICONS[index]; const primary = index === 0; return <Link key={href} href={href} className={`group flex flex-col rounded-3xl border p-6 transition hover:-translate-y-0.5 ${primary ? "border-[#D6B25E] bg-[#D6B25E] text-[#120D05]" : "border-[#D6B25E]/25 bg-[#0C1320] hover:border-[#D6B25E]"}`}><Icon className={`h-7 w-7 ${primary ? "text-[#120D05]" : "text-[#D6B25E]"}`} /><span className="mt-4 font-serif text-2xl leading-tight">{title}</span><span className={`mt-1 text-sm ${primary ? "text-[#120D05]/80" : "text-slate-300"}`}>{text}</span><ArrowRight className="mt-4 h-4 w-4 transition group-hover:translate-x-1" /></Link>; })}</div>
    </div>
  </section>;
}
