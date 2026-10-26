import { HOLDING_STATUSES, PORTFOLIO_STORAGE } from "@/lib/portfolio/portfolioConstants";
import { Holding, HoldingStatus } from "@/types/portfolio.types";

/**
 * The bidder's record of the outcome of a proceeding ("ersteigert"), in localStorage.
 * The one source for won / lost — the after-Zuschlag task list and the Exposé read it too.
 * Read it live in a component with useStoredText(holdingKey(key)) and parseHolding.
 */

/** Same event useStoredText listens to — every reader of the key updates in this tab. */
export const HOLDING_CHANGE_EVENT = "belowmark:stored-text";

export const EMPTY_HOLDING: Holding = { status: "watching", price: null, date: null };

export const holdingKey = (listingKey: string): string => `${PORTFOLIO_STORAGE.holding}${listingKey}`;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Anything malformed falls back to "watching" with no price — never guessed. */
export function parseHolding(raw: string): Holding {
  if (!raw) return { ...EMPTY_HOLDING };
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { ...EMPTY_HOLDING };
  }
  if (!data || typeof data !== "object") return { ...EMPTY_HOLDING };
  const record = data as Record<string, unknown>;
  const status = HOLDING_STATUSES.includes(record.status as HoldingStatus) ? (record.status as HoldingStatus) : "watching";
  const price = typeof record.price === "number" && Number.isFinite(record.price) && record.price > 0 ? record.price : null;
  const date = typeof record.date === "string" && ISO_DATE.test(record.date) ? record.date : null;
  return { status, price, date };
}

export const isWon = (holding: Holding): boolean => holding.status === "won";

/** Writes (or with null removes) the record and tells every reader in this tab. Browser only. */
export function writeHolding(listingKey: string, holding: Holding | null): void {
  try {
    if (holding === null || (holding.status === "watching" && holding.price === null && holding.date === null)) window.localStorage.removeItem(holdingKey(listingKey));
    else window.localStorage.setItem(holdingKey(listingKey), JSON.stringify(holding));
  } catch {
    // Private mode: the record simply is not kept.
  }
  window.dispatchEvent(new Event(HOLDING_CHANGE_EVENT));
}
