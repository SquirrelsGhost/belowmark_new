import { ok, err } from "@/lib/api";
import { DatabaseService, DatabaseHealth } from "@/services/DatabaseService";

/**
 * GET /api/health
 *
 * Returns the current server status, timestamp, and PostgreSQL connection status.
 */

interface HealthResponse {
  status: "ok" | "degraded";
  timestamp: string;
  version: string;
  database: DatabaseHealth;
}

export async function GET(): Promise<Response> {
  try {
    const dbHealth = await DatabaseService.checkHealth();

    const data: HealthResponse = {
      status: dbHealth.connected ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? "0.1.0",
      database: dbHealth,
    };

    return ok(data);
  } catch (error) {
    console.error("[GET /api/health]", error);
    return err("Internal server error");
  }
}
