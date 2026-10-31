import { Metadata } from "next";
import DeadlinesContent from "@/components/app/deadlines/DeadlinesContent";
import AppMain from "@/components/app/shell/AppMain";
import AppPageHeader from "@/components/app/shell/AppPageHeader";
import AppSectionSuspense from "@/components/app/shell/AppSectionSuspense";
import { APP_MAIN_ID } from "@/lib/appConstants";
import { getAppPageContext } from "@/lib/appPage";
import { DEADLINE_ROUTES } from "@/lib/deadlines/deadlineConstants";
import { MetaTagService } from "@/services/MetaTagService";
import { TranslationService } from "@/services/TranslationService";
import { DeadlineTranslations, getDeadlineTranslation } from "@/translations/deadlines/DeadlineTranslations";

// Reads the session cookie on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { MetaTags } = DeadlineTranslations[await TranslationService.GetUserLocale()];
  return { ...MetaTagService.CreateMetaTags(MetaTags), robots: { index: false, follow: false } };
}

export default async function DeadlinesPage() {
  const { viewer, locale } = await getAppPageContext(DEADLINE_ROUTES.overview);
  const labels = getDeadlineTranslation(locale);
  const { Page: P } = labels;

  return (
    <AppMain id={APP_MAIN_ID}>
      <AppPageHeader eyebrow={P.Eyebrow} title={P.Title} lead={P.Lead} />
      <AppSectionSuspense variant="list">
        <DeadlinesContent viewer={viewer} locale={locale} labels={labels} />
      </AppSectionSuspense>
    </AppMain>
  );
}
