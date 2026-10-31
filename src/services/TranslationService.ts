import { cache } from "react";
import { LocaleOption, pricingCountryToLocale } from "@/lib/constants";
import { RegionService } from "@/services/RegionService";
import { ITranslation } from "@/translations/ITranslation";
import { Locale, Translations } from "@/translations/Translations";

/**
 * TranslationService
 *
 * The language follows the active country/market (DE/AT/CH → DE, TR → TR,
 * GB → EN, IT → IT, ES → ES, FR → FR).
 */
export class TranslationService {
  static GetUserLocale = cache(async (): Promise<Locale> => {
    const region = await RegionService.GetRegion();
    return TranslationService.NormalizeLocale(pricingCountryToLocale(region.pricingCountry));
  });

  static NormalizeLocale = (code: string | null | undefined): Locale => {
    const lower = (code ?? "").toLowerCase();
    if (lower.startsWith("tr")) return Locale.TR;
    if (lower.startsWith("en") || lower === "gb" || lower === "uk") return Locale.EN;
    if (lower.startsWith("it")) return Locale.IT;
    if (lower.startsWith("es")) return Locale.ES;
    if (lower.startsWith("fr")) return Locale.FR;
    return Locale.DE;
  };

  /** Lower-case locale code as used by the locale cookie and Intl helpers. */
  static ToLocaleOption = (locale: Locale): LocaleOption => {
    switch (locale) {
      case Locale.TR:
        return "tr";
      case Locale.EN:
        return "en";
      case Locale.IT:
        return "it";
      case Locale.ES:
        return "es";
      case Locale.FR:
        return "fr";
      default:
        return "de";
    }
  };

  static GetTranslations = (locale: Locale): ITranslation => {
    return Translations[locale] ?? Translations[Locale.DE];
  };

  static GetUserTranslations = async (): Promise<ITranslation> => {
    const locale = await TranslationService.GetUserLocale();
    return TranslationService.GetTranslations(locale);
  };
}
