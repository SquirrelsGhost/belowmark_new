// Sends the PDF to the API with fetch and reloads the server-rendered analysis afterwards
"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import Button from "@/components/ui/Button";
import { REPORT_API, REPORT_UPLOAD } from "@/lib/report/reportConfig";
import type { ApiResponse } from "@/lib/api";

interface ReportUploadFormProps {
  listingId: string;
  label: string;
  hint: string;
  submitLabel: string;
  pendingLabel: string;
  /** Error texts by API error code; "internal" is the fallback */
  errors: Record<string, string>;
}

const FILE_CLASSES =
  "block w-full cursor-pointer border border-ink/70 bg-paper-bright text-sm file:mr-4 file:cursor-pointer file:border-0 file:border-r file:border-ink/70 file:bg-ink file:px-4 file:py-2.5 file:font-narrow file:text-xs file:font-semibold file:tracking-[0.08em] file:text-paper-bright file:uppercase";

/** Upload field for the Gutachten PDF; checks size before sending. */
export default function ReportUploadForm({ listingId, label, hint, submitLabel, pendingLabel, errors }: ReportUploadFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRefreshing, startTransition] = useTransition();
  const isPending = isUploading || isRefreshing;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = form.get(REPORT_UPLOAD.fieldFile);
    if (!(file instanceof File) || file.size === 0) return setError(errors.file);
    if (file.size > REPORT_UPLOAD.maxBytes) return setError(errors.tooLarge);

    setError(null);
    setIsUploading(true);
    try {
      const response = await fetch(REPORT_API, { method: "POST", body: form });
      const result = (await response.json()) as ApiResponse<unknown>;
      if (!result.success) return setError(errors[result.error] ?? errors.internal);
      startTransition(() => router.refresh());
    } catch {
      setError(errors.internal);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 border border-dashed border-ink/70 p-4">
      <input type="hidden" name={REPORT_UPLOAD.fieldListing} value={listingId} />
      <label htmlFor="report-file" className="font-narrow text-sm font-bold tracking-[0.12em] uppercase">
        {label}
      </label>
      <input id="report-file" name={REPORT_UPLOAD.fieldFile} type="file" accept={REPORT_UPLOAD.mimeType} required disabled={isPending} className={FILE_CLASSES} />
      <p className="text-xs text-muted">{hint}</p>
      <div className="flex flex-wrap items-center gap-3">
        <Button label={isPending ? pendingLabel : submitLabel} type="submit" variant="ink" size="sm" disabled={isPending} />
        <p role="status" aria-live="polite" className="text-sm text-signal">
          {error}
        </p>
      </div>
    </form>
  );
}
