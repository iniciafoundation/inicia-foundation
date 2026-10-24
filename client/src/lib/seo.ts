export type SiteMetadata = {
  title: string;
  description: string;
  robots: string;
};

const brand = "INICIA Foundation";
const publicSuffix = "ONG en Asturias";

const publicPages: Record<string, Omit<SiteMetadata, "robots">> = {
  "/": {
    title: `${brand} | ${publicSuffix}`,
    description: "INICIA Foundation es una ONG en Asturias que impulsa proyectos sociales, inclusión y desarrollo comunitario. Conoce la misión, los proyectos y cómo colaborar.",
  },
  "/mision": {
    title: `Misión y fines estatutarios | ${brand}`,
    description: "Misión, fines estatutarios y ámbito cívico de INICIA Foundation: inclusión, comunidad, sostenibilidad y participación responsable.",
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
  "/identidad": {
    title: `Identidad legal | ${brand}`,
    description: "Datos de identidad, registro y contacto de la Asociación INICIA Foundation en Asturias.",
  },
};

export function getSiteMetadata(pathname: string): SiteMetadata {
  if (pathname === "/admin" || pathname === "/login") {
    return { title: `CRM privado | ${brand}`, description: "Acceso administrativo restringido de INICIA Foundation.", robots: "noindex,nofollow,noarchive" };
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
