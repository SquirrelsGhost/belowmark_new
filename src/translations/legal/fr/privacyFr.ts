import { filled, LEGAL_OPERATOR, operatorAddress } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export const PRIVACY_FR: LegalDocument = {
  title: "Politique de confidentialité",
  asOf: "Mise à jour : 31 octobre 2026",
  basis: "Informations conformément aux articles 13 et 14 du Règlement général sur la protection des données (RGPD).",
  sections: [
    {
      id: "verantwortlicher",
      heading: "1. Responsable du traitement",
      paragraphs: [
        `${operatorAddress()}. E-Mail ${LEGAL_OPERATOR.email}, Téléphone ${LEGAL_OPERATOR.phone}. Nous n'avons pas désigné de délégué à la protection des données car aucune obligation légale ne l'impose.`,
      ],
    },
    {
      id: "aufruf",
      heading: "2. Consultation du site web",
      paragraphs: [
        "Lors de l'accès à chaque page, le serveur traite les données techniquement nécessaires : adresse IP, horodatage, adresse demandée, identifiant du navigateur et code de réponse du serveur. La base juridique est l'art. 6 par. 1 point f du RGPD (intérêt légitime à un fonctionnement sûr et sans perturbation).",
        `L'application elle-même n'écrit aucun journal d'accès. Des journaux techniques peuvent être générés chez l'hébergeur : ${filled(LEGAL_OPERATOR.hosting, "Indiquer l'hébergeur, l'emplacement du serveur et la durée de conservation")}.`,
      ],
    },
    {
      id: "konto",
      heading: "3. Compte et connexion",
      paragraphs: [
        "Pour un compte, nous enregistrons : l'adresse e-mail, une empreinte cryptographique du mot de passe (scrypt, jamais en clair), le marché et la langue choisis, la date de confirmation de l'e-mail, la fin de la période d'essai, la formule souscrite et sa durée ainsi que la date de dernière connexion. La base juridique est l'art. 6 par. 1 point b du RGPD (exécution du contrat).",
        "Pour chaque connexion, nous gérons une session avec une empreinte du navigateur, une adresse IP tronquée et la date d'expiration afin de détecter les cookies de session volés et de pouvoir déconnecter tous les appareils (art. 6 par. 1 point f du RGPD).",
        "Lors de l'inscription et de la connexion, le navigateur calcule une empreinte matérielle à partir de caractéristiques techniques (carte graphique, écran, cœurs de processeur, fuseau horaire) et l'enregistre dans le stockage local (« ec_hw_id ») dans le seul but de reconnaître les appareils bannis et de protéger les comptes contre les attaques automatisées (§ 25 al. 2 n° 2 TDDDG, art. 6 par. 1 point f du RGPD).",
        "Nous vérifions les nouveaux mots de passe par rapport aux fuites de données connues (Have I Been Pwned) en ne transmettant que les cinq premiers caractères d'un hachage SHA-1 (k-anonymat, art. 6 par. 1 point f du RGPD).",
        "Pour prévenir les abus, nous comptabilisons les requêtes par adresse IP et par adresse e-mail sur de courtes fenêtres temporelles.",
      ],
    },
    {
      id: "app",
      heading: "4. Contenus enregistrés dans votre compte",
      paragraphs: [
        "La liste de favoris avec notes et les recherches enregistrées (alertes) sont conservées dans notre base de données. Les cahiers des charges téléversés sont analysés ; seul le résultat de l'analyse (nom du fichier, extraits trouvés avec numéro de page) est enregistré, et non le fichier PDF. Base juridique : art. 6 par. 1 point b du RGPD.",
        "Si l'analyse avancée est activée, le texte du document est transmis à notre sous-traitant IA (clauses contractuelles types de l'UE conformément à l'art. 46 par. 2 point c du RGPD).",
        "La liste de contrôle, les calculs de limite d'enchère, vos notes d'évaluation, les valeurs comparables et le dossier bancaire sont enregistrés uniquement dans votre navigateur (stockage local « belowmark:… ») et n'atteignent jamais notre serveur.",
      ],
    },
    {
      id: "zahlung",
      heading: "5. Commande et paiement",
      paragraphs: [
        "Lors d'une commande, nous enregistrons la formule, le prix, le marché, la version des conditions générales, l'horodatage de votre accord pour le début immédiat de l'exécution et le statut du paiement (art. 6 par. 1 points b et c du RGPD).",
        "Le paiement s'effectue sur la page de paiement de Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Dublin 2, Irlande. Vous saisissez vos coordonnées de paiement directement chez Stripe ; elles ne nous parviennent jamais. Stripe nous transmet un identifiant client, le statut du paiement et la facture (politique de confidentialité de Stripe : stripe.com/fr/privacy).",
        "La page de paiement de Stripe se trouve sur un domaine Stripe. Aucun script externe de Stripe n'est intégré sur belowmark.com.",
        "Nous conservons les factures et pièces comptables aussi longtemps que l'exigent le droit commercial et fiscal (§ 147 AO, § 257 HGB).",
      ],
    },
    {
      id: "erklaerungen",
      heading: "6. Résiliation et rétractation",
      paragraphs: [
        "Les déclarations envoyées via « Résilier les contrats ici » et « Se rétracter du contrat » sont enregistrées avec nom, adresse e-mail, référence du contrat, contenu ainsi que date et heure de réception, et confirmées par e-mail. Elles sont conservées pendant trois ans à compter de la fin de l'année de réception (art. 6 par. 1 points c et f du RGPD).",
      ],
    },
    {
      id: "mail",
      heading: "7. Courriers électroniques",
      paragraphs: [
        `Nous n'envoyons que des e-mails strictement liés au contrat : liens de confirmation, liens de mot de passe, confirmations de commande et de résiliation ainsi que les alertes que vous avez créées. Aucune publicité, aucune newsletter, aucune mesure d'ouverture ou de clic. Envoi via ${filled(LEGAL_OPERATOR.mailProvider, "Indiquer le prestataire SMTP")}.`,
      ],
    },
    {
      id: "cookies",
      heading: "8. Cookies et stockage local",
      paragraphs: [
        "Nous ne déposons aucun cookie d'analyse, de publicité ou de suivi et n'intégrons aucun service tiers de ce type. C'est pourquoi aucune bannière de consentement n'est affichée.",
        "Cookie de session (« __Host-bm_session ») : maintient la connexion active ; strictement nécessaire au service demandé (§ 25 al. 2 n° 2 TDDDG). Il expire à la fermeture du navigateur ou au bout de 30 jours si l'option « Rester connecté » est cochée.",
        "« BELOWMARK_COUNTRY » et « BELOWMARK_MARKET » (un an chacun) : mémorisent le pays et le marché choisis afin d'adapter la langue et les tarifs.",
        "Les polices de caractères sont chargées depuis notre propre serveur, et non depuis Google.",
      ],
    },
    {
      id: "karten",
      heading: "9. Cartes et vues aériennes",
      paragraphs: [
        "Sur la page de détail d'un bien, votre navigateur charge les tuiles cartographiques directement depuis basemap.de, OpenStreetMap ainsi que les vues aériennes depuis Esri (server.arcgisonline.com). Ces fournisseurs reçoivent votre adresse IP et l'adresse de la tuile (art. 6 par. 1 point f du RGPD).",
        "Les liens vers Google Maps, les portails judiciaires et les portails d'annonces n'ouvrent des pages externes que lorsque vous cliquez dessus.",
      ],
    },
    {
      id: "dauer",
      heading: "10. Durée de conservation et suppression",
      paragraphs: [
        "Nous conservons les données du compte jusqu'à ce que vous supprimiez votre compte. Dans votre compte, sous « Vos données », vous pouvez télécharger toutes les données enregistrées au format JSON et supprimer vous-même le compte. Les commandes et déclarations sont conservées sans lien avec votre compte uniquement pendant les délais légaux de conservation fiscale.",
        "Les liens à usage unique (confirmation d'e-mail, réinitialisation du mot de passe) sont supprimés dès leur utilisation et expirent respectivement après 24 heures ou une heure.",
      ],
    },
    {
      id: "rechte",
      heading: "11. Vos droits",
      paragraphs: [
        "Vous disposez d'un droit d'accès (art. 15), de rectification (art. 16), d'effacement (art. 17), de limitation du traitement (art. 18), de portabilité des données (art. 20) et d'opposition (art. 21 du RGPD). Vous pouvez nous contacter à l'adresse indiquée ci-dessus ou déclencher l'exportation et la suppression directement depuis votre compte.",
        `Vous avez le droit d'introduire une réclamation auprès d'une autorité de contrôle de la protection des données, notamment celle compétente pour notre siège : ${LEGAL_OPERATOR.supervisoryAuthority}.`,
        "Aucune prise de décision automatisée ni aucun profilage au sens de l'art. 22 du RGPD n'a lieu.",
      ],
    },
  ],
};
