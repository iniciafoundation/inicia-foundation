import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useSettings } from "@/lib/content";
import { useT } from "@/lib/i18n";
import { getConsent, loadAnalytics, setConsent } from "@/lib/analytics";

const copy = {
  es: { text: "Usamos cookies de análisis y medición de Google solo si las aceptas, para saber qué funciona y mejorar el sitio.", accept: "Aceptar", reject: "Rechazar", more: "Política de cookies" },
  en: { text: "We use Google analytics and measurement cookies only if you accept, to learn what works and improve the site.", accept: "Accept", reject: "Reject", more: "Cookie policy" },
  ru: { text: "Мы используем аналитические cookie Google только с вашего согласия — чтобы понимать, что работает, и улучшать сайт.", accept: "Принять", reject: "Отклонить", more: "Политика cookie" },
  uk: { text: "Ми використовуємо аналітичні cookie Google лише з вашої згоди — щоб розуміти, що працює, і покращувати сайт.", accept: "Прийняти", reject: "Відхилити", more: "Політика cookie" },
};

/** Cookie consent: appears only when analytics is configured (sheet "Ajustes"); loads Google tags after "Accept". */
export function ConsentBanner() {
  const t = useT(copy);
  const { ga4, adsConversion } = useSettings();
  const enabled = Boolean(ga4 || adsConversion);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (getConsent() === "granted") loadAnalytics(ga4, adsConversion);
    else if (getConsent() === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener("inicia-consent-open", reopen);
    return () => window.removeEventListener("inicia-consent-open", reopen);
  }, [enabled, ga4, adsConversion]);

  if (!enabled || !open) return null;
  const choose = (value: "granted" | "denied") => { setConsent(value); setOpen(false); if (value === "granted") loadAnalytics(ga4, adsConversion); else if (getConsent() === "denied" && window.gtag) window.location.reload(); };
  return <div role="dialog" aria-live="polite" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-[#D6B25E]/40 bg-[#08101E] p-5 text-white shadow-2xl sm:flex sm:items-center sm:gap-5">
    <p className="text-sm leading-6 text-slate-200">{t.text} <Link href="/cookies" className="underline decoration-[#D6B25E] underline-offset-4">{t.more}</Link></p>
    <div className="mt-4 flex shrink-0 gap-2 sm:mt-0"><button type="button" onClick={() => choose("denied")} className="min-h-11 rounded-full border border-white/30 px-5 text-sm font-bold">{t.reject}</button><button type="button" onClick={() => choose("granted")} className="min-h-11 rounded-full bg-[#D6B25E] px-5 text-sm font-bold text-[#120D05]">{t.accept}</button></div>
  </div>;
}
