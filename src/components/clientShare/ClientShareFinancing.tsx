import BidderFileRow from "@/components/bidderFile/BidderFileRow";
import { formatMoney } from "@/lib/appFormat";
import { getFinancingRequest } from "@/lib/bankFile/financingRequest";
import { costLineBasis, costLineLabel } from "@/lib/bidding/bidFormat";
import { getBidLimit } from "@/lib/bidding/bidLimit";
import { LocaleOption } from "@/lib/constants";
import { formatPercent } from "@/lib/format";
import { IBiddingTranslation } from "@/translations/bidding/IBiddingTranslation";
import { IClientShareTranslation } from "@/translations/clientShare/IClientShareTranslation";
import { BidContext, BidInputs } from "@/types/bidding.types";
import { SharedBankInputs } from "@/types/clientShare.types";

interface ClientShareFinancingProps {
  context: BidContext;
  inputs: BidInputs;
  bank: SharedBankInputs;
  labels: IClientShareTranslation["Public"];
  costLabels: IBiddingTranslation["Limit"]["Costs"];
  locale: LocaleOption;
}

const COLUMN_TITLE = "mb-1 font-narrow text-xs font-bold tracking-[0.12em] uppercase";
const TOTAL_ROW = "border-t-2 border-ink font-semibold";

/** Uses and sources of funds from the frozen figures — the same arithmetic as the bank file, without the applicant. */
export default function ClientShareFinancing({ context, inputs, bank, labels, costLabels, locale }: ClientShareFinancingProps) {
  const request = getFinancingRequest(context, inputs, { ...bank, applicant: "" }, getBidLimit(context, inputs));
  const { Financing: F, NoValue } = labels;
  const money = (amount: number | null) => (amount === null ? null : formatMoney(amount, context.market, locale));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 print:grid-cols-2">
        <div>
          <p className={COLUMN_TITLE}>{F.Uses}</p>
          <dl className="divide-y divide-rule">
            <BidderFileRow label={F.Bid} value={money(request.bid)} missing={NoValue} note={request.bidSource === "limit" ? F.BidFromLimit : F.BidOwn} />
            {request.costs.map((line) => (
              <BidderFileRow key={line.code} label={costLineLabel(line, costLabels, locale)} value={line.isUnknown ? null : money(line.amount)} missing={costLabels.Unknown} note={costLineBasis(line, costLabels)} />
            ))}
            <div className={TOTAL_ROW}>
              <BidderFileRow label={F.Total} value={money(request.totalCost)} missing={NoValue} />
            </div>
          </dl>
        </div>
        <div>
          <p className={COLUMN_TITLE}>{F.Sources}</p>
          <dl className="divide-y divide-rule">
            <BidderFileRow label={F.Equity} value={money(request.equity)} missing={NoValue} />
            <div className={TOTAL_ROW}>
              <BidderFileRow label={F.Loan} value={money(request.loan)} missing={NoValue} />
            </div>
            <BidderFileRow label={F.LoanToValue} value={request.loanToValuePct === null ? null : formatPercent(request.loanToValuePct, locale)} missing={NoValue} />
            <BidderFileRow label={F.MonthlyRate} value={money(request.monthlyRate)} missing={NoValue} note={F.MonthlyRateNote} />
          </dl>
        </div>
      </div>
      {request.isIncomplete && <p className="border-l-4 border-caution px-2 text-[12px] text-caution">{F.Incomplete}</p>}
    </div>
  );
}
