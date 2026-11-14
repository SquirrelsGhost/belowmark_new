ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "aktives_token_bestaetigt" boolean DEFAULT true NOT NULL;
