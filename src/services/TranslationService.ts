import { cache } from "react";
import { LocaleOption } from "@/lib/constants";
import { RegionService } from "@/services/RegionService";
import { ITranslation } from "@/translations/ITranslation";
import { Locale, Translations } from "@/translations/Translations";

/**
 * TranslationService
 *
 * Automatically resolves the language of the country where the visitor is located
 * (DE/AT/CH → DE, TR → TR, IT → IT, ES/LATAM → ES, FR → FR, GB → EN),
 * defaulting all other countries and unmatched requests to English (EN).
 */
export class TranslationService {
  static GetUserLocale = cache(async (): Promise<Locale> => {
    const region = await RegionService.GetRegion();
    return TranslationService.NormalizeLocale(region.locale);
  });

  static NormalizeLocale = (code: string | null | undefined): Locale => {
    const lower = (code ?? "").trim().toLowerCase();
    if (lower.startsWith("de") || lower === "at" || lower === "ch") return Locale.DE;
    if (lower.startsWith("tr")) return Locale.TR;
    if (lower.startsWith("it")) return Locale.IT;
    if (lower.startsWith("es")) return Locale.ES;
    if (lower.startsWith("fr")) return Locale.FR;
    return Locale.EN;
  };

  /** Lower-case locale code as used by the locale cookie and Intl helpers. */
  static ToLocaleOption = (locale: Locale): LocaleOption => {
    switch (locale) {
      case Locale.DE:
        return "de";
      case Locale.TR:
        return "tr";
      case Locale.IT:
        return "it";
      case Locale.ES:
        return "es";
      case Locale.FR:
        return "fr";
      default:
        return "en";
    }
  };

  static GetTranslations = (locale: Locale): ITranslation => {
    return Translations[locale] ?? Translations[Locale.EN];
  };

  static GetUserTranslations = async (): Promise<ITranslation> => {
    const locale = await TranslationService.GetUserLocale();
    return TranslationService.GetTranslations(locale);
  };
}
