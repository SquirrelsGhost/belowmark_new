import { Metadata } from "next";
import AuroraBackground from "@/components/background/AuroraBackground";
import GrainOverlay from "@/components/background/GrainOverlay";
import FeatureBars from "@/components/features/FeatureBars";
import FeatureCard from "@/components/features/FeatureCard";
import FeatureGrid from "@/components/features/FeatureGrid";
import FeatureOrbit from "@/components/features/FeatureOrbit";
import Footer from "@/components/footer/Footer";
import FooterColumn from "@/components/footer/FooterColumn";
import FooterLink from "@/components/footer/FooterLink";
import CtaSection from "@/components/home/CtaSection";
import HeroPreview from "@/components/home/HeroPreview";
import HeroSection from "@/components/home/HeroSection";
import LogoMarquee from "@/components/home/LogoMarquee";
import LogoMarqueeItem from "@/components/home/LogoMarqueeItem";
import Navigation from "@/components/navigation/Navigation";
import NavigationItem from "@/components/navigation/NavigationItem";
import NavigationLocaleSwitch from "@/components/navigation/NavigationLocaleSwitch";
import NavigationLoginButton from "@/components/navigation/NavigationLoginButton";
import NavigationLogo from "@/components/navigation/NavigationLogo";
import NavigationVerticalLine from "@/components/navigation/NavigationVerticalLine";
import ProcessSection from "@/components/process/ProcessSection";
import ProcessStep from "@/components/process/ProcessStep";
import StatItem from "@/components/stats/StatItem";
import StatsBand from "@/components/stats/StatsBand";
import { ROUTES } from "@/lib/constants";
import { MetaTagService } from "@/services/MetaTagService";
import { TranslationService } from "@/services/TranslationService";
import { Locale } from "@/translations/Translations";

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

/** Placeholder customer wordmarks — replace with real logos. */
const MARQUEE_BRANDS = [
  { name: "Northwind", style: "sans" },
  { name: "Lumen", style: "serif" },
  { name: "ATLAS", style: "mono" },
  { name: "Halcyon", style: "sans" },
  { name: "Meridian", style: "serif" },
  { name: "VERTEX", style: "mono" },
  { name: "Kinetic", style: "sans" },
  { name: "Solace", style: "serif" },
] as const;

const STAGGER_MS = 100;

export async function generateMetadata(): Promise<Metadata> {
  const t = await TranslationService.GetUserTranslations();
  return MetaTagService.CreateMetaTags(t.HomePage.MetaTags);
}

export default async function HomePage() {
  const locale = await TranslationService.GetUserLocale();
  const t = TranslationService.GetTranslations(locale);
  const { Hero, Preview, Marquee, Features, Process, Stats, Cta } = t.HomePage;

  return (
    <>
      <GrainOverlay />
      <Navigation label={t.Navigation.MainNavLabel}>
        <NavigationLogo />
        <NavigationItem href={ROUTES.features} label={t.Navigation.FeaturesLabel} />
        <NavigationItem href={ROUTES.process} label={t.Navigation.ProcessLabel} />
        <NavigationItem href={ROUTES.stats} label={t.Navigation.StatsLabel} />
        <NavigationItem href={ROUTES.contact} label={t.Navigation.ContactLabel} />
        <NavigationVerticalLine />
        <NavigationLocaleSwitch current={locale === Locale.EN ? "en" : "de"} label={t.Navigation.LocaleSwitchLabel} />
        <NavigationLoginButton loginLabel={t.Navigation.LoginLabel} signupLabel={t.Navigation.SignupLabel} />
      </Navigation>

      <main className="relative isolate">
        <AuroraBackground />
        <HeroSection
          eyebrow={Hero.Eyebrow}
          headlineStart={Hero.HeadlineStart}
          headlineAccent={Hero.HeadlineAccent}
          description={Hero.Description}
          primaryCta={Hero.PrimaryCta}
          secondaryCta={Hero.SecondaryCta}
          note={Hero.Note}
        >
          <HeroPreview
            windowTitle={Preview.WindowTitle}
            metricLabel={Preview.MetricLabel}
            metricValue={Preview.MetricValue}
            metricDelta={Preview.MetricDelta}
            liveLabel={Preview.LiveLabel}
            rowOne={Preview.RowOne}
            rowTwo={Preview.RowTwo}
            rowThree={Preview.RowThree}
          />
        </HeroSection>

        <LogoMarquee label={Marquee.Label}>
          {MARQUEE_BRANDS.map((brand) => (
            <LogoMarqueeItem key={brand.name} name={brand.name} style={brand.style} />
          ))}
        </LogoMarquee>

        <FeatureGrid eyebrow={Features.Eyebrow} title={Features.Title} titleAccent={Features.TitleAccent} description={Features.Description}>
          <FeatureCard icon="target" span="wide" title={Features.Precision.Title} description={Features.Precision.Description}>
            <FeatureBars />
          </FeatureCard>
          <FeatureCard icon="bolt" delay={STAGGER_MS} title={Features.Speed.Title} description={Features.Speed.Description} />
          <FeatureCard icon="shield" title={Features.Security.Title} description={Features.Security.Description} />
          <FeatureCard icon="chart" span="wide" delay={STAGGER_MS} title={Features.Insights.Title} description={Features.Insights.Description}>
            <FeatureOrbit />
          </FeatureCard>
          <FeatureCard icon="users" span="wide" title={Features.Collaboration.Title} description={Features.Collaboration.Description} />
          <FeatureCard icon="plug" delay={STAGGER_MS} title={Features.Integrations.Title} description={Features.Integrations.Description} />
        </FeatureGrid>

        <StatsBand>
          <StatItem value={Stats.Uptime.Value} label={Stats.Uptime.Label} />
          <StatItem value={Stats.Latency.Value} label={Stats.Latency.Label} />
          <StatItem value={Stats.Teams.Value} label={Stats.Teams.Label} />
          <StatItem value={Stats.Rating.Value} label={Stats.Rating.Label} />
        </StatsBand>

        <ProcessSection eyebrow={Process.Eyebrow} title={Process.Title} titleAccent={Process.TitleAccent} description={Process.Description}>
          <ProcessStep number="01" title={Process.StepOne.Title} description={Process.StepOne.Description} />
          <ProcessStep number="02" delay={STAGGER_MS} title={Process.StepTwo.Title} description={Process.StepTwo.Description} />
          <ProcessStep number="03" delay={STAGGER_MS * 2} title={Process.StepThree.Title} description={Process.StepThree.Description} />
        </ProcessSection>

        <CtaSection title={Cta.Title} titleAccent={Cta.TitleAccent} description={Cta.Description} primaryCta={Cta.PrimaryCta} secondaryCta={Cta.SecondaryCta} />
      </main>

      <Footer tagline={t.Footer.Tagline} rights={t.Footer.Rights}>
        <FooterColumn title={t.Footer.ProductTitle}>
          <FooterLink href={ROUTES.features} label={t.Navigation.FeaturesLabel} />
          <FooterLink href={ROUTES.process} label={t.Navigation.ProcessLabel} />
          <FooterLink href={ROUTES.stats} label={t.Navigation.StatsLabel} />
        </FooterColumn>
        <FooterColumn title={t.Footer.CompanyTitle}>
          <FooterLink href={ROUTES.contact} label={t.Navigation.ContactLabel} />
          <FooterLink href={ROUTES.login} label={t.Navigation.LoginLabel} />
          <FooterLink href={ROUTES.signup} label={t.Navigation.SignupLabel} />
        </FooterColumn>
        <FooterColumn title={t.Footer.LegalTitle}>
          <FooterLink href={ROUTES.privacy} label={t.Footer.PrivacyLabel} />
          <FooterLink href={ROUTES.imprint} label={t.Footer.ImprintLabel} />
        </FooterColumn>
      </Footer>
    </>
  );
}
