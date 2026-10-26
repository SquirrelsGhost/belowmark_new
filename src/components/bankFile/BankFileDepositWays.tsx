// Marks the deposit method the bidder picked (stored in localStorage)
"use client";

import BankFileBasis from "@/components/bankFile/BankFileBasis";
import { useBankFile } from "@/hooks/useBankFile";
import { IBankFileTranslation } from "@/translations/bankFile/IBankFileTranslation";
import { BidContext } from "@/types/bidding.types";

interface BankFileDepositWaysProps {
  listingId: string;
  context: BidContext;
  labels: IBankFileTranslation["Deposit"];
  /** The deposit, formatted */
  amount: string;
}

/** The lawful ways to provide the deposit and what each asks of the bank; the chosen one is marked. */
export default function BankFileDepositWays({ listingId, context, labels, amount }: BankFileDepositWaysProps) {
  const { bank } = useBankFile(listingId, context);
  const market = context.market;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="max-w-[70%] text-[13px] leading-snug text-ink-soft">{labels.Lead[market]}</p>
        <p className="font-mono text-xl font-semibold">{amount}</p>
      </div>
      <ul className={`grid gap-3 ${labels.Ways[market].length > 1 ? "grid-cols-3" : "grid-cols-1"}`}>
        {labels.Ways[market].map((way) => {
          const isChosen = bank.depositMethod === way.id;
          return (
            <li key={way.id} className={`flex flex-col gap-1.5 border p-3 text-[12px] leading-snug ${isChosen ? "border-2 border-ink bg-paper-deep" : "border-rule"}`}>
              <p className="flex items-baseline justify-between gap-2 font-narrow text-xs font-bold tracking-[0.08em] uppercase">
                {way.title}
                {isChosen && <span className="bg-ink px-1 font-mono text-[9px] tracking-wide text-paper-bright">{labels.Chosen}</span>}
              </p>
              <p className="flex-1">{way.text}</p>
              <BankFileBasis basis={way.basis} law={way.law} align="left" />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
