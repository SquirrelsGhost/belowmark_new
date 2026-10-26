import { CHECK_ORDER, SPECULATION_YEARS } from "@/lib/expose/exposeConstants";
import { ExposeBase, ExposeCheckId, ExposeCheckState, ExposeFactLine, ExposeHolding, ExposeInputs } from "@/types/expose.types";

export interface ExposeCheckResult {
  id: ExposeCheckId;
  state: ExposeCheckState;
}

interface CheckInput {
  base: ExposeBase;
  inputs: ExposeInputs;
  facts: ExposeFactLine[];
  photoCount: number;
}

const filled = (...values: (string | number | null)[]) => values.every((value) => value !== null && String(value).trim() !== "");

/** DE: the five Pflichtangaben of § 87 GEG, or the note that the certificate follows. TR: class and date of the EKB. */
function energyState({ base, inputs, facts }: CheckInput): ExposeCheckState {
  if (base.market === "TR") return filled(inputs.efficiencyClass, inputs.certIssued) ? "ok" : "open";
  if (inputs.certType === null || inputs.certType === "none") return "open";
  const yearBuilt = facts.find((line) => line.key === "yearBuilt")?.value ?? null;
  return filled(inputs.energyValue, inputs.energyCarrier, inputs.efficiencyClass, yearBuilt) ? "ok" : "open";
}

function stateOf(id: ExposeCheckId, input: CheckInput): ExposeCheckState {
  const { base, inputs } = input;
  switch (id) {
    case "price":
      return inputs.askingPrice ? "ok" : "open";
    case "registered":
      return inputs.registered === true ? "ok" : "open";
    case "energy":
      return energyState(input);
    case "photos":
      return input.photoCount > 0 ? "ok" : "open";
    case "agent":
      if (inputs.sellerRole === null) return "open";
      return inputs.sellerRole === "private" || filled(inputs.licenseNo, inputs.contactCompany) ? "ok" : "open";
    case "commission":
      if (inputs.sellerRole !== "agent") return "ok";
      return inputs.commissionPct === null ? "open" : "hint";
    case "tenancy":
      if (inputs.occupancy === null) return "open";
      return inputs.occupancy === "rented" ? (inputs.netRent === null ? "open" : "hint") : "ok";
    case "share":
      return base.isShare || base.shareUnclear ? "open" : "ok";
    case "contact":
      return filled(inputs.contactName) && (filled(inputs.contactPhone) || filled(inputs.contactEmail)) ? "ok" : "open";
    default:
      // Rules the app cannot verify (rights, liability, tax, EİDS): always shown as something to heed
      return "hint";
  }
}

/** The checks of the screen panel, in the market's order. */
export const buildExposeChecks = (input: CheckInput): ExposeCheckResult[] =>
  CHECK_ORDER[input.base.market].map((id) => ({ id, state: stateOf(id, input) }));

/** End of the speculation period, counted from the hearing date (yyyy-mm-dd), or null without a date. */
export function speculationEnd(holding: ExposeHolding | null, market: ExposeBase["market"]): string | null {
  if (!holding?.date) return null;
  const [year, month, day] = holding.date.split("-").map(Number);
  const end = new Date(Date.UTC(year + SPECULATION_YEARS[market], month - 1, day));
  return end.toISOString().slice(0, 10);
}
