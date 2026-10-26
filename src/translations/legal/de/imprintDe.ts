import { filled, LEGAL_OPERATOR } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export const IMPRINT_DE: LegalDocument = {
  title: "Impressum",
  asOf: "Stand 26. Oktober 2026",
  basis: "Angaben nach § 5 Digitale-Dienste-Gesetz (DDG) und § 18 Abs. 2 Medienstaatsvertrag (MStV).",
  sections: [
    {
      id: "anbieter",
      heading: "Anbieter",
      paragraphs: [],
      facts: [
        { label: "Anbieter", value: LEGAL_OPERATOR.business },
        { label: "Inhaber", value: LEGAL_OPERATOR.owner },
        { label: "Anschrift", value: `${LEGAL_OPERATOR.street}, ${LEGAL_OPERATOR.city}, ${LEGAL_OPERATOR.country}` },
        { label: "E-Mail", value: LEGAL_OPERATOR.email },
        { label: "Telefon", value: LEGAL_OPERATOR.phone },
        ...(LEGAL_OPERATOR.vatId ? [{ label: "USt-IdNr. (§ 27a UStG)", value: LEGAL_OPERATOR.vatId }] : []),
        { label: "Inhaltlich verantwortlich (§ 18 Abs. 2 MStV)", value: `${LEGAL_OPERATOR.owner}, Anschrift wie oben` },
      ],
    },
    {
      id: "streitbeilegung",
      heading: "Verbraucherstreitbeilegung",
      paragraphs: [
        "Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 Verbraucherstreitbeilegungsgesetz).",
      ],
    },
    {
      id: "hosting",
      heading: "Betrieb",
      paragraphs: [`Hosting: ${filled(LEGAL_OPERATOR.hosting, "Hosting-Anbieter mit Anschrift und Serverstandort eintragen")}.`],
    },
    {
      id: "verweise",
      heading: "Verweise auf fremde Seiten",
      paragraphs: [
        "Belowmark verweist auf amtliche Portale (zum Beispiel zvg-portal.de, ilan.gov.tr, esatis.uyap.gov.tr) und auf öffentliche Inseratsportale. Für deren Inhalte sind ausschließlich die jeweiligen Betreiber verantwortlich. Rechtsverstöße waren zum Zeitpunkt der Verlinkung nicht erkennbar; werden uns solche bekannt, entfernen wir den Verweis.",
      ],
    },
  ],
};
