/**
 * Typed environment variable access.
 *
 * Import `env` instead of reading `process.env` directly anywhere in the app.
 * This gives you:
 *   - TypeScript types (no more `string | undefined`)
 *   - Startup validation — the server crashes immediately with a clear error
 *     if a required variable is missing, rather than failing silently at runtime
 *
 * RULES:
 *  - Server-only vars (e.g. DATABASE_URL) must NEVER be accessed in Client Components.
 *  - Public vars (NEXT_PUBLIC_*) are safe everywhere.
 *  - Add new variables here AND in .env.example (and .env.local for real values).
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[env] Missing required environment variable: "${key}"\n` +
        `Check .env.example for the full list of required variables.`
    );
  }
  return value;
}

function optionalEnv(key: string, fallback = ""): string {
  return process.env[key] ?? fallback;
}

export const env = {
  // ── App ────────────────────────────────────────────────────
  /** Public URL of the app. Safe to use in Client Components. */
  get appUrl(): string {
    return optionalEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
  },

  // ── PostgreSQL ─────────────────────────────────────────────
  /** Full PostgreSQL connection string. SERVER ONLY. */
  get databaseUrl(): string {
    return requireEnv("DATABASE_URL");
  },
} as const;
