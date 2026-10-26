// Edits the bank file inputs kept in localStorage; recomputes the request live
"use client";

import BidLimitField from "@/components/app/bidding/BidLimitField";
import BankFileSelect from "@/components/bankFile/BankFileSelect";
import { useBankFile } from "@/hooks/useBankFile";
import { APPLICANT_MAX, DEPOSIT_METHODS, PROPERTY_USES } from "@/lib/bankFile/bankFileConstants";
import { CONTROL_CLASSES, LABEL_CLASSES, TEXT_LINK_CLASSES } from "@/lib/appStyles";
import { IBankFileTranslation } from "@/translations/bankFile/IBankFileTranslation";
import { BidContext } from "@/types/bidding.types";

interface BankFileFormProps {
  listingId: string;
  context: BidContext;
  labels: IBankFileTranslation["Form"];
  currency: string;
}

/** Screen-only panel above the sheet: the few figures the bank file needs beyond the bid limit. Never printed. */
export default function BankFileForm({ listingId, context, labels, currency }: BankFileFormProps) {
  const { bank, bidInputs, setBank, setBidInput, reset } = useBankFile(listingId, context);
  const { Fields } = labels;
  const field = (id: keyof typeof Fields, suffix: string, value: number | null, onChange: (value: number | null) => void) => (
    <BidLimitField id={`bank-${id}`} label={Fields[id].label} hint={Fields[id].hint} suffix={suffix} value={value} onChange={onChange} />
  );

  return (
    <section aria-label={labels.Title} className="mx-auto mb-6 flex max-w-[210mm] flex-col gap-4 border-2 border-ink bg-paper-bright p-5 print:hidden">
      <div>
        <h2 className="font-narrow text-sm font-bold tracking-[0.14em] uppercase">{labels.Title}</h2>
        <p className="mt-1 text-[13px] leading-snug text-ink-soft">{labels.Lead}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {field("plannedBid", currency, bank.plannedBid, (plannedBid) => setBank({ plannedBid }))}
        {field("equity", currency, bidInputs.equity, (equity) => setBidInput({ equity }))}
        <BankFileSelect
          id="bank-method"
          label={labels.Method.label}
          empty={labels.Method.empty}
          options={DEPOSIT_METHODS[context.market].map((value) => ({ value, label: labels.Methods[value] }))}
          value={bank.depositMethod}
          onChange={(depositMethod) => setBank({ depositMethod })}
        />
        {field("interestPct", "%", bidInputs.interestPct, (interestPct) => setBidInput({ interestPct }))}
        {field("repaymentPct", "%", bidInputs.repaymentPct, (repaymentPct) => setBidInput({ repaymentPct }))}
        {field("fixedYears", labels.YearsSuffix, bank.fixedYears, (fixedYears) => setBank({ fixedYears }))}
        <BankFileSelect
          id="bank-use"
          label={labels.Use.label}
          empty={labels.Use.empty}
          options={PROPERTY_USES.map((value) => ({ value, label: labels.Uses[value] }))}
          value={bank.use}
          onChange={(use) => setBank({ use })}
        />
        <label htmlFor="bank-applicant" className="flex flex-col gap-1 sm:col-span-2">
          <span className={LABEL_CLASSES}>{labels.Applicant.label}</span>
          <input
            id="bank-applicant"
            type="text"
            maxLength={APPLICANT_MAX}
            autoComplete="name"
            placeholder={labels.Applicant.placeholder}
            value={bank.applicant}
            onChange={(event) => setBank({ applicant: event.target.value })}
            className={CONTROL_CLASSES}
          />
          <span className="text-[11px] leading-snug text-muted">{labels.Applicant.hint}</span>
        </label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-3">
        <p className="text-[11px] text-muted">{labels.StorageHint}</p>
        <button type="button" onClick={reset} className={`${TEXT_LINK_CLASSES} cursor-pointer text-muted`}>
          {labels.Reset}
        </button>
      </div>
    </section>
  );
}
