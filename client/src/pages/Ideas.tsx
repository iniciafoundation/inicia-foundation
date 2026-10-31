import { Lightbulb } from "lucide-react";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { PageHero } from "@/components/PageHero";
import { ProgramForm } from "@/components/ProgramForm";
import { SiteFooter } from "@/components/SiteFooter";
import { IDEA } from "@/lib/programForms";

/** "Tu idea cuenta": ideas and opinions from anyone. Spanish only. /ideas?proyecto=Name links an idea to a project. */
export default function Ideas() {
  const project = typeof window !== "undefined" ? (new URLSearchParams(window.location.search).get("proyecto") ?? "").slice(0, 120) || undefined : undefined;
  return <main lang="es" className="min-h-screen bg-[#060A12] text-[#EEE7D7]"><OriginalSiteNavigation dark />
    <PageHero photo="vision" alt="Persona mirando al horizonte" eyebrow="Tu idea cuenta" title="Las mejores ideas" accent="vienen de la comunidad." intro="Inicia Foundation crece con lo que vemos juntos. Si se te ocurre un proyecto nuevo, una forma de mejorar lo que hacemos o algo que echas en falta, queremos escucharlo." />
    <section className="relative z-10 mx-auto -mt-12 max-w-3xl px-5 pb-20">
      <ProgramForm config={IDEA} project={project} />
      <div className="mt-8 flex gap-3 rounded-2xl border border-[#D6B25E]/20 p-5 text-sm leading-6 text-slate-300"><Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-[#D6B25E]" /><p>Leemos todas las ideas. Las que encajan con lo que hacemos o con algo que podemos empezar pasan a nuestro equipo. Si alguna se publica en la web, será solo con el permiso de quien la propuso.</p></div>
    </section>
    <SiteFooter />
  </main>;
}
