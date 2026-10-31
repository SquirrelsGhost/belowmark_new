import { IBankFileTranslation } from "../IBankFileTranslation";

export const BANK_FILE_EN: IBankFileTranslation = {
  MetaTags: {
    BankFile: {
      title: "Bank Dossier — Belowmark",
      description: "Financing request for an auction property: amount, equity, statutory post-award payment schedule, and security deposit — every figure backed by its source.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Bank dossier", "Financing", "Foreclosure auction"],
      url: "https://belowmark.com/app",
    },
  },

  Teaser: {
    Eyebrow: "Financing",
    Title: "Bank Dossier",
    Lead: {
      DE: "You need the security deposit at the hearing and the balance by the distribution date. This dossier presents everything to the bank at once: amount, equity, statutory payment schedule, and what the bank needs to provide for the security deposit. It does not replace a loan commitment — only the bank can issue that.",
      TR: "You pay the teminat before bidding and the remaining balance within 7 days after the auction protocol. This dossier presents everything to the bank at once: amount, equity, and statutory payment schedule. It does not replace a loan commitment — only the bank can issue that.",
    },
    Button: "Open bank dossier",
    ButtonHint: "Opens the dossier in a new tab. Enter your planned bid, equity, and security deposit method, then save it as a PDF.",
  },

  File: {
    Kicker: "Financing Request · Foreclosure Auction",
    Title: "Bank Dossier",
    PrintedAt: "Created on {date}",
    DataAsOf: "Notice data as of {date}",
    Print: "Print / save as PDF",
    PrintHint: "Select “Save as PDF” in the print dialog.",
    Back: "Back to case file",
    Locked: "The Bank Dossier is part of the Investor plan",
    NoValue: "not specified",
    Sections: {
      ask: "Request to the bank",
      request: "Financing requirement",
      schedule: "Payment schedule from hearing date",
      deposit: "Security deposit — what the bank must do",
      collateral: "Collateral for the bank — when it arises",
      object: "Property and appraised value",
      risks: "Rights and risks",
      limit: "Derivation of maximum bid",
      documents: "Documents for the bank",
      notThis: "What this dossier is not",
      sources: "Sources",
    },
  },

  Form: {
    Title: "Your details for the dossier",
    Lead: "Everything starts blank. Equity, interest rate, and repayment are shared with the bid limit calculator — any change here applies there as well.",
    StorageHint: "Saved only in this browser. These form inputs are not printed, only the resulting summary.",
    Fields: {
      plannedBid: { label: "Planned maximum bid", hint: "Leave empty to adopt your calculated bid limit." },
      equity: { label: "Equity", hint: "What you contribute yourself, including the security deposit." },
      interestPct: { label: "Assumed interest rate", hint: "Your assumption. The bank quotes the actual rate." },
      repaymentPct: { label: "Initial repayment", hint: "Per year, as a percentage of the loan." },
      fixedYears: { label: "Desired fixed-rate period", hint: "" },
    },
    Applicant: { label: "Applicant (optional)", hint: "Appears in the request. Stays in this browser.", placeholder: "First and last name" },
    Method: { label: "Security deposit via", empty: "undecided" },
    Methods: {
      cheque: "Bundesbank / certified bank cheque",
      guarantee: "Bank guarantee",
      transfer: "Wire transfer to court treasury",
      portal: "e-Satış portal",
    },
    Use: { label: "Intended use", empty: "undecided" },
    Uses: { own: "Owner-occupied", rent: "Rent out", resale: "Resale" },
    YearsSuffix: "years",
    Reset: "Clear dossier inputs",
  },

  Ask: {
    Salutation: "Dear Sir or Madam,",
    Intro: "I intend to bid on the property {object} in foreclosure proceeding {fileNo} at {court}. Hearing date: {date}. Appraised value per official notice: {value}.",
    Applicant: "Applicant: {name}",
    NoApplicant: "Applicant: ______________________",
    Requests: {
      loan: "Financing of {amount} — total costs of {total} less equity of {equity} (breakdown in section 02).",
      guarantee: "An unlimited, unconditional, directly enforceable bank guarantee of {amount} as security deposit for the hearing (§ 69 (3) ZVG).",
      cheque: "A Bundesbank or certified bank cheque for {amount}, issued no earlier than the third business day before the hearing (§ 69 (2) ZVG).",
      transfer: "A wire transfer of {amount} to the court treasury credited prior to the hearing, including proof of credit (§ 69 (4) ZVG).",
      portal: "Provision of the teminat of {amount} prior to bidding in the e-Satış portal.",
      timing: "A written financing confirmation prior to the hearing, as post-award payments are strictly bound to the statutory deadlines in section 03.",
    },
    MissingBid: "Maximum bid missing — enter it above or calculate your bid limit.",
    MissingEquity: "Equity missing — without it, the required loan amount cannot be stated.",
    MissingMethod: "Security deposit method is still undecided.",
    Closing: "I am gladly available for any questions and to provide the full appraisal report.",
  },

  Request: {
    UsesTitle: "Use of funds",
    SourcesTitle: "Source of funds",
    Bid: "Maximum bid",
    BidFromLimit: "from your bid limit",
    BidOwn: "your entry",
    Total: "Total costs",
    Equity: "Equity",
    Loan: "Loan requirement",
    LoanToValue: "Loan-to-market-value",
    LoanToValueNote: "Appraised value per court — the bank determines its own mortgage lending value.",
    EquityShare: "Equity ratio",
    TermsTitle: "Requested terms",
    Interest: "Assumed interest rate",
    InterestNote: "Your assumption, not an offer",
    Repayment: "Initial repayment",
    MonthlyRate: "Monthly installment at your assumed rate",
    FixedYears: "Fixed-rate period",
    Use: "Intended use",
    Incomplete: "A statutory cost item is missing (e.g. no tax rate in the notice) — total costs are understated.",
    EquityShortForDeposit: "Your equity does not cover the security deposit. The bank must pre-finance it or issue a bank guarantee.",
    Guarantee: "Additionally: bank guarantee for the security deposit",
    GuaranteeBasis: "§ 69 (3) ZVG",
  },

  Schedule: {
    Columns: { when: "When", what: "What", amount: "Amount" },
    Steps: {
      DE: {
        deposit: { when: "At the hearing, immediately after bidding", text: "Security deposit: one tenth of the appraised value if requested by an involved party. Expect it to be required.", basis: "§§ 67, 68 (1) ZVG", law: "zvg68" },
        balance: { when: "Before the distribution hearing (date set by court after award)", text: "Cash bid payable to the court treasury — credited before the hearing, proof required at the hearing. A security deposit wired to the court treasury is credited toward this.", basis: "§ 49 (3), § 107 (3) ZVG", law: "zvg49" },
        bidInterest: { when: "With the cash bid", text: "4% interest on the cash bid from award date until the distribution hearing.", basis: "§ 49 (2) ZVG in conj. with § 246 BGB", law: "zvg49" },
        transferTax: { when: "One month after tax assessment notice", text: "Real estate transfer tax on the bid and any rights remaining on the property.", basis: "§§ 9, 15 GrEStG", law: "grestg" },
        courtFee: { when: "Upon court cost invoice", text: "Court fee for granting the award.", basis: "KV 2214 GKG" },
        registryFee: { when: "After registration", text: "Registration as owner in the land register.", basis: "KV 14110 GNotKG" },
        own: { when: "According to your plan", text: "Renovation, clearance, and other costs.", basis: "Your entry" },
      },
      TR: {
        deposit: { when: "Before bidding", text: "Teminat in the e-Satış portal.", basis: "İİK m.114/7", law: "esatis" },
        balance: { when: "Within 7 days after publication of the auction protocol", text: "Remaining purchase price (bid minus teminat), in cash. No extension.", basis: "İİK m.130", law: "iik" },
        fees: { when: "As requested by the enforcement office, before registration", text: "VAT (KDV), Tapu fee, stamp duty, revolving fund fee (döner sermaye).", basis: "Conditions of sale (şartname)" },
        own: { when: "According to your plan", text: "Renovation, clearance, and other costs.", basis: "Your entry" },
      },
    },
    BalanceGuaranteeNote: "With a bank guarantee, nothing is offset — the full cash bid must be paid.",
    BalanceOpenNote: "Security deposit method undecided — calculated without offset.",
    MissingInterestDays: "Enter days until distribution hearing in the bid limit calculator",
    Unknown: "not calculable",
    Footnote: {
      DE: "Post-award dates are set by the court and tax office. This dossier therefore states the statutory sequence rather than an invented date.",
      TR: "The 7-day deadline runs from the publication of the protocol in the portal, not from the auction day.",
    },
  },

  Deposit: {
    Lead: {
      DE: "Amount: one tenth of the appraised value (§ 68 (1) ZVG). Cash is excluded (§ 69 (1) ZVG). Exactly these three methods are permitted:",
      TR: "The teminat is deposited in the e-Satış portal prior to bidding. Accepted forms are specified in the conditions of sale (şartname) of the notice.",
    },
    Ways: {
      DE: [
        { id: "cheque", title: "Bundesbank or certified bank cheque", text: "Issued by a credit institution licensed in Germany or the Bundesbank, payable domestically, no earlier than the third business day before the hearing. A cheque issued earlier will be rejected.", basis: "§ 69 (2) ZVG", law: "zvg69" },
        { id: "guarantee", title: "Bank guarantee", text: "Unlimited, unconditional, and directly enforceable, issued by such a credit institution, performable domestically. The bank may charge a guarantee commission (Avalprovision).", basis: "§ 69 (3) ZVG", law: "zvg69" },
        { id: "transfer", title: "Wire transfer to the court treasury", text: "The amount must be credited to the court treasury account before the hearing, and proof must be presented at the hearing. Account details and reference are specified by the court.", basis: "§ 69 (4) ZVG", law: "zvg69" },
      ],
      TR: [{ id: "portal", title: "Teminat in the e-Satış portal", text: "To be deposited in the portal prior to bidding, login via e-Devlet. Credited toward the price; forfeited if the buyer fails to pay after the award.", basis: "İİK m.114/7, m.130", law: "esatis" }],
    },
    Chosen: "selected",
  },

  Collateral: {
    Lead: {
      DE: "Banks hesitate with foreclosure auctions mainly for one reason: they disburse funds before their land charge (Grundschuld) is entered in the land register. Here is the statutory sequence:",
      TR: "Banks hesitate with İcra auctions mainly for one reason: funds must be paid within 7 days, whereas the mortgage (ipotek) is registered only after title transfer. Here is the statutory sequence:",
    },
    Items: {
      DE: [
        { text: "Upon the award, you become the legal owner — without a notarial deed and prior to land register entry.", basis: "§ 90 (1) ZVG" },
        { text: "You can grant a land charge (Grundschuld) for the bank after the award. However, it is registered only after the court requests the land registry to register you as owner.", basis: "§ 130 (3) ZVG", law: "zvg130" },
        { text: "The court submits this request only once the distribution plan has been executed and the award is final — i.e., after the distribution hearing.", basis: "§ 130 (1) ZVG", law: "zvg130" },
        { text: "To register you, the land registry requires the tax clearance certificate (Unbedenklichkeitsbescheinigung) from the tax office, which generally presupposes payment of the real estate transfer tax.", basis: "§ 22 GrEStG", law: "grestg" },
        { text: "If you fail to pay the cash bid, the court transfers the claim to the creditors, secures it with compulsory mortgages against your property, and re-auctioning looms.", basis: "§§ 118, 128, 133 ZVG", law: "zvg118" },
        { text: "How the bank bridges the period until registration — e.g. notarizing the land charge immediately after the award and disbursing directly to the court treasury — is decided by the bank.", basis: "Bank's decision" },
      ],
      TR: [
        { text: "The teminat is deposited in the portal before bidding and credited toward the purchase price.", basis: "İİK m.114/7", law: "iik" },
        { text: "You pay the remaining balance in cash within 7 days after the protocol is published in the portal. Extensions have been abolished since the 2021 reform.", basis: "İİK m.130 (Law No. 7343)", law: "iik" },
        { text: "Title registration (tescil) takes place only once the award becomes final. Only afterwards can a mortgage (ipotek) be registered for the bank.", basis: "İİK m.134", law: "iik" },
        { text: "If you fail to pay, the teminat is forfeited. For auctions announced on or after 31 July 2026, the law additionally imposes a fine of 5% of the bid.", basis: "İİK m.114 (7) No. 9 (Law No. 7589)", law: "iik" },
        { text: "Consequence: without pre-approval (ön onay) prior to bidding, the 7-day deadline can hardly be met with bank financing.", basis: "Deadlines İİK m.130, m.134" },
      ],
    },
  },

  Object: {
    ReportTitle: "Key figures from the appraisal report",
    NoReport: "No appraisal report uploaded. Upload it on the case file — the bank will require the full report anyway.",
    ReportFrom: "from “{file}”, verbatim with page number",
    RisksLead: "Risk traffic light from official notice and appraisal report. Grey means no source mentions it.",
    RiskFrom: { notice: "Official notice", report: "Appraisal p. {pages}", none: "no source" },
  },

  Documents: {
    Lead: "What banks typically ask to see. Every bank has its own checklist — ask your advisor.",
    Groups: {
      DE: [
        { title: "On the property", items: ["Complete market value appraisal report (from the court or zvg-portal.de)", "Hearing scheduling order / official notice", "Land register extract (usually attached to the appraisal)", "Cadastral map and living area calculation", "Lease agreements, if rented", "Cost schedule for renovation, if planned"] },
        { title: "On you", items: ["Valid ID card or passport", "Proof of income for recent months", "Tax assessment notices", "Proof of equity", "Bank self-disclosure form", "Schedule of existing loans"] },
      ],
      TR: [
        { title: "On the property", items: ["Auction notice and conditions of sale (şartname)", "Valuation report (kıymet takdir raporu)", "Tapu extract and parcel details (ada / parsel)", "Photos and site plan, if available"] },
        { title: "On you", items: ["ID card (Kimlik) / passport", "Proof of income", "Tax number", "Proof of equity"] },
      ],
    },
  },

  NotThis: {
    Items: [
      { text: "Not a loan commitment or financing offer. Whether and on what terms financing is granted is decided solely by the bank.", basis: "—" },
      { text: "No loan brokerage. Belowmark does not broker loans and does not contact any bank on your behalf.", basis: "§ 34i GewO", law: "gewo34i" },
      { text: "Not a mortgage lending value. The appraised value comes from the court appraisal; the bank performs its own valuation.", basis: "BelWertV" },
      { text: "Not legal advice. Statutory provisions are linked for reference.", basis: "—" },
    ],
  },

  SourceNames: {
    notice: "Official notice",
    document: "Official notice (PDF)",
    zvg: "Forced Sale and Administration Act (ZVG)",
    grestg: "Real Estate Transfer Tax Act (GrEStG)",
    gewo: "Trade Regulation Act § 34i (GewO)",
    iik: "Enforcement and Bankruptcy Law (İİK)",
    esatis: "UYAP e-Satış",
  },
};
