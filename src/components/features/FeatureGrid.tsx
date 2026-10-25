import { ReactNode } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { ROUTES } from "@/lib/constants";

interface FeatureGridProps {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  /** <FeatureCard /> elements */
  children: ReactNode;
}

/** Bento grid of features — cards control their own column/row span. */
export default function FeatureGrid({ eyebrow, title, titleAccent, description, children }: FeatureGridProps) {
  return (
    <section id={ROUTES.features.slice(1)} className="scroll-mt-28 py-28">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} titleAccent={titleAccent} description={description} />
        <div className="mt-16 grid auto-rows-[minmax(240px,auto)] grid-cols-1 gap-4 md:grid-cols-3">{children}</div>
      </Container>
    </section>
  );
}
