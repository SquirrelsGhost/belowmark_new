import { filled, LEGAL_OPERATOR } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export const IMPRINT_SV: LegalDocument = {
  title: "Juridisk information (Impressum)",
  asOf: "Per den 31 oktober 2026",
  basis: "Uppgifter enligt § 5 i den tyska lagen om digitala tjänster (DDG) samt § 18 (2) i det tyska statsfördraget om medier (MStV).",
  sections: [
    {
      id: "anbieter",
      heading: "Tjänsteleverantör",
      paragraphs: [],
      facts: [
        { label: "Leverantör", value: LEGAL_OPERATOR.business },
        { label: "Innehavare", value: LEGAL_OPERATOR.owner },
        { label: "Adress", value: `${LEGAL_OPERATOR.street}, ${LEGAL_OPERATOR.city}, ${LEGAL_OPERATOR.country}` },
        { label: "E-post", value: LEGAL_OPERATOR.email },
        { label: "Telefon", value: LEGAL_OPERATOR.phone },
        { label: "Ansvarig för innehållet (§ 18 (2) MStV)", value: `${LEGAL_OPERATOR.owner}, adress enligt ovan` },
      ],
    },
    {
      id: "streitbeilegung",
      heading: "Tvistlösning för konsumenter",
      paragraphs: [
        "Vi är varken villiga eller skyldiga att delta i tvistlösningsförfaranden inför en konsumenttvistnämnd (§ 36 i den tyska lagen om tvistlösning i konsumentärenden, VSBG).",
      ],
    },
    {
      id: "hosting",
      heading: "Infrastruktur",
      paragraphs: [`Drift / hosting: ${filled(LEGAL_OPERATOR.hosting, "Ange hostingleverantör med adress och serverplats")}.`],
    },
    {
      id: "verweise",
      heading: "Externa länkar",
      paragraphs: [
        "Belowmark länkar till officiella domstols- och myndighetsportaler (såsom zvg-portal.de, edikte.justiz.gv.at, pvp.giustizia.it, subastas.boe.es, licitor.com, ilan.gov.tr, esatis.uyap.gov.tr) samt offentliga annonsportaler. Respektive operatör ansvarar ensam för innehållet på dessa sidor. Inga lagöverträdelser var kända vid tidpunkten för länkningen; om sådana kommer till vår kännedom tar vi skyndsamt bort länken.",
      ],
    },
  ],
};
