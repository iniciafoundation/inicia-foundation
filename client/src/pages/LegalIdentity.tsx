import { CtaBand } from "@/components/CtaBand";
import { Building2, FileCheck2, Globe2, MapPin } from "lucide-react";
import { OriginalSiteNavigation } from "@/components/OriginalSiteNavigation";
import { SiteFooter } from "@/components/SiteFooter";
import { type Locale, useLocale } from "@/lib/i18n";

type LegalCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  entityTitle: string;
  scope: string;
  addressTitle: string;
  registryTitle: string;
  registryNote: string;
  registryNumber: string;
  europeTitle: string;
  europeText: string;
  picText: string;
  pendingTitle: string;
  pendingText: string;
};

const copy: Record<Locale, LegalCopy> = {
  es: {
    eyebrow: "Identidad de la organización",
    title: "Información registral",
    intro: "Datos institucionales confirmados de ASOCIACIÓN Inicia Foundation para identificar a la entidad responsable de este portal.",
    entityTitle: "Entidad",
    scope: "Ámbito: Principado de Asturias / España",
    addressTitle: "Domicilio social",
    registryTitle: "Registro",
    registryNote: "",
    registryNumber: "Número de inscripción 13148",
    europeTitle: "Programas europeos",
    europeText: "Identificador de organización (OID) en Erasmus+ y el Cuerpo Europeo de Solidaridad",
    picText: "Código de identificación de participante (PIC) en el Portal de Financiación y Licitaciones de la UE",
    pendingTitle: "Actividad de la entidad",
    pendingText: "Asociación sin ánimo de lucro que, desde 2021, acompaña a familias en situación de vulnerabilidad —sobre todo familias desplazadas por la guerra de Ucrania y personas migrantes— en trámites, acceso a recursos públicos, empleo y ayuda material. Actividad realizada por personas voluntarias y gratuita para las personas atendidas. La Política de privacidad, el Aviso legal y la Política de cookies están publicados al pie de cada página.",
  },
  en: {
    eyebrow: "Organisation identity",
    title: "Registration details",
    intro: "Confirmed institutional details of ASOCIACIÓN Inicia Foundation, identifying the organisation responsible for this website.",
    entityTitle: "Organisation",
    scope: "Scope: Principality of Asturias / Spain",
    addressTitle: "Registered office",
    registryTitle: "Registry",
    registryNote: "(Register of Associations of the Principality of Asturias)",
    registryNumber: "Registration number 13148",
    europeTitle: "European programmes",
    europeText: "Organisation ID (OID) for Erasmus+ and the European Solidarity Corps",
    picText: "Participant Identification Code (PIC) in the EU Funding & Tenders Portal",
    pendingTitle: "What the organisation does",
    pendingText: "Non-profit association that, since 2021, has supported families in vulnerable situations —above all families displaced by the war in Ukraine and migrants— with paperwork, access to public services, employment and material aid. The work is done by volunteers and is free for the people we help. The Privacy policy, Legal notice and Cookie policy are linked at the foot of every page.",
  },
  ru: {
    eyebrow: "Сведения об организации",
    title: "Регистрационная информация",
    intro: "Подтверждённые институциональные данные ASOCIACIÓN Inicia Foundation, позволяющие идентифицировать организацию, ответственную за этот сайт.",
    entityTitle: "Организация",
    scope: "Сфера деятельности: Княжество Астурия / Испания",
    addressTitle: "Юридический адрес",
    registryTitle: "Реестр",
    registryNote: "(Реестр ассоциаций Княжества Астурия)",
    registryNumber: "Регистрационный номер 13148",
    europeTitle: "Европейские программы",
    europeText: "Идентификатор организации (OID) в Erasmus+ и Европейском корпусе солидарности",
    picText: "Код участника (PIC) на портале финансирования и тендеров ЕС",
    pendingTitle: "Деятельность организации",
    pendingText: "Некоммерческая ассоциация, которая с 2021 года помогает семьям в трудной ситуации — прежде всего семьям, вынужденно покинувшим Украину из-за войны, и мигрантам — с документами, доступом к государственным услугам, трудоустройством и материальной поддержкой. Работу выполняют волонтёры, помощь бесплатная. Политика конфиденциальности, правовая информация и политика cookies доступны внизу каждой страницы.",
  },
  uk: {
    eyebrow: "Відомості про організацію",
    title: "Реєстраційна інформація",
    intro: "Підтверджені інституційні дані ASOCIACIÓN Inicia Foundation, що дають змогу ідентифікувати організацію, відповідальну за цей сайт.",
    entityTitle: "Організація",
    scope: "Сфера діяльності: Князівство Астурія / Іспанія",
    addressTitle: "Юридична адреса",
    registryTitle: "Реєстр",
    registryNote: "(Реєстр асоціацій Князівства Астурія)",
    registryNumber: "Реєстраційний номер 13148",
    europeTitle: "Європейські програми",
    europeText: "Ідентифікатор організації (OID) в Erasmus+ і Європейському корпусі солідарності",
    picText: "Код учасника (PIC) на порталі фінансування та тендерів ЄС",
    pendingTitle: "Діяльність організації",
    pendingText: "Неприбуткова асоціація, яка з 2021 року допомагає родинам у скрутному становищі — насамперед родинам, які вимушено виїхали з України через війну, та мігрантам — з документами, доступом до державних послуг, працевлаштуванням і матеріальною підтримкою. Роботу виконують волонтери, допомога безкоштовна. Політика конфіденційності, правова інформація та політика cookies доступні внизу кожної сторінки.",
  },
  ast: {
    eyebrow: "Identidá de la organización",
    title: "Información rexistral",
    intro: "Datos institucionales confirmaos de ASOCIACIÓN Inicia Foundation pa identificar la entidá responsable d'esti portal.",
    entityTitle: "Entidá",
    scope: "Ámbitu: Principáu d'Asturies / España",
    addressTitle: "Domiciliu social",
    registryTitle: "Rexistru",
    registryNote: "(Rexistru d'Asociaciones del Principáu d'Asturies)",
    registryNumber: "Númberu d'inscripción 13148",
    europeTitle: "Programes européos",
    europeText: "Identificador d'organización (OID) n'Erasmus+ y nel Cuerpu Européu de Solidaridá",
    picText: "Códigu d'identificación de participante (PIC) nel Portal de Financiación y Llicitaciones de la UE",
    pendingTitle: "Actividá de la entidá",
    pendingText: "Asociación ensin ánimu de llucru que, dende 2021, acompaña a families en situación de vulnerabilidá —sobre too families desplazaes pola guerra d'Ucraína y persones migrantes— en trámites, accesu a recursos públicos, empléu y ayuda material. Actividá fecha por persones voluntaries y de baldre pa les persones atendíes. La Política de privacidá, l'Avisu llegal y la Política de cookies tán espublizaes al pie de cada páxina.",
  },
};

export default function LegalIdentity() {
  const [locale] = useLocale();
  const t = copy[locale];
  return <main className="min-h-screen bg-[#060A12] text-[#EEE7D7]"><OriginalSiteNavigation dark />
    <section className="mx-auto max-w-5xl px-5 py-16"><p className="text-sm font-bold uppercase tracking-[.18em] text-[#D6B25E]">{t.eyebrow}</p><h1 className="mt-3 font-serif text-5xl text-[#EEE7D7]">{t.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{t.intro}</p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-[#D6B25E]/20 bg-[#0C1320] p-6 shadow-sm"><Building2 className="h-6 w-6 text-[#D6B25E]" /><h2 className="mt-4 font-serif text-2xl text-[#EEE7D7]">{t.entityTitle}</h2><p className="mt-3 text-sm leading-6 text-slate-300"><strong>ASOCIACIÓN Inicia Foundation</strong><br />NIF/CIF: G05426242<br />{t.scope}</p></article>
        <article className="rounded-2xl border border-[#D6B25E]/20 bg-[#0C1320] p-6 shadow-sm"><MapPin className="h-6 w-6 text-[#D6B25E]" /><h2 className="mt-4 font-serif text-2xl text-[#EEE7D7]">{t.addressTitle}</h2><p className="mt-3 text-sm leading-6 text-slate-300">Avenida Manuel Llaneza, 68<br />Gijón, Asturias, España</p></article>
        <article className="rounded-2xl border border-[#D6B25E]/20 bg-[#0C1320] p-6 shadow-sm"><FileCheck2 className="h-6 w-6 text-[#D6B25E]" /><h2 className="mt-4 font-serif text-2xl text-[#EEE7D7]">{t.registryTitle}</h2><p className="mt-3 text-sm leading-6 text-slate-300">Registro de Asociaciones del Principado de Asturias{t.registryNote && <><br /><span className="text-slate-400">{t.registryNote}</span></>}<br />{t.registryNumber}</p></article>
        <article className="rounded-2xl border border-[#D6B25E]/20 bg-[#0C1320] p-6 shadow-sm"><Globe2 className="h-6 w-6 text-[#D6B25E]" /><h2 className="mt-4 font-serif text-2xl text-[#EEE7D7]">{t.europeTitle}</h2><p className="mt-3 text-sm leading-6 text-slate-300">{t.europeText}<br /><strong className="text-[#F0D893]">OID: E10445982</strong><br />{t.picText}<br /><strong className="text-[#F0D893]">PIC: 861942292</strong></p></article>
      </div>
      <section className="mt-10 rounded-3xl border border-[#D6B25E]/50 bg-[#D6B25E]/10 p-7"><h2 className="font-serif text-3xl text-[#EEE7D7]">{t.pendingTitle}</h2><p className="mt-3 max-w-3xl leading-7 text-slate-200">{t.pendingText}</p></section>
    </section>
    <CtaBand /><SiteFooter />
  </main>;
}
