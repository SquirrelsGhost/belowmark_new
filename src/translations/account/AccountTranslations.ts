import { Locale } from "../Translations";
import { ACCOUNT_DE } from "./de/de";
import { IAccountTranslation } from "./IAccountTranslation";
import { ACCOUNT_TR } from "./tr/tr";

export const AccountTranslations: Record<Locale, IAccountTranslation> = {
  [Locale.DE]: ACCOUNT_DE,
  [Locale.TR]: ACCOUNT_TR,
};
