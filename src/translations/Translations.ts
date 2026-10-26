import { DE } from "./de/de";
import { ITranslation } from "./ITranslation";
import { TR } from "./tr/tr";

export enum Locale {
  DE = "DE",
  TR = "TR",
}

export const Translations: Record<Locale, ITranslation> = {
  [Locale.DE]: DE,
  [Locale.TR]: TR,
};
