import { useMemo } from "react";
import { useStoredTexts } from "@/hooks/useStoredTexts";
import { inputsKey, parseInputs } from "@/lib/bidding/biddingStorage";
import { holdingKey, parseHolding } from "@/lib/portfolio/holdingStorage";
import { buildPortfolioRow } from "@/lib/portfolio/portfolioRow";
import { parseVerdictAnswers } from "@/lib/verdict/verdictAnswers";
import { verdictAnswersKey } from "@/lib/verdict/verdictConstants";
import { PortfolioRow, PortfolioSource } from "@/types/portfolio.types";

/** Three stored texts per proceeding: bid-limit inputs, verdict answers, Zuschlag record. */
const STORES_PER_ROW = 3;

/** The saved proceedings with the bidder's figures from this browser applied — live while they edit elsewhere. */
export function usePortfolioRows(sources: PortfolioSource[]): PortfolioRow[] {
  const keys = useMemo(() => sources.flatMap((source) => [inputsKey(source.key), verdictAnswersKey(source.key), holdingKey(source.key)]), [sources]);
  const texts = useStoredTexts(keys);
  return useMemo(
    () =>
      sources.map((source, index) => {
        const at = index * STORES_PER_ROW;
        return buildPortfolioRow(source, parseInputs(texts[at]), parseVerdictAnswers(texts[at + 1]), parseHolding(texts[at + 2]));
      }),
    [sources, texts],
  );
}
