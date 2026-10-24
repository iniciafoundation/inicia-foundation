import { Link } from "wouter";
import { ArrowRight, ImageIcon } from "lucide-react";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { ProjectVisual } from "@/components/ProjectVisual";

const visualDirections = [
  { title: "NÚCLEO", category: "Economía circular y formación", slug: "nucleo" },
  { title: "CoopAstur AgroSocial", category: "Desarrollo rural y comunidad", slug: "coopastur-agrosocial" },
  { title: "Rural Futures", category: "Territorio, biodiversidad y participación", slug: "rural-futures" },
];

export default function Gallery() {
  return <main className="min-h-screen bg-[#f8f6f1] text-[#0B2545]"><OriginalSiteNavigation dark /><section className="bg-[#0B2545] px-5 py-20 text-white"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#F4A833]">Galería</p><h1 className="mt-4 max-w-3xl font-serif text-5xl md:text-6xl">Nuestro trabajo, <em className="text-[#F4A833]">en imágenes.</em></h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">Una mirada visual a las líneas de trabajo de INICIA Foundation. Las fotografías documentales de actividades se incorporarán únicamente cuando la organización disponga de los originales y de las autorizaciones de imagen correspondientes.</p></div></section><section className="mx-auto max-w-7xl px-5 py-16"><div className="flex max-w-3xl items-start gap-4 rounded-2xl border border-[#0B2545]/10 bg-white p-6"><ImageIcon className="mt-1 h-6 w-6 shrink-0 text-[#c78117]" /><p className="text-sm leading-6 text-slate-600">Las imágenes de esta página son ilustraciones temáticas de las iniciativas; no representan personas participantes, eventos ni resultados documentales.</p></div><div className="mt-10 grid gap-6 md:grid-cols-3">{visualDirections.map(direction => <article key={direction.slug} className="overflow-hidden rounded-3xl border border-[#0B2545]/10 bg-white shadow-sm"><ProjectVisual category={direction.category} status="Ilustración temática" slug={direction.slug} large /><div className="p-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#c78117]">Línea de trabajo</p><h2 className="mt-3 font-serif text-3xl">{direction.title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{direction.category}</p><Link href={`/proyectos/${direction.slug}`} className="mt-5 inline-flex items-center text-sm font-bold underline decoration-[#F4A833] decoration-2 underline-offset-4">Ver proyecto <ArrowRight className="ml-1 h-4 w-4" /></Link></div></article>)}</div></section></main>;
}
