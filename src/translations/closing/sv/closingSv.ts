import { IClosingTranslation } from "../IClosingTranslation";
import { CLOSING_TASKS_SV } from "./closingTasksSv";

export const CLOSING_SV: IClosingTranslation = {
  MetaTags: {
    Tasks: {
      title: "Efter klubbslaget — Belowmark",
      description: "Checklista efter klubbslag: betalning, förvärvsskatt, lagfart, avhysning, försäkring och renovering — med tidsfrister och länkade lagrum.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Klubbslag", "Exekutiv auktion", "Lagfart", "Avhysning"],
      url: "https://belowmark.com/app",
    },
    Results: {
      title: "Auktionsutfall — Belowmark",
      description: "Vad exekutiva auktioner faktiskt går för: vinnande bud i förhållande till marknadsvärde, sammanställt från inrapporterade utfall, anonymt från fem auktioner per grupp.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Vinnande bud", "Marknadsvärde", "Auktionsutfall", "Exekutiv auktion"],
      url: "https://belowmark.com/app/ergebnisse",
    },
  },

  Section: {
    Eyebrow: "Efter auktionen",
    Title: "Utfall & klubbslag",
    Lead: {
      DE: "Var du på plats vid auktionen? Fyll i vad som bjöds. Den officiella portalen publicerar inte utfallen — dina rapporter bygger en anonym prisöversikt. Fick du själv klubbslaget guidar checklistan dig hela vägen till lagfarten.",
      TR: "Följde du auktionen? Fyll i vad som bjöds. Portalen publicerar inga öppna utfall — dina rapporter bygger en anonym prisöversikt. Vann du själv auktionen (ihale) guidar checklistan dig hela vägen till Tapu.",
    },
  },

  Result: {
    Title: "Rapportera auktionsutfall",
    Lead: "Endast siffror, inga namn. Du kan uppdatera din rapport när som helst.",
    NotYet: "Du kan registrera ett utfall från och med auktionsdagen.",
    HearingDate: "Auktionsdatum",
    Outcome: "Utfall",
    Outcomes: {
      awarded: "Klubbslag meddelat",
      refused: "Klubbslag nekat",
      pending: "Beslut uppskjutet",
      noBids: "Inga bud",
      cancelled: "Auktionen ställdes in",
    },
    HighestBid: {
      DE: { label: "Högsta bud (kontantbud / Bargebot)", hint: "Enligt protokollet eller klubbslagsbeslutet" },
      TR: { label: "Vinnande bud (ihale bedeli)", hint: "Enligt auktionsprotokollet" },
    },
    RetainedRights: { label: "Kvarstående rättigheter", hint: "Om angivet — ingår i det ekonomiska priset" },
    BidderCount: { label: "Antal budgivare", hint: "Om känt" },
    Source: "Varifrån kommer dina uppgifter?",
    Sources: { attended: "Närvarade på plats", protocol: "Protokoll / beslut", court: "Uppgift från domstolen" },
    IsBuyer: { DE: "Jag fick klubbslaget", TR: "Jag vann auktionen (ihale)" },
    AwardDate: {
      DE: { label: "Klubbslag meddelat den", hint: "Lämna tomt = auktionsdagen" },
      TR: { label: "Protokoll publicerat den", hint: "7-dagarsfristen för betalning börjar löpa denna dag" },
    },
    Shared: { label: "Ta med anonymt i prisöversikten", hint: "Endast median per region och fastighetstyp visas, från fem auktioner och uppåt — aldrig din enskilda rapport." },
    Privacy: "Vi lagrar auktionsdatum, utfall, belopp och antal budgivare för detta ärendenummer — aldrig namn på budgivare, köpare eller ägare.",
    Save: "Spara utfall",
    Saved: "Sparat.",
    SavedBuyer: "Sparat. Din checklista efter klubbslag är klar.",
    Errors: {
      auth: "Logga in igen.",
      locked: "Checklistan efter klubbslag ingår i Investor-planen.",
      date: "Ange ett giltigt datum (inte före auktionen).",
      future: "Utfall kan rapporteras tidigast på auktionsdagen.",
      outcome: "Välj utfall.",
      bid: "Vid klubbslag måste vinnande bud anges (heltal).",
      ratio: "Budet stämmer inte med marknadsvärdet — kontrollera beloppet.",
      bidders: "Ange ett rimligt antal budgivare.",
      buyer: "”Jag fick klubbslaget” kan endast väljas vid utfallet ”Klubbslag meddelat”.",
      unknown: "Kunde inte spara. Försök igen.",
    },
    Ratio: "{pct} av marknadsvärdet",
    StatsLink: "Visa prisöversikt",
  },

  Teaser: {
    Title: "Din checklista efter klubbslaget",
    Lead: "Betalning, skatt, lagfart, tillträde, försäkring, renovering — uträknat med dina tidsfrister.",
    Button: "Öppna checklista",
    Progress: "{done} av {total} klara",
    Next: "Nästa: {title} · {date}",
    NoDate: "Ange datum för klubbslaget så att checklistan kan räkna ut dina tidsfrister.",
  },

  Tasks: {
    Kicker: "Efter klubbslaget",
    Title: "Checklista efter klubbslag",
    Lead: {
      DE: "Från klubbslag till lagfart i fastighetsregistret och tillträde. Vi beräknar tidsfrister strikt utifrån de datum du anger. Varje punkt anger sitt lagrum.",
      TR: "Från ihale till Tapu-inskrivning och tillträde. Vi beräknar tidsfrister strikt utifrån de datum du anger. Varje punkt anger sitt lagrum.",
    },
    Back: "Tillbaka till ärendeakten",
    Disclaimer:
      "Denna checklista är endast avsedd som vägledning och utgör inte juridisk rådgivning. Den sammanfattar lagregler i förenklad form (per 2026-10-26) och tar inte hänsyn till omständigheterna i ditt enskilda fall. Vid tidsfrister, uppsägningar och avhysning bör du rådgöra med domstol, notarie eller jurist.",
    Locked: {
      Title: "Checklista i Investor-planen",
      Body: "Ditt utfall har sparats. Checklistan efter klubbslag med beräknade tidsfrister och påminnelser ingår i Investor-planen.",
      Cta: "Uppgradera till Investor",
    },
    Dates: {
      Title: "Dina datum",
      Lead: "Checklistan beräknar tidsfrister utifrån dessa datum. Lämna tomt sådant du inte vet ännu.",
      Fields: {
        DE: {
          awardDate: { label: "Klubbslag meddelat den", hint: "Obligatoriskt" },
          distributionDate: { label: "Fördelningssammanträde (Verteilungstermin)", hint: "Anges i domstolens kallelse" },
          taxNoticeDate: { label: "Beslut om fastighetsförvärvsskatt daterat", hint: "Delgivningsdatum" },
          handoverDate: { label: "Tillträde / avhysning den", hint: "Planerat eller genomfört" },
        },
        TR: {
          awardDate: { label: "Auktionsprotokoll publicerat den", hint: "Obligatoriskt — startar 7-dagarsfristen" },
          handoverDate: { label: "Tillträde / avhysning den", hint: "Planerat eller genomfört" },
        },
      },
      FromPortfolio: "Förifyllt från din portfölj — kom ihåg att spara.",
      Save: "Spara datum",
      Saved: "Sparat.",
      Required: "Ange minst datumet för klubbslaget.",
      Errors: {
        auth: "Logga in igen.",
        locked: "Checklistan efter klubbslag ingår i Investor-planen.",
        date: "Ange minst datumet för klubbslaget.",
        unknown: "Kunde inte spara. Försök igen.",
      },
    },
    Conditions: {
      Title: "Din situation",
      Lead: "Visar endast de punkter som gäller din fastighet. Sparas i denna webbläsare.",
      Items: { tenant: "Det finns hyresgäster", ownerOccupied: "Tidigare ägare bor kvar", condo: "Ägarlägenhet / bostadsrätt", house: "En- eller tvåfamiljshus" },
    },
    Phases: { first: "Första dagarna", payment: "Betalning", register: "Skatt & fastighetsregister", possession: "Tillträde & hyresgäster", works: "Renovering & drift" },
    Due: { deadline: "senast {date}", earliest: "tidigast {date}", on: "från {date}" },
    Missing: "Saknat datum: {field}",
    States: { done: "Klar", overdue: "Försenad", soon: "Snart förfallen", open: "Öppen", undated: "Inget datum" },
    Basis: { law: "Lag", practice: "Praxis", rule: "Belowmark-regel" },
    Check: "Rättsläget har ändrats eller är inte slutligt avgjort — kontrollera",
    MarkDone: "Klar",
    MarkOpen: "Öppna igen",
    Sources: "Källor",
    Progress: "{done} av {total} klara",
    Items: CLOSING_TASKS_SV,
  },

  Results: {
    Kicker: "Auktionsutfall",
    Title: "Vad som faktiskt betalas",
    Lead: "Inrapporterade vinnande bud i förhållande till marknadsvärde. Siffrorna lämnas av användare, inte av domstolar — de visar en allmän prisnivå, inte en värdering av din fastighet.",
    Method: {
      Title: "Så beräknar vi",
      Items: [
        "Kvot = (högsta bud + kvarstående rättigheter) ÷ marknadsvärde enligt officiell kungörelse.",
        "Om flera användare rapporterar samma auktion räknas den en gång med medianen av rapporterna.",
        "Siffror visas först från fem auktioner per grupp och uppåt. Under det visas endast antalet.",
        "Inga namn och inga ärendenummer visas i översikten. Bara du kan se dina egna rapporter.",
      ],
    },
    Table: { Region: "Region", Segment: "Fastighetstyp", Awarded: "Klubbslag", Median: "Median", Range: "Mitthalva (IQR)", Bidders: "Budgivare (median)", Reported: "Rapporterade auktioner" },
    AllSegments: "Alla fastighetstyper",
    Total: "Totalt",
    OtherRegion: "Ingen region",
    TooFew: "{n} — för få (från {min})",
    Empty: "Inga rapporter på din marknad ännu. Översikten fylls på så snart användare anger auktionsutfall i ärendeakten under ”Utfall & klubbslag”.",
    Locked: "Prisöversikten ingår i Investor-planen. Du kan ändå rapportera in utfall.",
    Own: { Title: "Dina rapporter", Lead: "Syns bara för dig.", Empty: "Du har inte rapporterat några utfall ännu.", Shared: "i översikten", Private: "privat", Buyer: "Ditt klubbslag" },
  },
};
