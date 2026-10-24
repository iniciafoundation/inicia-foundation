import { useState } from "react";
import { Link } from "wouter";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { ProjectVisual } from "@/components/ProjectVisual";
import { trpc } from "@/lib/trpc";

type Locale = "es" | "en" | "ru" | "uk";
const labels: Record<Locale, { eyebrow: string; title: string; intro: string; learn: string; notices: string }> = {
  es: { eyebrow: "Portfolio de proyectos", title: "Donde está nuestro compromiso", intro: "Iniciativas y programas de INICIA Foundation, organizados por su estado y ámbito de trabajo.", learn: "Ver proyecto", notices: "Selecciona un idioma para ver la información del catálogo." },
  en: { eyebrow: "Project portfolio", title: "Where our commitment lives", intro: "INICIA Foundation initiatives and programmes, organised by their current stage and area of work.", learn: "View project", notices: "Select a language to view the project portfolio." },
  ru: { eyebrow: "Портфель проектов", title: "Где проявляется наша приверженность", intro: "Инициативы и программы INICIA Foundation, сгруппированные по текущему статусу и направлению работы.", learn: "Открыть проект", notices: "Выберите язык для просмотра каталога проектов." },
  uk: { eyebrow: "Портфель проєктів", title: "Де проявляється наша відданість", intro: "Ініціативи та програми INICIA Foundation, згруповані за поточним статусом і напрямом роботи.", learn: "Переглянути проєкт", notices: "Оберіть мову для перегляду каталогу проєктів." },
};

export default function Projects() {
  const [locale, setLocale] = useState<Locale>("es");
  const { data: projects = [], isLoading } = trpc.crm.public.projects.useQuery({ locale });
  const copy = labels[locale];
  return <main className="min-h-screen bg-[#f8f6f1] text-[#0B2545]"><OriginalSiteNavigation locale={locale} onLocaleChange={setLocale} /><section className="bg-[#0B2545] px-5 py-20 text-white"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#F4A833]">{copy.eyebrow}</p><h1 className="mt-4 max-w-3xl font-serif text-5xl md:text-7xl">{copy.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">{copy.intro}</p></div></section><section className="mx-auto max-w-7xl px-5 py-14"><div className="flex flex-wrap items-center justify-between gap-5"><p className="max-w-lg text-sm leading-6 text-slate-600">{copy.notices}</p><div className="flex rounded-full border border-[#0B2545]/15 bg-white p-1" aria-label="Project language">{(["es", "en", "ru", "uk"] as Locale[]).map(language => <button key={language} onClick={() => setLocale(language)} className={`rounded-full px-4 py-2 text-xs font-bold transition ${locale === language ? "bg-[#0B2545] text-white" : "text-[#0B2545] hover:bg-[#f4e1af]"}`}>{language.toUpperCase()}</button>)}</div></div>{isLoading ? <p className="py-20 text-center font-serif text-3xl">…</p> : <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{projects.map(project => <article key={project.id} className="group flex min-h-72 flex-col overflow-hidden rounded-3xl border border-[#0B2545]/15 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"><ProjectVisual category={project.category} status={project.status} slug={project.slug} /><div className="flex flex-1 flex-col p-7"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#c78117]">{project.category}</p><h2 className="mt-4 font-serif text-3xl">{project.title}</h2><p className="mt-4 flex-1 leading-7 text-slate-600">{project.shortDescription}</p><Link href={`/proyectos/${project.slug}?lang=${locale}`} className="mt-7 inline-flex w-fit rounded-full border border-[#0B2545]/25 px-4 py-2 text-sm font-bold transition group-hover:bg-[#0B2545] group-hover:text-white">{copy.learn} →</Link></div></article>)}</div>}</section></main>;
}
