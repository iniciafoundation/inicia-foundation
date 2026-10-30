export type SiteMetadata = {
  title: string;
  description: string;
  robots: string;
};

const brand = "INICIA Foundation";
const publicSuffix = "ONG en Asturias";

const publicPages: Record<string, Omit<SiteMetadata, "robots">> = {
  "/": {
    title: `${brand} | ONG en Asturias: inclusión y voluntariado`,
    description: "Asociación sin ánimo de lucro de Gijón (Asturias) que desde 2021 acompaña a familias desplazadas por la guerra de Ucrania, migrantes y vecinos vulnerables: trámites, empleo y ayuda material.",
  },
  "/mision": {
    title: `Nuestra misión: acompañar a familias en Asturias | ${brand}`,
    description: "Desde 2021 INICIA Foundation acompaña en Gijón y Asturias a familias desplazadas por la guerra de Ucrania, personas migrantes y vecinos vulnerables: trámites, empleo y ayuda material.",
  },
  "/ideologia": {
    title: `Ideología y compromiso cívico | ${brand}`,
    description: "Conoce los principios de dignidad, participación, cooperación responsable y desarrollo comunitario que guían a INICIA Foundation.",
  },
  "/proyectos": {
    title: `Proyectos sociales en Asturias | ${brand}`,
    description: "Conoce los proyectos sociales, comunitarios, rurales y de inclusión de INICIA Foundation en Asturias y España, con su estado declarado.",
  },
  "/alianzas": {
    title: `Alianzas y colaboraciones | ${brand}`,
    description: "Instituciones, entidades sociales, centros educativos y empresas con los que colabora INICIA Foundation en inclusión, formación y desarrollo comunitario.",
  },
  "/colaborar": {
    title: `Voluntariado, socios y colaboración | ${brand}`,
    description: "Información para colaborar con INICIA Foundation mediante voluntariado, participación, colaboración institucional y donaciones.",
  },
  "/contacto": {
    title: `Contacto | ${brand} · ONG Asturias`,
    description: "Contacta con INICIA Foundation en Gijón o por WhatsApp para orientación, colaboración o información sobre proyectos sociales.",
  },
  "/donar": {
    title: `Donar | ${brand} · Bizum y transferencia`,
    description: "Apoya a INICIA Foundation con Bizum, transferencia bancaria, material o alimentos. Cada aportación sostiene el acompañamiento a familias en Asturias.",
  },
  "/noticias": {
    title: `Noticias | ${brand}`,
    description: "Novedades de INICIA Foundation: actividades, proyectos, convocatorias y resultados.",
  },
  "/privacidad": {
    title: `Política de privacidad | ${brand}`,
    description: "Cómo trata INICIA Foundation los datos personales recogidos en su sitio web y cómo ejercer tus derechos.",
  },
  "/cookies": {
    title: `Política de cookies | ${brand}`,
    description: "Qué cookies y almacenamiento usa el sitio de INICIA Foundation y cómo configurarlos.",
  },
  "/aviso-legal": {
    title: `Aviso legal | ${brand}`,
    description: "Datos identificativos y condiciones de uso del sitio web de la Asociación Inicia Foundation.",
  },
  "/identidad": {
    title: `Identidad legal | ${brand}`,
    description: "Datos de identidad, registro y contacto de la Asociación INICIA Foundation en Asturias.",
  },
};

export function getSiteMetadata(pathname: string): SiteMetadata {
  if (pathname === "/admin" || pathname === "/login") {
    return { title: `CRM privado | ${brand}`, description: "Acceso administrativo restringido de INICIA Foundation.", robots: "noindex,nofollow,noarchive" };
  }
  if (pathname === "/404") {
    return { title: `Página no encontrada | ${brand}`, description: "La página que buscas no existe en el sitio de INICIA Foundation.", robots: "noindex,follow" };
  }
  if (pathname.startsWith("/solicitud/")) {
    return { title: `Socios y voluntariado | ${brand}`, description: "Solicitud de participación en INICIA Foundation sujeta a documentos jurídicos y consentimientos activados.", robots: "noindex,follow" };
  }
  if (pathname.startsWith("/proyectos/")) {
    return { title: `Proyecto social | ${brand}`, description: "Información verificada sobre un proyecto de INICIA Foundation, su finalidad, territorio y estado declarado.", robots: "index,follow" };
  }
  if (publicPages[pathname]) return { ...publicPages[pathname], robots: "index,follow" };
  return { title: `${brand} | ${publicSuffix}`, description: "INICIA Foundation, ONG en Asturias dedicada a proyectos sociales, inclusión y desarrollo comunitario.", robots: "noindex,follow" };
}
