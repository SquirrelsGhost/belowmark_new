import { PricingCountryCode } from "@/lib/constants";
import { DeclarationErrorCode, DeleteErrorCode } from "@/translations/billing/IBillingTranslation";

export interface OrderFormState {
  status: "idle" | "error";
  code?: "consent_required" | "email_invalid" | "failed" | "blocked";
  offer?: string;
  market?: PricingCountryCode;
  guestEmail?: string;
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

export interface OrderOfferView {
  id: string;
  name: string;
  price: string;
  totalPrice: string;
  period: string;
  term: string;
  summary: string;
  badge?: string;
  blockedReason?: string;
  isTrial?: boolean;
  trialStartValue?: string;
  trialAfterLabel?: string;
  trialAfterValue?: string;
  trialDueTodayLabel?: string;
  trialDueTodayPrice?: string;
  trialDueTodayNote?: string;
  trialSubmitLabel?: string;
  trialPaymentNote?: string;
}

export interface OrderMarketView {
  code: PricingCountryCode;
  label: string;
  hint: string;
  blocker?: string;
}

export interface OrderFormLabels {
  ChooseOffer: string;
  SummaryTitle: string;
  Account: string;
  Market: string;
  MarketNote: string;
  Start: string;
  StartValue: string;
  Total: string;
  ConsentLabel: string;
  ConsentRequired: string;
  TermsNote: string;
  TermsLink: string;
  WithdrawalLink: string;
  PrivacyLink: string;
  Submit: string;
  Pending: string;
  PaymentNote: string;
  ErrorTitle: string;
  Failed: string;
  Blocked: string;
}
