import { formatHearing, formatMoney } from "@/lib/appFormat";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { getAddressLine } from "@/lib/listingLabels";
import { getIcraFigures, getNextDate, getZvgFigures } from "@/lib/listingMath";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { Listing } from "@/types/listing.types";

/** Rows of the watch list comparison; money cells stay numbers until the end so the cheapest can be marked. */

export interface CompareCell {
  text: string | null;
  isMoney: boolean;
  isBest: boolean;
}

export interface CompareRowData {
  key: string;
  label: string;
  cells: CompareCell[];
  /** Row of the figure the "best" mark is about */
  isHighlight: boolean;
}

type Pick = (listing: Listing) => number | null;

function moneyRow(key: string, label: string, listings: Listing[], pick: Pick, market: MarketCode, locale: LocaleOption, markBest: boolean): CompareRowData {
  const values = listings.map(pick);
  const known = values.filter((value): value is number => value !== null);
  const best = markBest && known.length > 1 ? Math.min(...known) : null;
  return {
    key,
    label,
    isHighlight: markBest,
    cells: values.map((value) => ({ text: value === null ? null : formatMoney(value, market, locale), isMoney: true, isBest: value !== null && value === best })),
  };
}

const textRow = (key: string, label: string, values: (string | null)[]): CompareRowData => ({
  key,
  label,
  isHighlight: false,
  cells: values.map((text) => ({ text, isMoney: false, isBest: false })),
});

export function compareRows(listings: Listing[], market: MarketCode, app: IAppTranslation, locale: LocaleOption, now: number, notes: Map<string, string | null>): CompareRowData[] {
  const R = app.Compare.Rows;
  const zvg = (listing: Listing) => (listing.appraisedValue === null ? null : getZvgFigures(listing.appraisedValue, listing.transferTaxPct));
  const icra = (listing: Listing) => (listing.appraisedValue === null ? null : getIcraFigures(listing.appraisedValue, listing.tr?.vatRate ?? null, listing.tr?.startingBid ?? undefined));
  const money = (key: string, label: string, pick: Pick, markBest = false) => moneyRow(key, label, listings, pick, market, locale, markBest);

  const figures =
    market === "TR"
      ? [
          money("entry", R.Entry.TR, (l) => l.tr?.startingBid ?? icra(l)?.startingBid ?? null),
          money("limit", R.Limit.TR, (l) => icra(l)?.deposit ?? null),
          money("allIn", R.AllIn.TR, (l) => icra(l)?.allIn ?? null, true),
        ]
      : [
          money("entry", R.Entry.DE, (l) => (l.limitsWaived ? null : zvg(l)?.half ?? null)),
          money("limit", R.Limit.DE, (l) => zvg(l)?.sevenTenths ?? null),
          money("deposit", R.Deposit, (l) => zvg(l)?.deposit ?? null),
          money("allIn", R.AllIn.DE, (l) => (l.limitsWaived ? null : zvg(l)?.entryAtHalf ?? null), true),
        ];

  return [
    textRow("place", R.Place, listings.map((l) => getAddressLine(l) || l.region)),
    textRow("segment", R.Segment, listings.map((l) => app.Segments[l.segment])),
    textRow("hearing", R.Hearing, listings.map((l) => {
      const next = getNextDate(l, now);
      return next ? formatHearing(next, l.market, locale) : null;
    })),
    money("value", R.Value[market], (l) => l.appraisedValue),
    ...figures,
    textRow("authority", R.Authority[market], listings.map((l) => `${l.authority} · ${l.fileNo}`)),
    textRow("note", R.Note, listings.map((l) => notes.get(l.key) || app.Watchlist.NoNote)),
  ];
}
