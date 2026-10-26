import { EMPTY_EXPOSE_INPUTS, TEXT_LIMITS } from "@/lib/expose/exposeConstants";
import { ExposeHolding, ExposeInputs } from "@/types/expose.types";

/** Parsing of what the seller stored — anything malformed is dropped, never guessed. */

const TEXT_FIELDS = ["headline", "description", "location", "features", "availableFrom", "heating", "energyCarrier", "efficiencyClass", "certIssued", "contactName", "contactCompany", "contactPhone", "contactEmail", "licenseNo"] as const;
const NUMBER_FIELDS = ["askingPrice", "commissionPct", "livingArea", "plotArea", "rooms", "yearBuilt", "netRent", "energyValue"] as const;

const CHOICES = {
  priceType: ["fixed", "negotiable"],
  sellerRole: ["private", "agent"],
  condition: ["new", "renovated", "maintained", "needsWork"],
  occupancy: ["vacant", "rented", "owner"],
  certType: ["demand", "consumption", "none"],
} as const;

const textLimit = (field: (typeof TEXT_FIELDS)[number]): number =>
  field === "headline" || field === "description" || field === "location" || field === "features" ? TEXT_LIMITS[field] : TEXT_LIMITS.short;

const positive = (value: unknown): number | null => (typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null);

function readRecord(raw: string): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    const data: unknown = JSON.parse(raw);
    return data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function parseExposeInputs(raw: string): ExposeInputs {
  const record = readRecord(raw);
  if (!record) return { ...EMPTY_EXPOSE_INPUTS };
  const inputs: ExposeInputs = { ...EMPTY_EXPOSE_INPUTS };
  for (const field of TEXT_FIELDS) {
    const value = record[field];
    if (typeof value === "string") inputs[field] = value.slice(0, textLimit(field));
  }
  for (const field of NUMBER_FIELDS) inputs[field] = positive(record[field]);
  for (const [field, allowed] of Object.entries(CHOICES) as [keyof typeof CHOICES, readonly string[]][]) {
    const value = record[field];
    if (typeof value === "string" && allowed.includes(value)) (inputs as unknown as Record<string, unknown>)[field] = value;
  }
  inputs.registered = typeof record.registered === "boolean" ? record.registered : null;
  inputs.addressMode = record.addressMode === "exact" ? "exact" : "place";
  return inputs;
}

/** The portfolio feature's record of the hearing; unknown or malformed means "nothing known". */
export function parseHolding(raw: string): ExposeHolding | null {
  const record = readRecord(raw);
  if (!record || !["won", "lost", "bid"].includes(record.status as string)) return null;
  const date = typeof record.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(record.date) ? record.date : null;
  return { status: record.status as ExposeHolding["status"], price: positive(record.price), date };
}
