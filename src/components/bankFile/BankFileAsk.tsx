// Fills the request letter with the live figures from localStorage
"use client";

import { useBankFile } from "@/hooks/useBankFile";
import { fill, formatMoney } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { IBankFileTranslation } from "@/translations/bankFile/IBankFileTranslation";
import { BidContext } from "@/types/bidding.types";

interface BankFileAskProps {
  listingId: string;
  context: BidContext;
  labels: IBankFileTranslation["Ask"];
  /** Intro with object, file number, court, date and value already filled in */
  intro: string;
  locale: LocaleOption;
}

/** The covering letter: who asks, for which proceeding, and the numbered requests with their amounts. */
export default function BankFileAsk({ listingId, context, labels, intro, locale }: BankFileAskProps) {
  const { bank, request } = useBankFile(listingId, context);
  const money = (amount: number) => formatMoney(amount, context.market, locale);
  const missing = (text: string) => <span className="bg-hatch px-1 font-mono text-[11px] text-muted">{text}</span>;

  const loanLine =
    request.bid === null
      ? missing(labels.MissingBid)
      : request.loan === null || request.equity === null || request.totalCost === null
        ? missing(labels.MissingEquity)
        : fill(labels.Requests.loan, { amount: money(request.loan), total: money(request.totalCost), equity: money(request.equity) });
  const depositLine = bank.depositMethod ? fill(labels.Requests[bank.depositMethod], { amount: money(request.deposit) }) : missing(labels.MissingMethod);
  const applicant = bank.applicant.trim();

  return (
    <div className="flex flex-col gap-3 font-serif text-[14px] leading-relaxed">
      <p className="font-mono text-[12px]">{applicant ? fill(labels.Applicant, { name: applicant }) : labels.NoApplicant}</p>
      <p>{labels.Salutation}</p>
      <p>{intro}</p>
      <ol className="flex list-decimal flex-col gap-1.5 pl-5 marker:font-mono marker:text-signal">
        <li>{loanLine}</li>
        <li>{depositLine}</li>
        <li>{labels.Requests.timing}</li>
      </ol>
      <p>{labels.Closing}</p>
    </div>
  );
}
