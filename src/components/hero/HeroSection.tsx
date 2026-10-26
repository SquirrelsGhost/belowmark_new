import { ReactNode } from "react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { ROUTES } from "@/lib/constants";

interface HeroSectionProps {
  dateline: string;
  liveLabel: string;
  headlineTop: string;
  headlineBelow: string;
  lineLabel: string;
  description: string;
  principle: string;
  primaryCta: string;
  secondaryCta: string;
  note: string;
  /** Interactive panel on the right, e.g. <BidCalculator /> */
  children: ReactNode;
}

/**
 * Masthead hero: the condensed headline sits *above* the red market line,
 * the promise sits *below* it — the Belowmark mark, set as a layout.
 */
export default function HeroSection(props: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-6 pb-20 sm:pb-28">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-3 font-mono text-[11px] tracking-wider text-muted uppercase">
          <span>{props.dateline}</span>
          <span className="inline-flex items-center gap-2">
            <span className="size-2 animate-blink bg-signal" />
            {props.liveLabel}
          </span>
        </div>
        <Reveal>
          <h1 className="mt-8 sm:mt-12">
            <span className="block font-display text-[clamp(2.5rem,10.4vw,10.25rem)] leading-[0.82] hyphens-manual">{props.headlineTop}</span>
            <span className="sr-only"> </span>
            <span className="relative mt-6 block sm:mt-8">
              <span aria-hidden="true" className="absolute -left-[50vw] -right-[50vw] top-0 block h-1.5 origin-left animate-draw bg-signal" />
              <span aria-hidden="true" className="absolute top-3 right-0 font-mono text-[11px] tracking-[0.2em] text-signal uppercase">
                {props.lineLabel}
              </span>
              <span className="block pt-8 font-serif text-[clamp(2.2rem,6.2vw,5.5rem)] leading-[1] font-normal tracking-tight italic sm:pt-10">
                {props.headlineBelow}
              </span>
            </span>
          </h1>
        </Reveal>
        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <Reveal delay={150} className="flex flex-col gap-8 lg:col-span-5">
            <p className="max-w-lg text-lg leading-relaxed text-ink-soft text-pretty">{props.description}</p>
            <blockquote className="border-l-4 border-signal pl-5 font-serif text-2xl leading-snug italic">{props.principle}</blockquote>
            <div className="flex flex-wrap gap-4">
              <Button label={props.primaryCta} href={ROUTES.signup} variant="signal" size="lg" withArrow />
              <Button label={props.secondaryCta} href={ROUTES.calculator} variant="outline" size="lg" />
            </div>
            <p className="font-mono text-xs leading-relaxed text-muted">{props.note}</p>
          </Reveal>
          <Reveal delay={300} className="lg:col-span-7">
            {props.children}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
