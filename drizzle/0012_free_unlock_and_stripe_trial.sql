ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "stripe_trial_used_at" timestamp with time zone;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "free_listing_unlocks" (
  "user_id" uuid PRIMARY KEY NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "listing_key" varchar(128) NOT NULL,
  "market" varchar(2) NOT NULL,
  "hardware_fingerprint" varchar(64),
  "unlocked_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "free_listing_unlocks_hw_idx" ON "free_listing_unlocks" USING btree ("hardware_fingerprint");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "free_listing_unlocks_listing_idx" ON "free_listing_unlocks" USING btree ("listing_key");
