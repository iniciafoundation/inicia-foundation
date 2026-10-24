import { integer, pgEnum, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["admin", "user"]);
export const applicationSubmissionType = pgEnum("application_submission_type", ["socio", "volunteer"]);
export const documentApplicationType = pgEnum("document_application_type", ["socio", "volunteer", "shared"]);
export const documentType = pgEnum("document_type", ["privacy", "membership_agreement", "volunteer_agreement"]);
export const documentStatus = pgEnum("document_status", ["draft", "active", "archived"]);
export const applicationStatus = pgEnum("application_status", ["received", "under_review", "approved", "rejected", "withdrawn"]);
export const retentionStatus = pgEnum("retention_status", ["pending_legal_review", "retention_review_due", "closed"]);
export const projectStatus = pgEnum("project_status", ["development", "preparation", "implemented"]);
export const visibility = pgEnum("visibility", ["draft", "published"]);
export const locale = pgEnum("locale", ["es", "en", "ru", "uk"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  identityId: varchar("identity_id", { length: 128 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in", { withTimezone: true }).defaultNow().notNull(),
});

export const documentVersions = pgTable("document_versions", {
  id: varchar("id", { length: 48 }).primaryKey(),
  applicationType: documentApplicationType("application_type").notNull(),
  documentType: documentType("document_type").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  versionLabel: varchar("version_label", { length: 64 }).notNull(),
  bodyHtml: text("body_html").notNull(),
  status: documentStatus("status").default("draft").notNull(),
  effectiveAt: timestamp("effective_at", { withTimezone: true }),
  createdByUserId: integer("created_by_user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const applications = pgTable("applications", {
  id: varchar("id", { length: 48 }).primaryKey(),
  applicationType: applicationSubmissionType("application_type").notNull(),
  status: applicationStatus("status").default("received").notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  city: varchar("city", { length: 128 }),
  postalCode: varchar("postal_code", { length: 32 }),
  motivation: text("motivation"),
  availability: text("availability"),
  privacyDocumentVersionId: varchar("privacy_document_version_id", { length: 48 }).notNull(),
  agreementDocumentVersionId: varchar("agreement_document_version_id", { length: 48 }).notNull(),
  privacyConsentAt: timestamp("privacy_consent_at", { withTimezone: true }).notNull(),
  agreementAcceptedAt: timestamp("agreement_accepted_at", { withTimezone: true }).notNull(),
  signatureName: varchar("signature_name", { length: 255 }).notNull(),
  signatureStorageKey: varchar("signature_storage_key", { length: 512 }).notNull(),
  signedSnapshotStorageKey: varchar("signed_snapshot_storage_key", { length: 512 }).notNull(),
  submissionIp: varchar("submission_ip", { length: 128 }).notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
  retentionStatus: retentionStatus("retention_status").default("pending_legal_review").notNull(),
  retentionPolicyReference: varchar("retention_policy_reference", { length: 255 }),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  reviewedByUserId: integer("reviewed_by_user_id"),
  internalNotes: text("internal_notes"),
});

export const applicationAuditEvents = pgTable("application_audit_events", {
  id: varchar("id", { length: 48 }).primaryKey(),
  applicationId: varchar("application_id", { length: 48 }).notNull(),
  eventType: varchar("event_type", { length: 96 }).notNull(),
  actorUserId: integer("actor_user_id"),
  metadataJson: text("metadata_json"),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: varchar("id", { length: 48 }).primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 96 }).notNull(),
  shortDescription: text("short_description").notNull(),
  bodyHtml: text("body_html").notNull(),
  heroImageUrl: text("hero_image_url"),
  status: projectStatus("status").default("preparation").notNull(),
  visibility: visibility("visibility").default("draft").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const projectTranslations = pgTable("project_translations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  projectId: varchar("project_id", { length: 48 }).notNull(),
  locale: locale("locale").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 128 }).notNull(),
  shortDescription: text("short_description").notNull(),
  bodyHtml: text("body_html").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, table => ({ projectLocaleUnique: uniqueIndex("project_translations_project_locale_unique").on(table.projectId, table.locale) }));
