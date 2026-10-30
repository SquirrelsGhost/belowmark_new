import { MarketCode } from "../../lib/constants";
import { ClosingErrorCode } from "../../lib/closing/closingActions";
import { IMetaTags } from "../../services/MetaTagService";
import { ClosingBasis, ClosingCondition, ClosingDateField, ClosingPhase, ClosingTaskState, HearingOutcome, ResultSource } from "../../types/closing.types";

export interface ClosingTaskText {
  title: string;
  detail: string;
}

/**
 * Strings of the after-Zuschlag module: the result form on the Aktenblatt, the
 * task list and the results statistics. Own namespace like bidding and bankFile.
 * Task texts exist per market in both languages. Placeholders in braces are filled with `fill()`.
 */
export interface IClosingTranslation {
  MetaTags: { Tasks: IMetaTags; Results: IMetaTags };

  Section: {
    Eyebrow: string;
    Title: string;
    Lead: Record<MarketCode, string>;
  };

  Result: {
    Title: string;
    Lead: string;
    NotYet: string;
    HearingDate: string;
    Outcome: string;
    Outcomes: Record<HearingOutcome, string>;
    HighestBid: Record<MarketCode, { label: string; hint: string }>;
    RetainedRights: { label: string; hint: string };
    BidderCount: { label: string; hint: string };
    Source: string;
    Sources: Record<ResultSource, string>;
    IsBuyer: Record<MarketCode, string>;
    AwardDate: Record<MarketCode, { label: string; hint: string }>;
    Shared: { label: string; hint: string };
    Privacy: string;
    Save: string;
    Saved: string;
    SavedBuyer: string;
    Errors: Record<ClosingErrorCode, string>;
    Ratio: string;
    StatsLink: string;
  };

  Teaser: {
    Title: string;
    Lead: string;
    Button: string;
    Progress: string;
    Next: string;
    NoDate: string;
  };

  Tasks: {
    Kicker: string;
    Title: string;
    Lead: Record<MarketCode, string>;
    Back: string;
    Disclaimer: string;
    Locked: { Title: string; Body: string; Cta: string };
    Dates: {
      Title: string;
      Lead: string;
      Fields: Record<MarketCode, Partial<Record<ClosingDateField, { label: string; hint: string }>>>;
      FromPortfolio: string;
      Save: string;
      Saved: string;
      Required: string;
      Errors: Partial<Record<ClosingErrorCode, string>>;
    };
    Conditions: { Title: string; Lead: string; Items: Record<ClosingCondition, string> };
    Phases: Record<ClosingPhase, string>;
    Due: Record<"deadline" | "earliest" | "on", string>;
    Missing: string;
    States: Record<ClosingTaskState, string>;
    Basis: Record<ClosingBasis, string>;
    Check: string;
    MarkDone: string;
    MarkOpen: string;
    Sources: string;
    Progress: string;
    Items: Record<MarketCode, Record<string, ClosingTaskText>>;
  };

  Results: {
    Kicker: string;
    Title: string;
    Lead: string;
    Method: { Title: string; Items: string[] };
    Table: { Region: string; Segment: string; Awarded: string; Median: string; Range: string; Bidders: string; Reported: string };
    AllSegments: string;
    Total: string;
    OtherRegion: string;
    TooFew: string;
    Empty: string;
    Locked: string;
    Own: { Title: string; Lead: string; Empty: string; Shared: string; Private: string; Buyer: string };
  };
}
