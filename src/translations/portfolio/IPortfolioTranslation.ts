import { IMetaTags } from "../../services/MetaTagService";
import { HoldingStatus } from "../../types/portfolio.types";

interface IGroupText {
  Title: string;
  Lead: string;
}

/** Strings of the investor portfolio — own namespace, so the app translation stays untouched. */
export interface IPortfolioTranslation {
  MetaTags: IMetaTags;
  Nav: string;
  Page: {
    Eyebrow: string;
    Title: string;
    Lead: string;
    /** "{count} Objekte" */
    Count: string;
    StorageHint: string;
    Empty: { Title: string; Body: string; Cta: string };
    /** "{count} gemerkte Verfahren …" */
    Missing: string;
    Locked: { Title: string; Body: string };
    Disclaimer: string;
  };
  Groups: Record<"won" | "pipeline" | "lost", IGroupText>;
  Totals: {
    Won: {
      Count: string;
      Price: string;
      TotalCost: string;
      Equity: string;
      Loan: string;
      NetIncome: string;
      Cashflow: string;
      NetYield: string;
    };
    Pipeline: {
      Count: string;
      Value: string;
      Limit: string;
      TotalCost: string;
      Equity: string;
      Deposit: string;
      Verdicts: string;
    };
    /** "aus {count} von {of}" */
    Coverage: string;
    NoneYet: string;
    /** "Bieten {go} · offen {open} · nicht bieten {stop}" */
    VerdictCounts: string;
    YieldHint: string;
    DepositHint: string;
  };
  Columns: {
    Object: string;
    Status: string;
    Hearing: string;
    Value: string;
    Verdict: string;
    Limit: string;
    Price: string;
    Date: string;
    TotalCost: string;
    Equity: string;
    Loan: string;
    NetYield: string;
    GrossYield: string;
    Cashflow: string;
    CashOnCash: string;
    Deposit: string;
    Note: string;
    Basis: string;
    FileNo: string;
    Key: string;
  };
  Status: Record<HoldingStatus, string>;
  Cells: {
    Missing: string;
    NoLimit: string;
    NoValue: string;
    Unreachable: string;
    NoPrice: string;
    Incomplete: string;
    BasisPrice: string;
    BasisLimit: string;
    OpenListing: string;
    PriceHint: string;
  };
  Export: { Csv: string; Hint: string };
}
