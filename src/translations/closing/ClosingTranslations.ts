import { LocaleOption } from "../../lib/constants";
import { Locale } from "../Translations";
import { CLOSING_CS } from "./cs/closingCs";
import { CLOSING_DE } from "./de/closingDe";
import { CLOSING_EN } from "./en/closingEn";
import { CLOSING_ES } from "./es/closingEs";
import { CLOSING_FR } from "./fr/closingFr";
import { IClosingTranslation } from "./IClosingTranslation";
import { CLOSING_IT } from "./it/closingIt";
import { CLOSING_NL } from "./nl/closingNl";
import { CLOSING_PL } from "./pl/closingPl";
import { CLOSING_SV } from "./sv/closingSv";
import { CLOSING_TR } from "./tr/closingTr";

export const ClosingTranslations: Record<Locale, IClosingTranslation> = {
  [Locale.DE]: CLOSING_DE,
  [Locale.TR]: CLOSING_TR,
  [Locale.EN]: CLOSING_EN,
  [Locale.IT]: CLOSING_IT,
  [Locale.ES]: CLOSING_ES,
  [Locale.FR]: CLOSING_FR,
  [Locale.PL]: CLOSING_PL,
  [Locale.CS]: CLOSING_CS,
  [Locale.NL]: CLOSING_NL,
  [Locale.SV]: CLOSING_SV,
};

/** The after-Zuschlag strings for the lower-case locale the app pages carry around. */
export const getClosingTranslation = (locale: LocaleOption): IClosingTranslation =>
  ClosingTranslations[(locale.toUpperCase() as Locale)] ?? CLOSING_DE;
