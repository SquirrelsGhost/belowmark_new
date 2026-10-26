// Reads the bidder's figures and Zuschlag records from localStorage and adds the portfolio up live
"use client";

import { useMemo } from "react";
import PortfolioExportButton from "@/components/app/portfolio/PortfolioExportButton";
import PortfolioGroup from "@/components/app/portfolio/PortfolioGroup";
import PortfolioLostTable from "@/components/app/portfolio/PortfolioLostTable";
import PortfolioPipelineSummary from "@/components/app/portfolio/PortfolioPipelineSummary";
import PortfolioPipelineTable from "@/components/app/portfolio/PortfolioPipelineTable";
import PortfolioWonSummary from "@/components/app/portfolio/PortfolioWonSummary";
import PortfolioWonTable from "@/components/app/portfolio/PortfolioWonTable";
import { usePortfolioRows } from "@/hooks/usePortfolioRows";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { PORTFOLIO_GROUPS, PortfolioGroupId } from "@/lib/portfolio/portfolioConstants";
import { getPortfolioTotals } from "@/lib/portfolio/portfolioTotals";
import { IPortfolioTranslation } from "@/translations/portfolio/IPortfolioTranslation";
import { HoldingStatus, PortfolioRow, PortfolioSource } from "@/types/portfolio.types";
import { VerdictState } from "@/types/verdict.types";

interface PortfolioBoardProps {
  sources: PortfolioSource[];
  labels: IPortfolioTranslation;
  verdictNames: Record<VerdictState, string>;
  market: MarketCode;
  locale: LocaleOption;
  today: string;
}

/** Won objects first, then the pipeline, then what went elsewhere — each with its sums and table. */
export default function PortfolioBoard({ sources, labels, verdictNames, market, locale, today }: PortfolioBoardProps) {
  const rows = usePortfolioRows(sources);
  const groups = useMemo(() => {
    const byGroup = {} as Record<PortfolioGroupId, PortfolioRow[]>;
    for (const group of PORTFOLIO_GROUPS) byGroup[group.id] = rows.filter((row) => (group.statuses as readonly HoldingStatus[]).includes(row.holding.status));
    return byGroup;
  }, [rows]);
  const { Groups, Totals } = labels;
  const table = { labels, locale };

  return (
    <>
      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <p className="max-w-xl text-xs leading-snug text-muted">{labels.Page.StorageHint}</p>
        <PortfolioExportButton rows={rows} labels={labels} verdictNames={verdictNames} market={market} locale={locale} today={today} />
      </div>
      {groups.won.length > 0 && (
        <PortfolioGroup title={Groups.won.Title} lead={Groups.won.Lead} count={groups.won.length}>
          <PortfolioWonSummary totals={getPortfolioTotals(groups.won)} labels={Totals} title={Groups.won.Title} market={market} locale={locale} />
          <PortfolioWonTable rows={groups.won} title={Groups.won.Title} {...table} />
        </PortfolioGroup>
      )}
      {groups.pipeline.length > 0 && (
        <PortfolioGroup title={Groups.pipeline.Title} lead={Groups.pipeline.Lead} count={groups.pipeline.length}>
          <PortfolioPipelineSummary rows={groups.pipeline} totals={getPortfolioTotals(groups.pipeline)} labels={Totals} title={Groups.pipeline.Title} market={market} locale={locale} />
          <PortfolioPipelineTable rows={groups.pipeline} title={Groups.pipeline.Title} verdictNames={verdictNames} {...table} />
        </PortfolioGroup>
      )}
      {groups.lost.length > 0 && (
        <PortfolioGroup title={Groups.lost.Title} lead={Groups.lost.Lead} count={groups.lost.length}>
          <PortfolioLostTable rows={groups.lost} title={Groups.lost.Title} {...table} />
        </PortfolioGroup>
      )}
      <p className="mt-10 max-w-3xl text-[11px] leading-snug text-muted">{labels.Page.Disclaimer}</p>
    </>
  );
}
