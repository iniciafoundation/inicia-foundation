CREATE TABLE `projectTranslations` (
	`id` varchar(64) NOT NULL,
	`projectId` varchar(48) NOT NULL,
	`locale` enum('es','en','ru','uk') NOT NULL,
	`title` varchar(255) NOT NULL,
	`category` varchar(128) NOT NULL,
	`shortDescription` text NOT NULL,
	`bodyHtml` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projectTranslations_id` PRIMARY KEY(`id`),
	CONSTRAINT `project_translations_project_locale_unique` UNIQUE(`projectId`,`locale`)
);
--> statement-breakpoint
ALTER TABLE `projects` MODIFY COLUMN `status` enum('development','preparation','implemented') NOT NULL DEFAULT 'preparation';