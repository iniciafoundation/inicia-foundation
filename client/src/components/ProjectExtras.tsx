import { Link } from "wouter";
import { ArrowRight, Lightbulb } from "lucide-react";
import { useT } from "@/lib/i18n";
import { SITE_URL, projectShareText } from "@/lib/participation";
import { ShareBlock } from "./Share";

const copy = {
  es: { idea: "¿Tienes una idea para este proyecto?", ideaCta: "Cuéntanosla", lab: "Únete al laboratorio: aprende, enseña o colabora.", labCta: "Ir al laboratorio" },
  en: { idea: "Do you have an idea for this project?", ideaCta: "Tell us (in Spanish)", lab: "Join the lab: learn, teach or collaborate.", labCta: "Go to the lab" },
  ru: { idea: "Есть идея для этого проекта?", ideaCta: "Расскажите нам (форма на испанском)", lab: "Присоединяйтесь к лаборатории: учитесь, учите или сотрудничайте.", labCta: "В лабораторию" },
  uk: { idea: "Маєте ідею для цього проєкту?", ideaCta: "Розкажіть нам (форма іспанською)", lab: "Долучайтеся до лабораторії: навчайтеся, навчайте або співпрацюйте.", labCta: "До лабораторії" },
  ast: { idea: "¿Tienes una idea pa esti proyeutu?", ideaCta: "Cuéntanosla", lab: "Xúntate al llaboratoriu: aprendi, enseña o collabora.", labCta: "Dir al llaboratoriu" },
};

const LAB_PROJECTS = ["laboratorio-innovacion-social", "laboratorio-emprendimiento-social", "inicia-educacion-oportunidad", "practicas-aprendizaje"];

/** Under each project: a way in for the employment lab, an idea for the project and the share block. */
export function ProjectExtras({ slug, title }: { slug: string; title: string }) {
  const t = useT(copy);
  const pill = "inline-flex min-h-11 items-center gap-2 rounded-full bg-[#D6B25E] px-5 text-sm font-bold text-[#120D05]";
  return <div className="mt-6 space-y-6">
    {LAB_PROJECTS.includes(slug) && <div className="flex flex-col gap-4 rounded-3xl bg-[#0C1320] p-6 ring-1 ring-[#D6B25E]/30 sm:flex-row sm:items-center sm:justify-between"><p className="font-serif text-2xl text-[#EEE7D7]">{t.lab}</p><Link href="/laboratorio" className={`${pill} shrink-0`}>{t.labCta}<ArrowRight className="h-4 w-4" /></Link></div>}
    <div className="flex flex-col gap-4 rounded-3xl border border-[#D6B25E]/20 p-6 sm:flex-row sm:items-center sm:justify-between"><p className="flex items-center gap-3 text-lg text-[#EEE7D7]"><Lightbulb className="h-6 w-6 shrink-0 text-[#D6B25E]" />{t.idea}</p><Link href={`/ideas?proyecto=${encodeURIComponent(title)}`} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-[#D6B25E]/50 px-5 text-sm font-bold text-[#F0D893] hover:bg-[#D6B25E]/10">{t.ideaCta}<ArrowRight className="h-4 w-4" /></Link></div>
    <ShareBlock compact url={`${SITE_URL}/proyectos/${slug}`} text={projectShareText(title)} tag={`proyecto:${slug}`} />
  </div>;
}
