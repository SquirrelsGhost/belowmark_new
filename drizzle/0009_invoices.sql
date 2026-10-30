CREATE SEQUENCE IF NOT EXISTS "billing_invoice_seq" START WITH 1;
--> statement-breakpoint
CREATE TABLE "billing_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seq" integer NOT NULL,
	"number" varchar(32) NOT NULL,
	"user_id" uuid,
	"kind" varchar(16) NOT NULL,
	"order_id" uuid,
	"stripe_invoice_id" varchar(64),
	"offer" varchar(32) NOT NULL,
	"market" varchar(2) NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar(3) NOT NULL,
	"vat_mode" varchar(16),
	"vat_rate_bp" integer,
	"net_amount" integer,
	"vat_amount" integer,
	"service_from" timestamp with time zone NOT NULL,
	"service_to" timestamp with time zone NOT NULL,
	"paid_at" timestamp with time zone NOT NULL,
	"recipient_email" varchar(255) NOT NULL,
	"recipient_name" text,
	"recipient_address" text,
	"recipient_vat_id" varchar(32),
	"is_test" boolean DEFAULT false NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "billing_invoices_seq_unique" UNIQUE("seq"),
	CONSTRAINT "billing_invoices_number_unique" UNIQUE("number"),
	CONSTRAINT "billing_invoices_stripe_invoice_id_unique" UNIQUE("stripe_invoice_id")
);
--> statement-breakpoint
CREATE TABLE "billing_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"address" text NOT NULL,
	"vat_id" varchar(32),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "billing_invoices" ADD CONSTRAINT "billing_invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "billing_invoices" ADD CONSTRAINT "billing_invoices_order_id_billing_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."billing_orders"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "billing_profiles" ADD CONSTRAINT "billing_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "billing_invoices_user_id_idx" ON "billing_invoices" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "billing_invoices_order_id_idx" ON "billing_invoices" USING btree ("order_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "billing_invoices_order_kind_unique" ON "billing_invoices" USING btree ("order_id") WHERE "kind" IN ('order', 'upgrade');
