import { Locale } from "../Translations";
import { AUTH_DE } from "./de/de";
import { IAuthTranslation } from "./IAuthTranslation";
import { AUTH_TR } from "./tr/tr";

export const AuthTranslations: Record<Locale, IAuthTranslation> = {
  [Locale.DE]: AUTH_DE,
  [Locale.TR]: AUTH_TR,
};

/** Fills "{name}" placeholders, e.g. fill("Hallo {email}", { email }). */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
