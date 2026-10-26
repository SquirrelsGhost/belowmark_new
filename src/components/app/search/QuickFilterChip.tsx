import Link from "next/link";
import Icon from "@/components/ui/Icon";

interface QuickFilterChipProps {
  href: string;
  label: string;
  /** Active chips link back to the search without their filter */
  isActive: boolean;
}

/** One quick filter, shaped like a rubber-stamped tag. */
export default function QuickFilterChip({ href, label, isActive }: QuickFilterChipProps) {
  return (
    <li>
      <Link
        href={href}
        aria-pressed={isActive}
        className={`flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[11px] tracking-wide transition-colors ${
          isActive ? "border-signal bg-signal text-paper-bright" : "border-rule-strong/40 bg-paper-bright text-ink hover:border-ink"
        }`}
      >
        {label}
        {isActive && <Icon name="cross" className="size-3" />}
      </Link>
    </li>
  );
}
