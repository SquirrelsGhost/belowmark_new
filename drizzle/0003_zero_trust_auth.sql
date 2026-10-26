ALTER TABLE "users" ADD COLUMN "permissions" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "sitzungs_version" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "gesperrt_am" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "sperr_grund" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hardware_fingerprint" varchar(64);--> statement-breakpoint
UPDATE "users" SET "permissions" = '["*"]'::jsonb WHERE "role" = 'admin';--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "role";--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "aktives_token_id" varchar(64) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "vorheriges_token_id" varchar(64);--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "rotiert_am" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "zuletzt_aktiv_am" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "widerrufen_am" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "widerruf_grund" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "user_agent_hash" varchar(64) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "ip_kuerzel" varchar(64);--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "hardware_fingerprint" varchar(64);--> statement-breakpoint
ALTER TABLE "rate_limits" ADD COLUMN "locked_until" timestamp with time zone;
