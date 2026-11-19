import Link from "next/link";
import { ReactNode } from "react";
import AuthIcon from "@/components/auth/AuthIcon";
import BrandMark from "@/components/brand/BrandMark";
import ConsumerFooterButtons from "@/components/consumer/ConsumerFooterButtons";
import NavigationLanguageSwitch from "@/components/navigation/NavigationLanguageSwitch";
import NavigationSkipLink from "@/components/navigation/NavigationSkipLink";
import Container from "@/components/ui/Container";
import PaperTexture from "@/components/ui/PaperTexture";
import { isPricingCountry, ROUTES } from "@/lib/constants";
import { RegionService } from "@/services/RegionService";
import { SessionService } from "@/services/SessionService";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";
import type { HomeSelectorCode } from "@/translations/homeCountries/homeCountryTypes";

interface AuthLayoutProps {
  /** "de" | "tr" | … — drives hyphenation and the Turkish İ/I in uppercase type */
  lang: string;
  layout: IAuthTranslation["Layout"];
  /** <RegionDetector /> when the host sends no geo header */
  detector?: ReactNode;
  /** <AuthIntro /> + <AuthCard />, or the account sections */
  children: ReactNode;
}

const MAIN_ID = "formular";
const LINK_CLASSES = "underline-offset-4 transition-colors hover:text-ink hover:underline";

/** Quiet frame for every account, auth & checkout page: masthead with country switch, two-column sheet, legal line. */
export default async function AuthLayout({ lang, layout, detector, children }: AuthLayoutProps) {
  const [region, user] = await Promise.all([RegionService.GetRegion(), SessionService.getCurrentUser()]);
  const userCountry = user?.country?.toUpperCase();
  const activeCountry: HomeSelectorCode = region.isMarketChosen
    ? region.pricingCountry
    : isPricingCountry(userCountry)
      ? userCountry
      : region.pricingCountry;

  return (
    <div lang={lang} className="flex min-h-dvh flex-col overflow-x-clip">
      <PaperTexture />
      <NavigationSkipLink label={layout.SkipToContent} targetId={MAIN_ID} />
      {detector}
      <header className="border-b-2 border-ink bg-paper/90 backdrop-blur-md">
        <Container className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-2">
          <BrandMark />
          <div className="flex items-center gap-2.5 sm:gap-4">
            <NavigationLanguageSwitch current={activeCountry} />
            <Link
              href={ROUTES.home}
              className="group inline-flex items-center gap-1.5 font-narrow text-xs font-medium tracking-[0.08em] text-ink-soft uppercase transition-colors hover:text-ink sm:gap-2 sm:text-sm"
            >
              <AuthIcon name="arrowLeft" className="size-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-1" />
              <span className="hidden xs:inline sm:inline">{layout.BackHome}</span>
            </Link>
          </div>
        </Container>
      </header>

      <main id={MAIN_ID} aria-label={layout.MainLabel} tabIndex={-1} className="flex-1 outline-none">
        <Container className="grid min-w-0 items-start gap-8 py-8 sm:gap-10 sm:py-14 lg:grid-cols-12 lg:gap-10 lg:py-16 xl:gap-12 xl:py-20">
          {children}
        </Container>
      </main>

      <footer className="border-t border-rule">
        <Container className="flex flex-col gap-3 py-5 font-mono text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex min-w-0 items-center gap-2">
            <AuthIcon name="lock" className="size-3.5 shrink-0 text-ink" />
            <span className="wrap-break-word">{layout.Secure}</span>
          </span>
          <span className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <Link href={ROUTES.imprint} className={LINK_CLASSES}>{layout.Imprint}</Link>
            <Link href={ROUTES.privacy} className={LINK_CLASSES}>{layout.Privacy}</Link>
            <Link href={ROUTES.terms} className={LINK_CLASSES}>{layout.Terms}</Link>
            <ConsumerFooterButtons />
          </span>
        </Container>
      </footer>
    </div>
  );
}
