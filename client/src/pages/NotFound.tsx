import { ArrowRight, Compass } from "lucide-react";
import { Link } from "wouter";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SpiralMark } from "@/components/SpiralMark";
import { type Locale, useT } from "@/lib/i18n";

const copy: Record<Locale, { code: string; title: string; text: string; home: string; links: [string, string][] }> = {
  es: { code: "Error 404", title: "Esta página no existe.", text: "Puede que el enlace esté mal escrito o que la página se haya movido. Estas son las secciones más visitadas:", home: "Ir al inicio", links: [["Proyectos", "/proyectos"], ["Necesito ayuda", "/contacto?tipo=ayuda"], ["Voluntariado", "/contacto?tipo=voluntariado"], ["Donar", "/donar"], ["Contacto", "/contacto"]] },
  en: { code: "Error 404", title: "This page does not exist.", text: "The link may be mistyped or the page may have moved. These are the most visited sections:", home: "Go to the home page", links: [["Projects", "/proyectos"], ["I need help", "/contacto?tipo=ayuda"], ["Volunteering", "/contacto?tipo=voluntariado"], ["Donate", "/donar"], ["Contact", "/contacto"]] },
  ru: { code: "Ошибка 404", title: "Такой страницы нет.", text: "Возможно, ссылка набрана с ошибкой или страница переехала. Самые популярные разделы:", home: "На главную", links: [["Проекты", "/proyectos"], ["Мне нужна помощь", "/contacto?tipo=ayuda"], ["Волонтёрство", "/contacto?tipo=voluntariado"], ["Пожертвовать", "/donar"], ["Контакты", "/contacto"]] },
  uk: { code: "Помилка 404", title: "Такої сторінки немає.", text: "Можливо, посилання набрано з помилкою або сторінку перенесено. Найпопулярніші розділи:", home: "На головну", links: [["Проєкти", "/proyectos"], ["Мені потрібна допомога", "/contacto?tipo=ayuda"], ["Волонтерство", "/contacto?tipo=voluntariado"], ["Пожертвувати", "/donar"], ["Контакти", "/contacto"]] },
  ast: { code: "Error 404", title: "Esta páxina nun esiste.", text: "Seique l'enllaz tea mal escritu o que la páxina se movió. Estes son les seiciones más visitaes:", home: "Dir al aniciu", links: [["Proyeutos", "/proyectos"], ["Preciso ayuda", "/contacto?tipo=ayuda"], ["Voluntariáu", "/contacto?tipo=voluntariado"], ["Donar", "/donar"], ["Contactu", "/contacto"]] },
};

export default function NotFound() {
  const t = useT(copy);
  return <main className="min-h-screen bg-[#060A12] text-[#EEE7D7]">
    <OriginalSiteNavigation />
    <section className="relative isolate overflow-hidden px-5 py-28">
      <SpiralMark className="pointer-events-none absolute -right-24 top-0 -z-10 hidden h-[460px] w-[460px] opacity-30 md:block" />
      <div className="mx-auto max-w-3xl">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.3em] text-[#D6B25E]"><Compass className="h-4 w-4" />{t.code}</p>
        <h1 className="mt-5 font-serif text-5xl leading-tight md:text-6xl">{t.title}</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">{t.text}</p>
        <div className="mt-8 flex flex-wrap gap-3">{t.links.map(([label, href]) => <Link key={href} href={href} className="inline-flex min-h-11 items-center rounded-full border border-[#D6B25E]/40 px-5 text-sm font-semibold text-[#F0D893] transition hover:border-[#D6B25E] hover:bg-[#D6B25E]/10">{label}</Link>)}</div>
        <Link href="/" className="mt-10 inline-flex min-h-12 items-center rounded-full bg-[#D6B25E] px-7 text-sm font-bold text-[#120D05]">{t.home}<ArrowRight className="ml-2 h-4 w-4" /></Link>
      </div>
    </section>
    <SiteFooter />
  </main>;
}
