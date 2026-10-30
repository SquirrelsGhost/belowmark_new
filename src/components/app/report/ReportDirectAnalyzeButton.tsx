// Triggers 1-click server-side download & analysis of the official court PDF without manual file upload
"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Button from "@/components/ui/Button";
import type { ApiResponse } from "@/lib/api";
import { REPORT_API, REPORT_UPLOAD } from "@/lib/report/reportConfig";
import { OfficialAttachment } from "@/types/listing.types";

interface ReportDirectAnalyzeButtonProps {
  listingId: string;
  attachments: OfficialAttachment[];
  title: string;
  lead: string;
  pendingLabel: string;
  errors: Record<string, string>;
  locale?: "de" | "tr";
}

const WRAP_CLASSES =
  "flex flex-col gap-2.5 border border-ink/80 bg-paper-warm/45 p-4";

export default function ReportDirectAnalyzeButton({
  listingId,
  attachments,
  title,
  lead,
  pendingLabel,
  errors,
  locale,
}: ReportDirectAnalyzeButtonProps) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, startTransition] = useTransition();
  const isBusy = activeId !== null || isRefreshing;
  const isTr = locale ? locale === "tr" : /okunuyor|lütfen|rapor|dosya|analiz/i.test(`${title} ${pendingLabel} ${errors.file ?? ""}`);

  const analyzable = attachments.filter((a) => a.kind === "report" || a.kind === "expose" || a.kind === "announcement");
  if (analyzable.length === 0) return null;

  async function handleAnalyze(att: OfficialAttachment) {
    setError(null);
    setActiveId(att.id);
    try {
      const form = new FormData();
      form.set(REPORT_UPLOAD.fieldListing, listingId);
      form.set("sourceFileId", att.id);
      form.set("sourceDoc", att.kind);

      const response = await fetch(REPORT_API, { method: "POST", body: form });
      const result = (await response.json()) as ApiResponse<unknown>;
      if (!result.success) {
        setError(errors[result.error] ?? errors.internal);
        return;
      }
      startTransition(() => router.refresh());
    } catch {
      setError(errors.internal);
    } finally {
      setActiveId(null);
    }
  }

  return (
    <div className={WRAP_CLASSES}>
      <p className="font-narrow text-xs font-bold tracking-[0.14em] text-ink uppercase">{title}</p>
      <p className="text-xs leading-relaxed text-ink-soft">{lead}</p>
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        {analyzable.map((att) => (
          <Button
            key={att.id}
            type="button"
            variant={att.kind === "report" || att.kind === "expose" ? "ink" : "paper"}
            size="sm"
            disabled={isBusy}
            onClick={() => handleAnalyze(att)}
            label={
              activeId === att.id
                ? pendingLabel
                : isTr
                  ? `⚡ ${att.label} doğrudan analiz et`
                  : `⚡ ${att.label} direkt auswerten`
            }
          />
        ))}
      </div>
      {error && (
        <p role="status" aria-live="polite" className="text-xs text-signal">
          {error}
        </p>
      )}
    </div>
  );
}
