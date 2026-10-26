import { sql } from "drizzle-orm";
import { db } from "@/db";

export interface DatabaseHealth {
  connected: boolean;
  latencyMs: number | null;
  error?: string;
}

/**
 * DatabaseService
 *
 * Provides database health checks and core PostgreSQL operations.
 */
export class DatabaseService {
  static checkHealth = async (): Promise<DatabaseHealth> => {
    const start = performance.now();
    try {
      await db.execute(sql`SELECT 1`);
      const latencyMs = Math.round(performance.now() - start);
      return {
        connected: true,
        latencyMs,
      };
    } catch (error) {
      const cause = (error as { cause?: Error })?.cause;
      const message =
        cause?.message ?? (error instanceof Error ? error.message : "Database connection failed");
      return {
        connected: false,
        latencyMs: null,
        error: message,
      };
    }
  };
}
