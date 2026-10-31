import { ITrMarketTranslation } from "../ITrMarketTranslation";

export const TR_MARKET_ES: ITrMarketTranslation = {
  Age: {
    Title: "Antigüedad del valor de tasación",
    Lead: "El Muhammen bedel es un importe nominal del año en que se inició el procedimiento. Con la inflación turca, en los expedientes antiguos esto no es un detalle menor.",
    FileYear: "Año del expediente",
    Basis: "Fijación del valor a más tardar en diciembre de {year}: la fecha más tardía posible, por lo que en caso de duda resulta la cifra más prudente.",
    Factor: "Precios de consumo desde entonces",
    Lost: "Pérdida de poder adquisitivo del importe nominal",
    Today: "Valor de tasación en liras de {month}",
    TodayNote: "Solo se ha actualizado el poder adquisitivo: no es una nueva tasación ni un precio de mercado.",
    Young: "Expediente de {year}: la tasación es reciente; un ajuste por inflación no aporta nada aquí.",
    NoYear: "El número de expediente no indica ningún año. Sin año no es posible contextualizar el valor.",
    Unavailable: "La serie oficial de precios no está suficientemente actualizada. Mejor ninguna cifra que un dato congelado.",
    Source: "{label}, {source} · estado a {month}",
  },

  Euro: {
    Title: "Contravalor en euros",
    Value: "Valor de tasación",
    StartingBid: "Puja inicial",
    AllIn: "Puja inicial incl. gastos accesorios",
    Rate: "1 € = {rate} · tipo de compra de divisas del TCMB del {date}",
    Note: "Convertido al tipo de cambio diario del Banco Central, no al tipo del día de pago. El pago se realiza en liras turcas.",
    Unavailable: "No hay ningún tipo de cambio actual del Banco Central disponible{last}. Los valores en euros aparecerán en cuanto se cargue el tipo del día; no calculamos con un cambio antiguo.",
    LastRate: " (último cambio del {date})",
  },

  CheckKit: {
    Title: "Kit de consulta para e-Satış",
    Lead: "Las fotos, la tasación y las condiciones de subasta están en e-Satış, accesibles solo iniciando sesión con e-Devlet. Un enlace no traslada los parámetros de búsqueda: copie estos datos y péguelos allí.",
    Copy: "Copiar kit de consulta",
    Copied: "Copiado",
    Open: "Abrir e-Satış",
    NotStated: "no indicado",
  },

  Converter: {
    Title: "Conversor de divisas ₺ ↔ €",
    Subtitle: "Al tipo diario del TCMB",
    Lira: "Importe en liras",
    Euro: "Importe en euros",
    Unavailable: "No hay ningún tipo de cambio actual del Banco Central disponible{last}. El conversor aparecerá en cuanto se cargue el tipo del día.",
  },
};
