import { HandHeart, HeartHandshake } from "lucide-react";
import { Link, useLocation } from "wouter";
import { type Locale, useT } from "@/lib/i18n";

const copy: Record<Locale, { donate: string; help: string }> = {
  es: { donate: "Donar", help: "Colaborar" },
  en: { donate: "Donate", help: "Get involved" },
  ru: { donate: "Пожертвовать", help: "Участвовать" },
  uk: { donate: "Пожертвувати", help: "Долучитися" },
  ast: { donate: "Donar", help: "Collaborar" },
};

export const showsMobileBar = (location: string) => !["/donar", "/contacto", "/admin", "/login"].some(prefix => location.startsWith(prefix));

/** Always-visible actions on phones (hidden where the page itself is the form). */
export function MobileActionBar() {
  const t = useT(copy);
  const [location] = useLocation();
  if (!showsMobileBar(location)) return null;
  return <><div aria-hidden className="h-20 md:hidden" /><div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#D6B25E]/25 bg-[#060A12]/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur md:hidden">
    <div className="mx-auto flex max-w-md gap-2">
      <Link href="/donar" className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#D6B25E] text-sm font-bold text-[#120D05]"><HandHeart className="h-4 w-4" />{t.donate}</Link>
      <Link href="/colaborar" className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[#D6B25E]/60 text-sm font-bold text-[#F0D893]"><HeartHandshake className="h-4 w-4" />{t.help}</Link>
    </div>
  </div></>;
}
