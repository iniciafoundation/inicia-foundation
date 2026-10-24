CREATE TYPE "public"."application_status" AS ENUM('received', 'under_review', 'approved', 'rejected', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."application_submission_type" AS ENUM('socio', 'volunteer');--> statement-breakpoint
CREATE TYPE "public"."document_application_type" AS ENUM('socio', 'volunteer', 'shared');--> statement-breakpoint
CREATE TYPE "public"."document_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('privacy', 'membership_agreement', 'volunteer_agreement');--> statement-breakpoint
CREATE TYPE "public"."locale" AS ENUM('es', 'en', 'ru', 'uk');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('development', 'preparation', 'implemented');--> statement-breakpoint
CREATE TYPE "public"."retention_status" AS ENUM('pending_legal_review', 'retention_review_due', 'closed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "application_audit_events" (
	"id" varchar(48) PRIMARY KEY NOT NULL,
	"application_id" varchar(48) NOT NULL,
	"event_type" varchar(96) NOT NULL,
	"actor_user_id" integer,
	"metadata_json" text,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" varchar(48) PRIMARY KEY NOT NULL,
	"application_type" "application_submission_type" NOT NULL,
	"status" "application_status" DEFAULT 'received' NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(64),
	"city" varchar(128),
	"postal_code" varchar(32),
	"motivation" text,
	"availability" text,
	"privacy_document_version_id" varchar(48) NOT NULL,
	"agreement_document_version_id" varchar(48) NOT NULL,
	"privacy_consent_at" timestamp with time zone NOT NULL,
	"agreement_accepted_at" timestamp with time zone NOT NULL,
	"signature_name" varchar(255) NOT NULL,
	"signature_storage_key" varchar(512) NOT NULL,
	"signed_snapshot_storage_key" varchar(512) NOT NULL,
	"submission_ip" varchar(128) NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"retention_status" "retention_status" DEFAULT 'pending_legal_review' NOT NULL,
	"retention_policy_reference" varchar(255),
	"reviewed_at" timestamp with time zone,
	"reviewed_by_user_id" integer,
	"internal_notes" text
);
--> statement-breakpoint
CREATE TABLE "document_versions" (
	"id" varchar(48) PRIMARY KEY NOT NULL,
	"application_type" "document_application_type" NOT NULL,
	"document_type" "document_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"version_label" varchar(64) NOT NULL,
	"body_html" text NOT NULL,
	"status" "document_status" DEFAULT 'draft' NOT NULL,
	"effective_at" timestamp with time zone,
	"created_by_user_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_translations" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"project_id" varchar(48) NOT NULL,
	"locale" "locale" NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" varchar(128) NOT NULL,
	"short_description" text NOT NULL,
	"body_html" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" varchar(48) PRIMARY KEY NOT NULL,
	"slug" varchar(128) NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" varchar(96) NOT NULL,
	"short_description" text NOT NULL,
	"body_html" text NOT NULL,
	"hero_image_url" text,
	"status" "project_status" DEFAULT 'preparation' NOT NULL,
	"visibility" "visibility" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"identity_id" varchar(128) NOT NULL,
	"name" text,
	"email" varchar(320),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_signed_in" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_identity_id_unique" UNIQUE("identity_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "project_translations_project_locale_unique" ON "project_translations" USING btree ("project_id","locale");