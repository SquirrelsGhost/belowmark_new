import { Metadata } from "next";
import AppMain from "@/components/app/shell/AppMain";
import AppPageHeader from "@/components/app/shell/AppPageHeader";
import AppSectionSuspense from "@/components/app/shell/AppSectionSuspense";
import TeamOverviewContent from "@/components/app/team/TeamOverviewContent";
import { APP_MAIN_ID } from "@/lib/appConstants";
import { getAppPageContext } from "@/lib/appPage";
import { TEAM_ROUTES } from "@/lib/team/teamConfig";
import { MetaTagService } from "@/services/MetaTagService";
import { TranslationService } from "@/services/TranslationService";
import { TeamTranslations } from "@/translations/team/TeamTranslations";

// Reads the session cookie on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { MetaTags } = TeamTranslations[await TranslationService.GetUserLocale()];
  return { ...MetaTagService.CreateMetaTags(MetaTags.Overview), robots: { index: false, follow: false } };
}

export default async function TeamOverviewPage() {
  const { viewer, locale } = await getAppPageContext(TEAM_ROUTES.overview);
  const t = TeamTranslations[await TranslationService.GetUserLocale()];
  const { Overview: O } = t;

  return (
    <AppMain id={APP_MAIN_ID}>
      <AppPageHeader eyebrow={O.Eyebrow} title={O.Title} lead={O.Lead} />
      <AppSectionSuspense variant="list">
        <TeamOverviewContent viewer={viewer} locale={locale} t={t} />
      </AppSectionSuspense>
    </AppMain>
  );
}
