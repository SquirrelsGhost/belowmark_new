import { HtmlLangCode } from "@/lib/blog/blogSeo";
import { PricingCountryCode } from "@/lib/constants";
import { HomeFormatLocale } from "@/lib/format";
import { HomeDirectoryHeadingCopy } from "@/lib/homeDirectoryCopy";
import { ITranslation } from "@/translations/ITranslation";

export type HomeSelectorCode = PricingCountryCode | "INTL";

export interface HomeCountryProfile {
  selectorCode: HomeSelectorCode;
  pricingCountry: PricingCountryCode;
  formatLocale: HomeFormatLocale;
  htmlLang: HtmlLangCode;
  liveSearchLabel: string;
  freeBadge: string;
  trialBadge: string;
  directoryCopy: HomeDirectoryHeadingCopy;
  Navigation: ITranslation["Navigation"];
  HomePage: ITranslation["HomePage"];
  Footer: ITranslation["Footer"];
}
