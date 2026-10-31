import { LocaleOption } from "../../lib/constants";
import { Locale } from "../Translations";
import { CLIENT_SHARE_DE } from "./de/clientShareDe";
import { CLIENT_SHARE_EN } from "./en/clientShareEn";
import { CLIENT_SHARE_ES } from "./es/clientShareEs";
import { CLIENT_SHARE_FR } from "./fr/clientShareFr";
import { IClientShareTranslation } from "./IClientShareTranslation";
import { CLIENT_SHARE_IT } from "./it/clientShareIt";
import { CLIENT_SHARE_TR } from "./tr/clientShareTr";

export const ClientShareTranslations: Record<Locale, IClientShareTranslation> = {
  [Locale.DE]: CLIENT_SHARE_DE,
  [Locale.TR]: CLIENT_SHARE_TR,
  [Locale.EN]: CLIENT_SHARE_EN,
  [Locale.IT]: CLIENT_SHARE_IT,
  [Locale.ES]: CLIENT_SHARE_ES,
  [Locale.FR]: CLIENT_SHARE_FR,
};

/** The client link strings for the lower-case locale the app pages carry around. */
export const getClientShareTranslation = (locale: LocaleOption): IClientShareTranslation =>
  ClientShareTranslations[(locale.toUpperCase() as Locale)] ?? CLIENT_SHARE_DE;
