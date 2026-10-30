import { OFFERS } from "@/lib/billing/billingConfig";
import { fill, formatContractDate, formatPrice } from "@/lib/billing/billingFormat";
import { LocaleOption } from "@/lib/constants";
import { IBillingTranslation } from "@/translations/billing/IBillingTranslation";
import { UpgradeQuote } from "@/types/billing.types";

/** One line of the upgrade summary. */
export interface UpgradeSummaryRow {
  label: string;
  value: string;
}

export interface UpgradeView {
  rows: UpgradeSummaryRow[];
  total: string;
  totalNote: string;
}

/** The upgrade as the summary on /buchen/upgrade shows it: from, to, start, end, and what is due today. */
export function buildUpgradeView(quote: UpgradeQuote, t: IBillingTranslation, lang: LocaleOption, vatNote: string): UpgradeView {
  const { Upgrade, Order } = t;
  const date = formatContractDate(quote.endsAt, lang);
  const fullPrice = formatPrice(OFFERS[quote.to].prices[quote.market], lang);
  return {
    rows: [
      { label: Upgrade.From, value: Order.Offers[quote.from].Name },
      { label: Upgrade.To, value: `${Order.Offers[quote.to].Name} — ${Order.Offers[quote.to].Summary}` },
      { label: Upgrade.Start, value: Upgrade.StartValue },
      { label: Upgrade.Until, value: fill(quote.renews ? Upgrade.UntilRenews : Upgrade.UntilEnds, { date, price: fullPrice }) },
    ],
    total: formatPrice({ amount: quote.amount, currency: quote.currency }, lang),
    totalNote: quote.amount === 0 ? Upgrade.FreeNote : `${fill(Upgrade.Rule, { date })}. ${vatNote}`,
  };
}
