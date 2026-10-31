ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "country" varchar(2);
--> statement-breakpoint
UPDATE "users" AS u SET "country" = (
  SELECT o."market" FROM "billing_orders" AS o
  WHERE o."user_id" = u."id" AND o."status" = 'paid'
  ORDER BY o."paid_at" DESC NULLS LAST
  LIMIT 1
)
WHERE u."country" IS NULL;
