import { filled, LEGAL_OPERATOR } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export const IMPRINT_NL: LegalDocument = {
  title: "Colofon (Impressum)",
  asOf: "Stand 31 oktober 2026",
  basis: "Gegevens overeenkomstig § 5 van de Duitse Digital Services Act (DDG) en § 18 lid 2 van het Duitse staatsverdrag inzake media (MStV).",
  sections: [
    {
      id: "anbieter",
      heading: "Dienstverlener",
      paragraphs: [],
      facts: [
        { label: "Aanbieder", value: LEGAL_OPERATOR.business },
        { label: "Eigenaar", value: LEGAL_OPERATOR.owner },
        { label: "Adres", value: `${LEGAL_OPERATOR.street}, ${LEGAL_OPERATOR.city}, ${LEGAL_OPERATOR.country}` },
        { label: "E-mail", value: LEGAL_OPERATOR.email },
        { label: "Telefoon", value: LEGAL_OPERATOR.phone },
        { label: "Verantwoordelijk voor de inhoud (§ 18 lid 2 MStV)", value: `${LEGAL_OPERATOR.owner}, adres als hierboven` },
      ],
    },
    {
      id: "streitbeilegung",
      heading: "Geschillenbeslechting voor consumenten",
      paragraphs: [
        "Wij zijn noch bereid noch verplicht om deel te nemen aan geschillenbeslechtingsprocedures bij een geschillencommissie voor consumenten (§ 36 van de Duitse Verbraucherstreitbeilegungsgesetz, VSBG).",
      ],
    },
    {
      id: "hosting",
      heading: "Infrastructuur",
      paragraphs: [`Hosting: ${filled(LEGAL_OPERATOR.hosting, "Hostingprovider met adres en serverlocatie invullen")}.`],
    },
    {
      id: "verweise",
      heading: "Externe links",
      paragraphs: [
        "Belowmark linkt naar officiële gerechtelijke en overheidsportalen (zoals zvg-portal.de, edikte.justiz.gv.at, pvp.giustizia.it, subastas.boe.es, licitor.com, ilan.gov.tr, esatis.uyap.gov.tr) en openbare advertentieportalen. De respectieve beheerders zijn als enige verantwoordelijk voor de inhoud daarvan. Op het moment van plaatsen van de links waren geen rechtsschendingen kenbaar; zodra deze ons bekend worden, verwijderen wij de betreffende link onverwijld.",
      ],
    },
  ],
};
