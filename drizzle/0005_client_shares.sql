CREATE TABLE "broker_brands" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"display_name" varchar(120) NOT NULL,
	"contact_line" varchar(200),
	"website" varchar(200),
	"imprint_url" varchar(200),
	"accent_color" varchar(7),
	"logo_mime" varchar(16),
	"logo_data" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_shares" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"token_hash" varchar(64) NOT NULL,
	"market" varchar(2) NOT NULL,
	"listing_key" varchar(128) NOT NULL,
	"locale" varchar(2) NOT NULL,
	"label" varchar(80),
	"message" text,
	"payload" jsonb NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"view_count" integer DEFAULT 0 NOT NULL,
	"last_viewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "client_shares_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "broker_brands" ADD CONSTRAINT "broker_brands_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_shares" ADD CONSTRAINT "client_shares_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_shares_owner_id_idx" ON "client_shares" USING btree ("owner_id");
