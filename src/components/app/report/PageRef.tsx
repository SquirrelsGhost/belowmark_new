interface PageRefProps {
  label: string;
}

/** The page a statement was read from — the receipt next to every quote. */
export default function PageRef({ label }: PageRefProps) {
  return <span className="inline-flex shrink-0 items-center border border-ink px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-[0.1em] text-ink uppercase">{label}</span>;
}
