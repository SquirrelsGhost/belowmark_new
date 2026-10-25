import { DE } from "./de/de";
import { EN } from "./en/en";
import { ITranslation } from "./ITranslation";

export enum Locale {
  EN = "EN",
  DE = "DE",
}

export const Translations: Record<Locale, ITranslation> = {
  [Locale.EN]: EN,
  [Locale.DE]: DE,
};
