import { MarketCode } from "../../lib/constants";
import { IMetaTags } from "../../services/MetaTagService";
import { DepositMethod, PaymentStepId, PropertyUse } from "../../types/bankFile.types";

/** A statement with its legal basis; `law` names a link in BANK_FILE_LAWS. */
export interface BankFileClause {
  text: string;
  basis: string;
  law?: "zvg68" | "zvg69" | "zvg49" | "zvg107" | "zvg118" | "zvg130" | "grestg" | "gewo34i" | "iik" | "esatis";
}

/**
 * Strings of the bank file. Own namespace (like bidding and report) so the
 * shared app dictionary stays untouched. Placeholders in braces are filled with `fill()`.
 * Legal texts exist per market in both languages: a German user may look at a
 * Turkish proceeding and the other way round.
 */
export interface IBankFileTranslation {
  MetaTags: { BankFile: IMetaTags };

  Teaser: {
    Eyebrow: string;
    Title: string;
    Lead: Record<MarketCode, string>;
    Button: string;
    ButtonHint: string;
  };

  File: {
    Kicker: string;
    Title: string;
    PrintedAt: string;
    DataAsOf: string;
    Print: string;
    PrintHint: string;
    Back: string;
    Locked: string;
    NoValue: string;
    Sections: Record<"ask" | "request" | "schedule" | "deposit" | "collateral" | "object" | "risks" | "limit" | "documents" | "notThis" | "sources", string>;
  };

  Form: {
    Title: string;
    Lead: string;
    StorageHint: string;
    Fields: Record<"plannedBid" | "equity" | "repaymentPct" | "interestPct" | "fixedYears", { label: string; hint: string }>;
    Applicant: { label: string; hint: string; placeholder: string };
    Method: { label: string; empty: string };
    Methods: Record<DepositMethod, string>;
    Use: { label: string; empty: string };
    Uses: Record<PropertyUse, string>;
    YearsSuffix: string;
    Reset: string;
  };

  Ask: {
    Salutation: string;
    Intro: string;
    Applicant: string;
    NoApplicant: string;
    Requests: Record<"loan" | "guarantee" | "cheque" | "transfer" | "portal" | "timing", string>;
    MissingBid: string;
    MissingEquity: string;
    MissingMethod: string;
    Closing: string;
  };

  Request: {
    UsesTitle: string;
    SourcesTitle: string;
    Bid: string;
    BidFromLimit: string;
    BidOwn: string;
    Total: string;
    Equity: string;
    Loan: string;
    LoanToValue: string;
    LoanToValueNote: string;
    EquityShare: string;
    TermsTitle: string;
    Interest: string;
    InterestNote: string;
    Repayment: string;
    MonthlyRate: string;
    FixedYears: string;
    Use: string;
    Incomplete: string;
    EquityShortForDeposit: string;
    Guarantee: string;
    GuaranteeBasis: string;
  };

  Schedule: {
    Columns: Record<"when" | "what" | "amount", string>;
    Steps: Record<MarketCode, Partial<Record<PaymentStepId, BankFileClause & { when: string }>>>;
    BalanceGuaranteeNote: string;
    BalanceOpenNote: string;
    MissingInterestDays: string;
    Unknown: string;
    Footnote: Record<MarketCode, string>;
  };

  Deposit: {
    Lead: Record<MarketCode, string>;
    Ways: Record<MarketCode, (BankFileClause & { id: DepositMethod; title: string })[]>;
    Chosen: string;
  };

  Collateral: { Lead: Record<MarketCode, string>; Items: Record<MarketCode, BankFileClause[]> };

  Object: {
    ReportTitle: string;
    NoReport: string;
    ReportFrom: string;
    RisksLead: string;
    RiskFrom: Record<"notice" | "report" | "none", string>;
  };

  Documents: { Lead: string; Groups: Record<MarketCode, { title: string; items: string[] }[]> };

  NotThis: { Items: BankFileClause[] };

  SourceNames: Record<"notice" | "document" | "zvg" | "grestg" | "gewo" | "iik" | "esatis", string>;
}
