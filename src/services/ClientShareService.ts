import "server-only";
import { and, count, desc, eq, gt, isNull, lt, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { brokerBrands, clientShares, users } from "@/db/schema";
import { CLIENT_SHARE } from "@/lib/clientShare/clientShareConfig";
import { readPayload } from "@/lib/clientShare/clientSharePayload";
import { hashShareToken, isShareTokenShape, newShareToken } from "@/lib/clientShare/clientShareToken";
import { DAY_MS } from "@/lib/appConstants";
import { MarketCode } from "@/lib/constants";
import { effectiveUserPermissions, hasPermission } from "@/lib/permissions";
import { activePlanSql } from "@/services/billing/activePlanSql";
import { toBrandView } from "@/services/BrokerBrandService";
import { ClientSharePayload, ClientShareStatus, ClientShareView, ResolvedClientShare } from "@/types/clientShare.types";

export interface NewClientShare {
  ownerId: string;
  market: MarketCode;
  listingKey: string;
  locale: "de" | "tr";
  label: string | null;
  message: string | null;
  payload: ClientSharePayload;
  expiryDays: number;
}

const market = (value: string): MarketCode => (value === "TR" ? "TR" : "DE");
const locale = (value: string): "de" | "tr" => (value === "tr" ? "tr" : "de");

function statusOf(row: { revokedAt: Date | null; expiresAt: Date }, now: number): ClientShareStatus {
  if (row.revokedAt) return "revoked";
  return row.expiresAt.getTime() > now ? "active" : "expired";
}

/** Pro access of the owner right now — a link stops working with the plan behind it. */
async function ownerHasPro(ownerId: string): Promise<boolean> {
  const [row] = await db
    .select({ plan: activePlanSql, permissions: users.permissions, trialEndsAt: users.trialEndsAt, gesperrtAm: users.gesperrtAm })
    .from(users)
    .where(eq(users.id, ownerId));
  if (!row || row.gesperrtAm) return false;
  const permissions = effectiveUserPermissions({ permissions: row.permissions, plan: row.plan, trialEndsAt: row.trialEndsAt, bannedAt: row.gesperrtAm });
  return hasPermission(permissions, "app:pro");
}

/**
 * ClientShareService
 *
 * Client links of a broker. Every query of the broker's own list is scoped to
 * the owner id. The public lookup goes by token hash only and answers the
 * same "not available" for unknown, expired, revoked and plan-less links.
 */
export class ClientShareService {
  static countOpen = async (ownerId: string, now: number): Promise<number> => {
    const [row] = await db
      .select({ value: count() })
      .from(clientShares)
      .where(and(eq(clientShares.ownerId, ownerId), isNull(clientShares.revokedAt), gt(clientShares.expiresAt, new Date(now))));
    return row?.value ?? 0;
  };

  /** Stores the link and returns its token — the only moment the token exists in clear. */
  static create = async (share: NewClientShare, now: number): Promise<string> => {
    const token = newShareToken();
    const { expiryDays, ...values } = share;
    await db.insert(clientShares).values({ ...values, tokenHash: hashShareToken(token), expiresAt: new Date(now + expiryDays * DAY_MS) });
    return token;
  };

  /** The broker's links, newest first. Links dead for longer than purgeAfterDays are deleted on the way. */
  static list = async (ownerId: string, now: number): Promise<ClientShareView[]> => {
    const purgeBefore = new Date(now - CLIENT_SHARE.purgeAfterDays * DAY_MS);
    await db
      .delete(clientShares)
      .where(and(eq(clientShares.ownerId, ownerId), or(lt(clientShares.expiresAt, purgeBefore), lt(clientShares.revokedAt, purgeBefore))));
    const rows = await db.select().from(clientShares).where(eq(clientShares.ownerId, ownerId)).orderBy(desc(clientShares.createdAt));
    return rows.map((row) => ({
      id: row.id,
      market: market(row.market),
      listingKey: row.listingKey,
      locale: locale(row.locale),
      label: row.label,
      sections: readPayload(row.payload)?.sections ?? [],
      status: statusOf(row, now),
      createdAt: row.createdAt,
      expiresAt: row.expiresAt,
      viewCount: row.viewCount,
      lastViewedAt: row.lastViewedAt,
    }));
  };

  static revoke = async (ownerId: string, shareId: string): Promise<void> => {
    await db
      .update(clientShares)
      .set({ revokedAt: new Date() })
      .where(and(eq(clientShares.id, shareId), eq(clientShares.ownerId, ownerId), isNull(clientShares.revokedAt)));
  };

  static remove = async (ownerId: string, shareId: string): Promise<void> => {
    await db.delete(clientShares).where(and(eq(clientShares.id, shareId), eq(clientShares.ownerId, ownerId)));
  };

  /** A fresh token for a link that still works; the old address stops at once. null when there is nothing to renew. */
  static renew = async (ownerId: string, shareId: string, now: number): Promise<string | null> => {
    const token = newShareToken();
    const rows = await db
      .update(clientShares)
      .set({ tokenHash: hashShareToken(token), viewCount: 0, lastViewedAt: null })
      .where(and(eq(clientShares.id, shareId), eq(clientShares.ownerId, ownerId), isNull(clientShares.revokedAt), gt(clientShares.expiresAt, new Date(now))))
      .returning({ id: clientShares.id });
    return rows.length > 0 ? token : null;
  };

  /** The link behind a token, or null. Counts the view (a number, nothing about the reader). */
  static open = async (token: string, countView: boolean): Promise<ResolvedClientShare | null> => {
    if (!isShareTokenShape(token)) return null;
    // Request time — read once here so the page and every section agree on "now"
    const now = Date.now();
    const [row] = await db
      .select({ share: clientShares, brand: brokerBrands })
      .from(clientShares)
      .leftJoin(brokerBrands, eq(brokerBrands.userId, clientShares.ownerId))
      .where(eq(clientShares.tokenHash, hashShareToken(token)));
    if (!row || statusOf(row.share, now) !== "active") return null;
    const payload = readPayload(row.share.payload);
    if (!payload || !(await ownerHasPro(row.share.ownerId))) return null;

    if (countView) {
      await db
        .update(clientShares)
        .set({ viewCount: sql`${clientShares.viewCount} + 1`, lastViewedAt: new Date(now) })
        .where(eq(clientShares.id, row.share.id));
    }
    return {
      id: row.share.id,
      market: market(row.share.market),
      listingKey: row.share.listingKey,
      locale: locale(row.share.locale),
      message: row.share.message,
      payload,
      createdAt: row.share.createdAt,
      expiresAt: row.share.expiresAt,
      brand: row.brand ? toBrandView(row.brand) : null,
      openedAt: now,
    };
  };

  /** For the DSGVO export: everything stored, except the token hash. */
  static exportFor = async (ownerId: string) => {
    const rows = await db.select().from(clientShares).where(eq(clientShares.ownerId, ownerId));
    return rows.map(({ tokenHash: _hash, ...rest }) => {
      void _hash;
      return rest;
    });
  };
}
