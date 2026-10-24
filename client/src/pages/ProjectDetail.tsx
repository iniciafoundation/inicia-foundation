import { Link, useRoute } from "wouter";
import { ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { ProjectVisual } from "@/components/ProjectVisual";

const labels = {
  es: { loading: "Cargando proyecto…", missing: "Proyecto no encontrado", back: "Volver al catálogo", home: "INICIA Foundation" },
  en: { loading: "Loading project…", missing: "Project not found", back: "Back to the portfolio", home: "INICIA Foundation" },
  ru: { loading: "Загрузка проекта…", missing: "Проект не найден", back: "Вернуться к каталогу", home: "INICIA Foundation" },
  uk: { loading: "Завантаження проєкту…", missing: "Проєкт не знайдено", back: "Повернутися до каталогу", home: "INICIA Foundation" },
};

export default function ProjectDetail() {
  const [, params] = useRoute("/proyectos/:slug");
  const queryLocale = new URLSearchParams(window.location.search).get("lang");
  const locale = queryLocale === "en" || queryLocale === "ru" || queryLocale === "uk" ? queryLocale : "es";
  const copy = labels[locale];
  const query = trpc.crm.public.projects.useQuery({ locale });
  const project = query.data?.find(item => item.slug === params?.slug);
  const changeLocale = (nextLocale: keyof typeof labels) => { window.location.href = `/proyectos/${params?.slug}?lang=${nextLocale}`; };
  if (query.isLoading) return <main className="min-h-screen bg-slate-50"><OriginalSiteNavigation locale={locale} onLocaleChange={changeLocale} /><div className="grid min-h-[70vh] place-items-center p-5"><p className="font-serif text-3xl text-[#12355b]">{copy.loading}</p></div></main>;
  if (!project) return <main className="min-h-screen bg-slate-50"><OriginalSiteNavigation locale={locale} onLocaleChange={changeLocale} /><div className="grid min-h-[70vh] place-items-center p-5"><div className="text-center"><h1 className="font-serif text-4xl text-[#12355b]">{copy.missing}</h1><Link href={`/proyectos?lang=${locale}`} className="mt-4 inline-block text-teal-700 underline">{copy.back}</Link></div></div></main>;
  return <main className="min-h-screen bg-[#f5f7fa]"><OriginalSiteNavigation locale={locale} onLocaleChange={changeLocale} /><header className="bg-[#12355b] px-5 py-5 text-white"><div className="mx-auto max-w-6xl"><Link href={`/proyectos?lang=${locale}`} className="text-sm"><ArrowLeft className="mr-1 inline h-4 w-4" />{copy.home}</Link></div></header><section className="mx-auto max-w-5xl px-5 py-20"><div className="grid gap-9 lg:grid-cols-[1.15fr_.85fr] lg:items-end"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-teal-700">{project.category} · {project.status}</p><h1 className="mt-4 font-serif text-5xl text-[#12355b] md:text-6xl">{project.title}</h1><p className="mt-6 max-w-3xl text-xl leading-8 text-slate-600">{project.shortDescription}</p></div><ProjectVisual category={project.category} status={project.status} slug={project.slug} large /></div><article className="mt-12 max-w-none rounded-3xl bg-white p-8 text-slate-700 shadow-sm [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:text-[#12355b] [&_h3]:mt-7 [&_h3]:font-serif [&_h3]:text-2xl [&_h3]:text-[#12355b] [&_p]:mt-3 [&_p]:leading-7 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6" dangerouslySetInnerHTML={{ __html: project.bodyHtml }} /></section></main>;
}
