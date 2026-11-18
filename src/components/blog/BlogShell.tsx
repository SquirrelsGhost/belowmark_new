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
import { ROUTES } from "@/lib/constants";
import { getFeaturedMarketHubs } from "@/lib/footerDirectoryData";
import { getFooterDirectoryUi } from "@/lib/footerDirectoryUi";
import { TranslationService } from "@/services/TranslationService";
import { BlogLang } from "@/types/blog.types";

interface BlogShellProps {
  lang: BlogLang | "nl" | "pl" | "cs" | "sv";
  children: ReactNode;
}

const MAIN_ID = "inhalt";

const SEARCH_NAV_LABEL: Record<string, string> = {
  de: "Live-Suche",
  tr: "Canlı Arama",
  en: "Live Search",
  it: "Ricerca Live",
  es: "Buscador",
  fr: "Recherche",
  nl: "Live Zoeken",
  pl: "Wyszukiwarka",
  cs: "Vyhledávač",
  sv: "Sök Auktioner",
};

export default async function BlogShell({ lang, children }: BlogShellProps) {
  const locale = TranslationService.NormalizeLocale(lang);
  const t = TranslationService.GetTranslations(locale);
  const nav = t.Navigation;
  const footerUi = getFooterDirectoryUi(lang);
  const featuredHubs = getFeaturedMarketHubs(lang === "tr" ? "TR" : undefined);
  const homePrefix = "/";
  const blogHref =
    lang === "de"
      ? ROUTES.blog
      : lang === "nl" || lang === "pl" || lang === "cs" || lang === "sv"
        ? "/en/blog"
        : `/${lang}/blog`;
  const searchLabel = SEARCH_NAV_LABEL[lang] ?? "Live Search";

  return (
    <div lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <PaperTexture />
      <NavigationSkipLink label={nav.SkipToContent} targetId={MAIN_ID} />
      <Navigation label={nav.MainNavLabel}>
        <BrandMark />
        <NavigationSpacer />
        <NavigationItem href="/suche" label={searchLabel} />
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
        lang={lang}
        searchHref="/suche"
        searchLabel={searchLabel}
      >
        <FooterColumn title={t.Footer.ProductTitle}>
          <FooterLink href="/suche" label={searchLabel} />
          <FooterLink href={`${homePrefix}${ROUTES.calculator}`} label={nav.CalculatorLabel} />
          <FooterLink href={`${homePrefix}${ROUTES.method}`} label={nav.MethodLabel} />
          <FooterLink href={`${homePrefix}${ROUTES.pricing}`} label={nav.PricingLabel} />
          <FooterLink href={footerUi.atlasHref} label={footerUi.atlasLabel} />
          <FooterLink href={blogHref} label={nav.BlogLabel} />
        </FooterColumn>
        <FooterColumn title={footerUi.marketsColumnTitle}>
          {featuredHubs.map((hub) => (
            <FooterLink key={hub.href} href={hub.href} label={hub.shortLabel} />
          ))}
        </FooterColumn>
        <FooterColumn title={t.Footer.LegalTitle}>
          <FooterLink href={ROUTES.imprint} label={t.Footer.Imprint} />
          <FooterLink href={ROUTES.terms} label={t.Footer.Terms} />
          <FooterLink href={ROUTES.withdrawal} label={t.Footer.Withdrawal} />
          <FooterLink href={ROUTES.privacy} label={t.Footer.Privacy} />
          <ConsumerFooterButtons tone="paper" />
        </FooterColumn>
      </Footer>
    </div>
  );
}
