import { IDeadlineTranslation } from "../IDeadlineTranslation";

export const DEADLINE_EN: IDeadlineTranslation = {
  MetaTags: {
    title: "Hearing Companion — Belowmark",
    description: "Every deadline from official notice to award with statutory citations: security deposit, bank cheque date, hearing, teminat. Reminders by email and calendar feed.",
    imgUrl: "https://belowmark.com/og/home.png",
    tags: ["Deadlines", "Foreclosure auction", "Security deposit", "Calendar"],
    url: "https://belowmark.com/app/termine",
  },
  Nav: "Deadlines",

  Section: {
    Eyebrow: "Hearing Companion",
    Title: "Deadlines & Roadmap",
    Lead: {
      DE: "Every deadline up to the award, calculated from the hearing date in the official notice and backed by statutory citations. Follow the proceeding to receive email and calendar reminders.",
      TR: "Every deadline of the e-Satış rounds, calculated from the İlan dates and backed by statutory rules. Follow the proceeding to receive email and calendar reminders.",
    },
    Locked: {
      Title: "Deadlines with reminders",
      Body: "The Hearing Companion calculates the security deposit, bank cheque date, and award deadline from the official notice and reminds you via email and calendar. Included in the Investor plan.",
    },
    NoDates: "The official notice does not state a hearing date, so no deadlines can be calculated.",
    Cancelled: "The proceeding has been cancelled. Deadlines are no longer running.",
    Phases: { before: "Before the hearing", hearing: "Hearing", after: "After the award" },
    Basis: { law: "Statute", notice: "Official notice", user: "Your entry", rule: "belowmark recommendation" },
    Kinds: { deadline: "Deadline", appointment: "Hearing", task: "From then on", info: "For orientation" },
    AfterAwardEmpty: "Post-award deadlines (payment, tax, land register, eviction) appear here as soon as you record the outcome of the hearing.",
    Reminders: "Reminder",
    ReminderDay: "1 day before",
    ReminderDays: "{days} days before",
    ReminderToday: "on the day",
    Disclaimer: "Calculated without public holidays and conservatively so a date is never too late. The statute and the court summons are authoritative; not legal advice.",
  },

  Status: {
    Past: "past",
    Today: "today",
    Tomorrow: "tomorrow",
    InDays: "in {days} days",
  },

  Follow: {
    Start: "Follow proceeding",
    Stop: "Unfollow",
    Following: "You are following this proceeding.",
    NotFollowing: "No reminders set up yet.",
    MailOn: "Email reminder on",
    MailOff: "Email reminder off",
    Download: "Deadlines as calendar (.ics)",
    Overview: "All deadlines",
    Error: "That did not work. Please try again.",
  },

  Checklist: {
    Title: "Roadmap to the hearing",
    Hint: "Checked items stay saved in this browser. Steps with a belowmark check are detected automatically.",
    Progress: "{done} of {total} completed",
    Auto: "detected",
    Steps: {
      DE: [
        { id: "gutachten", Label: "Have the valuation report read", Hint: "Upload the valuation report; the risk check inspects rights, tenants, and year built." },
        { id: "inspection", Label: "Inspect the property", Hint: "At least from the outside; related questions appear in the Verdict section." },
        { id: "limit", Label: "Set your bid limit", Hint: "Up to what bid does it make financial sense? Your numbers, your ceiling." },
        { id: "bank", Label: "Arrange financing", Hint: "The bank file shows your bank the payment schedule and statutory deadlines." },
        { id: "deposit", Label: "Arrange security deposit", Hint: "Bank transfer, certified cheque, or bank guarantee: the exact dates are in the timeline." },
        { id: "papers", Label: "Print your bidder folder", Hint: "ID, power of attorney, proof of security deposit, and your bid limit on paper." },
      ],
      TR: [
        { id: "gutachten", Label: "Read the kıymet takdir raporu", Hint: "Upload the valuation report; the risk check inspects rights, tenants, and condition." },
        { id: "inspection", Label: "Inspect the property", Hint: "At least from the outside; related questions appear in the Verdict section." },
        { id: "limit", Label: "Set your teklif limit", Hint: "Up to what bid does it make sense, including tapu harcı and KDV?" },
        { id: "bank", Label: "Clarify financing in advance", Hint: "Only 7 days remain to pay after the auction round; without prior bank approval, that is tight." },
        { id: "deposit", Label: "Deposit the teminat", Hint: "Cash via the portal or teminat mektubu: the deadlines are shown in the timeline." },
        { id: "papers", Label: "Verify e-Devlet and portal access", Hint: "Bidding is only possible when signed in to the e-Satış portal via e-Devlet." },
      ],
    },
  },

  Items: {
    DE: {
      Notice: {
        Title: "Official notice published",
        Detail: "The hearing must be announced at least six weeks in advance. Your preparation starts here.",
      },
      Transfer: {
        Title: "Security deposit by transfer: credited",
        Detail: "Cash is excluded. A bank transfer only counts if it has been credited to the court cashier's account before the hearing and proof is presented at the hearing. The court provides account and reference details. Conservatively calculated: the day before.{amount}",
      },
      Cheque: {
        Title: "Earliest issue date for certified bank cheque",
        Detail: "A certified bank cheque (Verrechnungsscheck) is only valid if issued no earlier than the third working day before the hearing, drawn on a bank licensed in Germany or the Bundesbank, and payable domestically. If issued earlier, it will be rejected. Calculated counting Saturday as a working day and without public holidays, so never too early.",
      },
      Hearing: {
        Title: "Foreclosure auction hearing",
        Detail: "{authority}. At least 30 minutes must elapse between the call for bids and the close of bidding. Bring: ID, proof of security deposit, and a notarially certified power of attorney if bidding on behalf of someone else.",
      },
      Award: {
        Title: "Latest date for award pronouncement (target deadline)",
        Detail: "The award is pronounced at the hearing or at a separate pronouncement hearing, which should not be scheduled more than one week later. Upon pronouncement, you become the owner. The court sets the exact date.",
      },
      Amount: " Amount if a party demands security: {amount} (10% of market value).",
    },
    TR: {
      Notice: {
        Title: "İlan published",
        Detail: "The auction round must be announced on the e-Satış portal at least 15 days before it begins.",
      },
      RoundStart: {
        Title: "Round {round} (Artırma) begins",
        Detail: "Bids can now be placed on the e-Satış portal; the round runs for seven days.{startingBid}",
      },
      Cash: {
        Title: "Round {round} (Artırma): cash teminat by 23:30",
        Detail: "Pay the security deposit via the portal into the İcra dairesi account no later than 23:30 on the day before the round ends.{amount}",
      },
      Letter: {
        Title: "Round {round} (Artırma): teminat mektubu by close of business",
        Detail: "A bank guarantee letter must reach the İcra dairesi by close of business on the working day before the round ends. Public holidays are not deducted: if that day falls on a holiday, the preceding working day applies.",
      },
      RoundEnd: {
        Title: "Round {round} (Artırma) ends",
        Detail: "If a bid is placed during the final ten minutes, the round is extended by three minutes per bid, up to one hour in total. Afterwards, the outcome protocol is published; from then on, you have seven days to pay.",
      },
      Amount: " Amount: {amount} (10% of appraised value).",
      StartingBid: " Starting bid according to the İlan: {amount}.",
    },
  },

  Page: {
    Eyebrow: "Hearing Companion",
    Title: "Deadlines",
    Lead: "All deadlines for the proceedings you follow in a single list. Reminded by email, subscribed in your own calendar.",
    Count: "{count} followed",
    Empty: {
      Title: "Not following any proceedings yet",
      Body: "Open a case sheet and click “Follow proceeding” under “Deadlines & Roadmap”.",
      Cta: "Go to search",
    },
    Next: "Up next",
    NothingAhead: "No upcoming deadlines.",
    OpenListing: "Open case sheet",
    Missing: "No longer in the current dataset",
    Feed: {
      Title: "Calendar subscription",
      Body: "Add this address as a subscription in Google Calendar, Outlook, or Apple Calendar (“From URL”). New proceedings and rescheduled hearings sync automatically, with advance reminders.",
      Create: "Generate feed URL",
      Renew: "Generate new URL",
      Copy: "Copy",
      Copied: "Copied",
      Shown: "Visible only right now. We do not store this address in plain text; anyone who knows it can view your deadlines.",
      Hidden: "A calendar feed is active. Lost the URL? Generate a new one — the old address will stop working immediately.",
      Error: "Could not generate feed URL.",
    },
    HowItWorks: "Reminders are sent in the morning by email and appear in your calendar feed on the days listed next to each deadline. Hearing dates come from the official notices; if the court changes a date, the deadline updates with the next data sync.",
  },

  Mail: {
    Subject: "{count} deadlines coming up",
    SubjectOne: "One deadline coming up",
    Preheader: "Your Hearing Companion from belowmark.",
    Greeting: "Hello,",
    Intro: "here is what is coming up for the proceedings you follow:",
    Today: "today",
    Tomorrow: "tomorrow",
    InDays: "in {days} days",
    OpenListing: "Open case sheet",
    Manage: "Manage reminders",
    Signature: "Your belowmark team",
    Footer: "You are receiving this email because you follow a proceeding. Unsubscribe under “Deadlines”.",
    Source: "Legal basis",
  },

  Ics: {
    CalendarName: "belowmark Deadlines",
    Source: "Source",
  },
};
