import { DeclarationErrorCode, DeleteErrorCode } from "@/translations/billing/IBillingTranslation";

export interface OrderFormState {
  status: "idle" | "error";
  code?: "consent_required" | "failed" | "blocked";
  offer?: string;
}

export interface DeclarationFormState {
  status: "idle" | "error";
  code?: DeclarationErrorCode;
  fields?: Partial<Record<"name" | "email" | "contract" | "date" | "reason", DeclarationErrorCode>>;
  values?: Record<string, string>;
}

export interface DeleteAccountState {
  status: "idle" | "error";
  code?: DeleteErrorCode;
}

export const INITIAL_ORDER_STATE: OrderFormState = { status: "idle" };
export const INITIAL_DECLARATION_STATE: DeclarationFormState = { status: "idle" };
export const INITIAL_DELETE_STATE: DeleteAccountState = { status: "idle" };
