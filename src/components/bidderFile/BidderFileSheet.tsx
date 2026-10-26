import { ReactNode } from "react";

interface BidderFileSheetProps {
  lang: string;
  /** Screen-only bar above the paper */
  toolbar?: ReactNode;
  children: ReactNode;
}

/** A4 page rules for the printed file; the only CSS that cannot be a utility class. */
const PAGE_RULES = "@page { size: A4; margin: 14mm 12mm; }";

/** The printable sheet: paper on screen, plain white with exact colours on paper. */
export default function BidderFileSheet({ lang, toolbar, children }: BidderFileSheetProps) {
  return (
    <div lang={lang} className="min-h-screen bg-paper-deep py-8 print:bg-white print:py-0 print:[print-color-adjust:exact]">
      <style href="bidder-file-page" precedence="default">
        {PAGE_RULES}
      </style>
      {toolbar}
      <main className="mx-auto flex max-w-[210mm] flex-col gap-6 border border-rule bg-paper-bright px-[12mm] py-[14mm] shadow-[8px_8px_0_0_var(--ink)] print:max-w-none print:border-0 print:p-0 print:shadow-none">
        {children}
      </main>
    </div>
  );
}
