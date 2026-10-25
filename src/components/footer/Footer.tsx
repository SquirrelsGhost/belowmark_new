import { ReactNode } from "react";
import NavigationLogo from "@/components/navigation/NavigationLogo";
import Container from "@/components/ui/Container";
import { APP_NAME, CURRENT_YEAR } from "@/lib/constants";

interface FooterProps {
  tagline: string;
  rights: string;
  /** <FooterColumn /> elements */
  children: ReactNode;
}

export default function Footer({ tagline, rights, children }: FooterProps) {
  return (
    <footer className="relative mt-12 border-t border-line">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="flex flex-col items-start gap-4">
          <NavigationLogo />
          <p className="max-w-xs font-serif text-2xl leading-tight text-muted italic">{tagline}</p>
        </div>
        {children}
      </Container>
      <Container className="flex flex-col items-center justify-between gap-4 border-t border-line py-8 text-xs text-subtle sm:flex-row">
        <span>
          © {CURRENT_YEAR} {APP_NAME}. {rights}
        </span>
      </Container>
      <div aria-hidden="true" className="pointer-events-none hidden overflow-hidden sm:block">
        <p className="-mb-[0.22em] text-center font-serif text-[18vw] leading-none tracking-tighter text-ink/[0.04] select-none">
          {APP_NAME.toLowerCase()}
        </p>
      </div>
    </footer>
  );
}
