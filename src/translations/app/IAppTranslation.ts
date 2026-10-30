import { SegmentKey } from "../../lib/snapshot";
import { IMetaTags } from "../../services/MetaTagService";
import { ListingScope, ListingSort } from "../../types/listing.types";

/**
 * Strings of the signed-in app area (/app). Lives in its own file so the app
 * and the landing page can grow without stepping on each other; it is wired
 * into ITranslation as the `App` namespace.
 *
 * Placeholders in curly braces ({count}, {date}, …) are filled with `fill()`.
 */
export interface IAppTranslation {
  MetaTags: {
    Search: IMetaTags;
    Listing: IMetaTags;
    Watchlist: IMetaTags;
    Calculator: IMetaTags;
  };

  Shell: {
    NavLabel: string;
    SkipToContent: string;
    Search: string;
    Watchlist: string;
    Calculator: string;
    Account: string;
    SignOut: string;
    Market: Record<"DE" | "TR", string>;
    TrialRunning: string;
    TrialLastDay: string;
    FreePlan: string;
    Upgrade: string;
    DataAsOf: string;
    SourceLabel: string;
    Principle: string;
  };

  Segments: Record<SegmentKey, string>;

  Search: {
    Eyebrow: Record<"DE" | "TR", string>;
    Title: string;
    Lead: Record<"DE" | "TR", string>;
    Filters: {
      Title: string;
      Query: string;
      QueryPlaceholder: Record<"DE" | "TR", string>;
      Region: Record<"DE" | "TR", string>;
      AllRegions: string;
      Segment: string;
      AllSegments: string;
      Value: Record<"DE" | "TR", string>;
      Min: string;
      Max: string;
      Any: string;
      Scope: string;
      Scopes: Record<ListingScope, string>;
      WithCancelled: string;
      From: string;
      To: string;
      Apply: string;
      Reset: string;
    };
    SortLabel: string;
    Sorts: Record<ListingSort, string>;
    Summary: string;
    SummaryOne: string;
    NextSevenDays: string;
    Calendar: {
      Title: string;
      Hint: string;
      Week: string;
      Clear: string;
      Selected: string;
    };
    Empty: {
      Title: string;
      Body: string;
      Reset: string;
    };
    Pagination: {
      Label: string;
      Previous: string;
      Next: string;
      Page: string;
    };
  };

  Row: {
    Running: string;
    RunningToday: string;
    Upcoming: string;
    Today: string;
    Tomorrow: string;
    Past: string;
    Cancelled: string;
    Unknown: string;
    Round: string;
    New: string;
    Value: Record<"DE" | "TR", string>;
    NoValue: string;
    EntryDe: string;
    EntryTr: string;
    Waived: string;
    Watch: string;
    Unwatch: string;
    WatchError: string;
    Open: string;
    Locked: string;
  };

  Listing: {
    Back: string;
    FactsTitle: string;
    FileNo: string;
    Authority: Record<"DE" | "TR", string>;
    Hearing: string;
    Rounds: string;
    Address: string;
    Region: Record<"DE" | "TR", string>;
    Segment: string;
    Value: Record<"DE" | "TR", string>;
    ValueBasis: Record<"DE" | "TR", string>;
    NotStated: string;
    FileYear: string;
    FirstSeen: string;
    LimitsTitle: string;
    Half: string;
    SevenTenths: string;
    Deposit: string;
    TransferTax: string;
    EntryAtHalf: string;
    WaivedNote: string;
    CalculatorTitle: string;
    CalculatorNote: string;
    Sources: {
      Title: string;
      Official: string;
      OfficialNote: Record<"DE" | "TR", string>;
      Map: string;
      Geoportal: string;
      Calendar: string;
      CopyFileNo: string;
      Copied: string;
    };
    Caveats: {
      Title: string;
      Empty: string;
      Points: string;
    };
    Checklist: {
      Title: string;
      Hint: string;
      Progress: string;
      Items: Record<"DE" | "TR", string[]>;
    };
    Note: {
      Title: string;
      Placeholder: string;
      Save: string;
      Saved: string;
      Error: string;
      Hint: string;
    };
    Locked: {
      Title: string;
      Body: string;
      Cta: string;
    };
    NotFound: {
      Title: string;
      Body: string;
    };
    Tr: {
      Parcel: string;
      Mahalle: string;
      LandArea: string;
      BuildingArea: string;
      NetArea: string;
      UsableArea: string;
      PricePerM2: string;
      Rooms: string;
      Floor: string;
      YearBuilt: string;
      Grundbuch: string;
      ArsaPayi: string;
      UnitNoPrefix: string;
      Condo: string;
      StartingBid: string;
      StartingBidNote: string;
      Deposit: string;
      CostsTitle: string;
      Costs: Record<"kdv" | "tapuHarci" | "damgaVergisi" | "donerSermaye", string>;
      AllIn: string;
      VatUnknown: string;
      Tellaliye: string;
      CostsAsOf: string;
      MarketTitle: string;
      MarketMedian: string;
      Discount: string;
      Sample: string;
      Confidence: string;
      NoMarket: string;
      BidLabel: string;
      Hits: string;
    };
  };

  Watchlist: {
    Eyebrow: string;
    Title: string;
    Lead: string;
    Count: string;
    ExportAll: string;
    Upcoming: string;
    Past: string;
    NoNote: string;
    EditNote: string;
    Remove: string;
    Missing: string;
    Empty: {
      Title: string;
      Body: string;
      Cta: string;
    };
  };

  Calculator: {
    Eyebrow: string;
    Title: string;
    Lead: Record<"DE" | "TR", string>;
    Tr: {
      Title: string;
      Subtitle: string;
      ValueLabel: string;
      VatLabel: string;
      VatNone: string;
      Footnote: string;
    };
  };

  Ics: {
    Summary: string;
    Description: string;
  };

  Views: {
    Label: string;
    List: string;
    Map: string;
  };

  Quick: {
    Label: string;
    Opportunity: Record<"DE" | "TR", string>;
    WithDocs: Record<"DE" | "TR", string>;
    ThisWeek: string;
    NextMonth: string;
    Houses: string;
    Apartments: string;
    UpTo: string;
  };

  SearchMap: {
    Hint: Record<"DE" | "TR", string>;
    Imminent: string;
    Later: string;
    Size: string;
    OffMap: string;
    Several: string;
    ShowHere: string;
    Open: string;
    Basis: string;
    AllRegions: string;
    RegionCount: string;
  };

  Location: {
    Title: string;
    Precision: Record<"postcode" | "province", string>;
    Scale: string;
    Levels: [string, string, string];
    OpenLarge: string;
    Locator: string;
    NoGeo: string;
    Loading: string;
  };

  Media: {
    Title: string;
    Slot: Record<"DE" | "TR", string>;
    Body: Record<"DE" | "TR", string>;
    Announcement: string;
    Portal: Record<"DE" | "TR", string>;
    StreetView: string;
    Aerial: string;
    Parcel: string;
  };

  Evidence: {
    Title: string;
    Lead: string;
    Figure: string;
    Basis: string;
    Source: string;
    Items: Record<"DE" | "TR", { figure: string; basis: string; source: string; url: string }[]>;
    Notice: string;
  };

  History: {
    Title: string;
    Hint: string;
  };

  Compare: {
    Plan: string;
    Compare: string;
    Title: string;
    NeedTwo: string;
    Best: string;
    Rows: {
      Place: string;
      Segment: string;
      Hearing: string;
      Value: Record<"DE" | "TR", string>;
      Entry: Record<"DE" | "TR", string>;
      Limit: Record<"DE" | "TR", string>;
      Deposit: string;
      AllIn: Record<"DE" | "TR", string>;
      Authority: Record<"DE" | "TR", string>;
      Note: string;
    };
  };
}
