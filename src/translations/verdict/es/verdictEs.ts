import { IVerdictTranslation } from "../IVerdictTranslation";

export const VERDICT_ES: IVerdictTranslation = {
  Section: {
    Eyebrow: "Veredicto",
    Title: "¿Pujar o dejarlo pasar?",
    Lead: "Un veredicto elaborado a partir del edicto, su informe de tasación, la ley y sus propias cifras. Solo dice «pujar» cuando no queda nada esencial pendiente, y cita la fuente de cada motivo.",
    Disclaimer: "Orientación basada en sus datos, no asesoramiento jurídico ni de inversión. Son determinantes el registro de la propiedad, la tasación y las indicaciones del juzgado en el acto de subasta.",
  },
  Locked: {
    Title: "Veredicto en el plan Investor",
    Body: "El Veredicto combina el control de riesgos, la tasación y el límite de puja en una recomendación clara por inmueble. Está disponible en el plan Investor.",
  },

  States: {
    go: { Stamp: "Pujar", Headline: "Pujar hasta {amount}", Sub: "Según sus cifras y las fuentes disponibles. No puje por encima de este importe." },
    open: { Stamp: "Aún no listo para pujar", Headline: "Provisionalmente hasta {amount}", Sub: "Este límite está sujeto a reserva. Solo se convertirá en un veredicto firme cuando se aclaren los puntos abiertos de abajo." },
    stop: { Stamp: "No pujar", Headline: "No pujar", Sub: "Al menos un motivo respaldado por las fuentes desaconseja claramente la puja — véase más abajo." },
    none: { Stamp: "Sin veredicto", Headline: "No es posible emitir un veredicto", Sub: "Para este procedimiento no es posible realizar una valoración actualmente." },
  },
  GoUnverified: "Atención: sus costes de reforma no han sido comprobados ni in situ ni mediante presupuesto. El límite es tan fiable como lo sea esa cifra.",
  OpenNoLimit: { Headline: "Todavía sin límite", Sub: "Sin sus objetivos en el límite de puja no existe tope máximo. La lista siguiente muestra qué falta todavía." },
  Groups: {
    none: "Por qué no hay veredicto",
    stop: "Por qué no pujar",
    gap: "Antes de pujar",
    caution: "Tener en cuenta",
    ok: "Qué habla a favor",
  },

  Reasons: {
    noValue: "El edicto no indica ningún valor de tasación. Sin él no se pueden calcular ni los límites legales ni los costes.",
    cancelled: "Según el portal, la subasta ha sido cancelada.",
    past: "La fecha de la subasta está en el pasado.",
    unreachable: "Sus objetivos no se alcanzan con ninguna puja, ni siquiera en 0. Los costes y el alquiler no dan para ello.",
    belowStart: "Su límite de {amount} está por debajo de la puja mínima de {other}. No es posible pujar tan bajo.",
    belowHalf: "Su límite incluidos los derechos subsistentes ({amount}) está por debajo de los 5/10 del valor de tasación ({other}). En la primera subasta se deniega de oficio la adjudicación: vuelva a evaluarlo como pronto en la siguiente convocatoria.",
    rightStays: "{risk} según la fuente. Puede subsistir tras la adjudicación y restarle uso o valor. Puje solo cuando el juzgado haya confirmado si se extingue y su valor figure en el límite de puja bajo «Derechos subsistentes» (también 0).",
    noTargets: "En el límite de puja aún no figura ningún objetivo (rentabilidad, cashflow o precio de reventa). Sin objetivo no hay límite máximo.",
    noReport: "No se ha subido ningún informe de tasación. Por tanto, las cargas, los desperfectos y la contaminación solo se conocen por el edicto, que casi nunca los detalla.",
    noRenovation: "No se ha introducido ningún importe de reforma. Introduzca su estimación, incluso 0 si no hay nada que hacer.",
    noClearance: "Posible presencia de inquilinos u ocupantes, pero no se han introducido costes de desalojo o transición (también 0).",
    askInspection: "Indique si ha visitado el inmueble.",
    askOccupancy: "Indique quién ocupa el inmueble, en la medida en que lo sepa.",
    askRights: "Indique si ha consultado en el juzgado los derechos que subsisten.",
    rightsOpen: "Todavía no ha comprobado las cargas. Lo que subsista tras la adjudicación deberá asumirlo o pagarlo además de su puja.",
    askCostBasis: "Indique en qué se basan sus costes de reforma y desalojo.",
    costsIncomplete: "No se puede calcular una partida de costes legales a partir del edicto: los costes totales están incompletos.",
    contamination: "Suelos contaminados según la tasación. Solo un informe técnico especializado permite saber cuánto cuesta la descontaminación. No puje hasta que sus costes se basen en un presupuesto.",
    rightPriced: "{risk} según la fuente — aclarado en el juzgado e incluido con {amount} en el límite de puja.",
    notInside: "No ha estado dentro del inmueble. Su presupuesto de reforma no está verificado: la prueba de estrés de abajo muestra cómo afectan los sobrecostes al límite.",
    reportOutsideOnly: "Tampoco el perito pudo visitar (por completo) el interior del inmueble.",
    estimateOnly: "Sus costes de reforma son una estimación propia, no un presupuesto.",
    defects: "La tasación menciona desperfectos o daños. Compruebe si su partida de reforma los cubre.",
    tenant: "El inmueble está (probablemente) alquilado. Los contratos de arrendamiento se transmiten al adjudicatario: calcule con el alquiler real, no con un alquiler deseado.",
    heritage: "Protección monumental según la fuente. Las obras y reformas requieren autorización de patrimonio y suelen resultar más caras.",
    easement: "La tasación menciona servidumbres o cargas urbanísticas (p. ej., derecho de paso). A menudo subsisten tras la subasta.",
    contaminationUnclear: "El informe de tasación deja abierta la posible existencia de contaminación.",
    oldValuation: "La fecha de valoración es {years} años anterior a la subasta. El mercado y el estado del inmueble pueden haber cambiado desde entonces.",
    valueMismatch: "La tasación indica {amount} y el edicto {other}. Aclare en el juzgado qué valor rige.",
    sevenTenths: "Su límite incluidos los derechos subsistentes ({amount}) está por debajo de 7/10 ({other}). Un acreedor con derecho puede solicitar en la primera subasta que se deniegue la adjudicación.",
    atCeiling: "El límite alcanza el tope de cálculo (el triple del valor de tasación). Probablemente sus objetivos sean demasiado holgados.",
    conflicting: "Las fuentes se contradicen respecto a «{risk}».",
    limitBy: "Su objetivo «{criterion}» permite una puja de hasta {amount}.",
    legalClear: "El límite supera los umbrales legales mínimos de esta subasta.",
    limitsWaived: "Los límites mínimos de valor ya han decaído en este procedimiento.",
    rightsClear: "El derecho de habitación, el usufructo y el derecho de superficie quedan descartados según la fuente.",
  },
  MarketReasons: {
    belowStart: {
      DE: "Su límite de {amount} está por debajo de la puja mínima de {other}.",
      TR: "Su límite de {amount} está por debajo de la puja inicial de {other} (50 % del valor de tasación). En ninguna ronda se puede pujar tan bajo.",
    },
    rightStays: {
      DE: "{risk} según la fuente. Puede subsistir tras la adjudicación y restarle uso o valor. Puje solo cuando el juzgado haya confirmado si se extingue y su valor figure en el límite de puja bajo «Derechos subsistentes» (también 0).",
      TR: "{risk} según la fuente. Si el derecho subsiste tras la adjudicación se desprende del Tapu y de la Satış şartnamesi. Puje solo cuando lo haya comprobado y tenido en cuenta en sus cifras.",
    },
    askRights: {
      DE: "Indique si ha consultado en el juzgado los derechos que subsisten.",
      TR: "Indique si ha revisado las cargas en el registro de Tapu y en la Satış şartnamesi.",
    },
    rightsOpen: {
      DE: "Todavía no ha consultado en el juzgado los derechos que subsisten. Lo que permanezca tras la adjudicación lo asume usted además de la puja.",
      TR: "Todavía no ha revisado el registro de Tapu ni la Satış şartnamesi. Las cargas que subsistan tras la adjudicación correrán de su cuenta.",
    },
    tenant: {
      DE: "El inmueble está (probablemente) alquilado. Los contratos de arrendamiento se transmiten al adjudicatario: calcule con el alquiler real, no con un alquiler deseado.",
      TR: "El inmueble está (probablemente) ocupado o alquilado. Un desalojo puede llevar tiempo y requerir un procedimiento propio: téngalo en cuenta.",
    },
  },
  Actions: {
    limit: "Introducir en el límite de puja",
    report: "Subir tasación",
    questions: "Responder abajo",
  },

  Sources: {
    Label: "Fuente",
    notice: "Edicto",
    report: "Tasación pág. {page}",
    input: "Sus cifras",
    answer: "Su respuesta",
    rule: "Regla de belowmark",
  },

  Questions: {
    Title: "Lo que solo usted puede saber",
    Lead: "Ningún documento dice cómo está el interior hoy ni quién vive allí. Sus respuestas se incorporan al veredicto; sin respuesta, el punto permanece abierto.",
    Items: {
      inspection: {
        Label: "¿Ha visitado el inmueble?",
        Hint: "En las subastas judiciales a menudo no es posible visitar el interior.",
        Options: { inside: "Sí, por dentro", outside: "Solo desde fuera", none: "En absoluto" },
      },
      rights: {
        Label: "¿Ha consultado en el juzgado los derechos que subsisten?",
        Hint: "El letrado judicial (Rechtspfleger) informa, previa consulta antes de la subasta, de la puja mínima y de los derechos que subsisten.",
        Options: { confirmed: "Sí, aclarado", open: "Todavía no" },
      },
      occupancy: {
        Label: "¿Quién ocupa el inmueble?",
        Hint: "Según la tasación, los vecinos o el acreedor, en la medida en que se conozca.",
        Options: { vacant: "Vacío", owner: "Propietario", tenant: "Inquilino", unknown: "No lo sé" },
      },
      costBasis: {
        Label: "¿En qué se basan sus costes de reforma y desalojo?",
        Hint: "Solo es relevante si ha introducido costes.",
        Options: { quote: "Presupuesto / profesional", estimate: "Estimación propia" },
      },
    },
    Rights: {
      DE: { Label: "¿Ha consultado en el juzgado los derechos que subsisten?", Hint: "El letrado judicial (Rechtspfleger) informa, previa consulta antes de la subasta, de la puja mínima y de los derechos que subsisten." },
      TR: { Label: "¿Ha revisado las cargas en el registro de Tapu y en la Satış şartnamesi?", Hint: "Las anotaciones (şerhler), el usufructo (intifa) y el derecho de habitación (sükna hakkı) figuran en el extracto del Tapu y en la Satış şartnamesi en e-Satış." },
    },
    Unanswered: "abierto",
    Reset: "Borrar respuestas",
    StorageHint: "Sus respuestas se guardan únicamente en este navegador.",
  },

  Stress: {
    Title: "Prueba de estrés",
    Lead: "Ejemplo de cálculo, no estimación: ¿cuál sería su límite si la reforma y el desalojo resultaran más caros de lo indicado?",
    Row: "+{pct} % de costes: {limit}",
    Unreachable: "ninguna puja tiene sentido",
    BelowThreshold: "por debajo del límite legal",
    NoLimit: "no calculable",
  },

  Unknowables: {
    Title: "Lo que belowmark no puede saber",
    Items: [
      "El estado del interior: las fotos y la tasación solo muestran lo que el perito pudo ver.",
      "Los costes reales de reforma: para ello hace falta un profesional sobre el terreno.",
      "Si los ocupantes se marcharán voluntariamente y cuánto tardará un lanzamiento.",
      "Cuántos postores más pujarán y hasta qué importe.",
      "Si la subasta se cancelará a última hora: vuelva a comprobarlo la víspera.",
    ],
  },

  File: {
    Title: "Veredicto",
  },
};
