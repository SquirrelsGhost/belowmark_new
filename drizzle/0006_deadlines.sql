CREATE TABLE "deadline_follows" (
	"user_id" uuid NOT NULL,
	"listing_key" varchar(128) NOT NULL,
	"market" varchar(2) NOT NULL,
	"mail_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "deadline_follows_user_id_listing_key_pk" PRIMARY KEY("user_id","listing_key")
);
--> statement-breakpoint
CREATE TABLE "deadline_reminders_sent" (
	"user_id" uuid NOT NULL,
	"listing_key" varchar(128) NOT NULL,
	"sent_key" varchar(160) NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "deadline_reminders_sent_user_id_listing_key_sent_key_pk" PRIMARY KEY("user_id","listing_key","sent_key")
);
--> statement-breakpoint
CREATE TABLE "deadline_feeds" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"token_hash" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_fetched_at" timestamp with time zone,
	CONSTRAINT "deadline_feeds_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "deadline_follows" ADD CONSTRAINT "deadline_follows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deadline_reminders_sent" ADD CONSTRAINT "deadline_reminders_sent_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deadline_feeds" ADD CONSTRAINT "deadline_feeds_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
