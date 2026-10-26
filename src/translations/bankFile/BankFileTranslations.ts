import { LocaleOption } from "../../lib/constants";
import { Locale } from "../Translations";
import { BANK_FILE_DE } from "./de/bankFileDe";
import { IBankFileTranslation } from "./IBankFileTranslation";
import { BANK_FILE_TR } from "./tr/bankFileTr";

export const BankFileTranslations: Record<Locale, IBankFileTranslation> = {
  [Locale.DE]: BANK_FILE_DE,
  [Locale.TR]: BANK_FILE_TR,
};

/** The bank file strings for the lower-case locale the app pages carry around. */
export const getBankFileTranslation = (locale: LocaleOption): IBankFileTranslation => (locale === "tr" ? BANK_FILE_TR : BANK_FILE_DE);
