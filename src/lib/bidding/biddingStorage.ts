import { BIDDING_STORAGE, EMPTY_BID_INPUTS } from "@/lib/bidding/biddingConstants";
import { BidInputKey, BidInputs, OwnComparable } from "@/types/bidding.types";

/** Parsing of what the bidder stored — anything malformed is dropped, never guessed. */

export const inputsKey = (listingId: string) => `${BIDDING_STORAGE.inputs}${listingId}`;
export const comparablesKey = (listingId: string) => `${BIDDING_STORAGE.comparables}${listingId}`;

const parse = (raw: string): unknown => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export function parseInputs(raw: string): BidInputs {
  const data = parse(raw);
  const inputs: BidInputs = { ...EMPTY_BID_INPUTS };
  if (!data || typeof data !== "object") return inputs;
  for (const key of Object.keys(EMPTY_BID_INPUTS) as BidInputKey[]) {
    const value = (data as Record<string, unknown>)[key];
    if (typeof value === "number" && Number.isFinite(value)) inputs[key] = value;
  }
  return inputs;
}

const KINDS: OwnComparable["kind"][] = ["landValue", "salePrice", "rent", "other"];
const UNITS: OwnComparable["unit"][] = ["perM2", "perMonthPerM2", "total"];

export function parseComparables(raw: string): OwnComparable[] {
  const data = parse(raw);
  if (!Array.isArray(data)) return [];
  return data.filter(
    (item): item is OwnComparable =>
      item &&
      typeof item.id === "string" &&
      KINDS.includes(item.kind) &&
      UNITS.includes(item.unit) &&
      typeof item.value === "number" &&
      Number.isFinite(item.value) &&
      typeof item.source === "string" &&
      item.source.trim() !== "" &&
      typeof item.asOf === "string",
  );
}

export const hasAnyInput = (inputs: BidInputs): boolean => Object.values(inputs).some((value) => value !== null);
