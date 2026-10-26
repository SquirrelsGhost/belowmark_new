import { FindingStance, ReportFactKey, ReportKind, ReportTopic, RiskKey, RiskLevel } from "../../types/report.types";

/**
 * Strings of the Gutachten reader and the risk check on the Aktenblatt.
 * Kept apart from IAppTranslation so this feature can grow without touching
 * the shared app dictionary. Placeholders in braces are filled with `fill()`.
 */
export interface IReportTranslation {
  Risk: {
    Title: string;
    Lead: string;
    Levels: Record<RiskLevel, string>;
    Names: Record<RiskKey, string>;
    /** What to do next, per risk — shown under the sources */
    Hints: Record<RiskKey, string>;
    UnknownBody: string;
    Conflicting: string;
    SourceNotice: string;
    SourceReport: string;
    Page: string;
    Stances: Record<FindingStance, string>;
    WithoutReport: string;
    WithReport: string;
    Disclaimer: string;
  };

  Report: {
    Title: string;
    Lead: string;
    Policy: string;
    Upload: {
      Label: string;
      Hint: string;
      Choose: string;
      Submit: string;
      Pending: string;
      Replace: string;
      Remove: string;
      RemoveConfirm: string;
      Errors: Record<string, string>;
    };
    Locked: { Title: string; Body: string; Cta: string };
    Meta: string;
    MethodRules: string;
    MethodAi: string;
    Dropped: string;
    ScanWarning: string;
    FactsTitle: string;
    Facts: Record<ReportFactKey, string>;
    Topics: Record<ReportTopic, string>;
    Kinds: Record<ReportKind, string>;
    Stances: Record<FindingStance, string>;
    Page: string;
    AiNote: string;
    NothingFound: string;
    NotStated: string;
  };
}
