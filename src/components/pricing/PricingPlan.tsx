import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import Stamp from "@/components/ui/Stamp";

interface PricingPlanProps {
  name: string;
  tagline: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  href: string;
  note: string;
  /** e.g. "oder 199 € für drei Monate" */
  altPrice?: string;
  /** Stamp label for the recommended plan */
  recommendedLabel?: string;
  delay?: number;
}

/** Prices longer than this ("Auf Anfrage", "Özel teklif") get a smaller size so they stay on one line. */
const LONG_PRICE_CHARS = 7;

/** A plan set as a notice slip; the recommended one is inverted to ink. */
export default function PricingPlan(props: PricingPlanProps) {
  const isFeatured = Boolean(props.recommendedLabel);
  const shell = isFeatured
    ? "bg-ink text-paper-bright shadow-[10px_10px_0_0_var(--signal)] lg:-translate-y-4"
    : "border-2 border-ink bg-paper-bright";
  const muted = isFeatured ? "text-paper/65" : "text-muted";
  const priceSize = props.price.length > LONG_PRICE_CHARS ? "text-5xl" : "text-7xl";

  return (
    <Reveal delay={props.delay} className="h-full">
      <article className={`relative flex h-full flex-col p-7 sm:p-8 ${shell}`}>
        {props.recommendedLabel && (
          <div className="absolute -top-4 right-6 bg-paper-bright">
            <Stamp label={props.recommendedLabel} tone="signal" tilt="right" />
          </div>
        )}
        <p className={`font-mono text-xs tracking-[0.2em] uppercase ${isFeatured ? "text-signal" : "text-muted"}`}>{props.name}</p>
        <p className="mt-3 text-lg leading-snug">{props.tagline}</p>
        <div className={`mt-8 border-t pt-6 ${isFeatured ? "border-paper/25" : "border-ink"}`}>
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className={`font-display leading-none whitespace-nowrap ${priceSize}`}>{props.price}</span>
            <span className={`font-mono text-xs uppercase ${muted}`}>{props.period}</span>
          </p>
          {props.altPrice && <p className={`mt-2 font-mono text-xs ${muted}`}>{props.altPrice}</p>}
        </div>
        <ul className="mt-8 flex flex-1 flex-col gap-3">
          {props.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm leading-snug">
              <Icon name="check" className="mt-0.5 size-4 shrink-0 text-signal" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-col gap-3">
          <Button label={props.cta} href={props.href} variant={isFeatured ? "signal" : "ink"} fullWidth withArrow />
          <p className={`text-center font-mono text-[11px] ${muted}`}>{props.note}</p>
        </div>
      </article>
    </Reveal>
  );
}
