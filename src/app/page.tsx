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
import NavigationLanguageSwitch from "@/components/navigation/NavigationLanguageSwitch";
import NavigationLoginButton from "@/components/navigation/NavigationLoginButton";
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
import HomeSeoDirectorySection from "@/components/seo/HomeSeoDirectorySection";
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
import { TRIAL_COPY } from "@/lib/billing/trialCopy";
import { LocaleOption, ROUTES } from "@/lib/constants";
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
import { TranslationService } from "@/services/TranslationService";
import { IPricingPlan } from "@/translations/ITranslation";

/**
 * This page reads cookies() and headers() via TranslationService for locale
 * and country detection. That is request-time data, so this route must be dynamic.
 */
export const instant = false;

const MAIN_ID = "inhalt";
const STAGGER_MS = 100;
const AUTHORITY_HAS_TITLE_RE =
  /^(?:AG|BG|TJ|Trib|Juzg|U\.R\.|Secci|Komornik|Exekutor|Kronofogd|SDL|BTG|Betreibungs|Konkurs|Office|De Randamie|Westvaer|Quadrant|Vastgoed|RoX)|Mahkeme|İcra|Memurluğu/i;

const LIVE_SEARCH_LABELS: Record<LocaleOption, string> = {
  en: "Live Search",
  de: "Live-Suche",
  tr: "Canlı Arama",
  it: "Ricerca Live",
  es: "Buscador",
  fr: "Recherche",
};

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
  const plans = Pricing.Markets[region.pricingCountry];
  const bundle = getHomeMarketBundle(region.pricingCountry, locale);
  const { snapshot, calculator, noticeCard, statesOverride, heroNoteOverride } = bundle;
  const maxRegionHearings = Math.max(1, ...snapshot.regions.map((item) => item.hearings ?? 0));

  // lang on the wrapper so uppercase display type follows locale rules (İ/I in Turkish)
  return (
    <LandingShell lang={locale}>
      <HomeJsonLd faqs={Faq.Items} />
      <PaperTexture />
      {!region.isFromGeoHeader && <RegionDetector country={region.country} />}
      <NavigationSkipLink label={nav.SkipToContent} targetId={MAIN_ID} />
      <Navigation label={nav.MainNavLabel}>
        <BrandMark />
        <NavigationSpacer />
        <NavigationItem href={`/suche?markt=${region.pricingCountry}`} label={LIVE_SEARCH_LABELS[locale]} />
        <NavigationItem href={ROUTES.calculator} label={nav.CalculatorLabel} />
        <NavigationItem href={ROUTES.notice} label={nav.NoticeLabel} />
        <NavigationItem href={ROUTES.method} label={nav.MethodLabel} />
        <NavigationItem href={ROUTES.states} label={nav.StatesLabel} />
        <NavigationItem href={ROUTES.pricing} label={nav.PricingLabel} />
        <NavigationItem href={ROUTES.faq} label={nav.FaqLabel} />
        <NavigationItem href={ROUTES.blog} label={nav.BlogLabel} />
        <NavigationVerticalLine />
        <NavigationLanguageSwitch current={locale} />
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
          note={heroNoteOverride ?? Hero.Note}
        >
          <BidCalculator key={bundle.country} t={Calculator} locale={locale} config={calculator} />
        </HeroSection>

        <NoticeTicker label={Ticker.Label}>
          {snapshot.ticker.map((entry) => (
            <NoticeTickerItem
              key={`${entry.authority}-${entry.regionBadge}-${entry.date}`}
              court={formatTickerCourt(Ticker.CourtPrefix, entry.authority)}
              segment={Ticker.Segments[entry.segment]}
              state={entry.regionBadge}
              date={`${Ticker.HearingPrefix} ${formatShortDate(entry.date, locale)}`}
              valueLabel={Ticker.ValueHidden}
            />
          ))}
        </NoticeTicker>

        <StatsLedger
          asOfLabel={Stats.AsOf}
          asOfDate={formatDate(SNAPSHOT_DATE, locale)}
          sourceLabel={snapshot.sourcePortal}
        >
          <StatsLedgerItem value={formatNumber(snapshot.stats.proceedings, locale)} label={Stats.Proceedings} />
          <StatsLedgerItem value={formatNumber(snapshot.stats.withAppraisal, locale)} label={Stats.WithAppraisal} delay={STAGGER_MS} />
          <StatsLedgerItem value={formatNumber(snapshot.stats.statesWithHearings, locale)} label={Stats.States} delay={STAGGER_MS * 2} />
          <StatsLedgerItem
            value={formatCompactMoney(snapshot.stats.totalAppraised, snapshot.currency, locale)}
            label={Stats.TotalValue}
            delay={STAGGER_MS * 3}
            isAccent
          />
          <StatsLedgerItem
            value={formatMoney(snapshot.stats.medianAppraised, snapshot.currency, locale)}
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
          title={statesOverride?.title ?? States.Title}
          description={statesOverride?.description ?? States.Description}
          colState={statesOverride?.colState ?? States.ColState}
          colHearings={States.ColHearings}
          colTax={States.ColTax}
          footnote={statesOverride?.footnote ?? States.Footnote}
        >
          {snapshot.regions.map((item) => (
            <StateIndexRow
              key={item.code}
              name={item.name}
              code={item.code}
              href={item.href}
              share={item.hearings === null ? null : (item.hearings / maxRegionHearings) * 100}
              hearingsLabel={item.hearings === null ? States.NotPublished : formatNumber(item.hearings, locale)}
              taxLabel={formatPercent(item.transferTaxPct, locale)}
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
              current={region.pricingCountry}
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
          <PricingPlan
            {...planProps(plans.Free)}
            href={ROUTES.signup}
            trialBadge={(TRIAL_COPY[locale] ?? TRIAL_COPY.en).homeFreeBadge}
          />
          <PricingPlan
            {...planProps(plans.Investor)}
            href={`${BILLING_ROUTES.order}?${OFFER_PARAM}=investor-monat&${MARKET_PARAM}=${region.pricingCountry}`}
            altPrice={`${Pricing.AltPricePrefix} ${plans.Investor.AltPrice} ${plans.Investor.AltPeriod}`}
            trialBadge={(TRIAL_COPY[locale] ?? TRIAL_COPY.en).homeTrialBadge}
            recommendedLabel={Pricing.Recommended}
            delay={STAGGER_MS}
          />
          <PricingPlan
            {...planProps(plans.Pro)}
            href={`${BILLING_ROUTES.order}?${OFFER_PARAM}=pro-monat&${MARKET_PARAM}=${region.pricingCountry}`}
            altPrice={`${Pricing.AltPricePrefix} ${plans.Pro.AltPrice} ${plans.Pro.AltPeriod}`}
            trialBadge={(TRIAL_COPY[locale] ?? TRIAL_COPY.en).homeTrialBadge}
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

        <HomeSeoDirectorySection locale={locale} />
      </PageMain>

      <Footer tagline={t.Footer.Tagline} disclaimer={t.Footer.Disclaimer} rights={t.Footer.Rights}>
        <FooterColumn title={t.Footer.ProductTitle}>
          <FooterLink href="/zwangsversteigerungen" label="🇩🇪 DE · ZVG Verzeichnis (530 AG)" />
          <FooterLink href="/oesterreich/ediktsdatei" label="🇦🇹 AT · Ediktsdatei (9 Länder)" />
          <FooterLink href="/schweiz/shab-versteigerungen" label="🇨🇭 CH · SHAB Steigerungen (26 Kantone)" />
          <FooterLink href="/it/aste-giudiziarie" label="🇮🇹 IT · Aste Giudiziarie PVP (20 Regioni)" />
          <FooterLink href="/es/subastas-boe" label="🇪🇸 ES · Subastas BOE (17 CCAA)" />
          <FooterLink href="/fr/encheres-immobilieres" label="🇫🇷 FR · Enchères TJ & Notaires (13 Régions)" />
          <FooterLink href="/en/uk-property-auctions" label="🇬🇧 UK · Property Auctions (12 Regions)" />
          <FooterLink href="/nl/executieveiling" label="🇳🇱 NL · Executieveilingen (12 Provincies)" />
          <FooterLink href="/pl/licytacje-komornicze" label="🇵🇱 PL · Licytacje Komornicze (16 Woj.)" />
          <FooterLink href="/cz/drazby-nemovitosti" label="🇨🇿 CZ · Dražby Nemovitostí (14 Krajů)" />
          <FooterLink href="/se/exekutiv-auktion" label="🇸🇪 SE · Kronofogden Auktioner (21 Län)" />
          <FooterLink href="/tr/icra-ihale" label="🇹🇷 TR · İcra & İhale (81 İl)" />
        </FooterColumn>
        <FooterColumn title={t.Footer.SourcesTitle}>
          <FooterLink href="/rechner/5-10-und-7-10-grenze" label="🧮 DE · 5/10- & 7/10-Rechner" />
          <FooterLink href="/oesterreich/rechner/geringstes-gebot-vadium" label="🧮 AT · § 151 EO & Vadium Rechner" />
          <FooterLink href="/schweiz/rechner/betreibungsamtliche-steigerung-schkg" label="🧮 CH · SchKG Steigerungsrechner" />
          <FooterLink href="/it/calcolatore/offerta-minima-75-asta-giudiziaria" label="🧮 IT · Calcolatore Offerta Minima 75%" />
          <FooterLink href="/es/calculadora/subasta-judicial-boe-70-por-ciento" label="🧮 ES · Calculadora BOE 70% LEC" />
          <FooterLink href="/fr/calculateur/encheres-judiciaires-licitor-frais" label="🧮 FR · Calculateur Frais Licitor" />
          <FooterLink href="/en/calculator/uk-property-auction-stamp-duty-deposit" label="🧮 UK · Auction & SDLT Calculator" />
          <FooterLink href="/nl/calculator/executieveiling-kosten-overdrachtsbelasting" label="🧮 NL · Executieveiling Calculator" />
          <FooterLink href="/pl/kalkulator/licytacja-komornicza-wadium" label="🧮 PL · Kalkulator Licytacji KPC" />
          <FooterLink href="/cz/kalkulacka/exekucni-drazba-nejnizsi-podani-jistota" label="🧮 CZ · Kalkulačka Exekuční Dražby" />
          <FooterLink href="/se/kalkylator/kronofogden-exekutiv-auktion-handpenning" label="🧮 SE · Kronofogden Kalkylator" />
          <FooterLink href="/tr/hesaplama/icra-ihale-teminat" label="🧮 TR · İcra Teminat Hesaplama" />
        </FooterColumn>
        <FooterColumn title={t.Footer.LegalTitle}>
          <FooterLink href={ROUTES.imprint} label={t.Footer.Imprint} />
          <FooterLink href={ROUTES.terms} label={t.Footer.Terms} />
          <FooterLink href={ROUTES.withdrawal} label={t.Footer.Withdrawal} />
          <FooterLink href={ROUTES.privacy} label={t.Footer.Privacy} />
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
