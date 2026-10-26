import { HoldingStatus } from "@/types/portfolio.types";

/**
 * Constants of the investor portfolio. Kept apart from appConstants.ts so this
 * feature can change on its own.
 */

export const PORTFOLIO_ROUTE = "/app/portfolio";

/** localStorage key prefix of the outcome record ("ersteigert"), one per proceeding. */
export const PORTFOLIO_STORAGE = {
  holding: "belowmark:zuschlag:",
} as const;

/** Status order as the select offers it. */
export const HOLDING_STATUSES: HoldingStatus[] = ["watching", "bid", "won", "lost"];

/** Groups of the board, in reading order. */
export const PORTFOLIO_GROUPS = [
  { id: "won", statuses: ["won"] },
  { id: "pipeline", statuses: ["watching", "bid"] },
  { id: "lost", statuses: ["lost"] },
] as const satisfies { id: string; statuses: HoldingStatus[] }[];

export type PortfolioGroupId = (typeof PORTFOLIO_GROUPS)[number]["id"];

/** CSV export: semicolon and BOM so Excel in German and Turkish opens it with the right columns and umlauts. */
export const PORTFOLIO_CSV = {
  separator: ";",
  bom: "﻿",
  mime: "text/csv;charset=utf-8",
  fileName: "belowmark-portfolio",
} as const;
