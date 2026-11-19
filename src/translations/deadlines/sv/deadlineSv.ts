import { IDeadlineTranslation } from "../IDeadlineTranslation";

export const DEADLINE_SV: IDeadlineTranslation = {
  MetaTags: {
    title: "Auktionsguide & Tidsfrister — Belowmark",
    description: "Alla tidsfrister från kungörelse till klubbslag med lagstöd: 10 % handpenning, bankcheck, auktionstillfälle, teminat. Påminnelser via e-post och kalenderflöde.",
    imgUrl: "https://belowmark.com/og/home.png",
    tags: ["Tidsfrister", "Exekutiv auktion", "Handpenning", "Kalender"],
    url: "https://belowmark.com/app/termine",
  },
  Nav: "Tidsfrister",

  Section: {
    Eyebrow: "Auktionsguide",
    Title: "Tidsfrister & Tidslinje",
    Lead: {
      DE: "Alla tidsfrister fram till klubbslag, beräknade utifrån auktionsdatumet i kungörelsen och styrkta med lagrum. Följ ärendet för att få påminnelser via e-post och kalender.",
      TR: "Alla tidsfrister i e-Satış-omgångarna, beräknade utifrån İlan-datumen och styrkta med lagregler. Följ ärendet för att få påminnelser via e-post och kalender.",
    },
    Locked: {
      Title: "Tidsfrister med påminnelser",
      Body: "Auktionsguiden räknar ut tidsfrister för handpenning, bankcheck och klubbslag direkt från kungörelsen och påminner dig via e-post och kalender. Ingår i Investor-paketet.",
    },
    NoDates: "Den officiella kungörelsen anger inget auktionsdatum, därför kan inga tidsfrister beräknas.",
    Cancelled: "Ärendet har ställts in. Inga tidsfrister löper längre.",
    Phases: { before: "Före auktionen", hearing: "Auktion", after: "Efter klubbslag" },
    Basis: { law: "Lagrum", notice: "Kungörelse", user: "Din uppgift", rule: "belowmark-rekommendation" },
    Kinds: { deadline: "Tidsfrist", appointment: "Auktion", task: "Från och med nu", info: "För orientering" },
    AfterAwardEmpty: "Tidsfrister efter klubbslag (slutlikvid, stämpelskatt / lagfart, fastighetsregister, avhysning) visas här så snart du registrerat utfallet av auktionen.",
    Reminders: "Påminnelse",
    ReminderDay: "1 dag före",
    ReminderDays: "{days} dagar före",
    ReminderToday: "samma dag",
    Disclaimer: "Beräknat utan hänsyn till helgdagar och med säkerhetsmarginal så att inget datum kommer för sent. Lagtexten och myndighetens kallelse är alltid avgörande; ej juridisk rådgivning.",
  },

  Status: {
    Past: "passerad",
    Today: "idag",
    Tomorrow: "imorgon",
    InDays: "om {days} dagar",
  },

  Follow: {
    Start: "Följ ärende",
    Stop: "Sluta följa",
    Following: "Du följer detta ärende.",
    NotFollowing: "Inga påminnelser inställda ännu.",
    MailOn: "E-postpåminnelse på",
    MailOff: "E-postpåminnelse av",
    Download: "Tidsfrister som kalender (.ics)",
    Overview: "Alla tidsfrister",
    Error: "Det fungerade inte. Försök igen.",
  },

  Checklist: {
    Title: "Färdplan fram till auktionen",
    Hint: "Bockade punkter sparas i den här webbläsaren. Steg med belowmark-kontroll känns av automatiskt.",
    Progress: "{done} av {total} klara",
    Auto: "upptäckt",
    Steps: {
      DE: [
        { id: "gutachten", Label: "Låt granska värderingsutlåtandet", Hint: "Ladda upp värderingsprotokollet; riskkontrollen granskar rättigheter, hyresgäster och byggår." },
        { id: "inspection", Label: "Besiktiga fastigheten", Hint: "Åtminstone utvändigt; relevanta kontrollfrågor finns i avsnittet Bedömning." },
        { id: "limit", Label: "Fastställ ditt maxbud", Hint: "Upp till vilket bud är affären lönsam? Dina siffror, ditt budtak." },
        { id: "bank", Label: "Ordna finansiering", Hint: "Bankunderlaget visar din bank betalningsplanen och de lagstadgade tidsfristerna." },
        { id: "deposit", Label: "Förbered 10 % handpenning", Hint: "Banköverföring, bankkort med rätt beloppsgräns, check eller bankgaranti: exakta datum finns i tidslinjen." },
        { id: "papers", Label: "Skriv ut din budgivarmapp", Hint: "Legitimation, eventuell fullmakt, bevis på handpenning och ditt maxbud på papper." },
      ],
      TR: [
        { id: "gutachten", Label: "Läs kıymet takdir raporu", Hint: "Ladda upp värderingsutlåtandet; riskkontrollen granskar rättigheter, hyresgäster och skick." },
        { id: "inspection", Label: "Besiktiga fastigheten", Hint: "Åtminstone utvändigt; relevanta kontrollfrågor finns i avsnittet Bedömning." },
        { id: "limit", Label: "Fastställ ditt maxbud (teklif)", Hint: "Upp till vilket bud är affären lönsam inklusive tapu harcı och KDV?" },
        { id: "bank", Label: "Klargör finansieringen i förväg", Hint: "Endast 7 dagar återstår för betalning efter avslutad omgång; utan lånelöfte i förväg blir det snävt." },
        { id: "deposit", Label: "Sätt in teminat (handpenning)", Hint: "Kontant via portalen eller teminat mektubu: tidsfristerna visas i tidslinjen." },
        { id: "papers", Label: "Kontrollera e-Devlet och portalåtkomst", Hint: "Budgivning är endast möjlig när du är inloggad i e-Satış via e-Devlet." },
      ],
    },
  },

  Items: {
    DE: {
      Notice: {
        Title: "Officiell kungörelse publicerad",
        Detail: "Auktionen måste kungöras i god tid i förväg (i Tyskland minst sex veckor). Här börjar din förberedelse.",
      },
      Transfer: {
        Title: "Handpenning via banköverföring: bokförd",
        Detail: "Kontanter accepteras inte. En banköverföring gäller bara om beloppet bokförts hos domstolskassan före auktionen och kvitto visas upp på plats. Myndigheten anger konto och referens. Konservativt beräknat: dagen före.{amount}",
      },
      Cheque: {
        Title: "Tidigaste utfärdandedatum för verifierad bankcheck",
        Detail: "En bankcheck (Verrechnungsscheck) är endast giltig om den utfärdats tidigast tredje arbetsdagen före auktionen av en licensierad bank i Tyskland eller Bundesbank. Utfärdas den tidigare avvisas den. Beräknat med lördag som arbetsdag och utan helgdagar så att den aldrig blir för tidig.",
      },
      Hearing: {
        Title: "Exekutiv auktion",
        Detail: "{authority}. Minst 30 minuter måste förflyta mellan utrop och avslutad budgivning i tysk ZVG-auktion. Ta med: legitimation, bevis på handpenning samt bevittnad/notariell fullmakt vid bud för annans räkning.",
      },
      Award: {
        Title: "Senaste dag för beslut om klubbslag (riktfrist)",
        Detail: "Beslut om inrop meddelas vid auktionen eller vid ett särskilt sammanträde som inte bör ligga mer än en vecka senare. Vid beslutet övergår äganderätten. Myndigheten fastställer exakt datum.",
      },
      Amount: " Belopp om säkerhet begärs: {amount} (10 % av marknadsvärdet).",
    },
    TR: {
      Notice: {
        Title: "İlan publicerad",
        Detail: "Auktionsomgången måste kungöras på e-Satış-portalen minst 15 dagar innan den startar.",
      },
      RoundStart: {
        Title: "Omgång {round} (Artırma) startar",
        Detail: "Bud kan nu läggas på e-Satış-portalen; omgången pågår i sju dagar.{startingBid}",
      },
      Cash: {
        Title: "Omgång {round} (Artırma): kontant teminat senast 23:30",
        Detail: "Betala handpenningen via portalen till İcra dairesi-kontot senast kl. 23:30 dagen innan omgången avslutas.{amount}",
      },
      Letter: {
        Title: "Omgång {round} (Artırma): teminat mektubu före kontorstidens slut",
        Detail: "En bankgaranti måste vara İcra dairesi tillhanda före kontorstidens slut arbetsdagen innan omgången slutar. Helgdagar räknas inte av: infaller dagen på en helgdag gäller föregående arbetsdag.",
      },
      RoundEnd: {
        Title: "Omgång {round} (Artırma) avslutas",
        Detail: "Läggs ett bud under de sista tio minuterna förlängs omgången med tre minuter per bud, upp till totalt en timme. Därefter publiceras protokollet; från den tidpunkten har du sju dagar på dig att betala.",
      },
      Amount: " Belopp: {amount} (10 % av värderat värde).",
      StartingBid: " Utropspris enligt İlan: {amount}.",
    },
  },

  Page: {
    Eyebrow: "Auktionsguide",
    Title: "Tidsfrister",
    Lead: "Alla tidsfrister för de ärenden du följer i en enda lista. Påminnelser via e-post och som prenumeration i din egen kalender.",
    Count: "{count} följda",
    Empty: {
      Title: "Du följer inga ärenden ännu",
      Body: "Öppna en ärendeakt och klicka på ”Följ ärende” under ”Tidsfrister & Tidslinje”.",
      Cta: "Gå till sökning",
    },
    Next: "Närmast i tid",
    NothingAhead: "Inga kommande tidsfrister.",
    OpenListing: "Öppna ärendeakt",
    Missing: "Finns inte längre i det aktuella underlaget",
    Feed: {
      Title: "Kalenderprenumeration",
      Body: "Lägg till denna adress som prenumeration i Google Kalender, Outlook eller Apple Kalender (”Från URL”). Nya ärenden och ändrade auktionsdatum synkas automatiskt med förhandspåminnelser.",
      Create: "Skapa kalenderlänk",
      Renew: "Skapa ny länk",
      Copy: "Kopiera",
      Copied: "Kopierad",
      Shown: "Visas bara just nu. Vi lagrar inte adressen i klartext; alla som känner till den kan se dina tidsfrister.",
      Hidden: "Ett kalenderflöde är aktivt. Tappat bort länken? Skapa en ny — den gamla adressen slutar fungera omedelbart.",
      Error: "Kunde inte skapa kalenderlänk.",
    },
    HowItWorks: "Påminnelser skickas på morgonen via e-post och visas i ditt kalenderflöde på de dagar som anges bredvid varje tidsfrist. Auktionsdatumen kommer från de officiella kungörelserna; ändrar myndigheten ett datum uppdateras tidsfristen vid nästa synkronisering.",
  },

  Mail: {
    Subject: "{count} kommande tidsfrister",
    SubjectOne: "En kommande tidsfrist",
    Preheader: "Din auktionsguide från belowmark.",
    Greeting: "Hej,",
    Intro: "detta är vad som närmar sig för de ärenden du följer:",
    Today: "idag",
    Tomorrow: "imorgon",
    InDays: "om {days} dagar",
    OpenListing: "Öppna ärendeakt",
    Manage: "Hantera påminnelser",
    Signature: "Ditt belowmark-team",
    Footer: "Du får detta mejl eftersom du följer ett ärende. Avsluta prenumeration under ”Tidsfrister”.",
    Source: "Lagstöd",
  },

  Ics: {
    CalendarName: "belowmark Tidsfrister",
    Source: "Källa",
  },
};
