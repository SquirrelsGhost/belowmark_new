import { MarketCode } from "../../lib/constants";
import { IMetaTags } from "../../services/MetaTagService";
import { BidInputKey, ComparisonFigure, ComparisonGap, CostCode, LimitCriterion, LimitVerdict, OwnComparable } from "../../types/bidding.types";

/**
 * Strings of the bid limit, the comparison values and the bidder file. Kept
 * in their own namespace (like the auth strings) so the app translations are
 * not touched by this feature. Placeholders in curly braces are filled with `fill()`.
 */
export interface IBiddingTranslation {
  MetaTags: { BidderFile: IMetaTags };

  Section: {
    Eyebrow: string;
    Title: string;
    Lead: string;
  };

  Comparables: {
    Title: string;
    Lead: Record<MarketCode, string>;
    Kinds: Record<ComparisonFigure["id"], string>;
    PerM2: string;
    ObjectPerM2: string;
    Scope: string;
    Sample: string;
    Confidence: string;
    AsOf: string;
    Source: string;
    Gaps: Record<ComparisonGap, string>;
    /** Why no discount is computed against the official series */
    GrossNetNote: string;
    Lookups: {
      Title: string;
      Hint: string;
      Names: Record<"boris" | "geoportal" | "zensus" | "tcmb", string>;
    };
    Own: {
      Title: string;
      Hint: string;
      Kind: string;
      Kinds: Record<OwnComparable["kind"], string>;
      Value: string;
      Unit: string;
      Units: Record<OwnComparable["unit"], string>;
      Source: string;
      SourcePlaceholder: string;
      AsOf: string;
      Add: string;
      Remove: string;
      Empty: string;
      Tag: string;
      Invalid: string;
    };
  };

  Limit: {
    Title: string;
    Subtitle: string;
    Lead: string;
    Groups: Record<"object" | "costs" | "income" | "financing" | "targets", string>;
    Fields: Record<BidInputKey, { label: string; hint: string }>;
    Result: {
      Label: string;
      NeedsInputs: string;
      Unreachable: string;
      AtCeiling: string;
      DecidedBy: string;
      Criteria: Record<LimitCriterion, string>;
      CriterionUnused: string;
      PerCriterion: string;
      OfValue: string;
    };
    Verdicts: Record<LimitVerdict, string>;
    Costs: {
      Title: string;
      Bid: string;
      Total: string;
      Deposit: string;
      DepositNote: Record<MarketCode, string>;
      Lines: Record<CostCode, string>;
      Basis: Partial<Record<CostCode, string>>;
      Unknown: string;
      Own: string;
      Incomplete: string;
      AsOf: string;
    };
    Returns: {
      Title: string;
      Gross: string;
      Net: string;
      Cashflow: string;
      CashOnCash: string;
      Loan: string;
      PricePerM2: string;
      Missing: string;
      BeforeTax: string;
    };
    Reset: string;
    StorageHint: string;
    DaysSuffix: string;
    NoticeArea: string;
  };

  File: {
    Button: string;
    ButtonHint: string;
    Title: string;
    Kicker: string;
    PrintedAt: string;
    DataAsOf: string;
    Print: string;
    PrintHint: string;
    Back: string;
    Sections: Record<"facts" | "hearing" | "money" | "limit" | "comparables" | "checklist" | "note" | "sources", string>;
    HearingNotes: Record<MarketCode, string[]>;
    NoLimit: string;
    NoNote: string;
    ChecklistDone: string;
    ChecklistOpen: string;
    Disclaimer: string;
    SourceNames: Record<"notice" | "document" | "geoportal" | "zvg" | "gkg" | "gnotkg" | "esatis", string>;
    Locked: string;
  };
}
