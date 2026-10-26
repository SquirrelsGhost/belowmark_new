import { APPLICANT_MAX, EMPTY_BANK_FILE_INPUTS, PROPERTY_USES } from "@/lib/bankFile/bankFileConstants";
import { BankFileInputs, DepositMethod } from "@/types/bankFile.types";

/** Parsing of what the bidder stored for the bank file — anything malformed is dropped, never guessed. */

const METHODS: DepositMethod[] = ["cheque", "guarantee", "transfer", "portal"];

const positive = (value: unknown): number | null => (typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null);

export function parseBankFileInputs(raw: string): BankFileInputs {
  if (!raw) return { ...EMPTY_BANK_FILE_INPUTS };
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { ...EMPTY_BANK_FILE_INPUTS };
  }
  if (!data || typeof data !== "object") return { ...EMPTY_BANK_FILE_INPUTS };
  const record = data as Record<string, unknown>;
  return {
    plannedBid: positive(record.plannedBid),
    fixedYears: positive(record.fixedYears),
    depositMethod: METHODS.includes(record.depositMethod as DepositMethod) ? (record.depositMethod as DepositMethod) : null,
    use: PROPERTY_USES.includes(record.use as BankFileInputs["use"] & string) ? (record.use as BankFileInputs["use"]) : null,
    applicant: typeof record.applicant === "string" ? record.applicant.slice(0, APPLICANT_MAX) : "",
  };
}

export const hasBankFileInput = (inputs: BankFileInputs): boolean =>
  inputs.plannedBid !== null || inputs.fixedYears !== null || inputs.depositMethod !== null || inputs.use !== null || inputs.applicant.trim() !== "";
