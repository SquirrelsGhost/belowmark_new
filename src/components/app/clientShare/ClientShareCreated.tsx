// Puts this browser's origin in front of the path and offers copy, view and PDF
"use client";

import { useSyncExternalStore } from "react";
import CopyButton from "@/components/app/listing/CopyButton";
import { TEXT_LINK_CLASSES } from "@/lib/appStyles";
import { IClientShareTranslation } from "@/translations/clientShare/IClientShareTranslation";

interface ClientShareCreatedProps {
  path: string;
  printPath: string;
  labels: IClientShareTranslation["Created"];
  /** Shown above the address instead of the default title (e.g. after a renewal) */
  title?: string;
}

const noop = () => () => {};

/** The new link, shown exactly once: the server keeps only its hash. */
export default function ClientShareCreated({ path, printPath, labels, title }: ClientShareCreatedProps) {
  const origin = useSyncExternalStore(noop, () => window.location.origin, () => "");
  const url = `${origin}${path}`;
  return (
    <div role="status" className="flex flex-col gap-3 border-2 border-verdict bg-paper-bright p-5">
      <p className="font-narrow text-sm font-bold tracking-[0.1em] text-verdict uppercase">{title ?? labels.Title}</p>
      <p className="font-mono text-[13px] break-all select-all">{url}</p>
      <div className="flex flex-wrap items-center gap-4">
        <CopyButton text={url} label={labels.Copy} copiedLabel={labels.Copied} />
        <a href={path} target="_blank" rel="noopener" className={TEXT_LINK_CLASSES}>
          {labels.Open} ↗
        </a>
        <a href={printPath} target="_blank" rel="noopener" className={TEXT_LINK_CLASSES}>
          {labels.Pdf} ↗
        </a>
      </div>
      <p className="max-w-2xl text-[12px] leading-snug text-muted">{labels.Once}</p>
    </div>
  );
}
