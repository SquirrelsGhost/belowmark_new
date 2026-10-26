import { LocaleOption } from "../../lib/constants";
import { Locale } from "../Translations";
import { BIDDING_DE } from "./de/de";
import { IBiddingTranslation } from "./IBiddingTranslation";
import { BIDDING_TR } from "./tr/tr";

export const BiddingTranslations: Record<Locale, IBiddingTranslation> = {
  [Locale.DE]: BIDDING_DE,
  [Locale.TR]: BIDDING_TR,
};

/** The bidding strings for the lower-case locale the app pages carry around. */
export const getBiddingTranslation = (locale: LocaleOption): IBiddingTranslation => (locale === "tr" ? BIDDING_TR : BIDDING_DE);
