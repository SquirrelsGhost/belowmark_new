import { Locale } from "../Translations";
import { TR_MARKET_DE } from "./de/de";
import { ITrMarketTranslation } from "./ITrMarketTranslation";
import { TR_MARKET_TR } from "./tr/tr";

export const TrMarketTranslations: Record<Locale, ITrMarketTranslation> = {
  [Locale.DE]: TR_MARKET_DE,
  [Locale.TR]: TR_MARKET_TR,
};
