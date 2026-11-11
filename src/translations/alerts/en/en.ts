import { IAlertsTranslation } from "../IAlertsTranslation";

export const ALERTS_EN: IAlertsTranslation = {
  MetaTags: {
    title: "Alerts — Belowmark",
    description: "Saved searches with email notifications: find out immediately when a matching foreclosure proceeding is published or a hearing date changes.",
    imgUrl: "https://belowmark.com/og/home.png",
    tags: ["Alerts", "Foreclosure auction", "Saved search"],
    url: "https://belowmark.com/app/alerts",
  },
  Nav: "Alerts",

  Page: {
    Eyebrow: "Saved searches",
    Title: "Alerts",
    Lead: "Every alert is a saved search. When a new matching proceeding appears or the court changes a hearing date, you receive an email — with the case number and a direct link to the case file.",
    Usage: "{count} of {max} alerts",
    Empty: {
      Title: "No alerts yet.",
      Body: "Set your filters in the notices — state, property type, value range, keyword — and save the search as an alert right below the result count.",
      Cta: "Go to notices",
    },
    HowItWorks:
      "Comparisons run after every update of the official records. We only report what the official notice itself states: a new proceeding, a rescheduled hearing, or a cancellation. Time range and sorting are not part of the alert — it always looks ahead.",
  },

  Card: {
    Active: "Active",
    Paused: "Paused",
    Pause: "Pause",
    Resume: "Resume",
    Delete: "Delete",
    OpenSearch: "Open search",
    Matches: "{count} open matches",
    MatchesOne: "1 open match",
    NotifyNew: "New proceedings",
    NotifyChanges: "Date changes",
    LastSent: "Last email: {date}",
    NeverSent: "No email sent yet",
    LastChecked: "Checked: {date}",
    Error: "Something went wrong. Please try again.",
  },

  Summary: {
    AllRegions: { DE: "All federal states", TR: "All provinces" },
    AllSegments: "All property types",
    Query: "“{query}”",
    Min: "from {value}",
    Max: "up to {value}",
  },

  Save: {
    Toggle: "Save search as alert",
    Title: "Create alert",
    NameLabel: "Name",
    NotifyNew: "Email on new proceedings",
    NotifyChanges: "Email on date changes and cancellations",
    Hint: "Saves keyword, region, property type, and value range. Current matches are marked as known — notifications cover changes from now on.",
    Submit: "Save alert",
    Pending: "Saving …",
    Saved: "Saved. You will receive an email as soon as something changes.",
    Manage: "Manage alerts",
    Errors: {
      limit: "You already have 10 alerts. Delete one before creating a new alert.",
      invalid: "Please name the alert and select at least one notification option.",
      failed: "The alert could not be saved. Please try again.",
    },
  },

  Mail: {
    Subject: "{count} updates for your alerts",
    SubjectOne: "1 update for your alerts",
    Preheader: "New proceedings and changed hearing dates from your saved searches.",
    Greeting: "Hello,",
    Intro: "since our last check, the following changes have occurred in your saved searches:",
    Kinds: { new: "New", cancelled: "Cancelled", reinstated: "Reinstated", rescheduled: "Rescheduled" },
    NextDate: "Hearing {date}",
    Moved: "previously {before}, now {after}",
    Value: { DE: "Appraised value", TR: "Muhammen bedel" },
    More: "+ {count} more",
    OpenSearch: "Open search",
    LockedValues: "Full court file numbers, street addresses, and appraisal PDFs are unlocked with Full Access (or via your 1 Free Dossier).",
    TrialTitle: "Unlock all court file numbers, street addresses & legal PDFs",
    TrialBody: "Your alert account and 1 Free Dossier stay permanently free (no payment details stored, no auto-renewal). Optionally test Investor Full Access for 7 days at 0.00 today.",
    TrialCta: "Start 7-Day Free Trial (0.00)",
    Manage: "Manage or pause alerts",
    Source: { DE: "Source of all data: zvg-portal.de", TR: "Source of all data: ilan.gov.tr" },
    Signature: "Your Belowmark Team",
    Footer: "Belowmark · Source-verified foreclosure auctions · belowmark.com",
  },
};
