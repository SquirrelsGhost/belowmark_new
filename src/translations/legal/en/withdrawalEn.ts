import { operatorAddress, LEGAL_OPERATOR } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

const contact = `${operatorAddress()}, E-Mail ${LEGAL_OPERATOR.email}, Phone ${LEGAL_OPERATOR.phone}`;

export const WITHDRAWAL_EN: LegalDocument = {
  title: "Withdrawal Policy & Expiration for Digital Content",
  asOf: "As of October 31, 2026",
  basis: "For consumers in contracts for digital content not supplied on a tangible medium (Sections 312g, 355, 356 (5) German Civil Code, BGB).",
  sections: [
    {
      id: "erloeschen",
      heading: "1. Premature Expiration of the Right of Withdrawal (Section 356 (5) BGB)",
      paragraphs: [
        "In a contract for the supply of digital content not on a tangible medium (activation of full digital access to appraised values, appraisal analyses, statutory bid limits, deadline calculators, and documents on Belowmark), the right of withdrawal expires immediately upon the commencement of performance of the contract if:",
        "1. you have expressly consented to our beginning performance of the contract before the expiry of the withdrawal period,",
        "2. you have confirmed your acknowledgment that by giving your consent you lose your right of withdrawal upon the commencement of performance of the contract, and",
        "3. we have provided you with a confirmation in accordance with Section 312f (2) BGB on a durable medium (by email).",
        "Because you give this consent and confirmation during the checkout process by accepting the Terms & Conditions before clicking \"Order with obligation to pay\", and your full digital access is activated immediately upon payment confirmation, withdrawal is excluded pursuant to Section 356 (5) BGB once digital access has been activated.",
      ],
    },
    {
      id: "recht",
      heading: "2. Statutory Right of Withdrawal (Prior to Commencement of Performance)",
      paragraphs: [
        "If, by way of exception, performance of the contract (activation of digital access) has not yet begun, the following statutory right of withdrawal applies:",
        "You have the right to withdraw from this contract within fourteen days without giving any reason. The withdrawal period is fourteen days from the day of the conclusion of the contract.",
        `To exercise your right of withdrawal, you must inform us (${contact}) of your decision to withdraw from this contract by means of a clear statement (e.g. a letter sent by post or an email). You may use the attached model withdrawal form for this purpose, although it is not mandatory.`,
        "To meet the withdrawal deadline, it is sufficient for you to send your communication concerning the exercise of the right of withdrawal before the withdrawal period has expired and before digital access has been activated.",
      ],
    },
    {
      id: "folgen",
      heading: "3. Effects of Valid Withdrawal (Prior to Activation)",
      paragraphs: [
        "If you validly withdraw from this contract before the right of withdrawal has expired through activation of digital access pursuant to Section 356 (5) BGB, we shall reimburse to you all payments received from you without undue delay and in any event not later than fourteen days from the day on which we are informed about your decision to withdraw from this contract. We will carry out such reimbursement using the same means of payment as you used for the initial transaction.",
      ],
    },
    {
      id: "praxis",
      heading: "4. Cancellation of Active Subscriptions",
      paragraphs: [
        "Independently of the expiration of the right of withdrawal upon immediate activation (Section 356 (5) BGB), you may cancel an active monthly subscription (Investor Monthly or Pro Monthly) at any time effective at the end of the already paid billing month — with one click in your account or via \"Cancel contracts here\" in the footer of every page.",
      ],
    },
    {
      id: "formular",
      heading: "5. Model Withdrawal Form",
      paragraphs: [
        "(Applicable only if the right of withdrawal has not already expired pursuant to Section 356 (5) BGB upon activation of digital access.)",
        `To ${operatorAddress()}, E-Mail ${LEGAL_OPERATOR.email}:`,
        "I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract for the supply of the following digital content (*):",
        "Ordered on (*):",
        "Name of consumer(s):",
        "Address of consumer(s):",
        "Signature of consumer(s) (only if this form is notified on paper):",
        "Date:",
        "(*) Delete as appropriate.",
      ],
    },
  ],
};
