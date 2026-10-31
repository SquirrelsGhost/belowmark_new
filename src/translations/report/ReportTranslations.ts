import { Locale } from "../Translations";
import { REPORT_DE } from "./de/reportDe";
import { REPORT_EN } from "./en/reportEn";
import { REPORT_ES } from "./es/reportEs";
import { REPORT_FR } from "./fr/reportFr";
import { IReportTranslation } from "./IReportTranslation";
import { REPORT_IT } from "./it/reportIt";
import { REPORT_TR } from "./tr/reportTr";

export const ReportTranslations: Record<Locale, IReportTranslation> = {
  [Locale.DE]: REPORT_DE,
  [Locale.TR]: REPORT_TR,
  [Locale.EN]: REPORT_EN,
  [Locale.IT]: REPORT_IT,
  [Locale.ES]: REPORT_ES,
  [Locale.FR]: REPORT_FR,
};
