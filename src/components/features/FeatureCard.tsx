import { ReactNode } from "react";
import Icon, { IconName } from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";

interface FeatureCardProps {
  icon: IconName;
  title: string;
  description: string;
  /** Grid footprint inside the bento layout */
  span?: "default" | "wide" | "tall";
  /** Stagger delay for the reveal animation (ms) */
  delay?: number;
  /** Optional visual rendered at the bottom of the card */
  children?: ReactNode;
}

const SPAN_CLASSES: Record<NonNullable<FeatureCardProps["span"]>, string> = {
  default: "",
  wide: "md:col-span-2",
  tall: "md:row-span-2",
};

const CARD_CLASSES =
  "group relative flex h-full flex-col overflow-hidden rounded-3xl border-sheen p-7 transition-transform duration-500 hover:-translate-y-1";

export default function FeatureCard({ icon, title, description, span = "default", delay = 0, children }: FeatureCardProps) {
  return (
    <Reveal delay={delay} className={SPAN_CLASSES[span]}>
      <article className={CARD_CLASSES}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 size-56 rounded-full bg-iris/0 blur-3xl transition-colors duration-700 group-hover:bg-iris/20"
        />
        <span className="grid size-11 place-items-center rounded-2xl border border-line-strong bg-glass text-ink">
          <Icon name={icon} />
        </span>
        <h3 className="mt-6 text-xl font-medium tracking-tight">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p>
        {children && <div className="mt-auto pt-8">{children}</div>}
      </article>
    </Reveal>
  );
}
