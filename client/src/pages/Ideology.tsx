import { ArrowRight, HandHeart, Scale, Sprout, Users } from "lucide-react";
import { Link } from "wouter";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";

const principles = [
  { title: "Dignidad y solidaridad", Icon: HandHeart, text: "Las personas, sus derechos y su participación activa están en el centro de la acción social y comunitaria." },
  { title: "Justicia e inclusión", Icon: Scale, text: "La organización orienta sus iniciativas a reducir barreras, desigualdades y situaciones de vulnerabilidad mediante información, acompañamiento y cooperación responsable." },
  { title: "Sostenibilidad y responsabilidad", Icon: Sprout, text: "La acción cívica incorpora la protección ambiental, el uso responsable de recursos y la conciencia sobre riesgos compartidos por la sociedad." },
  { title: "Comunidad y participación", Icon: Users, text: "INICIA valora la cooperación entre personas, comunidades, entidades e instituciones para construir respuestas realistas de interés público." },
];

export default function Ideology() {
  return <main className="min-h-screen bg-[#f8f6f1] text-[#0B2545]"><OriginalSiteNavigation />
    <section className="bg-[#e8eef1] py-20"><div className="mx-auto max-w-7xl px-5"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#c78117]">INICIA Foundation</p><h1 className="mt-4 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">Ideología y principios de acción.</h1><p className="mt-7 max-w-3xl text-lg leading-8 text-slate-700">Un compromiso cívico con la dignidad, la cooperación, la igualdad de oportunidades, la sostenibilidad y la mejora responsable de las condiciones de vida.</p></div></section>
    <section className="mx-auto max-w-7xl px-5 py-20"><div className="grid gap-5 md:grid-cols-2">{principles.map(({ title, Icon, text }) => <article key={title} className="rounded-3xl bg-white p-8 shadow-sm"><Icon className="h-7 w-7 text-[#c78117]" /><h2 className="mt-5 font-serif text-3xl">{title}</h2><p className="mt-4 leading-7 text-slate-600">{text}</p></article>)}</div>
      <div className="mt-12 rounded-3xl bg-[#0B2545] p-8 text-white md:p-10"><h2 className="font-serif text-4xl">De los principios a la práctica.</h2><p className="mt-5 max-w-3xl leading-8 text-slate-200">Los principios no sustituyen la evaluación individual de cada situación, la normativa aplicable ni la competencia de servicios públicos o profesionales especializados. Guían la forma en que INICIA informa, colabora y diseña sus iniciativas.</p><Link href="/mision" className="mt-7 inline-flex items-center rounded-full bg-[#F4A833] px-5 py-3 text-sm font-bold text-[#0B2545]">Consultar misión y fines <ArrowRight className="ml-2 h-4 w-4" /></Link></div>
    </section>
  </main>;
}
