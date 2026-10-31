import { Metadata } from "next";
import PortfolioContent from "@/components/app/portfolio/PortfolioContent";
import AppMain from "@/components/app/shell/AppMain";
import AppPageHeader from "@/components/app/shell/AppPageHeader";
import AppSectionSuspense from "@/components/app/shell/AppSectionSuspense";
import { APP_MAIN_ID } from "@/lib/appConstants";
import { getAppPageContext } from "@/lib/appPage";
import { PORTFOLIO_ROUTE } from "@/lib/portfolio/portfolioConstants";
import { MetaTagService } from "@/services/MetaTagService";
import { TranslationService } from "@/services/TranslationService";
import { getPortfolioTranslation } from "@/translations/portfolio/PortfolioTranslations";

// Reads the session cookie on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const locale = TranslationService.ToLocaleOption(await TranslationService.GetUserLocale());
  return { ...MetaTagService.CreateMetaTags(getPortfolioTranslation(locale).MetaTags), robots: { index: false, follow: false } };
}

export default async function PortfolioPage() {
  const { viewer, app, locale } = await getAppPageContext(PORTFOLIO_ROUTE);
  const labels = getPortfolioTranslation(locale);
  const { Page } = labels;

  return (
    <AppMain id={APP_MAIN_ID}>
      <AppPageHeader eyebrow={Page.Eyebrow} title={Page.Title} lead={Page.Lead} />
      <AppSectionSuspense variant="list">
        <PortfolioContent viewer={viewer} app={app} locale={locale} labels={labels} />
      </AppSectionSuspense>
    </AppMain>
  );
}
