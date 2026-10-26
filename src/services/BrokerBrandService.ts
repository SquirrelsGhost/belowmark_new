import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { brokerBrands } from "@/db/schema";
import { LogoMime } from "@/lib/clientShare/brandRules";
import { BrokerBrandView } from "@/types/clientShare.types";

/** Letterhead fields as validated by the action. */
export interface BrokerBrandInput {
  displayName: string;
  contactLine: string | null;
  website: string | null;
  imprintUrl: string | null;
  accentColor: string | null;
}

type BrandRow = typeof brokerBrands.$inferSelect;

export const toBrandView = (row: BrandRow): BrokerBrandView => ({
  displayName: row.displayName,
  contactLine: row.contactLine,
  website: row.website,
  imprintUrl: row.imprintUrl,
  accentColor: row.accentColor,
  logoSrc: row.logoMime && row.logoData ? `data:${row.logoMime};base64,${row.logoData}` : null,
});

/**
 * BrokerBrandService
 *
 * The broker's letterhead for client links. Scoped to the owner's id; the
 * logo lives in the row (small, checked image) so no file store is needed.
 */
export class BrokerBrandService {
  static get = async (userId: string): Promise<BrokerBrandView | null> => {
    const [row] = await db.select().from(brokerBrands).where(eq(brokerBrands.userId, userId));
    return row ? toBrandView(row) : null;
  };

  static save = async (userId: string, input: BrokerBrandInput): Promise<void> => {
    await db.insert(brokerBrands).values({ userId, ...input }).onConflictDoUpdate({ target: brokerBrands.userId, set: { ...input, updatedAt: new Date() } });
  };

  /** Needs a saved letterhead first — a logo without a name is not a letterhead. */
  static setLogo = async (userId: string, mime: LogoMime, bytes: Uint8Array): Promise<boolean> => {
    const rows = await db
      .update(brokerBrands)
      .set({ logoMime: mime, logoData: Buffer.from(bytes).toString("base64"), updatedAt: new Date() })
      .where(eq(brokerBrands.userId, userId))
      .returning({ userId: brokerBrands.userId });
    return rows.length > 0;
  };

  static removeLogo = async (userId: string): Promise<void> => {
    await db.update(brokerBrands).set({ logoMime: null, logoData: null, updatedAt: new Date() }).where(eq(brokerBrands.userId, userId));
  };

  static remove = async (userId: string): Promise<void> => {
    await db.delete(brokerBrands).where(eq(brokerBrands.userId, userId));
  };
}
