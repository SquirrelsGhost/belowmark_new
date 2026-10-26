import "server-only";
import { Metadata } from "next";
import { LocaleOption } from "@/lib/constants";
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

/** Translations, language and release state for the legal and consumer pages. */
export async function getLegalPageContext(): Promise<LegalPageContext> {
  const locale = await TranslationService.GetUserLocale();
  return {
    t: BillingTranslations[locale],
    layout: AuthTranslations[locale].Layout,
    lang: TranslationService.ToLocaleOption(locale),
    isApproved: env.billingLegalApproved,
  };
}

export function getLegalDocument(key: LegalDocumentKey): LegalDocument {
  return legalDocument(key, env.billingVatMode);
}

export async function legalMetadata(pick: (t: IBillingTranslation) => IMetaTags, isPrivate = false): Promise<Metadata> {
  const { t } = await getLegalPageContext();
  const metadata = MetaTagService.CreateMetaTags(pick(t));
  return isPrivate ? { ...metadata, robots: { index: false, follow: false }, referrer: "no-referrer" } : metadata;
}
