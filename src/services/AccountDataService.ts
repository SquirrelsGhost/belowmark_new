import "server-only";
import { readdir, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  billingOrders,
  closingCases,
  consumerDeclarations,
  deadlineFeeds,
  deadlineFollows,
  deadlineRemindersSent,
  hearingResults,
  searchAlerts,
  sessions,
  users,
  watchlist,
} from "@/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { BillingService } from "@/services/billing/BillingService";
import { TeamService } from "@/services/team/TeamService";
import { BrokerBrandService } from "@/services/BrokerBrandService";
import { ClientShareService } from "@/services/ClientShareService";
import { InvoiceService } from "@/services/invoice/InvoiceService";

/** Same folder ReportService writes Gutachten results to. */
const REPORT_DIR = join(process.cwd(), ".data", "gutachten");
const safeId = (userId: string) => userId.replace(/[^\w-]/g, "");

async function storedReports(userId: string): Promise<unknown[]> {
  const dir = join(REPORT_DIR, safeId(userId));
  try {
    const files = await readdir(dir);
    return Promise.all(files.filter((file) => file.endsWith(".json")).map(async (file) => JSON.parse(await readFile(join(dir, file), "utf8"))));
  } catch {
    return [];
  }
}

/**
 * AccountDataService
 *
 * Art. 15/20 DSGVO export and Art. 17 deletion, both self-service in /konto.
 * The export holds everything stored about the account except secrets
 * (password hash, session tokens). Deletion removes the account and all its
 * content at once; orders and declarations lose their link to the person but
 * stay as accounting and legal evidence.
 */
export class AccountDataService {
  static export = async (userId: string): Promise<Record<string, unknown>> => {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) throw new Error("account not found");
    const { passwordHash: _hash, hardwareFingerprint, ...account } = user;
    void _hash;
    const [savedListings, alerts, orders, declarations, deviceSessions, follows, reminders, feeds, results, cases] = await Promise.all([
      db.select().from(watchlist).where(eq(watchlist.userId, userId)),
      db.select().from(searchAlerts).where(eq(searchAlerts.userId, userId)),
      db.select().from(billingOrders).where(eq(billingOrders.userId, userId)),
      db.select().from(consumerDeclarations).where(eq(consumerDeclarations.userId, userId)),
      db
        .select({ createdAt: sessions.createdAt, lastActiveAt: sessions.zuletztAktivAm, expiresAt: sessions.expiresAt, userAgent: sessions.userAgent, ipShort: sessions.ipKuerzel, revokedAt: sessions.widerrufenAm })
        .from(sessions)
        .where(eq(sessions.userId, userId)),
      db.select().from(deadlineFollows).where(eq(deadlineFollows.userId, userId)),
      db.select().from(deadlineRemindersSent).where(eq(deadlineRemindersSent.userId, userId)),
      db.select({ userId: deadlineFeeds.userId, createdAt: deadlineFeeds.createdAt }).from(deadlineFeeds).where(eq(deadlineFeeds.userId, userId)),
      db.select().from(hearingResults).where(eq(hearingResults.userId, userId)),
      db.select().from(closingCases).where(eq(closingCases.userId, userId)),
    ]);
    return {
      exportedAt: new Date().toISOString(),
      note: "Belowmark – alle zu Ihrem Konto gespeicherten Daten (Art. 15 und 20 DSGVO). Nicht enthalten: Passwort-Prüfwert und Sitzungsschlüssel. Daten, die nur Ihr Browser speichert (Prüfliste, Bietlimit, Bankenmappe), liegen nicht bei uns — außer in Kundenlinks, die Sie erstellt haben.",
      account: { ...account, deviceFingerprintStored: Boolean(hardwareFingerprint) },
      sessions: deviceSessions,
      watchlist: savedListings,
      alerts,
      deadlines: { follows, reminders, feeds },
      hearingResults: results,
      closingCases: cases,
      gutachten: await storedReports(userId),
      orders,
      declarations,
      brokerBrand: await BrokerBrandService.get(userId),
      clientShares: await ClientShareService.exportFor(userId),
      teams: await TeamService.exportFor(userId),
      ...(await InvoiceService.exportFor(userId)),
    };
  };

  /** Deletes the account after the password check. Returns false when the password is wrong. */
  static delete = async (userId: string, password: string): Promise<boolean> => {
    const [user] = await db.select({ passwordHash: users.passwordHash }).from(users).where(eq(users.id, userId));
    if (!user || !(await verifyPassword(password, user.passwordHash))) return false;

    await BillingService.endSubscriptionNow(userId);
    // Owned teams go to the next member (or are deleted when nobody is left); notes and memberships cascade
    await TeamService.beforeAccountDelete(userId);
    // Cascades: sessions, auth_tokens, watchlist, search_alerts (+ alert_seen), broker_brands, client_shares; orders/declarations/invoices are set null, billing_profiles cascade
    await db.delete(users).where(eq(users.id, userId));
    await rm(join(REPORT_DIR, safeId(userId)), { recursive: true, force: true });
    return true;
  };
}
