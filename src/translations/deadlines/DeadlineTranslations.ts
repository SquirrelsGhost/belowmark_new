import { LocaleOption } from "../../lib/constants";
import { Locale } from "../Translations";
import { DEADLINE_DE } from "./de/deadlineDe";
import { IDeadlineTranslation } from "./IDeadlineTranslation";
import { DEADLINE_TR } from "./tr/deadlineTr";

export const DeadlineTranslations: Record<Locale, IDeadlineTranslation> = {
  [Locale.DE]: DEADLINE_DE,
  [Locale.TR]: DEADLINE_TR,
};

/** The deadline strings for the lower-case locale the app pages carry around. */
export const getDeadlineTranslation = (locale: LocaleOption): IDeadlineTranslation => (locale === "tr" ? DEADLINE_TR : DEADLINE_DE);
