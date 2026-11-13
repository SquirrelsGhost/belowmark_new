import OrderSummaryRow from "@/components/billing/OrderSummaryRow";
import { OrderFormLabels, OrderMarketView, OrderOfferView } from "@/lib/billing/billingForm.types";
import { PricingCountryCode } from "@/lib/constants";

interface OrderSummarySectionProps {
  legendClassName: string;
  offer: OrderOfferView;
  summaryEmail: string;
  currentMarket: OrderMarketView;
  selectedMarket: PricingCountryCode;
  vatNote: string;
  labels: OrderFormLabels;
}

export default function OrderSummarySection({
  legendClassName,
  offer,
  summaryEmail,
  currentMarket,
  selectedMarket,
  vatNote,
  labels,
}: OrderSummarySectionProps) {
  return (
    <section aria-labelledby="order-summary-title">
      <h3 id="order-summary-title" className={legendClassName}>
        <span className="text-signal">03</span> {labels.SummaryTitle}
      </h3>
      <dl className="mt-3 border-t border-rule" aria-live="polite">
        <OrderSummaryRow label={offer.name} value={offer.summary} />
        <OrderSummaryRow label={labels.Account} value={summaryEmail} />
        <OrderSummaryRow label={labels.Market} value={`${currentMarket.label} · ${selectedMarket}`} />
        <OrderSummaryRow label={labels.Start} value={offer.isTrial && offer.trialStartValue ? offer.trialStartValue : labels.StartValue} />
        {offer.isTrial && offer.trialAfterLabel && offer.trialAfterValue ? (
          <>
            <OrderSummaryRow label={offer.trialAfterLabel} value={offer.trialAfterValue} />
            <OrderSummaryRow
              label={offer.trialDueTodayLabel ?? labels.Total}
              value={offer.trialDueTodayPrice ?? offer.totalPrice}
              note={offer.trialDueTodayNote ?? vatNote}
              isTotal
            />
          </>
        ) : (
          <>
            <OrderSummaryRow label={offer.period} value={offer.term} />
            <OrderSummaryRow label={labels.Total} value={offer.totalPrice} note={vatNote} isTotal />
          </>
        )}
      </dl>
    </section>
  );
}
