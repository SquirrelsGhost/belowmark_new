import Button from "@/components/ui/Button";
import { APP_ROUTES } from "@/lib/appConstants";

interface WatchlistEmptyProps {
  title: string;
  body: string;
  cta: string;
}

/** Empty plan: explain how it fills up. */
export default function WatchlistEmpty({ title, body, cta }: WatchlistEmptyProps) {
  return (
    <div className="mt-10 flex flex-col items-start gap-4 border-2 border-dashed border-ink/50 px-6 py-12">
      <p className="font-display text-4xl">{title}</p>
      <p className="max-w-xl text-sm leading-relaxed text-ink-soft">{body}</p>
      <Button label={cta} href={APP_ROUTES.search} variant="ink" withArrow />
    </div>
  );
}
