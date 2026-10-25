import { Link } from "wouter";
import { HandHeart, HeartHandshake } from "lucide-react";
import { useSiteContent } from "@/lib/content";
import { useLocale } from "@/lib/i18n";

const copy = {
  es: { title: "Apoya este proyecto", raised: "recaudados de", donors: "personas ya han apoyado", donate: "Donar a este proyecto", join: "Quiero participar", concept: "Indica en el concepto" },
  en: { title: "Support this project", raised: "raised of", donors: "people have already supported", donate: "Donate to this project", join: "I want to take part", concept: "Use this reference" },
  ru: { title: "Поддержите этот проект", raised: "собрано из", donors: "человек уже поддержали", donate: "Пожертвовать на проект", join: "Хочу участвовать", concept: "Укажите в назначении платежа" },
  uk: { title: "Підтримайте цей проєкт", raised: "зібрано з", donors: "людей уже підтримали", donate: "Пожертвувати на проєкт", join: "Хочу долучитися", concept: "Вкажіть у призначенні платежу" },
};

const euro = (value: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

/** Fundraising progress (from the Google Sheet) and calls to action for one project. */
export function ProjectSupport({ slug, title }: { slug: string; title: string }) {
  const [locale] = useLocale();
  const t = copy[locale];
  const { data } = useSiteContent();
  const goal = data?.fundraising.find(item => item.proyecto === slug);
  const percent = goal && goal.objetivo > 0 ? Math.min(100, Math.round((goal.recaudado / goal.objetivo) * 100)) : 0;
  const note = goal ? (goal[`nota_${locale}` as const] || goal.nota_es) : undefined;
  const reference = `Donativo ${title}`.slice(0, 35);

  return <section className="mt-10 overflow-hidden rounded-3xl bg-[#0B1E3A] p-7 text-white sm:p-9">
    <p className="text-xs font-bold uppercase tracking-[.2em] text-[#D6B25E]">{t.title}</p>
    {goal && <div className="mt-5"><div className="flex flex-wrap items-end justify-between gap-2"><p className="font-serif text-4xl text-[#F0D893]">{euro(goal.recaudado)}</p><p className="text-sm text-slate-300">{t.raised} {euro(goal.objetivo)}</p></div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-gradient-to-r from-[#D6B25E] to-[#F0D893]" style={{ width: `${percent}%` }} /></div>
      <p className="mt-2 text-sm text-slate-300">{percent}% · {goal.donantes} {t.donors}</p>
      {note && <p className="mt-4 leading-7 text-slate-100">{note}</p>}</div>}
    <p className="mt-5 text-sm text-slate-300">{t.concept}: <span className="font-mono font-semibold text-[#F0D893]">{reference}</span></p>
    <div className="mt-6 flex flex-wrap gap-3"><Link href="/donar" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#D6B25E] px-6 text-sm font-bold text-[#0B1E3A]"><HeartHandshake className="h-4 w-4" />{t.donate}</Link><Link href={`/contacto?tipo=voluntariado&proyecto=${encodeURIComponent(title)}`} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-bold"><HandHeart className="h-4 w-4 text-[#D6B25E]" />{t.join}</Link></div>
  </section>;
}
