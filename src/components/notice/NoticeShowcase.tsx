import { ReactNode } from "react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { ROUTES } from "@/lib/constants";

interface NoticeShowcaseProps {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  paragraphs: string[];
  /** The visual, e.g. <NoticeCard /> */
  children: ReactNode;
}

/** Explains the dashboard card next to a redacted sample of it. */
export default function NoticeShowcase({ number, eyebrow, title, description, paragraphs, children }: NoticeShowcaseProps) {
  return (
    <section id={ROUTES.notice.slice(1)} className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <SectionHeader number={number} eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <ol className="flex flex-col gap-8 lg:col-span-5 lg:pt-6">
            {paragraphs.map((paragraph, index) => (
              <Reveal key={index} delay={index * 100}>
                <li className="grid grid-cols-[3rem_1fr] gap-2 border-t border-rule pt-5">
                  <span className="font-mono text-sm text-signal">({index + 1})</span>
                  <p className="text-lg leading-relaxed text-ink-soft">{paragraph}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={200} className="lg:col-span-6 lg:col-start-7">
            {children}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
