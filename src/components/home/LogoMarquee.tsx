import { ReactNode } from "react";
import Container from "@/components/ui/Container";

interface LogoMarqueeProps {
  label: string;
  children: ReactNode;
}

/**
 * Infinite, edge-faded logo ticker. Children are rendered twice so the
 * -50% translate loops seamlessly; the copy is hidden from assistive tech.
 */
export default function LogoMarquee({ label, children }: LogoMarqueeProps) {
  return (
    <section className="py-16">
      <Container>
        <p className="text-center text-xs font-medium tracking-[0.2em] text-subtle uppercase">{label}</p>
      </Container>
      <div className="mt-10 overflow-hidden mask-fade-x">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          <div className="flex shrink-0 items-center gap-16 pr-16">{children}</div>
          <div aria-hidden="true" className="flex shrink-0 items-center gap-16 pr-16">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
