import { IDeadlineTranslation } from "../IDeadlineTranslation";

export const DEADLINE_ES: IDeadlineTranslation = {
  MetaTags: {
    title: "Asistente de Plazos — Belowmark",
    description: "Todos los plazos desde el edicto hasta la adjudicación con base legal: depósito de garantía, fecha del cheque, subasta, teminat. Recordatorios por correo y calendario.",
    imgUrl: "https://belowmark.com/og/home.png",
    tags: ["Plazos", "Subasta judicial", "Depósito de garantía", "Calendario"],
    url: "https://belowmark.com/app/termine",
  },
  Nav: "Plazos",

  Section: {
    Eyebrow: "Asistente de Plazos",
    Title: "Plazos y hoja de ruta",
    Lead: {
      DE: "Cada plazo hasta la adjudicación, calculado a partir de la fecha del edicto y respaldado por su artículo legal. Siga el procedimiento para recibir recordatorios por correo y en su calendario.",
      TR: "Cada plazo de las rondas de e-Satış, calculado a partir de los datos del İlan y respaldado por la normativa. Siga el procedimiento para recibir recordatorios por correo y en su calendario.",
    },
    Locked: {
      Title: "Plazos con recordatorio",
      Body: "El Asistente de Plazos calcula el depósito de garantía, la fecha del cheque y la adjudicación a partir del edicto y le avisa por correo y calendario. Incluido en el plan Investor.",
    },
    NoDates: "El edicto no indica ninguna fecha de subasta, por lo que no se puede calcular ningún plazo.",
    Cancelled: "El procedimiento ha sido cancelado. Los plazos ya no están en curso.",
    Phases: { before: "Antes de la subasta", hearing: "Subasta", after: "Después de la adjudicación" },
    Basis: { law: "Ley", notice: "Edicto", user: "Su dato", rule: "Recomendación de belowmark" },
    Kinds: { deadline: "Plazo", appointment: "Subasta", task: "A partir de entonces", info: "Orientativo" },
    AfterAwardEmpty: "Los plazos posteriores a la adjudicación (pago, impuestos, registro de la propiedad, lanzamiento) aparecerán aquí en cuanto registre el resultado de la subasta.",
    Reminders: "Recordatorio",
    ReminderDay: "1 día antes",
    ReminderDays: "{days} días antes",
    ReminderToday: "el mismo día",
    Disclaimer: "Calculado sin días festivos y de forma prudente para que ninguna fecha llegue tarde. Son determinantes la ley y la citación del juzgado; no constituye asesoramiento jurídico.",
  },

  Status: {
    Past: "pasado",
    Today: "hoy",
    Tomorrow: "mañana",
    InDays: "en {days} días",
  },

  Follow: {
    Start: "Seguir procedimiento",
    Stop: "Dejar de seguir",
    Following: "Está siguiendo este procedimiento.",
    NotFollowing: "Aún no hay recordatorios configurados.",
    MailOn: "Recordatorio por correo activado",
    MailOff: "Recordatorio por correo desactivado",
    Download: "Plazos como calendario (.ics)",
    Overview: "Todos los plazos",
    Error: "No ha funcionado. Por favor, inténtelo de nuevo.",
  },

  Checklist: {
    Title: "Hoja de ruta hasta la subasta",
    Hint: "Las casillas marcadas se guardan en este navegador. Los pasos con marca de belowmark los detectamos automáticamente.",
    Progress: "{done} de {total} completados",
    Auto: "detectado",
    Steps: {
      DE: [
        { id: "gutachten", Label: "Analizar el informe de tasación", Hint: "Suba la tasación; el semáforo de riesgos revisa cargas, inquilinos y año de construcción." },
        { id: "inspection", Label: "Visitar el inmueble", Hint: "Al menos desde el exterior; las preguntas al respecto figuran en el Veredicto." },
        { id: "limit", Label: "Fijar el límite de puja", Hint: "¿Hasta qué puja salen las cuentas? Sus cifras, su límite." },
        { id: "bank", Label: "Solicitar financiación", Hint: "El dosier bancario muestra al banco el plan de pagos y los plazos." },
        { id: "deposit", Label: "Preparar la consignación / garantía", Hint: "Transferencia, cheque bancario o aval: los días exactos figuran en el cronograma." },
        { id: "papers", Label: "Imprimir carpeta de postor", Hint: "Documento de identidad, poder notarial, justificante de la garantía y su límite en papel." },
      ],
      TR: [
        { id: "gutachten", Label: "Leer el kıymet takdir raporu", Hint: "Suba el informe; el semáforo de riesgos revisa cargas, inquilinos y estado." },
        { id: "inspection", Label: "Visitar el inmueble", Hint: "Al menos desde el exterior; las preguntas al respecto figuran en el Veredicto." },
        { id: "limit", Label: "Fijar el límite de teklif", Hint: "¿Hasta qué puja resulta rentable, incluyendo tapu harcı y KDV?" },
        { id: "bank", Label: "Aclarar la financiación de antemano", Hint: "Tras la ronda solo quedan 7 días para pagar; sin preaprobación bancaria el margen es muy justo." },
        { id: "deposit", Label: "Depositar el teminat", Hint: "En efectivo a través del portal o mediante teminat mektubu: los plazos están en el cronograma." },
        { id: "papers", Label: "Comprobar acceso a e-Devlet y al portal", Hint: "Solo se puede pujar iniciando sesión en el portal e-Satış mediante e-Devlet." },
      ],
    },
  },

  Items: {
    DE: {
      Notice: {
        Title: "Publicación del edicto",
        Detail: "La fecha de la subasta debe anunciarse con al menos seis semanas de antelación. Aquí comienza su preparación.",
      },
      Transfer: {
        Title: "Garantía por transferencia: abonada en cuenta",
        Detail: "El efectivo está excluido. Una transferencia solo cuenta si está abonada en la cuenta de la caja judicial antes de la subasta y usted presenta el justificante en el acto. El juzgado indica cuenta y concepto. Calculado con margen de seguridad: la víspera.{amount}",
      },
      Cheque: {
        Title: "Primer día válido para emitir el cheque (Verrechnungsscheck)",
        Detail: "Un cheque cruzado (Verrechnungsscheck) solo es válido si ha sido expedido como pronto el tercer día hábil antes de la subasta, por un banco autorizado en Alemania o el Bundesbank, y pagadero en el país. Si se emite antes, será rechazado. Calculado contando el sábado como día hábil y sin festivos, para no emitirlo nunca demasiado pronto.",
      },
      Hearing: {
        Title: "Acto de subasta",
        Detail: "{authority}. Entre el llamamiento a presentar pujas y el cierre deben transcurrir al menos 30 minutos. Llevar: documento de identidad, justificante de la garantía y, en caso de representación, poder con firma legitimada notarialmente.",
      },
      Award: {
        Title: "Adjudicación a más tardar (plazo orientativo)",
        Detail: "La adjudicación se pronuncia en el mismo acto o en una comparecencia específica de pronunciamiento que no debe señalarse más allá de una semana. Con el pronunciamiento usted pasa a ser propietario. La fecha exacta la fija el juzgado.",
      },
      Amount: " Importe si un interesado exige garantía: {amount} (10 % del valor de tasación).",
    },
    TR: {
      Notice: {
        Title: "İlan publicado",
        Detail: "La ronda debe anunciarse en el portal e-Satış al menos 15 días antes de su inicio.",
      },
      RoundStart: {
        Title: "Comienza la {round}.ª subasta (Artırma)",
        Detail: "A partir de ahora se pueden presentar pujas en el portal e-Satış; la ronda dura siete días.{startingBid}",
      },
      Cash: {
        Title: "{round}.ª Artırma: teminat en efectivo hasta las 23:30 h",
        Detail: "Ingrese la garantía a través del portal en la cuenta de la İcra dairesi a más tardar a las 23:30 h del día anterior al cierre de la ronda.{amount}",
      },
      Letter: {
        Title: "{round}.ª Artırma: teminat mektubu hasta el cierre de oficina",
        Detail: "Un aval bancario debe entregarse en la İcra dairesi a más tardar el día hábil anterior al final de la ronda antes del fin del horario de oficina. No se descuentan festivos: si ese día es festivo, rige el día hábil anterior.",
      },
      RoundEnd: {
        Title: "Finaliza la {round}.ª subasta (Artırma)",
        Detail: "Si entra una puja en los últimos diez minutos, la ronda se prorroga tres minutos por cada puja, hasta un máximo total de una hora. Después se publica el acta de resultados y comienzan los siete días para pagar.",
      },
      Amount: " Importe: {amount} (10 % del valor de tasación).",
      StartingBid: " Puja inicial según el İlan: {amount}.",
    },
  },

  Page: {
    Eyebrow: "Asistente de Plazos",
    Title: "Plazos",
    Lead: "Todos los plazos de los procedimientos que sigue, en una sola lista. Con recordatorio por correo y suscripción en su propio calendario.",
    Count: "{count} seguidos",
    Empty: {
      Title: "Todavía no sigue ningún procedimiento",
      Body: "Abra la ficha de un expediente y pulse en «Seguir procedimiento» dentro de «Plazos y hoja de ruta».",
      Cta: "Ir a la búsqueda",
    },
    Next: "Próximo paso",
    NothingAhead: "No quedan plazos abiertos.",
    OpenListing: "Ver ficha del expediente",
    Missing: "Ya no figura en la base de datos actual",
    Feed: {
      Title: "Suscripción de calendario",
      Body: "Añada esta dirección en Google Calendar, Outlook o Calendario de Apple como suscripción («Desde URL»). Los nuevos procedimientos y los cambios de fecha se actualizan solos, con aviso previo.",
      Create: "Generar dirección de suscripción",
      Renew: "Generar nueva dirección",
      Copy: "Copiar",
      Copied: "Copiado",
      Shown: "Visible solo ahora. No guardamos la dirección en texto plano; quien la conozca podrá ver sus plazos.",
      Hidden: "Hay una suscripción activa. ¿Perdió la dirección? Genere una nueva y la anterior dejará de funcionar.",
      Error: "No se pudo generar la dirección.",
    },
    HowItWorks: "Los recordatorios se envían por la mañana por correo y en el calendario en los días indicados junto a cada plazo. Las fechas proceden de los edictos oficiales; si el juzgado cambia algo, el plazo se actualiza en la siguiente sincronización.",
  },

  Mail: {
    Subject: "{count} plazos próximos",
    SubjectOne: "Un plazo próximo",
    Preheader: "Su Asistente de Plazos de belowmark.",
    Greeting: "Buenos días:",
    Intro: "para los procedimientos que usted sigue está próximo lo siguiente:",
    Today: "hoy",
    Tomorrow: "mañana",
    InDays: "en {days} días",
    OpenListing: "Abrir ficha del expediente",
    Manage: "Gestionar recordatorios",
    Signature: "Su equipo de belowmark",
    Footer: "Recibe este correo porque sigue un procedimiento. Puede darse de baja en «Plazos».",
    Source: "Base legal",
  },

  Ics: {
    CalendarName: "Plazos belowmark",
    Source: "Fuente",
  },
};
