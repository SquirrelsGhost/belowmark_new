import "server-only";
import { Metadata } from "next";
import { LocaleOption } from "@/lib/constants";
import { MetaTagService, IMetaTags } from "@/services/MetaTagService";
import { IRegion, RegionService } from "@/services/RegionService";
import { TranslationService } from "@/services/TranslationService";
import { AuthTranslations } from "@/translations/auth/AuthTranslations";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";

export interface AuthPageContext {
  t: IAuthTranslation;
  lang: LocaleOption;
  region: IRegion;
}

/** Translations, language and region for an account page — one call per page. */
export async function getAuthPageContext(): Promise<AuthPageContext> {
  const locale = await TranslationService.GetUserLocale();
  return {
    t: AuthTranslations[locale],
    lang: TranslationService.ToLocaleOption(locale),
    region: await RegionService.GetRegion(),
  };
}

/**
 * Locale-aware metadata for account pages. Pages that carry tokens or private
 * data are kept out of search engines and never leak their URL via Referer.
 */
export async function authMetadata(pick: (t: IAuthTranslation) => IMetaTags, isPrivate = true): Promise<Metadata> {
  const { t } = await getAuthPageContext();
  const metadata = MetaTagService.CreateMetaTags(pick(t));
  if (!isPrivate) return metadata;
  return { ...metadata, robots: { index: false, follow: false }, referrer: "no-referrer" };
}
