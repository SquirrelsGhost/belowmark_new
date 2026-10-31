import { IClosingTranslation } from "../IClosingTranslation";
import { CLOSING_TASKS_ES } from "./closingTasksEs";

export const CLOSING_ES: IClosingTranslation = {
  MetaTags: {
    Tasks: {
      title: "Después de la adjudicación — Belowmark",
      description: "Lista de tareas tras la adjudicación: pago, impuesto de transmisiones, registro de la propiedad, lanzamiento, seguro y reforma — con plazos y leyes enlazadas.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Adjudicación", "Subasta judicial", "Registro de la propiedad", "Lanzamiento"],
      url: "https://belowmark.com/app",
    },
    Results: {
      title: "Resultados de subastas — Belowmark",
      description: "Qué precios alcanzan las subastas judiciales: adjudicación en relación con el valor de tasación, a partir de resultados comunicados, anónimo desde cinco subastas por grupo.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Adjudicación", "Valor de tasación", "Resultado de subasta", "Subasta judicial"],
      url: "https://belowmark.com/app/ergebnisse",
    },
  },

  Section: {
    Eyebrow: "Después de la subasta",
    Title: "Resultado y adjudicación",
    Lead: {
      DE: "¿Estuvo en la subasta? Indique cuánto se pujó. El portal oficial no publica resultados: con sus aportaciones se elabora un resumen anónimo de precios. Si usted mismo obtuvo la adjudicación, la lista de tareas le guía hasta el registro de la propiedad.",
      TR: "¿Participó en la subasta? Indique cuánto se pujó. El portal no publica resultados: con sus aportaciones se elabora un resumen anónimo de precios. Si usted mismo ganó la subasta (ihale), la lista de tareas le guía hasta el Tapu.",
    },
  },

  Result: {
    Title: "Comunicar resultado de la subasta",
    Lead: "Solo cifras, sin nombres. Puede corregir su comunicación en cualquier momento.",
    NotYet: "Puede registrar un resultado a partir del día de la subasta.",
    HearingDate: "Fecha de la subasta",
    Outcome: "Resultado",
    Outcomes: {
      awarded: "Adjudicación otorgada",
      refused: "Adjudicación denegada",
      pending: "Decisión aplazada",
      noBids: "Sin pujas",
      cancelled: "La subasta no se celebró",
    },
    HighestBid: {
      DE: { label: "Puja máxima (remate en metálico / Bargebot)", hint: "Según el acta o el auto de adjudicación" },
      TR: { label: "Precio de adjudicación (ihale bedeli)", hint: "Según el acta de la subasta" },
    },
    RetainedRights: { label: "Derechos subsistentes", hint: "Si constan — forman parte del precio total" },
    BidderCount: { label: "Número de postores", hint: "Si lo sabe" },
    Source: "¿De dónde proceden las cifras?",
    Sources: { attended: "Asistí a la subasta", protocol: "Acta / resolución", court: "Información del juzgado" },
    IsBuyer: { DE: "He obtenido la adjudicación", TR: "He obtenido la adjudicación (ihale)" },
    AwardDate: {
      DE: { label: "Adjudicación pronunciada el", hint: "Vacío = día de la subasta" },
      TR: { label: "Acta publicada el", hint: "Desde este día corren los 7 días de plazo de pago" },
    },
    Shared: { label: "Incluir de forma anónima en el resumen de precios", hint: "Solo se muestra una mediana por región y tipo de inmueble a partir de cinco subastas; nunca su registro individual." },
    Privacy: "Guardamos la fecha, el resultado, los importes y el número de postores de este expediente, nunca nombres de postores, adjudicatarios ni propietarios.",
    Save: "Guardar resultado",
    Saved: "Guardado.",
    SavedBuyer: "Guardado. Su lista de tareas ya está creada.",
    Errors: {
      auth: "Por favor, vuelva a iniciar sesión.",
      locked: "La lista de tareas pertenece al plan Investor.",
      date: "Introduzca una fecha válida (no anterior a la subasta).",
      future: "Los resultados solo pueden comunicarse a partir del día de la subasta.",
      outcome: "Seleccione el resultado.",
      bid: "Si hubo adjudicación, introduzca la puja (número entero).",
      ratio: "La puja no guarda proporción con el valor de tasación; revísela.",
      bidders: "Introduzca un número plausible de postores.",
      buyer: "«He obtenido la adjudicación» solo es compatible con «Adjudicación otorgada».",
      unknown: "No se pudo guardar. Inténtelo de nuevo.",
    },
    Ratio: "{pct} del valor de tasación",
    StatsLink: "Ver resumen de precios",
  },

  Teaser: {
    Title: "Su lista de tareas tras la adjudicación",
    Lead: "Pago, impuestos, registro de la propiedad, posesión, seguro y reforma, con sus plazos.",
    Button: "Abrir lista de tareas",
    Progress: "{done} de {total} completadas",
    Next: "Siguiente: {title} · {date}",
    NoDate: "Introduzca la fecha de adjudicación para que la lista calcule los plazos.",
  },

  Tasks: {
    Kicker: "Después de la adjudicación",
    Title: "Lista de tareas",
    Lead: {
      DE: "Desde la adjudicación hasta la inscripción en el registro de la propiedad y la entrega. Calculamos los plazos únicamente a partir de las fechas que usted introduce. Cada afirmación cita su precepto legal.",
      TR: "Desde la ihale hasta la inscripción en el Tapu y la entrega. Calculamos los plazos únicamente a partir de las fechas que usted introduce. Cada afirmación cita su precepto legal.",
    },
    Back: "Volver a la ficha del expediente",
    Disclaimer:
      "Esta lista sirve de orientación y no constituye asesoramiento jurídico. Resume el texto legal de forma simplificada (estado a 26.10.2026) y no conoce su caso particular. Para plazos, rescisiones y lanzamientos, consulte al juzgado, al notario o a un abogado.",
    Locked: {
      Title: "Lista de tareas en el plan Investor",
      Body: "Su resultado está guardado. La lista de tareas con plazos y recordatorios forma parte del plan Investor.",
      Cta: "Contratar Investor",
    },
    Dates: {
      Title: "Sus fechas",
      Lead: "La lista calcula los plazos a partir de estos datos. Deje en blanco lo que aún no sepa.",
      Fields: {
        DE: {
          awardDate: { label: "Adjudicación pronunciada el", hint: "Obligatorio" },
          distributionDate: { label: "Comparecencia de reparto (Verteilungstermin)", hint: "Consta en la citación" },
          taxNoticeDate: { label: "Liquidación del impuesto de transmisiones del", hint: "Fecha de notificación" },
          handoverDate: { label: "Entrega / lanzamiento el", hint: "Previsto o realizado" },
        },
        TR: {
          awardDate: { label: "Acta de subasta publicada el", hint: "Obligatorio — inicio de los 7 días" },
          handoverDate: { label: "Entrega / lanzamiento el", hint: "Previsto o realizado" },
        },
      },
      FromPortfolio: "Importado de su cartera — por favor, guarde.",
      Save: "Guardar fechas",
      Saved: "Guardado.",
      Required: "Introduzca al menos la fecha de adjudicación.",
      Errors: {
        auth: "Por favor, vuelva a iniciar sesión.",
        locked: "La lista de tareas pertenece al plan Investor.",
        date: "Introduzca al menos la fecha de adjudicación.",
        unknown: "No se pudo guardar. Inténtelo de nuevo.",
      },
    },
    Conditions: {
      Title: "Su situación",
      Lead: "Muestra únicamente las tareas que corresponden. Se guarda en este navegador.",
      Items: { tenant: "Hay inquilinos", ownerOccupied: "El propietario anterior sigue viviendo allí", condo: "Piso en propiedad horizontal", house: "Vivienda unifamiliar o bifamiliar" },
    },
    Phases: { first: "Los primeros días", payment: "Pago", register: "Impuestos y Registro", possession: "Posesión e inquilinos", works: "Reforma y gestión" },
    Due: { deadline: "a más tardar el {date}", earliest: "como pronto el {date}", on: "desde el {date}" },
    Missing: "Falta fecha: {field}",
    States: { done: "Completada", overdue: "Vencida", soon: "Próxima a vencer", open: "Abierta", undated: "Sin fecha" },
    Basis: { law: "Ley", practice: "Procedimiento", rule: "Regla Belowmark" },
    Check: "Situación legal modificada o no aclarada definitivamente — revisar",
    MarkDone: "Completada",
    MarkOpen: "Reabrir",
    Sources: "Fuentes",
    Progress: "{done} de {total} completadas",
    Items: CLOSING_TASKS_ES,
  },

  Results: {
    Kicker: "Resultados de subastas",
    Title: "Lo que realmente se paga",
    Lead: "Adjudicaciones comunicadas en relación con el valor de tasación. Las cifras proceden de los usuarios, no del juzgado: muestran un nivel de precios, no una valoración de su inmueble.",
    Method: {
      Title: "Cómo calculamos",
      Items: [
        "Cuota = (puja máxima + derechos subsistentes) ÷ valor de tasación según el edicto.",
        "Si varios usuarios comunican la misma subasta, cuenta una sola vez con la mediana de las comunicaciones.",
        "Las cifras solo aparecen a partir de cinco subastas por grupo. Por debajo solo mostramos el número.",
        "Sin nombres ni números de expediente en el resumen. Sus propias comunicaciones solo las ve usted.",
      ],
    },
    Table: { Region: "Región", Segment: "Tipo de inmueble", Awarded: "Adjudicaciones", Median: "Mediana", Range: "Mitad central", Bidders: "Postores (mediana)", Reported: "Subastas comunicadas" },
    AllSegments: "Todos los tipos de inmueble",
    Total: "Total",
    OtherRegion: "Sin región",
    TooFew: "{n} — muy pocas (desde {min})",
    Empty: "Todavía no hay comunicaciones en su mercado. El resumen se completará en cuanto los usuarios registren resultados en la ficha del expediente bajo «Resultado y adjudicación».",
    Locked: "El resumen de precios pertenece al plan Investor. Aun así puede comunicar resultados.",
    Own: { Title: "Sus comunicaciones", Lead: "Visible solo para usted.", Empty: "Todavía no ha comunicado ningún resultado.", Shared: "en resumen", Private: "privado", Buyer: "Su adjudicación" },
  },
};
