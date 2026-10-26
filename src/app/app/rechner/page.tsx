import { Metadata } from "next";
import IcraCalculator from "@/components/app/calculator/IcraCalculator";
import AppMain from "@/components/app/shell/AppMain";
import AppPageHeader from "@/components/app/shell/AppPageHeader";
import TrCalculatorExtras from "@/components/app/tr/TrCalculatorExtras";
import BidCalculator from "@/components/hero/BidCalculator";
import { APP_MAIN_ID, APP_ROUTES } from "@/lib/appConstants";
import { appMetadata, getAppPageContext } from "@/lib/appPage";

// Reads the session cookie on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

/** Starting values of the free İcra calculator (a typical flat in the snapshot). */
const TR_DEFAULTS = { value: 2_500_000, vatRate: 1 } as const;

export async function generateMetadata(): Promise<Metadata> {
  return appMetadata((app) => app.MetaTags.Calculator);
}

export default async function CalculatorPage() {
  const { viewer, t, app, locale } = await getAppPageContext(APP_ROUTES.calculator);
  const { Calculator } = app;

  return (
    <AppMain id={APP_MAIN_ID}>
      <AppPageHeader eyebrow={Calculator.Eyebrow} title={Calculator.Title} lead={Calculator.Lead[viewer.market]} />
      <div className="mt-10 max-w-4xl">
        {viewer.market === "TR" ? (
          <>
            <IcraCalculator labels={Calculator.Tr} costLabels={app.Listing.Tr} locale={locale} value={TR_DEFAULTS.value} vatRate={TR_DEFAULTS.vatRate} isFixed={false} />
            <TrCalculatorExtras locale={locale} now={viewer.now} initialLira={TR_DEFAULTS.value} />
          </>
        ) : (
          <BidCalculator t={t.HomePage.Calculator} locale={locale} />
        )}
      </div>
    </AppMain>
  );
}
