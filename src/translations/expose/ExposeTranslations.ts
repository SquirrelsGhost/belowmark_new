import { LocaleOption } from "../../lib/constants";
import { Locale } from "../Translations";
import { EXPOSE_DE } from "./de/exposeDe";
import { IExposeTranslation } from "./IExposeTranslation";
import { EXPOSE_TR } from "./tr/exposeTr";

export const ExposeTranslations: Record<Locale, IExposeTranslation> = {
  [Locale.DE]: EXPOSE_DE,
  [Locale.TR]: EXPOSE_TR,
};

/** The exposé strings for the lower-case locale the app pages carry around. */
export const getExposeTranslation = (locale: LocaleOption): IExposeTranslation => (locale === "tr" ? EXPOSE_TR : EXPOSE_DE);
