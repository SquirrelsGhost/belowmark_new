import { operatorAddress, LEGAL_OPERATOR } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

const contact = `${operatorAddress()}, E-Mail ${LEGAL_OPERATOR.email}, Téléphone ${LEGAL_OPERATOR.phone}`;

export const WITHDRAWAL_FR: LegalDocument = {
  title: "Informations sur le droit de rétractation et extinction pour les contenus numériques",
  asOf: "Mise à jour : 31 octobre 2026",
  basis: "Pour les consommateurs dans les contrats portant sur des contenus numériques non fournis sur un support matériel (§§ 312g, 355, 356 al. 5 BGB / Art. L221-28 du Code de la consommation).",
  sections: [
    {
      id: "erloeschen",
      heading: "1. Extinction anticipée du droit de rétractation (§ 356 al. 5 BGB)",
      paragraphs: [
        "Dans un contrat portant sur la fourniture de contenus numériques non fournis sur un support matériel (activation de l'accès numérique complet aux mises à prix, analyses de cahiers des charges, seuils d'enchères, calculateurs de délais et documents sur Belowmark), le droit de rétractation s'éteint immédiatement dès le début de l'exécution du contrat lorsque :",
        "1. vous avez expressément consenti à ce que nous commencions l'exécution du contrat avant l'expiration du délai de rétractation,",
        "2. vous avez confirmé avoir connaissance qu'en donnant votre consentement, vous perdez votre droit de rétractation dès le début de l'exécution du contrat, et",
        "3. nous vous avons fourni une confirmation conformément au § 312f al. 2 BGB sur un support durable (par e-mail).",
        "Étant donné que vous donnez ce consentement et cette confirmation lors du processus de commande en acceptant les Conditions générales avant de cliquer sur « Commander avec obligation de paiement » et que votre accès complet est activé immédiatement après confirmation du paiement, toute rétractation est exclue conformément au § 356 al. 5 BGB une fois l'accès numérique activé.",
      ],
    },
    {
      id: "recht",
      heading: "2. Droit légal de rétractation (avant le début de l'exécution)",
      paragraphs: [
        "Si, à titre exceptionnel, l'exécution du contrat (activation de l'accès numérique) n'a pas encore commencé, le droit légal de rétractation suivant s'applique :",
        "Vous avez le droit de vous rétracter du présent contrat sans donner de motif dans un délai de quatorze jours. Le délai de rétractation expire quatorze jours après le jour de la conclusion du contrat.",
        `Pour exercer le droit de rétractation, vous devez nous notifier (${contact}) votre décision de rétractation du présent contrat au moyen d'une déclaration dénuée d'ambiguïté (par exemple, lettre envoyée par la poste ou courrier électronique). Vous pouvez utiliser le modèle de formulaire de rétractation mais ce n'est pas obligatoire.`,
        "Pour que le délai de rétractation soit respecté, il suffit que vous transmettiez votre communication relative à l'exercice du droit de rétractation avant l'expiration du délai de rétractation et avant l'activation de l'accès numérique.",
      ],
    },
    {
      id: "folgen",
      heading: "3. Effets d'une rétractation valable (avant l'activation)",
      paragraphs: [
        "En cas de rétractation valable de votre part avant que le droit de rétractation ne se soit éteint par l'activation de l'accès numérique conformément au § 356 al. 5 BGB, nous vous rembourserons tous les paiements reçus de vous, sans retard excessif et, en tout état de cause, au plus tard quatorze jours à compter du jour où nous sommes informés de votre décision de rétractation. Nous procéderons au remboursement en utilisant le même moyen de paiement que celui que vous aurez utilisé pour la transaction initiale.",
      ],
    },
    {
      id: "praxis",
      heading: "4. Résiliation des abonnements en cours",
      paragraphs: [
        "Indépendamment de l'extinction du droit de rétractation en cas d'activation immédiate (§ 356 al. 5 BGB), vous pouvez résilier à tout moment un abonnement mensuel en cours (Investor Mensuel ou Pro Mensuel) pour la fin du mois de facturation déjà payé — en un clic dans votre compte ou via « Résilier les contrats ici » au bas de chaque page.",
      ],
    },
    {
      id: "formular",
      heading: "5. Modèle de formulaire de rétractation",
      paragraphs: [
        "(Applicable uniquement si le droit de rétractation ne s'est pas déjà éteint conformément au § 356 al. 5 BGB du fait de l'activation de l'accès numérique.)",
        `À l'attention de ${operatorAddress()}, E-Mail ${LEGAL_OPERATOR.email} :`,
        "Je/Nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation du contrat portant sur la fourniture des contenus numériques suivants (*) :",
        "Commandé le (*) :",
        "Nom du (des) consommateur(s) :",
        "Adresse du (des) consommateur(s) :",
        "Signature du (des) consommateur(s) (uniquement en cas de notification du présent formulaire sur papier) :",
        "Date :",
        "(*) Rayez la mention inutile.",
      ],
    },
  ],
};
