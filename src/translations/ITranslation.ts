import { IMetaTags } from "../services/MetaTagService";

/**
 * Master translation contract.
 *
 * Every locale file (en/en.ts, de/de.ts, …) must implement this interface.
 * TypeScript will fail to compile if a locale is missing a key — no silent
 * missing-string bugs at runtime.
 *
 * HOW TO ADD NEW STRINGS:
 *  1. Add the key here under the correct namespace.
 *  2. Add the value to every locale file.
 *  3. Done — TypeScript will tell you if you missed a locale.
 */

export interface ITextBlock {
  Title: string;
  Description: string;
}

export interface IStat {
  Value: string;
  Label: string;
}

export interface ISectionHeading {
  Eyebrow: string;
  Title: string;
  TitleAccent: string;
  Description: string;
}

export interface ITranslation {
  Navigation: {
    HomeLabel: string;
    FeaturesLabel: string;
    ProcessLabel: string;
    StatsLabel: string;
    ContactLabel: string;
    LoginLabel: string;
    SignupLabel: string;
    LocaleSwitchLabel: string;
    MainNavLabel: string;
  };

  HomePage: {
    MetaTags: IMetaTags;

    Hero: {
      Eyebrow: string;
      HeadlineStart: string;
      HeadlineAccent: string;
      Description: string;
      PrimaryCta: string;
      SecondaryCta: string;
      Note: string;
    };

    Preview: {
      WindowTitle: string;
      MetricLabel: string;
      MetricValue: string;
      MetricDelta: string;
      LiveLabel: string;
      RowOne: string;
      RowTwo: string;
      RowThree: string;
    };

    Marquee: {
      Label: string;
    };

    Features: ISectionHeading & {
      Precision: ITextBlock;
      Speed: ITextBlock;
      Security: ITextBlock;
      Insights: ITextBlock;
      Collaboration: ITextBlock;
      Integrations: ITextBlock;
    };

    Process: ISectionHeading & {
      StepOne: ITextBlock;
      StepTwo: ITextBlock;
      StepThree: ITextBlock;
    };

    Stats: {
      Uptime: IStat;
      Latency: IStat;
      Teams: IStat;
      Rating: IStat;
    };

    Cta: {
      Title: string;
      TitleAccent: string;
      Description: string;
      PrimaryCta: string;
      SecondaryCta: string;
    };
  };

  Footer: {
    Tagline: string;
    ProductTitle: string;
    CompanyTitle: string;
    LegalTitle: string;
    PrivacyLabel: string;
    ImprintLabel: string;
    Rights: string;
  };
}
