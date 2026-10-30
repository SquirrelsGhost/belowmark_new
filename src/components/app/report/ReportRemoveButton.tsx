// Asks for confirmation, deletes through the API and reloads the page
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { REPORT_API, REPORT_UPLOAD } from "@/lib/report/reportConfig";

interface ReportRemoveButtonProps {
  listingId: string;
  label: string;
  confirmLabel: string;
}

/** Deletes the stored analysis of this proceeding. */
export default function ReportRemoveButton({ listingId, label, confirmLabel }: ReportRemoveButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(confirmLabel)) return;
    startTransition(async () => {
      try {
        const res = await fetch(`${REPORT_API}?${REPORT_UPLOAD.fieldListing}=${encodeURIComponent(listingId)}`, { method: "DELETE" });
        if (res.ok) router.refresh();
      } catch {
        // Ignore network failure and keep current UI state
      }
    });
  }

  return (
    <button type="button" onClick={handleClick} disabled={isPending} className="self-start font-mono text-[11px] text-muted underline-offset-2 hover:text-signal hover:underline disabled:opacity-50">
      {label}
    </button>
  );
}
