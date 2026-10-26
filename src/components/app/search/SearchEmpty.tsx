import Link from "next/link";
import { APP_ROUTES } from "@/lib/appConstants";

interface SearchEmptyProps {
  title: string;
  body: string;
  resetLabel: string;
}

/** No results: say so plainly and offer the way back. */
export default function SearchEmpty({ title, body, resetLabel }: SearchEmptyProps) {
  return (
    <div className="flex flex-col items-start gap-4 border-b border-rule bg-hatch px-6 py-14">
      <p className="font-display text-3xl">{title}</p>
      <p className="max-w-xl text-sm leading-relaxed text-ink-soft">{body}</p>
      <Link href={APP_ROUTES.search} className="bg-ink px-4 py-2 font-narrow text-xs font-semibold tracking-[0.1em] text-paper-bright uppercase shadow-[3px_3px_0_0_var(--signal)]">
        {resetLabel}
      </Link>
    </div>
  );
}
