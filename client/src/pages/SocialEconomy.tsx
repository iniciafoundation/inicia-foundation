import { Handshake, Recycle, Store } from "lucide-react";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { PageHero } from "@/components/PageHero";
import { ProgramForm } from "@/components/ProgramForm";
import { ShareBlock } from "@/components/Share";
import { SiteFooter } from "@/components/SiteFooter";
import { ECONOMIA } from "@/lib/programForms";
import { SITE_URL } from "@/lib/participation";

/** Economía social: initiatives being prepared. Spanish only. Nothing is presented as already open. */
const INITIATIVES = [
  { Icon: Handshake, title: "Cooperativa de trabajo", text: "Una empresa de las propias personas que trabajan en ella, donde cada socio y socia participa en las decisiones. Queremos que nazca de la mano de quienes pasan por nuestros programas." },
  { Icon: Recycle, title: "Empresa de inserción", text: "Una empresa que contrata a personas en situación o riesgo de exclusión y las acompaña durante un tiempo, para que puedan dar el salto a un empleo ordinario con experiencia y confianza." },
  { Icon: Store, title: "Tiendas de segunda mano", text: "Tiendas solidarias donde los objetos donados tienen una segunda vida. Crean puestos de trabajo, reducen residuos y sus ingresos se destinan a los programas de Inicia Foundation." },
];

export default function SocialEconomy() {
  return <main lang="es" className="min-h-screen bg-[#060A12] text-[#EEE7D7]"><OriginalSiteNavigation dark />
    <PageHero photo="team" alt="Equipo trabajando junto" eyebrow="Economía social" title="Trabajo con sentido," accent="hecho entre todos." intro="Estamos creando nuevas iniciativas para que más personas tengan un trabajo estable y para que Inicia Foundation pueda sostener sus programas con recursos propios. Si quieres formar parte desde el principio, este es el momento.">
      <a href="#sumate" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-[#D6B25E] px-6 text-sm font-bold text-[#120D05]">Quiero sumarme</a>
    </PageHero>

    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="grid gap-5 md:grid-cols-3">{INITIATIVES.map(({ Icon, title, text }) => <article key={title} className="flex flex-col rounded-3xl bg-[#0C1320] p-7 ring-1 ring-[#D6B25E]/20"><Icon className="h-8 w-8 text-[#D6B25E]" /><h2 className="mt-5 font-serif text-3xl">{title}</h2><p className="mt-3 flex-1 leading-7 text-slate-300">{text}</p><p className="mt-5 w-fit rounded-full bg-[#D6B25E]/15 px-3 py-1 text-xs font-bold uppercase tracking-[.14em] text-[#F0D893]">En preparación</p></article>)}</div>
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div><h2 className="font-serif text-4xl">Por qué la economía social</h2><p className="mt-5 leading-8 text-slate-300">Las ayudas puntuales resuelven lo urgente, pero no bastan para cambiar una vida. Un trabajo digno, en un entorno que acompaña, sí puede hacerlo. La economía social une las dos cosas: crea empleo real y pone a las personas en el centro.</p><p className="mt-4 leading-8 text-slate-300">Además, los ingresos de estas iniciativas permitirán que nuestros programas dependan menos de las subvenciones y lleguen a más gente.</p></div>
        <div className="rounded-3xl bg-[#0A1424] p-7"><h2 className="font-serif text-3xl">Cómo puedes participar</h2><ul className="mt-5 space-y-3 leading-7 text-slate-200">{["Trabajando en alguna de las iniciativas cuando abran.", "Como socio o socia de la futura cooperativa.", "Como voluntario o voluntaria en las tiendas.", "Donando objetos en buen estado para las tiendas.", "Como empresa o entidad: espacios, contratos, asesoramiento o difusión."].map(line => <li key={line} className="flex gap-3"><span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#D6B25E]" />{line}</li>)}</ul></div>
      </div>
      <p className="mt-8 text-sm leading-6 text-slate-400">Estas iniciativas están en fase de preparación. Contaremos aquí cada paso: cuándo se constituyen, dónde abren y cómo participar.</p>
    </section>

    <section id="sumate" className="scroll-mt-24 bg-[#0A1424] px-5 py-16"><div className="mx-auto max-w-4xl"><h2 className="font-serif text-4xl md:text-5xl">Súmate desde el principio</h2><p className="mt-4 leading-7 text-slate-300">Cuéntanos qué te interesa. Estudiaremos tu solicitud y te escribiremos cuando encaje con alguna de las iniciativas.</p><div className="mt-6"><ProgramForm config={ECONOMIA} project="Economía social" /></div></div></section>

    <section className="mx-auto max-w-6xl px-5 py-16"><ShareBlock compact url={`${SITE_URL}/economia-social`} text="Inicia Foundation está creando una cooperativa, una empresa de inserción y tiendas de segunda mano en Asturias. Puedes sumarte desde el principio 👉" tag="economia" /></section>
    <SiteFooter />
  </main>;
}
