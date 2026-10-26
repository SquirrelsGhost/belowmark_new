import { LocaleOption } from "../../lib/constants";
import { Locale } from "../Translations";
import { CLOSING_DE } from "./de/closingDe";
import { IClosingTranslation } from "./IClosingTranslation";
import { CLOSING_TR } from "./tr/closingTr";

export const ClosingTranslations: Record<Locale, IClosingTranslation> = {
  [Locale.DE]: CLOSING_DE,
  [Locale.TR]: CLOSING_TR,
};

/** The after-Zuschlag strings for the lower-case locale the app pages carry around. */
export const getClosingTranslation = (locale: LocaleOption): IClosingTranslation => (locale === "tr" ? CLOSING_TR : CLOSING_DE);
