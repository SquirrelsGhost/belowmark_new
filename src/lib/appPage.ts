import "server-only";
import { Metadata } from "next";
import { LocaleOption } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { MetaTagService } from "@/services/MetaTagService";
import { AppSessionService, AppViewer } from "@/services/AppSessionService";
import { ListingService } from "@/services/ListingService";
import { TranslationService } from "@/services/TranslationService";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { ITranslation } from "@/translations/ITranslation";
import { ListingSnapshot } from "@/types/listing.types";

export interface AppPageContext {
  viewer: AppViewer;
  t: ITranslation;
  app: IAppTranslation;
  locale: LocaleOption;
  meta: ListingSnapshot["meta"];
  /** Data date, formatted for the locale */
  dataDate: string;
}

/** Everything an app page needs: the signed-in viewer (or a login redirect), strings and data date. */
export async function getAppPageContext(returnTo: string): Promise<AppPageContext> {
  const viewer = await AppSessionService.requireViewer(returnTo);
  const userLocale = await TranslationService.GetUserLocale();
  const t = TranslationService.GetTranslations(userLocale);
  const locale = TranslationService.ToLocaleOption(userLocale);
  const meta = await ListingService.getMeta(viewer.market);
  return { viewer, t, app: t.App, locale, meta, dataDate: formatDate(meta.generatedAt, locale) };
}

/** App pages are private: localised tags, but never indexed. */
export async function appMetadata(select: (app: IAppTranslation) => ITranslation["HomePage"]["MetaTags"]): Promise<Metadata> {
  const t = await TranslationService.GetUserTranslations();
  return { ...MetaTagService.CreateMetaTags(select(t.App)), robots: { index: false, follow: false } };
}
