import AccountPanel from "@/components/account/AccountPanel";
import InvoiceListItem from "@/components/account/InvoiceListItem";
import { INVOICE_LIST_GRID } from "@/lib/invoice/invoiceConfig";
import { invoiceCount, InvoiceListView } from "@/lib/invoice/invoiceView";
import { IAccountTranslation } from "@/translations/account/IAccountTranslation";

interface InvoiceListPanelProps {
  t: IAccountTranslation["Invoices"];
  invoices: InvoiceListView[];
}

/** Every invoice of the account, newest first, each as a PDF. */
export default function InvoiceListPanel({ t, invoices }: InvoiceListPanelProps) {
  return (
    <AccountPanel id="rechnungen" title={t.Title} description={t.Description}>
      {invoices.length === 0 ? (
        <p className="border border-dashed border-rule-strong/40 px-4 py-6 text-sm leading-relaxed text-muted">{t.Empty}</p>
      ) : (
        <>
          <div className={`hidden gap-x-4 border-b border-rule-strong pb-2 font-mono text-[10px] tracking-[0.14em] text-muted uppercase sm:grid ${INVOICE_LIST_GRID}`}>
            <span>{t.Columns.Number}</span>
            <span>{t.Columns.Service}</span>
            <span className="text-right">{t.Columns.Amount}</span>
            <span>{t.Columns.Document}</span>
          </div>
          <ol aria-label={invoiceCount(invoices.length, t)}>
            {invoices.map((invoice) => (
              <InvoiceListItem key={invoice.id} invoice={invoice} downloadLabel={t.Download} viewLabel={t.View} />
            ))}
          </ol>
          <p className="mt-4 max-w-lg text-xs leading-relaxed text-muted">{t.Note}</p>
        </>
      )}
    </AccountPanel>
  );
}
