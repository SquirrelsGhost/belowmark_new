import { ReactNode } from "react";
import { LABEL_CLASSES } from "@/lib/appStyles";

interface ListingHearingProps {
  label: string;
  /** Full date and time */
  when: string;
  status: string;
  isActive: boolean;
  /** Further rounds (TR) */
  rounds?: string[];
  roundsLabel: string;
  children: ReactNode;
}

/** The hearing date as the loudest fact on the sheet, plus the actions below it. */
export default function ListingHearing({ label, when, status, isActive, rounds, roundsLabel, children }: ListingHearingProps) {
  return (
    <div className="flex flex-col gap-3 border-2 border-ink bg-paper-bright p-4 shadow-[6px_6px_0_0_var(--ink)] lg:min-w-80">
      <div>
        <p className={LABEL_CLASSES}>{label}</p>
        <p className="mt-1 font-mono text-lg font-semibold">{when}</p>
        <p className={`mt-1 inline-block px-1.5 py-0.5 font-mono text-[11px] tracking-wide uppercase ${isActive ? "bg-signal text-paper-bright" : "bg-paper-deep text-ink"}`}>{status}</p>
      </div>
      {rounds && rounds.length > 1 && (
        <div>
          <p className={LABEL_CLASSES}>{roundsLabel}</p>
          <ul className="mt-1 flex flex-col gap-0.5 font-mono text-[12px] text-ink-soft">
            {rounds.map((round) => (
              <li key={round}>{round}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2 border-t border-rule pt-3">{children}</div>
    </div>
  );
}
