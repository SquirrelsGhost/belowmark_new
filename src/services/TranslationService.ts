import { DEFAULT_LOCALE, LocaleOption } from "@/lib/constants";
import { RegionService } from "@/services/RegionService";
import { ITranslation } from "@/translations/ITranslation";
import { Locale, Translations } from "@/translations/Translations";

/**
 * TranslationService
 *
 * The language follows where the visitor is, not the system language:
 * Turkey → TR, everywhere else → DE. See RegionService for how the country
 * is detected (geo header → browser time zone → Accept-Language → DE).
 *
 * Usage in a Server Component:
 *
 *   const t = await TranslationService.GetUserTranslations();
 *   return <h1>{t.HomePage.Headline}</h1>;
 */
export class TranslationService {
  static GetUserLocale = async (): Promise<Locale> => {
    const region = await RegionService.GetRegion();
    return TranslationService.NormalizeLocale(region.country === "TR" ? "tr" : DEFAULT_LOCALE);
  };

  static NormalizeLocale = (code: string): Locale => {
    switch (code) {
      case "tr-TR":
      case "tr":
        return Locale.TR;
      case "de-DE":
      case "de":
        return Locale.DE;
      default:
        return Locale.DE;
    }
  };

  /** Lower-case locale code as used by the locale cookie and Intl helpers. */
  static ToLocaleOption = (locale: Locale): LocaleOption => {
    return locale === Locale.TR ? "tr" : "de";
  };

  static GetTranslations = (locale: Locale): ITranslation => {
    return Translations[locale] ?? Translations[Locale.DE];
  };

  static GetUserTranslations = async (): Promise<ITranslation> => {
    const locale = await TranslationService.GetUserLocale();
    return TranslationService.GetTranslations(locale);
  };
}
