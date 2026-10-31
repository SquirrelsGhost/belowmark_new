import { LocaleOption } from "../../lib/constants";
import { Locale } from "../Translations";
import { DEADLINE_DE } from "./de/deadlineDe";
import { DEADLINE_EN } from "./en/deadlineEn";
import { DEADLINE_ES } from "./es/deadlineEs";
import { DEADLINE_FR } from "./fr/deadlineFr";
import { IDeadlineTranslation } from "./IDeadlineTranslation";
import { DEADLINE_IT } from "./it/deadlineIt";
import { DEADLINE_TR } from "./tr/deadlineTr";

export const DeadlineTranslations: Record<Locale, IDeadlineTranslation> = {
  [Locale.DE]: DEADLINE_DE,
  [Locale.TR]: DEADLINE_TR,
  [Locale.EN]: DEADLINE_EN,
  [Locale.IT]: DEADLINE_IT,
  [Locale.ES]: DEADLINE_ES,
  [Locale.FR]: DEADLINE_FR,
};

/** The deadline strings for the lower-case locale the app pages carry around. */
export const getDeadlineTranslation = (locale: LocaleOption): IDeadlineTranslation =>
  DeadlineTranslations[(locale.toUpperCase() as Locale)] ?? DEADLINE_DE;
