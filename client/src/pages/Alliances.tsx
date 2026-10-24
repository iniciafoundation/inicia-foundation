import { Link } from "wouter";
import { ArrowRight, Building2, GraduationCap, HeartHandshake, Cpu } from "lucide-react";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";

/**
 * Entidades con las que INICIA Foundation ha colaborado.
 * Añadir una entidad solo con su autorización para aparecer en la web.
 * Ejemplo: { name: "Nombre de la entidad", type: "Institución pública", work: "Qué hicimos juntos", year: "2025", url: "https://..." }
 */
type Partner = { name: string; type: string; work: string; year?: string; url?: string };
export const partners: Partner[] = [];

export const allianceAreas = [
  { icon: Building2, title: "Instituciones públicas", text: "Administraciones y servicios públicos con los que coordinamos programas de inclusión, formación y empleo." },
  { icon: HeartHandshake, title: "Entidades sociales", text: "Asociaciones, fundaciones y redes con las que compartimos acompañamiento a familias y voluntariado." },
  { icon: GraduationCap, title: "Educación e investigación", text: "Universidades, centros de formación y proyectos europeos de juventud y aprendizaje." },
  { icon: Cpu, title: "Empresas y tecnología", text: "Empresas y equipos tecnológicos que aportan conocimiento, herramientas e inclusión digital." },
] as const;

export default function Alliances() {
  return <main className="min-h-screen bg-[#f8f6f1] text-[#0B2545]"><OriginalSiteNavigation dark />
    <section className="bg-[#0B2545] px-5 py-20 text-white"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#F4A833]">Alianzas</p><h1 className="mt-4 max-w-3xl font-serif text-5xl md:text-6xl">Con quién <em className="text-[#F4A833]">trabajamos.</em></h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">Nuestro trabajo es posible gracias a la colaboración con instituciones, entidades sociales, centros educativos y empresas que comparten el compromiso con la inclusión y el desarrollo comunitario.</p></div></section>

    <section className="mx-auto max-w-7xl px-5 py-16"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#c78117]">Ámbitos de colaboración</p><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{allianceAreas.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-3xl border border-[#0B2545]/10 bg-white p-7 shadow-sm"><Icon className="h-7 w-7 text-[#c78117]" /><h2 className="mt-4 font-serif text-2xl">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></article>)}</div></section>

    <section className="mx-auto max-w-7xl px-5 pb-16"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#c78117]">Entidades colaboradoras</p>{partners.length > 0
      ? <div className="mt-6 grid gap-5 md:grid-cols-3">{partners.map(p => <article key={p.name} className="rounded-3xl border border-[#0B2545]/10 bg-white p-7 shadow-sm"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#c78117]">{p.type}{p.year ? ` · ${p.year}` : ""}</p><h2 className="mt-3 font-serif text-2xl">{p.url ? <a href={p.url} target="_blank" rel="noreferrer" className="underline decoration-[#F4A833] decoration-2 underline-offset-4">{p.name}</a> : p.name}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{p.work}</p></article>)}</div>
      : <p className="mt-6 max-w-3xl rounded-2xl border border-[#0B2545]/10 bg-white p-6 text-sm leading-6 text-slate-600">Publicaremos aquí las entidades con las que hemos colaborado, siempre con su autorización.</p>}</section>

    <section className="bg-[#0B2545] px-5 py-16 text-white"><div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between"><div><h2 className="font-serif text-4xl">¿Colaboramos?</h2><p className="mt-3 max-w-2xl leading-7 text-slate-200">Si tu organización quiere sumar esfuerzos en inclusión, formación, desarrollo rural o innovación social, escríbenos.</p></div><Link href="/contacto" className="inline-flex w-fit items-center rounded-full bg-[#F4A833] px-6 py-3 text-sm font-bold text-[#0B2545]">Proponer una colaboración <ArrowRight className="ml-2 h-4 w-4" /></Link></div></section>
  </main>;
}
