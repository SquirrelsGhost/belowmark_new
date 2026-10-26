import { ReactNode } from "react";
import Link from "next/link";
import { TEXT_LINK_CLASSES } from "@/lib/appStyles";
import { ClientShareStatus } from "@/types/clientShare.types";

interface ShareCardProps {
  object: string;
  fileNo: string;
  /** The broker's own note, if any */
  label: string | null;
  status: ClientShareStatus;
  statusLabel: string;
  meta: string;
  sections: string;
  listingHref: string;
  listingLabel: string;
  /** <ShareActionButton /> elements */
  children: ReactNode;
}

const STATUS_CLASSES: Record<ClientShareStatus, string> = {
  active: "bg-verdict text-paper-bright",
  expired: "bg-paper-deep text-ink-soft",
  revoked: "bg-signal text-paper-bright",
};

/** One client link in the broker's list: object, status, usage and the actions. */
export default function ShareCard({ object, fileNo, label, status, statusLabel, meta, sections, listingHref, listingLabel, children }: ShareCardProps) {
  return (
    <li className="flex flex-col gap-3 border border-rule-strong bg-paper-bright p-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-1.5 py-0.5 font-mono text-[10px] tracking-wide uppercase ${STATUS_CLASSES[status]}`}>{statusLabel}</span>
          <span className="font-mono text-[12px] text-ink-soft">{fileNo}</span>
        </div>
        <p className="font-display text-xl leading-tight">{object}</p>
        {label && <p className="text-sm text-ink-soft">{label}</p>}
        <p className="font-mono text-[11px] text-muted">{meta}</p>
        <p className="text-[12px] text-muted">{sections}</p>
        <Link href={listingHref} className={`${TEXT_LINK_CLASSES} mt-1`}>
          {listingLabel} →
        </Link>
      </div>
      <div className="flex flex-wrap items-start gap-2 sm:justify-end">{children}</div>
    </li>
  );
}
