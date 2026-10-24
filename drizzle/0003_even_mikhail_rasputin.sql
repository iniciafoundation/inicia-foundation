ALTER TABLE `projects` MODIFY COLUMN `status` enum('active','planned','development','preparation') NOT NULL DEFAULT 'preparation';
--> statement-breakpoint
UPDATE `projects` SET `status` = 'development' WHERE `status` = 'active';
--> statement-breakpoint
UPDATE `projects` SET `status` = 'preparation' WHERE `status` = 'planned';
--> statement-breakpoint
ALTER TABLE `projects` MODIFY COLUMN `status` enum('development','preparation') NOT NULL DEFAULT 'preparation';
