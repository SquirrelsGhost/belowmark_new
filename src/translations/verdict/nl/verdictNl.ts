import { IVerdictTranslation } from "../IVerdictTranslation";

export const VERDICT_NL: IVerdictTranslation = {
  Section: {
    Eyebrow: "Oordeel",
    Title: "Bieden of laten liggen?",
    Lead: "Een oordeel op basis van de officiële bekendmaking, uw taxatierapport, wettelijke regels en uw eigen cijfers. Het zegt pas “bieden” zodra niets wezenlijks meer openstaat — en vermeldt bij elke reden de bron.",
    Disclaimer: "Beleggingsindicatie op basis van uw invoer, geen juridisch of beleggingsadvies. Het kadaster, het taxatierapport en de mededelingen van de rechtbank op de zitting zijn maatgevend.",
  },
  Locked: {
    Title: "Oordeel in het Investor-abonnement",
    Body: "Het Oordeel combineert de risicocheck, het taxatierapport en de biedlimiet tot een duidelijke aanbeveling per object. Beschikbaar in het Investor-abonnement.",
  },

  States: {
    go: { Stamp: "Bieden", Headline: "Bieden tot {amount}", Sub: "Op basis van uw cijfers en de beschikbare bronnen. Bied niet boven deze bovengrens." },
    open: { Stamp: "Nog niet gereed om te bieden", Headline: "Voorlopige limiet {amount}", Sub: "Deze limiet geldt onder voorbehoud van openstaande punten. Pas zodra onderstaande punten zijn opgehelderd wordt dit een vast oordeel." },
    stop: { Stamp: "Niet bieden", Headline: "Niet bieden", Sub: "Ten minste één gedocumenteerde reden spreekt duidelijk tegen bieden — zie hieronder." },
    none: { Stamp: "Geen oordeel", Headline: "Geen oordeel mogelijk", Sub: "Deze procedure kan op dit moment niet worden beoordeeld." },
  },
  GoUnverified: "Let op: uw renovatiebudget is noch ter plaatse geverifieerd, noch onderbouwd met een aannemersofferte. Uw limiet is slechts zo betrouwbaar als dat cijfer.",
  OpenNoLimit: { Headline: "Nog geen limiet", Sub: "Zonder uw doelstellingen in de biedlimietcalculator is er geen bovengrens. De lijst hieronder toont wat nog ontbreekt." },
  Groups: {
    none: "Waarom geen oordeel mogelijk is",
    stop: "Waarom niet te bieden",
    gap: "Voordat u biedt",
    caution: "Houd rekening met",
    ok: "Wat ervoor spreekt",
  },

  Reasons: {
    noValue: "De officiële bekendmaking vermeldt geen taxatiewaarde. Zonder die waarde kunnen noch wettelijke drempels noch kosten worden berekend.",
    cancelled: "Volgens het portaal is de zitting geannuleerd.",
    past: "De zittingsdatum ligt in het verleden.",
    unreachable: "Uw doelstellingen zijn bij geen enkel bod haalbaar — zelfs niet bij 0. Lopende kosten en huur dekken ze niet.",
    belowStart: "Uw limiet van {amount} ligt onder het minimumbod van {other}. Een bod zo laag is niet toegestaan.",
    belowHalf: "Uw limiet inclusief in stand blijvende rechten ({amount}) ligt onder 5/10 van de taxatiewaarde ({other}). Op de eerste zitting moet gunning onder deze drempel ambtshalve worden geweigerd — beoordeel opnieuw bij een vervolgzitting.",
    rightStays: "{risk} volgens bron. Dit kan na gunning in stand blijven en u gebruik of waarde ontnemen. Bied pas zodra de rechtbank heeft bevestigd of het vervalt en de waarde ervan is ingevuld onder “In stand blijvende rechten” in de biedlimiet (vul 0 in indien het vervalt).",
    noTargets: "Er is nog geen doelstelling (rendement, cashflow of doorverkoopwaarde) ingevuld in de biedlimietcalculator. Zonder doelstelling is er geen bovengrens.",
    noReport: "Geen taxatierapport geüpload. Rechten, gebreken en bodemverontreiniging zijn daardoor alleen bekend uit de officiële bekendmaking — die daar meestal niets over zegt.",
    noRenovation: "Geen renovatiebudget ingevuld. Vul uw schatting in — of 0 als er geen werk nodig is.",
    noClearance: "Huurders of bewoners mogelijk aanwezig, maar geen ontruimings- of overgangskosten ingevuld (vul 0 in als die er niet zijn).",
    askInspection: "Geef aan of u het object heeft bezichtigd.",
    askOccupancy: "Geef aan wie het object bewoont — voor zover bekend.",
    askRights: "Geef aan of u bij de rechtbank navraag heeft gedaan naar in stand blijvende rechten.",
    rightsOpen: "U heeft de in stand blijvende rechten nog niet gecontroleerd. Alles wat na gunning blijft bestaan moet boven op uw contante bod worden betaald of overgenomen.",
    askCostBasis: "Geef aan waarop uw renovatie- en ontruimingskosten zijn gebaseerd.",
    costsIncomplete: "Een wettelijke kostenpost kan niet uit de officiële bekendmaking worden berekend — de totale kosten zijn onvolledig.",
    contamination: "Bodemverontreiniging vermeld in het taxatierapport. Alleen specialistisch onderzoek kan saneringskosten begroten. Bied niet voordat uw budget is onderbouwd met een offerte.",
    rightPriced: "{risk} volgens bron — met de rechtbank opgehelderd en voor {amount} verwerkt in de biedlimiet.",
    notInside: "U bent niet binnen in het pand geweest. Uw renovatiebudget is dus niet geverifieerd — de stresstest hieronder laat zien hoe kostenoverschrijdingen uw limiet beïnvloeden.",
    reportOutsideOnly: "Ook de gerechtelijke taxateur heeft het interieur niet (volledig) kunnen inspecteren.",
    estimateOnly: "Uw renovatiekosten zijn een eigen schatting, geen aannemersofferte.",
    defects: "Het taxatierapport vermeldt gebreken of schade. Controleer of uw renovatiebudget deze dekt.",
    tenant: "Het object is (waarschijnlijk) verhuurd. Huurovereenkomsten gaan over op de koper — reken met de werkelijke huur, niet met een streefhuur.",
    heritage: "Monumentenstatus volgens bron. Verbouwingen en renovaties vereisen toestemming van monumentenzorg en zijn vaak duurder.",
    easement: "Het taxatierapport vermeldt erfdienstbaarheden of publiekrechtelijke bouwlasten (bijv. recht van overpad). Deze blijven na gunning vaak in stand.",
    contaminationUnclear: "Het taxatierapport laat in het midden of er sprake is van bodemverontreiniging.",
    oldValuation: "De peildatum van de taxatie ligt {years} jaar vóór de zitting. Marktomstandigheden en de staat van het pand kunnen sindsdien zijn veranderd.",
    valueMismatch: "Het taxatierapport vermeldt {amount}, de officiële bekendmaking {other}. Stem met de rechtbank af welk bedrag geldt.",
    sevenTenths: "Uw limiet inclusief in stand blijvende rechten ({amount}) ligt onder 7/10 ({other}). Een gerechtigde schuldeiser kan op de eerste zitting weigering van de gunning verzoeken.",
    atCeiling: "De limiet raakt het berekeningsplafond (driemaal de taxatiewaarde). Uw doelaannames zijn waarschijnlijk te ruim.",
    conflicting: "Bronnen spreken elkaar tegen over “{risk}”.",
    limitBy: "Uw doelstelling “{criterion}” ondersteunt een bod tot {amount}.",
    legalClear: "De limiet ligt boven de wettelijke minimumdrempels voor deze zitting.",
    limitsWaived: "Wettelijke waardedrempels gelden in deze procedure niet meer.",
    rightsClear: "Woonrecht, vruchtgebruik en erfpachtrecht zijn volgens de bronnen uitgesloten.",
  },
  MarketReasons: {
    belowStart: {
      DE: "Uw limiet van {amount} ligt onder het minimumbod van {other}.",
      TR: "Uw limiet van {amount} ligt onder het startbod van {other} (50% van de taxatiewaarde). Zo laag bieden wordt in geen enkele ronde geaccepteerd.",
    },
    rightStays: {
      DE: "{risk} volgens bron. Dit kan na gunning in stand blijven en u gebruik of waarde ontnemen. Bied pas zodra de rechtbank heeft bevestigd of het vervalt en de waarde ervan is ingevuld onder “In stand blijvende rechten” in de biedlimiet (vul 0 in indien het vervalt).",
      TR: "{risk} volgens bron. Of het recht na de veiling blijft bestaan hangt af van het Tapu-register en de Satış şartnamesi. Bied pas zodra u dit heeft geverifieerd en in uw cijfers heeft verwerkt.",
    },
    askRights: {
      DE: "Geef aan of u bij de rechtbank navraag heeft gedaan naar in stand blijvende rechten.",
      TR: "Geef aan of u het Tapu-register en de Satış şartnamesi heeft gecontroleerd op bezwaringen.",
    },
    rightsOpen: {
      DE: "U heeft de rechtbank nog niet gevraagd naar in stand blijvende rechten. Alles wat na gunning blijft bestaan komt boven op uw bod.",
      TR: "U heeft het Tapu-register en de Satış şartnamesi nog niet gecontroleerd. Bezwaringen die de veiling overleven blijven voor uw rekening.",
    },
    tenant: {
      DE: "Het object is (waarschijnlijk) verhuurd. Huurovereenkomsten gaan over op de koper — reken met de werkelijke huur, niet met een streefhuur.",
      TR: "Het object is (waarschijnlijk) bewoond of verhuurd. Ontruiming kan tijd en een aparte procedure kosten — houd hier rekening mee.",
    },
  },
  Actions: {
    limit: "Invullen bij biedlimiet",
    report: "Rapport uploaden",
    questions: "Hieronder beantwoorden",
  },

  Sources: {
    Label: "Bron",
    notice: "Officiële bekendmaking",
    report: "Rapport p. {page}",
    input: "Uw cijfers",
    answer: "Uw antwoord",
    rule: "belowmark-regel",
  },

  Questions: {
    Title: "Wat alleen u kunt weten",
    Lead: "Geen enkel document vertelt u hoe het pand er vandaag van binnen uitziet of wie er woont. Uw antwoorden wegen direct mee in het oordeel — zonder antwoord blijft het punt open.",
    Items: {
      inspection: {
        Label: "Heeft u het object bezichtigd?",
        Hint: "Binnenbezichtigingen zijn bij executieveilingen vaak niet mogelijk.",
        Options: { inside: "Ja, van binnen", outside: "Alleen van buiten", none: "Helemaal niet" },
      },
      rights: {
        Label: "Bij de rechtbank gevraagd naar in stand blijvende rechten?",
        Hint: "De gerechtsambtenaar (Rechtspfleger) kan u op verzoek vóór de zitting het minimumbod en eventuele in stand blijvende rechten meedelen.",
        Options: { confirmed: "Ja, opgehelderd", open: "Nog niet" },
      },
      occupancy: {
        Label: "Wie bewoont het object?",
        Hint: "Uit het taxatierapport, van buren of van de schuldeiser — voor zover bekend.",
        Options: { vacant: "Leegstaand", owner: "Eigenaar", tenant: "Huurder", unknown: "Onbekend" },
      },
      costBasis: {
        Label: "Waarop zijn uw renovatie- en ontruimingskosten gebaseerd?",
        Hint: "Alleen relevant als u kosten heeft ingevuld.",
        Options: { quote: "Offerte / specialist", estimate: "Eigen schatting" },
      },
    },
    Rights: {
      DE: { Label: "Bij de rechtbank gevraagd naar in stand blijvende rechten?", Hint: "De gerechtsambtenaar (Rechtspfleger) kan u op verzoek vóór de zitting het minimumbod en eventuele in stand blijvende rechten meedelen." },
      TR: { Label: "Tapu-register en Satış şartnamesi gecontroleerd op bezwaringen?", Hint: "Aantekeningen (şerhler), vruchtgebruik (intifa) en woonrechten (sükna hakkı) staan in het Tapu-uittreksel en de Satış şartnamesi op e-Satış." },
    },
    Unanswered: "open",
    Reset: "Antwoorden wissen",
    StorageHint: "Uw antwoorden worden uitsluitend in deze browser opgeslagen.",
  },

  Stress: {
    Title: "Stresstest",
    Lead: "Rekenvoorbeeld, geen schatting: wat zou uw biedlimiet zijn als renovatie en ontruiming duurder uitvallen dan ingevuld?",
    Row: "+{pct}% kosten: {limit}",
    Unreachable: "geen enkel bod is rendabel",
    BelowThreshold: "onder wettelijke drempel",
    NoLimit: "niet berekenbaar",
  },

  Unknowables: {
    Title: "Wat belowmark niet kan weten",
    Items: [
      "De actuele staat van het interieur — foto's en rapporten tonen alleen wat de taxateur mocht zien.",
      "De werkelijke renovatiekosten — daarvoor is een deskundige ter plaatse nodig.",
      "Of bewoners vrijwillig vertrekken en hoe lang een ontruiming duurt.",
      "Hoeveel anderen er op de zitting meebieden en hoe hoog zij gaan.",
      "Of de zitting op het laatste moment wordt geannuleerd — controleer dit de dag ervoor opnieuw.",
    ],
  },

  File: {
    Title: "Oordeel",
  },
};
