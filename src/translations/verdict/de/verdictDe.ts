import { IVerdictTranslation } from "../IVerdictTranslation";

export const VERDICT_DE: IVerdictTranslation = {
  Section: {
    Eyebrow: "Urteil",
    Title: "Bieten oder lassen?",
    Lead: "Ein Urteil aus Bekanntmachung, Ihrem Gutachten, dem Gesetz und Ihren eigenen Zahlen. Es sagt erst „bieten“, wenn nichts Wesentliches mehr offen ist — und nennt zu jedem Grund die Quelle.",
    Disclaimer: "Anlagehinweis aus Ihren Angaben, keine Rechts- oder Anlageberatung. Maßgeblich sind Grundbuch, Gutachten und die Angaben des Gerichts im Termin.",
  },
  Locked: {
    Title: "Urteil im Investor-Plan",
    Body: "Das Urteil verbindet Risiko-Check, Gutachten und Bietlimit zu einer klaren Empfehlung pro Objekt. Es steht im Investor-Plan zur Verfügung.",
  },

  States: {
    go: { Stamp: "Bieten", Headline: "Bieten bis {amount}", Sub: "Nach Ihren Zahlen und den vorliegenden Quellen. Darüber nicht mitbieten." },
    open: { Stamp: "Noch nicht bietreif", Headline: "Vorläufig bis {amount}", Sub: "Dieses Limit steht unter Vorbehalt. Erst wenn die offenen Punkte unten geklärt sind, wird daraus ein Urteil." },
    stop: { Stamp: "Nicht bieten", Headline: "Nicht bieten", Sub: "Mindestens ein Grund spricht nach den Quellen klar dagegen — siehe unten." },
    none: { Stamp: "Kein Urteil", Headline: "Kein Urteil möglich", Sub: "Für dieses Verfahren lässt sich derzeit nichts beurteilen." },
  },
  GoUnverified: "Achtung: Ihre Sanierungskosten sind weder vor Ort noch durch ein Angebot geprüft. Das Limit ist nur so gut wie diese Zahl.",
  OpenNoLimit: { Headline: "Noch kein Limit", Sub: "Ohne Ihre Ziele im Bietlimit gibt es keine Obergrenze. Die Liste unten zeigt, was noch fehlt." },
  Groups: {
    none: "Warum kein Urteil",
    stop: "Warum nicht",
    gap: "Bevor Sie bieten",
    caution: "Im Blick behalten",
    ok: "Was dafür spricht",
  },

  Reasons: {
    noValue: "Die Bekanntmachung nennt keinen Verkehrswert. Ohne ihn lassen sich weder Grenzen noch Kosten berechnen.",
    cancelled: "Der Termin ist laut Portal aufgehoben.",
    past: "Der Termin liegt in der Vergangenheit.",
    unreachable: "Ihre Ziele lassen sich bei keinem Gebot erreichen — nicht einmal bei 0. Kosten und Miete reichen dafür nicht.",
    belowStart: "Ihr Limit von {amount} liegt unter dem Mindestgebot von {other}. So niedrig kann nicht geboten werden.",
    belowHalf: "Ihr Limit samt bestehen bleibender Rechte ({amount}) liegt unter 5/10 des Verkehrswerts ({other}). Im ersten Termin wird ein solcher Zuschlag von Amts wegen versagt — frühestens im Folgetermin wieder prüfen.",
    rightStays: "{risk} laut Quelle. Es kann nach dem Zuschlag bestehen bleiben und Ihnen Nutzung oder Wert nehmen. Erst bieten, wenn das Gericht bestätigt hat, ob es erlischt, und sein Wert im Bietlimit unter „Bestehenbleibende Rechte“ steht (auch 0).",
    noTargets: "Im Bietlimit steht noch kein Ziel (Rendite, Cashflow oder Weiterverkaufswert). Ohne Ziel gibt es keine Obergrenze.",
    noReport: "Kein Gutachten hochgeladen. Rechte, Mängel und Altlasten sind damit nur aus der Bekanntmachung bekannt — und die sagt dazu meist nichts.",
    noRenovation: "Kein Sanierungsbetrag eingetragen. Tragen Sie Ihre Schätzung ein — auch 0, wenn nichts zu tun ist.",
    noClearance: "Mieter oder Bewohner möglich, aber keine Räumungs- oder Übergangskosten eingetragen (auch 0).",
    askInspection: "Angeben, ob Sie das Objekt besichtigt haben.",
    askOccupancy: "Angeben, wer das Objekt nutzt — soweit Sie es wissen.",
    askRights: "Angeben, ob Sie die bestehenbleibenden Rechte beim Gericht erfragt haben.",
    rightsOpen: "Sie haben die Rechte noch nicht geprüft. Was nach dem Zuschlag bestehen bleibt, zahlen Sie zusätzlich zum Gebot.",
    askCostBasis: "Angeben, worauf Ihre Sanierungs- und Räumungskosten beruhen.",
    costsIncomplete: "Eine gesetzliche Kostenposition lässt sich aus der Bekanntmachung nicht berechnen — die Gesamtkosten sind unvollständig.",
    contamination: "Altlasten laut Gutachten. Was die Beseitigung kostet, weiß erst ein Fachgutachten. Bieten Sie erst, wenn Ihre Kosten auf einem Angebot beruhen.",
    rightPriced: "{risk} laut Quelle — beim Gericht geklärt und mit {amount} im Bietlimit eingerechnet.",
    notInside: "Sie waren nicht im Objekt. Ihr Sanierungsbetrag ist damit ungeprüft — der Stresstest unten zeigt, was Mehrkosten mit dem Limit machen.",
    reportOutsideOnly: "Auch der Gutachter war nicht (vollständig) im Objekt.",
    estimateOnly: "Ihre Sanierungskosten sind eine eigene Schätzung, kein Angebot.",
    defects: "Das Gutachten nennt Mängel oder Schäden. Prüfen Sie, ob Ihr Sanierungsbetrag sie abdeckt.",
    tenant: "Das Objekt ist (vermutlich) vermietet. Mietverträge gehen auf den Ersteher über — rechnen Sie mit der tatsächlichen Miete, nicht mit einer Wunschmiete.",
    heritage: "Denkmalschutz laut Quelle. Umbau und Sanierung brauchen die Zustimmung der Denkmalbehörde und werden oft teurer.",
    easement: "Das Gutachten nennt Dienstbarkeiten oder Baulasten (z. B. Wegerecht). Sie bleiben oft bestehen.",
    contaminationUnclear: "Ob Altlasten vorliegen, lässt das Gutachten offen.",
    oldValuation: "Der Wertermittlungsstichtag liegt {years} Jahre vor dem Termin. Markt und Zustand können sich seither verändert haben.",
    valueMismatch: "Das Gutachten nennt {amount}, die Bekanntmachung {other}. Beim Gericht klären, welcher Wert gilt.",
    sevenTenths: "Ihr Limit samt bestehen bleibender Rechte ({amount}) liegt unter 7/10 ({other}). Ein Berechtigter kann im ersten Termin die Versagung des Zuschlags beantragen.",
    atCeiling: "Das Limit stößt an die Rechengrenze (das Dreifache des Verkehrswerts). Ihre Ziele sind vermutlich zu großzügig angesetzt.",
    conflicting: "Zu „{risk}“ widersprechen sich die Quellen.",
    limitBy: "Ihr Ziel „{criterion}“ trägt ein Gebot bis {amount}.",
    legalClear: "Das Limit liegt über den gesetzlichen Grenzen dieses Termins.",
    limitsWaived: "Die Wertgrenzen sind in diesem Verfahren bereits entfallen.",
    rightsClear: "Wohnrecht, Nießbrauch und Erbbaurecht sind laut Quelle ausgeschlossen.",
  },
  MarketReasons: {
    belowStart: {
      DE: "Ihr Limit von {amount} liegt unter dem Mindestgebot von {other}.",
      TR: "Ihr Limit von {amount} liegt unter dem Startgebot von {other} (50 % des Schätzwerts). So niedrig kann in keiner Runde geboten werden.",
    },
    rightStays: {
      DE: "{risk} laut Quelle. Es kann nach dem Zuschlag bestehen bleiben und Ihnen Nutzung oder Wert nehmen. Erst bieten, wenn das Gericht bestätigt hat, ob es erlischt, und sein Wert im Bietlimit unter „Bestehenbleibende Rechte“ steht (auch 0).",
      TR: "{risk} laut Quelle. Ob das Recht nach dem Zuschlag bestehen bleibt, ergibt sich aus Tapu und Satış şartnamesi. Erst bieten, wenn Sie das geprüft und in Ihren Zahlen berücksichtigt haben.",
    },
    askRights: {
      DE: "Angeben, ob Sie die bestehenbleibenden Rechte beim Gericht erfragt haben.",
      TR: "Angeben, ob Sie Tapu-Kaydı und Satış şartnamesi auf Lasten geprüft haben.",
    },
    rightsOpen: {
      DE: "Sie haben die bestehenbleibenden Rechte noch nicht beim Gericht erfragt. Was nach dem Zuschlag bestehen bleibt, übernehmen Sie zusätzlich zum Gebot.",
      TR: "Sie haben Tapu-Kaydı und Satış şartnamesi noch nicht geprüft. Lasten, die nach dem Zuschlag bleiben, tragen Sie zusätzlich.",
    },
    tenant: {
      DE: "Das Objekt ist (vermutlich) vermietet. Mietverträge gehen auf den Ersteher über — rechnen Sie mit der tatsächlichen Miete, nicht mit einer Wunschmiete.",
      TR: "Das Objekt ist (vermutlich) bewohnt oder vermietet. Eine Räumung kann Zeit und ein eigenes Verfahren kosten — rechnen Sie das ein.",
    },
  },
  Actions: {
    limit: "Im Bietlimit eintragen",
    report: "Gutachten hochladen",
    questions: "Unten beantworten",
  },

  Sources: {
    Label: "Quelle",
    notice: "Bekanntmachung",
    report: "Gutachten S. {page}",
    input: "Ihre Zahlen",
    answer: "Ihre Angabe",
    rule: "belowmark-Regel",
  },

  Questions: {
    Title: "Was nur Sie wissen können",
    Lead: "Kein Dokument sagt, wie es drinnen aussieht oder wer dort wohnt. Ihre Antworten fließen ins Urteil ein — ohne Antwort bleibt der Punkt offen.",
    Items: {
      inspection: {
        Label: "Haben Sie das Objekt besichtigt?",
        Hint: "Innenbesichtigungen sind bei Zwangsversteigerungen oft nicht möglich.",
        Options: { inside: "Ja, innen", outside: "Nur von außen", none: "Gar nicht" },
      },
      rights: { Label: "", Hint: "", Options: { confirmed: "Ja, geklärt", open: "Noch nicht" } },
      occupancy: {
        Label: "Wer nutzt das Objekt?",
        Hint: "Aus Gutachten, Nachbarn oder Gläubiger — soweit bekannt.",
        Options: { vacant: "Leer", owner: "Eigentümer", tenant: "Mieter", unknown: "Weiß ich nicht" },
      },
      costBasis: {
        Label: "Worauf beruhen Ihre Sanierungs- und Räumungskosten?",
        Hint: "Nur relevant, wenn Sie Kosten eingetragen haben.",
        Options: { quote: "Angebot / Fachmann", estimate: "Eigene Schätzung" },
      },
    },
    Rights: {
      DE: { Label: "Bestehenbleibende Rechte beim Gericht erfragt?", Hint: "Das geringste Gebot und die Rechte, die bestehen bleiben, nennt der Rechtspfleger auf Nachfrage vor dem Termin." },
      TR: { Label: "Tapu-Kaydı und Satış şartnamesi auf Lasten geprüft?", Hint: "Şerhler, İntifa und Sükna hakkı stehen im Tapu-Auszug und in der Satış şartnamesi auf e-Satış." },
    },
    Unanswered: "offen",
    Reset: "Antworten löschen",
    StorageHint: "Ihre Antworten bleiben nur in diesem Browser gespeichert.",
  },

  Stress: {
    Title: "Stresstest",
    Lead: "Rechenbeispiel, keine Schätzung: Was wäre Ihr Limit, wenn Sanierung und Räumung teurer werden als eingetragen?",
    Row: "+{pct} % Kosten: {limit}",
    Unreachable: "kein Gebot mehr sinnvoll",
    BelowThreshold: "unter der gesetzlichen Grenze",
    NoLimit: "nicht berechenbar",
  },

  Unknowables: {
    Title: "Was belowmark nicht wissen kann",
    Items: [
      "Den Zustand innen — Fotos und Gutachten zeigen nur, was der Gutachter sehen durfte.",
      "Die echten Sanierungskosten — dafür braucht es einen Fachmann vor Ort.",
      "Ob Bewohner freiwillig ausziehen und wie lange eine Räumung dauert.",
      "Wie viele andere mitbieten und wie hoch.",
      "Ob der Termin kurzfristig aufgehoben wird — am Vortag erneut prüfen.",
    ],
  },

  File: {
    Title: "Urteil",
  },
};
