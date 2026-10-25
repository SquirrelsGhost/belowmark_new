import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { ROUTES } from "@/lib/constants";

interface CtaSectionProps {
  title: string;
  titleAccent: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
}

/** Closing call to action on a glowing glass panel. */
export default function CtaSection({ title, titleAccent, description, primaryCta, secondaryCta }: CtaSectionProps) {
  return (
    <section id={ROUTES.contact.slice(1)} className="scroll-mt-28 py-28">
      <Container>
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2.5rem] border-sheen px-6 py-20 text-center sm:px-16 sm:py-28">
            <div aria-hidden="true" className="absolute inset-0 -z-10">
              <div className="absolute -bottom-40 left-1/2 h-80 w-[640px] -translate-x-1/2 rounded-full bg-iris-deep/40 blur-[100px] animate-aurora" />
              <div className="absolute -top-32 -left-20 h-64 w-96 rounded-full bg-ember/15 blur-[100px] animate-aurora-slow" />
              <div className="absolute inset-0 bg-grid opacity-50" />
            </div>
            <h2 className="mx-auto max-w-3xl font-serif text-5xl leading-[1] tracking-tight text-balance sm:text-7xl">
              {title} <em className="text-gradient animate-shimmer">{titleAccent}</em>
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-lg text-muted text-pretty">{description}</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button label={primaryCta} href={ROUTES.signup} size="lg" withArrow />
              <Button label={secondaryCta} href={ROUTES.contact} variant="secondary" size="lg" />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
