import { IMetaTags } from "../../services/MetaTagService";

export type BillingBlockerKey = "not_configured" | "legal_not_approved" | "market_closed" | "price_missing";
export type OrderBlockerKey = "subscription_running" | "term_running" | "use_upgrade" | "pro_running" | "other_market";
export type DeclarationErrorCode = "name_required" | "email_invalid" | "contract_required" | "date_invalid" | "reason_required" | "rate_limited" | "unknown";
export type DeleteErrorCode = "password_wrong" | "confirm_required" | "rate_limited" | "unknown";

export interface IOfferText {
  Name: string;
  /** "79,00 € im Monat" is built from the price; this is the cadence word */
  Period: string;
  Summary: string;
  /** Under the price: renews / ends */
  Term: string;
}

interface IDeclarationDone {
  Title: string;
  Body: string;
  Received: string;
  Content: string;
  Ends: string;
  EndsManual: string;
  Print: string;
  MailNote: string;
}

/**
 * Strings of booking, account billing, data export/deletion, the
 * cancellation and withdrawal buttons and the legal page chrome. Kept apart
 * from ITranslation so the landing thread's file stays untouched.
 */
export interface IBillingTranslation {
  Meta: { Order: IMetaTags; Upgrade: IMetaTags; TestCheckout: IMetaTags; Cancel: IMetaTags; Withdraw: IMetaTags; Imprint: IMetaTags; Terms: IMetaTags; Withdrawal: IMetaTags; Privacy: IMetaTags };

  Legal: {
    DraftTitle: string;
    DraftBody: string;
    /** Only filled in Turkish: why the texts are German */
    LanguageNote: string;
    Contents: string;
    Print: string;
    Gap: string;
    /** Pending label of the declaration buttons */
    Sending: string;
  };

  Footer: { Cancel: string; Withdraw: string; Imprint: string; Terms: string; Withdrawal: string; Privacy: string };

  Order: {
    Eyebrow: string;
    Title: string;
    Lead: string;
    Points: string[];
    ChooseOffer: string;
    Offers: { "investor-monat": IOfferText; "investor-quartal": IOfferText; "pro-monat": IOfferText; "pro-quartal": IOfferText };
    Recommended: string;
    SummaryTitle: string;
    Account: string;
    Market: string;
    Start: string;
    StartValue: string;
    Total: string;
    VatInclusive: string;
    VatSmallBusiness: string;
    VatOpen: string;
    /** Market Türkei: no German VAT (place of supply Türkiye); KDV still open */
    VatTr: string;
    /** Market Türkei with BILLING_TR_KDV=inclusive */
    VatTrKdv: string;
    /** Under the Pro cards while Investor runs */
    UpgradeCta: string;
    ConsentLabel: string;
    ConsentRequired: string;
    TermsNote: string;
    TermsLink: string;
    WithdrawalLink: string;
    PrivacyLink: string;
    Submit: string;
    Pending: string;
    ErrorTitle: string;
    PaymentNote: string;
    Back: string;
    TestBanner: string;
    GapsTitle: string;
    Cancelled: string;
    Failed: string;
    Blockers: Record<BillingBlockerKey, string>;
    OrderBlockers: Record<OrderBlockerKey, string>;
    ManageCta: string;
    Contact: string;
    Blocked: string;
    ProTitle: string;
    ProBody: string;
    ProCta: string;
  };

  Upgrade: {
    Eyebrow: string;
    Title: string;
    Lead: string;
    Points: string[];
    SummaryTitle: string;
    From: string;
    To: string;
    Start: string;
    StartValue: string;
    Until: string;
    /** "{date}, danach {price} im Monat" */
    UntilRenews: string;
    /** "{date}, endet automatisch" */
    UntilEnds: string;
    Today: string;
    FreeNote: string;
    Rule: string;
    Submit: string;
    Pending: string;
    Unavailable: string;
    Cancelled: string;
    Failed: string;
  };

  TestCheckout: { Eyebrow: string; Title: string; Body: string; Pay: string; Abort: string; Missing: string };

  Account: {
    Title: string;
    Description: string;
    NoPlan: string;
    TrialRunning: string;
    PlanLabel: string;
    Status: string;
    RenewsOn: string;
    EndsOn: string;
    Book: string;
    Extend: string;
    Upgrade: string;
    Portal: string;
    PortalHint: string;
    PortalUnavailable: string;
    Cancel: string;
    Notices: { paid: string; pending: string; portal_failed: string };
  };

  Data: {
    Title: string;
    Description: string;
    Export: string;
    ExportHint: string;
    DeleteTitle: string;
    DeleteBody: string;
    DeletePlanWarning: string;
    Password: string;
    Confirm: string;
    DeleteSubmit: string;
    Errors: Record<DeleteErrorCode, string>;
  };

  Cancel: {
    Eyebrow: string;
    Title: string;
    Lead: string;
    Name: string;
    Email: string;
    EmailHint: string;
    Contract: string;
    ContractHint: string;
    Type: string;
    Ordinary: string;
    Extraordinary: string;
    Reason: string;
    When: string;
    NextPossible: string;
    AtDate: string;
    Submit: string;
    Done: IDeclarationDone;
    Errors: Record<DeclarationErrorCode, string>;
  };

  Withdraw: {
    Eyebrow: string;
    Title: string;
    Lead: string;
    Name: string;
    Email: string;
    EmailHint: string;
    Contract: string;
    ContractHint: string;
    Statement: string;
    StatementDefault: string;
    Submit: string;
    Done: IDeclarationDone;
    Errors: Record<DeclarationErrorCode, string>;
  };

  Mail: {
    Signature: string;
    Footer: string;
    Order: { Subject: string; Greeting: string; Body: string; Lines: string; Consent: string; Attached: string };
    CancelReceipt: { Subject: string; Body: string };
    WithdrawReceipt: { Subject: string; Body: string };
  };
}
