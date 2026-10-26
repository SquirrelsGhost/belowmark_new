import { ReactNode } from "react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { ROUTES } from "@/lib/constants";

interface FaqSectionProps {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  moreTitle: string;
  moreCta: string;
  /** <FaqItem /> elements */
  children: ReactNode;
}

export default function FaqSection(props: FaqSectionProps) {
  return (
    <section id={ROUTES.faq.slice(1)} className="scroll-mt-24 border-t-2 border-ink py-20 sm:py-28">
      <Container>
        <SectionHeader number={props.number} eyebrow={props.eyebrow} title={props.title} description={props.description} />
        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="border-t-2 border-ink lg:col-span-8">{props.children}</div>
          <aside className="flex flex-col items-start gap-5 lg:col-span-3 lg:col-start-10">
            <p className="font-display text-3xl leading-none">{props.moreTitle}</p>
            <Button label={props.moreCta} href={ROUTES.contact} variant="outline" withArrow />
          </aside>
        </div>
      </Container>
    </section>
  );
}
