import { Metadata } from "next";
import { headers } from "next/headers";
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
import NavigationLanguageSwitch from "@/components/navigation/NavigationLanguageSwitch";
import NavigationLoginButton from "@/components/navigation/NavigationLoginButton";
import NavigationMobileItem from "@/components/navigation/NavigationMobileItem";
import NavigationMobileMenu from "@/components/navigation/NavigationMobileMenu";
import NavigationSkipLink from "@/components/navigation/NavigationSkipLink";
import NavigationSpacer from "@/components/navigation/NavigationSpacer";
import NavigationVerticalLine from "@/components/navigation/NavigationVerticalLine";
import NoticeCard from "@/components/notice/NoticeCard";
import NoticeShowcase from "@/components/notice/NoticeShowcase";
import PricingMarketSwitch from "@/components/pricing/PricingMarketSwitch";
import PricingPlan from "@/components/pricing/PricingPlan";
import PricingSection from "@/components/pricing/PricingSection";
import RegionDetector from "@/components/region/RegionDetector";
import HomeJsonLd from "@/components/seo/HomeJsonLd";
import StateIndex from "@/components/states/StateIndex";
import StateIndexRow from "@/components/states/StateIndexRow";
import StatsLedger from "@/components/stats/StatsLedger";
import StatsLedgerItem from "@/components/stats/StatsLedgerItem";
import NoticeTicker from "@/components/ticker/NoticeTicker";
import NoticeTickerItem from "@/components/ticker/NoticeTickerItem";
import LandingShell from "@/components/ui/LandingShell";
import PageMain from "@/components/ui/PageMain";
import PaperTexture from "@/components/ui/PaperTexture";
import { BILLING_ROUTES, MARKET_PARAM, OFFER_PARAM } from "@/lib/billing/billingConfig";
import { ROUTES } from "@/lib/constants";
import { getFeaturedMarketHubs } from "@/lib/footerDirectoryData";
import { getFooterDirectoryUi } from "@/lib/footerDirectoryUi";
import {
  formatCompactMoney,
  formatDate,
  formatMoney,
  formatNumber,
  formatPercent,
  formatShortDate,
} from "@/lib/format";
import { getHomeMarketBundle } from "@/lib/homeMarketData";
import { SNAPSHOT_DATE } from "@/lib/snapshot";
import { MetaTagService } from "@/services/MetaTagService";
import { RegionService } from "@/services/RegionService";
import { resolveHomeCountryProfile } from "@/translations/homeCountries";
import { IPricingPlan } from "@/translations/ITranslation";

/**
 * This page reads cookies() and headers() via RegionService for country and
 * language detection. That is request-time data, so this route must be dynamic.
 */
export const instant = false;

const MAIN_ID = "inhalt";
const STAGGER_MS = 100;
const AUTHORITY_HAS_TITLE_RE =
  /^(?:AG|BG|TJ|Trib|Juzg|U\.R\.|Secci|Komornik|Exekutor|Kronofogd|SDL|BTG|Betreibungs|Konkurs|Office|De Randamie|Westvaer|Quadrant|Vastgoed|RoX)|Mahkeme|İcra|Memurluğu/i;

export async function generateMetadata(): Promise<Metadata> {
  const [region, reqHeaders] = await Promise.all([RegionService.GetRegion(), headers()]);
  const profile = resolveHomeCountryProfile(region, reqHeaders.get("accept-language"));
  return MetaTagService.CreateMetaTags(profile.HomePage.MetaTags);
}

export default async function HomePage() {
  const [region, reqHeaders] = await Promise.all([RegionService.GetRegion(), headers()]);
  const profile = resolveHomeCountryProfile(region, reqHeaders.get("accept-language"));
  const { formatLocale, htmlLang, selectorCode, liveSearchLabel, freeBadge, trialBadge, directoryCopy } = profile;
  const { Hero, Calculator, Ticker, Stats, Notice, Method, States, Limits, Compare, Pricing, Faq, Closing } =
    profile.HomePage;
  const nav = profile.Navigation;
  const footer = profile.Footer;
  const activeCountry = profile.pricingCountry;
  const footerUi = getFooterDirectoryUi(htmlLang);
  const featuredHubs = getFeaturedMarketHubs(activeCountry);
  const liveSearchHref = `/suche?markt=${activeCountry}`;
  const plans = Pricing.Markets[activeCountry];
  const bundle = getHomeMarketBundle(activeCountry);
  const { snapshot, calculator, noticeCard } = bundle;
  const maxRegionHearings = Math.max(1, ...snapshot.regions.map((item) => item.hearings ?? 0));

  return (
    <LandingShell lang={htmlLang}>
      <HomeJsonLd faqs={Faq.Items} />
      <PaperTexture />
      {!region.isFromGeoHeader && <RegionDetector country={region.country} />}
      <NavigationSkipLink label={nav.SkipToContent} targetId={MAIN_ID} />
      <Navigation label={nav.MainNavLabel}>
        <BrandMark />
        <NavigationSpacer />
        <NavigationItem href={`/suche?markt=${activeCountry}`} label={liveSearchLabel} />
        <NavigationItem href={ROUTES.calculator} label={nav.CalculatorLabel} />
        <NavigationItem href={ROUTES.notice} label={nav.NoticeLabel} />
        <NavigationItem href={ROUTES.method} label={nav.MethodLabel} />
        <NavigationItem href={ROUTES.states} label={nav.StatesLabel} />
        <NavigationItem href={ROUTES.pricing} label={nav.PricingLabel} />
        <NavigationItem href={ROUTES.faq} label={nav.FaqLabel} />
        <NavigationItem href={ROUTES.blog} label={nav.BlogLabel} />
        <NavigationVerticalLine />
        <NavigationLanguageSwitch current={selectorCode} />
        <NavigationLoginButton loginLabel={nav.LoginLabel} signupLabel={nav.SignupLabel} />
        <NavigationMobileMenu label={nav.MainNavLabel}>
          <NavigationMobileItem href={`/suche?markt=${activeCountry}`} label={liveSearchLabel} />
          <NavigationMobileItem href={ROUTES.calculator} label={nav.CalculatorLabel} />
          <NavigationMobileItem href={ROUTES.notice} label={nav.NoticeLabel} />
          <NavigationMobileItem href={ROUTES.method} label={nav.MethodLabel} />
          <NavigationMobileItem href={ROUTES.states} label={nav.StatesLabel} />
          <NavigationMobileItem href={ROUTES.pricing} label={nav.PricingLabel} />
          <NavigationMobileItem href={ROUTES.faq} label={nav.FaqLabel} />
          <NavigationMobileItem href={ROUTES.blog} label={nav.BlogLabel} />
          <NavigationMobileItem href={ROUTES.login} label={nav.LoginLabel} isAccent />
        </NavigationMobileMenu>
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
          <BidCalculator key={`${selectorCode}-${htmlLang}`} t={Calculator} locale={formatLocale} config={calculator} />
        </HeroSection>

        <NoticeTicker label={Ticker.Label}>
          {snapshot.ticker.map((entry) => (
            <NoticeTickerItem
              key={`${entry.authority}-${entry.regionBadge}-${entry.date}`}
              court={formatTickerCourt(Ticker.CourtPrefix, entry.authority)}
              segment={Ticker.Segments[entry.segment]}
              state={entry.regionBadge}
              date={`${Ticker.HearingPrefix} ${formatShortDate(entry.date, formatLocale)}`}
              valueLabel={Ticker.ValueHidden}
            />
          ))}
        </NoticeTicker>

        <StatsLedger
          asOfLabel={Stats.AsOf}
          asOfDate={formatDate(SNAPSHOT_DATE, formatLocale)}
          sourceLabel={snapshot.sourcePortal}
        >
          <StatsLedgerItem value={formatNumber(snapshot.stats.proceedings, formatLocale)} label={Stats.Proceedings} />
          <StatsLedgerItem value={formatNumber(snapshot.stats.withAppraisal, formatLocale)} label={Stats.WithAppraisal} delay={STAGGER_MS} />
          <StatsLedgerItem value={formatNumber(snapshot.stats.statesWithHearings, formatLocale)} label={Stats.States} delay={STAGGER_MS * 2} />
          <StatsLedgerItem
            value={formatCompactMoney(snapshot.stats.totalAppraised, snapshot.currency, formatLocale)}
            label={Stats.TotalValue}
            delay={STAGGER_MS * 3}
            isAccent
          />
          <StatsLedgerItem
            value={formatMoney(snapshot.stats.medianAppraised, snapshot.currency, formatLocale)}
            label={Stats.Median}
            delay={STAGGER_MS * 4}
          />
        </StatsLedger>

        <NoticeShowcase number="01" eyebrow={Notice.Eyebrow} title={Notice.Title} description={Notice.Description} paragraphs={Notice.Paragraphs}>
          <NoticeCard t={Notice.Card} redaction={Notice.Redaction} config={noticeCard} />
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
          {snapshot.regions.map((item) => (
            <StateIndexRow
              key={item.code}
              name={item.name}
              code={item.code}
              href={item.href}
              share={item.hearings === null ? null : (item.hearings / maxRegionHearings) * 100}
              hearingsLabel={item.hearings === null ? States.NotPublished : formatNumber(item.hearings, formatLocale)}
              taxLabel={formatPercent(item.transferTaxPct, formatLocale)}
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
              current={activeCountry}
              label={Pricing.MarketLabel}
              detectedLabel={!region.isMarketChosen && region.isCountryMatched ? Pricing.MarketDetected : undefined}
              hint={Pricing.MarketHint}
              options={{
                DE: { label: Pricing.Markets.DE.Label, scope: Pricing.Markets.DE.Scope },
                AT: { label: Pricing.Markets.AT.Label, scope: Pricing.Markets.AT.Scope },
                CH: { label: Pricing.Markets.CH.Label, scope: Pricing.Markets.CH.Scope },
                IT: { label: Pricing.Markets.IT.Label, scope: Pricing.Markets.IT.Scope },
                ES: { label: Pricing.Markets.ES.Label, scope: Pricing.Markets.ES.Scope },
                FR: { label: Pricing.Markets.FR.Label, scope: Pricing.Markets.FR.Scope },
                GB: { label: Pricing.Markets.GB.Label, scope: Pricing.Markets.GB.Scope },
                NL: { label: Pricing.Markets.NL.Label, scope: Pricing.Markets.NL.Scope },
                PL: { label: Pricing.Markets.PL.Label, scope: Pricing.Markets.PL.Scope },
                CZ: { label: Pricing.Markets.CZ.Label, scope: Pricing.Markets.CZ.Scope },
                SE: { label: Pricing.Markets.SE.Label, scope: Pricing.Markets.SE.Scope },
                TR: { label: Pricing.Markets.TR.Label, scope: Pricing.Markets.TR.Scope },
              }}
            />
          }
        >
          <PricingPlan {...planProps(plans.Free)} href={ROUTES.signup} trialBadge={freeBadge} />
          <PricingPlan
            {...planProps(plans.Investor)}
            href={`${BILLING_ROUTES.order}?${OFFER_PARAM}=investor-monat&${MARKET_PARAM}=${activeCountry}`}
            altPrice={`${Pricing.AltPricePrefix} ${plans.Investor.AltPrice} ${plans.Investor.AltPeriod}`}
            trialBadge={trialBadge}
            recommendedLabel={Pricing.Recommended}
            delay={STAGGER_MS}
          />
          <PricingPlan
            {...planProps(plans.Pro)}
            href={`${BILLING_ROUTES.order}?${OFFER_PARAM}=pro-monat&${MARKET_PARAM}=${activeCountry}`}
            altPrice={`${Pricing.AltPricePrefix} ${plans.Pro.AltPrice} ${plans.Pro.AltPeriod}`}
            trialBadge={trialBadge}
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

      <Footer
        tagline={footer.Tagline}
        disclaimer={footer.Disclaimer}
        rights={footer.Rights}
        lang={htmlLang}
        searchHref={liveSearchHref}
        searchLabel={liveSearchLabel}
        topRegionsHeading={directoryCopy.topRegionsHeading}
      >
        <FooterColumn title={footer.ProductTitle}>
          <FooterLink href={liveSearchHref} label={liveSearchLabel} />
          <FooterLink href={ROUTES.calculator} label={nav.CalculatorLabel} />
          <FooterLink href={ROUTES.method} label={nav.MethodLabel} />
          <FooterLink href={ROUTES.pricing} label={nav.PricingLabel} />
          <FooterLink href={footerUi.atlasHref} label={footerUi.atlasLabel} />
          <FooterLink href={footerUi.blogHref} label={nav.BlogLabel} />
        </FooterColumn>
        <FooterColumn title={footerUi.marketsColumnTitle}>
          {featuredHubs.map((hub) => (
            <FooterLink key={hub.href} href={hub.href} label={hub.shortLabel} />
          ))}
        </FooterColumn>
        <FooterColumn title={footer.LegalTitle}>
          <FooterLink href={ROUTES.imprint} label={footer.Imprint} />
          <FooterLink href={ROUTES.terms} label={footer.Terms} />
          <FooterLink href={ROUTES.withdrawal} label={footer.Withdrawal} />
          <FooterLink href={ROUTES.privacy} label={footer.Privacy} />
          <ConsumerFooterButtons tone="paper" />
        </FooterColumn>
      </Footer>
    </LandingShell>
  );
}

function formatTickerCourt(prefix: string, authority: string): string {
  if (!prefix || AUTHORITY_HAS_TITLE_RE.test(authority)) return authority;
  return `${prefix} ${authority}`;
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
