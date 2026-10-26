interface ExposeOriginProps {
  lead: string;
  disclaimer: string;
  madeWith: string;
  printedAt: string;
}

/** Closing block: where the facts come from, the liability note and the date. */
export default function ExposeOrigin({ lead, disclaimer, madeWith, printedAt }: ExposeOriginProps) {
  return (
    <div className="flex flex-col gap-2 text-[11px] leading-snug text-ink-soft">
      <p>{lead}</p>
      <p>{disclaimer}</p>
      <p className="flex justify-between gap-4 border-t border-rule pt-2 font-mono text-[10px] text-muted">
        <span>{printedAt}</span>
        <span>{madeWith}</span>
      </p>
    </div>
  );
}
