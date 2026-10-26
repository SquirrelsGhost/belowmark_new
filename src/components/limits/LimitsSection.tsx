import { ReactNode } from "react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";

interface LimitsSectionProps {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  ruleTitle: string;
  ruleBody: string;
  /** <LimitItem /> elements */
  children: ReactNode;
}

/** Honesty section: what the data cannot tell, followed by the rule behind it. */
export default function LimitsSection(props: LimitsSectionProps) {
  return (
    <section className="border-y-2 border-ink bg-paper-deep py-20 sm:py-28">
      <Container>
        <SectionHeader number={props.number} eyebrow={props.eyebrow} title={props.title} description={props.description} />
        <div className="mt-14 grid gap-px border border-ink bg-ink sm:grid-cols-2">{props.children}</div>
        <Reveal className="mt-16 grid gap-6 lg:grid-cols-12">
          <p className="font-mono text-xs tracking-[0.2em] text-signal uppercase lg:col-span-3">{props.ruleTitle}</p>
          <blockquote className="font-serif text-[clamp(1.8rem,3.6vw,3rem)] leading-[1.1] italic text-balance lg:col-span-9">
            „{props.ruleBody}“
          </blockquote>
        </Reveal>
      </Container>
    </section>
  );
}
