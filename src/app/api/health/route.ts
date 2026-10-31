import { ok, err } from "@/lib/api";
import { env } from "@/lib/env";
import { DatabaseService, DatabaseHealth } from "@/services/DatabaseService";
import { MailService } from "@/services/MailService";

/**
 * GET /api/health
 *
 * Returns the current server status, timestamp, PostgreSQL connection status, and mail transport availability.
 */

interface HealthResponse {
  status: "ok" | "degraded";
  timestamp: string;
  version: string;
  database: DatabaseHealth;
  mail: {
    available: boolean;
    host: string;
  };
}

export async function GET(req: Request): Promise<Response> {
  void req.url;
  try {
    const dbHealth = await DatabaseService.checkHealth();
    const mailAvailable = MailService.isAvailable();

    const data: HealthResponse = {
      status: dbHealth.connected && mailAvailable ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? "0.1.0",
      database: dbHealth,
      mail: {
        available: mailAvailable,
        host: env.smtpHost || "console",
      },
    };

    return ok(data);
  } catch (error) {
    console.error("[GET /api/health]", error);
    return err("Internal server error");
  }
}
