import { IAccountTranslation } from "../IAccountTranslation";

export const ACCOUNT_EN: IAccountTranslation = {
  Nav: {
    Label: "Account sections",
    Sections: {
      uebersicht: { Title: "Overview", Hint: "Details and status" },
      tarif: { Title: "Plan & invoices", Hint: "Term, PDF, address" },
      sicherheit: { Title: "Security", Hint: "Password, devices" },
      daten: { Title: "Your data", Hint: "Export, delete" },
    },
  },

  Overview: {
    Title: "At a glance",
    Description: "Your account status. Details are available in the sections on the left.",
    Plan: "Plan",
    PlanCta: "Plan & invoices",
    LatestInvoice: "Latest invoice",
    NoInvoice: "No invoices yet.",
    AllInvoices: "All invoices",
    Research: "Research",
    ResearchBody: "Notices, map, watchlist, and bid calculator.",
    ResearchCta: "Go to research",
  },

  Portal: {
    Label: "Payment methods via Stripe",
    Hint: "Opens the Stripe customer portal to change your card or manage your subscription. Your invoices are listed right below.",
    Unavailable: "You can manage payment methods via Stripe as soon as you have completed your first Stripe payment.",
  },

  Invoices: {
    Title: "Invoices",
    Description: "Every payment receives its own sequentially numbered invoice. Available as a PDF anytime, as often as you need.",
    Empty: "No invoices yet. Your invoice will appear here as soon as a payment is confirmed.",
    Count: "{count} invoices",
    CountOne: "1 invoice",
    Columns: { Number: "Number · Date", Service: "Service", Amount: "Amount", Document: "Document" },
    Paid: "Paid",
    Test: "Test",
    Upgrade: "Upgrade",
    Renewal: "Renewal",
    Download: "PDF",
    View: "View",
    DownloadLabel: "Download invoice {number} as PDF",
    Note: "Please keep invoices for your records. After account deletion, we retain them solely for tax and accounting compliance.",
  },

  Address: {
    Title: "Billing address",
    Description: "Appears on your invoices. For amounts up to €250, your email address is sufficient; above that and for your accounting, a name and postal address are required.",
    Missing: "No billing address saved yet. Previous invoices without an address will adopt it once as soon as you save it.",
    Empty: "No billing address saved yet.",
    Add: "Add address",
    Name: "Name or company",
    NameHint: "Exactly as it should appear on the invoice.",
    Address: "Postal address",
    AddressHint: "Street and number, postal code and city, country — one entry per line.",
    VatId: "VAT ID",
    VatIdHint: "For businesses only, e.g. DE123456789.",
    Optional: "optional",
    Edit: "Edit",
    Cancel: "Cancel",
    Submit: "Save address",
    Pending: "Saving …",
    Saved: "Saved. Future invoices will carry this address.",
    ErrorTitle: "Please check your details",
    Errors: {
      name_required: "Please enter a name.",
      address_required: "Please enter a postal address.",
      too_long: "One of the entries is too long.",
      rate_limited: "Too many attempts. Please wait a moment.",
      unknown: "Something went wrong. Please try again.",
    },
  },
};
