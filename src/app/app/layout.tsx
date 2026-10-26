import AppAccount from "@/components/app/shell/AppAccount";
import AppFooter from "@/components/app/shell/AppFooter";
import AppMasthead from "@/components/app/shell/AppMasthead";
import AppNavItem from "@/components/app/shell/AppNavItem";
import AppPlanBanner from "@/components/app/shell/AppPlanBanner";
import AppShell from "@/components/app/shell/AppShell";
import AppStatusLine from "@/components/app/shell/AppStatusLine";
import AppTabBar from "@/components/app/shell/AppTabBar";
import BrandMark from "@/components/brand/BrandMark";
import NavigationSkipLink from "@/components/navigation/NavigationSkipLink";
import NavigationSpacer from "@/components/navigation/NavigationSpacer";
import { APP_MAIN_ID, APP_ROUTES } from "@/lib/appConstants";
import { fill } from "@/lib/appFormat";
import { getAppPageContext } from "@/lib/appPage";
import { TranslationService } from "@/services/TranslationService";
import { WatchlistService } from "@/services/WatchlistService";
import { AlertsTranslations } from "@/translations/alerts/AlertsTranslations";
import { AuthTranslations, fill as fillAuth } from "@/translations/auth/AuthTranslations";
import { ALERT_ROUTES } from "@/lib/alerts/alertConfig";
import { TEAM_ROUTES } from "@/lib/team/teamConfig";
import { TeamTranslations } from "@/translations/team/TeamTranslations";
import { DEADLINE_ROUTES } from "@/lib/deadlines/deadlineConstants";
import { DeadlineTranslations } from "@/translations/deadlines/DeadlineTranslations";
import { CLIENT_SHARE_ROUTES } from "@/lib/clientShare/clientShareConfig";
import { getProUser } from "@/lib/clientShare/proAccess";
import { ClientShareTranslations } from "@/translations/clientShare/ClientShareTranslations";
import { PORTFOLIO_ROUTE } from "@/lib/portfolio/portfolioConstants";
import { getPortfolioTranslation } from "@/translations/portfolio/PortfolioTranslations";

// The app reads the session cookie on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

/** Days before the trial ends from which the upgrade link is shown. */
const TRIAL_NUDGE_DAYS = 3;

export default async function AppLayout({ children }: LayoutProps<"/app">) {
  const { viewer, app, locale, meta, dataDate } = await getAppPageContext(APP_ROUTES.search);
  const { Shell } = app;
  const saved = (await WatchlistService.keys(viewer.id)).size;
  const trialMessage = viewer.trialDaysLeft === 0 || viewer.trialDaysLeft === 1 ? Shell.TrialLastDay : fill(Shell.TrialRunning, { days: viewer.trialDaysLeft ?? 0 });
  const userLocale = await TranslationService.GetUserLocale();
  const { AccountMenu } = AuthTranslations[userLocale];
  const alertsNav = AlertsTranslations[userLocale].Nav;
  const teamNav = TeamTranslations[userLocale].Nav;
  const deadlinesNav = DeadlineTranslations[userLocale].Nav;
  const isPro = (await getProUser())?.isPro ?? false;
  const isLastTrialDay = viewer.trialDaysLeft === 0 || viewer.trialDaysLeft === 1;
  const accessLabel =
    viewer.access === "trial" && isLastTrialDay ? AccountMenu.Access.trialLastDay : fillAuth(AccountMenu.Access[viewer.access], { days: viewer.trialDaysLeft ?? 0 });
  const showTrialCta = viewer.trialDaysLeft !== null && viewer.trialDaysLeft <= TRIAL_NUDGE_DAYS;

  return (
    <AppShell lang={locale}>
      <NavigationSkipLink label={Shell.SkipToContent} targetId={APP_MAIN_ID} />
      <AppStatusLine
        market={Shell.Market[viewer.market]}
        dataAsOf={fill(Shell.DataAsOf, { date: dataDate })}
        sourceLabel={Shell.SourceLabel}
        sourceName={meta.source}
        sourceUrl={meta.sourceUrl}
      />
      <AppMasthead label={Shell.NavLabel}>
        <BrandMark />
        <NavigationSpacer />
        <AppNavItem href={APP_ROUTES.search} label={Shell.Search} />
        <AppNavItem href={APP_ROUTES.watchlist} label={Shell.Watchlist} count={saved} />
        <AppNavItem href={PORTFOLIO_ROUTE} label={getPortfolioTranslation(locale).Nav} />
        <AppNavItem href={ALERT_ROUTES.manage} label={alertsNav} />
        <AppNavItem href={TEAM_ROUTES.overview} label={teamNav} />
        <AppNavItem href={DEADLINE_ROUTES.overview} label={deadlinesNav} />
        {isPro && <AppNavItem href={CLIENT_SHARE_ROUTES.manage} label={ClientShareTranslations[userLocale].Nav} />}
        <AppNavItem href={APP_ROUTES.calculator} label={Shell.Calculator} />
        <AppAccount
          email={viewer.email}
          access={accessLabel}
          hasFullAccess={viewer.plan !== "free"}
          labels={{ ...AccountMenu, Trigger: Shell.Account, SignOut: Shell.SignOut }}
        />
      </AppMasthead>
      {viewer.plan === "free" ? (
        <AppPlanBanner tone="free" message={Shell.FreePlan} ctaLabel={Shell.Upgrade} />
      ) : (
        viewer.trialDaysLeft !== null && <AppPlanBanner tone="trial" message={trialMessage} ctaLabel={showTrialCta ? Shell.Upgrade : undefined} />
      )}
      {children}
      <AppFooter />
      <AppTabBar label={Shell.NavLabel}>
        <AppNavItem variant="tab" href={APP_ROUTES.search} label={Shell.Search} />
        <AppNavItem variant="tab" href={APP_ROUTES.watchlist} label={Shell.Watchlist} count={saved} />
        <AppNavItem variant="tab" href={PORTFOLIO_ROUTE} label={getPortfolioTranslation(locale).Nav} />
        <AppNavItem variant="tab" href={ALERT_ROUTES.manage} label={alertsNav} />
        <AppNavItem variant="tab" href={TEAM_ROUTES.overview} label={teamNav} />
        <AppNavItem variant="tab" href={DEADLINE_ROUTES.overview} label={deadlinesNav} />
        <AppNavItem variant="tab" href={APP_ROUTES.calculator} label={Shell.Calculator} />
      </AppTabBar>
    </AppShell>
  );
}
