import InvoiceDownloadLink from "@/components/account/InvoiceDownloadLink";
import { INVOICE_LIST_GRID } from "@/lib/invoice/invoiceConfig";
import { InvoiceListView } from "@/lib/invoice/invoiceView";

interface InvoiceListItemProps {
  invoice: InvoiceListView;
  downloadLabel: string;
  viewLabel: string;
}

const STATUS = "border px-1.5 py-0.5 font-mono text-[10px] tracking-[0.14em] uppercase";

/** One invoice as a ledger line: number and date, service and period, amount, PDF. */
export default function InvoiceListItem({ invoice, downloadLabel, viewLabel }: InvoiceListItemProps) {
  return (
    <li className={`grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-3 border-b border-rule py-4 sm:items-center ${INVOICE_LIST_GRID}`}>
      <div className="grid gap-1">
        <span className="font-mono text-sm font-medium text-ink">{invoice.number}</span>
        <span className="font-mono text-xs text-muted">{invoice.date}</span>
      </div>
      <div className="order-3 col-span-2 grid gap-1 sm:order-none sm:col-span-1">
        <span className="font-narrow text-base leading-tight font-semibold">{invoice.service}</span>
        <span className="font-mono text-[11px] text-muted">{invoice.period}</span>
      </div>
      <div className="grid justify-items-end gap-1.5">
        <span className="font-mono text-sm font-medium">{invoice.amount}</span>
        <span className={`${STATUS} ${invoice.isTest ? "border-caution text-caution" : "border-verdict text-verdict"}`}>{invoice.status}</span>
      </div>
      <div className="order-4 col-span-2 flex items-center gap-4 sm:order-none sm:col-span-1">
        <InvoiceDownloadLink href={invoice.downloadHref} label={downloadLabel} ariaLabel={invoice.downloadLabel} />
        <a
          href={invoice.viewHref}
          target="_blank"
          rel="noopener"
          className="font-mono text-[11px] tracking-[0.1em] text-ink-soft uppercase underline-offset-4 hover:text-ink hover:underline"
        >
          {viewLabel}
        </a>
      </div>
    </li>
  );
}
