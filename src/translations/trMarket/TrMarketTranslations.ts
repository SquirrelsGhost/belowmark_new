import { Locale } from "../Translations";
import { TR_MARKET_DE } from "./de/de";
import { TR_MARKET_EN } from "./en/en";
import { TR_MARKET_ES } from "./es/es";
import { TR_MARKET_FR } from "./fr/fr";
import { ITrMarketTranslation } from "./ITrMarketTranslation";
import { TR_MARKET_IT } from "./it/it";
import { TR_MARKET_TR } from "./tr/tr";

export const TrMarketTranslations: Record<Locale, ITrMarketTranslation> = {
  [Locale.DE]: TR_MARKET_DE,
  [Locale.TR]: TR_MARKET_TR,
  [Locale.EN]: TR_MARKET_EN,
  [Locale.IT]: TR_MARKET_IT,
  [Locale.ES]: TR_MARKET_ES,
  [Locale.FR]: TR_MARKET_FR,
};
