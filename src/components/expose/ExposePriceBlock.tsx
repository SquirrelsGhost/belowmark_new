interface ExposePriceBlockProps {
  label: string;
  price: string | null;
  missing: string;
  commission: string;
  commissionMissing: boolean;
  keyFacts: { label: string; value: string | null }[];
  factMissing: string;
}

/** The asking price as the loudest number, commission under it, four key figures beside it. */
export default function ExposePriceBlock({ label, price, missing, commission, commissionMissing, keyFacts, factMissing }: ExposePriceBlockProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] print:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div>
        <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">{label}</p>
        {price ? <p className="font-mono text-3xl font-semibold">{price}</p> : <p className="w-fit bg-hatch px-2 py-1 font-mono text-sm text-muted">{missing}</p>}
        <p className={`mt-1 text-[12px] ${commissionMissing ? "w-fit bg-hatch px-1 text-muted" : "text-ink-soft"}`}>{commission}</p>
      </div>
      <dl className="grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-4 print:grid-cols-4">
        {keyFacts.map((fact) => (
          <div key={fact.label} className="bg-paper-bright p-2">
            <dt className="font-mono text-[9px] tracking-[0.08em] break-words hyphens-auto text-muted uppercase">{fact.label}</dt>
            <dd className={fact.value ? "font-mono text-[15px] font-semibold" : "font-mono text-[11px] text-muted"}>{fact.value ?? factMissing}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
