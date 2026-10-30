ALTER TABLE "billing_orders" ADD COLUMN IF NOT EXISTS "upgrade_from" varchar(32);
--> statement-breakpoint
DROP INDEX IF EXISTS "billing_invoices_order_kind_unique";
--> statement-breakpoint
CREATE UNIQUE INDEX "billing_invoices_order_kind_unique" ON "billing_invoices" USING btree ("order_id") WHERE "kind" IN ('order', 'upgrade');
