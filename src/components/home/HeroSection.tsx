import { ReactNode } from "react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import { ROUTES } from "@/lib/constants";

interface HeroSectionProps {
  eyebrow: string;
  headlineStart: string;
  headlineAccent: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  note: string;
  /** Visual shown below the copy, e.g. <HeroPreview /> */
  children?: ReactNode;
}

const HEADLINE_CLASSES =
  "font-serif text-[clamp(3rem,8.5vw,7rem)] leading-[0.95] tracking-[-0.02em] text-balance";

export default function HeroSection({
  eyebrow,
  headlineStart,
  headlineAccent,
  description,
  primaryCta,
  secondaryCta,
  note,
  children,
}: HeroSectionProps) {
  return (
    <section className="relative pt-40 pb-24 sm:pt-48">
      <Container className="flex flex-col items-center text-center">
        <Reveal>
          <Eyebrow label={eyebrow} withDot />
        </Reveal>
        <Reveal delay={100}>
          <h1 className={`mt-8 max-w-5xl ${HEADLINE_CLASSES}`}>
            {headlineStart} <em className="text-gradient animate-shimmer">{headlineAccent}</em>
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted text-pretty">{description}</p>
        </Reveal>
        <Reveal delay={300} className="mt-10 flex flex-col items-center gap-5">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button label={primaryCta} href={ROUTES.signup} size="lg" withArrow />
            <Button label={secondaryCta} href={ROUTES.features} variant="secondary" size="lg" />
          </div>
          <p className="text-xs tracking-wide text-subtle">{note}</p>
        </Reveal>
        {children && (
          <Reveal delay={450} className="mt-20 w-full">
            {children}
          </Reveal>
        )}
      </Container>
    </section>
  );
}
