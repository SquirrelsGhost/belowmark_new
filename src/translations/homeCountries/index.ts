import { TRIAL_COPY } from "@/lib/billing/trialCopy";
import { HOME_DIRECTORY_COPY } from "@/lib/homeDirectoryCopy";
import { parsePrimaryAcceptLanguage } from "@/lib/regionLocale";
import { IRegion } from "@/services/RegionService";
import { DE } from "@/translations/de/de";
import { TR } from "@/translations/tr/tr";
import { HOME_CZ } from "./czHome";
import { HOME_AT_DE, HOME_CH_DE, HOME_CH_FR, HOME_CH_IT } from "./dachCountries";
import { HomeCountryProfile } from "./homeCountryTypes";
import { HOME_NL } from "./nlHome";
import { HOME_PL } from "./plHome";
import { HOME_SE } from "./seHome";
import { HOME_ES, HOME_FR, HOME_GB_EN, HOME_INTL_EN, HOME_IT } from "./westSouthCountries";

export const HOME_DE: HomeCountryProfile = {
  selectorCode: "DE",
  pricingCountry: "DE",
  formatLocale: "de",
  htmlLang: "de",
  liveSearchLabel: "Live-Suche",
  freeBadge: TRIAL_COPY.de.homeFreeBadge,
  trialBadge: TRIAL_COPY.de.homeTrialBadge,
  directoryCopy: HOME_DIRECTORY_COPY.de,
  Navigation: DE.Navigation,
  HomePage: DE.HomePage,
  Footer: DE.Footer,
};

export const HOME_TR: HomeCountryProfile = {
  selectorCode: "TR",
  pricingCountry: "TR",
  formatLocale: "tr",
  htmlLang: "tr",
  liveSearchLabel: "Canlı Arama",
  freeBadge: TRIAL_COPY.tr.homeFreeBadge,
  trialBadge: TRIAL_COPY.tr.homeTrialBadge,
  directoryCopy: HOME_DIRECTORY_COPY.tr,
  Navigation: TR.Navigation,
  HomePage: TR.HomePage,
  Footer: TR.Footer,
};

/**
 * Resolves the complete country-native Homepage profile (language, currency, legal copy,
 * statutory FAQs, badges & formatting locale) for all 12 countries + International English.
 */
export function resolveHomeCountryProfile(
  region: IRegion,
  acceptLanguage?: string | null,
): HomeCountryProfile {
  // Unmatched international countries (USA, UAE, Asia, etc.) -> Global English ("INTL")
  if (!region.isMarketChosen && !region.isCountryMatched && region.locale === "en") {
    return HOME_INTL_EN;
  }

  switch (region.pricingCountry) {
    case "DE":
      return HOME_DE;
    case "AT":
      return HOME_AT_DE;
    case "CH": {
      const primary = parsePrimaryAcceptLanguage(acceptLanguage) ?? "";
      if (region.locale === "fr" || primary.startsWith("fr")) return HOME_CH_FR;
      if (region.locale === "it" || primary.startsWith("it")) return HOME_CH_IT;
      return HOME_CH_DE;
    }
    case "IT":
      return HOME_IT;
    case "ES":
      return HOME_ES;
    case "FR":
      return HOME_FR;
    case "GB":
      return HOME_GB_EN;
    case "NL":
      return HOME_NL;
    case "PL":
      return HOME_PL;
    case "CZ":
      return HOME_CZ;
    case "SE":
      return HOME_SE;
    case "TR":
      return HOME_TR;
    default:
      return HOME_INTL_EN;
  }
}
