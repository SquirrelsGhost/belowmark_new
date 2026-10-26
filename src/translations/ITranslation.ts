import { IMetaTags } from "../services/MetaTagService";
import { MarketCode } from "../lib/constants";
import { SegmentKey } from "../lib/snapshot";
import { IAppTranslation } from "./app/IAppTranslation";

/**
 * Master translation contract.
 *
 * Every locale file (de/de.ts, tr/tr.ts, …) must implement this interface.
 * TypeScript will fail to compile if a locale is missing a key — no silent
 * missing-string bugs at runtime.
 *
 * HOW TO ADD NEW STRINGS:
 *  1. Add the key here under the correct namespace.
 *  2. Add the value to every locale file.
 *  3. Done — TypeScript will tell you if you missed a locale.
 */

export interface ISectionIntro {
  Eyebrow: string;
  Title: string;
  Description: string;
}

export interface ITextBlock {
  Title: string;
  Body: string;
}

export interface IMethodStep extends ITextBlock {
  Kicker: string;
}

export interface ICompareRow {
  Criterion: string;
  Manual: string;
  Belowmark: string;
}

export interface IPricingPlan {
  Name: string;
  Tagline: string;
  Price: string;
  Period: string;
  Features: string[];
  Cta: string;
  Note: string;
}

export interface IMarketPlans {
  /** Country name shown on the market switch */
  Label: string;
  /** What the market covers, e.g. "ZVG · 16 Bundesländer" */
  Scope: string;
  Free: IPricingPlan;
  Investor: IPricingPlan & { AltPrice: string; AltPeriod: string };
  Pro: IPricingPlan & { AltPrice: string; AltPeriod: string };
}

export interface IFaqItem {
  Question: string;
  Answer: string;
  Sources: string[];
}

export interface ITranslation {
  Navigation: {
    MainNavLabel: string;
    SkipToContent: string;
    CalculatorLabel: string;
    NoticeLabel: string;
    MethodLabel: string;
    StatesLabel: string;
    PricingLabel: string;
    FaqLabel: string;
    BlogLabel: string;
    LoginLabel: string;
    SignupLabel: string;
  };

  HomePage: {
    MetaTags: IMetaTags;

    Hero: {
      Dateline: string;
      LiveLabel: string;
      HeadlineTop: string;
      HeadlineBelow: string;
      LineLabel: string;
      Description: string;
      Principle: string;
      PrimaryCta: string;
      SecondaryCta: string;
      Note: string;
    };

    Calculator: {
      Title: string;
      Subtitle: string;
      ValueLabel: string;
      StateLabel: string;
      HearingLabel: string;
      FirstHearing: string;
      FollowUpHearing: string;
      BidLabel: string;
      ScaleMarket: string;
      LimitAbsolute: string;
      LimitRelative: string;
      Deposit: string;
      TransferTax: string;
      EntryTotal: string;
      BelowValue: string;
      VerdictRefused: string;
      VerdictContestable: string;
      VerdictClear: string;
      VerdictWaived: string;
      Footnote: string;
    };

    Ticker: {
      Label: string;
      CourtPrefix: string;
      HearingPrefix: string;
      ValueHidden: string;
      Segments: Record<SegmentKey, string>;
    };

    Stats: {
      AsOf: string;
      Proceedings: string;
      WithAppraisal: string;
      States: string;
      TotalValue: string;
      Median: string;
    };

    Notice: ISectionIntro & {
      Paragraphs: string[];
      Redaction: string;
      Card: {
        Example: string;
        Court: string;
        FileNo: string;
        Kind: string;
        KindValue: string;
        State: string;
        StateValue: string;
        Appraisal: string;
        Limit: string;
        Hearing: string;
        HearingValue: string;
        Stamp: string;
        HintsTitle: string;
        Hints: string[];
        PortalLink: string;
        PdfLink: string;
      };
    };

    Method: ISectionIntro & {
      StepOne: IMethodStep;
      StepTwo: IMethodStep;
      StepThree: IMethodStep;
      Disclaimer: ITextBlock;
    };

    States: ISectionIntro & {
      ColState: string;
      ColHearings: string;
      ColTax: string;
      NotPublished: string;
      Footnote: string;
    };

    Limits: ISectionIntro & {
      ItemOne: ITextBlock;
      ItemTwo: ITextBlock;
      ItemThree: ITextBlock;
      ItemFour: ITextBlock;
      Rule: ITextBlock;
    };

    Compare: ISectionIntro & {
      ColCriterion: string;
      ColManual: string;
      ColBelowmark: string;
      Rows: ICompareRow[];
    };

    Pricing: ISectionIntro & {
      Recommended: string;
      AltPricePrefix: string;
      MarketLabel: string;
      MarketDetected: string;
      MarketHint: string;
      Markets: Record<MarketCode, IMarketPlans>;
      Disclaimer: string;
    };

    Faq: ISectionIntro & {
      SourceLabel: string;
      Items: IFaqItem[];
      MoreTitle: string;
      MoreCta: string;
    };

    Closing: {
      TitleTop: string;
      TitleBelow: string;
      Description: string;
      PrimaryCta: string;
      SecondaryCta: string;
    };
  };

  Footer: {
    Tagline: string;
    SourcesTitle: string;
    SourceZvg: string;
    SourceLaw: string;
    SourceJustiz: string;
    ProductTitle: string;
    LegalTitle: string;
    Imprint: string;
    Terms: string;
    Withdrawal: string;
    Privacy: string;
    Disclaimer: string;
    Rights: string;
  };

  /** Signed-in app area (/app) — strings live in translations/app, de/appDe.ts, tr/appTr.ts */
  App: IAppTranslation;
}
