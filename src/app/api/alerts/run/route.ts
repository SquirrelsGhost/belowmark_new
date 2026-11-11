import { err, ok } from "@/lib/api";
import { isAuthorisedRun } from "@/lib/alerts/cronAuth";
import { AlertRunService } from "@/services/AlertRunService";
import { UnverifiedReminderService } from "@/services/UnverifiedReminderService";
import { AlertRunReport } from "@/types/alert.types";

async function handleRun(req: Request): Promise<Response> {
  if (!(await isAuthorisedRun(req.headers.get("authorization"), req.headers, "alerts-run"))) {
    return err("Unauthorized", 401);
  }
  try {
    const now = Date.now();
    const [data]: [AlertRunReport, unknown] = await Promise.all([
      AlertRunService.run(now),
      UnverifiedReminderService.run(now).catch((e) => console.error("[alerts/run:unverified]", e)),
    ]);
    return ok(data);
  } catch (error) {
    console.error("[/api/alerts/run]", error);
    return err("Internal server error");
  }
}

/**
 * Compares every active alert with the current snapshot and mails the news.
 * Supports both GET (Vercel Cron) and POST (`npm run alerts:run`).
 */
export async function GET(req: Request): Promise<Response> {
  return handleRun(req);
}

export async function POST(req: Request): Promise<Response> {
  return handleRun(req);
}
