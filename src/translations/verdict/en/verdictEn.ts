import { IVerdictTranslation } from "../IVerdictTranslation";

export const VERDICT_EN: IVerdictTranslation = {
  Section: {
    Eyebrow: "Verdict",
    Title: "Bid or walk away?",
    Lead: "A verdict derived from the official notice, your valuation report, statutory rules, and your own numbers. It only says “bid” once nothing material remains open — and cites the source for every single reason.",
    Disclaimer: "Investment pointer based on your inputs, not legal or investment advice. The land register, valuation report, and announcements made by the court at the hearing are authoritative.",
  },
  Locked: {
    Title: "Verdict in the Investor plan",
    Body: "The Verdict combines the risk check, valuation report, and bid limit into a clear recommendation per property. Available in the Investor plan.",
  },

  States: {
    go: { Stamp: "Bid", Headline: "Bid up to {amount}", Sub: "Based on your figures and the available sources. Do not bid above this ceiling." },
    open: { Stamp: "Not ready to bid", Headline: "Provisional limit {amount}", Sub: "This limit is subject to open items. It only becomes a firm verdict once the points below are resolved." },
    stop: { Stamp: "Do not bid", Headline: "Do not bid", Sub: "At least one documented reason clearly speaks against bidding — see below." },
    none: { Stamp: "No verdict", Headline: "No verdict possible", Sub: "This proceeding cannot be evaluated at present." },
  },
  GoUnverified: "Note: your renovation budget has neither been verified on site nor backed by a contractor quote. Your limit is only as reliable as that figure.",
  OpenNoLimit: { Headline: "No limit yet", Sub: "Without your target criteria in the bid limit calculator, there is no upper ceiling. The list below shows what is still missing." },
  Groups: {
    none: "Why no verdict is possible",
    stop: "Why not to bid",
    gap: "Before you bid",
    caution: "Keep in mind",
    ok: "What speaks in favour",
  },

  Reasons: {
    noValue: "The official notice does not state a market value. Without it, neither statutory thresholds nor costs can be calculated.",
    cancelled: "According to the portal, the hearing has been cancelled.",
    past: "The hearing date is in the past.",
    unreachable: "Your targets cannot be met at any bid — not even at 0. Running costs and rent do not cover them.",
    belowStart: "Your limit of {amount} is below the minimum bid of {other}. A bid that low is not permitted.",
    belowHalf: "Your limit including surviving rights ({amount}) is below 5/10 of the market value ({other}). At the first hearing, an award below this threshold must be refused ex officio — re-evaluate at a subsequent hearing.",
    rightStays: "{risk} per source. It may survive the award and deprive you of use or value. Only bid once the court has confirmed whether it is extinguished and its value is entered under “Surviving rights” in the bid limit (enter 0 if extinguished).",
    noTargets: "No target criterion (yield, cashflow, or resale value) has been entered in the bid limit calculator yet. Without a target, there is no ceiling.",
    noReport: "No valuation report uploaded. Rights, defects, and contamination are therefore only known from the official notice — which usually says nothing about them.",
    noRenovation: "No renovation budget entered. Enter your estimate — or 0 if no work is needed.",
    noClearance: "Tenants or occupants possible, but no eviction or transition costs entered (enter 0 if none).",
    askInspection: "State whether you have inspected the property.",
    askOccupancy: "State who occupies the property — as far as you know.",
    askRights: "State whether you have inquired with the court about surviving rights.",
    rightsOpen: "You have not verified the surviving rights yet. Anything that survives the award must be paid or assumed on top of your cash bid.",
    askCostBasis: "State what your renovation and clearance cost figures are based on.",
    costsIncomplete: "A statutory cost item cannot be calculated from the official notice — total costs are incomplete.",
    contamination: "Contamination stated in the valuation report. Only a specialist survey can quantify remediation costs. Do not bid until your budget is backed by a quote.",
    rightPriced: "{risk} per source — clarified with the court and priced into the bid limit at {amount}.",
    notInside: "You have not been inside the property. Your renovation budget is therefore unverified — the stress test below shows how cost overruns affect your limit.",
    reportOutsideOnly: "The court appraiser was also unable to inspect the interior (in full).",
    estimateOnly: "Your renovation costs are your own estimate, not a contractor quote.",
    defects: "The valuation report mentions defects or damage. Verify whether your renovation budget covers them.",
    tenant: "The property is (likely) tenanted. Leases transfer to the buyer — calculate with the actual rent, not a target rent.",
    heritage: "Heritage protection per source. Alterations and renovations require heritage authority approval and often cost more.",
    easement: "The valuation report mentions easements or public building charges (e.g. right of way). They often survive the award.",
    contaminationUnclear: "The valuation report leaves open whether contamination is present.",
    oldValuation: "The valuation date is {years} years before the hearing. Market conditions and property state may have changed since.",
    valueMismatch: "The valuation report states {amount}, the official notice {other}. Clarify with the court which figure applies.",
    sevenTenths: "Your limit including surviving rights ({amount}) is below 7/10 ({other}). An entitled creditor can request refusal of the award at the first hearing.",
    atCeiling: "The limit hits the calculation cap (three times the market value). Your target assumptions are likely too generous.",
    conflicting: "Sources contradict each other regarding “{risk}”.",
    limitBy: "Your target “{criterion}” supports a bid up to {amount}.",
    legalClear: "The limit exceeds the statutory minimum thresholds for this hearing.",
    limitsWaived: "Statutory value thresholds no longer apply in this proceeding.",
    rightsClear: "Right of residence, usufruct, and heritable building right are ruled out per source.",
  },
  MarketReasons: {
    belowStart: {
      DE: "Your limit of {amount} is below the minimum bid of {other}.",
      TR: "Your limit of {amount} is below the starting bid of {other} (50% of appraised value). No bid that low is accepted in any round.",
    },
    rightStays: {
      DE: "{risk} per source. It may survive the award and deprive you of use or value. Only bid once the court has confirmed whether it is extinguished and its value is entered under “Surviving rights” in the bid limit (enter 0 if extinguished).",
      TR: "{risk} per source. Whether the right survives the auction depends on the Tapu record and the Satış şartnamesi. Only bid once you have verified this and factored it into your numbers.",
    },
    askRights: {
      DE: "State whether you have inquired with the court about surviving rights.",
      TR: "State whether you have checked the Tapu record and Satış şartnamesi for encumbrances.",
    },
    rightsOpen: {
      DE: "You have not yet asked the court about surviving rights. Anything that survives the award is assumed on top of your bid.",
      TR: "You have not yet checked the Tapu record and Satış şartnamesi. Encumbrances that survive the auction remain your responsibility.",
    },
    tenant: {
      DE: "The property is (likely) tenanted. Leases transfer to the buyer — calculate with the actual rent, not a target rent.",
      TR: "The property is (likely) occupied or tenanted. Eviction can take time and a separate proceeding — factor this in.",
    },
  },
  Actions: {
    limit: "Enter in bid limit",
    report: "Upload report",
    questions: "Answer below",
  },

  Sources: {
    Label: "Source",
    notice: "Official notice",
    report: "Report p. {page}",
    input: "Your figures",
    answer: "Your answer",
    rule: "belowmark rule",
  },

  Questions: {
    Title: "What only you can know",
    Lead: "No document tells you what the inside looks like today or who lives there. Your answers feed directly into the verdict — without an answer, the item stays open.",
    Items: {
      inspection: {
        Label: "Have you inspected the property?",
        Hint: "Interior viewings are often not possible in foreclosure auctions.",
        Options: { inside: "Yes, inside", outside: "Outside only", none: "Not at all" },
      },
      rights: {
        Label: "Asked the court about surviving rights?",
        Hint: "The judicial officer (Rechtspfleger) can tell you the minimum bid and any surviving rights ahead of the hearing upon inquiry.",
        Options: { confirmed: "Yes, clarified", open: "Not yet" },
      },
      occupancy: {
        Label: "Who occupies the property?",
        Hint: "From the valuation report, neighbours, or the creditor — as far as known.",
        Options: { vacant: "Vacant", owner: "Owner", tenant: "Tenant", unknown: "Do not know" },
      },
      costBasis: {
        Label: "What are your renovation and clearance costs based on?",
        Hint: "Only relevant if you have entered costs.",
        Options: { quote: "Quote / specialist", estimate: "Own estimate" },
      },
    },
    Rights: {
      DE: { Label: "Asked the court about surviving rights?", Hint: "The judicial officer (Rechtspfleger) can tell you the minimum bid and any surviving rights ahead of the hearing upon inquiry." },
      TR: { Label: "Checked Tapu record and Satış şartnamesi for encumbrances?", Hint: "Annotations (şerhler), usufruct (intifa), and residence rights (sükna hakkı) are listed in the Tapu extract and the Satış şartnamesi on e-Satış." },
    },
    Unanswered: "open",
    Reset: "Clear answers",
    StorageHint: "Your answers are stored only in this browser.",
  },

  Stress: {
    Title: "Stress test",
    Lead: "Illustrative calculation, not an estimate: what would your bid limit be if renovation and clearance turn out more expensive than entered?",
    Row: "+{pct}% costs: {limit}",
    Unreachable: "no bid makes sense",
    BelowThreshold: "below statutory threshold",
    NoLimit: "cannot be calculated",
  },

  Unknowables: {
    Title: "What belowmark cannot know",
    Items: [
      "The current interior condition — photos and reports only show what the appraiser was allowed to see.",
      "The true renovation costs — that requires a qualified specialist on site.",
      "Whether occupants move out voluntarily and how long an eviction will take.",
      "How many others will bid at the hearing and how high they will go.",
      "Whether the hearing will be cancelled at short notice — check again the day before.",
    ],
  },

  File: {
    Title: "Verdict",
  },
};
