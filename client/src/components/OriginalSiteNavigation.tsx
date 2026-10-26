import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { publicAssets } from "@/lib/publicAssets";
import { LOCALES, type Locale, useLocale } from "@/lib/i18n";
import { useSettings } from "@/lib/content";
const HORIZONTAL_LOGO = publicAssets.horizontalLogo;
const MARK_LOGO = publicAssets.markLogo;

const copy: Record<Locale, { items: readonly [string, string][]; donate: string; open: string; close: string; place: string }> = {
  es: { items: [["Quiénes somos", "/#quienes-somos"], ["Proyectos", "/proyectos"], ["Misión", "/mision"], ["Ideología", "/ideologia"], ["Alianzas", "/alianzas"], ["Noticias", "/noticias"], ["Colaborar", "/colaborar"], ["Contacto", "/contacto"]], donate: "Donar", open: "Abrir menú", close: "Cerrar menú", place: "INICIA Foundation · Asturias, España" },
  en: { items: [["About us", "/#quienes-somos"], ["Projects", "/proyectos"], ["Mission", "/mision"], ["Ideology", "/ideologia"], ["Partners", "/alianzas"], ["News", "/noticias"], ["Get involved", "/colaborar"], ["Contact", "/contacto"]], donate: "Donate", open: "Open menu", close: "Close menu", place: "INICIA Foundation · Asturias, Spain" },
  ru: { items: [["О нас", "/#quienes-somos"], ["Проекты", "/proyectos"], ["Миссия", "/mision"], ["Идеология", "/ideologia"], ["Партнёры", "/alianzas"], ["Новости", "/noticias"], ["Участвовать", "/colaborar"], ["Контакты", "/contacto"]], donate: "Поддержать", open: "Открыть меню", close: "Закрыть меню", place: "INICIA Foundation · Астурия, Испания" },
  uk: { items: [["Про нас", "/#quienes-somos"], ["Проєкти", "/proyectos"], ["Місія", "/mision"], ["Ідеологія", "/ideologia"], ["Партнери", "/alianzas"], ["Новини", "/noticias"], ["Долучитися", "/colaborar"], ["Контакти", "/contacto"]], donate: "Підтримати", open: "Відкрити меню", close: "Закрити меню", place: "INICIA Foundation · Астурія, Іспанія" },
  ast: { items: [["Quiénes somos", "/#quienes-somos"], ["Proyectos", "/proyectos"], ["Misión", "/mision"], ["Ideoloxía", "/ideologia"], ["Alianzes", "/alianzas"], ["Noticies", "/noticias"], ["Collaborar", "/colaborar"], ["Contactu", "/contacto"]], donate: "Donar", open: "Abrir menú", close: "Zarrar menú", place: "INICIA Foundation · Asturies, España" },
};

function BrandLogo({ compact = false }: { compact?: boolean }) {
  return <>
    <img src={HORIZONTAL_LOGO} srcSet={`/assets/inicia/inicia-foundation-horizontal-logo-320.webp 320w, ${HORIZONTAL_LOGO} 640w`} sizes="256px" width={256} height={114} alt="INICIA Foundation" className={`hidden object-contain object-left ${compact ? "h-12 w-48 sm:block" : "h-16 w-64 sm:block"}`} />
    <img src={MARK_LOGO} alt="INICIA Foundation" className={`block rounded-full object-cover sm:hidden ${compact ? "h-12 w-12" : "h-12 w-12"}`} />
  </>;
}

export function OriginalSiteNavigation({ dark = false, locale: localeProp, onLocaleChange }: { dark?: boolean; locale?: Locale; onLocaleChange?: (locale: Locale) => void }) {
  const [open, setOpen] = useState(false);
  const [globalLocale, setGlobalLocale] = useLocale();
  const locale = localeProp ?? globalLocale;
  const chooseLocale = (next: Locale) => { setGlobalLocale(next); onLocaleChange?.(next); };
  const text = "text-[#EEE7D7]";
  const border = "border-[#D6B25E]/15";
  const strings = copy[locale];

  const { banner } = useSettings();
  return <div className="sticky top-0 z-40">
    {banner && <div className="bg-[#D6B25E] px-4 py-2 text-center text-xs font-bold text-[#120D05]">{banner}</div>}
    <div className={`flex min-h-10 items-center justify-end gap-0.5 px-3 text-[10px] font-bold tracking-[.16em] bg-[#04070D] text-[#EEE7D7]`}>
      {LOCALES.map(language => <button key={language} type="button" onClick={() => chooseLocale(language)} aria-pressed={locale === language} className={`min-h-9 min-w-9 rounded px-1.5 py-1 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6B25E] ${locale === language ? "bg-[#D6B25E] text-[#120D05]" : "opacity-65 hover:opacity-100"}`}>{language.toUpperCase()}</button>)}
    </div>
    <header className={`border-b ${border} bg-[#060A12]/85 backdrop-blur-md`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-5 sm:py-3">
        <Link href="/" className="shrink-0" aria-label="INICIA Foundation"><BrandLogo /></Link>
        <div className="flex items-center gap-3">
          <nav className={`hidden items-center gap-4 text-[13px] font-medium xl:flex ${text}`}>
            {strings.items.map(([label, href]) => <a key={href} href={href} className="transition hover:text-[#F0D893]">{label}</a>)}
            <a href="/donar" className="rounded-full bg-[#D6B25E] px-4 py-2 font-bold text-[#120D05] shadow-[0_6px_18px_rgba(214,178,94,.25)] transition hover:bg-[#F0D893]">{strings.donate}</a>
          </nav>
          <a href="/donar" className="inline-flex min-h-11 items-center rounded-full bg-[#D6B25E] px-4 py-2 text-xs font-bold text-[#120D05] shadow-[0_6px_18px_rgba(214,178,94,.25)] xl:hidden">{strings.donate}</a>
          <button className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6B25E] xl:hidden ${text}`} onClick={() => setOpen(true)} aria-label={strings.open}><Menu className="h-7 w-7" /></button>
        </div>
      </div>
    </header>
    {open && <div className="fixed inset-0 z-50 bg-[#08101E] p-6 text-white">
      <div className="flex items-center justify-between">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)} aria-label="INICIA Foundation"><BrandLogo compact /></Link>
        <button className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6B25E]" onClick={() => setOpen(false)} aria-label={strings.close}><X className="h-7 w-7" /></button>
      </div>
      <nav className="mt-14 flex flex-col gap-6 text-3xl font-serif">{strings.items.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}<a href="/donar" onClick={() => setOpen(false)} className="mt-3 inline-flex w-fit rounded-full bg-[#D6B25E] px-5 py-3 text-lg font-bold text-[#120D05]">{strings.donate}</a></nav>
      <p className="absolute bottom-8 text-xs text-slate-300">{strings.place}</p>
    </div>}
  </div>;
}
