import { ReactNode } from "react";
import Container from "@/components/ui/Container";

interface AppMastheadProps {
  /** Accessible name of the nav landmark */
  label: string;
  children: ReactNode;
}

/** Sticky app header on paper with the heavy rule of the landing page. */
export default function AppMasthead({ label, children }: AppMastheadProps) {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/92 backdrop-blur-md">
      <Container>
        <nav aria-label={label} className="flex h-16 items-center gap-1">
          {children}
        </nav>
      </Container>
    </header>
  );
}
