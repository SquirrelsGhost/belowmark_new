// Opens the print dialog (once, when asked to via the URL) and offers it again as a button
"use client";

import Link from "next/link";
import { useEffect } from "react";

interface BidderFileToolbarProps {
  printLabel: string;
  printHint: string;
  backLabel: string;
  backHref: string;
  /** Open the print dialog as soon as fonts are loaded */
  autoPrint: boolean;
}

const BUTTON = "inline-flex h-10 cursor-pointer items-center bg-signal px-4 font-narrow text-xs font-semibold tracking-[0.08em] text-paper-bright uppercase shadow-[3px_3px_0_0_var(--ink)]";

/** Screen-only bar above the sheet: print / save as PDF, and the way back. Never printed. */
export default function BidderFileToolbar({ printLabel, printHint, backLabel, backHref, autoPrint }: BidderFileToolbarProps) {
  useEffect(() => {
    if (!autoPrint) return;
    let isCancelled = false;
    // Wait for the web fonts, otherwise the PDF falls back to system fonts
    document.fonts.ready.then(() => {
      if (!isCancelled) window.print();
    });
    return () => {
      isCancelled = true;
    };
  }, [autoPrint]);

  return (
    <div className="mx-auto mb-4 flex max-w-[210mm] flex-wrap items-center justify-between gap-3 print:hidden">
      <Link href={backHref} className="font-narrow text-xs font-semibold tracking-[0.1em] uppercase underline-offset-4 hover:underline">
        ← {backLabel}
      </Link>
      <div className="flex items-center gap-3">
        <p className="hidden text-xs text-muted sm:block">{printHint}</p>
        <button type="button" onClick={() => window.print()} className={BUTTON}>
          {printLabel}
        </button>
      </div>
    </div>
  );
}
