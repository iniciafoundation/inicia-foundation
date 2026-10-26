import { getUser, logout } from "@netlify/identity";
import { TRPCError, initTRPC } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import superjson from "superjson";
import { z } from "zod";
import { getNetlifyDb } from "../db/client";
import { applicationAuditEvents, applications, documentVersions, projectTranslations, projects, users } from "../db/schema";
import { isApplicationIntakeEnabled } from "../lib/intake";
import { notifyNetlifyOwner } from "../lib/notifications";
import { getPrivateEvidence, putPrivateEvidence } from "../lib/storage";
import catalogSeed from "../database/seed/public-catalog.json";

type Context = { request: Request; ip: string };
const t = initTRPC.context<Context>().create({ transformer: superjson });
const applicationType = z.enum(["socio", "volunteer"]);
const documentType = z.enum(["privacy", "membership_agreement", "volunteer_agreement"]);
const status = z.enum(["received", "under_review", "approved", "rejected", "withdrawn"]);
const locale = z.enum(["es", "en", "ru", "uk"]);

const publicProcedure = t.procedure;
const identityUser = async () => {
  const user = await getUser();
  if (!user) return null;
  const email = typeof user.email === "string" ? user.email : null;
  const name = typeof user.userMetadata?.fullName === "string" ? user.userMetadata.fullName : email;
  return { identityId: user.id, email, name, role: (user.roles || []).includes("admin") ? "admin" as const : "user" as const };
};
const adminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const user = await identityUser();
  if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });
  if (user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
  const db = getNetlifyDb();
  const [stored] = await db.select().from(users).where(eq(users.identityId, user.identityId)).limit(1);
  const [actor] = stored ? [stored] : await db.insert(users).values({ identityId: user.identityId, name: user.name, email: user.email, role: "admin" }).returning();
  return next({ ctx: { ...ctx, actorId: actor.id, user } });
});

const publicProjectStatus = (value: "development" | "preparation" | "implemented", language: z.infer<typeof locale>) => ({
  es: { development: "En desarrollo", preparation: "En preparación", implemented: "Programa implementado" },
  en: { development: "In development", preparation: "In preparation", implemented: "Implemented programme" },
  ru: { development: "В разработке", preparation: "В подготовке", implemented: "Реализованная программа" },
  uk: { development: "У розробці", preparation: "У підготовці", implemented: "Реалізована програма" },
}[language][value]);
type CatalogSeed = { projects: Array<{ id: string; slug: string; title: string; category: string; shortDescription: string; bodyHtml: string; heroImageUrl: string | null; status: "development" | "preparation" | "implemented"; visibility: "published" | "draft" }>; translations: Array<{ projectId: string; locale: z.infer<typeof locale>; title: string; category: string; shortDescription: string; bodyHtml: string }> };
const fallbackCatalog = catalogSeed as CatalogSeed;
const localizedFallbackCatalog = (language: z.infer<typeof locale>) => {
  const byProject = new Map(fallbackCatalog.translations.filter(item => item.locale === language).map(item => [item.projectId, item]));
  return fallbackCatalog.projects.filter(item => item.visibility === "published").map(item => { const translation = byProject.get(item.id); return { ...item, title: translation?.title || item.title, category: translation?.category || item.category, shortDescription: translation?.shortDescription || item.shortDescription, bodyHtml: translation?.bodyHtml || item.bodyHtml, status: publicProjectStatus(item.status, language) }; });
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char] || char);
const requestIp = (request: Request) => (request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unavailable").slice(0, 128);
const renderSnapshot = (params: { id: string; type: "socio" | "volunteer"; fullName: string; email: string; ip: string; now: Date; privacy: { title: string; versionLabel: string; bodyHtml: string }; agreement: { title: string; versionLabel: string; bodyHtml: string }; signatureName: string; signatureDataUrl: string }) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Solicitud INICIA</title></head><body><h1>${params.type === "socio" ? "Solicitud de socio/a" : "Solicitud de voluntariado"}</h1><p>Referencia: ${escapeHtml(params.id)}</p><p>Solicitante: ${escapeHtml(params.fullName)} · ${escapeHtml(params.email)}</p><p>Fecha: ${params.now.toISOString()}</p><p>IP registrada: ${escapeHtml(params.ip)}</p><h2>${escapeHtml(params.privacy.title)} · ${escapeHtml(params.privacy.versionLabel)}</h2>${params.privacy.bodyHtml}<h2>${escapeHtml(params.agreement.title)} · ${escapeHtml(params.agreement.versionLabel)}</h2>${params.agreement.bodyHtml}<h2>Firma electrónica simple</h2><p>${escapeHtml(params.signatureName)}</p><img src="${params.signatureDataUrl}" alt="Firma aportada"></body></html>`;

const submitSchema = z.object({ applicationType, fullName: z.string().min(3).max(255), email: z.string().email().max(320), phone: z.string().max(64).optional(), city: z.string().max(128).optional(), postalCode: z.string().max(32).optional(), motivation: z.string().max(5000).optional(), availability: z.string().max(2000).optional(), privacyDocumentId: z.string().min(4), agreementDocumentId: z.string().min(4), signatureName: z.string().min(3).max(255), signatureDataUrl: z.string().startsWith("data:image/png;base64,").max(750000) });

export const netlifyAppRouter = t.router({
  auth: t.router({
    me: publicProcedure.query(async () => {
      const user = await identityUser();
      return user ? { id: user.identityId, openId: user.identityId, name: user.name, email: user.email, role: user.role } : null;
    }),
    logout: publicProcedure.mutation(async () => { await logout(); return { success: true as const }; }),
  }),
  assistant: t.router({
    chat: publicProcedure.input(z.object({ message: z.string().min(1).max(2000), locale: locale.optional() })).mutation(({ input }) => {
      const blocked = /(legal|jur[ií]dic|m[eé]dic|diagn[oó]stic|expediente|caso personal)/i.test(input.message);
      return { answer: blocked ? "El asistente solo ofrece información general de INICIA y no sustituye asesoramiento jurídico, médico ni valoración individual." : "La versión independiente del asistente está preparada, pero permanece desactivada hasta que INICIA configure un proveedor de IA exclusivamente en el entorno seguro de Netlify." };
    }),
  }),
  crm: t.router({
    public: t.router({
      projects: publicProcedure.input(z.object({ locale: locale.default("es") })).query(async ({ input }) => {
        try {
          const db = getNetlifyDb();
          const rows = await db.select().from(projects).where(eq(projects.visibility, "published")).orderBy(desc(projects.updatedAt));
          if (!rows.length) return localizedFallbackCatalog(input.locale);
          const translated = await db.select().from(projectTranslations).where(eq(projectTranslations.locale, input.locale));
          const byProject = new Map(translated.map(item => [item.projectId, item]));
          const fromDb = rows.map(item => { const translation = byProject.get(item.id); return { ...item, title: translation?.title || item.title, category: translation?.category || item.category, shortDescription: translation?.shortDescription || item.shortDescription, bodyHtml: translation?.bodyHtml || item.bodyHtml, status: publicProjectStatus(item.status, input.locale) }; });
          // Projects added to the published catalog file but not yet in the database (e.g. Neara) are shown too.
          const known = new Set(fromDb.map(item => item.slug));
          return [...fromDb, ...localizedFallbackCatalog(input.locale).filter(item => !known.has(item.slug))];
        } catch { return localizedFallbackCatalog(input.locale); }
      }),
      activeDocuments: publicProcedure.input(z.object({ applicationType })).query(async ({ input }) => {
        const db = getNetlifyDb();
        const needed = input.applicationType === "socio" ? "membership_agreement" : "volunteer_agreement";
        const active = await db.select().from(documentVersions).where(eq(documentVersions.status, "active"));
        return active.filter(item => item.documentType === "privacy" || item.documentType === needed);
      }),
      submitApplication: publicProcedure.input(submitSchema).mutation(async ({ input, ctx }) => {
        if (!isApplicationIntakeEnabled()) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Las solicitudes permanecen cerradas hasta que INICIA active documentos jurídicos aprobados." });
        const db = getNetlifyDb();
        const [privacy] = await db.select().from(documentVersions).where(eq(documentVersions.id, input.privacyDocumentId)).limit(1);
        const [agreement] = await db.select().from(documentVersions).where(eq(documentVersions.id, input.agreementDocumentId)).limit(1);
        const required = input.applicationType === "socio" ? "membership_agreement" : "volunteer_agreement";
        if (!privacy || privacy.status !== "active" || privacy.documentType !== "privacy" || !agreement || agreement.status !== "active" || agreement.documentType !== required) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Los documentos seleccionados ya no están vigentes." });
        const id = `app_${nanoid(16)}`; const now = new Date(); const ip = requestIp(ctx.request);
        const signatureKey = `applications/${id}/signature.png`; const recordKey = `applications/${id}/signed-record.html`;
        const signatureBytes = Uint8Array.from(Buffer.from(input.signatureDataUrl.split(",")[1] || "", "base64"));
        await putPrivateEvidence(signatureKey, signatureBytes.buffer, "image/png");
        await putPrivateEvidence(recordKey, renderSnapshot({ id, type: input.applicationType, fullName: input.fullName, email: input.email, ip, now, privacy, agreement, signatureName: input.signatureName, signatureDataUrl: input.signatureDataUrl }), "text/html; charset=utf-8");
        await db.insert(applications).values({ id, applicationType: input.applicationType, fullName: input.fullName, email: input.email, phone: input.phone || null, city: input.city || null, postalCode: input.postalCode || null, motivation: input.motivation || null, availability: input.availability || null, privacyDocumentVersionId: privacy.id, agreementDocumentVersionId: agreement.id, privacyConsentAt: now, agreementAcceptedAt: now, signatureName: input.signatureName, signatureStorageKey: signatureKey, signedSnapshotStorageKey: recordKey, submissionIp: ip });
        await db.insert(applicationAuditEvents).values({ id: `evt_${nanoid(16)}`, applicationId: id, eventType: "application_submitted", metadataJson: JSON.stringify({ privacyDocumentId: privacy.id, agreementDocumentId: agreement.id, signedRecordKey: recordKey }) });
        await notifyNetlifyOwner({ title: `Nueva solicitud de ${input.applicationType}`, content: `${input.fullName} ha enviado una solicitud.`, reference: id });
        return { applicationId: id, emailDeliveryStatus: "disabled" as const };
      }),
    }),
    admin: t.router({
      listApplications: adminProcedure.input(z.object({ applicationType: applicationType.optional(), status: status.optional() })).query(async ({ input }) => {
        const db = getNetlifyDb();
        const filters = [input.applicationType ? eq(applications.applicationType, input.applicationType) : undefined, input.status ? eq(applications.status, input.status) : undefined].filter(Boolean);
        return filters.length ? db.select().from(applications).where(and(...filters as [any, ...any[]])).orderBy(desc(applications.submittedAt)) : db.select().from(applications).orderBy(desc(applications.submittedAt));
      }),
      listDocuments: adminProcedure.query(() => getNetlifyDb().select().from(documentVersions).orderBy(desc(documentVersions.createdAt))),
      getApplicationRecord: adminProcedure.input(z.object({ id: z.string().min(4) })).query(async ({ input }) => {
        const [application] = await getNetlifyDb().select().from(applications).where(eq(applications.id, input.id)).limit(1);
        if (!application) throw new TRPCError({ code: "NOT_FOUND" });
        return { signedRecordUrl: `/api/evidence/${encodeURIComponent(application.signedSnapshotStorageKey)}`, signatureUrl: `/api/evidence/${encodeURIComponent(application.signatureStorageKey)}`, retentionStatus: application.retentionStatus, retentionPolicyReference: application.retentionPolicyReference };
      }),
      createDocumentVersion: adminProcedure.input(z.object({ applicationType: z.enum(["socio", "volunteer", "shared"]), documentType, title: z.string().min(3).max(255), versionLabel: z.string().min(1).max(64), bodyHtml: z.string().min(20).max(60000) })).mutation(async ({ input, ctx }) => {
        const id = `doc_${nanoid(16)}`; await getNetlifyDb().insert(documentVersions).values({ id, ...input, status: "draft", createdByUserId: ctx.actorId }); return { id };
      }),
      activateDocumentVersion: adminProcedure.input(z.object({ id: z.string().min(4) })).mutation(async ({ input }) => {
        const db = getNetlifyDb(); const [target] = await db.select().from(documentVersions).where(eq(documentVersions.id, input.id)).limit(1);
        if (!target || target.status !== "draft") throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Solo las versiones borrador existentes pueden activarse." });
        await db.update(documentVersions).set({ status: "archived" }).where(and(eq(documentVersions.documentType, target.documentType), eq(documentVersions.status, "active")));
        await db.update(documentVersions).set({ status: "active", effectiveAt: new Date() }).where(eq(documentVersions.id, target.id)); return { success: true };
      }),
      updateApplicationStatus: adminProcedure.input(z.object({ id: z.string().min(4), status, internalNotes: z.string().max(5000).optional() })).mutation(async ({ input, ctx }) => {
        const db = getNetlifyDb(); await db.update(applications).set({ status: input.status, internalNotes: input.internalNotes || null, reviewedAt: new Date(), reviewedByUserId: ctx.actorId }).where(eq(applications.id, input.id)); await db.insert(applicationAuditEvents).values({ id: `evt_${nanoid(16)}`, applicationId: input.id, eventType: "status_changed", actorUserId: ctx.actorId, metadataJson: JSON.stringify({ status: input.status }) }); return { success: true };
      }),
    }),
  }),
});

export type NetlifyAppRouter = typeof netlifyAppRouter;
export { getPrivateEvidence };
