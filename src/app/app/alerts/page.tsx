import { Metadata } from "next";
import AlertsContent from "@/components/app/alerts/AlertsContent";
import AppMain from "@/components/app/shell/AppMain";
import AppPageHeader from "@/components/app/shell/AppPageHeader";
import AppSectionSuspense from "@/components/app/shell/AppSectionSuspense";
import { ALERT_ROUTES } from "@/lib/alerts/alertConfig";
import { APP_MAIN_ID } from "@/lib/appConstants";
import { getAppPageContext } from "@/lib/appPage";
import { MetaTagService } from "@/services/MetaTagService";
import { TranslationService } from "@/services/TranslationService";
import { AlertsTranslations } from "@/translations/alerts/AlertsTranslations";

// Reads the session cookie on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { MetaTags } = AlertsTranslations[await TranslationService.GetUserLocale()];
  return { ...MetaTagService.CreateMetaTags(MetaTags), robots: { index: false, follow: false } };
}

export default async function AlertsPage() {
  const { viewer, app, locale } = await getAppPageContext(ALERT_ROUTES.manage);
  const labels = AlertsTranslations[await TranslationService.GetUserLocale()];
  const { Page } = labels;

  return (
    <AppMain id={APP_MAIN_ID}>
      <AppPageHeader eyebrow={Page.Eyebrow} title={Page.Title} lead={Page.Lead} />
      <AppSectionSuspense variant="list">
        <AlertsContent viewer={viewer} segments={app.Segments} locale={locale} labels={labels} />
      </AppSectionSuspense>
    </AppMain>
  );
}
