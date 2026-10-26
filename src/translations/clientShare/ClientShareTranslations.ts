import { LocaleOption } from "../../lib/constants";
import { Locale } from "../Translations";
import { CLIENT_SHARE_DE } from "./de/clientShareDe";
import { IClientShareTranslation } from "./IClientShareTranslation";
import { CLIENT_SHARE_TR } from "./tr/clientShareTr";

export const ClientShareTranslations: Record<Locale, IClientShareTranslation> = {
  [Locale.DE]: CLIENT_SHARE_DE,
  [Locale.TR]: CLIENT_SHARE_TR,
};

/** The client link strings for the lower-case locale the app pages carry around. */
export const getClientShareTranslation = (locale: LocaleOption): IClientShareTranslation => (locale === "tr" ? CLIENT_SHARE_TR : CLIENT_SHARE_DE);
