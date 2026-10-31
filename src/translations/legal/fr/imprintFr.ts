import { filled, LEGAL_OPERATOR } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export const IMPRINT_FR: LegalDocument = {
  title: "Mentions légales (Impressum)",
  asOf: "Mise à jour : 31 octobre 2026",
  basis: "Informations conformément au § 5 de la loi allemande sur les services numériques (DDG) et au § 18 al. 2 du traité inter-États sur les médias (MStV).",
  sections: [
    {
      id: "anbieter",
      heading: "Éditeur du service",
      paragraphs: [],
      facts: [
        { label: "Prestataire", value: LEGAL_OPERATOR.business },
        { label: "Dirigeant", value: LEGAL_OPERATOR.owner },
        { label: "Adresse", value: `${LEGAL_OPERATOR.street}, ${LEGAL_OPERATOR.city}, ${LEGAL_OPERATOR.country}` },
        { label: "E-Mail", value: LEGAL_OPERATOR.email },
        { label: "Téléphone", value: LEGAL_OPERATOR.phone },
        { label: "Responsable de la publication (§ 18 al. 2 MStV)", value: `${LEGAL_OPERATOR.owner}, adresse ci-dessus` },
      ],
    },
    {
      id: "streitbeilegung",
      heading: "Règlement des litiges de consommation",
      paragraphs: [
        "Nous ne sommes ni disposés ni tenus de participer à des procédures de règlement des litiges devant un organisme de médiation de la consommation (§ 36 VSBG).",
      ],
    },
    {
      id: "hosting",
      heading: "Hébergement",
      paragraphs: [`Hébergement : ${filled(LEGAL_OPERATOR.hosting, "Indiquer l'hébergeur avec adresse et localisation du serveur")}.`],
    },
    {
      id: "verweise",
      heading: "Liens vers des sites tiers",
      paragraphs: [
        "Belowmark renvoie vers des portails officiels (par exemple licitor.com, zvg-portal.de, edikte.justiz.gv.at, pvp.giustizia.it, subastas.boe.es, ilan.gov.tr, esatis.uyap.gov.tr) et des portails d'annonces publiques. Leurs exploitants respectifs sont seuls responsables de leur contenu.",
      ],
    },
  ],
};
