import BidderFileRow from "@/components/bidderFile/BidderFileRow";
import { fill, formatMoney } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { formatPercent } from "@/lib/format";
import { getIcraFigures, getZvgFigures } from "@/lib/listingMath";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { Listing } from "@/types/listing.types";

interface BidderFileMoneyProps {
  listing: Listing;
  labels: IAppTranslation["Listing"];
  locale: LocaleOption;
}

const GRID_CLASSES = "grid grid-cols-1 gap-x-8 divide-y divide-rule sm:grid-cols-2 print:grid-cols-2";

/** Appraised value, the legal limits and the deposit — the numbers the court will work with. */
export default function BidderFileMoney({ listing, labels: L, locale }: BidderFileMoneyProps) {
  const market = listing.market;
  const value = listing.appraisedValue;
  const money = (amount: number) => formatMoney(amount, market, locale);
  const valueRow = <BidderFileRow label={L.Value[market]} value={value === null ? null : money(value)} missing={L.NotStated} note={L.ValueBasis[market]} />;

  if (value === null) return <dl className="divide-y divide-rule">{valueRow}</dl>;

  if (market === "TR") {
    const figures = getIcraFigures(value, listing.tr?.vatRate ?? null);
    return (
      <dl className={GRID_CLASSES}>
        {valueRow}
        <BidderFileRow label={L.Tr.StartingBid} value={money(figures.startingBid)} missing={L.NotStated} />
        <BidderFileRow label={L.Tr.Deposit} value={money(figures.deposit)} missing={L.NotStated} />
        <BidderFileRow label={L.Tr.AllIn} value={money(figures.allIn)} missing={L.NotStated} note={figures.vatKnown ? undefined : L.Tr.VatUnknown} />
      </dl>
    );
  }

  const figures = getZvgFigures(value, listing.transferTaxPct);
  const pct = listing.transferTaxPct;
  return (
    <dl className={GRID_CLASSES}>
      {valueRow}
      <BidderFileRow label={L.Deposit} value={money(figures.deposit)} missing={L.NotStated} />
      {listing.limitsWaived ? (
        <BidderFileRow label={L.LimitsTitle} value="—" missing={L.NotStated} note={L.WaivedNote} />
      ) : (
        <>
          <BidderFileRow label={L.Half} value={money(figures.half)} missing={L.NotStated} />
          <BidderFileRow label={L.SevenTenths} value={money(figures.sevenTenths)} missing={L.NotStated} />
          <BidderFileRow
            label={L.EntryAtHalf}
            value={figures.entryAtHalf === null ? null : money(figures.entryAtHalf)}
            missing={L.NotStated}
            note={pct === null ? undefined : fill(L.TransferTax, { pct: formatPercent(pct, locale) })}
          />
        </>
      )}
    </dl>
  );
}
