import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { RequestForm } from "@/components/RequestForm";
import { SocialLinks } from "@/components/SocialLinks";
import { SpiralMark } from "@/components/SpiralMark";
import { useT } from "@/lib/i18n";
import { isRequestType } from "@/lib/requests";
import { CONTACT } from "@/lib/siteConfig";

const copy = {
  es: { eyebrow: "Contacto", title: "Estamos para", accent: "escucharte.", intro: "Elige qué necesitas y te guiamos paso a paso. Respondemos a cada solicitud de forma individual.", direct: "Contacto directo", whatsapp: "Escribir por WhatsApp", places: "Dónde atendemos", gijon: "Av. Manuel Llaneza, 68 · 33208 Gijón", others: "Avilés, Oviedo, Madrid, Barcelona y Valencia: con cita previa.", follow: "Síguenos", disclaimer: "INICIA no presta representación jurídica, no sustituye a organismos públicos ni ofrece diagnóstico médico." },
  en: { eyebrow: "Contact", title: "We are here", accent: "to listen.", intro: "Choose what you need and we will guide you step by step. Every request is reviewed individually.", direct: "Direct contact", whatsapp: "Write on WhatsApp", places: "Where we work", gijon: "Av. Manuel Llaneza, 68 · 33208 Gijón, Spain", others: "Avilés, Oviedo, Madrid, Barcelona and Valencia: by appointment.", follow: "Follow us", disclaimer: "INICIA does not provide legal representation, does not replace public services and does not give medical diagnosis." },
  ru: { eyebrow: "Контакты", title: "Мы рядом, чтобы", accent: "выслушать.", intro: "Выберите, что вам нужно, и мы проведём вас шаг за шагом. Каждую заявку рассматриваем индивидуально.", direct: "Связаться напрямую", whatsapp: "Написать в WhatsApp", places: "Где мы принимаем", gijon: "Av. Manuel Llaneza, 68 · 33208 Хихон", others: "Авилес, Овьедо, Мадрид, Барселона и Валенсия — по предварительной записи.", follow: "Мы в соцсетях", disclaimer: "INICIA не оказывает юридического представительства, не заменяет государственные службы и не ставит медицинских диагнозов." },
  uk: { eyebrow: "Контакти", title: "Ми поруч, щоб", accent: "вислухати.", intro: "Оберіть, що вам потрібно, і ми проведемо вас крок за кроком. Кожну заявку розглядаємо індивідуально.", direct: "Зв’язатися напряму", whatsapp: "Написати у WhatsApp", places: "Де ми приймаємо", gijon: "Av. Manuel Llaneza, 68 · 33208 Хіхон", others: "Авілес, Ов’єдо, Мадрид, Барселона та Валенсія — за попереднім записом.", follow: "Ми в соцмережах", disclaimer: "INICIA не надає юридичного представництва, не замінює державні служби та не ставить медичних діагнозів." },
  ast: { eyebrow: "Contactu", title: "Tamos equí pa", accent: "escuchate.", intro: "Escueyi lo que precises y guiámoste pasu ente pasu. Respondemos a cada solicitú de forma individual.", direct: "Contactu direutu", whatsapp: "Escribir per WhatsApp", places: "Ónde atendemos", gijon: "Av. Manuel Llaneza, 68 · 33208 Gijón", others: "Avilés, Uviéu, Madrid, Barcelona y Valencia: con cita previa.", follow: "Síguinos", disclaimer: "INICIA nun presta representación xurídica, nun sustitúi a organismos públicos nin ufre diagnósticu médicu." },
};

export default function Contact() {
  const t = useT(copy);
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const tipo = params.get("tipo");
  const proyecto = params.get("proyecto") ?? undefined;

  return <main className="min-h-screen bg-[#060A12] text-[#EEE7D7]">
    <OriginalSiteNavigation dark />
    <section className="relative isolate overflow-hidden bg-[#060A12] bg-[#08101E] px-5 pb-32 pt-16 text-white"><img src="/assets/photos/community-1920.webp" srcSet="/assets/photos/community-960.webp 960w, /assets/photos/community-1920.webp 1920w" sizes="100vw" alt="" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#060A12] via-[#060A12]/80 to-[#060A12]/25" /><div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#060A12] to-transparent" />
      <SpiralMark className="pointer-events-none absolute -right-24 -top-10 -z-10 hidden h-[420px] w-[420px] opacity-40 md:block" />
      <div className="relative mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#D6B25E]">{t.eyebrow}</p><h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.02] md:text-6xl">{t.title} <span className="italic text-[#F0D893]">{t.accent}</span></h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">{t.intro}</p></div>
    </section>
    <section className="relative z-10 mx-auto -mt-20 grid max-w-6xl gap-8 px-5 pb-20 lg:grid-cols-[1.35fr_.65fr]">
      <div className="relative"><RequestForm initialType={isRequestType(tipo) ? tipo : undefined} project={proyecto} /></div>
      <aside className="space-y-5 lg:pt-0">
        <div className="rounded-3xl bg-[#0A1424] p-6 text-white shadow-sm ring-1 ring-[#D6B25E]/25"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#D6B25E]">{t.direct}</p>
          <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#D6B25E] px-4 text-sm font-bold text-[#120D05]"><MessageCircle className="h-4 w-4" />{t.whatsapp}</a>
          <a href={CONTACT.phoneHref} className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-4 text-sm font-bold"><Phone className="h-4 w-4 text-[#D6B25E]" />{CONTACT.phone}</a>
          <a href={`mailto:${CONTACT.email}`} className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-4 text-sm font-bold"><Mail className="h-4 w-4 text-[#D6B25E]" />{CONTACT.email}</a>
        </div>
        <div className="rounded-3xl bg-[#0C1320] p-6 shadow-sm ring-1 ring-[#D6B25E]/20"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#D6B25E]">{t.places}</p><p className="mt-4 flex gap-2 text-sm leading-6"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D6B25E]" /><a className="underline decoration-[#D6B25E] underline-offset-4" href="https://maps.app.goo.gl/kqzE7HTLe2PHM5BJ8" target="_blank" rel="noreferrer">{t.gijon}</a></p><p className="mt-3 text-sm leading-6 text-slate-300">{t.others}</p></div>
        <div className="rounded-3xl bg-[#0C1320] p-6 shadow-sm ring-1 ring-[#D6B25E]/20"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#D6B25E]">{t.follow}</p><div className="mt-4"><SocialLinks /></div></div>
        <p className="px-2 text-xs leading-5 text-slate-400">{t.disclaimer}</p>
      </aside>
    </section>
  </main>;
}
