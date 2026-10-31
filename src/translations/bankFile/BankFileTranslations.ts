import { LocaleOption } from "../../lib/constants";
import { Locale } from "../Translations";
import { BANK_FILE_DE } from "./de/bankFileDe";
import { BANK_FILE_EN } from "./en/bankFileEn";
import { BANK_FILE_ES } from "./es/bankFileEs";
import { BANK_FILE_FR } from "./fr/bankFileFr";
import { IBankFileTranslation } from "./IBankFileTranslation";
import { BANK_FILE_IT } from "./it/bankFileIt";
import { BANK_FILE_TR } from "./tr/bankFileTr";

export const BankFileTranslations: Record<Locale, IBankFileTranslation> = {
  [Locale.DE]: BANK_FILE_DE,
  [Locale.TR]: BANK_FILE_TR,
  [Locale.EN]: BANK_FILE_EN,
  [Locale.IT]: BANK_FILE_IT,
  [Locale.ES]: BANK_FILE_ES,
  [Locale.FR]: BANK_FILE_FR,
};

/** The bank file strings for the lower-case locale the app pages carry around. */
export const getBankFileTranslation = (locale: LocaleOption): IBankFileTranslation =>
  BankFileTranslations[(locale.toUpperCase() as Locale)] ?? BANK_FILE_DE;
