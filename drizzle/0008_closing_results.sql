CREATE TABLE "hearing_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"listing_key" varchar(128) NOT NULL,
	"market" varchar(2) NOT NULL,
	"region_code" varchar(16),
	"segment" varchar(16) NOT NULL,
	"appraised_value" bigint,
	"hearing_date" date NOT NULL,
	"outcome" varchar(16) NOT NULL,
	"highest_bid" bigint,
	"retained_rights" bigint,
	"bidder_count" integer,
	"source" varchar(16) NOT NULL,
	"is_buyer" boolean DEFAULT false NOT NULL,
	"shared" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "closing_cases" (
	"user_id" uuid NOT NULL,
	"listing_key" varchar(128) NOT NULL,
	"market" varchar(2) NOT NULL,
	"award_date" date,
	"distribution_date" date,
	"tax_notice_date" date,
	"handover_date" date,
	"done" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "closing_cases_user_id_listing_key_pk" PRIMARY KEY("user_id","listing_key")
);
--> statement-breakpoint
ALTER TABLE "hearing_results" ADD CONSTRAINT "hearing_results_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "closing_cases" ADD CONSTRAINT "closing_cases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "hearing_results_user_hearing_idx" ON "hearing_results" USING btree ("user_id","listing_key","hearing_date");--> statement-breakpoint
CREATE INDEX "hearing_results_market_idx" ON "hearing_results" USING btree ("market","outcome");
