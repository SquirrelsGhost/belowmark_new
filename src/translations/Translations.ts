import { CS } from "./cs/cs";
import { DE } from "./de/de";
import { EN } from "./en/en";
import { ES } from "./es/es";
import { FR } from "./fr/fr";
import { IT } from "./it/it";
import { ITranslation } from "./ITranslation";
import { NL } from "./nl/nl";
import { PL } from "./pl/pl";
import { SV } from "./sv/sv";
import { TR } from "./tr/tr";

export enum Locale {
  DE = "DE",
  TR = "TR",
  EN = "EN",
  IT = "IT",
  ES = "ES",
  FR = "FR",
  PL = "PL",
  CS = "CS",
  NL = "NL",
  SV = "SV",
}

export const Translations: Record<Locale, ITranslation> = {
  [Locale.DE]: DE,
  [Locale.TR]: TR,
  [Locale.EN]: EN,
  [Locale.IT]: IT,
  [Locale.ES]: ES,
  [Locale.FR]: FR,
  [Locale.PL]: PL,
  [Locale.CS]: CS,
  [Locale.NL]: NL,
  [Locale.SV]: SV,
};
