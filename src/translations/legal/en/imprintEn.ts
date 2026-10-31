import { filled, LEGAL_OPERATOR } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export const IMPRINT_EN: LegalDocument = {
  title: "Legal Notice (Impressum)",
  asOf: "As of October 31, 2026",
  basis: "Information pursuant to Section 5 of the German Digital Services Act (DDG) and Section 18 (2) of the Interstate Media Treaty (MStV).",
  sections: [
    {
      id: "anbieter",
      heading: "Service Provider",
      paragraphs: [],
      facts: [
        { label: "Provider", value: LEGAL_OPERATOR.business },
        { label: "Owner", value: LEGAL_OPERATOR.owner },
        { label: "Address", value: `${LEGAL_OPERATOR.street}, ${LEGAL_OPERATOR.city}, ${LEGAL_OPERATOR.country}` },
        { label: "E-Mail", value: LEGAL_OPERATOR.email },
        { label: "Phone", value: LEGAL_OPERATOR.phone },
        { label: "Responsible for content (Section 18 (2) MStV)", value: `${LEGAL_OPERATOR.owner}, address as above` },
      ],
    },
    {
      id: "streitbeilegung",
      heading: "Consumer Dispute Resolution",
      paragraphs: [
        "We are neither willing nor obliged to participate in dispute resolution proceedings before a consumer arbitration board (Section 36 of the German Consumer Dispute Resolution Act, VSBG).",
      ],
    },
    {
      id: "hosting",
      heading: "Infrastructure",
      paragraphs: [`Hosting: ${filled(LEGAL_OPERATOR.hosting, "Insert hosting provider with address and server location")}.`],
    },
    {
      id: "verweise",
      heading: "External Links",
      paragraphs: [
        "Belowmark links to official judicial and public portals (such as zvg-portal.de, edikte.justiz.gv.at, pvp.giustizia.it, subastas.boe.es, licitor.com, ilan.gov.tr, esatis.uyap.gov.tr) and public listing portals. Their respective operators are solely responsible for their content. No legal violations were apparent at the time of linking; should any become known to us, we will remove the link promptly.",
      ],
    },
  ],
};
