import { err, ok } from "@/lib/api";
import { isAuthorisedRun } from "@/lib/alerts/cronAuth";
import { AlertRunService } from "@/services/AlertRunService";
import { AlertRunReport } from "@/types/alert.types";

/**
 * Compares every active alert with the current snapshot and mails the news.
 * Called by `npm run alerts:run` after a data update, or by a cron job.
 */
export async function POST(req: Request): Promise<Response> {
  if (!isAuthorisedRun(req.headers.get("authorization"))) return err("Unauthorized", 401);
  try {
    const data: AlertRunReport = await AlertRunService.run(Date.now());
    return ok(data);
  } catch (error) {
    console.error("[POST /api/alerts/run]", error);
    return err("Internal server error");
  }
}
