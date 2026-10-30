import "server-only";
import { createHash } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { PDFDocument } from "pdf-lib";
import { db } from "@/db";
import { users } from "@/db/schema";
import { isHoneypotListingKey, SCRAPING_LIMITS } from "@/lib/sicherheit/antiScrapingRules";
import { BillingService } from "@/services/billing/BillingService";
import { RateLimitResult, RateLimitService } from "@/services/RateLimitService";
import { Sitzungswachdienst } from "@/services/sicherheit/Sitzungswachdienst";

export interface ScrapingQuotaStatus {
  allowed: boolean;
  retryAfterMinutes: number;
  honeypotTriggered?: boolean;
  banned?: boolean;
}

/**
 * AntiScrapingService
 *
 * Enforces multi-tier velocity & daily quotas per account, triggers instant
 * real-time account bans (`gesperrtAm` + session revocation) when a honeypot
 * canary link is followed or burst limits are repeatedly violated, and embeds
 * forensic canary metadata into downloaded PDF documents.
 */
export class AntiScrapingService {
  /**
   * Immediately bans an account, revokes all active sessions, and terminates any running
   * paid plan or Stripe subscription without refund (extraordinary termination per § 9 AGB).
   */
  static banAccountForScraping = async (userId: string, reason: string): Promise<void> => {
    const now = new Date();
    const fullReason = `${reason} — Außerordentliche Kündigung & Kontosperrung gemäß § 9 AGB (keine Rückerstattung bereits gezahlter Entgelte).`;

    await BillingService.endSubscriptionNow(userId).catch((err: unknown) =>
      console.error("[AntiScrapingService] Stripe subscription cancel on ban:", err),
    );

    await db
      .update(users)
      .set({
        gesperrtAm: now,
        sperrGrund: fullReason,
        plan: null,
        planEndsAt: now,
        planCancelAt: now,
        trialEndsAt: now,
        permissions: [],
        sitzungsVersion: sql`${users.sitzungsVersion} + 1`,
        updatedAt: now,
      })
      .where(eq(users.id, userId));

    await Sitzungswachdienst.widerrufeAlleFuerInhaber(userId, fullReason);
    console.warn(`[AntiScrapingService] Account ${userId} banned without refund: ${fullReason}`);
  };

  /** Records a burst rate-limit violation and auto-bans the account after repeated strikes. */
  private static recordBurstStrike = async (userId: string, surface: string): Promise<boolean> => {
    const strike = await RateLimitService.hit(`scrape:strike:${userId}`, SCRAPING_LIMITS.burstStrikesHour);
    if (!strike.allowed) {
      await AntiScrapingService.banAccountForScraping(
        userId,
        `Automatisiertes Massen-Scraping erkannt (${surface})`,
      );
      return true;
    }
    return false;
  };

  /** Velocity and hourly check for search/list requests (`/app`). */
  static enforceSearchQuota = async (userId: string, isLocked: boolean): Promise<ScrapingQuotaStatus> => {
    const minRule = isLocked ? SCRAPING_LIMITS.searchFreeMinute : SCRAPING_LIMITS.searchPaidMinute;
    const hourRule = isLocked ? SCRAPING_LIMITS.searchFreeHour : SCRAPING_LIMITS.searchPaidHour;

    const [minHit, hourHit] = await Promise.all([
      RateLimitService.hit(`scrape:search:min:${userId}`, minRule),
      RateLimitService.hit(`scrape:search:hr:${userId}`, hourRule),
    ]);

    if (!minHit.allowed) {
      const banned = await AntiScrapingService.recordBurstStrike(userId, "search-burst");
      return { allowed: false, retryAfterMinutes: minHit.retryAfterMinutes, banned };
    }
    if (!hourHit.allowed) {
      return { allowed: false, retryAfterMinutes: hourHit.retryAfterMinutes };
    }
    return { allowed: true, retryAfterMinutes: 0 };
  };

  /**
   * Checks honeypot trap and enforces per-minute + daily quotas for object detail views
   * (`/app/objekt/[key]`, `/mappe/[key]`, `/bankmappe/[key]`, `/expose/[key]`).
   */
  static enforceDetailQuota = async (
    userId: string,
    isLocked: boolean,
    listingKey: string,
  ): Promise<ScrapingQuotaStatus> => {
    if (isHoneypotListingKey(listingKey)) {
      await AntiScrapingService.banAccountForScraping(
        userId,
        `Automatisiertes Scraping erkannt (Honeypot-Falle ${listingKey})`,
      );
      return { allowed: false, retryAfterMinutes: 60, honeypotTriggered: true, banned: true };
    }

    const minRule = isLocked ? SCRAPING_LIMITS.detailFreeMinute : SCRAPING_LIMITS.detailPaidMinute;
    const dayRule = isLocked ? SCRAPING_LIMITS.detailFreeDay : SCRAPING_LIMITS.detailPaidDay;

    const [minHit, dayHit]: [RateLimitResult, RateLimitResult] = await Promise.all([
      RateLimitService.hit(`scrape:detail:min:${userId}`, minRule),
      RateLimitService.hit(`scrape:detail:day:${userId}`, dayRule),
    ]);

    if (!minHit.allowed) {
      const banned = await AntiScrapingService.recordBurstStrike(userId, "detail-burst");
      return { allowed: false, retryAfterMinutes: minHit.retryAfterMinutes, banned };
    }
    if (!dayHit.allowed) {
      return { allowed: false, retryAfterMinutes: dayHit.retryAfterMinutes };
    }
    return { allowed: true, retryAfterMinutes: 0 };
  };

  /**
   * Checks honeypot trap and enforces per-minute + daily quotas for official source PDFs
   * and portal bridges (`/api/quelle/[key]`).
   */
  static enforceSourceDocumentQuota = async (
    userId: string,
    listingKey: string,
  ): Promise<ScrapingQuotaStatus> => {
    if (isHoneypotListingKey(listingKey)) {
      await AntiScrapingService.banAccountForScraping(
        userId,
        `Automatisiertes API-Scraping erkannt (Honeypot-Falle ${listingKey})`,
      );
      return { allowed: false, retryAfterMinutes: 60, honeypotTriggered: true, banned: true };
    }

    const [minHit, dayHit] = await Promise.all([
      RateLimitService.hit(`scrape:doc:min:${userId}`, SCRAPING_LIMITS.sourceDocMinute),
      RateLimitService.hit(`scrape:doc:day:${userId}`, SCRAPING_LIMITS.sourceDocDay),
    ]);

    if (!minHit.allowed) {
      const banned = await AntiScrapingService.recordBurstStrike(userId, "doc-burst");
      return { allowed: false, retryAfterMinutes: minHit.retryAfterMinutes, banned };
    }
    if (!dayHit.allowed) {
      return { allowed: false, retryAfterMinutes: dayHit.retryAfterMinutes };
    }
    return { allowed: true, retryAfterMinutes: 0 };
  };

  /**
   * Embeds an invisible forensic canary fingerprint (`userId` + `listingKey` + timestamp)
   * into the PDF metadata so leaked bulk-downloaded PDFs can be traced back to the account.
   */
  static watermarkPdfBuffer = async (
    buffer: Buffer | Uint8Array,
    userId: string,
    listingKey: string,
  ): Promise<Uint8Array> => {
    try {
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true, updateMetadata: false });
      const ts = new Date().toISOString();
      const canarySig = createHash("sha256")
        .update(`bm-pdf-canary:${userId}:${listingKey}:${ts}`, "utf8")
        .digest("hex")
        .slice(0, 24);
      pdfDoc.setSubject(`BM-TRACE:${userId}:${canarySig}`);
      pdfDoc.setKeywords([`uid:${userId}`, `key:${listingKey}`, `sig:${canarySig}`, `ts:${ts}`]);
      pdfDoc.setProducer(`Belowmark Protected Document (${canarySig.slice(0, 12)})`);
      return await pdfDoc.save();
    } catch {
      // Encrypted or non-standard PDFs fall back to the original bytes without breaking the download
      return new Uint8Array(buffer);
    }
  };
}
