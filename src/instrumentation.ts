/**
 * Next.js Server Instrumentation
 *
 * Automatically runs the email reminder & search alert checks in the background
 * on the Node.js server runtime (every 15 minutes + initial check after startup),
 * so users receive their configured deadline reminders and search alerts via SMTP
 * without requiring an external cron daemon.
 */

const INITIAL_DELAY_MS = 15_000;
const INTERVAL_MS = 15 * 60 * 1000;

const globalForScheduler = globalThis as unknown as {
  reminderSchedulerStarted: boolean | undefined;
};

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (globalForScheduler.reminderSchedulerStarted) return;
  globalForScheduler.reminderSchedulerStarted = true;

  const runChecks = async () => {
    try {
      const [{ AlertRunService }, { DeadlineRunService }] = await Promise.all([
        import("@/services/AlertRunService"),
        import("@/services/DeadlineRunService"),
      ]);
      const now = Date.now();
      await Promise.all([
        DeadlineRunService.run(now).catch((err) => console.error("[scheduler:deadlines]", err)),
        AlertRunService.run(now).catch((err) => console.error("[scheduler:alerts]", err)),
      ]);
    } catch (err) {
      console.error("[scheduler]", err);
    }
  };

  setTimeout(() => {
    void runChecks();
  }, INITIAL_DELAY_MS).unref?.();

  setInterval(() => {
    void runChecks();
  }, INTERVAL_MS).unref?.();
}
