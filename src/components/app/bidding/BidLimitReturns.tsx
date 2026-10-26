import { formatMoney } from "@/lib/appFormat";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { formatPercent } from "@/lib/format";
import { LABEL_CLASSES } from "@/lib/appStyles";
import { IBiddingTranslation } from "@/translations/bidding/IBiddingTranslation";
import { BidReturns } from "@/types/bidding.types";

interface BidLimitReturnsProps {
  labels: IBiddingTranslation["Limit"]["Returns"];
  market: MarketCode;
  locale: LocaleOption;
  returns: BidReturns;
}

/** Yields and cash flow at the limit; a figure whose inputs are missing says so. */
export default function BidLimitReturns({ labels, market, locale, returns }: BidLimitReturnsProps) {
  const money = (amount: number) => formatMoney(amount, market, locale);
  const pct = (value: number | null) => (value === null ? null : formatPercent(value, locale));
  const figures: [string, string | null][] = [
    [labels.Gross, pct(returns.grossYieldPct)],
    [labels.Net, pct(returns.netYieldPct)],
    [labels.Cashflow, returns.cashflowMonthly === null ? null : money(returns.cashflowMonthly)],
    [labels.CashOnCash, pct(returns.cashOnCashPct)],
    [labels.Loan, money(returns.loan)],
    [labels.PricePerM2, returns.pricePerM2 === null ? null : money(returns.pricePerM2)],
  ];
  return (
    <section aria-label={labels.Title}>
      <h3 className="font-narrow text-xs font-bold tracking-[0.14em] uppercase">{labels.Title}</h3>
      <dl className="mt-2 grid grid-cols-2 gap-px bg-rule">
        {figures.map(([label, value]) => (
          <div key={label} className="bg-paper-bright p-2.5">
            <dt className={LABEL_CLASSES}>{label}</dt>
            <dd className={`mt-0.5 font-mono text-sm font-semibold ${value === null ? "text-muted" : value.startsWith("-") || value.startsWith("−") ? "text-signal" : ""}`}>
              {value ?? labels.Missing}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-[11px] leading-snug text-muted">{labels.BeforeTax}</p>
    </section>
  );
}
