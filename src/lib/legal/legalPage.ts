import "server-only";
import { Metadata } from "next";
import { isPricingCountry, LocaleOption, PricingCountryCode } from "@/lib/constants";
import { env } from "@/lib/env";
import { IMetaTags, MetaTagService } from "@/services/MetaTagService";
import { TranslationService } from "@/services/TranslationService";
import { AuthTranslations } from "@/translations/auth/AuthTranslations";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";
import { BillingTranslations } from "@/translations/billing/BillingTranslations";
import { IBillingTranslation } from "@/translations/billing/IBillingTranslation";
import { legalDocument, LegalDocumentKey } from "@/translations/legal/LegalDocuments";
import { LegalDocument } from "@/types/legal.types";

export interface LegalPageContext {
  t: IBillingTranslation;
  layout: IAuthTranslation["Layout"];
  lang: LocaleOption;
  /** The operator has released the texts (BILLING_LEGAL_APPROVED=yes) — the draft warning goes away */
  isApproved: boolean;
}

export function resolveOrderPageLocale(params: {
  isLocaleChosen?: boolean;
  regionLocale: LocaleOption;
  userLocale?: string | null;
  rawMarket?: string;
}): string {
  if (params.isLocaleChosen) return params.regionLocale;
  if (params.userLocale) return params.userLocale;
  if (isPricingCountry(params.rawMarket)) {
    const m: PricingCountryCode = params.rawMarket;
    if (m === "TR") return "tr";
    if (m === "FR") return "fr";
    if (m === "ES") return "es";
    if (m === "IT") return "it";
    if (m === "DE" || m === "AT" || m === "CH") return "de";
    return "en";
  }
  return params.regionLocale;
}

/** Translations, language and release state for the legal and consumer pages. */
export async function getLegalPageContext(preferredLocale?: string | null): Promise<LegalPageContext> {
  const locale = preferredLocale
    ? TranslationService.NormalizeLocale(preferredLocale)
    : await TranslationService.GetUserLocale();
  return {
    t: BillingTranslations[locale],
    layout: AuthTranslations[locale].Layout,
    lang: TranslationService.ToLocaleOption(locale),
    isApproved: env.billingLegalApproved,
  };
}

export function getLegalDocument(key: LegalDocumentKey, lang: LocaleOption = "de"): LegalDocument {
  return legalDocument(key, env.billingVatMode, lang);
}

export async function legalMetadata(pick: (t: IBillingTranslation) => IMetaTags, isPrivate = false): Promise<Metadata> {
  const { t } = await getLegalPageContext();
  const metadata = MetaTagService.CreateMetaTags(pick(t));
  return isPrivate ? { ...metadata, robots: { index: false, follow: false }, referrer: "no-referrer" } : metadata;
}
