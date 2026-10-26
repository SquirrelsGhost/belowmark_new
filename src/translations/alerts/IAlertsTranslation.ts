import { MarketCode } from "../../lib/constants";
import { IMetaTags } from "../../services/MetaTagService";
import { AlertChangeKind } from "../../types/alert.types";

/** Error codes of the alert actions, translated only in the interface. */
export type AlertErrorCode = "limit" | "invalid" | "failed";

/**
 * Translation contract of the saved-search alerts: the save form on the
 * search page, the management page and the mail. Kept apart from
 * IAppTranslation so parallel work on the app strings does not collide.
 */
export interface IAlertsTranslation {
  MetaTags: IMetaTags;
  Nav: string;

  Page: {
    Eyebrow: string;
    Title: string;
    Lead: string;
    /** "{count} von {max} Alerts" */
    Usage: string;
    Empty: { Title: string; Body: string; Cta: string };
    HowItWorks: string;
  };

  Card: {
    Active: string;
    Paused: string;
    Pause: string;
    Resume: string;
    Delete: string;
    OpenSearch: string;
    /** "{count} offene Treffer" */
    Matches: string;
    MatchesOne: string;
    NotifyNew: string;
    NotifyChanges: string;
    /** "Letzte Mail: {date}" */
    LastSent: string;
    NeverSent: string;
    /** "Geprüft: {date}" */
    LastChecked: string;
    Error: string;
  };

  Summary: {
    AllRegions: Record<MarketCode, string>;
    AllSegments: string;
    /** "„{query}“" */
    Query: string;
    /** "ab {value}" */
    Min: string;
    /** "bis {value}" */
    Max: string;
  };

  Save: {
    Toggle: string;
    Title: string;
    NameLabel: string;
    NotifyNew: string;
    NotifyChanges: string;
    Hint: string;
    Submit: string;
    Pending: string;
    Saved: string;
    Manage: string;
    Errors: Record<AlertErrorCode, string>;
  };

  Mail: {
    /** "{count} Neuigkeiten zu Ihren Alerts" */
    Subject: string;
    SubjectOne: string;
    Preheader: string;
    Greeting: string;
    Intro: string;
    Kinds: Record<"new" | AlertChangeKind, string>;
    /** "Termin {date}" */
    NextDate: string;
    /** "vorher {before}, jetzt {after}" */
    Moved: string;
    Value: Record<MarketCode, string>;
    /** "+ {count} weitere" */
    More: string;
    OpenSearch: string;
    LockedValues: string;
    Manage: string;
    Source: Record<MarketCode, string>;
    Signature: string;
    Footer: string;
  };
}
