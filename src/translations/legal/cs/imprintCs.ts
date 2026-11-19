import { filled, LEGAL_OPERATOR } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export const IMPRINT_CS: LegalDocument = {
  title: "Povinné údaje (Impressum)",
  asOf: "Stav k 31. říjnu 2026",
  basis: "Údaje podle § 5 německého zákona o digitálních službách (DDG) a § 18 odst. 2 německé mezistátní smlouvy o médiích (MStV).",
  sections: [
    {
      id: "anbieter",
      heading: "Poskytovatel služby",
      paragraphs: [],
      facts: [
        { label: "Poskytovatel", value: LEGAL_OPERATOR.business },
        { label: "Majitel", value: LEGAL_OPERATOR.owner },
        { label: "Adresa", value: `${LEGAL_OPERATOR.street}, ${LEGAL_OPERATOR.city}, ${LEGAL_OPERATOR.country}` },
        { label: "E-mail", value: LEGAL_OPERATOR.email },
        { label: "Telefon", value: LEGAL_OPERATOR.phone },
        { label: "Odpovědná osoba za obsah (§ 18 odst. 2 MStV)", value: `${LEGAL_OPERATOR.owner}, adresa viz výše` },
      ],
    },
    {
      id: "streitbeilegung",
      heading: "Mimosoudní řešení spotřebitelských sporů",
      paragraphs: [
        "Nejsme ochotni ani povinni účastnit se řízení o řešení sporů před subjektem mimosoudního řešení spotřebitelských sporů (§ 36 německého zákona o řešení spotřebitelských sporů, VSBG).",
      ],
    },
    {
      id: "hosting",
      heading: "Infrastruktura",
      paragraphs: [`Hosting: ${filled(LEGAL_OPERATOR.hosting, "Doplnit poskytovatele hostingu s adresou a umístěním serveru")}.`],
    },
    {
      id: "verweise",
      heading: "Externí odkazy",
      paragraphs: [
        "Belowmark odkazuje na oficiální justiční a veřejné portály (například zvg-portal.de, edikte.justiz.gv.at, pvp.giustizia.it, subastas.boe.es, licitor.com, ilan.gov.tr, esatis.uyap.gov.tr, portaldrazeb.cz) a veřejné inzertní portály. Za jejich obsah nesou výhradní odpovědnost jejich příslušní provozovatelé. V době vložení odkazů nebylo zřejmé žádné porušení práva; jakmile se o jakémkoli porušení dozvíme, příslušný odkaz bezodkladně odstraníme.",
      ],
    },
  ],
};
