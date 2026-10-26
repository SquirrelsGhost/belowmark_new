import Link from "next/link";
import { APP_ROUTES } from "@/lib/appConstants";

interface ListingNotFoundProps {
  title: string;
  body: string;
  backLabel: string;
}

/** A key that is not (or no longer) in the data set. */
export default function ListingNotFound({ title, body, backLabel }: ListingNotFoundProps) {
  return (
    <div className="mt-16 flex max-w-2xl flex-col items-start gap-4">
      <p className="font-display text-5xl">{title}</p>
      <p className="text-base leading-relaxed text-ink-soft">{body}</p>
      <Link href={APP_ROUTES.search} className="font-narrow text-xs font-semibold tracking-[0.1em] text-signal uppercase underline-offset-4 hover:underline">
        ← {backLabel}
      </Link>
    </div>
  );
}
