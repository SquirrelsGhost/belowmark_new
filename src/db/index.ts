import fs from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { sql } from "drizzle-orm";
import { drizzle as drizzlePg, NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite, PgliteDatabase } from "drizzle-orm/pglite";
import { Pool } from "pg";
import { env } from "@/lib/env";
import * as schema from "./schema";

/**
 * PostgreSQL Connection Pool & Drizzle ORM Instance
 *
 * - Uses external PostgreSQL (`pg.Pool`) when `DATABASE_URL` points to a reachable
 *   PostgreSQL server.
 * - Automatically falls back in local development to an embedded persistent
 *   PostgreSQL engine (`@electric-sql/pglite` in `./.data/postgres`) when local
 *   port 5432 is not running, and auto-applies Drizzle migrations (`./drizzle`)
 *   re-checking `_journal.json` whenever new migrations are generated during dev.
 */

type DatabaseInstance = NodePgDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  dbInstance: DatabaseInstance | undefined;
  dbInitPromise: Promise<DatabaseInstance> | undefined;
  lastMigratedJournalSignature: string | undefined;
  isRemotePg: boolean | undefined;
};

const MIGRATIONS_FOLDER = path.join(process.cwd(), "drizzle");
const JOURNAL_FILE = path.join(MIGRATIONS_FOLDER, "meta", "_journal.json");
const PGLITE_DATA_DIR = path.join(process.cwd(), ".data", "postgres");

interface JournalEntry {
  idx: number;
  version: string;
  when: number;
  tag: string;
  breakpoints: boolean;
}

interface JournalFile {
  entries: JournalEntry[];
}

function readJournalSignature(): string {
  try {
    const raw = fs.readFileSync(JOURNAL_FILE, "utf8");
    const parsed = JSON.parse(raw) as JournalFile;
    return parsed.entries.map((e) => `${e.idx}:${e.tag}:${e.when}`).join("|");
  } catch {
    return "";
  }
}

/**
 * Idempotent migration runner that executes directly against `dbInstance.execute()`
 * so it works even across HMR reloads when `dbInstance` was created in an earlier
 * module evaluation. Skips statements whose objects already exist (`42P07` duplicate_table,
 * `42701` duplicate_column, `42710` duplicate_object).
 */
async function ensureSchemaOnDb(dbInst: DatabaseInstance, isRemotePg = false): Promise<void> {
  if (!fs.existsSync(JOURNAL_FILE)) return;

  const signature = readJournalSignature();
  if (globalForDb.lastMigratedJournalSignature === signature && signature !== "") {
    return;
  }

  if (isRemotePg) {
    try {
      const check = await dbInst.execute(
        sql.raw(`SELECT count(*)::int AS cnt FROM information_schema.columns WHERE table_schema = 'public' AND ((table_name = 'users' AND column_name = 'sitzungs_version') OR (table_name = 'sessions' AND column_name = 'aktives_token_id') OR (table_name = 'billing_invoices' AND column_name = 'seq') OR (table_name = 'closing_cases' AND column_name = 'done') OR (table_name = 'billing_orders' AND column_name = 'upgrade_from')) AND EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'billing_invoices_order_kind_unique' AND indexdef ILIKE '%upgrade%')`),
      );
      const rows = (check as unknown as { rows?: Array<{ cnt: number }> }).rows;
      if (rows && rows[0]?.cnt === 5) {
        globalForDb.lastMigratedJournalSignature = signature;
        return;
      }
    } catch {
      // Fall through to full statement-by-statement migration
    }
  }

  const journal = JSON.parse(fs.readFileSync(JOURNAL_FILE, "utf8")) as JournalFile;
  for (const entry of journal.entries) {
    const sqlPath = path.join(MIGRATIONS_FOLDER, `${entry.tag}.sql`);
    if (!fs.existsSync(sqlPath)) continue;

    const content = fs.readFileSync(sqlPath, "utf8");
    const statements = content
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter(Boolean);

    for (const stmt of statements) {
      try {
        await dbInst.execute(sql.raw(stmt));
      } catch (err) {
        const directCode = (err as { code?: string })?.code;
        const causeCode = (err as { cause?: { code?: string } })?.cause?.code;
        const code = directCode ?? causeCode;
        // 42P07: relation already exists, 42701: column already exists, 42703: undefined column, 42710: constraint/object already exists
        if (code === "42P07" || code === "42701" || code === "42703" || code === "42710") {
          continue;
        }
        throw err;
      }
    }
  }

  globalForDb.lastMigratedJournalSignature = signature;
}

async function initOrSyncDatabase(): Promise<DatabaseInstance> {
  if (globalForDb.dbInstance) {
    await ensureSchemaOnDb(globalForDb.dbInstance, Boolean(globalForDb.isRemotePg));
    return globalForDb.dbInstance;
  }

  const connectionString = env.databaseUrl;
  const isPgliteExplicit = connectionString.startsWith("pglite://") || connectionString === "pglite";

  if (!isPgliteExplicit) {
    const pool = new Pool({
      connectionString,
      max: 10,
      // A new TLS connection to a hosted Postgres (Neon) costs several round
      // trips, so idle connections stay open for a while instead of 30 s.
      idleTimeoutMillis: 5 * 60_000,
      keepAlive: true,
      connectionTimeoutMillis: 10000,
    });
    try {
      await pool.query("SELECT 1");
      const pgDb = drizzlePg(pool, { schema });
      await ensureSchemaOnDb(pgDb, true);
      globalForDb.isRemotePg = true;
      globalForDb.dbInstance = pgDb;
      return pgDb;
    } catch (err) {
      await pool.end().catch(() => undefined);
      if (process.env.NODE_ENV === "production") {
        throw new Error(`[db] Could not connect to PostgreSQL server configured in DATABASE_URL: ${(err as Error)?.message}`);
      }
    }
  }

  fs.mkdirSync(PGLITE_DATA_DIR, { recursive: true });
  const client = new PGlite(PGLITE_DATA_DIR);
  await client.waitReady;

  const pgliteDb: PgliteDatabase<typeof schema> = drizzlePglite(client, { schema });
  const instance = pgliteDb as unknown as DatabaseInstance;
  await ensureSchemaOnDb(instance, false);
  globalForDb.isRemotePg = false;
  globalForDb.dbInstance = instance;
  return instance;
}

function getDbPromise(): Promise<DatabaseInstance> {
  if (globalForDb.dbInstance) {
    return initOrSyncDatabase();
  }
  if (!globalForDb.dbInitPromise) {
    globalForDb.dbInitPromise = initOrSyncDatabase().catch((err) => {
      globalForDb.dbInitPromise = undefined;
      throw err;
    });
  }
  return globalForDb.dbInitPromise;
}

function createAsyncQueryBuilderProxy(
  chainSteps: Array<{ prop: string | symbol; args: unknown[] }> = []
): unknown {
  return new Proxy(() => undefined, {
    get(_target, prop) {
      if (prop === "then" || prop === "catch" || prop === "finally") {
        const promise = getDbPromise().then((realDb) => {
          let current: unknown = realDb;
          for (const step of chainSteps) {
            const fn = (current as Record<string | symbol, (...a: unknown[]) => unknown>)[step.prop];
            current = fn.apply(current, step.args);
          }
          return current;
        });
        return (promise as unknown as Record<string | symbol, (...a: unknown[]) => unknown>)[
          prop
        ].bind(promise);
      }
      return (...args: unknown[]) =>
        createAsyncQueryBuilderProxy([...chainSteps, { prop, args }]);
    },
  });
}

export const db: DatabaseInstance = new Proxy({} as DatabaseInstance, {
  get(_target, prop) {
    return (...args: unknown[]) =>
      createAsyncQueryBuilderProxy([{ prop, args }]);
  },
});
