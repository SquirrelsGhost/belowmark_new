import { err, ok } from "@/lib/api";
import { isAuthorisedRun } from "@/lib/alerts/cronAuth";
import { DeadlineRunService } from "@/services/DeadlineRunService";
import { DeadlineRunReport } from "@/types/deadline.types";

async function handleRun(req: Request): Promise<Response> {
  if (!isAuthorisedRun(req.headers.get("authorization"), req.headers)) return err("Unauthorized", 401);
  try {
    const data: DeadlineRunReport = await DeadlineRunService.run(Date.now());
    return ok(data);
  } catch (error) {
    console.error("[/api/termine/run]", error);
    return err("Internal server error");
  }
}

/**
 * Mails the deadline reminders due today.
 * Supports both GET (Vercel Cron) and POST (`npm run termine:run`).
 */
export async function GET(req: Request): Promise<Response> {
  return handleRun(req);
}

export async function POST(req: Request): Promise<Response> {
  return handleRun(req);
}
