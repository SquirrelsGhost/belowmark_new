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

  // Warm up in-memory snapshots, geo outlines, pSEO catalog, and blog feed
  // immediately after server start so the first page transition is 0ms.
  setTimeout(async () => {
    try {
      const [{ ListingService }, { GeoService }, { PseoService }, { BlogService }] = await Promise.all([
        import("@/services/ListingService"),
        import("@/services/GeoService"),
        import("@/services/PseoService"),
        import("@/services/BlogService"),
      ]);
      await Promise.all([
        ListingService.getMeta("DE").catch(() => undefined),
        ListingService.getMeta("TR").catch(() => undefined),
        GeoService.getCountry("DE").catch(() => undefined),
        GeoService.getCountry("TR").catch(() => undefined),
        GeoService.getLocatorSprite("DE").catch(() => undefined),
        GeoService.getLocatorSprite("TR").catch(() => undefined),
        PseoService.GetCatalog().catch(() => undefined),
        BlogService.GetFeed().catch(() => undefined),
      ]);
    } catch {
      // Ignore warmup errors
    }
  }, 500).unref?.();

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
