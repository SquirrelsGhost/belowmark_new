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
          <FooterLink href="/zwangsversteigerungen" label="🇩🇪 DE · ZVG Verzeichnis (16 Länder)" />
          <FooterLink href="/oesterreich/ediktsdatei" label="🇦🇹 AT · Ediktsdatei (9 Länder)" />
          <FooterLink href="/schweiz/shab-versteigerungen" label="🇨🇭 CH · SHAB Steigerungen (26 Kantone)" />
          <FooterLink href="/it/aste-giudiziarie" label="🇮🇹 IT · Aste Giudiziarie PVP (20 Regioni)" />
          <FooterLink href="/es/subastas-boe" label="🇪🇸 ES · Subastas BOE (17 CCAA)" />
          <FooterLink href="/fr/encheres-immobilieres" label="🇫🇷 FR · Enchères Licitor (13 Régions)" />
          <FooterLink href="/en/uk-property-auctions" label="🇬🇧 UK · Property Auctions (12 Regions)" />
          <FooterLink href="/tr/icra-ihale" label="🇹🇷 TR · İcra & İhale (81 İl)" />
        </FooterColumn>
        <FooterColumn title={t.Footer.SourcesTitle}>
          <FooterLink href="/rechner/5-10-und-7-10-grenze" label="🧮 DE · 5/10- & 7/10-Rechner" />
          <FooterLink href="/oesterreich/rechner/geringstes-gebot-vadium" label="🧮 AT · § 151 EO & Vadium Rechner" />
          <FooterLink href="/schweiz/rechner/betreibungsamtliche-steigerung-schkg" label="🧮 CH · SchKG Steigerungsrechner" />
          <FooterLink href="/it/calcolatore/offerta-minima-75-asta-giudiziaria" label="🧮 IT · Calcolatore Offerta 75%" />
          <FooterLink href="/es/calculadora/subasta-judicial-boe-70-por-ciento" label="🧮 ES · Calculadora BOE 70% LEC" />
          <FooterLink href="/fr/calculateur/encheres-judiciaires-licitor-frais" label="🧮 FR · Calculateur Frais Licitor" />
          <FooterLink href="/en/calculator/uk-property-auction-stamp-duty-deposit" label="🧮 UK · Auction & SDLT Calculator" />
          <FooterLink href="/tr/hesaplama/icra-ihale-teminat" label="🧮 TR · İcra Teminat Hesaplama" />
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
