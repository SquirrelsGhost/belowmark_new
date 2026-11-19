import { IVerdictTranslation } from "../IVerdictTranslation";

export const VERDICT_SV: IVerdictTranslation = {
  Section: {
    Eyebrow: "Slutsats",
    Title: "Bjud eller avstå?",
    Lead: "En samlad bedömning utifrån officiell kungörelse, ditt värderingsutlåtande, lagregler och dina egna siffror. Den säger ”Bjud” först när inget väsentligt längre är öppet — och anger källa för varje skäl.",
    Disclaimer: "Investeringsvägledning baserad på dina uppgifter, inte juridisk eller finansiell rådgivning. Fastighetsregistret, värderingsutlåtandet och domstolens tillkännagivanden vid auktionstillfället är avgörande.",
  },
  Locked: {
    Title: "Slutsats i Investor-planen",
    Body: "Slutsatsen väger samman riskkontroll, värderingsutlåtande och budgräns till en tydlig rekommendation per objekt. Ingår i Investor-planen.",
  },

  States: {
    go: { Stamp: "Bjud", Headline: "Bjud upp till {amount}", Sub: "Baserat på dina siffror och tillgängliga källor. Gå inte över denna gräns." },
    open: { Stamp: "Inte redo för bud", Headline: "Preliminär gräns {amount}", Sub: "Denna gräns har öppna punkter. Den blir en fast rekommendation först när punkterna nedan är utredda." },
    stop: { Stamp: "Bjud inte", Headline: "Bjud inte", Sub: "Minst ett dokumenterat skäl talar tydligt emot budgivning — se nedan." },
    none: { Stamp: "Ingen slutsats", Headline: "Ingen slutsats möjlig", Sub: "Detta ärende kan för närvarande inte bedömas." },
  },
  GoUnverified: "Obs: din renoveringsbudget är varken verifierad på plats eller styrkt av en hantverkaroffert. Din budgräns är bara så tillförlitlig som den siffran.",
  OpenNoLimit: { Headline: "Ingen gräns ännu", Sub: "Utan dina målkrav i budgränskalkylatorn finns inget övre tak. Listan nedan visar vad som fortfarande saknas." },
  Groups: {
    none: "Varför ingen slutsats kan dras",
    stop: "Varför du inte bör bjuda",
    gap: "Innan du bjuder",
    caution: "Tänk på",
    ok: "Vad som talar för",
  },

  Reasons: {
    noValue: "Den officiella kungörelsen anger inget marknadsvärde. Utan det kan varken lagstadgade gränser eller kostnader beräknas.",
    cancelled: "Enligt portalen har auktionstillfället ställts in.",
    past: "Auktionsdatumet har redan passerat.",
    unreachable: "Dina mål kan inte nås vid något bud — inte ens vid 0. Löpande kostnader och hyra bär dem inte.",
    belowStart: "Din gräns på {amount} ligger under minimibudet på {other}. Ett så lågt bud är inte tillåtet.",
    belowHalf: "Din gräns inklusive kvarstående rättigheter ({amount}) ligger under 5/10 av marknadsvärdet ({other}). Vid det första auktionstillfället ska klubbslag under denna gräns nekas ex officio — gör en ny bedömning vid ett senare tillfälle.",
    rightStays: "{risk} enligt källa. Rättigheten kan kvarstå efter klubbslaget och beröva dig nyttjande eller värde. Bjud först när domstolen bekräftat om den faller bort och dess värde förts in under ”Kvarstående rättigheter” i budgränsen (ange 0 om den faller bort).",
    noTargets: "Inget målkriterium (direktavkastning, kassaflöde eller vidareförsäljningsvärde) har angetts i budgränskalkylatorn ännu. Utan mål finns inget tak.",
    noReport: "Inget värderingsutlåtande uppladdat. Rättigheter, fel och föroreningar är därför bara kända från kungörelsen — som sällan säger något om dem.",
    noRenovation: "Ingen renoveringsbudget angiven. Fyll i din uppskattning — eller 0 om inga arbeten behövs.",
    noClearance: "Hyresgäster eller boende möjliga, men inga avhysnings- eller övergångskostnader angivna (ange 0 om inga finns).",
    askInspection: "Ange om du har besiktigat fastigheten.",
    askOccupancy: "Ange vem som nyttjar fastigheten — så långt du känner till.",
    askRights: "Ange om du har frågat domstolen om kvarstående rättigheter.",
    rightsOpen: "Du har ännu inte kontrollerat kvarstående rättigheter. Allt som kvarstår efter klubbslaget måste betalas eller övertas utöver ditt kontantbud.",
    askCostBasis: "Ange vad dina uppgifter för renovering och avhysning bygger på.",
    costsIncomplete: "En lagstadgad kostnadspost kan inte beräknas ur kungörelsen — de totala kostnaderna är ofullständiga.",
    contamination: "Markförorening anges i värderingsutlåtandet. Endast en fackutredning kan uppskatta saneringskostnaden. Bjud inte förrän din budget stöds av en offert.",
    rightPriced: "{risk} enligt källa — utrett med domstolen och inräknat i budgränsen med {amount}.",
    notInside: "Du har inte varit inne i fastigheten. Din renoveringsbudget är därför overifierad — stresstestet nedan visar hur fördyringar påverkar din gräns.",
    reportOutsideOnly: "Inte heller domstolens värderingsman kunde besiktiga insidan (fullt ut).",
    estimateOnly: "Dina renoveringskostnader är en egen uppskattning, inte en hantverkaroffert.",
    defects: "Värderingsutlåtandet nämner fel eller skador. Kontrollera att din renoveringsbudget täcker dem.",
    tenant: "Fastigheten är (troligen) uthyrd. Hyresavtal övergår på köparen — räkna med faktisk hyra, inte målhyra.",
    heritage: "Kulturminnesskydd enligt källa. Ombyggnader och renoveringar kräver tillstånd och kostar ofta mer.",
    easement: "Värderingsutlåtandet nämner servitut eller offentliga byggnadsbelastningar (t.ex. vägrätt). Dessa kvarstår ofta efter klubbslaget.",
    contaminationUnclear: "Värderingsutlåtandet lämnar öppet om markföroreningar förekommer.",
    oldValuation: "Värderingsdagen ligger {years} år före auktionstillfället. Marknadsläge och skick kan ha förändrats sedan dess.",
    valueMismatch: "Värderingsutlåtandet anger {amount}, kungörelsen {other}. Klargör med domstolen vilken siffra som gäller.",
    sevenTenths: "Din gräns inklusive kvarstående rättigheter ({amount}) ligger under 7/10 ({other}). En berättigad borgenär kan begära att klubbslag nekas vid det första auktionstillfället.",
    atCeiling: "Gränsen slår i beräkningstaket (tre gånger marknadsvärdet). Dina målantaganden är sannolikt för generösa.",
    conflicting: "Källorna motsäger varandra kring ”{risk}”.",
    limitBy: "Ditt mål ”{criterion}” bär ett bud upp till {amount}.",
    legalClear: "Gränsen överstiger de lagstadgade minimigränserna för detta auktionstillfälle.",
    limitsWaived: "Lagstadgade värdegränser gäller inte längre i detta ärende.",
    rightsClear: "Boenderätt, nyttjanderätt och tomträtt är uteslutna enligt källa.",
  },
  MarketReasons: {
    belowStart: {
      DE: "Din gräns på {amount} ligger under minimibudet på {other}.",
      TR: "Din gräns på {amount} ligger under utropspriset på {other} (50 % av marknadsvärdet). Ett så lågt bud godtas inte i någon runda.",
    },
    rightStays: {
      DE: "{risk} enligt källa. Rättigheten kan kvarstå efter klubbslaget och beröva dig nyttjande eller värde. Bjud först när domstolen bekräftat om den faller bort och dess värde förts in under ”Kvarstående rättigheter” i budgränsen (ange 0 om den faller bort).",
      TR: "{risk} enligt källa. Om rättigheten kvarstår efter auktionen framgår av Tapu-utdraget och Satış şartnamesi. Bjud först när du kontrollerat detta och räknat in det i din kalkyl.",
    },
    askRights: {
      DE: "Ange om du har frågat domstolen om kvarstående rättigheter.",
      TR: "Ange om du har kontrollerat Tapu-utdraget och Satış şartnamesi avseende belastningar.",
    },
    rightsOpen: {
      DE: "Du har ännu inte frågat domstolen om kvarstående rättigheter. Allt som kvarstår efter klubbslaget övertas utöver ditt bud.",
      TR: "Du har ännu inte kontrollerat Tapu-utdraget och Satış şartnamesi. Belastningar som kvarstår efter auktionen ligger kvar på ditt ansvar.",
    },
    tenant: {
      DE: "Fastigheten är (troligen) uthyrd. Hyresavtal övergår på köparen — räkna med faktisk hyra, inte målhyra.",
      TR: "Fastigheten är (troligen) bebodd eller uthyrd. Avhysning kan ta tid och kräva ett separat ärende — räkna in detta.",
    },
  },
  Actions: {
    limit: "Fyll i budgräns",
    report: "Ladda upp utlåtande",
    questions: "Svara nedan",
  },

  Sources: {
    Label: "Källa",
    notice: "Officiell kungörelse",
    report: "Utlåtande s. {page}",
    input: "Dina siffror",
    answer: "Ditt svar",
    rule: "belowmark-regel",
  },

  Questions: {
    Title: "Det bara du kan veta",
    Lead: "Inget dokument visar hur det ser ut invändigt idag eller vem som bor där. Dina svar går direkt in i slutsatsen — utan svar förblir punkten öppen.",
    Items: {
      inspection: {
        Label: "Har du besiktigat fastigheten?",
        Hint: "Invändig visning är ofta inte möjlig vid exekutiva auktioner.",
        Options: { inside: "Ja, invändigt", outside: "Endast utvändigt", none: "Inte alls" },
      },
      rights: {
        Label: "Frågat domstolen om kvarstående rättigheter?",
        Hint: "Domstolshandläggaren (Rechtspfleger) kan på förfrågan uppge minimibud och eventuella kvarstående rättigheter före auktionen.",
        Options: { confirmed: "Ja, utrett", open: "Inte ännu" },
      },
      occupancy: {
        Label: "Vem nyttjar fastigheten?",
        Hint: "Enligt värderingsutlåtandet, grannar eller borgenären — så långt känt.",
        Options: { vacant: "Tom", owner: "Ägare", tenant: "Hyresgäst", unknown: "Vet inte" },
      },
      costBasis: {
        Label: "Vad bygger dina kostnader för renovering och avhysning på?",
        Hint: "Relevant endast om du har angett kostnader.",
        Options: { quote: "Offert / fackman", estimate: "Egen uppskattning" },
      },
    },
    Rights: {
      DE: { Label: "Frågat domstolen om kvarstående rättigheter?", Hint: "Domstolshandläggaren (Rechtspfleger) kan på förfrågan uppge minimibud och eventuella kvarstående rättigheter före auktionen." },
      TR: { Label: "Kontrollerat Tapu-utdraget och Satış şartnamesi för belastningar?", Hint: "Anteckningar (şerhler), nyttjanderätt (intifa) och boenderätt (sükna hakkı) framgår av Tapu-utdraget och Satış şartnamesi på e-Satış." },
    },
    Unanswered: "öppen",
    Reset: "Rensa svar",
    StorageHint: "Dina svar sparas endast i denna webbläsare.",
  },

  Stress: {
    Title: "Stresstest",
    Lead: "Räkneexempel, inte en prognos: vad blir din budgräns om renovering och avhysning blir dyrare än angett?",
    Row: "+{pct} % kostnader: {limit}",
    Unreachable: "inget bud går ihop",
    BelowThreshold: "under lagstadgad gräns",
    NoLimit: "kan inte beräknas",
  },

  Unknowables: {
    Title: "Vad belowmark inte kan veta",
    Items: [
      "Det faktiska invändiga skicket idag — foton och utlåtanden visar bara vad värderingsmannen fick se.",
      "De verkliga renoveringskostnaderna — för det krävs en kvalificerad fackman på plats.",
      "Om boende flyttar ut frivilligt och hur lång tid en eventuell avhysning tar.",
      "Hur många andra som bjuder vid auktionstillfället och hur högt de går.",
      "Om auktionen ställs in med kort varsel — kontrollera igen dagen innan.",
    ],
  },

  File: {
    Title: "Slutsats",
  },
};
