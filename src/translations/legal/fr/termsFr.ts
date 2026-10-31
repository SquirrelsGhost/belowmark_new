import { LEGAL_OPERATOR, operatorAddress } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export function vatSentenceFr(vatMode: "inclusive" | "kleinunternehmer" | null): string {
  if (vatMode === "kleinunternehmer") {
    return "Tous les prix sont des prix définitifs. Conformément au § 19 de la loi allemande sur la TVA (UStG), aucune taxe sur la valeur ajoutée n'est facturée.";
  }
  return "Tous les prix sont des prix définitifs et incluent la taxe sur la valeur ajoutée (TVA) légale applicable.";
}

export function termsFr(vatMode: "inclusive" | "kleinunternehmer" | null): LegalDocument {
  return {
    title: "Conditions Générales d'Utilisation et de Vente (AGB)",
    asOf: "Mise à jour : 31 octobre 2026",
    basis: "Pour l'utilisation de la plateforme Belowmark (belowmark.com).",
    sections: [
      {
        id: "geltung",
        heading: "1. Champ d'application et parties au contrat",
        paragraphs: [
          `Les présentes conditions générales s'appliquent à tous les contrats relatifs à l'utilisation du service en ligne Belowmark conclus entre ${operatorAddress()} (ci-après le « Prestataire ») et le client.`,
          "Est considéré comme consommateur toute personne physique qui conclut le contrat à des fins qui n'entrent pas, à titre principal, dans le cadre de son activité commerciale ou professionnelle indépendante (§ 13 BGB / Code de la consommation). Des conditions divergentes du client ne s'appliquent que si le Prestataire les accepte expressément.",
        ],
      },
      {
        id: "leistung",
        heading: "2. Objet du service",
        paragraphs: [
          "Belowmark rassemble des informations publiées officiellement concernant les ventes aux enchères immobilières judiciaires et publiques en Europe (Allemagne, Autriche, Suisse, Italie, Espagne, France, Royaume-Uni) et en Turquie, les structure et en calcule des indicateurs clés (tels que mises à prix, seuils légaux, consignations et frais d'acquisition). Pendant la durée du contrat, le client bénéficie d'un accès personnel à l'application web pour le marché choisi lors de l'inscription.",
          "Belowmark est un outil de recherche et d'analyse documentaire. Le service ne constitue pas un conseil juridique, fiscal, immobilier ou financier et ne contient aucune recommandation de porter une enchère déterminée. Chaque information doit être vérifiée auprès du greffe du tribunal et sur le cahier des conditions de vente officiel avant toute décision économique.",
          "Les données proviennent de sources tierces (portails judiciaires, annonces légales telles que Licitor et portails d'annonces). Le Prestataire ne garantit pas l'exactitude, l'exhaustivité ni l'actualité de ces données ; le répertoire peut être incomplet. Les valeurs calculées sont des résultats mathématiques basés sur ces indications et ne constituent pas des expertises officielles.",
        ],
      },
      {
        id: "tarife",
        heading: "3. Formules et tarifs",
        paragraphs: [
          "Free Scout : utilisation gratuite à durée indéterminée avec périmètre restreint (liste des biens visible, mises à prix et dates d'audience masquées). Aucune donnée de paiement n'est demandée.",
          "Période d'essai : après confirmation de son adresse e-mail, le client bénéficie gratuitement pendant 14 jours du périmètre de l'accès Investor. La période d'essai prend fin automatiquement et ne se transforme pas en abonnement payant.",
          "Investor Mensuel : accès complet individuel pour 39,00 € / £35 / CHF 39 (marchés européens) ou 599,00 TL (marché Turquie) par mois, payable d'avance, avec reconduction automatique d'un mois à chaque échéance sauf résiliation.",
          "Investor Trois Mois : accès complet pendant trois mois calendaires pour un paiement unique d'avance de 99,00 € / £89 / CHF 99 (marchés européens) ou 1 490,00 TL (marché Turquie). Ne se renouvelle pas automatiquement ; aucune résiliation n'est nécessaire.",
          "Pro Mensuel : accès complet incluant les liens clients avec en-tête personnalisé et les listes d'équipe partagées (jusqu'à 3 équipes de 5 places chacune) pour 129,00 € / £115 / CHF 129 (marchés européens) ou 1 990,00 TL (marché Turquie) par mois, payable d'avance, avec reconduction automatique mensuelle.",
          "Pro Trois Mois : accès complet Pro pendant trois mois calendaires pour un paiement unique d'avance de 329,00 € / £295 / CHF 329 (marchés européens) ou 4 990,00 TL (marché Turquie). Ne se renouvelle pas automatiquement ; aucune résiliation n'est nécessaire. Les contingents d'équipe étendus (à partir de 299,00 € par mois) sont convenus individuellement sur demande préalable.",
          vatSentenceFr(vatMode),
        ],
      },
      {
        id: "vertragsschluss",
        heading: "4. Conclusion du contrat",
        paragraphs: [
          "L'inscription et la confirmation de l'adresse e-mail donnent naissance à un contrat d'utilisation gratuit (Free Scout avec période d'essai).",
          "Un accès payant Investor ou Pro est souscrit depuis le compte via le récapitulatif de commande, où sont résumés la formule, le prix, la durée et le renouvellement. En cliquant sur le bouton « Commander avec obligation de paiement », le client soumet une offre ferme et est redirigé vers la page de paiement du prestataire Stripe. Le contrat est conclu dès que Stripe confirme le paiement et que le Prestataire active l'accès ; le client reçoit une confirmation par e-mail.",
          "Le Prestataire conserve le texte du contrat (commande, formule, prix et version en vigueur des présentes conditions) et l'envoie par e-mail avec la confirmation. La version actuelle est consultable à tout moment sur belowmark.com/agb.",
        ],
      },
      {
        id: "zahlung",
        heading: "5. Paiement et factures",
        paragraphs: [
          "Le paiement est traité par Stripe Payments Europe, Ltd. (Irlande). Les coordonnées de paiement sont saisies exclusivement sur la page sécurisée de Stripe et ne sont jamais stockées par le Prestataire.",
          "L'abonnement mensuel est débité d'avance au début de chaque mois. Les factures sont disponibles dans le compte sous « Factures et moyens de paiement » et sont envoyées par e-mail.",
          "En cas d'échec d'un prélèvement, Stripe effectue une nouvelle tentative. À défaut de paiement, l'accès complet prend fin à l'expiration de la période payée, tandis que le périmètre gratuit est maintenu.",
        ],
      },
      {
        id: "laufzeit",
        heading: "6. Durée et résiliation",
        paragraphs: [
          "L'abonnement mensuel Investor ou Pro est conclu pour une durée indéterminée et peut être résilié à tout moment pour la fin du mois déjà payé. L'accès complet demeure actif jusqu'à cette date. Aucun remboursement au prorata du mois en cours n'est effectué en cas de résiliation ordinaire.",
          `La résiliation peut être effectuée via le bouton « Résilier les contrats ici » situé au bas de chaque page (accessible sans connexion), depuis le compte, via le portail client Stripe ou par écrit à ${LEGAL_OPERATOR.email}. Après une résiliation via le bouton dédié, le client reçoit immédiatement une confirmation par e-mail mentionnant le contenu, la date et l'heure de réception ainsi que la date de fin du contrat.`,
          "Le forfait de trois mois prend fin automatiquement à l'issue des mois calendaires réservés. Le contrat gratuit Free Scout peut être résilié à tout moment en supprimant le compte.",
          "Le droit de résiliation extraordinaire pour motif grave demeure inchangé pour les deux parties.",
        ],
      },
      {
        id: "widerruf",
        heading: "7. Droit de rétractation et extinction pour les contenus numériques (§ 356 al. 5 BGB / Art. L221-28 Code consom.)",
        paragraphs: [
          "Belowmark est un produit numérique avec activation immédiate dès réception du paiement. En acceptant les présentes Conditions générales lors du processus de commande, le client consent expressément à ce que le Prestataire commence l'exécution du contrat (fourniture et activation immédiate de l'accès numérique payant) avant l'expiration du délai de rétractation, et confirme avoir connaissance que son droit légal de rétractation s'éteint immédiatement dès l'activation de l'accès (§ 356 al. 5 BGB).",
          "L'information complète sur l'extinction du droit de rétractation conformément au § 356 al. 5 BGB est consultable sur belowmark.com/widerruf et est transmise au client par e-mail avec la confirmation du contrat.",
        ],
      },
      {
        id: "verfuegbarkeit",
        heading: "8. Disponibilité",
        paragraphs: [
          "Le Prestataire s'efforce d'assurer une disponibilité continue du service, mais ne garantit pas un taux de disponibilité déterminé. Des opérations de maintenance, des perturbations chez des tiers ou des pannes des portails sources peuvent restreindre temporairement l'accès ou l'actualité des données.",
        ],
      },
      {
        id: "nutzung",
        heading: "9. Droits d'utilisation, interdiction du scraping et suspension de compte sans remboursement",
        paragraphs: [
          "Le client reçoit un droit simple et non transférable d'utiliser le service pendant la durée du contrat exclusivement pour ses propres besoins de recherche via un navigateur web standard. Sont notamment strictement interdits : (a) la divulgation des identifiants ou l'utilisation partagée d'un compte par plusieurs personnes en dehors des places d'équipe réservées, (b) toute lecture, extraction, copie ou indexation systématique, automatisée ou assistée par script de données, textes, indicateurs ou documents (notamment au moyen de bots, crawlers, scrapers, navigateurs headless ou scripts), (c) le contournement de mesures techniques de protection, de limites de requêtes (rate-limits) ou de mécanismes de sécurité (y compris le déclenchement de pièges honeypot), ainsi que (d) le téléchargement de masse, la revente, l'octroi de sous-licences ou la mise à disposition du public des données ou documents traités.",
          "Toute violation des interdictions qui précèdent constitue un manquement grave aux obligations contractuelles essentielles et autorise le Prestataire à prononcer la résiliation extraordinaire immédiate pour motif grave (§ 314 BGB) ainsi que la suspension immédiate et définitive du compte utilisateur et de l'identifiant d'appareil utilisé sans mise en demeure préalable.",
          "En cas d'une telle suspension de compte ou résiliation extraordinaire causée par la violation contractuelle du client (notamment par scraping, extraction automatisée de données ou contournement des mécanismes de sécurité), le droit d'utilisation s'éteint avec effet immédiat. Tout droit du client au remboursement total ou au prorata des redevances déjà payées pour le mois de facturation en cours ou pour les périodes fixes plurimensuelles réservées est exclu dans ce cas. Les autres demandes de dommages-intérêts et actions en cessation du Prestataire demeurent réservées.",
        ],
      },
      {
        id: "haftung",
        heading: "10. Responsabilité",
        paragraphs: [
          "Le Prestataire est responsable sans limitation en cas de faute intentionnelle ou de négligence grave, d'atteinte à la vie, à l'intégrité physique ou à la santé ainsi qu'au titre de la responsabilité du fait des produits. En cas de négligence légère, il n'est responsable qu'en cas de violation d'obligations contractuelles essentielles, dans la limite du dommage prévisible et typique du contrat.",
          "Sauf dans les cas visés à l'alinéa précédent, le Prestataire n'est pas responsable des décisions économiques du client, notamment des enchères portées et de leurs conséquences.",
        ],
      },
      {
        id: "aenderungen",
        heading: "11. Modification des présentes conditions et des tarifs",
        paragraphs: [
          "Le Prestataire communique sous forme de texte toute modification des présentes conditions ou du tarif de l'abonnement mensuel au moins six semaines avant son entrée en vigueur. Ces modifications ne prennent effet que si le client y consent ; à défaut, chaque partie peut résilier le contrat à la date d'entrée en vigueur de la modification.",
        ],
      },
      {
        id: "recht",
        heading: "12. Droit applicable et juridiction compétente",
        paragraphs: [
          "Le droit allemand s'applique à l'exclusion de la Convention des Nations Unies sur les contrats de vente internationale de marchandises (CVIM). À l'égard des consommateurs, ce choix de loi ne s'applique que dans la mesure où il ne prive pas le consommateur de la protection que lui assurent les dispositions impératives de la loi de l'État dans lequel il a sa résidence habituelle.",
          `Si le client est un commerçant, une personne morale de droit public ou un fonds spécial de droit public, le tribunal compétent exclusif est celui du siège du Prestataire (${LEGAL_OPERATOR.court}).`,
        ],
      },
    ],
  };
}
