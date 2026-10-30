import { BillingInvoice } from "@/db/schema";
import { BillingOfferId, isOfferId, toBillingCurrency, UPGRADES } from "@/lib/billing/billingConfig";
import { formatContractDate, formatPrice } from "@/lib/billing/billingFormat";
import { INVOICE_KINDS, SMALL_INVOICE_LIMIT_CENT, TR_VAT_MODES } from "@/lib/invoice/invoiceConfig";
import { INVOICE_TEXT } from "@/lib/invoice/invoiceText";
import { LEGAL_OPERATOR } from "@/lib/legal/legalOperator";
import { BILLING_DE } from "@/translations/billing/de/de";

/** A piece of printed text; `gap` marks a missing detail, printed in red as ⟨…⟩. */
export interface InvoiceText {
  text: string;
  gap?: boolean;
}

export interface InvoiceRow {
  label: string;
  value: InvoiceText;
}

/** Everything the PDF prints, already worded — the renderer only lays it out. */
export interface InvoiceDocument {
  number: string;
  isTest: boolean;
  senderLine: string;
  recipient: InvoiceText[];
  facts: InvoiceRow[];
  item: { title: string; detail: string; period: string; amount: string };
  totals: InvoiceRow[];
  total: InvoiceRow;
  vatNote: InvoiceText;
  paidStamp: string;
  paidNote: string;
  footer: { title: string; lines: InvoiceText[] }[];
}

/** Name of the Investor offer an upgrade to this Pro offer starts from. */
function upgradeSource(toOffer: string): string | null {
  const from = (Object.keys(UPGRADES) as BillingOfferId[]).find((id) => UPGRADES[id] === toOffer);
  return from ? BILLING_DE.Order.Offers[from].Name : null;
}

const gap = (label: string): InvoiceText => ({ text: `⟨${label}⟩`, gap: true });
const plain = (text: string): InvoiceText => ({ text });
const LANG = "de";

const money = (invoice: BillingInvoice, cent: number): string =>
  formatPrice({ amount: cent, currency: toBillingCurrency(invoice.currency) }, LANG);

function recipientBlock(invoice: BillingInvoice): InvoiceText[] {
  if (invoice.recipientName && invoice.recipientAddress) {
    const lines = [invoice.recipientName, ...invoice.recipientAddress.split(/\r?\n/)].map((line) => line.trim()).filter(Boolean).map(plain);
    if (invoice.recipientVatId) lines.push(plain(`${INVOICE_TEXT.RecipientVatId} ${invoice.recipientVatId}`));
    return lines;
  }
  // Up to 250 € gross a Kleinbetragsrechnung needs no recipient (§ 33 UStDV); above it the address is mandatory
  const lines = [plain(invoice.recipientEmail)];
  if (invoice.amount > SMALL_INVOICE_LIMIT_CENT) lines.unshift(gap(INVOICE_TEXT.Gaps.Recipient));
  return lines;
}

function vatNote(invoice: BillingInvoice): InvoiceText {
  if (invoice.vatMode === TR_VAT_MODES.kdv) return plain(INVOICE_TEXT.Vat.OutsideDeKdv);
  if (invoice.vatMode === TR_VAT_MODES.open) return plain(INVOICE_TEXT.Vat.OutsideDe);
  // TR invoices issued before the TR rule existed
  if (invoice.market === "TR") return gap(INVOICE_TEXT.Gaps.VatTr);
  if (invoice.vatMode === "kleinunternehmer") return plain(INVOICE_TEXT.Vat.SmallBusiness);
  if (invoice.vatMode === "inclusive") return plain(INVOICE_TEXT.Vat.Inclusive);
  return gap(INVOICE_TEXT.Gaps.VatMode);
}

const rateText = (invoice: BillingInvoice): string => `${(invoice.vatRateBp ?? 0) / 100}`.replace(".", ",");

function totals(invoice: BillingInvoice): InvoiceRow[] {
  if (invoice.vatMode === TR_VAT_MODES.kdv && invoice.netAmount !== null && invoice.vatAmount !== null) {
    return [
      { label: INVOICE_TEXT.Totals.Net, value: plain(money(invoice, invoice.netAmount)) },
      { label: INVOICE_TEXT.Totals.Kdv.replace("{rate}", rateText(invoice)), value: plain(money(invoice, invoice.vatAmount)) },
    ];
  }
  if (invoice.market !== "TR" && invoice.vatMode === "inclusive" && invoice.netAmount !== null && invoice.vatAmount !== null) {
    const rate = rateText(invoice);
    return [
      { label: INVOICE_TEXT.Totals.Net, value: plain(money(invoice, invoice.netAmount)) },
      { label: INVOICE_TEXT.Totals.Vat.replace("{rate}", rate), value: plain(money(invoice, invoice.vatAmount)) },
    ];
  }
  // Kleinunternehmer, TR or VAT mode open: only the total, the note under it says why
  return [];
}

/** Words the frozen invoice row into the printed document (German — the provider sits in Germany). */
export function buildInvoiceDocument(invoice: BillingInvoice): InvoiceDocument {
  const offer = isOfferId(invoice.offer) ? BILLING_DE.Order.Offers[invoice.offer] : null;
  const upgradeFrom = invoice.kind === INVOICE_KINDS.upgrade ? upgradeSource(invoice.offer) : null;
  const period = `${formatContractDate(invoice.serviceFrom, LANG)} – ${formatContractDate(invoice.serviceTo, LANG)}`;
  const paid = formatContractDate(invoice.paidAt, LANG);
  const op = LEGAL_OPERATOR;

  return {
    number: invoice.number,
    isTest: invoice.isTest,
    senderLine: [op.business, op.owner, op.street, op.city].join(" · "),
    recipient: recipientBlock(invoice),
    facts: [
      { label: INVOICE_TEXT.Facts.Date, value: plain(formatContractDate(invoice.issuedAt, LANG)) },
      { label: INVOICE_TEXT.Facts.Period, value: plain(period) },
      { label: INVOICE_TEXT.Facts.Paid, value: plain(paid) },
      { label: INVOICE_TEXT.Facts.Account, value: plain(invoice.recipientEmail) },
    ],
    item: {
      title: upgradeFrom
        ? `${INVOICE_TEXT.ItemPrefix} ${INVOICE_TEXT.UpgradeTitle.replace("{from}", upgradeFrom).replace("{to}", offer?.Name ?? invoice.offer)}`
        : `${INVOICE_TEXT.ItemPrefix} ${offer?.Name ?? invoice.offer}`,
      detail: upgradeFrom
        ? `${INVOICE_TEXT.UpgradeDetail}. ${INVOICE_TEXT.ItemDetail}`
        : offer
          ? `${offer.Summary}. ${INVOICE_TEXT.ItemDetail}`
          : INVOICE_TEXT.ItemDetail,
      period: `${INVOICE_TEXT.Facts.Period}: ${period}`,
      amount: money(invoice, invoice.amount),
    },
    totals: totals(invoice),
    total: { label: INVOICE_TEXT.Totals.Gross, value: plain(money(invoice, invoice.amount)) },
    vatNote: vatNote(invoice),
    paidStamp: `${INVOICE_TEXT.PaidStamp} · ${paid}`,
    paidNote: (invoice.isTest ? INVOICE_TEXT.PaidNoteTest : INVOICE_TEXT.PaidNote).replace("{date}", paid),
    footer: [
      { title: INVOICE_TEXT.Footer.Provider, lines: [plain(op.business), plain(op.owner), plain(op.street), plain(`${op.city}, ${op.country}`)] },
      { title: INVOICE_TEXT.Footer.Contact, lines: [plain(op.email), plain(op.phone), plain(INVOICE_TEXT.Footer.Web)] },
      {
        title: INVOICE_TEXT.Footer.Tax,
        lines: [
          plain(INVOICE_TEXT.Footer.Court.replace("{court}", op.court)),
        ],
      },
    ],
  };
}
