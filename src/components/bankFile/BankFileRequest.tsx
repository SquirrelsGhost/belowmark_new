// Shows the financing need computed live from the stored inputs
"use client";

import BidderFileRow from "@/components/bidderFile/BidderFileRow";
import { useBankFile } from "@/hooks/useBankFile";
import { formatMoney } from "@/lib/appFormat";
import { costLineBasis, costLineLabel } from "@/lib/bidding/bidFormat";
import { LocaleOption } from "@/lib/constants";
import { formatNumber, formatPercent } from "@/lib/format";
import { IBankFileTranslation } from "@/translations/bankFile/IBankFileTranslation";
import { IBiddingTranslation } from "@/translations/bidding/IBiddingTranslation";
import { BidContext } from "@/types/bidding.types";

interface BankFileRequestProps {
  listingId: string;
  context: BidContext;
  labels: IBankFileTranslation;
  costLabels: IBiddingTranslation["Limit"]["Costs"];
  locale: LocaleOption;
}

const COLUMN_TITLE = "mb-1 font-narrow text-xs font-bold tracking-[0.12em] uppercase";
const TOTAL_ROW = "border-t-2 border-ink font-semibold";

/** Uses and sources of funds, then the terms the bidder wishes for — every line with where it comes from. */
export default function BankFileRequest({ listingId, context, labels, costLabels, locale }: BankFileRequestProps) {
  const { bank, bidInputs, request } = useBankFile(listingId, context);
  const { Request: R, File: F, Form } = labels;
  const money = (amount: number | null) => (amount === null ? null : formatMoney(amount, context.market, locale));
  const pct = (value: number | null) => (value === null ? null : formatPercent(value, locale));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className={COLUMN_TITLE}>{R.UsesTitle}</p>
          <dl className="divide-y divide-rule">
            <BidderFileRow label={R.Bid} value={money(request.bid)} missing={F.NoValue} note={request.bidSource === "limit" ? R.BidFromLimit : R.BidOwn} />
            {request.costs.map((line) => (
              <BidderFileRow key={line.code} label={costLineLabel(line, costLabels, locale)} value={line.isUnknown ? null : money(line.amount)} missing={costLabels.Unknown} note={costLineBasis(line, costLabels)} />
            ))}
            <div className={TOTAL_ROW}>
              <BidderFileRow label={R.Total} value={money(request.totalCost)} missing={F.NoValue} />
            </div>
          </dl>
        </div>
        <div>
          <p className={COLUMN_TITLE}>{R.SourcesTitle}</p>
          <dl className="divide-y divide-rule">
            <BidderFileRow label={R.Equity} value={money(request.equity)} missing={F.NoValue} note={pct(request.equitySharePct) ? `${R.EquityShare} ${pct(request.equitySharePct)}` : undefined} />
            <div className={TOTAL_ROW}>
              <BidderFileRow label={R.Loan} value={money(request.loan)} missing={F.NoValue} />
            </div>
            <BidderFileRow label={R.LoanToValue} value={pct(request.loanToValuePct)} missing={F.NoValue} note={R.LoanToValueNote} />
            {request.guaranteeAmount !== null && <BidderFileRow label={R.Guarantee} value={money(request.guaranteeAmount)} missing={F.NoValue} note={R.GuaranteeBasis} />}
          </dl>
          <p className={`${COLUMN_TITLE} mt-4`}>{R.TermsTitle}</p>
          <dl className="divide-y divide-rule">
            <BidderFileRow label={R.Interest} value={pct(bidInputs.interestPct)} missing={F.NoValue} note={R.InterestNote} />
            <BidderFileRow label={R.Repayment} value={pct(bidInputs.repaymentPct)} missing={F.NoValue} />
            <BidderFileRow label={R.MonthlyRate} value={money(request.monthlyRate)} missing={F.NoValue} />
            <BidderFileRow label={R.FixedYears} value={bank.fixedYears === null ? null : `${formatNumber(bank.fixedYears, locale)} ${Form.YearsSuffix}`} missing={F.NoValue} />
            <BidderFileRow label={R.Use} value={bank.use ? Form.Uses[bank.use] : null} missing={F.NoValue} />
          </dl>
        </div>
      </div>
      {request.isIncomplete && <p className="border-l-4 border-caution px-2 text-[12px] text-caution">{R.Incomplete}</p>}
      {request.equityShortForDeposit && <p className="border-l-4 border-signal px-2 text-[12px] text-signal">{R.EquityShortForDeposit}</p>}
    </div>
  );
}
