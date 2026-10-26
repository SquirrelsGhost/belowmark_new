import { Locale } from "../Translations";
import { IReportTranslation } from "./IReportTranslation";
import { REPORT_DE } from "./de/reportDe";
import { REPORT_TR } from "./tr/reportTr";

export const ReportTranslations: Record<Locale, IReportTranslation> = {
  [Locale.DE]: REPORT_DE,
  [Locale.TR]: REPORT_TR,
};
