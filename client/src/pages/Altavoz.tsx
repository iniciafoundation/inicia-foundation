import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { PageHero } from "@/components/PageHero";
import { CommunityCounter, ShareBlock, ShareCard, TuOla } from "@/components/Share";
import { SiteFooter } from "@/components/SiteFooter";
import { useT } from "@/lib/i18n";

const copy = {
  es: { eyebrow: "Sé nuestro altavoz", title: "Cada gesto", accent: "suma.", intro: "Dar visibilidad a Inicia Foundation es mucho más de lo que piensas. Con solo unos clics puedes acercar nuestros proyectos, campañas y eventos a personas que quizá los necesitan, o que pueden ayudar.", alt: "Personas reunidas en comunidad" },
  en: { eyebrow: "Be our voice", title: "Every gesture", accent: "counts.", intro: "Spreading the word about Inicia Foundation means more than you think. With a few clicks you can bring our projects, campaigns and events to people who may need them, or who can help.", alt: "People gathered as a community" },
  ru: { eyebrow: "Станьте нашим голосом", title: "Каждый шаг", accent: "важен.", intro: "Рассказать об Inicia Foundation — это больше, чем кажется. Несколькими кликами вы можете донести наши проекты, кампании и события до тех, кому они нужны, или до тех, кто может помочь.", alt: "Люди, собравшиеся вместе" },
  uk: { eyebrow: "Станьте нашим голосом", title: "Кожен крок", accent: "важливий.", intro: "Розповісти про Inicia Foundation — це більше, ніж здається. Кількома кліками ви можете донести наші проєкти, кампанії та події до тих, кому вони потрібні, або до тих, хто може допомогти.", alt: "Люди, що зібралися разом" },
  ast: { eyebrow: "Sé'l nuestru altavoz", title: "Cada xestu", accent: "suma.", intro: "Dar visibilidá a Inicia Foundation ye muncho más de lo que pienses. Con unos pocos clics pues averar los nuestros proyeutos, campañes y eventos a persones que quiciabes los precisen, o que puen ayudar.", alt: "Persones axuntaes en comunidá" },
};

export default function Altavoz() {
  const t = useT(copy);
  return <main className="min-h-screen bg-[#060A12] text-[#EEE7D7]"><OriginalSiteNavigation dark />
    <PageHero photo="community" alt={t.alt} eyebrow={t.eyebrow} title={t.title} accent={t.accent} intro={t.intro} />
    <div className="relative z-10 mx-auto -mt-10 max-w-5xl space-y-8 px-5 pb-20">
      <ShareBlock tag="altavoz" />
      <TuOla />
      <ShareCard />
      <CommunityCounter />
    </div>
    <SiteFooter />
  </main>;
}
