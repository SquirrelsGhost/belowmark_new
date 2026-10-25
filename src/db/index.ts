import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/lib/env";
import * as schema from "./schema";

/**
 * PostgreSQL Connection Pool & Drizzle ORM Instance
 *
 * Uses a global singleton in development so Next.js hot-reloading (HMR)
 * does not exhaust PostgreSQL connection limits.
 */

const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

export const pool: Pool =
  globalForDb.pool ??
  new Pool({
    connectionString: env.databaseUrl,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });
