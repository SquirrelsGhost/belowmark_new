import { BILLING_PROFILE_LIMITS } from "@/lib/invoice/invoiceConfig";
import { BillingProfileErrorCode } from "@/translations/account/IAccountTranslation";

export interface BillingProfileState {
  status: "idle" | "saved" | "error";
  code?: BillingProfileErrorCode;
  fields?: Partial<Record<"name" | "address" | "vatId", BillingProfileErrorCode>>;
  values?: { name: string; address: string; vatId: string };
}

export const INITIAL_BILLING_PROFILE_STATE: BillingProfileState = { status: "idle" };

/** Trimmed values, lines of the address cleaned, or the first problem per field. */
export function parseBillingProfile(formData: FormData): { values: { name: string; address: string; vatId: string }; fields: BillingProfileState["fields"] } {
  const name = String(formData.get("name") ?? "").trim();
  const address = String(formData.get("address") ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
  const vatId = String(formData.get("vatId") ?? "").replace(/\s+/g, "").toUpperCase();
  const fields: BillingProfileState["fields"] = {};
  if (!name) fields.name = "name_required";
  else if (name.length > BILLING_PROFILE_LIMITS.name) fields.name = "too_long";
  if (!address) fields.address = "address_required";
  else if (address.length > BILLING_PROFILE_LIMITS.address) fields.address = "too_long";
  if (vatId.length > BILLING_PROFILE_LIMITS.vatId) fields.vatId = "too_long";
  return { values: { name, address, vatId }, fields };
}
