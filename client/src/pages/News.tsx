import { SiteFooter } from "@/components/SiteFooter";
import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { SpiralMark } from "@/components/SpiralMark";
import { forLocale, formatDate, useSiteContent } from "@/lib/content";
import { useLocale } from "@/lib/i18n";

const copy = {
  es: { eyebrow: "Noticias", title: "Lo que está", accent: "pasando.", intro: "Novedades de INICIA Foundation: actividades, proyectos, convocatorias y resultados.", empty: "Pronto publicaremos aquí nuestras primeras noticias.", follow: "Mientras tanto, síguenos en redes o escríbenos.", contact: "Contactar", more: "Leer más", less: "Cerrar", source: "Más información", events: "Próximos eventos", join: "Apuntarme" },
  en: { eyebrow: "News", title: "What is", accent: "happening.", intro: "Updates from INICIA Foundation: activities, projects, calls and results.", empty: "Our first news will appear here soon.", follow: "Meanwhile, follow us on social media or write to us.", contact: "Contact us", more: "Read more", less: "Close", source: "More information", events: "Upcoming events", join: "Sign up" },
  ru: { eyebrow: "Новости", title: "Что", accent: "происходит.", intro: "Новости INICIA Foundation: мероприятия, проекты, конкурсы и результаты.", empty: "Скоро здесь появятся наши первые новости.", follow: "А пока следите за нами в соцсетях или напишите нам.", contact: "Написать", more: "Читать дальше", less: "Свернуть", source: "Подробнее", events: "Ближайшие мероприятия", join: "Записаться" },
  uk: { eyebrow: "Новини", title: "Що", accent: "відбувається.", intro: "Новини INICIA Foundation: заходи, проєкти, конкурси та результати.", empty: "Незабаром тут з’являться наші перші новини.", follow: "А поки стежте за нами в соцмережах або напишіть нам.", contact: "Написати", more: "Читати далі", less: "Згорнути", source: "Детальніше", events: "Найближчі заходи", join: "Записатися" },
  ast: { eyebrow: "Noticies", title: "Lo que", accent: "ta pasando.", intro: "Novedaes d'INICIA Foundation: actividaes, proyeutos, convocatories y resultaos.", empty: "Ceo espublizaremos equí les nuestres primeres noticies.", follow: "Mentanto, síguinos nes redes o escríbinos.", contact: "Contactar", more: "Lleer más", less: "Zarrar", source: "Más información", events: "Próximos eventos", join: "Apuntame" },
};

export default function News() {
  const [locale] = useLocale();
  const t = copy[locale];
  const { data } = useSiteContent();
  const news = forLocale(data?.news ?? [], locale);
  const events = forLocale(data?.events ?? [], locale);
  const [open, setOpen] = useState<string>();

  return <main className="min-h-screen bg-[#060A12] text-[#EEE7D7]">
    <OriginalSiteNavigation dark />
    <section className="relative isolate overflow-hidden bg-[#060A12] bg-[#08101E] px-5 pt-28 pb-24 text-white"><img src="/assets/photos/earth-1920.webp" srcSet="/assets/photos/earth-960.webp 960w, /assets/photos/earth-1920.webp 1920w" sizes="100vw" alt="" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#060A12] via-[#060A12]/80 to-[#060A12]/25" /><div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#060A12] to-transparent" /><SpiralMark className="pointer-events-none absolute -right-20 -top-6 -z-10 hidden h-[400px] w-[400px] opacity-40 md:block" /><div className="relative mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#D6B25E]">{t.eyebrow}</p><h1 className="mt-4 font-serif text-5xl md:text-6xl">{t.title} <span className="italic text-[#F0D893]">{t.accent}</span></h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">{t.intro}</p></div></section>

    {events.length > 0 && <section className="mx-auto max-w-6xl px-5 pt-14"><h2 className="font-serif text-3xl">{t.events}</h2><div className="mt-5 grid gap-4 md:grid-cols-3">{events.map(event => <article key={`${event.fecha}-${event.titulo}`} className="rounded-2xl bg-[#0C1320] p-5 shadow-sm ring-1 ring-[#D6B25E]/20"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#D6B25E]"><CalendarDays className="h-4 w-4" />{formatDate(event.fecha, locale)}{event.hora && ` · ${event.hora}`}</p><h3 className="mt-2 font-serif text-2xl">{event.titulo}</h3>{event.lugar && <p className="mt-1 text-sm text-slate-300">{event.lugar}</p>}<a href={event.enlace || "/contacto"} className="mt-3 inline-flex text-sm font-bold underline decoration-[#D6B25E] decoration-2 underline-offset-4">{t.join}</a></article>)}</div></section>}

    <section className="mx-auto max-w-6xl px-5 py-14">
      {news.length === 0 ? <div className="mx-auto max-w-xl rounded-3xl bg-[#0C1320] p-10 text-center shadow-sm ring-1 ring-[#D6B25E]/20"><Newspaper className="mx-auto h-10 w-10 text-[#D6B25E]" /><p className="mt-4 font-serif text-3xl">{t.empty}</p><p className="mt-3 text-slate-300">{t.follow}</p><Link href="/contacto" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#D6B25E] px-5 text-sm font-bold text-[#120D05]">{t.contact}</Link></div>
        : <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{news.map(item => <article key={item.id} className="flex flex-col overflow-hidden rounded-3xl bg-[#0C1320] shadow-sm ring-1 ring-[#D6B25E]/20">
          {item.imagen ? <img src={item.imagen} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" /> : <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A1424]"><SpiralMark className="absolute inset-6 opacity-40" /></div>}
          <div className="flex flex-1 flex-col p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#D6B25E]">{formatDate(item.fecha, locale)}{item.proyecto && ` · ${item.proyecto}`}</p><h2 className="mt-3 font-serif text-2xl leading-tight">{item.titulo}</h2><p className="mt-3 text-sm leading-6 text-slate-300">{item.resumen}</p>
            {open === item.id && item.texto && <div className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-200">{item.texto}</div>}
            <div className="mt-auto flex flex-wrap gap-4 pt-5">{item.texto && <button type="button" onClick={() => setOpen(open === item.id ? undefined : item.id)} className="text-sm font-bold underline decoration-[#D6B25E] decoration-2 underline-offset-4">{open === item.id ? t.less : t.more}</button>}{item.enlace && <a href={item.enlace} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-bold text-[#D6B25E]">{t.source}<ArrowRight className="ml-1 h-4 w-4" /></a>}</div>
          </div></article>)}</div>}
    </section>
  <SiteFooter /></main>;
}
