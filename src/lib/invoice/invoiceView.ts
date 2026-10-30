import { BillingInvoice } from "@/db/schema";
import { isOfferId, toBillingCurrency } from "@/lib/billing/billingConfig";
import { formatContractDate, formatPrice } from "@/lib/billing/billingFormat";
import { INVOICE_KINDS, invoicePdfHref } from "@/lib/invoice/invoiceConfig";
import { LocaleOption } from "@/lib/constants";
import { IAccountTranslation } from "@/translations/account/IAccountTranslation";
import { IBillingTranslation } from "@/translations/billing/IBillingTranslation";

/** One line of the invoice list on /konto, already formatted. */
export interface InvoiceListView {
  id: string;
  number: string;
  date: string;
  service: string;
  period: string;
  amount: string;
  status: string;
  isTest: boolean;
  downloadHref: string;
  viewHref: string;
  downloadLabel: string;
}

export function buildInvoiceListView(invoice: BillingInvoice, t: IAccountTranslation["Invoices"], billing: IBillingTranslation, lang: LocaleOption): InvoiceListView {
  const offer = isOfferId(invoice.offer) ? billing.Order.Offers[invoice.offer].Name : invoice.offer;
  return {
    id: invoice.id,
    number: invoice.number,
    date: formatContractDate(invoice.issuedAt, lang),
    service: invoice.kind === INVOICE_KINDS.renewal ? `${offer} · ${t.Renewal}` : invoice.kind === INVOICE_KINDS.upgrade ? `${offer} · ${t.Upgrade}` : offer,
    period: `${formatContractDate(invoice.serviceFrom, lang)} – ${formatContractDate(invoice.serviceTo, lang)}`,
    amount: formatPrice({ amount: invoice.amount, currency: toBillingCurrency(invoice.currency) }, lang),
    status: invoice.isTest ? t.Test : t.Paid,
    isTest: invoice.isTest,
    downloadHref: invoicePdfHref(invoice.id),
    viewHref: invoicePdfHref(invoice.id, true),
    downloadLabel: t.DownloadLabel.replace("{number}", invoice.number),
  };
}

/** "3 Rechnungen" / "1 Rechnung" */
export const invoiceCount = (count: number, t: IAccountTranslation["Invoices"]): string =>
  count === 1 ? t.CountOne : t.Count.replace("{count}", String(count));
