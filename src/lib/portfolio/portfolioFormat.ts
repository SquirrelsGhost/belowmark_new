import { fill, formatMoney } from "@/lib/appFormat";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { formatPercent } from "@/lib/format";
import { PortfolioSum } from "@/types/portfolio.types";

/** Formatting of the portfolio cells: null stays null, so the cell can say "—" instead of 0. */

export const moneyOrNull = (value: number | null | undefined, market: MarketCode, locale: LocaleOption): string | null =>
  value === null || value === undefined || !Number.isFinite(value) ? null : formatMoney(value, market, locale);

export const pctOrNull = (value: number | null | undefined, locale: LocaleOption): string | null =>
  value === null || value === undefined || !Number.isFinite(value) ? null : formatPercent(value, locale);

/** A sum as text, or null when no row had the figure. */
export const sumText = (total: PortfolioSum, market: MarketCode, locale: LocaleOption): string | null => (total.count === 0 ? null : formatMoney(total.value, market, locale));

/** "aus 3 von 4" — only when some rows lack the figure. */
export const coverageText = (count: number, of: number, template: string): string | null => (count > 0 && count < of ? fill(template, { count, of }) : null);
