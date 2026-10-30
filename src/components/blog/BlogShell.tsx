import { ReactNode } from "react";
import BrandMark from "@/components/brand/BrandMark";
import ConsumerFooterButtons from "@/components/consumer/ConsumerFooterButtons";
import Footer from "@/components/footer/Footer";
import FooterColumn from "@/components/footer/FooterColumn";
import FooterLink from "@/components/footer/FooterLink";
import Navigation from "@/components/navigation/Navigation";
import NavigationItem from "@/components/navigation/NavigationItem";
import NavigationLoginButton from "@/components/navigation/NavigationLoginButton";
import NavigationSkipLink from "@/components/navigation/NavigationSkipLink";
import NavigationSpacer from "@/components/navigation/NavigationSpacer";
import NavigationVerticalLine from "@/components/navigation/NavigationVerticalLine";
import PaperTexture from "@/components/ui/PaperTexture";
import { ROUTES, SOURCES } from "@/lib/constants";
import { TranslationService } from "@/services/TranslationService";
import { BlogLang } from "@/types/blog.types";

interface BlogShellProps {
  lang: BlogLang;
  children: ReactNode;
}

const MAIN_ID = "inhalt";

export default async function BlogShell({ lang, children }: BlogShellProps) {
  const locale = TranslationService.NormalizeLocale(lang === "tr" ? "tr" : "de");
  const t = TranslationService.GetTranslations(locale);
  const nav = t.Navigation;
  const homePrefix = "/";
  const blogHref = lang === "de" ? ROUTES.blog : `/${lang}/blog`;

  return (
    <div lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <PaperTexture />
      <NavigationSkipLink label={nav.SkipToContent} targetId={MAIN_ID} />
      <Navigation label={nav.MainNavLabel}>
        <BrandMark />
        <NavigationSpacer />
        <NavigationItem href={`${homePrefix}${ROUTES.calculator}`} label={nav.CalculatorLabel} />
        <NavigationItem href={`${homePrefix}${ROUTES.notice}`} label={nav.NoticeLabel} />
        <NavigationItem href={`${homePrefix}${ROUTES.method}`} label={nav.MethodLabel} />
        <NavigationItem href={`${homePrefix}${ROUTES.pricing}`} label={nav.PricingLabel} />
        <NavigationItem href={blogHref} label={nav.BlogLabel} />
        <NavigationVerticalLine />
        <NavigationLoginButton loginLabel={nav.LoginLabel} signupLabel={nav.SignupLabel} />
      </Navigation>

      <main id={MAIN_ID}>{children}</main>

      <Footer
        tagline={t.Footer.Tagline}
        disclaimer={t.Footer.Disclaimer}
        rights={t.Footer.Rights}
        actions={<ConsumerFooterButtons tone="paper" />}
      >
        <FooterColumn title={t.Footer.ProductTitle}>
          <FooterLink href={`${homePrefix}${ROUTES.calculator}`} label={nav.CalculatorLabel} />
          <FooterLink href={`${homePrefix}${ROUTES.method}`} label={nav.MethodLabel} />
          <FooterLink href={`${homePrefix}${ROUTES.pricing}`} label={nav.PricingLabel} />
          <FooterLink href={blogHref} label={nav.BlogLabel} />
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
    </div>
  );
}
