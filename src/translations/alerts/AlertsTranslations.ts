import { Locale } from "../Translations";
import { ALERTS_DE } from "./de/de";
import { ALERTS_EN } from "./en/en";
import { ALERTS_ES } from "./es/es";
import { ALERTS_FR } from "./fr/fr";
import { IAlertsTranslation } from "./IAlertsTranslation";
import { ALERTS_IT } from "./it/it";
import { ALERTS_TR } from "./tr/tr";

export const AlertsTranslations: Record<Locale, IAlertsTranslation> = {
  [Locale.DE]: ALERTS_DE,
  [Locale.TR]: ALERTS_TR,
  [Locale.EN]: ALERTS_EN,
  [Locale.IT]: ALERTS_IT,
  [Locale.ES]: ALERTS_ES,
  [Locale.FR]: ALERTS_FR,
};
