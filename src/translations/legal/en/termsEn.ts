import { LEGAL_OPERATOR, operatorAddress } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export function vatSentenceEn(vatMode: "inclusive" | "kleinunternehmer" | null): string {
  if (vatMode === "kleinunternehmer") {
    return "All prices are final prices. Pursuant to Section 19 of the German VAT Act (UStG), no value added tax is charged.";
  }
  return "All prices are final prices and include applicable statutory value added tax (VAT).";
}

export function termsEn(vatMode: "inclusive" | "kleinunternehmer" | null): LegalDocument {
  return {
    title: "Terms & Conditions (AGB)",
    asOf: "As of October 31, 2026",
    basis: "Governing the use of the Belowmark platform (belowmark.com).",
    sections: [
      {
        id: "geltung",
        heading: "1. Scope and Contracting Parties",
        paragraphs: [
          `These Terms & Conditions apply to all contracts for the use of the Belowmark online service concluded between ${operatorAddress()} (hereinafter "Provider") and the customer.`,
          "A consumer is any natural person who enters into a legal transaction for purposes that predominantly cannot be attributed to their commercial or independent professional activity (Section 13 of the German Civil Code, BGB). Deviating terms of the customer shall apply only if the Provider expressly agrees to them.",
        ],
      },
      {
        id: "leistung",
        heading: "2. Subject Matter of the Service",
        paragraphs: [
          "Belowmark compiles publicly announced information on judicial and public property auctions across Europe (Germany, Austria, Switzerland, Italy, Spain, France, United Kingdom) and Türkiye, structures it, and calculates key metrics (such as statutory bid thresholds, security deposits, and acquisition costs). For the duration of the contract, the customer receives personal access to the web application for the market selected upon registration.",
          "Belowmark is a research and due-diligence reference tool. The service does not constitute legal, tax, real estate, or investment advice and does not contain any recommendation to place a specific bid. Every piece of information must be verified against the official original court or auction records before making any financial decision.",
          "The data originates from third-party sources (judicial and authority portals, official gazettes, and listing portals). The Provider assumes no warranty for the accuracy, completeness, or timeliness of such data; listings may be incomplete. Calculated figures are mathematical results based on this information and do not constitute certified appraisals.",
        ],
      },
      {
        id: "tarife",
        heading: "3. Plans and Pricing",
        paragraphs: [
          "Free Scout: free, unlimited duration with restricted scope (property list visible, appraised values and auction dates locked). No payment details are collected.",
          "Trial Period: Upon verifying their email address, the customer receives the scope of Investor access free of charge for 14 days. The trial period ends automatically and does not convert into a paid subscription.",
          "Investor Monthly: Full individual access for €39.00 / £35 / CHF 39 (European markets) or 599.00 TL (Türkiye market) per month, payable in advance, with automatic monthly renewal unless cancelled.",
          "Investor Three Months: Full individual access for three calendar months for a one-time payment of €99.00 / £89 / CHF 99 (European markets) or 1,490.00 TL (Türkiye market), payable in advance. Does not renew automatically; no cancellation required.",
          "Pro Monthly: Full access including client links with custom letterhead and shared team watchlists (up to 3 teams with up to 5 seats each) for €129.00 / £115 / CHF 129 (European markets) or 1,990.00 TL (Türkiye market) per month, payable in advance, with automatic monthly renewal.",
          "Pro Three Months: Full Pro access for three calendar months for a one-time payment of €329.00 / £295 / CHF 329 (European markets) or 4,990.00 TL (Türkiye market), payable in advance. Does not renew automatically; no cancellation required. Extended enterprise team quotas (from €299.00 per month) are agreed individually upon prior inquiry.",
          vatSentenceEn(vatMode),
        ],
      },
      {
        id: "vertragsschluss",
        heading: "4. Conclusion of Contract",
        paragraphs: [
          "By registering and verifying the email address, a free user contract (Free Scout with trial period) is concluded.",
          "Paid Investor or Pro access is booked in the account via the order summary page, where plan, price, term, and renewal conditions are summarized. By clicking the \"Order with obligation to pay\" button, the customer submits a binding offer and is redirected to the checkout page of the payment provider Stripe. The contract is concluded as soon as Stripe confirms the payment and the Provider activates access; the customer receives confirmation by email.",
          "The Provider stores the contract text (order, plan, price, and current version of these Terms) and sends it to the customer by email together with the order confirmation. The current version of these Terms is always available at belowmark.com/agb.",
        ],
      },
      {
        id: "zahlung",
        heading: "5. Payment and Invoices",
        paragraphs: [
          "Payments are processed via Stripe Payments Europe, Ltd. (Ireland). Payment details are entered exclusively on Stripe's checkout page and are never stored by the Provider.",
          "Monthly subscriptions are charged in advance at the beginning of each billing cycle. Invoices are available in the account under \"Invoices and payment methods\" and are sent by email.",
          "If a charge fails, Stripe will retry collection. If payment remains outstanding, full access ends at the end of the paid period while free account access remains intact.",
        ],
      },
      {
        id: "laufzeit",
        heading: "6. Term and Cancellation",
        paragraphs: [
          "Monthly Investor and Pro subscriptions run for an indefinite period and may be cancelled at any time effective at the end of the already paid month. Full access remains active until that date. No pro-rata refund is granted for the current billing month upon ordinary cancellation.",
          `Cancellation can be completed via the "Cancel contracts here" button located in the footer of every page (accessible without signing in), inside the account settings, via the Stripe customer portal, or in text form sent to ${LEGAL_OPERATOR.email}. Following cancellation via the cancellation button, the customer immediately receives confirmation by email stating the content, date and time of receipt, and the date on which the contract ends.`,
          "Three-month packages end automatically upon expiry of the booked calendar months. The free Free Scout contract can be terminated at any time by deleting the account.",
          "The right to extraordinary termination for good cause remains unaffected for both parties.",
        ],
      },
      {
        id: "widerruf",
        heading: "7. Right of Withdrawal and Expiration for Digital Content (Section 356 (5) BGB)",
        paragraphs: [
          "Belowmark is a digital product that is activated immediately upon receipt of payment. By accepting these Terms & Conditions during the checkout process, the customer expressly agrees that the Provider shall begin performance of the contract (provision and immediate activation of paid digital access) before expiry of the statutory withdrawal period, and confirms their acknowledgment that their statutory right of withdrawal expires immediately upon activation of access (pursuant to Section 356 (5) of the German Civil Code, BGB).",
          "The complete notice on the expiration of the right of withdrawal pursuant to Section 356 (5) BGB is available at belowmark.com/widerruf and is transmitted to the customer by email together with the contract confirmation.",
        ],
      },
      {
        id: "verfuegbarkeit",
        heading: "8. Availability",
        paragraphs: [
          "The Provider strives for continuous availability of the service but does not warrant a specific uptime percentage. Maintenance, third-party disruptions, or outages of official source portals may temporarily restrict access or the timeliness of the dataset.",
        ],
      },
      {
        id: "nutzung",
        heading: "9. Usage Rights, Prohibition of Scraping, and Account Suspension Without Refund",
        paragraphs: [
          "The customer receives a non-exclusive, non-transferable right to use the service during the contract term solely for their own research purposes via a standard web browser. The following are strictly prohibited: (a) sharing login credentials or shared use of an account by multiple individuals outside booked team seats, (b) any systematic, automated, or script-based reading, harvesting, copying, or indexing of data, texts, metrics, or documents (in particular via bots, crawlers, scrapers, headless browsers, or scripts), (c) circumventing technical protection measures, rate limits, or security mechanisms (including triggering honeypot traps), and (d) bulk downloading, reselling, sublicensing, or making the processed data or documents publicly available.",
          "Any violation of the foregoing prohibitions constitutes a material breach of contract and entitles the Provider to immediate extraordinary termination for good cause (Section 314 BGB) as well as immediate, permanent suspension of the user account and device identifier without prior warning.",
          "In the event of such account suspension or extraordinary termination caused by the customer's breach of contract (in particular scraping, automated data extraction, or circumvention of security mechanisms), the right of use terminates with immediate effect. Any claim by the customer for a refund or pro-rata reimbursement of fees already paid for the current billing month or booked multi-month fixed terms is excluded in this case. Further claims for damages and injunctive relief by the Provider remain unaffected.",
        ],
      },
      {
        id: "haftung",
        heading: "10. Liability",
        paragraphs: [
          "The Provider is liable without limitation in cases of intent and gross negligence, for injury to life, body, or health, and under mandatory product liability laws. In cases of slight negligence, the Provider is liable only for the breach of essential contractual obligations (obligations whose fulfillment makes proper performance of the contract possible in the first place and on whose observance the customer may regularly rely), limited to the foreseeable damage typical for this type of contract.",
          "Unless a case covered by the preceding paragraph applies, the Provider shall not be liable for financial decisions made by the customer, in particular for bids placed at auctions and their consequences.",
        ],
      },
      {
        id: "aenderungen",
        heading: "11. Amendments to These Terms and Pricing",
        paragraphs: [
          "The Provider shall notify the customer in text form of any amendments to these Terms or to the price of monthly subscriptions at least six weeks before they take effect. Amendments take effect only if the customer consents; if the customer does not consent, either party may terminate the contract effective as of the date of the amendment.",
        ],
      },
      {
        id: "recht",
        heading: "12. Governing Law and Jurisdiction",
        paragraphs: [
          "German law applies, excluding the UN Convention on Contracts for the International Sale of Goods (CISG). With respect to consumers, this choice of law applies only insofar as it does not deprive the consumer of the protection afforded by mandatory provisions of the law of the state in which the consumer has their habitual residence.",
          `If the customer is a merchant, a legal entity under public law, or a special fund under public law, the exclusive place of jurisdiction is the Provider's registered office (${LEGAL_OPERATOR.court}).`,
        ],
      },
    ],
  };
}
