import { ReactNode } from "react";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { ROUTES } from "@/lib/constants";

interface PricingSectionProps {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  disclaimer: string;
  /** <PricingMarketSwitch /> above the plans */
  marketSwitch: ReactNode;
  /** <PricingPlan /> elements */
  children: ReactNode;
}

export default function PricingSection({ number, eyebrow, title, description, disclaimer, marketSwitch, children }: PricingSectionProps) {
  return (
    <section id={ROUTES.pricing.slice(1)} className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <SectionHeader number={number} eyebrow={eyebrow} title={title} description={description} />
        {marketSwitch}
        <div className="mt-14 grid items-stretch gap-8 lg:grid-cols-3 lg:gap-6">{children}</div>
        <p className="mt-10 max-w-3xl font-mono text-xs leading-relaxed text-muted">{disclaimer}</p>
      </Container>
    </section>
  );
}
