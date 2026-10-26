import { BANK_FILE_LAWS } from "@/lib/bankFile/bankFileConstants";
import { BankFileClause } from "@/translations/bankFile/IBankFileTranslation";

interface BankFileBasisProps {
  basis: string;
  law?: BankFileClause["law"];
  align?: "left" | "right";
}

/** The legal basis in the margin: a link on screen, plain text on paper (the sources list has the URLs). */
export default function BankFileBasis({ basis, law, align = "right" }: BankFileBasisProps) {
  const className = `${align === "right" ? "text-right" : "text-left"} font-mono text-[10px] text-muted`;
  if (!law) return <span className={className}>{basis}</span>;
  return (
    <a href={BANK_FILE_LAWS[law]} target="_blank" rel="noopener" className={`${className} underline-offset-2 hover:underline print:no-underline`}>
      {basis}
    </a>
  );
}
