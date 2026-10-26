// Builds the CSV in the browser, where the bidder's figures live, and hands it over as a download
"use client";

import Icon from "@/components/ui/Icon";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { PORTFOLIO_CSV } from "@/lib/portfolio/portfolioConstants";
import { portfolioCsv } from "@/lib/portfolio/portfolioCsv";
import { IPortfolioTranslation } from "@/translations/portfolio/IPortfolioTranslation";
import { PortfolioRow } from "@/types/portfolio.types";
import { VerdictState } from "@/types/verdict.types";

interface PortfolioExportButtonProps {
  rows: PortfolioRow[];
  labels: IPortfolioTranslation;
  verdictNames: Record<VerdictState, string>;
  market: MarketCode;
  locale: LocaleOption;
  /** Date of the export for the file name (YYYY-MM-DD) */
  today: string;
}

/** "Als CSV exportieren": every row with every figure, empty where nothing was entered. */
export default function PortfolioExportButton({ rows, labels, verdictNames, market, locale, today }: PortfolioExportButtonProps) {
  const download = () => {
    const blob = new Blob([portfolioCsv(rows, labels, verdictNames, market, locale)], { type: PORTFOLIO_CSV.mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${PORTFOLIO_CSV.fileName}-${market.toLowerCase()}-${today}.csv`;
    link.click();
    // Revoke after the click has been handled — some browsers read the URL asynchronously
    setTimeout(() => URL.revokeObjectURL(url));
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={download}
        disabled={rows.length === 0}
        className="inline-flex h-10 items-center gap-2 bg-ink px-4 font-narrow text-xs font-semibold tracking-[0.1em] text-paper-bright uppercase shadow-[3px_3px_0_0_var(--signal)] disabled:opacity-40"
      >
        <Icon name="file" className="size-4" />
        {labels.Export.Csv}
      </button>
      <span className="max-w-56 text-right text-[11px] leading-snug text-muted">{labels.Export.Hint}</span>
    </div>
  );
}
