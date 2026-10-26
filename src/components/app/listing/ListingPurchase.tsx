import { ReactNode } from "react";
import IcraCalculator from "@/components/app/calculator/IcraCalculator";
import ObjectBidCalculator from "@/components/app/calculator/ObjectBidCalculator";
import LockedPanel from "@/components/app/listing/LockedPanel";
import MarketComparison from "@/components/app/listing/MarketComparison";
import ValueLine from "@/components/app/listing/ValueLine";
import ValueLineFigure from "@/components/app/listing/ValueLineFigure";
import { fill, formatMoney } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { formatPercent } from "@/lib/format";
import { getIcraFigures, getZvgFigures } from "@/lib/listingMath";
import { ITranslation } from "@/translations/ITranslation";
import { Listing } from "@/types/listing.types";

interface ListingPurchaseProps {
  listing: Listing;
  t: ITranslation;
  locale: LocaleOption;
  isLocked: boolean;
}

/**
 * Everything about money for one proceeding: value on the market line, the
 * legal figures below it, then the calculator bound to this proceeding.
 */
export default function ListingPurchase({ listing, t, locale, isLocked }: ListingPurchaseProps) {
  const L = t.App.Listing;
  const market = listing.market;
  const value = listing.appraisedValue;
  const money = (amount: number) => formatMoney(amount, market, locale);
  const lockedLabel = t.App.Row.Locked;

  const valueLine = (children?: ReactNode) => (
    <ValueLine
      label={L.Value[market]}
      value={value === null ? null : money(value)}
      basis={L.ValueBasis[market]}
      notStated={L.NotStated}
      isLocked={isLocked}
      lockedLabel={lockedLabel}
    >
      {children}
    </ValueLine>
  );

  if (value === null) return valueLine();

  if (market === "TR") {
    // The notice's starting bid wins over the statutory half (e.g. 100 % in an heirs-only first round)
    const figures = getIcraFigures(value, listing.tr?.vatRate ?? null, listing.tr?.startingBid ?? undefined);
    const startingBid = listing.tr?.startingBid ?? figures.startingBid;
    return (
      <>
        {valueLine(
          <>
            <ValueLineFigure label={L.Tr.StartingBid} value={money(startingBid)} note={L.Tr.StartingBidNote} isLocked={isLocked} lockedLabel={lockedLabel} isKey />
            <ValueLineFigure label={L.Tr.Deposit} value={money(figures.deposit)} isLocked={isLocked} lockedLabel={lockedLabel} />
            <ValueLineFigure label={L.Tr.AllIn} value={money(figures.allIn)} note={figures.vatKnown ? undefined : L.Tr.VatUnknown} isLocked={isLocked} lockedLabel={lockedLabel} />
            <MarketComparison listing={listing} labels={L.Tr} locale={locale} isLocked={isLocked} lockedLabel={lockedLabel} />
          </>,
        )}
        <div className="mt-10">
          {isLocked ? (
            <LockedPanel title={L.Locked.Title} body={L.Locked.Body} cta={L.Locked.Cta} />
          ) : (
            <IcraCalculator labels={t.App.Calculator.Tr} costLabels={L.Tr} locale={locale} value={value} vatRate={listing.tr?.vatRate ?? null} isFixed />
          )}
        </div>
      </>
    );
  }

  const figures = getZvgFigures(value, listing.transferTaxPct);
  const taxPct = listing.transferTaxPct ?? 0;
  return (
    <>
      {valueLine(
        listing.limitsWaived ? (
          <>
            <ValueLineFigure label={L.LimitsTitle} value="0 €" note={L.WaivedNote} isLocked={false} lockedLabel={lockedLabel} isKey />
            <ValueLineFigure label={L.Deposit} value={money(figures.deposit)} isLocked={isLocked} lockedLabel={lockedLabel} />
            <ValueLineFigure
              label={L.EntryAtHalf}
              value={figures.entryAtHalf === null ? L.NotStated : money(figures.entryAtHalf)}
              note={figures.taxOnHalf === null ? undefined : fill(L.TransferTax, { pct: formatPercent(taxPct, locale) })}
              isLocked={isLocked}
              lockedLabel={lockedLabel}
            />
          </>
        ) : (
          <>
            <ValueLineFigure label={L.Half} value={money(figures.half)} isLocked={isLocked} lockedLabel={lockedLabel} isKey />
            <ValueLineFigure label={L.SevenTenths} value={money(figures.sevenTenths)} isLocked={isLocked} lockedLabel={lockedLabel} />
            <ValueLineFigure label={L.Deposit} value={money(figures.deposit)} isLocked={isLocked} lockedLabel={lockedLabel} />
            <ValueLineFigure
              label={L.EntryAtHalf}
              value={figures.entryAtHalf === null ? L.NotStated : money(figures.entryAtHalf)}
              note={figures.taxOnHalf === null ? undefined : fill(L.TransferTax, { pct: formatPercent(taxPct, locale) })}
              isLocked={isLocked}
              lockedLabel={lockedLabel}
            />
          </>
        ),
      )}
      <div className="mt-10">
        {isLocked ? (
          <LockedPanel title={L.Locked.Title} body={L.Locked.Body} cta={L.Locked.Cta} />
        ) : (
          <ObjectBidCalculator
            t={t.HomePage.Calculator}
            locale={locale}
            title={L.CalculatorTitle}
            note={L.CalculatorNote}
            value={value}
            transferTaxPct={taxPct}
            limitsWaived={listing.limitsWaived}
          />
        )}
      </div>
    </>
  );
}
