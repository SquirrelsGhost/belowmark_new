import { operatorAddress, LEGAL_OPERATOR } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

const contact = `${operatorAddress()}, e-mail ${LEGAL_OPERATOR.email}, telefon ${LEGAL_OPERATOR.phone}`;

export const WITHDRAWAL_CS: LegalDocument = {
  title: "Poučení o odstoupení od smlouvy a jeho zániku u digitálního obsahu",
  asOf: "Stav k 31. říjnu 2026",
  basis: "Pro spotřebitele u smluv o dodání digitálního obsahu nedodávaného na hmotném nosiči (§§ 312g, 355, 356 odst. 5 německého občanského zákoníku, BGB).",
  sections: [
    {
      id: "erloeschen",
      heading: "1. Předčasný zánik práva na odstoupení od smlouvy (§ 356 odst. 5 BGB)",
      paragraphs: [
        "U smlouvy o dodání digitálního obsahu nedodávaného na hmotném nosiči (aktivace plného digitálního přístupu k odhadním cenám, analýzám znaleckých posudků, zákonným limitům příhozu, kalkulačkám lhůt a dokumentům na Belowmark) právo na odstoupení okamžitě zaniká zahájením plnění smlouvy, pokud:",
        "1. jste výslovně souhlasili s tím, abychom zahájili plnění smlouvy před uplynutím lhůty pro odstoupení,",
        "2. jste potvrdili, že berete na vědomí, že udělením souhlasu ztrácíte zahájením plnění smlouvy své právo na odstoupení, a",
        "3. jsme vám poskytli potvrzení podle § 312f odst. 2 BGB na trvalém nosiči dat (e-mailem).",
        "Protože tento souhlas a potvrzení udělujete během objednávky přijetím obchodních podmínek před kliknutím na „Objednat s povinností platby“ a váš plný digitální přístup se aktivuje ihned po potvrzení platby, je odstoupení po aktivaci digitálního přístupu vyloučeno podle § 356 odst. 5 BGB.",
      ],
    },
    {
      id: "recht",
      heading: "2. Zákonné právo na odstoupení (před zahájením plnění)",
      paragraphs: [
        "Pokud výjimečně plnění smlouvy (aktivace digitálního přístupu) ještě nezačalo, platí následující zákonné právo na odstoupení:",
        "Máte právo odstoupit od této smlouvy do čtrnácti dnů bez udání důvodu. Lhůta pro odstoupení činí čtrnáct dnů ode dne uzavření smlouvy.",
        `Pro uplatnění práva na odstoupení nás musíte (${contact}) informovat o svém rozhodnutí odstoupit od této smlouvy jednoznačným prohlášením (např. dopisem zaslaným poštou nebo e-mailem). K tomu můžete použít přiložený vzorový formulář pro odstoupení, není to však povinné.`,
        "Pro dodržení lhůty pro odstoupení postačí, odešlete-li sdělení o uplatnění práva na odstoupení před uplynutím lhůty pro odstoupení a před aktivací digitálního přístupu.",
      ],
    },
    {
      id: "folgen",
      heading: "3. Důsledky platného odstoupení (před aktivací)",
      paragraphs: [
        "Pokud od této smlouvy platně odstoupíte dříve, než právo na odstoupení zanikne aktivací digitálního přístupu podle § 356 odst. 5 BGB, vrátíme vám všechny platby, které jsme od vás obdrželi, bez zbytečného odkladu a nejpozději do čtrnácti dnů ode dne, kdy jsme byli informováni o vašem rozhodnutí odstoupit od této smlouvy. Pro vrácení použijeme stejný platební prostředek, jaký jste použili při původní transakci.",
      ],
    },
    {
      id: "praxis",
      heading: "4. Výpověď aktivních předplatných",
      paragraphs: [
        "Nezávisle na zániku práva na odstoupení při okamžité aktivaci (§ 356 odst. 5 BGB) můžete aktivní měsíční předplatné (Investor Měsíční nebo Pro Měsíční) kdykoli vypovědět ke konci již zaplaceného zúčtovacího měsíce — jedním kliknutím ve svém účtu nebo přes odkaz „Zrušit smlouvy zde“ v patičce každé stránky.",
      ],
    },
    {
      id: "formular",
      heading: "5. Vzorový formulář pro odstoupení od smlouvy",
      paragraphs: [
        "(Použitelné pouze tehdy, pokud právo na odstoupení dosud nezaniklo podle § 356 odst. 5 BGB aktivací digitálního přístupu.)",
        `Adresát: ${operatorAddress()}, e-mail ${LEGAL_OPERATOR.email}:`,
        "Oznamuji / Oznamujeme (*), že tímto odstupuji / odstupujeme (*) od smlouvy o dodání následujícího digitálního obsahu (*):",
        "Objednáno dne (*):",
        "Jméno a příjmení spotřebitele (spotřebitelů):",
        "Adresa spotřebitele (spotřebitelů):",
        "Podpis spotřebitele (spotřebitelů) (pouze je-li tento formulář zasílán v listinné podobě):",
        "Datum:",
        "(*) Nehodící se škrtněte.",
      ],
    },
  ],
};
