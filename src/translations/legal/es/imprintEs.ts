import { filled, LEGAL_OPERATOR } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export const IMPRINT_ES: LegalDocument = {
  title: "Aviso legal (Impressum)",
  asOf: "Actualizado el 31 de octubre de 2026",
  basis: "Información conforme al § 5 de la Ley alemana de Servicios Digitales (DDG) y al § 18 apdo. 2 del Tratado Estatal de Medios (MStV).",
  sections: [
    {
      id: "anbieter",
      heading: "Prestador del servicio",
      paragraphs: [],
      facts: [
        { label: "Proveedor", value: LEGAL_OPERATOR.business },
        { label: "Titular", value: LEGAL_OPERATOR.owner },
        { label: "Dirección", value: `${LEGAL_OPERATOR.street}, ${LEGAL_OPERATOR.city}, ${LEGAL_OPERATOR.country}` },
        { label: "Correo electrónico", value: LEGAL_OPERATOR.email },
        { label: "Teléfono", value: LEGAL_OPERATOR.phone },
        { label: "Responsable del contenido (§ 18 apdo. 2 MStV)", value: `${LEGAL_OPERATOR.owner}, dirección arriba indicada` },
      ],
    },
    {
      id: "streitbeilegung",
      heading: "Resolución de litigios en materia de consumo",
      paragraphs: [
        "No estamos dispuestos ni obligados a participar en procedimientos de resolución de litigios ante una junta arbitral de consumo (§ 36 VSBG).",
      ],
    },
    {
      id: "hosting",
      heading: "Infraestructura técnica",
      paragraphs: [`Alojamiento (Hosting): ${filled(LEGAL_OPERATOR.hosting, "Indicar proveedor de alojamiento con dirección y ubicación del servidor")}.`],
    },
    {
      id: "verweise",
      heading: "Enlaces a páginas externas",
      paragraphs: [
        "Belowmark enlaza con portales oficiales (por ejemplo, subastas.boe.es, zvg-portal.de, edikte.justiz.gv.at, pvp.giustizia.it, licitor.com, ilan.gov.tr, esatis.uyap.gov.tr) y portales públicos de anuncios. Sus respectivos operadores son los únicos responsables de sus contenidos.",
      ],
    },
  ],
};
