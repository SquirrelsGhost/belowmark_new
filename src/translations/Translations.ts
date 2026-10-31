import { DE } from "./de/de";
import { EN } from "./en/en";
import { ES } from "./es/es";
import { FR } from "./fr/fr";
import { IT } from "./it/it";
import { ITranslation } from "./ITranslation";
import { TR } from "./tr/tr";

export enum Locale {
  DE = "DE",
  TR = "TR",
  EN = "EN",
  IT = "IT",
  ES = "ES",
  FR = "FR",
}

export const Translations: Record<Locale, ITranslation> = {
  [Locale.DE]: DE,
  [Locale.TR]: TR,
  [Locale.EN]: EN,
  [Locale.IT]: IT,
  [Locale.ES]: ES,
  [Locale.FR]: FR,
};
