interface ClientShareFooterProps {
  responsible: string;
  disclaimer: string;
  privacy: string;
  madeWith: string;
  imprintLabel: string;
  imprintUrl: string | null;
}

/** Who stands behind the assessment, what it is not, and what the page stores about the reader. */
export default function ClientShareFooter({ responsible, disclaimer, privacy, madeWith, imprintLabel, imprintUrl }: ClientShareFooterProps) {
  return (
    <footer className="flex flex-col gap-2 border-t-2 border-ink pt-3 text-[11px] leading-snug text-muted">
      <p className="text-ink-soft">
        {responsible}
        {imprintUrl && (
          <>
            {" "}
            <a href={imprintUrl} rel="noopener noreferrer" className="underline underline-offset-2">
              {imprintLabel}
            </a>
          </>
        )}
      </p>
      <p>{disclaimer}</p>
      <p>{privacy}</p>
      <p className="font-mono text-[10px] tracking-[0.12em] uppercase">
        {madeWith}
      </p>
    </footer>
  );
}
