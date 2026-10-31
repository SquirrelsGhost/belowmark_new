import { IClosingTranslation } from "../IClosingTranslation";
import { CLOSING_TASKS_FR } from "./closingTasksFr";

export const CLOSING_FR: IClosingTranslation = {
  MetaTags: {
    Tasks: {
      title: "Après l'adjudication — Belowmark",
      description: "Liste des tâches après l'adjudication : paiement, droits de mutation, livre foncier, expulsion, assurance et rénovation — avec délais et textes de loi liés.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Adjudication", "Vente aux enchères forcée", "Livre foncier", "Expulsion"],
      url: "https://belowmark.com/app",
    },
    Results: {
      title: "Résultats des audiences — Belowmark",
      description: "Ce que rapportent les ventes judiciaires : prix d'adjudication par rapport à la valeur vénale, à partir des résultats déclarés, anonyme dès cinq audiences par groupe.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Adjudication", "Valeur vénale", "Résultat d'audience", "Vente forcée"],
      url: "https://belowmark.com/app/ergebnisse",
    },
  },

  Section: {
    Eyebrow: "Après l'audience",
    Title: "Résultat & Adjudication",
    Lead: {
      DE: "Étiez-vous présent à l'audience ? Indiquez le montant des enchères. Le portail officiel ne publie aucun résultat — vos déclarations alimentent un aperçu anonyme des prix. Si vous êtes vous-même l'adjudicataire, la liste des tâches vous accompagne jusqu'au livre foncier.",
      TR: "Avez-vous suivi la vente aux enchères ? Indiquez le montant des enchères. Le portail ne publie aucun résultat — vos déclarations alimentent un aperçu anonyme des prix. Si vous avez remporté l'enchère (ihale), la liste des tâches vous accompagne jusqu'au Tapu.",
    },
  },

  Result: {
    Title: "Déclarer le résultat de l'audience",
    Lead: "Uniquement des chiffres, aucun nom. Vous pouvez corriger votre déclaration à tout moment.",
    NotYet: "Vous pourrez saisir un résultat à partir du jour de l'audience.",
    HearingDate: "Date de l'audience",
    Outcome: "Issue",
    Outcomes: {
      awarded: "Adjudication prononcée",
      refused: "Adjudication refusée",
      pending: "Décision ajournée",
      noBids: "Aucune enchère",
      cancelled: "L'audience n'a pas eu lieu",
    },
    HighestBid: {
      DE: { label: "Enchère maximale (Bargebot)", hint: "Tel qu'indiqué au procès-verbal ou dans l'ordonnance d'adjudication" },
      TR: { label: "Prix d'adjudication (ihale bedeli)", hint: "Tel qu'indiqué au procès-verbal de vente" },
    },
    RetainedRights: { label: "Droits maintenus", hint: "S'ils sont mentionnés — ils s'ajoutent au prix économique" },
    BidderCount: { label: "Nombre d'enchérisseurs", hint: "Si vous le savez" },
    Source: "D'où tenez-vous ces chiffres ?",
    Sources: { attended: "Présent à l'audience", protocol: "Procès-verbal / ordonnance", court: "Renseignement du tribunal" },
    IsBuyer: { DE: "J'ai obtenu l'adjudication", TR: "J'ai remporté l'adjudication (ihale)" },
    AwardDate: {
      DE: { label: "Adjudication prononcée le", hint: "Vide = jour de l'audience" },
      TR: { label: "Procès-verbal publié le", hint: "Le délai de paiement de 7 jours court à compter de cette date" },
    },
    Shared: { label: "Inclure anonymement dans l'aperçu des prix", hint: "Seule une médiane par région et par type de bien est affichée, à partir de cinq audiences — jamais votre saisie individuelle." },
    Privacy: "Nous enregistrons la date de l'audience, l'issue, les montants et le nombre d'enchérisseurs pour ce numéro de dossier — jamais les noms des enchérisseurs, adjudicataires ou propriétaires.",
    Save: "Enregistrer le résultat",
    Saved: "Enregistré.",
    SavedBuyer: "Enregistré. Votre liste de tâches est créée.",
    Errors: {
      auth: "Veuillez vous reconnecter.",
      locked: "La liste des tâches fait partie de l'offre Investor.",
      date: "Veuillez saisir une date valide (pas avant l'audience).",
      future: "Les résultats ne peuvent être déclarés qu'à partir du jour de l'audience.",
      outcome: "Veuillez choisir l'issue de l'audience.",
      bid: "En cas d'adjudication, veuillez saisir le montant de l'enchère (nombre entier).",
      ratio: "L'enchère ne correspond pas à la valeur vénale — veuillez vérifier.",
      bidders: "Veuillez saisir un nombre d'enchérisseurs plausible.",
      buyer: "« J'ai obtenu l'adjudication » n'est possible qu'avec l'issue « Adjudication prononcée ».",
      unknown: "L'enregistrement a échoué. Veuillez réessayer.",
    },
    Ratio: "{pct} de la valeur vénale",
    StatsLink: "Voir l'aperçu des prix",
  },

  Teaser: {
    Title: "Votre liste de tâches après l'adjudication",
    Lead: "Paiement, fiscalité, livre foncier, possession, assurance, rénovation — avec vos échéances.",
    Button: "Ouvrir la liste des tâches",
    Progress: "{done} sur {total} terminées",
    Next: "Suivant : {title} · {date}",
    NoDate: "Saisissez la date d'adjudication pour que la liste calcule les délais.",
  },

  Tasks: {
    Kicker: "Après l'adjudication",
    Title: "Liste des tâches",
    Lead: {
      DE: "De l'adjudication jusqu'à l'inscription au livre foncier et à la remise des clés. Nous ne calculons les délais qu'à partir des dates que vous saisissez. Chaque affirmation cite sa disposition légale.",
      TR: "De l'ihale jusqu'à l'inscription au Tapu et à la remise des clés. Nous ne calculons les délais qu'à partir des dates que vous saisissez. Chaque affirmation cite sa disposition légale.",
    },
    Back: "Retour à la fiche du dossier",
    Disclaimer:
      "Cette liste sert d'orientation et ne constitue pas un conseil juridique. Elle résume le texte de loi de manière simplifiée (état au 26.10.2026) et ne connaît pas votre cas particulier. Pour les délais, résiliations et expulsions : consultez le tribunal, un notaire ou un avocat.",
    Locked: {
      Title: "Liste des tâches dans l'offre Investor",
      Body: "Votre résultat est enregistré. La liste des tâches avec échéances et rappels fait partie de l'offre Investor.",
      Cta: "Passer à Investor",
    },
    Dates: {
      Title: "Vos dates",
      Lead: "La liste calcule les délais à partir de ces dates. Laissez vide ce que vous ne savez pas encore.",
      Fields: {
        DE: {
          awardDate: { label: "Adjudication prononcée le", hint: "Obligatoire" },
          distributionDate: { label: "Audience de distribution (Verteilungstermin)", hint: "Figure sur la convocation" },
          taxNoticeDate: { label: "Avis de droits de mutation du", hint: "Date de notification" },
          handoverDate: { label: "Remise des clés / expulsion le", hint: "Prévue ou effectuée" },
        },
        TR: {
          awardDate: { label: "Procès-verbal d'enchères publié le", hint: "Obligatoire — départ des 7 jours" },
          handoverDate: { label: "Remise des clés / expulsion le", hint: "Prévue ou effectuée" },
        },
      },
      FromPortfolio: "Repris de votre portefeuille — veuillez enregistrer.",
      Save: "Enregistrer les dates",
      Saved: "Enregistré.",
      Required: "Veuillez saisir au moins la date d'adjudication.",
      Errors: {
        auth: "Veuillez vous reconnecter.",
        locked: "La liste des tâches fait partie de l'offre Investor.",
        date: "Veuillez saisir au moins la date d'adjudication.",
        unknown: "L'enregistrement a échoué. Veuillez réessayer.",
      },
    },
    Conditions: {
      Title: "Votre situation",
      Lead: "N'affiche que les tâches pertinentes. Mémorisé dans ce navigateur.",
      Items: { tenant: "Il y a des locataires", ownerOccupied: "L'ancien propriétaire y habite encore", condo: "Appartement en copropriété", house: "Maison individuelle ou bi-familiale" },
    },
    Phases: { first: "Les premiers jours", payment: "Paiement", register: "Fiscalité & Livre foncier", possession: "Possession & Locataires", works: "Rénovation & Exploitation" },
    Due: { deadline: "au plus tard le {date}", earliest: "au plus tôt le {date}", on: "à partir du {date}" },
    Missing: "Date manquante : {field}",
    States: { done: "Terminé", overdue: "En retard", soon: "Échéance proche", open: "Ouvert", undated: "Sans date" },
    Basis: { law: "Loi", practice: "Procédure", rule: "Règle Belowmark" },
    Check: "Situation juridique modifiée ou non définitivement tranchée — à vérifier",
    MarkDone: "Terminé",
    MarkOpen: "Rouvrir",
    Sources: "Sources",
    Progress: "{done} sur {total} terminées",
    Items: CLOSING_TASKS_FR,
  },

  Results: {
    Kicker: "Résultats des audiences",
    Title: "Ce qui est réellement payé",
    Lead: "Adjudications déclarées par rapport à la valeur vénale. Les chiffres proviennent des utilisateurs, non du tribunal — ils indiquent un niveau de prix, pas une valeur pour votre bien.",
    Method: {
      Title: "Notre méthode de calcul",
      Items: [
        "Quote-part = (enchère maximale + droits maintenus) ÷ valeur vénale selon l'avis officiel.",
        "Si plusieurs utilisateurs déclarent la même audience, elle compte une seule fois avec la médiane des déclarations.",
        "Les chiffres n'apparaissent qu'à partir de cinq audiences par groupe. En dessous, nous affichons uniquement le nombre.",
        "Aucun nom ni numéro de dossier dans l'aperçu. Vos propres déclarations ne sont visibles que par vous.",
      ],
    },
    Table: { Region: "Région", Segment: "Type de bien", Awarded: "Adjudications", Median: "Médiane", Range: "Moitié centrale", Bidders: "Enchérisseurs (médiane)", Reported: "Audiences déclarées" },
    AllSegments: "Tous les types de biens",
    Total: "Total",
    OtherRegion: "Sans région",
    TooFew: "{n} — trop peu (dès {min})",
    Empty: "Aucune déclaration sur votre marché pour le moment. L'aperçu se remplit dès que des utilisateurs saisissent des résultats d'audience sur la fiche du dossier sous « Résultat & Adjudication ».",
    Locked: "L'aperçu des prix fait partie de l'offre Investor. Vous pouvez tout de même déclarer un résultat.",
    Own: { Title: "Vos déclarations", Lead: "Visibles uniquement par vous.", Empty: "Vous n'avez encore rien déclaré.", Shared: "dans l'aperçu", Private: "privé", Buyer: "Votre adjudication" },
  },
};
