ALTER TABLE "users" ADD COLUMN "plan" varchar(16);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" varchar(16) DEFAULT 'user' NOT NULL;