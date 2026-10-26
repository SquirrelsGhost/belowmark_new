ALTER TABLE "users" ADD COLUMN "plan_ends_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "plan_offer" varchar(32);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stripe_customer_id" varchar(64);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stripe_subscription_id" varchar(64);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "plan_cancel_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_stripe_customer_id_unique" UNIQUE("stripe_customer_id");--> statement-breakpoint
CREATE TABLE "billing_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"market" varchar(2) NOT NULL,
	"offer" varchar(32) NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar(3) NOT NULL,
	"terms_version" varchar(16) NOT NULL,
	"early_start_consent_at" timestamp with time zone NOT NULL,
	"status" varchar(16) DEFAULT 'open' NOT NULL,
	"provider" varchar(16) NOT NULL,
	"checkout_session_id" varchar(255),
	"stripe_subscription_id" varchar(64),
	"stripe_invoice_id" varchar(64),
	"paid_at" timestamp with time zone,
	"access_ends_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "billing_orders_checkout_session_id_unique" UNIQUE("checkout_session_id")
);
--> statement-breakpoint
CREATE TABLE "billing_events" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"type" varchar(64) NOT NULL,
	"processed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consumer_declarations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" varchar(16) NOT NULL,
	"user_id" uuid,
	"name" varchar(200) NOT NULL,
	"email" varchar(255) NOT NULL,
	"contract_reference" varchar(200),
	"cancellation_type" varchar(16),
	"reason" text,
	"requested_end" timestamp with time zone,
	"effective_end" timestamp with time zone,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"confirmation_sent_at" timestamp with time zone,
	"status" varchar(16) DEFAULT 'received' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "billing_orders" ADD CONSTRAINT "billing_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consumer_declarations" ADD CONSTRAINT "consumer_declarations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "billing_orders_user_id_idx" ON "billing_orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "consumer_declarations_user_id_idx" ON "consumer_declarations" USING btree ("user_id");
