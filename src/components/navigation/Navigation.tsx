import { ReactNode } from "react";
import Container from "@/components/ui/Container";

interface NavigationProps {
  children: ReactNode;
  /** Accessible name of the nav landmark */
  label: string;
}

/** Sticky masthead on paper with a heavy bottom rule. */
export default function Navigation({ children, label }: NavigationProps) {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/90 backdrop-blur-md">
      <Container>
        <nav aria-label={label} className="flex h-16 items-center gap-1">
          {children}
        </nav>
      </Container>
    </header>
  );
}
