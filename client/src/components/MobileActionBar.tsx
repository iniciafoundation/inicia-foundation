import { HandHeart, HeartHandshake, UsersRound } from "lucide-react";
import { Link, useLocation } from "wouter";
import { type Locale, useT } from "@/lib/i18n";

const copy: Record<Locale, { donate: string; donateProject: string; member: string; volunteer: string; label: string }> = {
  es: { donate: "Donar", donateProject: "Donar al proyecto", member: "Hazte socio/a", volunteer: "Voluntariado", label: "Apoya a Inicia" },
  en: { donate: "Donate", donateProject: "Donate to this project", member: "Become a member", volunteer: "Volunteer", label: "Support Inicia" },
  ru: { donate: "Пожертвовать", donateProject: "На этот проект", member: "Стать членом", volunteer: "Волонтёрство", label: "Поддержать Inicia" },
  uk: { donate: "Пожертвувати", donateProject: "На цей проєкт", member: "Стати членом", volunteer: "Волонтерство", label: "Підтримати Inicia" },
  ast: { donate: "Donar", donateProject: "Donar al proyeutu", member: "Faite sociu/a", volunteer: "Voluntariáu", label: "Sofita a Inicia" },
};

/** Pages where the page itself is the form: the bar would only repeat it. */
export const showsMobileBar = (location: string) => !["/donar", "/contacto", "/admin", "/login"].some(prefix => location.startsWith(prefix));

const projectSlug = (location: string) => location.match(/^\/proyectos\/([a-z0-9-]+)\/?$/)?.[1];

/** Always-visible actions on every screen: a bottom bar on phones and tablets, a compact panel on computers. */
export function MobileActionBar() {
  const t = useT(copy);
  const [location] = useLocation();
  if (!showsMobileBar(location)) return null;
  const slug = projectSlug(location);
  const donateHref = slug ? `/donar?proyecto=${slug}` : "/donar";
  const links = [
    { href: donateHref, label: slug ? t.donateProject : t.donate, short: t.donate, Icon: HeartHandshake, main: true },
    { href: "/contacto?tipo=donar&modo=socio", label: t.member, short: t.member, Icon: UsersRound, main: false },
    { href: "/contacto?tipo=voluntariado", label: t.volunteer, short: t.volunteer, Icon: HandHeart, main: false },
  ];
  const cls = (main: boolean) => main ? "bg-[#D6B25E] text-[#120D05] hover:bg-[#F0D893]" : "border border-[#D6B25E]/60 text-[#F0D893] hover:bg-[#D6B25E]/10";
  return <>
    <div aria-hidden className="h-20 lg:hidden" />
    <nav aria-label={t.label} className="fixed inset-x-0 bottom-0 z-30 border-t border-[#D6B25E]/25 bg-[#060A12]/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-md gap-1.5">{links.map(({ href, short, Icon, main }) => <Link key={href} href={href} className={`flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-full px-2 text-[13px] font-bold leading-tight ${cls(main)}`}><Icon className="h-4 w-4 shrink-0" />{short}</Link>)}</div>
    </nav>
    <nav aria-label={t.label} className="fixed bottom-4 left-4 z-30 hidden items-center gap-2 rounded-full border border-[#D6B25E]/30 bg-[#060A12]/90 p-1.5 shadow-2xl backdrop-blur lg:flex">
      {links.map(({ href, label, Icon, main }) => <Link key={href} href={href} className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-bold transition ${cls(main)}`}><Icon className="h-4 w-4" />{label}</Link>)}
    </nav>
  </>;
}
