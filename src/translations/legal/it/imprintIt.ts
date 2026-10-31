import { filled, LEGAL_OPERATOR } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export const IMPRINT_IT: LegalDocument = {
  title: "Note legali (Impressum)",
  asOf: "Aggiornato al 31 ottobre 2026",
  basis: "Informazioni ai sensi del § 5 della legge tedesca sui servizi digitali (DDG) e del § 18 comma 2 del trattato statale sui media (MStV).",
  sections: [
    {
      id: "anbieter",
      heading: "Fornitore del servizio",
      paragraphs: [],
      facts: [
        { label: "Fornitore", value: LEGAL_OPERATOR.business },
        { label: "Titolare", value: LEGAL_OPERATOR.owner },
        { label: "Indirizzo", value: `${LEGAL_OPERATOR.street}, ${LEGAL_OPERATOR.city}, ${LEGAL_OPERATOR.country}` },
        { label: "E-Mail", value: LEGAL_OPERATOR.email },
        { label: "Telefono", value: LEGAL_OPERATOR.phone },
        { label: "Responsabile dei contenuti (§ 18 comma 2 MStV)", value: `${LEGAL_OPERATOR.owner}, indirizzo come sopra` },
      ],
    },
    {
      id: "streitbeilegung",
      heading: "Risoluzione delle controversie dei consumatori",
      paragraphs: [
        "Non siamo disposti né obbligati a partecipare a procedure di risoluzione delle controversie dinanzi a un organismo di conciliazione dei consumatori (§ 36 VSBG).",
      ],
    },
    {
      id: "hosting",
      heading: "Infrastruttura tecnica",
      paragraphs: [`Hosting: ${filled(LEGAL_OPERATOR.hosting, "Inserire fornitore di hosting con indirizzo e sede del server")}.`],
    },
    {
      id: "verweise",
      heading: "Riferimenti a siti esterni",
      paragraphs: [
        "Belowmark rimanda a portali ufficiali (ad esempio pvp.giustizia.it, zvg-portal.de, edikte.justiz.gv.at, subastas.boe.es, licitor.com, ilan.gov.tr, esatis.uyap.gov.tr) e a portali di annunci pubblici. Dei relativi contenuti sono responsabili esclusivamente i rispettivi gestori.",
      ],
    },
  ],
};
