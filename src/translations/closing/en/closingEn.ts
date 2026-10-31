import { IClosingTranslation } from "../IClosingTranslation";
import { CLOSING_TASKS_EN } from "./closingTasksEn";

export const CLOSING_EN: IClosingTranslation = {
  MetaTags: {
    Tasks: {
      title: "After the Award — Belowmark",
      description: "Post-award checklist: payment, transfer tax, land register, eviction, insurance, and renovation — with deadlines and linked statutory provisions.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Award", "Foreclosure auction", "Land register", "Eviction"],
      url: "https://belowmark.com/app",
    },
    Results: {
      title: "Auction Outcomes — Belowmark",
      description: "What foreclosure auctions achieve: winning bids relative to market value, compiled from reported auction outcomes, anonymous from five hearings per group.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Winning bid", "Market value", "Auction outcome", "Foreclosure auction"],
      url: "https://belowmark.com/app/ergebnisse",
    },
  },

  Section: {
    Eyebrow: "After the hearing",
    Title: "Outcome & Award",
    Lead: {
      DE: "Did you attend the hearing? Enter what was bid. The official portal does not publish outcomes — your reports build an anonymous price overview. If you won the award yourself, the checklist guides you all the way to the land register.",
      TR: "Did you follow the auction? Enter what was bid. The portal does not publish public outcomes — your reports build an anonymous price overview. If you won the auction (ihale) yourself, the checklist guides you all the way to the Tapu.",
    },
  },

  Result: {
    Title: "Report hearing outcome",
    Lead: "Numbers only, no names. You can update your report at any time.",
    NotYet: "You can record an outcome starting on the day of the hearing.",
    HearingDate: "Hearing date",
    Outcome: "Outcome",
    Outcomes: {
      awarded: "Award granted",
      refused: "Award refused",
      pending: "Decision adjourned",
      noBids: "No bids",
      cancelled: "Hearing did not take place",
    },
    HighestBid: {
      DE: { label: "Highest bid (cash bid / Bargebot)", hint: "As stated in the minutes or award ruling" },
      TR: { label: "Winning bid (ihale bedeli)", hint: "As stated in the auction outcome protocol" },
    },
    RetainedRights: { label: "Surviving rights", hint: "If stated — they form part of the economic price" },
    BidderCount: { label: "Number of bidders", hint: "If known" },
    Source: "Where do your figures come from?",
    Sources: { attended: "Attended in person", protocol: "Minutes / ruling", court: "Court information" },
    IsBuyer: { DE: "I won the award", TR: "I won the auction (ihale)" },
    AwardDate: {
      DE: { label: "Award pronounced on", hint: "Leave blank = hearing date" },
      TR: { label: "Protocol published on", hint: "The 7-day payment deadline starts from this day" },
    },
    Shared: { label: "Include anonymously in the price overview", hint: "Only a median per region and property type is shown, starting from five hearings — never your individual entry." },
    Privacy: "We store the hearing date, outcome, amounts, and number of bidders for this case number — never the names of bidders, buyers, or owners.",
    Save: "Save outcome",
    Saved: "Saved.",
    SavedBuyer: "Saved. Your post-award checklist is ready.",
    Errors: {
      auth: "Please sign in again.",
      locked: "The post-award checklist is part of the Investor plan.",
      date: "Please enter a valid date (not before the hearing).",
      future: "Outcomes can only be reported from the day of the hearing onwards.",
      outcome: "Please select the outcome.",
      bid: "For an award, please enter the winning bid (whole number).",
      ratio: "The bid does not match the market value — please check.",
      bidders: "Please enter a plausible number of bidders.",
      buyer: "“I won the award” is only possible with the outcome “Award granted”.",
      unknown: "Could not save. Please try again.",
    },
    Ratio: "{pct} of market value",
    StatsLink: "View price overview",
  },

  Teaser: {
    Title: "Your checklist after the award",
    Lead: "Payment, tax, land register, possession, insurance, renovation — calculated with your deadlines.",
    Button: "Open checklist",
    Progress: "{done} of {total} completed",
    Next: "Next: {title} · {date}",
    NoDate: "Enter the award date so the checklist can calculate your deadlines.",
  },

  Tasks: {
    Kicker: "After the award",
    Title: "Post-Award Checklist",
    Lead: {
      DE: "From the award to land register entry and handover. We calculate deadlines strictly from the dates you enter. Every statement cites its statutory provision.",
      TR: "From the ihale to Tapu registration and handover. We calculate deadlines strictly from the dates you enter. Every statement cites its statutory provision.",
    },
    Back: "Back to case sheet",
    Disclaimer:
      "This checklist is for orientation only and does not constitute legal advice. It summarises statutory provisions in simplified form (as of 26.10.2026) and does not account for your individual case. For deadlines, terminations, and eviction, consult the court, a notary, or a lawyer.",
    Locked: {
      Title: "Checklist in the Investor plan",
      Body: "Your outcome has been saved. The post-award checklist with calculated deadlines and reminders is included in the Investor plan.",
      Cta: "Upgrade to Investor",
    },
    Dates: {
      Title: "Your dates",
      Lead: "The checklist calculates deadlines from these dates. Leave blank anything you do not know yet.",
      Fields: {
        DE: {
          awardDate: { label: "Award pronounced on", hint: "Required" },
          distributionDate: { label: "Distribution hearing (Verteilungstermin)", hint: "Stated in the court summons" },
          taxNoticeDate: { label: "Real estate transfer tax notice dated", hint: "Date of notification" },
          handoverDate: { label: "Handover / eviction on", hint: "Planned or completed" },
        },
        TR: {
          awardDate: { label: "Auction protocol published on", hint: "Required — starts the 7-day period" },
          handoverDate: { label: "Handover / eviction on", hint: "Planned or completed" },
        },
      },
      FromPortfolio: "Prefilled from your portfolio — please save.",
      Save: "Save dates",
      Saved: "Saved.",
      Required: "Please enter at least the award date.",
      Errors: {
        auth: "Please sign in again.",
        locked: "The post-award checklist is part of the Investor plan.",
        date: "Please enter at least the award date.",
        unknown: "Could not save. Please try again.",
      },
    },
    Conditions: {
      Title: "Your situation",
      Lead: "Shows only the tasks that apply to your property. Saved in this browser.",
      Items: { tenant: "There are tenants", ownerOccupied: "Former owner still lives there", condo: "Condominium", house: "Single- or two-family house" },
    },
    Phases: { first: "First days", payment: "Payment", register: "Tax & Land Register", possession: "Possession & Tenants", works: "Renovation & Operations" },
    Due: { deadline: "by {date}", earliest: "earliest {date}", on: "from {date}" },
    Missing: "Missing date: {field}",
    States: { done: "Completed", overdue: "Overdue", soon: "Due soon", open: "Open", undated: "No date" },
    Basis: { law: "Statute", practice: "Procedure", rule: "Belowmark rule" },
    Check: "Legal position amended or not finally settled — verify",
    MarkDone: "Done",
    MarkOpen: "Reopen",
    Sources: "Sources",
    Progress: "{done} of {total} completed",
    Items: CLOSING_TASKS_EN,
  },

  Results: {
    Kicker: "Hearing outcomes",
    Title: "What is actually paid",
    Lead: "Reported winning bids relative to market value. Figures are submitted by users, not by the courts — they indicate a general price level, not a valuation for your property.",
    Method: {
      Title: "How we calculate",
      Items: [
        "Ratio = (highest bid + surviving rights) ÷ market value according to the official notice.",
        "If several users report the same hearing, it counts once using the median of the reports.",
        "Figures are only shown from five hearings per group upwards. Below that, we only display the count.",
        "No names and no case numbers appear in the overview. Only you can see your own reports.",
      ],
    },
    Table: { Region: "Region", Segment: "Property type", Awarded: "Awards", Median: "Median", Range: "Middle half (IQR)", Bidders: "Bidders (median)", Reported: "Reported hearings" },
    AllSegments: "All property types",
    Total: "Total",
    OtherRegion: "No region",
    TooFew: "{n} — too few (from {min})",
    Empty: "No reports in your market yet. The overview populates as soon as users enter hearing outcomes on the case sheet under “Outcome & Award”.",
    Locked: "The price overview is part of the Investor plan. You can still submit outcomes.",
    Own: { Title: "Your reports", Lead: "Visible only to you.", Empty: "You have not reported any outcomes yet.", Shared: "in overview", Private: "private", Buyer: "Your award" },
  },
};
