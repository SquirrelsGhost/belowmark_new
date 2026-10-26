import { LocaleOption } from "../../lib/constants";
import { Locale } from "../Translations";
import { VERDICT_DE } from "./de/verdictDe";
import { IVerdictTranslation } from "./IVerdictTranslation";
import { VERDICT_TR } from "./tr/verdictTr";

export const VerdictTranslations: Record<Locale, IVerdictTranslation> = {
  [Locale.DE]: VERDICT_DE,
  [Locale.TR]: VERDICT_TR,
};

/** The verdict strings for the lower-case locale the app pages carry around. */
export const getVerdictTranslation = (locale: LocaleOption): IVerdictTranslation => (locale === "tr" ? VERDICT_TR : VERDICT_DE);
