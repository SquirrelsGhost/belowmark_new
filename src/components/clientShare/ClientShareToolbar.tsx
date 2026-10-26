// Opens the print dialog (once, when asked to via the URL) and offers it again as a button
"use client";

import { useEffect } from "react";

interface ClientShareToolbarProps {
  printLabel: string;
  printHint: string;
  autoPrint: boolean;
}

const BUTTON = "inline-flex h-10 cursor-pointer items-center bg-(--brand-accent) px-4 font-narrow text-xs font-semibold tracking-[0.08em] text-paper-bright uppercase shadow-[3px_3px_0_0_var(--ink)]";

/** Screen-only bar above the client sheet: save as PDF. No way into the app — the reader has no account. */
export default function ClientShareToolbar({ printLabel, printHint, autoPrint }: ClientShareToolbarProps) {
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
    <div className="mx-auto mb-4 flex max-w-[210mm] flex-wrap items-center justify-end gap-3 px-4 print:hidden">
      <p className="hidden text-xs text-muted sm:block">{printHint}</p>
      <button type="button" onClick={() => window.print()} className={BUTTON}>
        {printLabel}
      </button>
    </div>
  );
}
