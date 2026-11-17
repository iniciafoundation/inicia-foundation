import type { ProgramFormConfig } from "@/components/ProgramForm";

const AREAS = ["Tecnología y digital", "Ciberseguridad", "Idiomas", "Emprendimiento", "Oficios", "Atención a personas", "Administración", "Otra"];
const PROPOSAL = { name: "propuesta", label: "¿Tienes alguna propuesta para que el proyecto crezca y llegue a más personas?", kind: "textarea" as const };
const NO_DEADLINE = "Estudiaremos tu solicitud y te escribiremos cuando encaje con alguna actividad o necesidad del programa. Si tienes ideas para que el proyecto crezca, envíanoslas cuando quieras.";

/** Laboratorio de Innovación Social: participants. */
export const APRENDER: ProgramFormConfig = {
  tipo: "aprender", adult: true, submit: "Quiero participar", done: NO_DEADLINE,
  fields: [
    { name: "situacion", label: "¿Cuál es tu situación actual?", kind: "one", required: true, options: ["Trabajando", "Buscando empleo", "Estudiando", "Quiero cambiar de profesión", "Otra"] },
    { name: "dedicacion", label: "¿A qué te dedicas o te has dedicado?", kind: "text", required: true },
    { name: "habilidades", label: "¿Qué sabes hacer bien? Habilidades, experiencia, conocimientos", kind: "textarea", required: true },
    { name: "crecer", label: "¿En qué te gustaría formarte o crecer?", kind: "many", required: true, options: AREAS },
    { name: "espera", label: "¿Qué esperas del programa?", kind: "many", options: ["Formación", "Mentoría", "Prácticas", "Encontrar empleo", "Emprender", "Conocer gente del sector"] },
    { name: "formato", label: "Formato preferido", kind: "one", options: ["Presencial en Gijón", "Online", "Me da igual"] },
    { name: "como_conocio", label: "¿Cómo nos has conocido?", kind: "one", options: ["Redes sociales", "Web", "Recomendación", "Servicio de empleo", "Otro"] },
    PROPOSAL,
  ],
};

/** Laboratorio de Innovación Social: mentors and experts. */
export const ENSENAR: ProgramFormConfig = {
  tipo: "ensenar", adult: true, submit: "Quiero compartir lo que sé", done: NO_DEADLINE,
  fields: [
    { name: "profesion", label: "Profesión o cargo actual", kind: "text", required: true },
    { name: "areas", label: "Área de experiencia", kind: "many", required: true, options: AREAS },
    { name: "experiencia", label: "Años de experiencia en esa área", kind: "one", required: true, options: ["Menos de 3", "3–10", "Más de 10"] },
    { name: "ensenaria", label: "Describe brevemente lo que podrías enseñar", kind: "textarea", required: true },
    { name: "colaboracion", label: "¿Cómo te gustaría colaborar?", kind: "many", required: true, options: ["Mentoría individual", "Taller o charla", "Curso", "Revisar CV y preparar entrevistas", "Abrir contactos profesionales"] },
    { name: "tiempo", label: "Tiempo disponible", kind: "one", options: ["Unas horas al mes", "Unas horas a la semana", "Para proyectos puntuales"] },
    { name: "formato", label: "Formato", kind: "one", options: ["Presencial en Gijón", "Online", "Ambos"] },
    { name: "web", label: "Perfil de LinkedIn o web", kind: "text" },
    PROPOSAL,
  ],
};

/** Laboratorio de Innovación Social: companies and organisations that open doors to participants. */
export const COLABORA_LAB: ProgramFormConfig = {
  tipo: "colabora_lab", submit: "Quiero colaborar con el laboratorio", done: NO_DEADLINE,
  fields: [
    { name: "tipo_entidad", label: "Colaboro como", kind: "one", required: true, options: ["Empresa", "Entidad social o pública", "Centro educativo", "Profesional independiente"] },
    { name: "entidad", label: "Nombre de la empresa o entidad", kind: "text" },
    { name: "cargo", label: "Tu cargo", kind: "text" },
    { name: "colaboracion", label: "¿Cómo te gustaría colaborar con el programa?", kind: "many", required: true, options: ["Ofrecer prácticas", "Proponer retos reales", "Contratar participantes", "Ceder espacios", "Difundir el programa", "Otra"] },
    { name: "sector", label: "Sector de actividad", kind: "text" },
    { name: "mensaje", label: "Cuéntanos tu idea o propuesta", kind: "textarea" },
  ],
};

/** Economía social: cooperative, empresa de inserción and second-hand shops. */
export const ECONOMIA: ProgramFormConfig = {
  tipo: "economia", submit: "Quiero sumarme", done: NO_DEADLINE,
  fields: [
    { name: "iniciativa", label: "¿Qué iniciativa te interesa?", kind: "many", required: true, options: ["Cooperativa", "Empresa de inserción", "Tiendas de segunda mano", "Todas"] },
    { name: "participacion", label: "¿Cómo te gustaría participar?", kind: "many", required: true, options: ["Trabajar en el proyecto", "Ser socio/a cooperativista", "Voluntariado en la tienda", "Donar objetos para la tienda", "Colaborar como empresa o entidad", "Aportar experiencia o asesoramiento"] },
    { name: "experiencia", label: "¿Qué experiencia o habilidades aportarías?", kind: "textarea" },
    PROPOSAL,
  ],
};

/** "Tu idea cuenta": one inviting question first, the rest appears when the person starts writing. */
export const IDEA: ProgramFormConfig = {
  tipo: "idea", reveal: true, submit: "Enviar mi idea",
  done: "Leeremos tu idea con atención. Si encaja con lo que estamos haciendo o con algo que podemos empezar, te escribiremos. Gracias por pensar con nosotros.",
  fields: [
    { name: "idea", label: "¿Qué harías tú para que Inicia llegue más lejos?", kind: "textarea", required: true, placeholder: "Una idea, una mejora, una crítica constructiva, algo que echas en falta…" },
    { name: "tipo_idea", label: "¿De qué tipo es tu idea?", kind: "one", options: ["Nuevo proyecto", "Mejorar un proyecto", "Colaboración", "Otra"] },
    { name: "participar", label: "¿Te gustaría ayudar a hacerla realidad?", kind: "one", options: ["Sí", "Quizá", "No, solo la comparto"] },
  ],
};
