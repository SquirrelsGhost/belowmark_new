/**
 * Translation contract of the Turkish market extras: value age (TÜFE), euro
 * equivalents (TCMB rate), the e-Satış check kit and the currency converter.
 * Kept apart from IAppTranslation so parallel work on the app strings does
 * not collide.
 */
export interface ITrMarketTranslation {
  Age: {
    Title: string;
    Lead: string;
    FileYear: string;
    /** "Wertfestsetzung spätestens Dezember {year}" */
    Basis: string;
    Factor: string;
    Lost: string;
    /** "Schätzwert in Lira von {month}" */
    Today: string;
    TodayNote: string;
    /** "Akte aus {year}: …" */
    Young: string;
    NoYear: string;
    Unavailable: string;
    /** "{label}, {source} · Stand {month}" */
    Source: string;
  };

  Euro: {
    Title: string;
    Value: string;
    StartingBid: string;
    AllIn: string;
    /** "1 € = {rate} · TCMB-Devisenankaufskurs vom {date}" */
    Rate: string;
    Note: string;
    Unavailable: string;
    /** " (letzter Kurs vom {date})" */
    LastRate: string;
  };

  CheckKit: {
    Title: string;
    Lead: string;
    Copy: string;
    Copied: string;
    Open: string;
    NotStated: string;
  };

  Converter: {
    Title: string;
    Subtitle: string;
    Lira: string;
    Euro: string;
    Unavailable: string;
  };
}
