export type AccountSectionKey = "uebersicht" | "tarif" | "sicherheit" | "daten";
export type BillingProfileErrorCode = "name_required" | "address_required" | "too_long" | "rate_limited" | "unknown";

interface ISectionText {
  Title: string;
  Hint: string;
}

/**
 * Strings of the structured /konto page: section navigation, overview,
 * invoice list and billing address. Kept apart from the auth and billing
 * dictionaries so those threads' files stay untouched.
 */
export interface IAccountTranslation {
  Nav: { Label: string; Sections: Record<AccountSectionKey, ISectionText> };

  Overview: {
    Title: string;
    Description: string;
    Plan: string;
    PlanCta: string;
    LatestInvoice: string;
    NoInvoice: string;
    AllInvoices: string;
    Research: string;
    ResearchBody: string;
    ResearchCta: string;
  };

  Portal: { Label: string; Hint: string; Unavailable: string };

  Invoices: {
    Title: string;
    Description: string;
    Empty: string;
    Count: string;
    CountOne: string;
    Columns: { Number: string; Service: string; Amount: string; Document: string };
    Paid: string;
    Test: string;
    Upgrade: string;
    Renewal: string;
    Download: string;
    View: string;
    DownloadLabel: string;
    Note: string;
  };

  Address: {
    Title: string;
    Description: string;
    Missing: string;
    Name: string;
    NameHint: string;
    Address: string;
    AddressHint: string;
    VatId: string;
    VatIdHint: string;
    Optional: string;
    Edit: string;
    Cancel: string;
    Submit: string;
    Pending: string;
    Saved: string;
    ErrorTitle: string;
    Errors: Record<BillingProfileErrorCode, string>;
  };
}
