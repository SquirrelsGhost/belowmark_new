import Button from "@/components/ui/Button";
import { BILLING_ROUTES, OFFER_PARAM } from "@/lib/billing/billingConfig";

interface ClientShareLockedProps {
  title: string;
  body: string;
  cta: string;
}

/** What Pro adds, for everyone without it — links directly to the Pro booking page. */
export default function ClientShareLocked({ title, body, cta }: ClientShareLockedProps) {
  return (
    <section aria-label={title} className="flex flex-col items-start gap-4 border-2 border-dashed border-ink bg-hatch p-6">
      <h2 className="font-display text-3xl">{title}</h2>
      <p className="max-w-xl text-sm leading-relaxed text-ink-soft">{body}</p>
      <Button label={cta} href={`${BILLING_ROUTES.order}?${OFFER_PARAM}=pro-monat`} variant="signal" withArrow />
    </section>
  );
}
