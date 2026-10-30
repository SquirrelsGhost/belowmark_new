/** German standard VAT rate in basis points (§ 12 Abs. 1 UStG) — used while BILLING_VAT_MODE=inclusive. */
export const VAT_RATE_BP = 1900;

/** Gross limit of a Kleinbetragsrechnung in cent (§ 33 UStDV): above it the recipient's name and address are mandatory. */
export const SMALL_INVOICE_LIMIT_CENT = 25_000;

/** Prefix of the running invoice number: "BM-2026-00001". */
export const INVOICE_NUMBER_PREFIX = "BM";

/** Digits of the running part of the number. */
export const INVOICE_NUMBER_DIGITS = 5;

/** German standard rate does not apply to Türkiye; Turkish KDV on electronic services, in basis points — only used with BILLING_TR_KDV=inclusive. */
export const TR_KDV_RATE_BP = 2000;

/** Stored in billing_invoices.vat_mode for market TR: no German VAT; KDV open or included. */
export const TR_VAT_MODES = { open: "tr_open", kdv: "tr_kdv" } as const;

export const INVOICE_KINDS = { order: "order", renewal: "renewal", upgrade: "upgrade" } as const;
export type InvoiceKind = (typeof INVOICE_KINDS)[keyof typeof INVOICE_KINDS];

/** Where an invoice is downloaded: /konto/rechnungen/<id>/pdf (add ?ansicht=1 to open it in the browser). */
export const invoicePdfHref = (id: string, inline = false): string => `/konto/rechnungen/${id}/pdf${inline ? "?ansicht=1" : ""}`;

/** Query parameter of /konto/rechnungen/<id>/pdf that opens the PDF instead of saving it. */
export const INVOICE_INLINE_PARAM = "ansicht";

/** Limits of the billing address form. */
export const BILLING_PROFILE_LIMITS = { name: 200, address: 600, vatId: 32 } as const;

/** Column grid shared by the head and the lines of the invoice list, so they line up. */
export const INVOICE_LIST_GRID = "sm:grid-cols-[9.5rem_minmax(0,1fr)_6.5rem_9rem]";
