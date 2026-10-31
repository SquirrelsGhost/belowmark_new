import { IBankFileTranslation } from "../IBankFileTranslation";

export const BANK_FILE_FR: IBankFileTranslation = {
  MetaTags: {
    BankFile: {
      title: "Dossier bancaire — Belowmark",
      description: "Demande de financement pour un bien aux enchères : montant, apport personnel, échéancier légal après adjudication et consignation — chaque chiffre avec sa source.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Dossier bancaire", "Financement", "Vente aux enchères forcée"],
      url: "https://belowmark.com/app",
    },
  },

  Teaser: {
    Eyebrow: "Financement",
    Title: "Dossier bancaire",
    Lead: {
      DE: "La consignation est exigée lors de l'audience, le solde d'ici l'audience de distribution. Ce dossier présente tout à la banque en une fois : montant, apport, échéancier légal et ce que la banque doit préparer pour la consignation. Il ne remplace pas un accord de prêt — seule la banque peut le délivrer.",
      TR: "Le teminat se règle avant d'enchérir, le solde sous 7 jours après le procès-verbal. Ce dossier présente tout à la banque en une fois : montant, apport et échéancier légal. Il ne remplace pas un accord de prêt — seule la banque peut le délivrer.",
    },
    Button: "Ouvrir le dossier bancaire",
    ButtonHint: "Ouvre le dossier dans un nouvel onglet. Vous y indiquez l'enchère, l'apport et le mode de consignation avant de l'enregistrer en PDF.",
  },

  File: {
    Kicker: "Demande de financement · Vente aux enchères forcée",
    Title: "Dossier bancaire",
    PrintedAt: "Créé le {date}",
    DataAsOf: "Données de l'annonce au {date}",
    Print: "Imprimer / enregistrer en PDF",
    PrintHint: "Dans la boîte de dialogue d'impression, choisissez « Enregistrer au format PDF ».",
    Back: "Retour à la fiche du dossier",
    Locked: "Le dossier bancaire fait partie du forfait Investor",
    NoValue: "non renseigné",
    Sections: {
      ask: "Demande à la banque",
      request: "Besoin de financement",
      schedule: "Échéancier des paiements à partir de l'audience",
      deposit: "Consignation — ce que la banque doit faire",
      collateral: "Garantie pour la banque — quand elle prend effet",
      object: "Bien et valeur vénale",
      risks: "Droits et risques",
      limit: "Calcul de l'enchère maximale",
      documents: "Pièces pour la banque",
      notThis: "Ce que ce dossier n'est pas",
      sources: "Sources",
    },
  },

  Form: {
    Title: "Vos données pour le dossier",
    Lead: "Tout commence vide. L'apport, le taux et l'amortissement sont partagés avec le calculateur de plafond d'enchère — toute modification ici s'applique aussi là-bas.",
    StorageHint: "Enregistré uniquement dans ce navigateur. Ces champs de saisie ne sont pas imprimés, seul le résultat l'est.",
    Fields: {
      plannedBid: { label: "Enchère maximale prévue", hint: "Laisser vide pour reprendre votre plafond d'enchère." },
      equity: { label: "Apport personnel", hint: "Ce que vous apportez vous-même, consignation comprise." },
      interestPct: { label: "Taux d'intérêt théorique", hint: "Votre hypothèse. Le taux réel est fixé par la banque." },
      repaymentPct: { label: "Amortissement initial", hint: "Par an, en pourcentage du prêt." },
      fixedYears: { label: "Durée de taux fixe souhaitée", hint: "" },
    },
    Applicant: { label: "Demandeur (facultatif)", hint: "Figure dans la demande. Reste dans ce navigateur.", placeholder: "Prénom et nom" },
    Method: { label: "Consignation par", empty: "encore ouvert" },
    Methods: {
      cheque: "Chèque de la Bundesbank / chèque de banque",
      guarantee: "Caution bancaire",
      transfer: "Virement à la caisse du tribunal",
      portal: "Portail e-Satış",
    },
    Use: { label: "Usage prévu", empty: "encore ouvert" },
    Uses: { own: "Occupation personnelle", rent: "Location", resale: "Revente" },
    YearsSuffix: "ans",
    Reset: "Effacer les données du dossier",
  },

  Ask: {
    Salutation: "Madame, Monsieur,",
    Intro: "j'envisage d'enchérir dans la procédure d'adjudication forcée {fileNo} auprès du {court} sur le bien {object}. Audience : {date}. Valeur vénale selon la publication : {value}.",
    Applicant: "Demandeur : {name}",
    NoApplicant: "Demandeur : ______________________",
    Requests: {
      loan: "Un financement de {amount} — coût total de {total} diminué de l'apport personnel de {equity} (détail à la section 02).",
      guarantee: "Une caution bancaire à durée indéterminée, inconditionnelle et solidaire de {amount} à titre de consignation pour l'audience (§ 69 al. 3 ZVG).",
      cheque: "Un chèque de la Bundesbank ou chèque de banque de {amount}, émis au plus tôt le troisième jour ouvrable précédant l'audience (§ 69 al. 2 ZVG).",
      transfer: "Un virement de {amount} à la caisse du tribunal, crédité avant l'audience, justificatif à l'appui (§ 69 al. 4 ZVG).",
      portal: "La mise à disposition du teminat de {amount} avant les enchères sur le portail e-Satış.",
      timing: "Une confirmation écrite de financement avant l'audience, les paiements ultérieurs étant strictement liés aux délais légaux de la section 03.",
    },
    MissingBid: "Enchère maximale manquante — saisissez-la ci-dessus ou calculez votre plafond d'enchère.",
    MissingEquity: "Apport personnel manquant — sans lui, le montant du prêt ne peut être indiqué.",
    MissingMethod: "Le mode de consignation n'est pas encore défini.",
    Closing: "Je me tiens à votre disposition pour toute question et pour la consultation du rapport d'expertise.",
  },

  Request: {
    UsesTitle: "Emploi des fonds",
    SourcesTitle: "Origine des fonds",
    Bid: "Enchère maximale",
    BidFromLimit: "issue de votre plafond d'enchère",
    BidOwn: "votre saisie",
    Total: "Coût total",
    Equity: "Apport personnel",
    Loan: "Besoin de financement",
    LoanToValue: "Ratio prêt / valeur vénale",
    LoanToValueNote: "Valeur vénale fixée par le tribunal — la banque détermine sa propre valeur hypothécaire.",
    EquityShare: "Part d'apport personnel",
    TermsTitle: "Conditions souhaitées",
    Interest: "Taux d'intérêt théorique",
    InterestNote: "Votre hypothèse, non une offre",
    Repayment: "Amortissement initial",
    MonthlyRate: "Mensualité à votre taux théorique",
    FixedYears: "Période de taux fixe",
    Use: "Usage",
    Incomplete: "Un poste de frais légal manque (p. ex. taux d'imposition absent de l'annonce) — le coût total est sous-estimé.",
    EquityShortForDeposit: "Votre apport ne couvre pas la consignation. La banque devra la préfinancer ou fournir une caution.",
    Guarantee: "En sus : caution bancaire pour la consignation",
    GuaranteeBasis: "§ 69 al. 3 ZVG",
  },

  Schedule: {
    Columns: { when: "Quand", what: "Objet", amount: "Montant" },
    Steps: {
      DE: {
        deposit: { when: "À l'audience, immédiatement après l'enchère", text: "Consignation : un dixième de la valeur vénale si un intéressé l'exige. Prévoyez-la systématiquement.", basis: "§§ 67, 68 al. 1 ZVG", law: "zvg68" },
        balance: { when: "Avant l'audience de distribution (date fixée par le tribunal après l'adjudication)", text: "Prix à payer en numéraire à la caisse du tribunal — crédité avant l'audience, justificatif présenté à l'audience. Une consignation virée à la caisse du tribunal s'impute sur ce montant.", basis: "§ 49 al. 3, § 107 al. 3 ZVG", law: "zvg49" },
        bidInterest: { when: "Avec le solde du prix", text: "Intérêts de 4 % sur le solde du prix, de l'adjudication jusqu'à l'audience de distribution.", basis: "§ 49 al. 2 ZVG comb. § 246 BGB", law: "zvg49" },
        transferTax: { when: "Un mois après l'avis d'imposition", text: "Droits de mutation immobilière sur l'enchère et les droits maintenus.", basis: "§§ 9, 15 GrEStG", law: "grestg" },
        courtFee: { when: "Après note de frais du tribunal", text: "Émolument pour la délivrance de l'adjudication.", basis: "KV 2214 GKG" },
        registryFee: { when: "Après l'inscription", text: "Inscription comme propriétaire au livre foncier.", basis: "KV 14110 GNotKG" },
        own: { when: "Selon votre plan", text: "Rénovation, libération des lieux et divers.", basis: "Votre saisie" },
      },
      TR: {
        deposit: { when: "Avant d'enchérir", text: "Teminat sur le portail e-Satış.", basis: "İİK m.114/7", law: "esatis" },
        balance: { when: "Sous 7 jours après publication du procès-verbal d'enchères", text: "Solde du prix (enchère moins teminat), au comptant. Aucune prolongation.", basis: "İİK m.130", law: "iik" },
        fees: { when: "Sur demande de l'office des poursuites, avant l'inscription", text: "KDV, frais de Tapu, droit de timbre, Döner sermaye.", basis: "Cahier des charges (şartname)" },
        own: { when: "Selon votre plan", text: "Rénovation, libération des lieux et divers.", basis: "Votre saisie" },
      },
    },
    BalanceGuaranteeNote: "En cas de caution bancaire, rien n'est imputé — la totalité du prix doit être versée.",
    BalanceOpenNote: "Mode de consignation non défini — calculé sans imputation.",
    MissingInterestDays: "Indiquer le nombre de jours jusqu'à l'audience de distribution dans le plafond d'enchère",
    Unknown: "non calculable",
    Footnote: {
      DE: "Les dates postérieures à l'adjudication sont fixées par le tribunal et l'administration fiscale. Le dossier indique donc l'ordre légal, sans inventer de date.",
      TR: "Le délai de 7 jours court à compter de la publication du procès-verbal sur le portail, et non du jour de la vente.",
    },
  },

  Deposit: {
    Lead: {
      DE: "Montant : un dixième de la valeur vénale (§ 68 al. 1 ZVG). Les espèces sont exclues (§ 69 al. 1 ZVG). Seuls ces trois moyens sont admis :",
      TR: "Le teminat est déposé sur le portail e-Satış avant d'enchérir. Les formes acceptées par l'office des poursuites figurent dans le cahier des charges (şartname) de l'annonce.",
    },
    Ways: {
      DE: [
        { id: "cheque", title: "Chèque de la Bundesbank ou chèque de banque", text: "Émis par un établissement de crédit agréé en Allemagne ou par la Bundesbank, payable sur le territoire national, au plus tôt le troisième jour ouvrable avant l'audience. Un chèque émis plus tôt sera refusé.", basis: "§ 69 al. 2 ZVG", law: "zvg69" },
        { id: "guarantee", title: "Caution bancaire", text: "À durée indéterminée, inconditionnelle et solidaire, émise par un tel établissement de crédit, exécutoire sur le territoire national. La banque peut facturer une commission d'aval.", basis: "§ 69 al. 3 ZVG", law: "zvg69" },
        { id: "transfer", title: "Virement à la caisse du tribunal", text: "Le montant doit être crédité sur le compte de la caisse du tribunal avant l'audience et la preuve doit être produite à l'audience. Les coordonnées bancaires et la référence sont communiquées par le tribunal.", basis: "§ 69 al. 4 ZVG", law: "zvg69" },
      ],
      TR: [{ id: "portal", title: "Teminat sur le portail e-Satış", text: "À déposer sur le portail avant d'enchérir, connexion via e-Devlet. Il s'impute sur le prix ; à défaut de paiement après l'adjudication, il est perdu.", basis: "İİK m.114/7, m.130", law: "esatis" }],
    },
    Chosen: "choisi",
  },

  Collateral: {
    Lead: {
      DE: "Les banques hésitent lors des ventes forcées pour une raison principale : elles décaissent avant que leur dette foncière (Grundschuld) ne soit inscrite au livre foncier. Voici le déroulement prévu par la loi :",
      TR: "Les banques hésitent lors des ventes İcra pour une raison principale : elles doivent payer sous 7 jours alors que leur hypothèque n'est inscrite qu'après le transfert de propriété. Voici le déroulement prévu par la loi :",
    },
    Items: {
      DE: [
        { text: "Dès l'adjudication, vous devenez propriétaire — sans acte notarié et avant toute inscription.", basis: "§ 90 al. 1 ZVG" },
        { text: "Vous pouvez consentir une dette foncière (Grundschuld) au profit de la banque après l'adjudication. Mais elle ne sera inscrite qu'après que le tribunal aura requis le livre foncier de vous inscrire comme propriétaire.", basis: "§ 130 al. 3 ZVG", law: "zvg130" },
        { text: "Le tribunal ne présente cette réquisition qu'une fois le plan de distribution exécuté et l'adjudication devenue définitive — soit après l'audience de distribution.", basis: "§ 130 al. 1 ZVG", law: "zvg130" },
        { text: "Pour votre inscription, le livre foncier exige l'attestation de non-opposition fiscale (Unbedenklichkeitsbescheinigung), qui suppose en règle générale le paiement des droits de mutation.", basis: "§ 22 GrEStG", law: "grestg" },
        { text: "Si vous ne payez pas le solde du prix, le tribunal transfère la créance aux ayants droit, la garantit par des hypothèques forcées sur votre bien, et une folle enchère (revente forcée) menace.", basis: "§§ 118, 128, 133 ZVG", law: "zvg118" },
        { text: "La manière dont la banque sécurise la période jusqu'à l'inscription — p. ex. constitution notariée de la Grundschuld dès l'adjudication et versement direct à la caisse du tribunal — relève de la décision de la banque.", basis: "Décision de la banque" },
      ],
      TR: [
        { text: "Le teminat est déposé sur le portail avant l'enchère et imputé sur le prix.", basis: "İİK m.114/7", law: "iik" },
        { text: "Le solde du prix doit être payé au comptant dans les 7 jours suivant la publication du procès-verbal sur le portail. Depuis la réforme de 2021, il n'y a plus de prolongation.", basis: "İİK m.130 (Loi n° 7343)", law: "iik" },
        { text: "L'inscription (tescil) n'intervient qu'une fois l'adjudication devenue définitive. Ce n'est qu'ensuite qu'une hypothèque (ipotek) peut être inscrite au profit de la banque.", basis: "İİK m.134", law: "iik" },
        { text: "À défaut de paiement, le teminat est acquis. Pour les ventes annoncées à compter du 31.07.2026, la loi prévoit en outre une amende de 5 % de l'enchère.", basis: "İİK m.114 al. 7 n° 9 (Loi n° 7589)", law: "iik" },
        { text: "Conséquence : sans accord préalable (ön onay) avant d'enchérir, le délai de 7 jours est très difficile à tenir avec une banque.", basis: "Délais İİK m.130, m.134" },
      ],
    },
  },

  Object: {
    ReportTitle: "Données clés du rapport d'expertise",
    NoReport: "Aucun rapport d'expertise téléversé. Ajoutez-le sur la fiche du dossier — la banque l'exigera de toute façon dans son intégralité.",
    ReportFrom: "extrait de « {file} », cité mot à mot avec page",
    RisksLead: "Feu tricolore des risques d'après l'annonce et l'expertise. Gris signifie qu'aucune source n'en parle.",
    RiskFrom: { notice: "Annonce officielle", report: "Expertise p. {pages}", none: "aucune source" },
  },

  Documents: {
    Lead: "Ce que les banques demandent habituellement. Chaque banque a sa propre liste — renseignez-vous auprès d'elle.",
    Groups: {
      DE: [
        { title: "Sur le bien", items: ["Rapport complet d'expertise de la valeur vénale (au tribunal ou sur zvg-portal.de)", "Fixation d'audience / publication officielle", "Extrait du livre foncier (souvent annexé à l'expertise)", "Plan cadastral et calcul de la surface habitable", "Contrats de bail, si le bien est loué", "Devis ou plan de coûts pour la rénovation, si prévue"] },
        { title: "Sur vous", items: ["Pièce d'identité ou passeport", "Justificatifs de revenus des derniers mois", "Avis d'imposition", "Justificatif de l'apport personnel", "Fiche de renseignements bancaires", "État des crédits en cours"] },
      ],
      TR: [
        { title: "Sur le bien", items: ["Annonce de vente et cahier des charges (şartname)", "Rapport d'évaluation (kıymet takdir raporu)", "Extrait Tapu et données parcellaires (ada / parsel)", "Photos et plan de situation, si disponibles"] },
        { title: "Sur vous", items: ["Kimlik / passeport", "Justificatifs de revenus", "Numéro fiscal", "Justificatif de l'apport personnel"] },
      ],
    },
  },

  NotThis: {
    Items: [
      { text: "Aucun accord de prêt ni offre de financement. La décision de financer et ses conditions relèvent exclusivement de la banque.", basis: "—" },
      { text: "Aucun courtage en crédit. Belowmark ne propose pas de prêts et n'intervient auprès d'aucune banque en votre nom.", basis: "§ 34i GewO", law: "gewo34i" },
      { text: "Aucune valeur hypothécaire. La valeur vénale provient de l'expertise judiciaire ; la banque procède à sa propre évaluation.", basis: "BelWertV" },
      { text: "Aucun conseil juridique. Les textes de loi sont mis en lien pour consultation.", basis: "—" },
    ],
  },

  SourceNames: {
    notice: "Publication officielle",
    document: "Publication officielle (PDF)",
    zvg: "Loi sur les ventes forcées (ZVG)",
    grestg: "Loi relative aux droits de mutation immobilière (GrEStG)",
    gewo: "Code des professions § 34i (GewO)",
    iik: "İcra ve İflas Kanunu (İİK)",
    esatis: "UYAP e-Satış",
  },
};
