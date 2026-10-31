import { ReactNode } from "react";
import Container from "@/components/ui/Container";

interface AppStatusLineProps {
  market: string;
  dataAsOf: string;
  sourceLabel: string;
  sourceName: string;
  sourceUrl: string;
  /** Optional <AppCountrySwitch /> when the account holds multiple countries */
  children?: ReactNode;
}

/** Ink strip above the masthead — market, data date and source, like the header line of a court notice. */
export default function AppStatusLine({ market, dataAsOf, sourceLabel, sourceName, sourceUrl, children }: AppStatusLineProps) {
  return (
    <div className="bg-ink text-paper-bright">
      <Container className="flex min-h-8 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-1 font-mono text-[10px] tracking-[0.16em] uppercase">
        {children ?? (
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="size-1.5 bg-signal" />
            {market}
          </span>
        )}
        <span className="flex items-center gap-3 text-paper/70">
          <span>{dataAsOf}</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <a href={sourceUrl} target="_blank" rel="noreferrer" className="hidden underline-offset-4 hover:text-paper-bright hover:underline sm:inline">
            {sourceLabel} {sourceName}
          </a>
        </span>
      </Container>
    </div>
  );
}
