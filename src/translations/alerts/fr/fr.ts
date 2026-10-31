import { IAlertsTranslation } from "../IAlertsTranslation";

export const ALERTS_FR: IAlertsTranslation = {
  MetaTags: {
    title: "Alertes — Belowmark",
    description: "Recherches enregistrées avec notification par e-mail : soyez informé immédiatement dès qu'une nouvelle procédure correspondante paraît ou qu'une date d'audience change.",
    imgUrl: "https://belowmark.com/og/home.png",
    tags: ["Alertes", "Vente aux enchères forcée", "Recherche enregistrée"],
    url: "https://belowmark.com/app/alerts",
  },
  Nav: "Alertes",

  Page: {
    Eyebrow: "Recherches enregistrées",
    Title: "Alertes",
    Lead: "Chaque alerte est une recherche enregistrée. Dès qu'une nouvelle procédure correspondante paraît ou que le tribunal modifie une date, vous recevez un e-mail avec le numéro de dossier et le lien vers la fiche.",
    Usage: "{count} sur {max} alertes",
    Empty: {
      Title: "Aucune alerte pour le moment.",
      Body: "Définissez vos filtres dans les annonces — Land, type de bien, fourchette de valeur, mot-clé — et enregistrez la recherche comme alerte sous le nombre de résultats.",
      Cta: "Voir les annonces",
    },
    HowItWorks:
      "La comparaison a lieu après chaque mise à jour des données officielles. Seul ce qui figure dans l'annonce officielle est signalé : nouvelle procédure, audience reportée ou annulation. La période et le tri ne font pas partie de l'alerte — elle regarde toujours vers l'avenir.",
  },

  Card: {
    Active: "Active",
    Paused: "En pause",
    Pause: "Mettre en pause",
    Resume: "Reprendre",
    Delete: "Supprimer",
    OpenSearch: "Ouvrir la recherche",
    Matches: "{count} résultats ouverts",
    MatchesOne: "1 résultat ouvert",
    NotifyNew: "Nouvelles procédures",
    NotifyChanges: "Changements de date",
    LastSent: "Dernier e-mail : {date}",
    NeverSent: "Aucun e-mail envoyé",
    LastChecked: "Vérifié : {date}",
    Error: "L'opération a échoué. Veuillez réessayer.",
  },

  Summary: {
    AllRegions: { DE: "Tous les Länder", TR: "Toutes les provinces" },
    AllSegments: "Tous les types de biens",
    Query: "« {query} »",
    Min: "à partir de {value}",
    Max: "jusqu'à {value}",
  },

  Save: {
    Toggle: "Enregistrer la recherche comme alerte",
    Title: "Créer une alerte",
    NameLabel: "Nom",
    NotifyNew: "E-mail en cas de nouvelles procédures",
    NotifyChanges: "E-mail en cas de report ou d'annulation",
    Hint: "Le mot-clé, la région, le type de bien et la fourchette de valeur sont enregistrés. Les résultats actuels sont considérés comme connus — les notifications portent sur la suite.",
    Submit: "Enregistrer l'alerte",
    Pending: "Enregistrement …",
    Saved: "Enregistrée. Vous recevrez un e-mail dès qu'il y aura du nouveau.",
    Manage: "Gérer les alertes",
    Errors: {
      limit: "Vous avez déjà 10 alertes. Supprimez-en une avant d'en créer une nouvelle.",
      invalid: "Veuillez donner un nom à l'alerte et choisir au moins une notification.",
      failed: "L'alerte n'a pas pu être enregistrée. Veuillez réessayer.",
    },
  },

  Mail: {
    Subject: "{count} nouveautés pour vos alertes",
    SubjectOne: "1 nouveauté pour vos alertes",
    Preheader: "Nouvelles procédures et dates modifiées dans vos recherches enregistrées.",
    Greeting: "Bonjour,",
    Intro: "depuis la dernière vérification, voici ce qui a changé dans vos recherches enregistrées :",
    Kinds: { new: "Nouveau", cancelled: "Annulé", reinstated: "Reprogrammé", rescheduled: "Date modifiée" },
    NextDate: "Audience {date}",
    Moved: "auparavant {before}, désormais {after}",
    Value: { DE: "Valeur vénale", TR: "Muhammen bedel" },
    More: "+ {count} autres",
    OpenSearch: "Ouvrir la recherche",
    LockedValues: "Les montants sont visibles dans l'application avec un accès complet.",
    Manage: "Gérer ou mettre en pause les alertes",
    Source: { DE: "Source de toutes les données : zvg-portal.de", TR: "Source de toutes les données : ilan.gov.tr" },
    Signature: "Votre équipe Belowmark",
    Footer: "Belowmark · Ventes aux enchères forcées avec source officielle · belowmark.com",
  },
};
