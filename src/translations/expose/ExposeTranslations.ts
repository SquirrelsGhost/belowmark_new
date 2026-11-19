import { LocaleOption } from "../../lib/constants";
import { Locale } from "../Translations";
import { EXPOSE_CS } from "./cs/exposeCs";
import { EXPOSE_DE } from "./de/exposeDe";
import { EXPOSE_EN } from "./en/exposeEn";
import { EXPOSE_ES } from "./es/exposeEs";
import { EXPOSE_FR } from "./fr/exposeFr";
import { IExposeTranslation } from "./IExposeTranslation";
import { EXPOSE_IT } from "./it/exposeIt";
import { EXPOSE_NL } from "./nl/exposeNl";
import { EXPOSE_PL } from "./pl/exposePl";
import { EXPOSE_SV } from "./sv/exposeSv";
import { EXPOSE_TR } from "./tr/exposeTr";

export const ExposeTranslations: Record<Locale, IExposeTranslation> = {
  [Locale.DE]: EXPOSE_DE,
  [Locale.TR]: EXPOSE_TR,
  [Locale.EN]: EXPOSE_EN,
  [Locale.IT]: EXPOSE_IT,
  [Locale.ES]: EXPOSE_ES,
  [Locale.FR]: EXPOSE_FR,
  [Locale.PL]: EXPOSE_PL,
  [Locale.CS]: EXPOSE_CS,
  [Locale.NL]: EXPOSE_NL,
  [Locale.SV]: EXPOSE_SV,
};

/** The exposé strings for the lower-case locale the app pages carry around. */
export const getExposeTranslation = (locale: LocaleOption): IExposeTranslation =>
  ExposeTranslations[(locale.toUpperCase() as Locale)] ?? EXPOSE_DE;
