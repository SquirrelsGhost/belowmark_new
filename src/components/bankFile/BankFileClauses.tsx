import BankFileBasis from "@/components/bankFile/BankFileBasis";
import { BankFileClause } from "@/translations/bankFile/IBankFileTranslation";

interface BankFileClausesProps {
  lead?: string;
  clauses: BankFileClause[];
}

/** Numbered statements, each with its legal basis — linked where the statute is online. */
export default function BankFileClauses({ lead, clauses }: BankFileClausesProps) {
  return (
    <div className="flex flex-col gap-2">
      {lead && <p className="text-[13px] leading-snug text-ink-soft">{lead}</p>}
      <ol className="flex flex-col">
        {clauses.map((clause, index) => (
          <li key={clause.text} className="grid grid-cols-[1.5rem_minmax(0,1fr)_minmax(0,9rem)] gap-3 border-b border-rule py-1.5 text-[12px] leading-snug">
            <span className="font-mono text-[11px] text-signal">{String(index + 1).padStart(2, "0")}</span>
            <span>{clause.text}</span>
            <BankFileBasis basis={clause.basis} law={clause.law} />
          </li>
        ))}
      </ol>
    </div>
  );
}
