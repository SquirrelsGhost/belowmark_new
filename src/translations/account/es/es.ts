import { IAccountTranslation } from "../IAccountTranslation";

export const ACCOUNT_ES: IAccountTranslation = {
  Nav: {
    Label: "Secciones de su cuenta",
    Sections: {
      uebersicht: { Title: "Resumen", Hint: "Datos y estado" },
      tarif: { Title: "Plan y facturas", Hint: "Vigencia, PDF, dirección" },
      sicherheit: { Title: "Seguridad", Hint: "Contraseña, dispositivos" },
      daten: { Title: "Sus datos", Hint: "Exportar, eliminar" },
    },
  },

  Overview: {
    Title: "De un vistazo",
    Description: "El estado de su cuenta. Encontrará los detalles en las secciones de la izquierda.",
    Plan: "Plan",
    PlanCta: "Plan y facturas",
    LatestInvoice: "Última factura",
    NoInvoice: "Aún no hay facturas.",
    AllInvoices: "Todas las facturas",
    Research: "Investigación",
    ResearchBody: "Edictos, mapa, lista de seguimiento y calculadora de puja.",
    ResearchCta: "Ir a la investigación",
  },

  Portal: {
    Label: "Métodos de pago en Stripe",
    Hint: "Abre el portal de clientes de Stripe para cambiar su tarjeta o gestionar la suscripción. Sus facturas se encuentran justo debajo.",
    Unavailable: "Podrá gestionar sus métodos de pago en Stripe en cuanto haya realizado su primer pago a través de Stripe.",
  },

  Invoices: {
    Title: "Facturas",
    Description: "Cada pago recibe su propia factura con numeración correlativa. En PDF, en cualquier momento y tantas veces como necesite.",
    Empty: "Aún no hay facturas. Aparecerán aquí en cuanto se confirme un pago.",
    Count: "{count} facturas",
    CountOne: "1 factura",
    Columns: { Number: "Número · Fecha", Service: "Servicio", Amount: "Importe", Document: "Documento" },
    Paid: "Pagada",
    Test: "Prueba",
    Upgrade: "Mejora",
    Renewal: "Renovación",
    Download: "PDF",
    View: "Ver",
    DownloadLabel: "Descargar factura {number} como PDF",
    Note: "Conserve las facturas para su archivo. Tras eliminar una cuenta, solo las conservamos a efectos fiscales y contables.",
  },

  Address: {
    Title: "Dirección de facturación",
    Description: "Aparece en sus facturas. Para importes de hasta 250 € basta con el correo electrónico; a partir de esa cifra y para su contabilidad necesita nombre y dirección.",
    Missing: "Aún no se ha guardado ninguna dirección de facturación. Las facturas anteriores sin dirección la incorporarán por única vez en cuanto la guarde.",
    Empty: "Aún no se ha guardado ninguna dirección de facturación.",
    Add: "Añadir dirección",
    Name: "Nombre o empresa",
    NameHint: "Tal y como debe figurar en la factura.",
    Address: "Dirección postal",
    AddressHint: "Calle y número, código postal y localidad, país — un dato por línea.",
    VatId: "NIF-IVA",
    VatIdHint: "Solo para empresas, p. ej. DE123456789.",
    Optional: "opcional",
    Edit: "Editar",
    Cancel: "Cancelar",
    Submit: "Guardar dirección",
    Pending: "Guardando …",
    Saved: "Guardado. Las nuevas facturas llevarán esta dirección.",
    ErrorTitle: "Por favor, revise sus datos",
    Errors: {
      name_required: "Por favor, indique un nombre.",
      address_required: "Por favor, indique una dirección.",
      too_long: "Uno de los datos es demasiado largo.",
      rate_limited: "Demasiados intentos. Por favor, espere un momento.",
      unknown: "No ha funcionado. Por favor, inténtelo de nuevo.",
    },
  },
};
