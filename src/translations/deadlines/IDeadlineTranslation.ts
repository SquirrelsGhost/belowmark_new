import { MarketCode } from "../../lib/constants";
import { IMetaTags } from "../../services/MetaTagService";
import { DeadlineBasis, DeadlineKind, DeadlinePhase } from "../../types/deadline.types";

/** Text of one dated entry; {placeholders} are filled with `fill()`. */
export interface DeadlineText {
  Title: string;
  Detail: string;
}

/** One step of the preparation list (link targets are added in code). */
export interface DeadlineStepText {
  id: string;
  Label: string;
  Hint: string;
}

/**
 * Strings of the Termin-Begleiter (deadlines, reminders, calendar feed). Own
 * namespace like verdict and bankFile, so the shared app dictionary stays untouched.
 */
export interface IDeadlineTranslation {
  MetaTags: IMetaTags;
  Nav: string;

  Section: {
    Eyebrow: string;
    Title: string;
    Lead: Record<MarketCode, string>;
    Locked: { Title: string; Body: string };
    /** No date in the notice at all */
    NoDates: string;
    Cancelled: string;
    Phases: Record<DeadlinePhase, string>;
    Basis: Record<DeadlineBasis, string>;
    Kinds: Record<DeadlineKind, string>;
    /** Shown in the "after" phase while no module delivers entries yet */
    AfterAwardEmpty: string;
    Reminders: string;
    ReminderDay: string;
    ReminderDays: string;
    ReminderToday: string;
    Disclaimer: string;
  };

  Status: {
    Past: string;
    Today: string;
    Tomorrow: string;
    InDays: string;
  };

  Follow: {
    Start: string;
    Stop: string;
    Following: string;
    NotFollowing: string;
    MailOn: string;
    MailOff: string;
    Download: string;
    Overview: string;
    Error: string;
  };

  Checklist: {
    Title: string;
    Hint: string;
    Progress: string;
    Auto: string;
    Steps: Record<MarketCode, DeadlineStepText[]>;
  };

  Items: {
    DE: {
      Notice: DeadlineText;
      Transfer: DeadlineText;
      Cheque: DeadlineText;
      Hearing: DeadlineText;
      Award: DeadlineText;
      Amount: string;
    };
    TR: {
      Notice: DeadlineText;
      RoundStart: DeadlineText;
      Cash: DeadlineText;
      Letter: DeadlineText;
      RoundEnd: DeadlineText;
      Amount: string;
      StartingBid: string;
    };
  };

  Page: {
    Eyebrow: string;
    Title: string;
    Lead: string;
    Count: string;
    Empty: { Title: string; Body: string; Cta: string };
    Next: string;
    NothingAhead: string;
    OpenListing: string;
    Missing: string;
    Feed: {
      Title: string;
      Body: string;
      Create: string;
      Renew: string;
      Copy: string;
      Copied: string;
      Shown: string;
      Hidden: string;
      Error: string;
    };
    HowItWorks: string;
  };

  Mail: {
    Subject: string;
    SubjectOne: string;
    Preheader: string;
    Greeting: string;
    Intro: string;
    Today: string;
    Tomorrow: string;
    InDays: string;
    OpenListing: string;
    Manage: string;
    Signature: string;
    Footer: string;
    Source: string;
  };

  Ics: {
    CalendarName: string;
    Source: string;
  };
}
