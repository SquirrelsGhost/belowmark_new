import { ReactNode } from "react";
import BrandMark from "@/components/brand/BrandMark";
import Container from "@/components/ui/Container";
import { APP_NAME, CURRENT_YEAR } from "@/lib/constants";

interface FooterProps {
  tagline: string;
  disclaimer: string;
  rights: string;
  /** <FooterColumn /> elements */
  children: ReactNode;
  /** Consumer buttons (kündigen / widerrufen), set apart from the plain links */
  actions?: ReactNode;
}

/** Ink footer with the oversized wordmark sitting on the market line. */
export default function Footer({ tagline, disclaimer, rights, children, actions }: FooterProps) {
  return (
    <footer className="relative overflow-hidden bg-ink text-paper-bright">
      <Container className="grid gap-12 pt-16 pb-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="flex flex-col items-start gap-5">
          <BrandMark inverted alwaysWordmark />
          <p className="max-w-xs font-serif text-2xl leading-tight italic text-paper/80">{tagline}</p>
        </div>
        {children}
      </Container>
      {actions && <Container className="border-t border-paper/20 py-5">{actions}</Container>}
      <Container className="flex flex-col gap-3 border-t border-paper/20 py-6 font-mono text-[11px] text-paper/50 sm:flex-row sm:justify-between">
        <span>{disclaimer}</span>
        <span>© {CURRENT_YEAR} {APP_NAME}. {rights}</span>
      </Container>
      <div aria-hidden="true" className="relative select-none">
        <span className="absolute inset-x-0 top-[0.18em] h-1.5 bg-signal" />
        <p className="-mb-[0.12em] text-center font-display text-[19vw] leading-[0.8] tracking-tight text-paper/[0.07]">{APP_NAME}</p>
      </div>
    </footer>
  );
}
