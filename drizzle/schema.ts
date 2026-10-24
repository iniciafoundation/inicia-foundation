import { int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["admin", "user"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const documentVersions = mysqlTable("documentVersions", {
  id: varchar("id", { length: 48 }).primaryKey(),
  applicationType: mysqlEnum("applicationType", ["socio", "volunteer", "shared"]).notNull(),
  documentType: mysqlEnum("documentType", ["privacy", "membership_agreement", "volunteer_agreement"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  versionLabel: varchar("versionLabel", { length: 64 }).notNull(),
  bodyHtml: text("bodyHtml").notNull(),
  status: mysqlEnum("status", ["draft", "active", "archived"]).default("draft").notNull(),
  effectiveAt: timestamp("effectiveAt"),
  createdByUserId: int("createdByUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const applications = mysqlTable("applications", {
  id: varchar("id", { length: 48 }).primaryKey(),
  applicationType: mysqlEnum("applicationType", ["socio", "volunteer"]).notNull(),
  status: mysqlEnum("status", ["received", "under_review", "approved", "rejected", "withdrawn"]).default("received").notNull(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  city: varchar("city", { length: 128 }),
  postalCode: varchar("postalCode", { length: 32 }),
  motivation: text("motivation"),
  availability: text("availability"),
  privacyDocumentVersionId: varchar("privacyDocumentVersionId", { length: 48 }).notNull(),
  agreementDocumentVersionId: varchar("agreementDocumentVersionId", { length: 48 }).notNull(),
  privacyConsentAt: timestamp("privacyConsentAt").notNull(),
  agreementAcceptedAt: timestamp("agreementAcceptedAt").notNull(),
  signatureName: varchar("signatureName", { length: 255 }).notNull(),
  signatureStorageKey: varchar("signatureStorageKey", { length: 512 }).notNull(),
  signedSnapshotStorageKey: varchar("signedSnapshotStorageKey", { length: 512 }).notNull(),
  submissionIp: varchar("submissionIp", { length: 128 }).notNull(),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  retentionStatus: mysqlEnum("retentionStatus", ["pending_legal_review", "retention_review_due", "closed"]).default("pending_legal_review").notNull(),
  retentionPolicyReference: varchar("retentionPolicyReference", { length: 255 }),
  reviewedAt: timestamp("reviewedAt"),
  reviewedByUserId: int("reviewedByUserId"),
  internalNotes: text("internalNotes"),
});

export const emailDeliveries = mysqlTable("emailDeliveries", {
  id: varchar("id", { length: 48 }).primaryKey(),
  applicationId: varchar("applicationId", { length: 48 }).notNull(),
  recipient: varchar("recipient", { length: 320 }).notNull(),
  deliveryType: mysqlEnum("deliveryType", ["applicant_copy", "organization_copy"]).notNull(),
  status: mysqlEnum("status", ["pending_configuration", "queued", "sent", "failed"]).default("pending_configuration").notNull(),
  providerMessageId: varchar("providerMessageId", { length: 255 }),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  sentAt: timestamp("sentAt"),
});

export const applicationAuditEvents = mysqlTable("applicationAuditEvents", {
  id: varchar("id", { length: 48 }).primaryKey(),
  applicationId: varchar("applicationId", { length: 48 }).notNull(),
  eventType: varchar("eventType", { length: 96 }).notNull(),
  actorUserId: int("actorUserId"),
  metadataJson: text("metadataJson"),
  occurredAt: timestamp("occurredAt").defaultNow().notNull(),
});

export const projects = mysqlTable("projects", {
  id: varchar("id", { length: 48 }).primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 96 }).notNull(),
  shortDescription: text("shortDescription").notNull(),
  bodyHtml: text("bodyHtml").notNull(),
  heroImageUrl: text("heroImageUrl"),
  status: mysqlEnum("status", ["development", "preparation", "implemented"]).default("preparation").notNull(),
  visibility: mysqlEnum("visibility", ["draft", "published"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const projectTranslations = mysqlTable("projectTranslations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  projectId: varchar("projectId", { length: 48 }).notNull(),
  locale: mysqlEnum("locale", ["es", "en", "ru", "uk"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 128 }).notNull(),
  shortDescription: text("shortDescription").notNull(),
  bodyHtml: text("bodyHtml").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({
  projectLocaleUnique: uniqueIndex("project_translations_project_locale_unique").on(table.projectId, table.locale),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
