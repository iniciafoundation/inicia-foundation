import { Link } from "wouter";
import { SocialLinks } from "@/components/SocialLinks";
import { useT } from "@/lib/i18n";
import { publicAssets } from "@/lib/publicAssets";
import { CONTACT } from "@/lib/siteConfig";
import { openConsentSettings } from "@/lib/analytics";

const copy = {
  es: { privacy: "Privacidad", cookies: "Cookies", cookieSettings: "Configurar cookies", about: "Entidad sin ánimo de lucro con sede en Asturias.", org: "Organización", help: "Participa", links: [["Quiénes somos", "/#quienes-somos"], ["Misión y fines", "/mision"], ["Ideología", "/ideologia"], ["Proyectos", "/proyectos"], ["Alianzas", "/alianzas"], ["Noticias", "/noticias"]], help2: [["Necesito ayuda", "/contacto?tipo=ayuda"], ["Voluntariado", "/contacto?tipo=voluntariado"], ["Donar", "/donar"], ["Organizaciones", "/contacto?tipo=organizacion"], ["Contacto", "/contacto"]], rights: "Todos los derechos reservados.", legal: "Aviso e identidad" },
  en: { privacy: "Privacy", cookies: "Cookies", cookieSettings: "Cookie settings", about: "Non-profit organisation based in Asturias, Spain.", org: "Organisation", help: "Get involved", links: [["About us", "/#quienes-somos"], ["Mission", "/mision"], ["Ideology", "/ideologia"], ["Projects", "/proyectos"], ["Partners", "/alianzas"], ["News", "/noticias"]], help2: [["I need help", "/contacto?tipo=ayuda"], ["Volunteering", "/contacto?tipo=voluntariado"], ["Donate", "/donar"], ["Organisations", "/contacto?tipo=organizacion"], ["Contact", "/contacto"]], rights: "All rights reserved.", legal: "Legal notice" },
  ru: { privacy: "Конфиденциальность", cookies: "Cookie", cookieSettings: "Настройки cookie", about: "Некоммерческая организация, Астурия, Испания.", org: "Организация", help: "Участвовать", links: [["О нас", "/#quienes-somos"], ["Миссия", "/mision"], ["Идеология", "/ideologia"], ["Проекты", "/proyectos"], ["Партнёры", "/alianzas"], ["Новости", "/noticias"]], help2: [["Мне нужна помощь", "/contacto?tipo=ayuda"], ["Волонтёрство", "/contacto?tipo=voluntariado"], ["Поддержать", "/donar"], ["Организациям", "/contacto?tipo=organizacion"], ["Контакты", "/contacto"]], rights: "Все права защищены.", legal: "Правовая информация" },
  uk: { privacy: "Конфіденційність", cookies: "Cookie", cookieSettings: "Налаштування cookie", about: "Неприбуткова організація, Астурія, Іспанія.", org: "Організація", help: "Долучитися", links: [["Про нас", "/#quienes-somos"], ["Місія", "/mision"], ["Ідеологія", "/ideologia"], ["Проєкти", "/proyectos"], ["Партнери", "/alianzas"], ["Новини", "/noticias"]], help2: [["Мені потрібна допомога", "/contacto?tipo=ayuda"], ["Волонтерство", "/contacto?tipo=voluntariado"], ["Підтримати", "/donar"], ["Організаціям", "/contacto?tipo=organizacion"], ["Контакти", "/contacto"]], rights: "Усі права захищено.", legal: "Правова інформація" },
};

export function SiteFooter() {
  const t = useT(copy);
  return <footer className="border-t border-[#D6B25E]/25 bg-[#081629] py-12 text-slate-200">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-4">
      <div className="md:col-span-2"><img src={publicAssets.horizontalLogo} alt="INICIA Foundation" className="h-20 w-80 object-contain object-left" loading="lazy" /><p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">{t.about}</p><p className="mt-3 text-sm"><a className="hover:text-[#F0D893]" href={CONTACT.phoneHref}>{CONTACT.phone}</a> · <a className="hover:text-[#F0D893]" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p><div className="mt-5"><SocialLinks light /></div></div>
      <div><p className="font-bold text-[#D6B25E]">{t.org}</p>{t.links.map(([label, href]) => <a key={href} className="mt-2.5 block text-sm hover:text-[#F0D893]" href={href}>{label}</a>)}</div>
      <div><p className="font-bold text-[#D6B25E]">{t.help}</p>{t.help2.map(([label, href]) => <Link key={href} className="mt-2.5 block text-sm hover:text-[#F0D893]" href={href}>{label}</Link>)}</div>
    </div>
    <div className="mx-auto mt-10 max-w-7xl border-t border-white/15 px-5 pt-5 text-xs leading-6 text-slate-400">
      <p>Asociación Inicia Foundation · NIF G05426242 · Registro de Asociaciones del Principado de Asturias nº 13148 · Av. Manuel Llaneza, 68, 33208 Gijón (Asturias), España</p>
      <div className="mt-2 flex flex-wrap justify-between gap-3"><span>© {new Date().getFullYear()} Inicia Foundation. {t.rights}</span><span className="flex flex-wrap gap-x-4 gap-y-1"><Link href="/aviso-legal" className="hover:text-[#F0D893]">{t.legal}</Link><Link href="/privacidad" className="hover:text-[#F0D893]">{t.privacy}</Link><Link href="/cookies" className="hover:text-[#F0D893]">{t.cookies}</Link><button type="button" onClick={openConsentSettings} className="hover:text-[#F0D893]">{t.cookieSettings}</button><Link href="/identidad" className="hover:text-[#F0D893]">NIF / Registro</Link></span></div>
    </div>
  </footer>;
}
