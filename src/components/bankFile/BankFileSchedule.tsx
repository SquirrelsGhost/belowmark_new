// Lists the payments with live amounts from the stored inputs
"use client";

import BankFileBasis from "@/components/bankFile/BankFileBasis";
import { useBankFile } from "@/hooks/useBankFile";
import { formatMoney } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { IBankFileTranslation } from "@/translations/bankFile/IBankFileTranslation";
import { PaymentStep } from "@/types/bankFile.types";
import { BidContext } from "@/types/bidding.types";

interface BankFileScheduleProps {
  listingId: string;
  context: BidContext;
  labels: IBankFileTranslation["Schedule"];
  locale: LocaleOption;
}

const HEAD = "py-1 text-left font-mono text-[10px] font-normal tracking-[0.14em] text-muted uppercase";

/** Every payment from the hearing to the land register, in legal order, with the amount where it can be computed. */
export default function BankFileSchedule({ listingId, context, labels, locale }: BankFileScheduleProps) {
  const { bank, request, steps } = useBankFile(listingId, context);
  const texts = labels.Steps[context.market];

  /** Why an amount is missing, or what it already accounts for. */
  const noteOf = (step: PaymentStep): string | null => {
    if (step.id === "bidInterest" && step.amount === null && request.bid !== null) return labels.MissingInterestDays;
    if (step.id !== "balance" || context.market === "TR") return null;
    if (bank.depositMethod === "guarantee") return labels.BalanceGuaranteeNote;
    if (bank.depositMethod === null) return labels.BalanceOpenNote;
    return null;
  };

  return (
    <div className="flex flex-col gap-2">
      <table className="w-full border-collapse text-[12px] leading-snug">
        <thead className="border-b border-ink">
          <tr>
            <th className={`${HEAD} w-[32%]`}>{labels.Columns.when}</th>
            <th className={HEAD}>{labels.Columns.what}</th>
            <th className={`${HEAD} w-[18%] text-right`}>{labels.Columns.amount}</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((step) => {
            const text = texts[step.id];
            if (!text) return null;
            const note = noteOf(step);
            return (
              <tr key={step.id} className="border-b border-rule align-top">
                <td className="py-1.5 pr-3 font-mono text-[11px]">{text.when}</td>
                <td className="py-1.5 pr-3">
                  {text.text}
                  <span className="mt-0.5 block">
                    <BankFileBasis basis={text.basis} law={text.law} align="left" />
                  </span>
                  {note && <span className="block text-[11px] text-caution">{note}</span>}
                </td>
                <td className={`py-1.5 text-right font-mono ${step.amount === null ? "text-[11px] text-muted" : "text-[13px]"}`}>
                  {step.amount === null ? labels.Unknown : formatMoney(step.amount, context.market, locale)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-[11px] leading-snug text-muted">{labels.Footnote[context.market]}</p>
    </div>
  );
}
