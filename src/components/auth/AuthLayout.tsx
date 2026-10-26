import Link from "next/link";
import { ReactNode } from "react";
import AuthIcon from "@/components/auth/AuthIcon";
import ConsumerFooterButtons from "@/components/consumer/ConsumerFooterButtons";
import BrandMark from "@/components/brand/BrandMark";
import NavigationSkipLink from "@/components/navigation/NavigationSkipLink";
import Container from "@/components/ui/Container";
import PaperTexture from "@/components/ui/PaperTexture";
import { ROUTES } from "@/lib/constants";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";

interface AuthLayoutProps {
  /** "de" | "tr" — drives hyphenation and the Turkish İ/I in uppercase type */
  lang: string;
  layout: IAuthTranslation["Layout"];
  /** <RegionDetector /> when the host sends no geo header */
  detector?: ReactNode;
  /** <AuthIntro /> + <AuthCard />, or the account sections */
  children: ReactNode;
}

const MAIN_ID = "formular";
const LINK_CLASSES = "underline-offset-4 transition-colors hover:text-ink hover:underline";

/** Quiet frame for every account page: masthead, two-column sheet, legal line. */
export default function AuthLayout({ lang, layout, detector, children }: AuthLayoutProps) {
  return (
    <div lang={lang} className="flex min-h-dvh flex-col">
      <PaperTexture />
      <NavigationSkipLink label={layout.SkipToContent} targetId={MAIN_ID} />
      {detector}
      <header className="border-b-2 border-ink bg-paper/90 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between gap-4">
          <BrandMark />
          <Link
            href={ROUTES.home}
            className="group inline-flex items-center gap-2 font-narrow text-sm font-medium tracking-[0.08em] text-ink-soft uppercase transition-colors hover:text-ink"
          >
            <AuthIcon name="arrowLeft" className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
            {layout.BackHome}
          </Link>
        </Container>
      </header>

      <main id={MAIN_ID} aria-label={layout.MainLabel} tabIndex={-1} className="flex-1 outline-none">
        <Container className="grid items-start gap-10 py-10 sm:py-14 lg:grid-cols-12 lg:gap-12 lg:py-20">{children}</Container>
      </main>

      <footer className="border-t border-rule">
        <Container className="flex flex-col gap-3 py-5 font-mono text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2">
            <AuthIcon name="lock" className="size-3.5 text-ink" />
            {layout.Secure}
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
