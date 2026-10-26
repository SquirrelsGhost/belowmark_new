import Link from "next/link";
import { TeamStatus } from "@/lib/team/teamConfig";
import { STATUS_TONES } from "@/lib/team/teamStyles";

interface TeamStatusFilterOption {
  href: string;
  label: string;
  count: number;
  status: TeamStatus | null;
  isActive: boolean;
}

interface TeamStatusFilterProps {
  label: string;
  options: TeamStatusFilterOption[];
}

/** Status chips with counts; "Alle" first. Every filter is a link, so it lives in the URL. */
export default function TeamStatusFilter({ label, options }: TeamStatusFilterProps) {
  return (
    <nav aria-label={label} className="mt-6 flex flex-wrap gap-2">
      {options.map((option) => (
        <Link
          key={option.href}
          href={option.href}
          aria-current={option.isActive ? "page" : undefined}
          className={`inline-flex h-9 items-center gap-2 border-2 px-3 font-narrow text-xs font-semibold tracking-[0.08em] uppercase ${
            option.isActive ? "border-ink bg-ink text-paper-bright" : "border-rule-strong bg-paper-bright text-ink hover:border-ink"
          }`}
        >
          {option.status && <span aria-hidden="true" className={`size-2 rounded-full ${STATUS_TONES[option.status].dot}`} />}
          {option.label}
          <span className="font-mono text-[11px]">{option.count}</span>
        </Link>
      ))}
    </nav>
  );
}
