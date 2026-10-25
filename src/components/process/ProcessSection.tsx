import { ReactNode } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { ROUTES } from "@/lib/constants";

interface ProcessSectionProps {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  /** <ProcessStep /> elements */
  children: ReactNode;
}

/** Numbered three-step walkthrough connected by a hairline. */
export default function ProcessSection({ eyebrow, title, titleAccent, description, children }: ProcessSectionProps) {
  return (
    <section id={ROUTES.process.slice(1)} className="scroll-mt-28 py-28">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} titleAccent={titleAccent} description={description} />
        <ol className="relative mt-20 grid gap-12 md:grid-cols-3 md:gap-8">
          <span aria-hidden="true" className="absolute top-7 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-iris/0 via-line-strong to-lagoon/0 md:block" />
          {children}
        </ol>
      </Container>
    </section>
  );
}
