import Button from "@/components/ui/Button";
import { APP_ROUTES } from "@/lib/appConstants";

interface LockedPanelProps {
  title: string;
  body: string;
  cta: string;
}

/** What the free plan leaves out, said plainly — in place of the calculator. */
export default function LockedPanel({ title, body, cta }: LockedPanelProps) {
  return (
    <section aria-label={title} className="flex flex-col items-start gap-4 border-2 border-dashed border-ink bg-hatch p-6">
      <h2 className="font-display text-3xl">{title}</h2>
      <p className="max-w-xl text-sm leading-relaxed text-ink-soft">{body}</p>
      <Button label={cta} href={APP_ROUTES.order} variant="signal" withArrow />
    </section>
  );
}
