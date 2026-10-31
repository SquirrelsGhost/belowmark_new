import { MarketCode } from "../../../lib/constants";
import { ClosingTaskText } from "../IClosingTranslation";

/** Task texts in French, for both markets. Every statement has its source in closingTasks.ts. */
export const CLOSING_TASKS_FR: Record<MarketCode, Record<string, ClosingTaskText>> = {
  DE: {
    "de.ruling": {
      title: "Conserver l'ordonnance d'adjudication (Zuschlagsbeschluss)",
      detail:
        "Avec l'adjudication, vous devenez propriétaire avant même l'inscription au livre foncier (§ 90 ZVG). Faites-vous remettre ou envoyer l'ordonnance et conservez-la précieusement : elle servira également de titre exécutoire en cas d'expulsion. Le tribunal facture séparément les frais d'adjudication (droit de 0,5 selon KV 2214 GKG).",
    },
    "de.appeal": {
      title: "Attendre que l'adjudication ait force de chose jugée (Rechtskraft)",
      detail:
        "Un recours immédiat (sofortige Beschwerde) est possible contre l'adjudication. Pour toutes les personnes présentes à l'audience d'enchères ou de prononcé, le délai court à compter du prononcé (§ 98 ZVG) et est de deux semaines (§ 569 ZPO). Pour les absents, il ne court qu'à compter de la signification — la force de chose jugée peut donc intervenir plus tard. D'ici là, ne passez aucune commande que vous ne pourriez pas annuler.",
    },
    "de.risk": {
      title: "Traiter le bien comme le vôtre dès aujourd'hui",
      detail:
        "Le risque de perte fortuite vous est transféré dès l'adjudication, tout comme les fruits et les charges (§ 56 ZVG). Vérifiez que le bien est sécurisé (inoccupation, gel, accès) et documentez son état avec des photos datées.",
    },
    "de.insurerNotice": {
      title: "Informer l'assureur du bâtiment",
      detail:
        "L'assurance bâtiment existante vous est transférée (§ 99 combiné au § 95 VVG). L'acquisition doit être déclarée sans délai à l'assureur, faute de quoi il peut être libéré de son obligation de garantie (§ 97 VVG). Demandez au tribunal de l'exécution ou consultez le rapport d'expertise pour connaître l'assureur et le numéro de police. S'il n'existe aucun contrat, assurez immédiatement le bien vous-même.",
    },
    "de.insuranceCancel": {
      title: "Vérifier l'assurance reprise et la résilier le cas échéant",
      detail:
        "Vous pouvez résilier le contrat repris avec effet immédiat ou à la fin de la période d'assurance en cours, mais uniquement dans le délai d'un mois suivant l'acquisition — ou à compter du moment où vous en avez eu connaissance si vous ignoriez son existence (§ 96 al. 2 VVG). Ne résiliez que si la nouvelle couverture prend le relais sans interruption.",
    },
    "de.charges": {
      title: "Reprendre les charges courantes",
      detail:
        "À compter de l'adjudication, vous supportez les charges (§ 56 ZVG) : taxe foncière au prorata, charges de copropriété (Hausgeld), électricité, eau et chauffage. Relevez les compteurs et informez les fournisseurs ainsi que, le cas échéant, le syndic de copropriété (WEG-Verwaltung). Les arriérés de charges de l'ancien propriétaire sont réglés sur le produit de la vente (rang 2, § 10 al. 1 n° 2 ZVG) ; selon la Cour fédérale de justice (BGH V ZR 209/12), ce privilège n'entraîne pas de responsabilité réelle de l'acquéreur.",
    },
    "de.interest": {
      title: "Tenir compte des intérêts de 4 % sur le prix à payer (Bargebot)",
      detail:
        "L'enchère payable au comptant (Bargebot) porte intérêt dès l'adjudication (§ 49 al. 2 ZVG) au taux légal de 4 % par an (§ 246 BGB). Les intérêts courent jusqu'au paiement. Vérifiez auprès du greffier (Rechtspfleger) si une consignation anticipée auprès du tribunal (§ 49 al. 4 ZVG) est judicieuse dans votre cas.",
    },
    "de.summons": {
      title: "Saisir la convocation à l'audience de distribution (Verteilungstermin)",
      detail:
        "Après l'adjudication, le tribunal fixe l'audience de distribution et vous convoque en tant qu'adjudicataire ; la convocation doit vous parvenir au moins deux semaines à l'avance (§ 105 ZVG). Saisissez la date ci-dessus — la liste calcule l'échéance de paiement et l'audience à partir de celle-ci.",
    },
    "de.financing": {
      title: "Coordonner le déblocage des fonds avec la banque",
      detail:
        "Règle Belowmark : deux semaines avant l'audience de distribution, la banque doit connaître la date d'appel des fonds. Transmettez-lui le numéro de dossier, les coordonnées de la caisse du tribunal (Gerichtskasse) et le motif du paiement figurant sur la convocation. Le dossier bancaire résume ces éléments pour votre banque.",
    },
    "de.pay": {
      title: "Virer le montant de l'enchère (Bargebot)",
      detail:
        "Le Bargebot doit être payé avant l'audience de distribution par virement à la caisse du tribunal (Gerichtskasse) ; la somme doit être créditée avant l'audience et le justificatif présenté lors de l'audience (§ 49 al. 1 et 3 ZVG). Le paiement en espèces est exclu. La liste prévoit le virement cinq jours avant — il s'agit d'une marge de sécurité, non d'un délai légal.",
    },
    "de.attend": {
      title: "Audience de distribution (Verteilungstermin)",
      detail:
        "Apportez la preuve du paiement (§ 49 al. 3 ZVG). Lors de l'audience, le plan de distribution (Teilungsplan) est établi et exécuté — c'est une condition préalable à votre inscription au livre foncier (§ 130 ZVG).",
    },
    "de.default": {
      title: "Connaître les conséquences d'un défaut de paiement",
      detail:
        "Si vous ne payez pas, le plan de distribution est exécuté par le transfert de la créance détenue contre vous aux ayants droit (§ 118 ZVG). Les créanciers peuvent alors poursuivre immédiatement la remise en vente sur folle enchère (Wiederversteigerung) contre vous, sans nouveau titre (§ 133 ZVG). Vous restez propriétaire et débiteur — aucune rétractation n'est possible.",
    },
    "de.taxNotice": {
      title: "Payer les droits de mutation immobilière (Grunderwerbsteuer)",
      detail:
        "Le tribunal déclare l'adjudication au centre des impôts (§ 18 al. 1 n° 3 GrEStG). L'impôt est exigible un mois après la notification de l'avis d'imposition (§ 15 GrEStG). Saisissez la date de l'avis ci-dessus.",
    },
    "de.clearance": {
      title: "Attestation fiscale de non-opposition (Unbedenklichkeitsbescheinigung)",
      detail:
        "Sans elle, vous ne serez pas inscrit au livre foncier (§ 22 al. 1 GrEStG). Le centre des impôts la délivre dès que l'impôt est payé, garanti ou différé (§ 22 al. 2 GrEStG) et l'adresse généralement au tribunal ou au bureau foncier. Relancez si plusieurs semaines s'écoulent après le paiement.",
    },
    "de.courtFees": {
      title: "Régler les frais de justice et de registre foncier",
      detail:
        "Frais d'adjudication (droit de 0,5 selon KV 2214 GKG, calculé sur l'enchère maximale majorée des droits maintenus) puis frais d'inscription au livre foncier (droit de 1,0 selon KV 14110 GNotKG). Le calculateur de plafond d'enchère sur la fiche du dossier affiche ces montants.",
    },
    "de.registry": {
      title: "Attendre la réquisition d'inscription au livre foncier (Grundbuchersuchen)",
      detail:
        "Une fois le plan de distribution exécuté et l'adjudication devenue définitive, le tribunal requiert du bureau foncier votre inscription comme propriétaire ainsi que la radiation des droits éteints et de la mention de saisie/vente forcée (§ 130 al. 1 ZVG). Une dette foncière (Grundschuld) au profit de votre banque ne peut être inscrite qu'ensuite (§ 130 al. 3 ZVG).",
    },
    "de.extract": {
      title: "Vérifier l'extrait du livre foncier (Grundbuchauszug)",
      detail:
        "Après l'inscription, demandez un extrait : figurez-vous bien comme propriétaire ? La mention de vente forcée et les droits éteints ont-ils été radiés ? Ne subsistent-ils que les droits maintenus selon les conditions de vente ?",
    },
    "de.eviction": {
      title: "Expulsion en vertu de l'ordonnance d'adjudication",
      detail:
        "Contre l'occupant, tel que l'ancien propriétaire, l'ordonnance d'adjudication constitue elle-même le titre d'expulsion (§ 93 al. 1 ZVG). Vous avez besoin d'une expédition exécutoire signifiée (§ 750 ZPO) et mandatez l'huissier de justice (§ 885 ZPO) ; un mandat limité selon le § 885a ZPO peut réduire les coûts. Non applicable contre les occupants titulaires d'un droit survivant à l'adjudication (§ 93 al. 1 phrase 2 ZVG). Vous n'avez pas à rembourser les impenses antérieures à l'adjudication (§ 93 al. 2 ZVG).",
    },
    "de.tenantTakeover": {
      title: "Reprendre le bail en cours",
      detail:
        "Les baux d'habitation ou commerciaux existants vous sont transférés (§ 57 ZVG combiné au § 566 BGB). Informez les locataires par écrit du changement de propriétaire et du nouveau compte bancaire. Vous pouvez être tenu de restituer le dépôt de garantie même si vous ne l'avez jamais reçu de l'ancien propriétaire (§ 566a BGB) — demandez un justificatif du dépôt.",
    },
    "de.tenantNotice": {
      title: "Congé spécial : uniquement pour la première échéance autorisée",
      detail:
        "Vous pouvez donner congé avec le préavis légal, mais uniquement pour le premier terme autorisé — sinon ce droit spécial est perdu (§ 57a ZVG). Pour un logement, le congé doit parvenir au plus tard le troisième jour ouvrable d'un mois (§ 573c BGB). La protection du locataire demeure : il vous faut un intérêt légitime, par ex. une reprise pour habiter (§ 573 BGB). La date indiquée ici est calculée prudemment (les samedis comptent, les jours fériés ne sont pas déduits) — faites vérifier le congé par un avocat.",
    },
    "de.handover": {
      title: "Documenter la remise des lieux",
      detail:
        "Clés, relevés de compteurs, état des lieux avec photos, défauts, objets laissés sur place — avec date et signature. Changez les serrures dès l'entrée en possession.",
    },
    "de.inspect": {
      title: "Faire l'état des lieux et planifier la rénovation",
      detail:
        "Il n'y a aucune garantie des vices (§ 56 ZVG). Comparez l'état réel au rapport d'expertise et demandez des devis avant de passer commande. Vous pourrez alors remplacer les estimations de travaux du plafond d'enchère par de vrais devis.",
    },
    "de.energy": {
      title: "Obligations de rénovation énergétique après changement de propriétaire",
      detail:
        "Pour les maisons individuelles ou bi-familiales occupées par l'ancien propriétaire au 01.02.2002, certaines obligations de mise aux normes (par ex. isolation du plancher des combles) incombent au nouveau propriétaire dans un délai de deux ans à compter du transfert de propriété (anciennement § 47 GEG). La GEG a été remplacée en 2026 par la loi sur la modernisation des bâtiments (Gebäudemodernisierungsgesetz) — vérifiez la version en vigueur avec un conseiller en énergie.",
    },
    "de.permits": {
      title: "Clarifier les autorisations avant travaux",
      detail:
        "La nécessité d'un permis pour une transformation, un changement d'affectation ou des travaux sur un monument classé relève du droit de chaque Land (code de la construction, loi sur les monuments historiques). Renseignez-vous auprès du service d'urbanisme avant le début des travaux.",
    },
    "de.condo": {
      title: "Demander les documents de copropriété (WEG)",
      detail:
        "En copropriété : informez le syndic du changement de propriétaire et demandez le budget prévisionnel (Wirtschaftsplan), le dernier décompte annuel, le registre des résolutions et le règlement de division (Teilungserklärung). Soyez attentif aux appels de fonds exceptionnels votés (Sonderumlagen).",
    },
  },
  TR: {
    "tr.pay": {
      title: "Payer le prix d'adjudication (ihale bedeli) — 7 jours",
      detail:
        "Le prix d'achat et les frais doivent être payés dans les sept jours suivant la publication du procès-verbal de résultat des enchères (artırma sonuç tutanağı), même si quelqu'un a demandé l'annulation de la vente (Elektronik Satış Yönetmeliği art. 20/1 ; İİK art. 130). Depuis la loi n° 7343, il n'y a plus de prolongation de dix jours. Saisissez ci-dessus la date de publication du procès-verbal.",
    },
    "tr.fees": {
      title: "Prévoir les frais selon la Şartname",
      detail:
        "Les droits de Tapu (tapu harcı) s'élèvent à 20 ‰ du prix de vente par partie (loi n° 492 Harçlar Kanunu, Tarif 4 art. 20/a). Si le cahier des charges (Şartname) met la totalité des frais de Tapu à la charge de l'acheteur, le ministère de la Justice considère cela valable (İİDB, 12.01.2023) — soit 40 ‰. S'y ajoutent la TVA (KDV) selon l'annonce et le droit de timbre (damga vergisi). Lisez la Şartname de votre procédure.",
    },
    "tr.default": {
      title: "Connaître les conséquences d'un défaut de paiement",
      detail:
        "À défaut de paiement, l'office des poursuites annule l'adjudication (ihale) et vous êtes tenu de la différence de prix (İİK art. 133). Pour les ventes publiées à compter du 31.07.2026, une pénalité de 5 % de l'enchère s'y ajoute (İİK art. 114 modifié par la loi n° 7589).",
    },
    "tr.annulment": {
      title: "Attendre l'expiration du délai d'annulation (ihalenin feshi)",
      detail:
        "Les intéressés peuvent demander l'annulation de l'adjudication dans un délai de sept jours (ihalenin feshi, İİK art. 134), ou dans des cas particuliers à compter de la prise de connaissance, au plus tard dans l'année. Tant qu'une procédure est en cours, l'inscription n'a pas lieu. D'ici là, ne passez aucune commande que vous ne pourriez pas annuler.",
    },
    "tr.registry": {
      title: "Suivre l'inscription au registre foncier (tescil)",
      detail:
        "Une fois l'ihale définitive (kesinleşme) et payée, l'office des poursuites écrit au bureau du Tapu pour vous inscrire comme propriétaire (İİK art. 134). Vérifiez si le courrier officiel (tescil müzekkeresi) a bien été envoyé.",
    },
    "tr.deed": {
      title: "Vérifier l'inscription au Tapu",
      detail:
        "Après l'inscription, vérifiez via e-Devlet (Tapu Bilgileri) : êtes-vous inscrit comme propriétaire et les saisies (haciz) ainsi que les hypothèques (ipotek) sont-elles radiées ?",
    },
    "tr.dask": {
      title: "Souscrire une nouvelle police d'assurance séisme DASK",
      detail:
        "L'assurance tremblement de terre est obligatoire (loi n° 6305). Depuis le 05.09.2026, la police de l'ancien propriétaire n'est plus transférée et prend fin lors de l'inscription (conditions DASK, Journal officiel 21.08.2026/33347). Souscrivez votre propre police ; les fournisseurs d'énergie l'exigent souvent pour les nouveaux abonnements. Demandez au bureau du Tapu s'il la contrôle lors d'une inscription sur adjudication.",
    },
    "tr.propertyTax": {
      title: "Régulariser la taxe foncière (emlak vergisi)",
      detail:
        "Le transfert de propriété donne lieu à une déclaration auprès de la municipalité (loi n° 1319 art. 23) ; vous devenez redevable à partir de l'année suivante (art. 33). Demandez à la mairie si l'avis du bureau du Tapu suffit et faites-vous communiquer les éventuels arriérés d'impôts du bien.",
    },
    "tr.eviction": {
      title: "Expulsion par l'office des poursuites",
      detail:
        "Si le débiteur ou un occupant sans droit ni titre habite les lieux, l'office des poursuites notifie sur votre demande une sommation de quitter les lieux sous 15 jours, suivie de l'expulsion (İİK art. 135/2). Les locataires disposant d'un bail à date certaine antérieur à la saisie sont protégés (voir Locataires). Ne tardez pas à déposer votre demande.",
    },
    "tr.tenant": {
      title: "Locataires : le bail vous est transféré",
      detail:
        "Le nouveau propriétaire devient partie au contrat de bail (TBK art. 310). Si vous souhaitez donner congé pour besoin personnel, vous devez le notifier par écrit au locataire dans le mois suivant l'acquisition et pouvez agir en justice au plus tôt après six mois (TBK art. 351). Clarifiez avec un avocat quelle date vaut acquisition lors d'une ihale — la liste calcule prudemment à partir de la date de l'ihale.",
    },
    "tr.handover": {
      title: "Documenter la remise des lieux",
      detail:
        "Clés, relevés de compteurs, état avec photos datées. Mettre les abonnements d'électricité, d'eau et de gaz (abonelik) à votre nom et changer les serrures.",
    },
    "tr.inspect": {
      title: "Faire l'état des lieux et planifier la rénovation",
      detail:
        "Comparez l'état réel au rapport d'évaluation (kıymet takdir raporu) et demandez des devis avant de confier les travaux.",
    },
    "tr.permits": {
      title: "Autorisation pour travaux de transformation",
      detail:
        "Des travaux de transformation peuvent nécessiter un permis de construire (yapı ruhsatı, loi n° 3194 İmar Kanunu art. 21). Renseignez-vous au préalable auprès de la mairie.",
    },
    "tr.condo": {
      title: "Informer le syndic de copropriété",
      detail:
        "Pour les appartements en copropriété : informez la gérance (yönetim) et renseignez-vous sur les charges mensuelles (aidat) et le règlement de copropriété (yönetim planı, loi n° 634 Kat Mülkiyeti Kanunu).",
    },
  },
};
