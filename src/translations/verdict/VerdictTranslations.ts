import { LocaleOption } from "../../lib/constants";
import { Locale } from "../Translations";
import { VERDICT_CS } from "./cs/verdictCs";
import { VERDICT_DE } from "./de/verdictDe";
import { VERDICT_EN } from "./en/verdictEn";
import { VERDICT_ES } from "./es/verdictEs";
import { VERDICT_FR } from "./fr/verdictFr";
import { IVerdictTranslation } from "./IVerdictTranslation";
import { VERDICT_IT } from "./it/verdictIt";
import { VERDICT_NL } from "./nl/verdictNl";
import { VERDICT_PL } from "./pl/verdictPl";
import { VERDICT_SV } from "./sv/verdictSv";
import { VERDICT_TR } from "./tr/verdictTr";

export const VerdictTranslations: Record<Locale, IVerdictTranslation> = {
  [Locale.DE]: VERDICT_DE,
  [Locale.TR]: VERDICT_TR,
  [Locale.EN]: VERDICT_EN,
  [Locale.IT]: VERDICT_IT,
  [Locale.ES]: VERDICT_ES,
  [Locale.FR]: VERDICT_FR,
  [Locale.PL]: VERDICT_PL,
  [Locale.CS]: VERDICT_CS,
  [Locale.NL]: VERDICT_NL,
  [Locale.SV]: VERDICT_SV,
};

/** The verdict strings for the lower-case locale the app pages carry around. */
export const getVerdictTranslation = (locale: LocaleOption): IVerdictTranslation =>
  VerdictTranslations[(locale.toUpperCase() as Locale)] ?? VERDICT_DE;
