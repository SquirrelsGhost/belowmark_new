import { IAlertsTranslation } from "../IAlertsTranslation";

export const ALERTS_ES: IAlertsTranslation = {
  MetaTags: {
    title: "Alertas — Belowmark",
    description: "Búsquedas guardadas con notificación por correo: entérese al instante cuando aparezca un nuevo procedimiento compatible o cambie una fecha de subasta.",
    imgUrl: "https://belowmark.com/og/home.png",
    tags: ["Alertas", "Subasta judicial", "Búsqueda guardada"],
    url: "https://belowmark.com/app/alerts",
  },
  Nav: "Alertas",

  Page: {
    Eyebrow: "Búsquedas guardadas",
    Title: "Alertas",
    Lead: "Cada alerta es una búsqueda guardada. Si aparece un nuevo procedimiento compatible o el juzgado modifica una fecha, recibirá un correo con el número de expediente y el enlace a la ficha.",
    Usage: "{count} de {max} alertas",
    Empty: {
      Title: "Aún no hay alertas.",
      Body: "Configure sus filtros en los edictos — estado federado, tipo de inmueble, rango de valor, palabra clave — y guarde la búsqueda como alerta debajo del número de resultados.",
      Cta: "Ir a los edictos",
    },
    HowItWorks:
      "La comparación se realiza tras cada actualización de los datos oficiales. Solo se notifica lo que indica el propio edicto: un nuevo procedimiento, un aplazamiento o una cancelación. El periodo y el orden de la búsqueda no forman parte de la alerta: siempre mira hacia delante.",
  },

  Card: {
    Active: "Activa",
    Paused: "En pausa",
    Pause: "Pausar",
    Resume: "Reanudar",
    Delete: "Eliminar",
    OpenSearch: "Abrir búsqueda",
    Matches: "{count} resultados abiertos",
    MatchesOne: "1 resultado abierto",
    NotifyNew: "Nuevos procedimientos",
    NotifyChanges: "Cambios de fecha",
    LastSent: "Último correo: {date}",
    NeverSent: "Aún sin correos",
    LastChecked: "Comprobado: {date}",
    Error: "No ha funcionado. Por favor, inténtelo de nuevo.",
  },

  Summary: {
    AllRegions: { DE: "Todos los estados federados", TR: "Todas las provincias" },
    AllSegments: "Todos los tipos de inmueble",
    Query: "«{query}»",
    Min: "desde {value}",
    Max: "hasta {value}",
  },

  Save: {
    Toggle: "Guardar búsqueda como alerta",
    Title: "Crear alerta",
    NameLabel: "Nombre",
    NotifyNew: "Correo ante nuevos procedimientos",
    NotifyChanges: "Correo ante cambios de fecha y cancelaciones",
    Hint: "Se guardan palabra clave, región, tipo de inmueble y rango de valor. Lo que ya coincide hoy se da por conocido; se avisa a partir de ahora.",
    Submit: "Guardar alerta",
    Pending: "Guardando …",
    Saved: "Guardada. Recibirá un correo en cuanto haya novedades.",
    Manage: "Gestionar alertas",
    Errors: {
      limit: "Ya tiene 10 alertas. Elimine una antes de crear otra nueva.",
      invalid: "Por favor, asigne un nombre a la alerta y elija al menos una notificación.",
      failed: "No se pudo guardar la alerta. Por favor, inténtelo de nuevo.",
    },
  },

  Mail: {
    Subject: "{count} novedades en sus alertas",
    SubjectOne: "1 novedad en sus alertas",
    Preheader: "Nuevos procedimientos y cambios de fecha en sus búsquedas guardadas.",
    Greeting: "Buenos días,",
    Intro: "desde la última comprobación se han producido las siguientes novedades en sus búsquedas guardadas:",
    Kinds: { new: "Nuevo", cancelled: "Cancelado", reinstated: "Reprogramado", rescheduled: "Fecha modificada" },
    NextDate: "Fecha {date}",
    Moved: "antes {before}, ahora {after}",
    Value: { DE: "Valor de tasación", TR: "Muhammen bedel" },
    More: "+ {count} más",
    OpenSearch: "Abrir búsqueda",
    LockedValues: "Los números de expediente completos, direcciones exactas y edictos PDF están disponibles con acceso completo (o con su 1 Expediente Gratis).",
    TrialTitle: "Desbloquee todos los expedientes BOE, direcciones y edictos PDF",
    TrialBody: "Pruebe el acceso completo Investor durante 7 días por 0,00 € hoy (cancelación en 1 clic en cualquier momento) — o abra 1 expediente completo gratis.",
    TrialCta: "Probar 7 días gratis (0,00 €)",
    Manage: "Gestionar o pausar alertas",
    Source: { DE: "Fuente de todos los datos: zvg-portal.de", TR: "Fuente de todos los datos: ilan.gov.tr" },
    Signature: "El equipo de Belowmark",
    Footer: "Belowmark · Subastas judiciales con fuente oficial · belowmark.com",
  },
};
