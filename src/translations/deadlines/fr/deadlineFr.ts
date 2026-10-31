import { IDeadlineTranslation } from "../IDeadlineTranslation";

export const DEADLINE_FR: IDeadlineTranslation = {
  MetaTags: {
    title: "Compagnon d'échéances — Belowmark",
    description: "Tous les délais de la publication jusqu'à l'adjudication avec référence légale : consignation, date du chèque, audience, teminat. Rappels par e-mail et abonnement calendrier.",
    imgUrl: "https://belowmark.com/og/home.png",
    tags: ["Délais", "Vente aux enchères forcée", "Consignation", "Calendrier"],
    url: "https://belowmark.com/app/termine",
  },
  Nav: "Échéances",

  Section: {
    Eyebrow: "Compagnon d'échéances",
    Title: "Délais & Feuille de route",
    Lead: {
      DE: "Chaque délai jusqu'à l'adjudication, calculé à partir de la date de l'avis officiel et appuyé par son article de loi. Suivez la procédure pour recevoir des rappels par e-mail et dans votre calendrier.",
      TR: "Chaque délai des tours e-Satış, calculé à partir des données de l'İlan et appuyé par la réglementation. Suivez la procédure pour recevoir des rappels par e-mail et dans votre calendrier.",
    },
    Locked: {
      Title: "Délais avec rappels",
      Body: "Le Compagnon d'échéances calcule la consignation, la date du chèque et l'adjudication à partir de l'avis officiel et vous envoie des rappels par e-mail et calendrier. Inclus dans l'offre Investor.",
    },
    NoDates: "L'avis officiel ne mentionne aucune date d'audience ; aucun délai ne peut donc être calculé.",
    Cancelled: "La procédure est annulée. Les délais ne courent plus.",
    Phases: { before: "Avant l'audience", hearing: "Audience", after: "Après l'adjudication" },
    Basis: { law: "Loi", notice: "Avis officiel", user: "Votre saisie", rule: "Recommandation belowmark" },
    Kinds: { deadline: "Échéance", appointment: "Audience", task: "À partir de là", info: "À titre indicatif" },
    AfterAwardEmpty: "Les délais après l'adjudication (paiement, impôts, livre foncier, expulsion) apparaissent ici dès que vous saisissez le résultat de l'audience.",
    Reminders: "Rappel",
    ReminderDay: "1 jour avant",
    ReminderDays: "{days} jours avant",
    ReminderToday: "le jour même",
    Disclaimer: "Calculé hors jours fériés et de manière prudente afin qu'une date ne soit jamais trop tardive. Seuls la loi et la convocation du tribunal font foi ; ceci ne constitue pas un conseil juridique.",
  },

  Status: {
    Past: "passé",
    Today: "aujourd'hui",
    Tomorrow: "demain",
    InDays: "dans {days} jours",
  },

  Follow: {
    Start: "Suivre la procédure",
    Stop: "Ne plus suivre",
    Following: "Vous suivez cette procédure.",
    NotFollowing: "Aucun rappel configuré pour le moment.",
    MailOn: "Rappel e-mail activé",
    MailOff: "Rappel e-mail désactivé",
    Download: "Délais en calendrier (.ics)",
    Overview: "Toutes les échéances",
    Error: "Cela n'a pas fonctionné. Veuillez réessayer.",
  },

  Checklist: {
    Title: "Feuille de route jusqu'à l'audience",
    Hint: "Les cases cochées restent enregistrées dans ce navigateur. Les étapes cochées par belowmark sont détectées automatiquement.",
    Progress: "{done} sur {total} terminées",
    Auto: "détecté",
    Steps: {
      DE: [
        { id: "gutachten", Label: "Faire analyser le rapport d'expertise", Hint: "Importez le rapport d'expertise : le contrôle des risques vérifie les droits, les locataires et l'année de construction." },
        { id: "inspection", Label: "Visiter le bien", Hint: "Au moins de l'extérieur ; les questions associées figurent dans le Verdict." },
        { id: "limit", Label: "Fixer votre plafond d'enchère", Hint: "Jusqu'à quelle enchère l'opération est-elle rentable ? Vos chiffres, votre limite." },
        { id: "bank", Label: "Demander le financement", Hint: "Le dossier bancaire présente à la banque le plan de paiement et les délais." },
        { id: "deposit", Label: "Préparer la sûreté (Sicherheitsleistung)", Hint: "Virement, chèque de banque barré ou caution bancaire : les dates figurent dans la chronologie." },
        { id: "papers", Label: "Imprimer le dossier d'enchérisseur", Hint: "Pièce d'identité, procuration, justificatif de sûreté et votre plafond sur papier." },
      ],
      TR: [
        { id: "gutachten", Label: "Lire le kıymet takdir raporu", Hint: "Importez le rapport : le contrôle des risques vérifie les droits, les locataires et l'état du bien." },
        { id: "inspection", Label: "Visiter le bien", Hint: "Au moins de l'extérieur ; les questions associées figurent dans le Verdict." },
        { id: "limit", Label: "Fixer votre limite de teklif", Hint: "Jusqu'à quelle enchère l'opération est-elle rentable, tapu harcı et KDV inclus ?" },
        { id: "bank", Label: "Clarifier le financement à l'avance", Hint: "Après le tour d'enchères, il ne reste que 7 jours pour payer ; sans accord bancaire préalable, c'est très court." },
        { id: "deposit", Label: "Déposer le teminat", Hint: "En espèces via le portail ou par teminat mektubu : les délais figurent dans la chronologie." },
        { id: "papers", Label: "Vérifier l'accès e-Devlet et au portail", Hint: "Enchérir n'est possible qu'en étant connecté au portail e-Satış via e-Devlet." },
      ],
    },
  },

  Items: {
    DE: {
      Notice: {
        Title: "Publication de l'avis d'enchères",
        Detail: "L'audience doit être publiée au moins six semaines à l'avance. Votre préparation commence ici.",
      },
      Transfer: {
        Title: "Sûreté par virement : créditée en compte",
        Detail: "Les espèces sont exclues. Un virement ne compte que s'il est crédité sur le compte de la caisse du tribunal avant l'audience et que vous en présentez la preuve lors de l'audience. Le tribunal indique le compte et la référence. Calcul prudent : la veille.{amount}",
      },
      Cheque: {
        Title: "Premier jour possible pour le chèque barré (Verrechnungsscheck)",
        Detail: "Un chèque barré (Verrechnungsscheck) n'est valable que s'il est émis au plus tôt le troisième jour ouvrable avant l'audience, par une banque agréée en Allemagne ou la Bundesbank, et payable sur le territoire national. Émis plus tôt, il sera refusé. Calculé avec le samedi comme jour ouvrable et sans jours fériés, donc jamais trop tôt.",
      },
      Hearing: {
        Title: "Audience d'adjudication",
        Detail: "{authority}. Il s'écoule au moins 30 minutes entre l'appel aux enchères et la clôture. À apporter : pièce d'identité, preuve de la sûreté et, en cas de représentation, une procuration authentifiée par notaire.",
      },
      Award: {
        Title: "Prononcé de l'adjudication au plus tard (délai d'ordre)",
        Detail: "L'adjudication est prononcée lors de l'audience ou lors d'une audience de prononcé distincte qui ne doit pas être fixée à plus d'une semaine. Dès le prononcé, vous devenez propriétaire. La date exacte est fixée par le tribunal.",
      },
      Amount: " Montant si un participant exige une sûreté : {amount} (10 % de la valeur vénale).",
    },
    TR: {
      Notice: {
        Title: "Publication de l'İlan",
        Detail: "Le tour d'enchères doit être annoncé sur le portail e-Satış au moins 15 jours avant son ouverture.",
      },
      RoundStart: {
        Title: "Début du {round}e tour (Artırma)",
        Detail: "Les enchères sont désormais ouvertes sur le portail e-Satış ; le tour dure sept jours.{startingBid}",
      },
      Cash: {
        Title: "{round}e Artırma : teminat en espèces jusqu'à 23h30",
        Detail: "Verser la garantie via le portail sur le compte de l'İcra dairesi au plus tard la veille de la clôture du tour à 23h30.{amount}",
      },
      Letter: {
        Title: "{round}e Artırma : teminat mektubu jusqu'à la fermeture des bureaux",
        Detail: "Une lettre de garantie bancaire doit parvenir à l'İcra dairesi au plus tard le jour ouvré précédant la fin du tour, avant la fermeture des bureaux. Les jours fériés ne sont pas déduits : si ce jour est férié, c'est le jour ouvré précédent qui s'applique.",
      },
      RoundEnd: {
        Title: "Fin du {round}e tour (Artırma)",
        Detail: "Si une enchère intervient dans les dix dernières minutes, le tour est prolongé de trois minutes à chaque fois, dans la limite d'une heure au total. Le procès-verbal de résultat est ensuite publié ; vous disposez alors de sept jours pour payer.",
      },
      Amount: " Montant : {amount} (10 % de la valeur d'estimation).",
      StartingBid: " Mise à prix selon l'İlan : {amount}.",
    },
  },

  Page: {
    Eyebrow: "Compagnon d'échéances",
    Title: "Échéances",
    Lead: "Tous les délais des procédures que vous suivez, réunis dans une seule liste. Rappels par e-mail et abonnement dans votre propre calendrier.",
    Count: "{count} suivies",
    Empty: {
      Title: "Aucune procédure suivie pour le moment",
      Body: "Ouvrez une fiche de dossier et cliquez sur « Suivre la procédure » dans la section « Délais & Feuille de route ».",
      Cta: "Aller à la recherche",
    },
    Next: "Prochaine échéance",
    NothingAhead: "Aucune échéance ouverte à venir.",
    OpenListing: "Voir la fiche du dossier",
    Missing: "Ne figure plus dans les données actuelles",
    Feed: {
      Title: "Abonnement calendrier",
      Body: "Ajoutez cette adresse dans Google Agenda, Outlook ou Calendrier Apple comme abonnement (« À partir d'une URL »). Les nouvelles procédures et les dates modifiées se synchronisent automatiquement, avec rappel préalable.",
      Create: "Générer l'adresse d'abonnement",
      Renew: "Générer une nouvelle adresse",
      Copy: "Copier",
      Copied: "Copié",
      Shown: "Visible uniquement maintenant. Nous ne stockons pas cette adresse en clair ; toute personne qui la connaît peut voir vos échéances.",
      Hidden: "Un abonnement est configuré. Adresse perdue ? Générez-en une nouvelle, l'ancienne cessera alors de fonctionner.",
      Error: "Impossible de générer l'adresse.",
    },
    HowItWorks: "Les rappels sont envoyés le matin par e-mail et dans l'abonnement calendrier aux jours indiqués pour chaque délai. Les dates proviennent des avis officiels ; si le tribunal modifie une date, l'échéance suit lors de la prochaine mise à jour.",
  },

  Mail: {
    Subject: "{count} échéances à venir",
    SubjectOne: "Une échéance à venir",
    Preheader: "Votre Compagnon d'échéances belowmark.",
    Greeting: "Bonjour,",
    Intro: "voici les prochaines échéances pour les procédures que vous suivez :",
    Today: "aujourd'hui",
    Tomorrow: "demain",
    InDays: "dans {days} jours",
    OpenListing: "Ouvrir la fiche du dossier",
    Manage: "Gérer les rappels",
    Signature: "Votre équipe belowmark",
    Footer: "Vous recevez cet e-mail parce que vous suivez une procédure. Désinscription sous « Échéances ».",
    Source: "Fondement juridique",
  },

  Ics: {
    CalendarName: "Échéances belowmark",
    Source: "Source",
  },
};
