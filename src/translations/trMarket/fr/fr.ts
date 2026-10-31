import { ITrMarketTranslation } from "../ITrMarketTranslation";

export const TR_MARKET_FR: ITrMarketTranslation = {
  Age: {
    Title: "Ancienneté de la valeur d'estimation",
    Lead: "Le Muhammen bedel est un montant nominal datant de l'année d'ouverture de la procédure. Avec l'inflation turque, ce n'est pas un simple détail sur les dossiers anciens.",
    FileYear: "Année du dossier",
    Basis: "Évaluation fixée au plus tard en décembre {year} — la date la plus tardive possible, soit dans le doute le chiffre le plus prudent.",
    Factor: "Prix à la consommation depuis lors",
    Lost: "Perte de pouvoir d'achat du montant nominal",
    Today: "Valeur d'estimation en livres de {month}",
    TodayNote: "Seul le pouvoir d'achat est converti — il ne s'agit ni d'une nouvelle expertise ni d'un prix de marché.",
    Young: "Dossier de {year} : l'estimation est récente, une correction de l'inflation n'apporte rien ici.",
    NoYear: "Le numéro de dossier n'indique aucune année. Sans année, aucune mise en perspective n'est possible.",
    Unavailable: "La série officielle des prix n'est pas assez récente. Mieux vaut aucun chiffre qu'une donnée figée.",
    Source: "{label}, {source} · état {month}",
  },

  Euro: {
    Title: "Contre-valeur en euros",
    Value: "Valeur d'estimation",
    StartingBid: "Mise à prix",
    AllIn: "Mise à prix frais inclus",
    Rate: "1 € = {rate} · cours d'achat des devises TCMB du {date}",
    Note: "Converti au cours du jour de la Banque centrale, et non au cours du jour du paiement. Le règlement s'effectue en livres turques.",
    Unavailable: "Aucun cours actuel de la Banque centrale n'est disponible{last}. Les montants en euros s'affichent dès que le cours du jour est chargé — aucun ancien cours n'est prolongé.",
    LastRate: " (dernier cours du {date})",
  },

  CheckKit: {
    Title: "Kit de vérification pour e-Satış",
    Lead: "Les photos, le rapport d'expertise et le cahier des charges se trouvent sur e-Satış, uniquement après connexion via e-Devlet. Un lien direct ne transmet pas la recherche — copiez ces références et collez-les sur le portail.",
    Copy: "Copier le kit de vérification",
    Copied: "Copié",
    Open: "Ouvrir e-Satış",
    NotStated: "non renseigné",
  },

  Converter: {
    Title: "Convertisseur de devises ₺ ↔ €",
    Subtitle: "Au cours du jour de la TCMB",
    Lira: "Montant en livres",
    Euro: "Montant en euros",
    Unavailable: "Aucun cours actuel de la Banque centrale n'est disponible{last}. Le convertisseur s'affiche dès que le cours du jour est chargé.",
  },
};
