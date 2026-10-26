import { err, ok } from "@/lib/api";
import { isAuthorisedRun } from "@/lib/alerts/cronAuth";
import { DeadlineRunService } from "@/services/DeadlineRunService";
import { DeadlineRunReport } from "@/types/deadline.types";

/**
 * Mails the deadline reminders due today. Called once a day in the morning by
 * `npm run termine:run` or a cron job — same bearer secret as the alert run.
 */
export async function POST(req: Request): Promise<Response> {
  if (!isAuthorisedRun(req.headers.get("authorization"))) return err("Unauthorized", 401);
  try {
    const data: DeadlineRunReport = await DeadlineRunService.run(Date.now());
    return ok(data);
  } catch (error) {
    console.error("[POST /api/termine/run]", error);
    return err("Internal server error");
  }
}
