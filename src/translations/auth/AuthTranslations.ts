import { fill } from "@/lib/appFormat";
import { Locale } from "../Translations";
import { AUTH_DE } from "./de/de";
import { AUTH_EN } from "./en/en";
import { AUTH_ES } from "./es/es";
import { AUTH_FR } from "./fr/fr";
import { IAuthTranslation } from "./IAuthTranslation";
import { AUTH_IT } from "./it/it";
import { AUTH_TR } from "./tr/tr";

export const AuthTranslations: Record<Locale, IAuthTranslation> = {
  [Locale.DE]: AUTH_DE,
  [Locale.TR]: AUTH_TR,
  [Locale.EN]: AUTH_EN,
  [Locale.IT]: AUTH_IT,
  [Locale.ES]: AUTH_ES,
  [Locale.FR]: AUTH_FR,
};

export { fill };
