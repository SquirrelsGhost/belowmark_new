CREATE TABLE "alert_seen" (
	"alert_id" uuid NOT NULL,
	"listing_key" varchar(128) NOT NULL,
	"schedule" jsonb NOT NULL,
	"seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "alert_seen_alert_id_listing_key_pk" PRIMARY KEY("alert_id","listing_key")
);
--> statement-breakpoint
CREATE TABLE "search_alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"market" varchar(2) NOT NULL,
	"name" varchar(120) NOT NULL,
	"filters" jsonb NOT NULL,
	"notify_new" boolean DEFAULT true NOT NULL,
	"notify_changes" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_checked_at" timestamp with time zone,
	"last_sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "alert_seen" ADD CONSTRAINT "alert_seen_alert_id_search_alerts_id_fk" FOREIGN KEY ("alert_id") REFERENCES "public"."search_alerts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "search_alerts" ADD CONSTRAINT "search_alerts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "search_alerts_user_id_idx" ON "search_alerts" USING btree ("user_id");