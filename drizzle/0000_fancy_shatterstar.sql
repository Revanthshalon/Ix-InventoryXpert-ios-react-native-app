CREATE TABLE `companies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`gstNo` text,
	`address` text,
	`phone` text,
	`email` text,
	`existingBalance` real DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`companyId` integer NOT NULL,
	`amount` real NOT NULL,
	`date` integer NOT NULL,
	`paymentStatus` text DEFAULT 'pending' NOT NULL,
	`remarks` text,
	FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `purchases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`companyId` integer NOT NULL,
	`amount` real NOT NULL,
	`date` integer NOT NULL,
	`billNo` text,
	`remarks` text,
	FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `companies_name_unique` ON `companies` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `companies_gstNo_unique` ON `companies` (`gstNo`);--> statement-breakpoint
CREATE UNIQUE INDEX `companies_phone_unique` ON `companies` (`phone`);--> statement-breakpoint
CREATE UNIQUE INDEX `companies_email_unique` ON `companies` (`email`);