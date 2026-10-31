import { IVerdictTranslation } from "../IVerdictTranslation";

export const VERDICT_FR: IVerdictTranslation = {
  Section: {
    Eyebrow: "Verdict",
    Title: "Enchérir ou s'abstenir ?",
    Lead: "Un verdict fondé sur l'avis officiel, votre rapport d'expertise, la loi et vos propres chiffres. Il ne dit « enchérir » que lorsqu'aucun point essentiel ne reste en suspens — et cite la source de chaque motif.",
    Disclaimer: "Indication d'investissement issue de vos saisies, ne constituant ni un conseil juridique ni un conseil en investissement. Seuls le livre foncier, le rapport d'expertise et les déclarations du tribunal lors de l'audience font foi.",
  },
  Locked: {
    Title: "Verdict dans l'offre Investor",
    Body: "Le Verdict relie le contrôle des risques, le rapport d'expertise et le plafond d'enchère pour livrer une recommandation claire par bien. Disponible dans l'offre Investor.",
  },

  States: {
    go: { Stamp: "Enchérir", Headline: "Enchérir jusqu'à {amount}", Sub: "D'après vos chiffres et les sources disponibles. Ne surenchérissez pas au-delà." },
    open: { Stamp: "Pas encore prêt", Headline: "Provisoirement jusqu'à {amount}", Sub: "Ce plafond est sous réserve. Il ne deviendra un verdict ferme qu'une fois les points ouverts ci-dessous clarifiés." },
    stop: { Stamp: "Ne pas enchérir", Headline: "Ne pas enchérir", Sub: "Au moins un motif issu des sources s'y oppose clairement — voir ci-dessous." },
    none: { Stamp: "Aucun verdict", Headline: "Aucun verdict possible", Sub: "Cette procédure ne permet aucune évaluation pour le moment." },
  },
  GoUnverified: "Attention : vos coûts de rénovation n'ont été vérifiés ni sur place ni par un devis. Le plafond ne vaut que ce que vaut ce chiffre.",
  OpenNoLimit: { Headline: "Pas encore de plafond", Sub: "Sans vos objectifs dans le plafond d'enchère, il n'y a pas de limite maximale. La liste ci-dessous indique ce qu'il manque encore." },
  Groups: {
    none: "Pourquoi aucun verdict",
    stop: "Pourquoi s'abstenir",
    gap: "Avant d'enchérir",
    caution: "À garder à l'esprit",
    ok: "Ce qui plaide en faveur",
  },

  Reasons: {
    noValue: "L'avis officiel ne mentionne aucune valeur vénale. Sans elle, ni les seuils légaux ni les frais ne peuvent être calculés.",
    cancelled: "Selon le portail, l'audience est annulée.",
    past: "L'audience est située dans le passé.",
    unreachable: "Vos objectifs ne peuvent être atteints à aucune enchère — pas même à 0. Les charges et le loyer n'y suffisent pas.",
    belowStart: "Votre plafond de {amount} est inférieur à l'enchère minimale de {other}. Il est impossible d'enchérir aussi bas.",
    belowHalf: "Votre plafond, droits maintenus compris ({amount}), est inférieur aux 5/10 de la valeur vénale ({other}). Lors de la première audience, l'adjudication est refusée d'office — à réexaminer au plus tôt lors de l'audience suivante.",
    rightStays: "{risk} selon la source. Ce droit peut subsister après l'adjudication et vous priver de l'usage ou de la valeur du bien. N'enchérissez qu'après confirmation du tribunal quant à son extinction et après avoir inscrit sa valeur sous « Droits maintenus » dans le plafond d'enchère (même 0).",
    noTargets: "Aucun objectif (rendement, cashflow ou valeur de revente) n'est encore renseigné dans le plafond d'enchère. Sans objectif, il n'y a pas de limite supérieure.",
    noReport: "Aucun rapport d'expertise importé. Les droits, défauts et pollutions ne sont donc connus que par l'avis officiel — qui n'en dit généralement rien.",
    noRenovation: "Aucun montant de rénovation saisi. Saisissez votre estimation — même 0 s'il n'y a aucun travaux à prévoir.",
    noClearance: "Locataires ou occupants possibles, mais aucun coût d'expulsion ou de transition saisi (même 0).",
    askInspection: "Indiquer si vous avez visité le bien.",
    askOccupancy: "Indiquer qui occupe le bien — pour autant que vous le sachiez.",
    askRights: "Indiquer si vous vous êtes renseigné auprès du tribunal sur les droits maintenus.",
    rightsOpen: "Vous n'avez pas encore vérifié les droits maintenus. Tout ce qui subsiste après l'adjudication s'ajoute à votre enchère.",
    askCostBasis: "Indiquer sur quoi reposent vos coûts de rénovation et d'expulsion.",
    costsIncomplete: "Un poste de frais légaux ne peut pas être calculé à partir de l'avis officiel — les coûts totaux sont incomplets.",
    contamination: "Pollution (Altlasten) mentionnée dans le rapport d'expertise. Seule une étude spécialisée permet de chiffrer la dépollution. N'enchérissez que lorsque vos coûts reposent sur un devis.",
    rightPriced: "{risk} selon la source — clarifié auprès du tribunal et intégré pour {amount} dans le plafond d'enchère.",
    notInside: "Vous n'êtes pas entré dans le bien. Votre budget de rénovation n'est donc pas vérifié — le test de résistance ci-dessous montre l'impact d'un dépassement sur votre plafond.",
    reportOutsideOnly: "L'expert judiciaire n'a pas non plus pu visiter (entièrement) l'intérieur du bien.",
    estimateOnly: "Vos coûts de rénovation reposent sur votre propre estimation, non sur un devis.",
    defects: "Le rapport d'expertise mentionne des défauts ou dégradations. Vérifiez que votre budget de rénovation les couvre.",
    tenant: "Le bien est (probablement) loué. Les baux sont transférés à l'adjudicataire — calculez avec le loyer réel, et non avec un loyer espéré.",
    heritage: "Protection des monuments historiques selon la source. Les transformations et rénovations nécessitent l'accord de l'autorité compétente et coûtent souvent plus cher.",
    easement: "Le rapport d'expertise mentionne des servitudes ou charges foncières (par ex. droit de passage). Elles subsistent souvent après l'adjudication.",
    contaminationUnclear: "Le rapport d'expertise laisse en suspens la question d'une éventuelle pollution du sol.",
    oldValuation: "La date de référence de l'évaluation précède l'audience de {years} ans. Le marché et l'état du bien ont pu évoluer depuis.",
    valueMismatch: "Le rapport d'expertise indique {amount}, l'avis officiel {other}. Clarifiez auprès du tribunal quelle valeur fait foi.",
    sevenTenths: "Votre plafond, droits maintenus compris ({amount}), est inférieur aux 7/10 ({other}). Un créancier inscrit peut demander le refus de l'adjudication lors de la première audience.",
    atCeiling: "Le plafond atteint la limite de calcul (le triple de la valeur vénale). Vos objectifs sont probablement fixés de manière trop optimiste.",
    conflicting: "Les sources se contredisent au sujet de « {risk} ».",
    limitBy: "Votre objectif « {criterion} » permet une enchère jusqu'à {amount}.",
    legalClear: "Le plafond dépasse les seuils légaux de cette audience.",
    limitsWaived: "Les seuils légaux de valeur sont déjà levés dans cette procédure.",
    rightsClear: "Le droit d'habitation, l'usufruit et le droit de superficie sont exclus selon la source.",
  },
  MarketReasons: {
    belowStart: {
      DE: "Votre plafond de {amount} est inférieur à l'enchère minimale de {other}.",
      TR: "Votre plafond de {amount} est inférieur à la mise à prix de {other} (50 % de la valeur d'estimation). Aucune enchère aussi basse n'est admise, quel que soit le tour.",
    },
    rightStays: {
      DE: "{risk} selon la source. Ce droit peut subsister après l'adjudication et vous priver de l'usage ou de la valeur du bien. N'enchérissez qu'après confirmation du tribunal quant à son extinction et après avoir inscrit sa valeur sous « Droits maintenus » dans le plafond d'enchère (même 0).",
      TR: "{risk} selon la source. Le maintien de ce droit après l'adjudication résulte du registre Tapu et de la Satış şartnamesi. N'enchérissez qu'après l'avoir vérifié et intégré dans vos chiffres.",
    },
    askRights: {
      DE: "Indiquer si vous vous êtes renseigné auprès du tribunal sur les droits maintenus.",
      TR: "Indiquer si vous avez vérifié les charges dans le registre Tapu et la Satış şartnamesi.",
    },
    rightsOpen: {
      DE: "Vous n'avez pas encore interrogé le tribunal sur les droits maintenus. Tout ce qui subsiste après l'adjudication est repris en sus de votre enchère.",
      TR: "Vous n'avez pas encore vérifié le registre Tapu ni la Satış şartnamesi. Les charges qui subsistent après l'adjudication restent à votre charge.",
    },
    tenant: {
      DE: "Le bien est (probablement) loué. Les baux sont transférés à l'adjudicataire — calculez avec le loyer réel, et non avec un loyer espéré.",
      TR: "Le bien est (probablement) occupé ou loué. Une expulsion peut prendre du temps et nécessiter une procédure distincte — intégrez-le dans votre calcul.",
    },
  },
  Actions: {
    limit: "Saisir dans le plafond d'enchère",
    report: "Importer le rapport",
    questions: "Répondre ci-dessous",
  },

  Sources: {
    Label: "Source",
    notice: "Avis officiel",
    report: "Rapport p. {page}",
    input: "Vos chiffres",
    answer: "Votre réponse",
    rule: "Règle belowmark",
  },

  Questions: {
    Title: "Ce que vous seul pouvez savoir",
    Lead: "Aucun document ne dit à quoi ressemble l'intérieur aujourd'hui ni qui y habite. Vos réponses alimentent le verdict — sans réponse, le point reste ouvert.",
    Items: {
      inspection: {
        Label: "Avez-vous visité le bien ?",
        Hint: "Les visites intérieures sont souvent impossibles lors des ventes aux enchères forcées.",
        Options: { inside: "Oui, à l'intérieur", outside: "De l'extérieur uniquement", none: "Pas du tout" },
      },
      rights: {
        Label: "Avez-vous interrogé le tribunal sur les droits maintenus ?",
        Hint: "Le greffier (Rechtspfleger) communique sur demande avant l'audience l'enchère minimale et les droits qui subsistent.",
        Options: { confirmed: "Oui, clarifié", open: "Pas encore" },
      },
      occupancy: {
        Label: "Qui occupe le bien ?",
        Hint: "D'après le rapport d'expertise, le voisinage ou le créancier — pour autant que cela soit connu.",
        Options: { vacant: "Libre", owner: "Propriétaire", tenant: "Locataire", unknown: "Je ne sais pas" },
      },
      costBasis: {
        Label: "Sur quoi reposent vos coûts de rénovation et d'expulsion ?",
        Hint: "Pertinent uniquement si vous avez saisi des coûts.",
        Options: { quote: "Devis / professionnel", estimate: "Estimation personnelle" },
      },
    },
    Rights: {
      DE: { Label: "Avez-vous interrogé le tribunal sur les droits maintenus ?", Hint: "Le greffier (Rechtspfleger) communique sur demande avant l'audience l'enchère minimale et les droits qui subsistent." },
      TR: { Label: "Avez-vous vérifié les charges dans le registre Tapu et la Satış şartnamesi ?", Hint: "Les annotations (şerhler), l'usufruit (intifa) et le droit d'habitation (sükna hakkı) figurent dans l'extrait Tapu et dans la Satış şartnamesi sur e-Satış." },
    },
    Unanswered: "ouvert",
    Reset: "Effacer les réponses",
    StorageHint: "Vos réponses restent enregistrées uniquement dans ce navigateur.",
  },

  Stress: {
    Title: "Test de résistance",
    Lead: "Exemple de calcul, non une estimation : quel serait votre plafond si la rénovation et l'expulsion coûtaient plus cher que prévu ?",
    Row: "+{pct} % de coûts : {limit}",
    Unreachable: "aucune enchère pertinente",
    BelowThreshold: "sous le seuil légal",
    NoLimit: "non calculable",
  },

  Unknowables: {
    Title: "Ce que belowmark ne peut pas savoir",
    Items: [
      "L'état intérieur réel — les photos et le rapport d'expertise ne montrent que ce que l'expert a pu voir.",
      "Les coûts réels de rénovation — cela nécessite un professionnel sur place.",
      "Si les occupants partiront volontairement et combien de temps durera une expulsion.",
      "Combien d'autres enchérisseurs participeront et jusqu'où ils monteront.",
      "Si l'audience sera annulée à court terme — vérifiez à nouveau la veille.",
    ],
  },

  File: {
    Title: "Verdict",
  },
};
