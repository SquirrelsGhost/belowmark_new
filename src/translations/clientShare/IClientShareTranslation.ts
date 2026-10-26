import { IMetaTags } from "../../services/MetaTagService";
import { ClientShareErrorCode, ClientShareSection, ClientShareStatus } from "../../types/clientShare.types";

/**
 * Strings of the client links ("Kundenlinks") and the broker letterhead.
 * Own namespace like bidding and bankFile, so the shared dictionaries stay
 * untouched. Placeholders in braces are filled with `fill()`.
 */
export interface IClientShareTranslation {
  MetaTags: { Manage: IMetaTags; Public: IMetaTags };
  Nav: string;

  /** Block on the Aktenblatt: make a link for a client */
  Teaser: {
    Eyebrow: string;
    Title: string;
    Lead: string;
    ProOnly: string;
    ProCta: string;
    NoBrand: string;
    NoBrandCta: string;
    Manage: string;
  };

  Form: {
    Sections: string;
    SectionNames: Record<ClientShareSection, string>;
    SectionHints: Record<ClientShareSection, string>;
    Expiry: string;
    ExpiryOption: string;
    Language: string;
    Languages: Record<"de" | "tr", string>;
    Label: string;
    LabelHint: string;
    Message: string;
    MessagePlaceholder: string;
    Frozen: string;
    Submit: string;
    Submitting: string;
  };

  Created: {
    Title: string;
    Once: string;
    Copy: string;
    Copied: string;
    Open: string;
    Pdf: string;
  };

  Errors: Record<ClientShareErrorCode, string>;

  Manage: {
    Eyebrow: string;
    Title: string;
    Lead: string;
    Locked: { Title: string; Body: string; Cta: string };
  };

  Brand: {
    Title: string;
    Lead: string;
    DisplayName: string;
    Contact: string;
    ContactHint: string;
    Website: string;
    Imprint: string;
    ImprintHint: string;
    Accent: string;
    AccentHint: string;
    Save: string;
    Saved: string;
    Logo: string;
    LogoHint: string;
    LogoUpload: string;
    LogoRemove: string;
    LogoNeedsBrand: string;
    Preview: string;
  };

  Links: {
    Title: string;
    Usage: string;
    Empty: { Title: string; Body: string; Cta: string };
    Status: Record<ClientShareStatus, string>;
    Created: string;
    Expires: string;
    Ended: string;
    Views: string;
    ViewsOne: string;
    LastViewed: string;
    NeverViewed: string;
    Language: string;
    OpenListing: string;
    Revoke: string;
    Delete: string;
    Renew: string;
    RenewDone: string;
    Error: string;
    Purge: string;
  };

  Privacy: { Title: string; Items: string[] };

  Public: {
    Kicker: string;
    Title: string;
    PreparedBy: string;
    AssessedAt: string;
    DataAsOf: string;
    ValidUntil: string;
    MessageFrom: string;
    Print: string;
    PrintHint: string;
    Sections: Record<"hearing" | "facts" | "money" | "verdict" | "limit" | "financing" | "sources", string>;
    NoInputs: string;
    NoValue: string;
    Financing: {
      Uses: string;
      Sources: string;
      Bid: string;
      BidFromLimit: string;
      BidOwn: string;
      Total: string;
      Equity: string;
      Loan: string;
      LoanToValue: string;
      MonthlyRate: string;
      MonthlyRateNote: string;
      Incomplete: string;
    };
    Unavailable: { Title: string; Body: string };
    Footer: {
      Responsible: string;
      Disclaimer: string;
      MadeWith: string;
      Privacy: string;
      Imprint: string;
    };
  };
}
