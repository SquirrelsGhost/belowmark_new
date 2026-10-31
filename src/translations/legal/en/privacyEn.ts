import { filled, LEGAL_OPERATOR, operatorAddress } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export const PRIVACY_EN: LegalDocument = {
  title: "Privacy Policy",
  asOf: "As of October 31, 2026",
  basis: "Information pursuant to Articles 13 and 14 of the EU General Data Protection Regulation (GDPR).",
  sections: [
    {
      id: "verantwortlicher",
      heading: "1. Controller",
      paragraphs: [
        `${operatorAddress()}. E-Mail ${LEGAL_OPERATOR.email}, Phone ${LEGAL_OPERATOR.phone}. We have not appointed a Data Protection Officer because there is no statutory requirement to do so.`,
      ],
    },
    {
      id: "aufruf",
      heading: "2. Visiting the Website",
      paragraphs: [
        "When you access any page, the server processes technically necessary data: IP address, timestamp, requested URL, user-agent header, and server status code. The legal basis is Art. 6 (1) (f) GDPR; our legitimate interest lies in secure and trouble-free operation.",
        `The application itself does not write access logs. Logs may be generated at the hosting provider: ${filled(LEGAL_OPERATOR.hosting, "Insert hosting provider, server location, and log retention period")}.`,
      ],
    },
    {
      id: "konto",
      heading: "3. Account and Authentication",
      paragraphs: [
        "For an account we store: email address, a cryptographic password hash (scrypt, never plaintext), selected market and language, email verification timestamp, trial end date, booked plan and term, and last sign-in timestamp. The legal basis is Art. 6 (1) (b) GDPR (performance of a contract).",
        "For each sign-in we maintain a server session containing a hash of the browser user-agent, a truncated IP address, and the expiration timestamp. This enables us to detect stolen session cookies and sign out all devices. The legal basis is Art. 6 (1) (f) GDPR (account security). Sessions expire automatically.",
        "During registration and sign-in, your browser computes a hardware fingerprint hash from technical attributes (graphics adapter, screen, CPU cores, timezone) and stores it in local storage (\"ec_hw_id\"). It is used exclusively to recognize banned devices and protect accounts against automated attacks (Section 25 (2) No. 2 TDDDG, Art. 6 (1) (f) GDPR).",
        "We check new passwords against known data breaches (Have I Been Pwned). Only the first five characters of a SHA-1 hash are transmitted, never the password itself (k-anonymity). The legal basis is Art. 6 (1) (f) GDPR.",
        "To prevent abuse, we count requests per IP address and email address over short time windows (minutes to hours).",
      ],
    },
    {
      id: "app",
      heading: "4. Content You Create in Your Account",
      paragraphs: [
        "Saved watchlists with notes and saved searches (alerts) are stored in our database. For alerts, we send emails as long as the alert is active. Uploaded appraisal PDFs are analyzed; we store the extracted analysis result (filename, matched excerpts with page numbers), not the PDF file itself. The legal basis is Art. 6 (1) (b) GDPR.",
        "If extended appraisal analysis is enabled, the text of the uploaded appraisal is transmitted to our AI processor for structured extraction (under EU Standard Contractual Clauses pursuant to Art. 46 (2) (c) GDPR).",
        "Due-diligence checklists, bid limit inputs, personal verdict notes, comparable values, and the bank dossier are stored exclusively in your browser's local storage (\"belowmark:…\"). This data never reaches our server.",
      ],
    },
    {
      id: "zahlung",
      heading: "5. Booking and Payment",
      paragraphs: [
        "When you place an order, we store the order record: plan, price, market, version of the Terms, timestamp of your consent to immediate performance, and payment status. The legal basis is Art. 6 (1) (b) GDPR, and Art. 6 (1) (c) GDPR for statutory retention.",
        "Payment is processed on the checkout page of Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Dublin 2, Ireland. We transmit your email address and order details to Stripe; you enter payment details directly with Stripe and they never reach us. From Stripe we receive a customer ID, payment status, and invoice. Stripe also processes data as an independent controller (e.g. for fraud prevention and statutory compliance; see stripe.com/privacy). Where data is transferred to affiliated entities in the US, this is based on the EU-US Data Privacy Framework and EU Standard Contractual Clauses.",
        "Stripe's checkout page is hosted on a Stripe domain. We do not embed third-party Stripe scripts on belowmark.com itself.",
        "Invoices and accounting records are retained for the periods required by commercial and tax law (Section 147 AO, Section 257 HGB).",
      ],
    },
    {
      id: "erklaerungen",
      heading: "6. Cancellation and Withdrawal Declarations",
      paragraphs: [
        "Declarations submitted via \"Cancel contracts here\" and \"Withdraw from contract\" are stored with name, email address, contract reference, statement content, and date and time of receipt, and we send a confirmation by email. We retain them for three years from the end of the calendar year of receipt to document compliance (Art. 6 (1) (c) and (f) GDPR).",
      ],
    },
    {
      id: "mail",
      heading: "7. Transactional Emails",
      paragraphs: [
        `We only send emails required for the contract: verification links, password reset links, booking and cancellation confirmations, and alerts you explicitly created. No advertising, no newsletters, no open or click tracking. Dispatched via ${filled(LEGAL_OPERATOR.mailProvider, "Insert SMTP provider")}.`,
      ],
    },
    {
      id: "cookies",
      heading: "8. Cookies and Local Storage",
      paragraphs: [
        "We do not set analytics, advertising, or tracking cookies and do not embed any such third-party services. Therefore, no cookie consent banner is required.",
        "Session cookie (\"__Host-bm_session\"): maintains your signed-in state; strictly necessary for the requested service (Section 25 (2) No. 2 TDDDG). It expires when you close the browser or, if \"Stay signed in\" is selected, after 30 days.",
        "\"BELOWMARK_COUNTRY\" and \"BELOWMARK_MARKET\" (one year each): remember your selected country/language and market so language and pricing match (Section 25 (2) No. 2 TDDDG).",
        "Web fonts are self-hosted on our own server, not loaded from Google.",
      ],
    },
    {
      id: "karten",
      heading: "9. Maps and Aerial Imagery",
      paragraphs: [
        "On property detail pages, your browser loads map tiles directly from basemap.de (Federal Agency for Cartography and Geodesy, Germany), or OpenStreetMap (OpenStreetMap Foundation, UK), as well as aerial imagery from Esri (server.arcgisonline.com, USA). These providers receive your IP address and the requested tile coordinates. The legal basis is Art. 6 (1) (f) GDPR (visualizing property location).",
        "Links to Google Maps, official court portals, and listing portals open external pages only when you click on them; the privacy policies of the respective operators apply there.",
      ],
    },
    {
      id: "dauer",
      heading: "10. Retention and Deletion",
      paragraphs: [
        "We store account data until you delete your account. In your account under \"Your data\", you can download all stored data as JSON and delete your account yourself. Upon deletion, we immediately remove your account, sessions, watchlist, alerts, and appraisal analyses. Order records and statutory declarations remain without personal account linkage for as long as statutory retention periods require.",
        "One-time tokens (email verification, password reset) are deleted upon use and expire after 24 hours or 1 hour respectively.",
      ],
    },
    {
      id: "rechte",
      heading: "11. Your Rights",
      paragraphs: [
        "You have the right of access (Art. 15), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20), and the right to object to processing based on legitimate interests (Art. 21 GDPR). Contact us at the address above, or trigger export and deletion directly in your account.",
        `You have the right to lodge a complaint with a data protection supervisory authority, in particular the authority responsible for us: ${LEGAL_OPERATOR.supervisoryAuthority}.`,
        "Automated decision-making or profiling within the meaning of Art. 22 GDPR does not take place.",
      ],
    },
  ],
};
