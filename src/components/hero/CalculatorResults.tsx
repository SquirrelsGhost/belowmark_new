import CalculatorRow from "@/components/hero/CalculatorRow";
import { LocaleOption, ZVG } from "@/lib/constants";
import { formatMoney, formatPercent, HomeCurrencyCode } from "@/lib/format";
import { ITranslation } from "@/translations/ITranslation";
import { Verdict } from "@/types/calculator.types";

interface CalculatorResultsProps {
  t: ITranslation["HomePage"]["Calculator"];
  locale: LocaleOption;
  currency?: HomeCurrencyCode;
  value: number;
  bid: number;
  tax: number;
  taxPct: number;
  absoluteLimit?: number;
  relativeLimit?: number;
  deposit: number;
  verdict: Verdict;
}

const VERDICT_CLASSES: Record<Verdict, string> = {
  refused: "border-signal bg-signal/10 text-signal-deep",
  contestable: "border-caution bg-caution/10 text-caution",
  clear: "border-verdict bg-verdict/10 text-verdict",
  waived: "border-ink bg-ink/5 text-ink",
};

/** Ledger of computed figures in the active country's currency plus statutory verdict. */
export default function CalculatorResults({
  t,
  locale,
  currency = "EUR",
  value,
  bid,
  tax,
  taxPct,
  absoluteLimit = ZVG.absoluteLimit,
  relativeLimit = ZVG.relativeLimit,
  deposit,
  verdict,
}: CalculatorResultsProps) {
  const verdictText: Record<Verdict, string> = {
    refused: t.VerdictRefused,
    contestable: t.VerdictContestable,
    clear: t.VerdictClear,
    waived: t.VerdictWaived,
  };

  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <p className="font-mono text-[11px] tracking-wider text-muted uppercase">{t.BidLabel}</p>
        <p className="font-display text-4xl leading-none sm:text-5xl">{formatMoney(bid, currency, locale)}</p>
        <p className="mt-2 font-mono text-sm text-signal">
          −{formatMoney(value - bid, currency, locale)} {t.BelowValue}
        </p>
      </div>
      <dl className="flex flex-col">
        <CalculatorRow label={t.LimitAbsolute} value={formatMoney(value * absoluteLimit, currency, locale)} />
        <CalculatorRow label={t.LimitRelative} value={formatMoney(value * relativeLimit, currency, locale)} />
        <CalculatorRow label={t.Deposit} value={formatMoney(deposit, currency, locale)} />
        <CalculatorRow label={`${t.TransferTax} · ${formatPercent(taxPct, locale)}`} value={formatMoney(tax, currency, locale)} />
        <CalculatorRow label={t.EntryTotal} value={formatMoney(bid + tax, currency, locale)} isTotal />
      </dl>
      <p role="status" className={`border-l-4 px-3 py-2 text-sm leading-snug font-medium ${VERDICT_CLASSES[verdict]}`}>
        {verdictText[verdict]}
      </p>
    </div>
  );
}
