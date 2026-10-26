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
    pendingTitle: "Documentos en validación jurídica",
    pendingText: "La política de privacidad, el canal de derechos ARCO-POL, el plazo de conservación, las condiciones de socio/a, las cuotas, los eventuales beneficios fiscales, el acuerdo de incorporación de voluntariado y sus seguros solo se publicarán cuando la organización aporte sus versiones definitivas aprobadas. El portal no presenta estos documentos como vigentes mientras ese proceso está pendiente.",
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
    pendingTitle: "Documents under legal review",
    pendingText: "The privacy policy, the channel for exercising data protection rights (ARCO-POL), the data retention period, membership conditions, fees, any tax benefits, the volunteer agreement and its insurance will only be published once the organisation provides their final approved versions. While this process is pending, the website does not present these documents as being in force.",
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
    pendingTitle: "Документы на юридической проверке",
    pendingText: "Политика конфиденциальности, порядок реализации прав субъектов персональных данных (ARCO-POL), срок хранения данных, условия членства, членские взносы, возможные налоговые льготы, соглашение о волонтёрской деятельности и страхование волонтёров будут опубликованы только после того, как организация предоставит их окончательные утверждённые редакции. Пока этот процесс не завершён, сайт не представляет эти документы как действующие.",
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
    pendingTitle: "Документи на юридичній перевірці",
    pendingText: "Політику конфіденційності, порядок реалізації прав суб’єктів персональних даних (ARCO-POL), строк зберігання даних, умови членства, членські внески, можливі податкові пільги, угоду про волонтерську діяльність і страхування волонтерів буде опубліковано лише після того, як організація надасть їхні остаточні затверджені редакції. Доки цей процес не завершено, сайт не подає ці документи як чинні.",
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
    pendingTitle: "Documentos en validación xurídica",
    pendingText: "La política de privacidá, la canal de derechos ARCO-POL, el plazu de caltenimientu, les condiciones de sociu/a, les cuotes, los eventuales beneficios fiscales, l'alcuerdu d'incorporación de voluntariáu y los sos seguros namás se van publicar cuando la organización apurra les sos versiones definitives aprobaes. El portal nun presenta estos documentos como vixentes mentanto esi procesu tea pendiente.",
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
        <article className="rounded-2xl border border-[#D6B25E]/20 bg-[#0C1320] p-6 shadow-sm"><Globe2 className="h-6 w-6 text-[#D6B25E]" /><h2 className="mt-4 font-serif text-2xl text-[#EEE7D7]">{t.europeTitle}</h2><p className="mt-3 text-sm leading-6 text-slate-300">{t.europeText}<br /><strong className="text-[#F0D893]">OID: E10445982</strong></p></article>
      </div>
      <section className="mt-10 rounded-3xl border border-[#D6B25E]/50 bg-[#D6B25E]/10 p-7"><h2 className="font-serif text-3xl text-[#EEE7D7]">{t.pendingTitle}</h2><p className="mt-3 max-w-3xl leading-7 text-slate-200">{t.pendingText}</p></section>
    </section>
    <SiteFooter />
  </main>;
}
