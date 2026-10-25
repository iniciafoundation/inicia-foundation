import { Building2, FileCheck2, MapPin } from "lucide-react";
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
    pendingTitle: "Документи на юридичній перевірці",
    pendingText: "Політику конфіденційності, порядок реалізації прав суб’єктів персональних даних (ARCO-POL), строк зберігання даних, умови членства, членські внески, можливі податкові пільги, угоду про волонтерську діяльність і страхування волонтерів буде опубліковано лише після того, як організація надасть їхні остаточні затверджені редакції. Доки цей процес не завершено, сайт не подає ці документи як чинні.",
  },
};

export default function LegalIdentity() {
  const [locale] = useLocale();
  const t = copy[locale];
  return <main className="min-h-screen bg-[#F7F3EA] text-[#0B1E3A]"><OriginalSiteNavigation dark />
    <section className="mx-auto max-w-5xl px-5 py-16"><p className="text-sm font-bold uppercase tracking-[.18em] text-[#7E5F1E]">{t.eyebrow}</p><h1 className="mt-3 font-serif text-5xl text-[#0B1E3A]">{t.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{t.intro}</p>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <article className="rounded-2xl border border-[#0B1E3A]/10 bg-white p-6 shadow-sm"><Building2 className="h-6 w-6 text-[#7E5F1E]" /><h2 className="mt-4 font-serif text-2xl text-[#0B1E3A]">{t.entityTitle}</h2><p className="mt-3 text-sm leading-6 text-slate-600"><strong>ASOCIACIÓN Inicia Foundation</strong><br />NIF/CIF: G05426242<br />{t.scope}</p></article>
        <article className="rounded-2xl border border-[#0B1E3A]/10 bg-white p-6 shadow-sm"><MapPin className="h-6 w-6 text-[#7E5F1E]" /><h2 className="mt-4 font-serif text-2xl text-[#0B1E3A]">{t.addressTitle}</h2><p className="mt-3 text-sm leading-6 text-slate-600">Avenida Manuel Llaneza, 68<br />Gijón, Asturias, España</p></article>
        <article className="rounded-2xl border border-[#0B1E3A]/10 bg-white p-6 shadow-sm"><FileCheck2 className="h-6 w-6 text-[#7E5F1E]" /><h2 className="mt-4 font-serif text-2xl text-[#0B1E3A]">{t.registryTitle}</h2><p className="mt-3 text-sm leading-6 text-slate-600">Registro de Asociaciones del Principado de Asturias{t.registryNote && <><br /><span className="text-slate-500">{t.registryNote}</span></>}<br />{t.registryNumber}</p></article>
      </div>
      <section className="mt-10 rounded-3xl border border-[#D6B25E]/50 bg-[#F0D893]/35 p-7"><h2 className="font-serif text-3xl text-[#0B1E3A]">{t.pendingTitle}</h2><p className="mt-3 max-w-3xl leading-7 text-slate-700">{t.pendingText}</p></section>
    </section>
    <SiteFooter />
  </main>;
}
