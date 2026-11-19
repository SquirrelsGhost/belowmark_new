import { filled, LEGAL_OPERATOR } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export const IMPRINT_PL: LegalDocument = {
  title: "Nota prawna (Impressum)",
  asOf: "Stan na 31 października 2026",
  basis: "Informacje zgodnie z § 5 niemieckiej ustawy o usługach cyfrowych (DDG) oraz § 18 ust. 2 niemieckiej umowy państwowej o mediach (MStV).",
  sections: [
    {
      id: "anbieter",
      heading: "Usługodawca",
      paragraphs: [],
      facts: [
        { label: "Usługodawca", value: LEGAL_OPERATOR.business },
        { label: "Właściciel", value: LEGAL_OPERATOR.owner },
        { label: "Adres", value: `${LEGAL_OPERATOR.street}, ${LEGAL_OPERATOR.city}, ${LEGAL_OPERATOR.country}` },
        { label: "E-mail", value: LEGAL_OPERATOR.email },
        { label: "Telefon", value: LEGAL_OPERATOR.phone },
        { label: "Odpowiedzialny za treści (§ 18 ust. 2 MStV)", value: `${LEGAL_OPERATOR.owner}, adres jak wyżej` },
      ],
    },
    {
      id: "streitbeilegung",
      heading: "Pozasądowe rozwiązywanie sporów konsumenckich",
      paragraphs: [
        "Nie jesteśmy skłonni ani zobowiązani do udziału w postępowaniach w sprawie rozstrzygania sporów przed konsumenckim organem arbitrażowym (§ 36 niemieckiej ustawy o rozstrzyganiu sporów konsumenckich, VSBG).",
      ],
    },
    {
      id: "hosting",
      heading: "Infrastruktura",
      paragraphs: [`Hosting: ${filled(LEGAL_OPERATOR.hosting, "Wstaw dostawcę hostingu z adresem i lokalizacją serwera")}.`],
    },
    {
      id: "verweise",
      heading: "Linki zewnętrzne",
      paragraphs: [
        "Belowmark odsyła do urzędowych portali sądowych i publicznych (takich jak zvg-portal.de, edikte.justiz.gv.at, pvp.giustizia.it, subastas.boe.es, licitor.com, ilan.gov.tr, esatis.uyap.gov.tr) oraz publicznych portali ogłoszeniowych. Za ich treść odpowiadają wyłącznie ich operatorzy. W chwili umieszczania linków nie były widoczne żadne naruszenia prawa; w przypadku powzięcia wiedzy o naruszeniu niezwłocznie usuniemy dany link.",
      ],
    },
  ],
};
