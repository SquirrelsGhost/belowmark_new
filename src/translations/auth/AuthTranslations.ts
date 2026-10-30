import { fill } from "@/lib/appFormat";
import { Locale } from "../Translations";
import { AUTH_DE } from "./de/de";
import { IAuthTranslation } from "./IAuthTranslation";
import { AUTH_TR } from "./tr/tr";

export const AuthTranslations: Record<Locale, IAuthTranslation> = {
  [Locale.DE]: AUTH_DE,
  [Locale.TR]: AUTH_TR,
};

export { fill };
