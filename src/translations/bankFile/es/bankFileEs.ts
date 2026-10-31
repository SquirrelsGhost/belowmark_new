import { IBankFileTranslation } from "../IBankFileTranslation";

export const BANK_FILE_ES: IBankFileTranslation = {
  MetaTags: {
    BankFile: {
      title: "Dossier bancario — Belowmark",
      description: "Solicitud de financiación para un inmueble en subasta: importe, capital propio, calendario de pagos tras la adjudicación y fianza — cada cifra con su fuente.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Dossier bancario", "Financiación", "Subasta judicial"],
      url: "https://belowmark.com/app",
    },
  },

  Teaser: {
    Eyebrow: "Financiación",
    Title: "Dossier bancario",
    Lead: {
      DE: "Necesita la fianza en el acto de la subasta y el resto antes de la fecha de reparto. El dossier presenta al banco todo de una vez: importe, capital propio, calendario legal de pagos y lo que el banco debe hacer para la fianza. No sustituye a una aprobación bancaria: esa solo la da el banco.",
      TR: "El teminat se abona antes de pujar y el resto en los 7 días siguientes al acta. El dossier presenta al banco todo de una vez: importe, capital propio y calendario legal de pagos. No sustituye a una aprobación de crédito: esa solo la da el banco.",
    },
    Button: "Abrir dossier bancario",
    ButtonHint: "Abre el dossier en una pestaña nueva. Allí introduce su puja, el capital propio y la vía de la fianza, y lo guarda como PDF.",
  },

  File: {
    Kicker: "Solicitud de financiación · Subasta judicial",
    Title: "Dossier bancario",
    PrintedAt: "Creado el {date}",
    DataAsOf: "Datos del edicto a fecha de {date}",
    Print: "Imprimir / guardar en PDF",
    PrintHint: "En el diálogo de impresión, elija «Guardar como PDF».",
    Back: "Volver a la ficha del expediente",
    Locked: "El dossier bancario forma parte del plan Investor",
    NoValue: "no indicado",
    Sections: {
      ask: "Solicitud al banco",
      request: "Necesidad de financiación",
      schedule: "Calendario de pagos desde la subasta",
      deposit: "Fianza — qué debe hacer el banco",
      collateral: "Garantía para el banco — cuándo nace",
      object: "Inmueble y valor de tasación",
      risks: "Derechos y riesgos",
      limit: "Cálculo de la puja máxima",
      documents: "Documentación para el banco",
      notThis: "Qué no es este dossier",
      sources: "Fuentes",
    },
  },

  Form: {
    Title: "Sus datos para el dossier",
    Lead: "Todo empieza en blanco. El dossier comparte capital propio, interés y amortización con la calculadora de límite de puja: cualquier cambio aquí se aplica también allí.",
    StorageHint: "Guardado solo en este navegador. Estos campos no se imprimen, solo el resultado.",
    Fields: {
      plannedBid: { label: "Puja máxima prevista", hint: "Déjelo en blanco para tomar su límite de puja." },
      equity: { label: "Capital propio", hint: "Lo que aporta usted mismo, incluida la fianza." },
      interestPct: { label: "Interés de cálculo", hint: "Su supuesto. El interés real lo indica el banco." },
      repaymentPct: { label: "Amortización inicial", hint: "Anual, en porcentaje del préstamo." },
      fixedYears: { label: "Periodo de tipo fijo deseado", hint: "" },
    },
    Applicant: { label: "Solicitante (opcional)", hint: "Aparece en la solicitud. Permanece en este navegador.", placeholder: "Nombre y apellidos" },
    Method: { label: "Fianza mediante", empty: "aún sin definir" },
    Methods: {
      cheque: "Cheque del Bundesbank / cheque conformado",
      guarantee: "Aval bancario",
      transfer: "Transferencia a la caja del juzgado",
      portal: "Portal e-Satış",
    },
    Use: { label: "Uso previsto", empty: "aún sin definir" },
    Uses: { own: "Vivienda propia", rent: "Alquiler", resale: "Reventa" },
    YearsSuffix: "años",
    Reset: "Borrar datos del dossier",
  },

  Ask: {
    Salutation: "Estimados señores:",
    Intro: "Tengo la intención de pujar en el procedimiento de subasta forzosa {fileNo} ante el {court} por el inmueble {object}. Fecha de subasta: {date}. Valor de tasación según edicto: {value}.",
    Applicant: "Solicitante: {name}",
    NoApplicant: "Solicitante: ______________________",
    Requests: {
      loan: "Financiación por {amount} — costes totales de {total} menos capital propio de {equity} (desglose en el apartado 02).",
      guarantee: "Un aval indefinido, incondicional y solidario por {amount} como fianza para el acto de subasta (§ 69 apdo. 3 ZVG).",
      cheque: "Un cheque del Bundesbank o conformado por {amount}, emitido como pronto el tercer día hábil anterior a la subasta (§ 69 apdo. 2 ZVG).",
      transfer: "Una transferencia por {amount} a la caja del juzgado, abonada en cuenta antes de la subasta, junto con su justificante (§ 69 apdo. 4 ZVG).",
      portal: "Puesta a disposición del teminat por {amount} antes de pujar en el portal e-Satış.",
      timing: "Una confirmación escrita de financiación antes de la subasta, dado que los pagos posteriores están sujetos a los plazos legales del apartado 03.",
    },
    MissingBid: "Falta la puja máxima: introdúzcala arriba o calcule su límite de puja.",
    MissingEquity: "Falta el capital propio: sin él no es posible indicar el importe del préstamo.",
    MissingMethod: "La vía para la fianza sigue sin definir.",
    Closing: "Quedo a su disposición para cualquier consulta y para facilitar el informe de tasación.",
  },

  Request: {
    UsesTitle: "Empleo de fondos",
    SourcesTitle: "Origen de fondos",
    Bid: "Puja máxima",
    BidFromLimit: "de su límite de puja",
    BidOwn: "su indicación",
    Total: "Costes totales",
    Equity: "Capital propio",
    Loan: "Necesidad de préstamo",
    LoanToValue: "Préstamo sobre valor de tasación",
    LoanToValueNote: "Valor de tasación según el juzgado; el banco calcula su propio valor hipotecario.",
    EquityShare: "Cuota de capital propio",
    TermsTitle: "Condiciones deseadas",
    Interest: "Interés de cálculo",
    InterestNote: "Su supuesto, no una oferta",
    Repayment: "Amortización inicial",
    MonthlyRate: "Cuota con su interés de cálculo",
    FixedYears: "Fijación de tipo",
    Use: "Uso",
    Incomplete: "Falta una partida legal de costes (p. ej., tipo impositivo ausente en el edicto): los costes totales están infravalorados.",
    EquityShortForDeposit: "Su capital propio no cubre la fianza. El banco tendrá que prefinanciarla o prestar un aval.",
    Guarantee: "Adicionalmente: aval para la fianza",
    GuaranteeBasis: "§ 69 apdo. 3 ZVG",
  },

  Schedule: {
    Columns: { when: "Cuándo", what: "Concepto", amount: "Importe" },
    Steps: {
      DE: {
        deposit: { when: "En el acto, justo después de la puja", text: "Fianza: una décima parte del valor de tasación si lo solicita un interesado. Cuente con ello.", basis: "§§ 67, 68 apdo. 1 ZVG", law: "zvg68" },
        balance: { when: "Antes de la fecha de reparto (fijada por el juzgado tras la adjudicación)", text: "Remate en metálico a la caja del juzgado: abonado antes de la comparecencia, con justificante en el acto. Se descuenta la fianza transferida a la caja del juzgado.", basis: "§ 49 apdo. 3, § 107 apdo. 3 ZVG", law: "zvg49" },
        bidInterest: { when: "Con el remate en metálico", text: "4 % de interés sobre el remate en metálico desde la adjudicación hasta la fecha de reparto.", basis: "§ 49 apdo. 2 ZVG en rel. con § 246 BGB", law: "zvg49" },
        transferTax: { when: "Un mes después de la liquidación tributaria", text: "Impuesto de transmisiones patrimoniales sobre la puja y los derechos subsistentes.", basis: "§§ 9, 15 GrEStG", law: "grestg" },
        courtFee: { when: "Tras la factura de costas del juzgado", text: "Tasa por el auto de adjudicación.", basis: "KV 2214 GKG" },
        registryFee: { when: "Tras la inscripción", text: "Inscripción como propietario en el registro de la propiedad.", basis: "KV 14110 GNotKG" },
        own: { when: "Según su plan", text: "Reforma, desalojo y otros.", basis: "Su indicación" },
      },
      TR: {
        deposit: { when: "Antes de pujar", text: "Teminat en el portal e-Satış.", basis: "İİK m.114/7", law: "esatis" },
        balance: { when: "En los 7 días siguientes a la publicación del acta de subasta", text: "Precio restante (puja menos teminat), al contado. Sin prórroga.", basis: "İİK m.130", law: "iik" },
        fees: { when: "Según requerimiento de la oficina de ejecución, antes de la inscripción", text: "KDV, tasa de Tapu, impuesto de timbre, Döner sermaye.", basis: "Condiciones de venta (şartname)" },
        own: { when: "Según su plan", text: "Reforma, desalojo y otros.", basis: "Su indicación" },
      },
    },
    BalanceGuaranteeNote: "Con un aval no se descuenta nada: debe abonarse la totalidad del remate en metálico.",
    BalanceOpenNote: "Vía de fianza sin definir: calculado sin descuento.",
    MissingInterestDays: "Introducir días hasta la fecha de reparto en el límite de puja",
    Unknown: "no calculable",
    Footnote: {
      DE: "Las fechas posteriores a la adjudicación las fijan el juzgado y Hacienda. Por eso el dossier indica el orden legal y no una fecha inventada.",
      TR: "El plazo de 7 días corre desde la publicación del acta en el portal, no desde el día de la subasta.",
    },
  },

  Deposit: {
    Lead: {
      DE: "Importe: una décima parte del valor de tasación (§ 68 apdo. 1 ZVG). Queda excluido el efectivo (§ 69 apdo. 1 ZVG). Solo se admiten estas tres vías:",
      TR: "El teminat se deposita antes de pujar en el portal e-Satış. Las formas admitidas por la oficina de ejecución figuran en el pliego de condiciones (şartname) del anuncio.",
    },
    Ways: {
      DE: [
        { id: "cheque", title: "Cheque del Bundesbank o cheque conformado", text: "Emitido por una entidad de crédito autorizada en Alemania o por el Bundesbank, pagadero en el país, como pronto el tercer día hábil antes de la subasta. Un cheque emitido antes será rechazado.", basis: "§ 69 apdo. 2 ZVG", law: "zvg69" },
        { id: "guarantee", title: "Aval bancario", text: "Indefinido, incondicional y solidario, de dicha entidad de crédito, pagadero en el país. El banco puede cobrar comisión de aval.", basis: "§ 69 apdo. 3 ZVG", law: "zvg69" },
        { id: "transfer", title: "Transferencia a la caja del juzgado", text: "El importe debe estar abonado en la cuenta de la caja del juzgado antes de la subasta y el justificante debe presentarse en el acto. El juzgado indica la cuenta y el concepto.", basis: "§ 69 apdo. 4 ZVG", law: "zvg69" },
      ],
      TR: [{ id: "portal", title: "Teminat en el portal e-Satış", text: "Debe depositarse en el portal antes de pujar, acceso mediante e-Devlet. Se imputa al precio; quien no paga tras la adjudicación lo pierde.", basis: "İİK m.114/7, m.130", law: "esatis" }],
    },
    Chosen: "elegido",
  },

  Collateral: {
    Lead: {
      DE: "Los bancos dudan en las subastas judiciales sobre todo por una razón: desembolsan antes de que su deuda territorial (Grundschuld) esté inscrita en el registro. Así es el proceso según la ley:",
      TR: "Los bancos dudan en las subastas İcra sobre todo por una razón: tendrían que pagar en 7 días, mientras que su hipoteca no llega hasta después de la inscripción. Así es el proceso según la ley:",
    },
    Items: {
      DE: [
        { text: "Con la adjudicación usted se convierte en propietario, sin escritura notarial y antes de cualquier inscripción.", basis: "§ 90 apdo. 1 ZVG" },
        { text: "Puede autorizar una deuda territorial (Grundschuld) a favor del banco tras la adjudicación. Sin embargo, solo se inscribirá después de que el juzgado solicite al registro su inscripción como propietario.", basis: "§ 130 apdo. 3 ZVG", law: "zvg130" },
        { text: "El juzgado solo cursa esta solicitud cuando se ha ejecutado el plan de reparto y la adjudicación es firme, es decir, después de la fecha de reparto.", basis: "§ 130 apdo. 1 ZVG", law: "zvg130" },
        { text: "Para inscribirle, el registro necesita el certificado de solvencia fiscal (Unbedenklichkeitsbescheinigung) de Hacienda, que por regla general presupone haber pagado el impuesto de transmisiones.", basis: "§ 22 GrEStG", law: "grestg" },
        { text: "Si no abona el remate en metálico, el juzgado transfiere el crédito a los acreedores, lo asegura con hipotecas de garantía sobre su finca y se expone a una nueva subasta.", basis: "§§ 118, 128, 133 ZVG", law: "zvg118" },
        { text: "Cómo asegura el banco el tiempo hasta la inscripción — p. ej., constituyendo ante notario la Grundschuld justo tras la adjudicación y desembolsando a la caja del juzgado — lo decide el banco.", basis: "Decisión del banco" },
      ],
      TR: [
        { text: "El teminat se deposita en el portal antes de pujar y se descuenta del precio.", basis: "İİK m.114/7", law: "iik" },
        { text: "El resto del precio se paga al contado en los 7 días siguientes a la publicación del acta en el portal. Desde la reforma de 2021 ya no hay prórroga.", basis: "İİK m.130 (Ley n.º 7343)", law: "iik" },
        { text: "La inscripción (tescil) solo se produce cuando la adjudicación es firme. Solo después puede inscribirse una hipoteca (ipotek) a favor del banco.", basis: "İİK m.134", law: "iik" },
        { text: "Si no paga, pierde el teminat. Para las subastas anunciadas a partir del 31.07.2026, la ley prevé además una multa del 5 % de la puja.", basis: "İİK m.114 apdo. 7 n.º 9 (Ley n.º 7589)", law: "iik" },
        { text: "Consecuencia: sin preaprobación (ön onay) antes de pujar, apenas es posible cumplir el plazo de 7 días con un banco.", basis: "Plazos İİK m.130, m.134" },
      ],
    },
  },

  Object: {
    ReportTitle: "Datos clave del informe de tasación",
    NoReport: "No se ha subido ningún informe de tasación. Súbalo en la ficha del expediente: el banco lo exigirá completo de todos modos.",
    ReportFrom: "de «{file}», literal con página",
    RisksLead: "Semáforo de riesgos según edicto y tasación. Gris significa que ninguna fuente dice nada al respecto.",
    RiskFrom: { notice: "Edicto", report: "Tasación pág. {pages}", none: "sin fuente" },
  },

  Documents: {
    Lead: "Lo que suelen pedir los bancos. Cada entidad tiene su propia lista: consúltela.",
    Groups: {
      DE: [
        { title: "Sobre el inmueble", items: ["Informe completo de tasación (en el juzgado o en zvg-portal.de)", "Señalamiento de subasta / edicto", "Nota simple o extracto registral (suele ir anexo a la tasación)", "Plano catastral y cálculo de superficie habitable", "Contratos de arrendamiento, si está alquilado", "Presupuesto de reforma, si está prevista"] },
        { title: "Sobre usted", items: ["Documento de identidad o pasaporte", "Justificantes de ingresos de los últimos meses", "Liquidaciones del impuesto sobre la renta", "Justificante del capital propio", "Declaración patrimonial del banco", "Relación de préstamos vigentes"] },
      ],
      TR: [
        { title: "Sobre el inmueble", items: ["Anuncio de subasta y pliego de condiciones (şartname)", "Informe de valoración (kıymet takdir raporu)", "Extracto del Tapu y datos de parcela (ada / parsel)", "Fotos y plano de situación, si existen"] },
        { title: "Sobre usted", items: ["Kimlik / pasaporte", "Justificantes de ingresos", "Número de identificación fiscal", "Justificante del capital propio"] },
      ],
    },
  },

  NotThis: {
    Items: [
      { text: "Ni compromiso de préstamo ni oferta. Si se financia y en qué condiciones lo decide únicamente el banco.", basis: "—" },
      { text: "Sin intermediación de crédito. Belowmark no intermedia préstamos ni habla con ningún banco en su nombre.", basis: "§ 34i GewO", law: "gewo34i" },
      { text: "Sin valor de tasación hipotecaria. El valor de mercado procede de la tasación judicial; el banco realiza su propia valoración.", basis: "BelWertV" },
      { text: "Sin asesoramiento jurídico. Los preceptos legales están enlazados para su consulta.", basis: "—" },
    ],
  },

  SourceNames: {
    notice: "Edicto oficial",
    document: "Edicto (PDF)",
    zvg: "Ley de Subastas Forzosas (ZVG)",
    grestg: "Ley del Impuesto de Transmisiones Inmobiliarias (GrEStG)",
    gewo: "Ordenanza Industrial § 34i (GewO)",
    iik: "İcra ve İflas Kanunu (İİK)",
    esatis: "UYAP e-Satış",
  },
};
