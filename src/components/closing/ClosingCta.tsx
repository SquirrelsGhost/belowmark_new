import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { ROUTES } from "@/lib/constants";

interface ClosingCtaProps {
  titleTop: string;
  titleBelow: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
}

/** Final call to action — repeats the hero's above/below-the-line layout. */
export default function ClosingCta({ titleTop, titleBelow, description, primaryCta, secondaryCta }: ClosingCtaProps) {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <Container>
        <Reveal>
          <h2>
            <span className="block font-display text-[clamp(3rem,10vw,9rem)] leading-[0.85]">{titleTop}</span>
            <span className="relative mt-6 block pt-8 sm:pt-10">
              <span aria-hidden="true" className="absolute -left-[50vw] -right-[50vw] top-0 h-1.5 bg-signal" />
              <span className="block font-serif text-[clamp(2.2rem,6vw,5rem)] leading-none italic">{titleBelow}</span>
            </span>
          </h2>
        </Reveal>
        <Reveal delay={150} className="mt-12 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md text-lg leading-relaxed text-ink-soft">{description}</p>
          <div className="flex flex-wrap gap-4">
            <Button label={primaryCta} href={ROUTES.signup} variant="signal" size="lg" withArrow />
            <Button label={secondaryCta} href={ROUTES.login} variant="outline" size="lg" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
