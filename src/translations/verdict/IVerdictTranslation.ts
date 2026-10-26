import { MarketCode } from "../../lib/constants";
import { VerdictAnswerKey, VerdictReasonCode, VerdictSeverity, VerdictState } from "../../types/verdict.types";

/**
 * Strings of the verdict "bid or leave it". Own namespace, like bidding and
 * report, so the shared app dictionary stays untouched. Placeholders in curly
 * braces are filled with `fill()`: {amount} {other} {years} {risk} {criterion} {page} {pct} {limit}.
 */
export interface IVerdictTranslation {
  Section: {
    Eyebrow: string;
    Title: string;
    Lead: string;
    Disclaimer: string;
  };
  Locked: { Title: string; Body: string };

  States: Record<VerdictState, { Stamp: string; Headline: string; Sub: string }>;
  /** Added to "go" while the renovation figure rests on no inspection or only an own estimate */
  GoUnverified: string;
  /** "open" without any limit yet */
  OpenNoLimit: { Headline: string; Sub: string };
  Groups: Record<VerdictSeverity, string>;

  Reasons: Record<VerdictReasonCode, string>;
  /** Market-specific wording where the law differs */
  MarketReasons: Partial<Record<VerdictReasonCode, Record<MarketCode, string>>>;
  /** Link texts of the open points to the place where they are closed */
  Actions: Record<"limit" | "report" | "questions", string>;

  Sources: {
    Label: string;
    notice: string;
    report: string;
    input: string;
    answer: string;
    rule: string;
  };

  Questions: {
    Title: string;
    Lead: string;
    Items: Record<VerdictAnswerKey, { Label: string; Hint: string; Options: Record<string, string> }>;
    /** The rights question depends on the land register system */
    Rights: Record<MarketCode, { Label: string; Hint: string }>;
    Unanswered: string;
    Reset: string;
    StorageHint: string;
  };

  Stress: {
    Title: string;
    Lead: string;
    Row: string;
    Unreachable: string;
    BelowThreshold: string;
    NoLimit: string;
  };

  Unknowables: {
    Title: string;
    Items: string[];
  };

  File: {
    Title: string;
  };
}
