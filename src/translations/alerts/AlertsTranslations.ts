import { Locale } from "../Translations";
import { ALERTS_DE } from "./de/de";
import { IAlertsTranslation } from "./IAlertsTranslation";
import { ALERTS_TR } from "./tr/tr";

export const AlertsTranslations: Record<Locale, IAlertsTranslation> = {
  [Locale.DE]: ALERTS_DE,
  [Locale.TR]: ALERTS_TR,
};
