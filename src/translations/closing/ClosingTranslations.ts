import { LocaleOption } from "../../lib/constants";
import { Locale } from "../Translations";
import { CLOSING_DE } from "./de/closingDe";
import { CLOSING_EN } from "./en/closingEn";
import { CLOSING_ES } from "./es/closingEs";
import { CLOSING_FR } from "./fr/closingFr";
import { IClosingTranslation } from "./IClosingTranslation";
import { CLOSING_IT } from "./it/closingIt";
import { CLOSING_TR } from "./tr/closingTr";

export const ClosingTranslations: Record<Locale, IClosingTranslation> = {
  [Locale.DE]: CLOSING_DE,
  [Locale.TR]: CLOSING_TR,
  [Locale.EN]: CLOSING_EN,
  [Locale.IT]: CLOSING_IT,
  [Locale.ES]: CLOSING_ES,
  [Locale.FR]: CLOSING_FR,
};

/** The after-Zuschlag strings for the lower-case locale the app pages carry around. */
export const getClosingTranslation = (locale: LocaleOption): IClosingTranslation =>
  ClosingTranslations[(locale.toUpperCase() as Locale)] ?? CLOSING_DE;
