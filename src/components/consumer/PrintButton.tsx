// Calls window.print()
"use client";

interface PrintButtonProps {
  label: string;
}

/** Lets the person keep the receipt on a durable medium (print or "Save as PDF"). */
export default function PrintButton({ label }: PrintButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-10 cursor-pointer items-center border-2 border-ink px-4 font-narrow text-xs font-semibold tracking-[0.08em] uppercase transition-colors hover:bg-ink hover:text-paper-bright print:hidden"
    >
      {label}
    </button>
  );
}
