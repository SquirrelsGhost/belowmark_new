import Link from "next/link";
import { APP_NAME, ROUTES } from "@/lib/constants";

interface BrandMarkProps {
  /** Light wordmark for ink backgrounds */
  inverted?: boolean;
  /** Always show the full wordmark (for places with enough room, e.g. the footer) */
  alwaysWordmark?: boolean;
}

/**
 * The Belowmark logo, in one of two forms — never both at once:
 * - narrow screens: the mark alone (red line = market level, dot beneath = the object)
 * - wider screens: the wordmark alone, with the red market line running above it
 */
export default function BrandMark({ inverted = false, alwaysWordmark = false }: BrandMarkProps) {
  const dot = inverted ? "bg-paper-bright" : "bg-ink";
  const text = inverted ? "text-paper-bright" : "text-ink";
  const markVisibility = alwaysWordmark ? "hidden" : "block sm:hidden";
  const wordmarkVisibility = alwaysWordmark ? "inline-block" : "hidden sm:inline-block";

  return (
    <Link href={ROUTES.home} aria-label={APP_NAME} className={`group inline-flex items-center ${text}`}>
      <span aria-hidden="true" className={`relative h-7 w-7 ${markVisibility}`}>
        <span className="absolute top-2 left-0 h-[3px] w-full bg-signal" />
        <span className={`absolute bottom-0.5 left-1/2 size-2.5 -translate-x-1/2 rounded-full transition-transform duration-300 group-hover:translate-y-0.5 ${dot}`} />
      </span>
      <span aria-hidden="true" className={`relative font-display text-xl tracking-[0.12em] ${wordmarkVisibility}`}>
        <span className="absolute inset-x-0 -top-[0.2em] h-[2px] bg-signal" />
        <span className="relative">{APP_NAME}</span>
      </span>
    </Link>
  );
}
