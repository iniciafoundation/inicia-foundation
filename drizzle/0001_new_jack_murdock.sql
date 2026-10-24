CREATE TABLE `applicationAuditEvents` (
	`id` varchar(48) NOT NULL,
	`applicationId` varchar(48) NOT NULL,
	`eventType` varchar(96) NOT NULL,
	`actorUserId` int,
	`metadataJson` text,
	`occurredAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `applicationAuditEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `applications` (
	`id` varchar(48) NOT NULL,
	`applicationType` enum('socio','volunteer') NOT NULL,
	`status` enum('received','under_review','approved','rejected','withdrawn') NOT NULL DEFAULT 'received',
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64),
	`city` varchar(128),
	`postalCode` varchar(32),
	`motivation` text,
	`availability` text,
	`privacyDocumentVersionId` varchar(48) NOT NULL,
	`agreementDocumentVersionId` varchar(48) NOT NULL,
	`privacyConsentAt` timestamp NOT NULL,
	`agreementAcceptedAt` timestamp NOT NULL,
	`signatureName` varchar(255) NOT NULL,
	`signatureStorageKey` varchar(512) NOT NULL,
	`signedSnapshotStorageKey` varchar(512) NOT NULL,
	`submissionIp` varchar(128) NOT NULL,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`reviewedAt` timestamp,
	`reviewedByUserId` int,
	`internalNotes` text,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documentVersions` (
	`id` varchar(48) NOT NULL,
	`applicationType` enum('socio','volunteer','shared') NOT NULL,
	`documentType` enum('privacy','membership_agreement','volunteer_agreement') NOT NULL,
	`title` varchar(255) NOT NULL,
	`versionLabel` varchar(64) NOT NULL,
	`bodyHtml` text NOT NULL,
	`status` enum('draft','active','archived') NOT NULL DEFAULT 'draft',
	`effectiveAt` timestamp,
	`createdByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `documentVersions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailDeliveries` (
	`id` varchar(48) NOT NULL,
	`applicationId` varchar(48) NOT NULL,
	`recipient` varchar(320) NOT NULL,
	`deliveryType` enum('applicant_copy','organization_copy') NOT NULL,
	`status` enum('pending_configuration','queued','sent','failed') NOT NULL DEFAULT 'pending_configuration',
	`providerMessageId` varchar(255),
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`sentAt` timestamp,
	CONSTRAINT `emailDeliveries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` varchar(48) NOT NULL,
	`slug` varchar(128) NOT NULL,
	`title` varchar(255) NOT NULL,
	`category` varchar(96) NOT NULL,
	`shortDescription` text NOT NULL,
	`bodyHtml` text NOT NULL,
	`heroImageUrl` text,
	`status` enum('planned','active','completed') NOT NULL DEFAULT 'planned',
	`visibility` enum('draft','published') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`),
	CONSTRAINT `projects_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','user') NOT NULL DEFAULT 'user';