CREATE TABLE `station_status` (
	`id` integer PRIMARY KEY NOT NULL,
	`station_id` integer,
	`idle` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `stations` ADD `total` integer;