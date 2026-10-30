import { Metadata } from "next";
import BrandMark from "@/components/brand/BrandMark";
import ClosingCta from "@/components/closing/ClosingCta";
import CompareRow from "@/components/compare/CompareRow";
import CompareTable from "@/components/compare/CompareTable";
import ConsumerFooterButtons from "@/components/consumer/ConsumerFooterButtons";
import FaqItem from "@/components/faq/FaqItem";
import FaqSection from "@/components/faq/FaqSection";
import Footer from "@/components/footer/Footer";
import FooterColumn from "@/components/footer/FooterColumn";
import FooterLink from "@/components/footer/FooterLink";
import BidCalculator from "@/components/hero/BidCalculator";
import HeroSection from "@/components/hero/HeroSection";
import LimitItem from "@/components/limits/LimitItem";
import LimitsSection from "@/components/limits/LimitsSection";
import MethodSection from "@/components/method/MethodSection";
import MethodStep from "@/components/method/MethodStep";
import Navigation from "@/components/navigation/Navigation";
import NavigationItem from "@/components/navigation/NavigationItem";
import NavigationLoginButton from "@/components/navigation/NavigationLoginButton";
import NavigationSkipLink from "@/components/navigation/NavigationSkipLink";
import NavigationSpacer from "@/components/navigation/NavigationSpacer";
import NavigationVerticalLine from "@/components/navigation/NavigationVerticalLine";
import NoticeCard from "@/components/notice/NoticeCard";
import NoticeShowcase from "@/components/notice/NoticeShowcase";
import PricingMarketSwitch from "@/components/pricing/PricingMarketSwitch";
import PricingPlan from "@/components/pricing/PricingPlan";
import PricingSection from "@/components/pricing/PricingSection";
import StateIndex from "@/components/states/StateIndex";
import StateIndexRow from "@/components/states/StateIndexRow";
import StatsLedger from "@/components/stats/StatsLedger";
import StatsLedgerItem from "@/components/stats/StatsLedgerItem";
import NoticeTicker from "@/components/ticker/NoticeTicker";
import NoticeTickerItem from "@/components/ticker/NoticeTickerItem";
import RegionDetector from "@/components/region/RegionDetector";
import LandingShell from "@/components/ui/LandingShell";
import PageMain from "@/components/ui/PageMain";
import PaperTexture from "@/components/ui/PaperTexture";
import { BILLING_ROUTES, MARKET_PARAM, OFFER_PARAM } from "@/lib/billing/billingConfig";
import { ROUTES, SOURCES } from "@/lib/constants";
import { formatCompactEuro, formatDate, formatEuro, formatNumber, formatPercent, formatShortDate } from "@/lib/format";
import { SNAPSHOT_DATE, SNAPSHOT_STATS, STATES, TICKER_ENTRIES } from "@/lib/snapshot";
import { MetaTagService } from "@/services/MetaTagService";
import { RegionService } from "@/services/RegionService";
import { TranslationService } from "@/services/TranslationService";
import { IPricingPlan } from "@/translations/ITranslation";

/**
 * This page reads cookies() and headers() via TranslationService for locale
 * detection. That is request-time data, so this route must be dynamic.
 *
 * `instant = false` is the Next.js 16 way to opt a route out of instant-navigation
 * prerender validation. It does not change the rendering model — the page still
 * renders on the server per request, exactly as intended.
 *
 * See: https://nextjs.org/docs/messages/blocking-prerender-runtime
 */
export const instant = false;

const MAIN_ID = "inhalt";
const STAGGER_MS = 100;
const MAX_STATE_HEARINGS = Math.max(...STATES.map((state) => state.hearings ?? 0));

export async function generateMetadata(): Promise<Metadata> {
  const t = await TranslationService.GetUserTranslations();
  return MetaTagService.CreateMetaTags(t.HomePage.MetaTags);
}

export default async function HomePage() {
  const region = await RegionService.GetRegion();
  const userLocale = await TranslationService.GetUserLocale();
  const t = TranslationService.GetTranslations(userLocale);
  const locale = TranslationService.ToLocaleOption(userLocale);
  const { Hero, Calculator, Ticker, Stats, Notice, Method, States, Limits, Compare, Pricing, Faq, Closing } = t.HomePage;
  const nav = t.Navigation;
  const plans = Pricing.Markets[region.market];

  // lang on the wrapper so uppercase display type follows locale rules (İ/I in Turkish)
  return (
    <LandingShell lang={locale}>
      <PaperTexture />
      {!region.isFromGeoHeader && <RegionDetector country={region.country} />}
      <NavigationSkipLink label={nav.SkipToContent} targetId={MAIN_ID} />
      <Navigation label={nav.MainNavLabel}>
        <BrandMark />
        <NavigationSpacer />
        <NavigationItem href={ROUTES.calculator} label={nav.CalculatorLabel} />
        <NavigationItem href={ROUTES.notice} label={nav.NoticeLabel} />
        <NavigationItem href={ROUTES.method} label={nav.MethodLabel} />
        <NavigationItem href={ROUTES.states} label={nav.StatesLabel} />
        <NavigationItem href={ROUTES.pricing} label={nav.PricingLabel} />
        <NavigationItem href={ROUTES.faq} label={nav.FaqLabel} />
        <NavigationItem href={ROUTES.blog} label={nav.BlogLabel} />
        <NavigationVerticalLine />
        <NavigationLoginButton loginLabel={nav.LoginLabel} signupLabel={nav.SignupLabel} />
      </Navigation>

      <PageMain id={MAIN_ID}>
        <HeroSection
          dateline={Hero.Dateline}
          liveLabel={Hero.LiveLabel}
          headlineTop={Hero.HeadlineTop}
          headlineBelow={Hero.HeadlineBelow}
          lineLabel={Hero.LineLabel}
          description={Hero.Description}
          principle={Hero.Principle}
          primaryCta={Hero.PrimaryCta}
          secondaryCta={Hero.SecondaryCta}
          note={Hero.Note}
        >
          <BidCalculator t={Calculator} locale={locale} />
        </HeroSection>

        <NoticeTicker label={Ticker.Label}>
          {TICKER_ENTRIES.map((entry) => (
            <NoticeTickerItem
              key={`${entry.court}-${entry.date}`}
              court={`${Ticker.CourtPrefix} ${entry.court}`}
              segment={Ticker.Segments[entry.segment]}
              state={entry.state}
              date={`${Ticker.HearingPrefix} ${formatShortDate(entry.date, locale)}`}
              valueLabel={Ticker.ValueHidden}
            />
          ))}
        </NoticeTicker>

        <StatsLedger asOfLabel={Stats.AsOf} asOfDate={formatDate(SNAPSHOT_DATE, locale)} sourceLabel={t.Footer.SourceZvg}>
          <StatsLedgerItem value={formatNumber(SNAPSHOT_STATS.proceedings, locale)} label={Stats.Proceedings} />
          <StatsLedgerItem value={formatNumber(SNAPSHOT_STATS.withAppraisal, locale)} label={Stats.WithAppraisal} delay={STAGGER_MS} />
          <StatsLedgerItem value={formatNumber(SNAPSHOT_STATS.statesWithHearings, locale)} label={Stats.States} delay={STAGGER_MS * 2} />
          <StatsLedgerItem value={formatCompactEuro(SNAPSHOT_STATS.totalAppraisedEuro, locale)} label={Stats.TotalValue} delay={STAGGER_MS * 3} isAccent />
          <StatsLedgerItem value={formatEuro(SNAPSHOT_STATS.medianAppraisedEuro, locale)} label={Stats.Median} delay={STAGGER_MS * 4} />
        </StatsLedger>

        <NoticeShowcase number="01" eyebrow={Notice.Eyebrow} title={Notice.Title} description={Notice.Description} paragraphs={Notice.Paragraphs}>
          <NoticeCard t={Notice.Card} redaction={Notice.Redaction} />
        </NoticeShowcase>

        <MethodSection
          number="02"
          eyebrow={Method.Eyebrow}
          title={Method.Title}
          description={Method.Description}
          disclaimerTitle={Method.Disclaimer.Title}
          disclaimerBody={Method.Disclaimer.Body}
        >
          <MethodStep number="1" kicker={Method.StepOne.Kicker} title={Method.StepOne.Title} body={Method.StepOne.Body} />
          <MethodStep number="2" kicker={Method.StepTwo.Kicker} title={Method.StepTwo.Title} body={Method.StepTwo.Body} delay={STAGGER_MS} />
          <MethodStep number="3" kicker={Method.StepThree.Kicker} title={Method.StepThree.Title} body={Method.StepThree.Body} delay={STAGGER_MS * 2} isHighlighted />
        </MethodSection>

        <StateIndex
          number="03"
          eyebrow={States.Eyebrow}
          title={States.Title}
          description={States.Description}
          colState={States.ColState}
          colHearings={States.ColHearings}
          colTax={States.ColTax}
          footnote={States.Footnote}
        >
          {STATES.map((state) => (
            <StateIndexRow
              key={state.code}
              name={state.name}
              code={state.code}
              share={state.hearings === null ? null : (state.hearings / MAX_STATE_HEARINGS) * 100}
              hearingsLabel={state.hearings === null ? States.NotPublished : formatNumber(state.hearings, locale)}
              taxLabel={formatPercent(state.transferTaxPct, locale)}
            />
          ))}
        </StateIndex>

        <LimitsSection
          number="04"
          eyebrow={Limits.Eyebrow}
          title={Limits.Title}
          description={Limits.Description}
          ruleTitle={Limits.Rule.Title}
          ruleBody={Limits.Rule.Body}
        >
          <LimitItem index="01" title={Limits.ItemOne.Title} body={Limits.ItemOne.Body} />
          <LimitItem index="02" title={Limits.ItemTwo.Title} body={Limits.ItemTwo.Body} delay={STAGGER_MS} />
          <LimitItem index="03" title={Limits.ItemThree.Title} body={Limits.ItemThree.Body} />
          <LimitItem index="04" title={Limits.ItemFour.Title} body={Limits.ItemFour.Body} delay={STAGGER_MS} />
        </LimitsSection>

        <CompareTable
          number="05"
          eyebrow={Compare.Eyebrow}
          title={Compare.Title}
          description={Compare.Description}
          colCriterion={Compare.ColCriterion}
          colManual={Compare.ColManual}
          colBelowmark={Compare.ColBelowmark}
        >
          {Compare.Rows.map((row) => (
            <CompareRow key={row.Criterion} criterion={row.Criterion} manual={row.Manual} belowmark={row.Belowmark} />
          ))}
        </CompareTable>

        <PricingSection
          number="06"
          eyebrow={Pricing.Eyebrow}
          title={Pricing.Title}
          description={Pricing.Description}
          disclaimer={Pricing.Disclaimer}
          marketSwitch={
            <PricingMarketSwitch
              current={region.market}
              label={Pricing.MarketLabel}
              detectedLabel={region.isMarketChosen ? undefined : Pricing.MarketDetected}
              hint={Pricing.MarketHint}
              options={{
                DE: { label: Pricing.Markets.DE.Label, scope: Pricing.Markets.DE.Scope },
                TR: { label: Pricing.Markets.TR.Label, scope: Pricing.Markets.TR.Scope },
              }}
            />
          }
        >
          <PricingPlan {...planProps(plans.Free)} href={ROUTES.signup} />
          <PricingPlan
            {...planProps(plans.Investor)}
            href={`${BILLING_ROUTES.order}?${OFFER_PARAM}=investor-monat&${MARKET_PARAM}=${region.market}`}
            altPrice={`${Pricing.AltPricePrefix} ${plans.Investor.AltPrice} ${plans.Investor.AltPeriod}`}
            recommendedLabel={Pricing.Recommended}
            delay={STAGGER_MS}
          />
          <PricingPlan
            {...planProps(plans.Pro)}
            href={`${BILLING_ROUTES.order}?${OFFER_PARAM}=pro-monat&${MARKET_PARAM}=${region.market}`}
            altPrice={`${Pricing.AltPricePrefix} ${plans.Pro.AltPrice} ${plans.Pro.AltPeriod}`}
            delay={STAGGER_MS * 2}
          />
        </PricingSection>

        <FaqSection number="07" eyebrow={Faq.Eyebrow} title={Faq.Title} description={Faq.Description} moreTitle={Faq.MoreTitle} moreCta={Faq.MoreCta}>
          {Faq.Items.map((item, index) => (
            <FaqItem key={item.Question} index={index + 1} question={item.Question} answer={item.Answer} sources={item.Sources} sourceLabel={Faq.SourceLabel} />
          ))}
        </FaqSection>

        <ClosingCta
          titleTop={Closing.TitleTop}
          titleBelow={Closing.TitleBelow}
          description={Closing.Description}
          primaryCta={Closing.PrimaryCta}
          secondaryCta={Closing.SecondaryCta}
        />
      </PageMain>

      <Footer tagline={t.Footer.Tagline} disclaimer={t.Footer.Disclaimer} rights={t.Footer.Rights} actions={<ConsumerFooterButtons tone="paper" />}>
        <FooterColumn title={t.Footer.ProductTitle}>
          <FooterLink href="/zwangsversteigerungen" label={locale === "tr" ? "Almanya ZVG Rehberi (530 AG)" : "ZVG Verzeichnis (530 AG)"} />
          <FooterLink href="/rechner/5-10-und-7-10-grenze" label={locale === "tr" ? "5/10 & 7/10 Hesaplama" : "5/10- & 7/10-Rechner"} />
          <FooterLink href="/tr/icra-ihale" label="Türkiye İcra & İhale (81 İl)" />
          <FooterLink href="/tr/hesaplama/icra-ihale-teminat" label="İcra Teminat Hesaplama" />
          <FooterLink href={ROUTES.blog} label={nav.BlogLabel} />
          <FooterLink href={ROUTES.login} label={nav.LoginLabel} />
        </FooterColumn>
        <FooterColumn title={t.Footer.SourcesTitle}>
          <FooterLink href={SOURCES.zvgPortal} label={t.Footer.SourceZvg} isExternal />
          <FooterLink href={SOURCES.zvgLaw} label={t.Footer.SourceLaw} isExternal />
          <FooterLink href={SOURCES.justiz} label={t.Footer.SourceJustiz} isExternal />
        </FooterColumn>
        <FooterColumn title={t.Footer.LegalTitle}>
          <FooterLink href={ROUTES.imprint} label={t.Footer.Imprint} />
          <FooterLink href={ROUTES.terms} label={t.Footer.Terms} />
          <FooterLink href={ROUTES.withdrawal} label={t.Footer.Withdrawal} />
          <FooterLink href={ROUTES.privacy} label={t.Footer.Privacy} />
        </FooterColumn>
      </Footer>
    </LandingShell>
  );
}

/** Maps a translated plan to the shared PricingPlan props. */
function planProps(plan: IPricingPlan) {
  return {
    name: plan.Name,
    tagline: plan.Tagline,
    price: plan.Price,
    period: plan.Period,
    features: plan.Features,
    cta: plan.Cta,
    note: plan.Note,
  };
}
