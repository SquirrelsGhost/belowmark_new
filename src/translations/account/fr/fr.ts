import { IAccountTranslation } from "../IAccountTranslation";

export const ACCOUNT_FR: IAccountTranslation = {
  Nav: {
    Label: "Rubriques de votre compte",
    Sections: {
      uebersicht: { Title: "Aperçu", Hint: "Informations et statut" },
      tarif: { Title: "Forfait et factures", Hint: "Durée, PDF, adresse" },
      sicherheit: { Title: "Sécurité", Hint: "Mot de passe, appareils" },
      daten: { Title: "Vos données", Hint: "Exporter, supprimer" },
    },
  },

  Overview: {
    Title: "En un coup d'œil",
    Description: "L'état de votre compte. Les détails figurent dans les rubriques à gauche.",
    Plan: "Forfait",
    PlanCta: "Forfait et factures",
    LatestInvoice: "Dernière facture",
    NoInvoice: "Aucune facture pour le moment.",
    AllInvoices: "Toutes les factures",
    Research: "Recherche",
    ResearchBody: "Annonces judiciaires, carte, sélection et calculateur d'enchère.",
    ResearchCta: "Accéder à la recherche",
  },

  Portal: {
    Label: "Moyens de paiement chez Stripe",
    Hint: "Ouvre le portail client Stripe pour modifier votre carte ou gérer votre abonnement. Vos factures se trouvent juste en dessous.",
    Unavailable: "Vous pourrez gérer vos moyens de paiement chez Stripe dès que vous aurez réglé une première fois via Stripe.",
  },

  Invoices: {
    Title: "Factures",
    Description: "Chaque paiement fait l'objet d'une facture numérotée par ordre chronologique. Disponible en PDF à tout moment, autant de fois que souhaité.",
    Empty: "Aucune facture pour le moment. Elle apparaîtra ici dès qu'un paiement sera confirmé.",
    Count: "{count} factures",
    CountOne: "1 facture",
    Columns: { Number: "Numéro · Date", Service: "Prestation", Amount: "Montant", Document: "Document" },
    Paid: "Payée",
    Test: "Test",
    Upgrade: "Mise à niveau",
    Renewal: "Renouvellement",
    Download: "PDF",
    View: "Voir",
    DownloadLabel: "Télécharger la facture {number} en PDF",
    Note: "Conservez vos factures dans vos dossiers. Après la suppression d'un compte, nous les conservons uniquement à des fins fiscales et comptables.",
  },

  Address: {
    Title: "Adresse de facturation",
    Description: "Figure sur vos factures. Jusqu'à 250 €, l'adresse e-mail suffit ; au-delà et pour votre comptabilité, le nom et l'adresse postale sont requis.",
    Missing: "Aucune adresse de facturation enregistrée. Les factures précédentes sans adresse la reprendront une seule fois dès que vous l'enregistrerez.",
    Empty: "Aucune adresse de facturation enregistrée.",
    Add: "Ajouter une adresse",
    Name: "Nom ou société",
    NameHint: "Tel qu'il doit figurer sur la facture.",
    Address: "Adresse postale",
    AddressHint: "Rue et numéro, code postal et ville, pays — une information par ligne.",
    VatId: "N° de TVA intracommunautaire",
    VatIdHint: "Uniquement pour les entreprises, ex. DE123456789.",
    Optional: "facultatif",
    Edit: "Modifier",
    Cancel: "Annuler",
    Submit: "Enregistrer l'adresse",
    Pending: "Enregistrement …",
    Saved: "Enregistré. Les nouvelles factures porteront cette adresse.",
    ErrorTitle: "Veuillez vérifier vos informations",
    Errors: {
      name_required: "Veuillez indiquer un nom.",
      address_required: "Veuillez indiquer une adresse.",
      too_long: "L'une des informations est trop longue.",
      rate_limited: "Trop de tentatives. Veuillez patienter un instant.",
      unknown: "L'opération a échoué. Veuillez réessayer.",
    },
  },
};
