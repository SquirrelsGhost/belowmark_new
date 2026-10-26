import Link from "next/link";
import { APP_ROUTES } from "@/lib/appConstants";
import { TEXT_LINK_CLASSES } from "@/lib/appStyles";

interface FilterActionsProps {
  applyLabel: string;
  resetLabel: string;
  /** Show the reset link only when something is filtered */
  canReset: boolean;
}

/** Apply button (needed without JavaScript) and reset link. */
export default function FilterActions({ applyLabel, resetLabel, canReset }: FilterActionsProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-rule pt-4">
      <button
        type="submit"
        className="h-10 cursor-pointer bg-ink px-5 font-narrow text-xs font-semibold tracking-[0.1em] text-paper-bright uppercase shadow-[3px_3px_0_0_var(--signal)] active:translate-y-px"
      >
        {applyLabel}
      </button>
      {canReset && (
        <Link href={APP_ROUTES.search} className={`${TEXT_LINK_CLASSES} text-signal`}>
          {resetLabel}
        </Link>
      )}
    </div>
  );
}
