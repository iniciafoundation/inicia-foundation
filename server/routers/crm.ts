import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { applications, applicationAuditEvents, documentVersions, projects, projectTranslations } from "../../drizzle/schema";
import { getDb } from "../db";
import { notifyOwner } from "../_core/notification";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { storageGetSignedUrl, storagePut } from "../storage";

const applicationType = z.enum(["socio", "volunteer"]);
const documentType = z.enum(["privacy", "membership_agreement", "volunteer_agreement"]);
const statuses = z.enum(["received", "under_review", "approved", "rejected", "withdrawn"]);
const projectLocale = z.enum(["es", "en", "ru", "uk"]);
const publicProjectStatus = (status: "development" | "preparation" | "implemented", locale: z.infer<typeof projectLocale>) => {
  const labels = {
    es: { development: "En desarrollo", preparation: "En preparación", implemented: "Programa implementado" },
    en: { development: "In development", preparation: "In preparation", implemented: "Implemented programme" },
    ru: { development: "В разработке", preparation: "В подготовке", implemented: "Реализованная программа" },
    uk: { development: "У розробці", preparation: "У підготовці", implemented: "Реалізована програма" },
  };
  return labels[locale][status];
};

const submissionSchema = z.object({
  applicationType,
  fullName: z.string().min(3).max(255),
  email: z.string().email().max(320),
  phone: z.string().max(64).optional(),
  city: z.string().max(128).optional(),
  postalCode: z.string().max(32).optional(),
  motivation: z.string().max(5000).optional(),
  availability: z.string().max(2000).optional(),
  privacyDocumentId: z.string().min(4),
  agreementDocumentId: z.string().min(4),
  signatureName: z.string().min(3).max(255),
  signatureDataUrl: z.string().startsWith("data:image/png;base64,").max(750000),
});

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char] || char);

function requestIp(req: unknown) {
  const request = req as { headers?: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } };
  const value = request.headers?.["x-forwarded-for"];
  const header = Array.isArray(value) ? value[0] : value;
  return (header?.split(",")[0]?.trim() || request.socket?.remoteAddress || "unavailable").slice(0, 128);
}

function renderSnapshot(params: { id: string; applicationType: "socio" | "volunteer"; fullName: string; email: string; ip: string; now: Date; privacy: typeof documentVersions.$inferSelect; agreement: typeof documentVersions.$inferSelect; signatureName: string; signatureUrl: string }) {
  const label = params.applicationType === "socio" ? "Solicitud de socio/a" : "Solicitud de voluntariado";
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${label}</title><style>body{font-family:Arial,sans-serif;color:#14213d;line-height:1.55;max-width:840px;margin:40px auto;padding:0 24px}section{border-top:1px solid #d8e1ea;margin-top:28px;padding-top:20px}.meta{background:#f5f8fb;padding:18px;border-radius:12px}img{max-width:260px;border-bottom:1px solid #1f4168}</style></head><body><h1>${label}</h1><div class="meta"><p><strong>Referencia:</strong> ${escapeHtml(params.id)}</p><p><strong>Solicitante:</strong> ${escapeHtml(params.fullName)} · ${escapeHtml(params.email)}</p><p><strong>Fecha y hora:</strong> ${params.now.toISOString()}</p><p><strong>IP registrada:</strong> ${escapeHtml(params.ip)}</p></div><section><h2>${escapeHtml(params.privacy.title)} · ${escapeHtml(params.privacy.versionLabel)}</h2>${params.privacy.bodyHtml}</section><section><h2>${escapeHtml(params.agreement.title)} · ${escapeHtml(params.agreement.versionLabel)}</h2>${params.agreement.bodyHtml}</section><section><h2>Firma electrónica simple</h2><p>Nombre declarado: <strong>${escapeHtml(params.signatureName)}</strong></p><img src="${params.signatureUrl}" alt="Firma aportada por la persona solicitante"></section></body></html>`;
}

export const crmRouter = router({
  public: router({
    projects: publicProcedure.input(z.object({ locale: projectLocale.default("es") })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db.select().from(projects).where(eq(projects.visibility, "published")).orderBy(desc(projects.updatedAt));
      const translations = await db.select().from(projectTranslations).where(eq(projectTranslations.locale, input.locale));
      const translationByProject = new Map(translations.map(translation => [translation.projectId, translation]));
      return rows.map(project => {
        const translation = translationByProject.get(project.id);
        return {
          ...project,
          title: translation?.title || project.title,
          category: translation?.category || project.category,
          shortDescription: translation?.shortDescription || project.shortDescription,
          bodyHtml: translation?.bodyHtml || project.bodyHtml,
          status: publicProjectStatus(project.status, input.locale),
        };
      });
    }),
    activeDocuments: publicProcedure.input(z.object({ applicationType })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const requiredAgreement = input.applicationType === "socio" ? "membership_agreement" : "volunteer_agreement";
      const allActive = await db.select().from(documentVersions).where(eq(documentVersions.status, "active"));
      return allActive.filter(doc => doc.documentType === "privacy" || doc.documentType === requiredAgreement);
    }),
    submitApplication: publicProcedure.input(submissionSchema).mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("El servicio de solicitudes no está disponible temporalmente.");
      const [privacy] = await db.select().from(documentVersions).where(eq(documentVersions.id, input.privacyDocumentId)).limit(1);
      const [agreement] = await db.select().from(documentVersions).where(eq(documentVersions.id, input.agreementDocumentId)).limit(1);
      const agreementType = input.applicationType === "socio" ? "membership_agreement" : "volunteer_agreement";
      if (!privacy || privacy.status !== "active" || privacy.documentType !== "privacy" || !agreement || agreement.status !== "active" || agreement.documentType !== agreementType) {
        throw new Error("Los documentos seleccionados ya no están vigentes. Revise la solicitud antes de continuar.");
      }
      const id = `app_${nanoid(16)}`;
      const now = new Date();
      const ip = requestIp(ctx.req);
      const signatureBuffer = Buffer.from(input.signatureDataUrl.split(",")[1] || "", "base64");
      const signature = await storagePut(`applications/${id}/signature.png`, signatureBuffer, "image/png");
      const recordHtml = renderSnapshot({ id, applicationType: input.applicationType, fullName: input.fullName, email: input.email, ip, now, privacy, agreement, signatureName: input.signatureName, signatureUrl: signature.url });
      const record = await storagePut(`applications/${id}/signed-record.html`, recordHtml, "text/html; charset=utf-8");
      await db.insert(applications).values({ id, applicationType: input.applicationType, fullName: input.fullName, email: input.email, phone: input.phone || null, city: input.city || null, postalCode: input.postalCode || null, motivation: input.motivation || null, availability: input.availability || null, privacyDocumentVersionId: privacy.id, agreementDocumentVersionId: agreement.id, privacyConsentAt: now, agreementAcceptedAt: now, signatureName: input.signatureName, signatureStorageKey: signature.key, signedSnapshotStorageKey: record.key, submissionIp: ip, submittedAt: now });
      await db.insert(applicationAuditEvents).values({ id: `evt_${nanoid(16)}`, applicationId: id, eventType: "application_submitted", metadataJson: JSON.stringify({ privacyDocumentId: privacy.id, agreementDocumentId: agreement.id, signedRecordKey: record.key }) });
      await notifyOwner({ title: `Nueva solicitud de ${input.applicationType}`, content: `${input.fullName} ha enviado una solicitud. Referencia: ${id}.` });
      return { applicationId: id, emailDeliveryStatus: "disabled" as const };
    }),
  }),
  admin: router({
    listApplications: adminProcedure.input(z.object({ applicationType: applicationType.optional(), status: statuses.optional() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const filters = [input.applicationType ? eq(applications.applicationType, input.applicationType) : undefined, input.status ? eq(applications.status, input.status) : undefined].filter(Boolean);
      return filters.length ? db.select().from(applications).where(and(...(filters as [ReturnType<typeof eq>, ...ReturnType<typeof eq>[]]))).orderBy(desc(applications.submittedAt)) : db.select().from(applications).orderBy(desc(applications.submittedAt));
    }),
    listDocuments: adminProcedure.query(async () => {
      const db = await getDb();
      return db ? db.select().from(documentVersions).orderBy(desc(documentVersions.createdAt)) : [];
    }),
    getApplicationRecord: adminProcedure.input(z.object({ id: z.string().min(4) })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("La base de datos no está disponible.");
      const [application] = await db.select().from(applications).where(eq(applications.id, input.id)).limit(1);
      if (!application) throw new Error("No se encontró la solicitud.");
      return {
        signedRecordUrl: await storageGetSignedUrl(application.signedSnapshotStorageKey),
        signatureUrl: await storageGetSignedUrl(application.signatureStorageKey),
        retentionStatus: application.retentionStatus,
        retentionPolicyReference: application.retentionPolicyReference,
      };
    }),
    createDocumentVersion: adminProcedure.input(z.object({ applicationType: z.enum(["socio", "volunteer", "shared"]), documentType, title: z.string().min(3).max(255), versionLabel: z.string().min(1).max(64), bodyHtml: z.string().min(20).max(60000) })).mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("La base de datos no está disponible.");
      const id = `doc_${nanoid(16)}`;
      await db.insert(documentVersions).values({ id, ...input, status: "draft", createdByUserId: ctx.user.id });
      return { id };
    }),
    activateDocumentVersion: adminProcedure.input(z.object({ id: z.string().min(4) })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("La base de datos no está disponible.");
      const [target] = await db.select().from(documentVersions).where(eq(documentVersions.id, input.id)).limit(1);
      if (!target || target.status !== "draft") throw new Error("Solo las versiones borrador existentes pueden activarse.");
      await db.update(documentVersions).set({ status: "archived" }).where(and(eq(documentVersions.documentType, target.documentType), eq(documentVersions.status, "active")));
      await db.update(documentVersions).set({ status: "active", effectiveAt: new Date() }).where(eq(documentVersions.id, target.id));
      return { success: true };
    }),
    updateApplicationStatus: adminProcedure.input(z.object({ id: z.string().min(4), status: statuses, internalNotes: z.string().max(5000).optional() })).mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("La base de datos no está disponible.");
      await db.update(applications).set({ status: input.status, internalNotes: input.internalNotes || null, reviewedAt: new Date(), reviewedByUserId: ctx.user.id }).where(eq(applications.id, input.id));
      await db.insert(applicationAuditEvents).values({ id: `evt_${nanoid(16)}`, applicationId: input.id, eventType: "status_changed", actorUserId: ctx.user.id, metadataJson: JSON.stringify({ status: input.status }) });
      return { success: true };
    }),
  }),
});
