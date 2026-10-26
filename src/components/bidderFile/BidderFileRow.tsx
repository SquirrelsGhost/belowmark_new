import { ReactNode } from "react";

interface BidderFileRowProps {
  label: string;
  /** Missing values are printed as missing, with the given wording */
  value: ReactNode | null;
  missing: string;
  note?: string;
}

/** Label and value on one ruled line, the way a court form lists facts. */
export default function BidderFileRow({ label, value, missing, note }: BidderFileRowProps) {
  const isMissing = value === null || value === "";
  return (
    <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 py-1.5">
      <dt className="text-[13px] text-ink-soft">{label}</dt>
      <dd className={isMissing ? "bg-hatch px-1 font-mono text-[11px] text-muted" : "font-mono text-[13px]"}>
        {isMissing ? missing : value}
        {note && !isMissing && <span className="block font-sans text-[11px] text-muted">{note}</span>}
      </dd>
    </div>
  );
}
