import { useState } from "react";
import { BookOpen, Building2, GraduationCap } from "lucide-react";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { PageHero } from "@/components/PageHero";
import { ProgramForm } from "@/components/ProgramForm";
import { ShareBlock } from "@/components/Share";
import { SiteFooter } from "@/components/SiteFooter";
import { APRENDER, COLABORA_LAB, ENSENAR } from "@/lib/programForms";
import { SITE_URL } from "@/lib/participation";

/** Laboratorio de Innovación Social. Spanish only (decision of the association). The methodology is not described on purpose. */
const WHAT = [
  "Ayudamos a cada persona a reconocer lo que ya sabe hacer y a convertirlo en una oportunidad real.",
  "Acompañamos el aprendizaje de competencias que hoy pide el mercado, con especial atención a lo digital.",
  "Trabajamos la confianza, la comunicación y la convivencia, porque un empleo se mantiene también gracias a ellas.",
  "Conectamos a quienes quieren aprender con profesionales que quieren enseñar.",
  "Exploramos con los participantes nuevas formas de generar ingresos: empleo, autoempleo y proyectos colectivos.",
];
const WHO = ["Personas en desempleo, especialmente de larga duración.", "Mayores de 45 años que quieren reincorporarse o reinventarse.", "Jóvenes que buscan su primera oportunidad o un nuevo rumbo.", "Cualquier persona con experiencia o habilidades que quiera seguir creciendo."];
const GAIN = [
  ["Si quieres aprender", "Acompañamiento cercano, nuevas competencias, una red de contactos y apoyo para dar el siguiente paso, sea un empleo o un proyecto propio."],
  ["Si quieres enseñar", "La oportunidad de transmitir tu experiencia, cambiar la trayectoria de otra persona y formar parte de una comunidad que crece contigo. Tú decides cuánto tiempo dedicas."],
  ["Si eres empresa o entidad", "Acceso a personas motivadas y preparadas, la posibilidad de proponer retos reales y una forma concreta de generar impacto social en tu entorno."],
];
const TABS = [
  { key: "aprender", label: "Quiero aprender", Icon: GraduationCap, config: APRENDER, intro: "Cuéntanos quién eres y hacia dónde quieres ir." },
  { key: "ensenar", label: "Quiero enseñar", Icon: BookOpen, config: ENSENAR, intro: "Tu experiencia puede cambiar la trayectoria de otra persona." },
  { key: "colaborar", label: "Quiero colaborar", Icon: Building2, config: COLABORA_LAB, intro: "Para empresas, entidades y profesionales que quieren abrir puertas a los participantes." },
] as const;

export default function Laboratory() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>(() => {
    const value = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("formulario") : null;
    return TABS.some(item => item.key === value) ? (value as (typeof TABS)[number]["key"]) : "aprender";
  });
  const active = TABS.find(item => item.key === tab) ?? TABS[0];
  const open = (key: typeof tab) => { setTab(key); document.getElementById("unete")?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return <main lang="es" className="min-h-screen bg-[#060A12] text-[#EEE7D7]"><OriginalSiteNavigation dark />
    <PageHero photo="learning" alt="Personas aprendiendo juntas en un taller" eyebrow="Laboratorio de Innovación Social" title="Nuevos caminos" accent="hacia el empleo." intro="Tu experiencia vale. Tus ganas de aprender, también. Creamos caminos nuevos hacia el trabajo y la autonomía económica, junto a personas que quieren compartir lo que saben.">
      <div className="mt-8 flex flex-wrap gap-3">{TABS.map(({ key, label, Icon }, i) => <button key={key} type="button" onClick={() => open(key)} className={`inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-sm font-bold ${i === 0 ? "bg-[#D6B25E] text-[#120D05]" : "border border-white/40 text-white hover:bg-white/10"}`}><Icon className="h-4 w-4" />{label}</button>)}</div>
    </PageHero>

    <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2">
      <div><h2 className="font-serif text-4xl">Por qué existe este laboratorio</h2><p className="mt-5 leading-8 text-slate-300">En Asturias conviven dos realidades. Muchas personas con experiencia, oficio y ganas llevan demasiado tiempo sin encontrar su sitio en el mercado laboral. Al mismo tiempo, surgen necesidades y oportunidades nuevas que nadie está cubriendo.</p><p className="mt-4 leading-8 text-slate-300">Creemos que el problema no está en las personas, sino en los caminos que se les ofrecen. Por eso hemos creado un laboratorio: un espacio para diseñar, probar y mejorar formas nuevas de llegar al empleo.</p></div>
      <div className="rounded-3xl bg-[#0C1320] p-7 ring-1 ring-[#D6B25E]/20"><h2 className="font-serif text-3xl">Qué hacemos</h2><ul className="mt-5 space-y-3">{WHAT.map(line => <li key={line} className="flex gap-3 leading-7 text-slate-200"><span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#D6B25E]" />{line}</li>)}</ul></div>
    </section>

    <section className="mx-auto max-w-6xl px-5 pb-16"><div className="grid gap-5 md:grid-cols-[.8fr_1.2fr]">
      <div className="rounded-3xl bg-[#0A1424] p-7"><h2 className="font-serif text-3xl">Para quién es</h2><ul className="mt-5 space-y-3">{WHO.map(line => <li key={line} className="flex gap-3 leading-7 text-slate-200"><span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#D6B25E]" />{line}</li>)}</ul></div>
      <div className="grid gap-4">{GAIN.map(([title, text]) => <article key={title} className="rounded-3xl bg-[#0C1320] p-6 ring-1 ring-[#D6B25E]/15"><h3 className="font-serif text-2xl text-[#F0D893]">{title}</h3><p className="mt-2 leading-7 text-slate-300">{text}</p></article>)}</div>
    </div></section>

    <section id="unete" className="scroll-mt-24 bg-[#0A1424] px-5 py-16"><div className="mx-auto max-w-4xl">
      <h2 className="font-serif text-4xl md:text-5xl">Únete al laboratorio</h2>
      <p className="mt-4 leading-7 text-slate-300">Rellena el formulario de tu perfil. Son unos minutos. Estudiamos cada solicitud y te escribimos cuando encaje con alguna actividad o necesidad del programa.</p>
      <div role="tablist" className="mt-8 grid gap-2 sm:grid-cols-3">{TABS.map(({ key, label, Icon }) => <button key={key} role="tab" type="button" aria-selected={tab === key} onClick={() => setTab(key)} className={`flex min-h-12 items-center justify-center gap-2 rounded-full text-sm font-bold transition ${tab === key ? "bg-[#D6B25E] text-[#120D05]" : "bg-[#060A12] text-[#EEE7D7] hover:bg-[#1A2436]"}`}><Icon className="h-4 w-4" />{label}</button>)}</div>
      <p className="mt-6 text-slate-300">{active.intro}</p>
      <div className="mt-5" role="tabpanel"><ProgramForm key={active.key} config={active.config} project="Laboratorio de Innovación Social" /></div>
    </div></section>

    <section className="mx-auto max-w-6xl px-5 py-16"><h2 className="font-serif text-4xl">Hacia dónde vamos</h2><p className="mt-5 max-w-3xl leading-8 text-slate-300">Queremos que el laboratorio sea un punto de encuentro estable en Asturias, donde aprender, enseñar y emprender se refuercen entre sí. Nuestro objetivo es que de aquí nazcan empleos, iniciativas de autoempleo y proyectos colectivos que den estabilidad a quienes participan.</p><p className="mt-4 text-sm text-slate-400">Estado: en desarrollo. Ámbito: Asturias, con base en Gijón.</p>
      <div className="mt-10"><ShareBlock compact url={`${SITE_URL}/laboratorio`} text="Conoce el Laboratorio de Innovación Social de Inicia Foundation: nuevos caminos hacia el empleo en Asturias. Puedes aprender, enseñar o colaborar 👉" tag="laboratorio" /></div>
    </section>
    <SiteFooter />
  </main>;
}
