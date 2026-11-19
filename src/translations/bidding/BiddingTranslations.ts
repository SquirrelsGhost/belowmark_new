import { LocaleOption } from "../../lib/constants";
import { Locale } from "../Translations";
import { BIDDING_CS } from "./cs/cs";
import { BIDDING_DE } from "./de/de";
import { BIDDING_EN } from "./en/en";
import { BIDDING_ES } from "./es/es";
import { BIDDING_FR } from "./fr/fr";
import { IBiddingTranslation } from "./IBiddingTranslation";
import { BIDDING_IT } from "./it/it";
import { BIDDING_NL } from "./nl/nl";
import { BIDDING_PL } from "./pl/pl";
import { BIDDING_SV } from "./sv/sv";
import { BIDDING_TR } from "./tr/tr";

export const BiddingTranslations: Record<Locale, IBiddingTranslation> = {
  [Locale.DE]: BIDDING_DE,
  [Locale.TR]: BIDDING_TR,
  [Locale.EN]: BIDDING_EN,
  [Locale.IT]: BIDDING_IT,
  [Locale.ES]: BIDDING_ES,
  [Locale.FR]: BIDDING_FR,
  [Locale.PL]: BIDDING_PL,
  [Locale.CS]: BIDDING_CS,
  [Locale.NL]: BIDDING_NL,
  [Locale.SV]: BIDDING_SV,
};

/** The bidding strings for the lower-case locale the app pages carry around. */
export const getBiddingTranslation = (locale: LocaleOption): IBiddingTranslation =>
  BiddingTranslations[(locale.toUpperCase() as Locale)] ?? BIDDING_DE;
