import { operatorAddress, LEGAL_OPERATOR } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

const contact = `${operatorAddress()}, e-post ${LEGAL_OPERATOR.email}, telefon ${LEGAL_OPERATOR.phone}`;

export const WITHDRAWAL_SV: LegalDocument = {
  title: "Ångerrätt & upphörande för digitalt innehåll",
  asOf: "Per den 31 oktober 2026",
  basis: "För konsumenter vid avtal om digitalt innehåll som inte levereras på ett fysiskt medium (§§ 312g, 355, 356 (5) i den tyska civillagen, BGB).",
  sections: [
    {
      id: "erloeschen",
      heading: "1. Ångerrättens förtida upphörande (§ 356 (5) BGB)",
      paragraphs: [
        "Vid ett avtal om tillhandahållande av digitalt innehåll som inte levereras på ett fysiskt medium (aktivering av full digital åtkomst till marknadsvärden, analyser av värderingsutlåtanden, lagstadgade budgränser, fristkalkylatorer och dokument på Belowmark) upphör ångerrätten omedelbart när fullgörandet av avtalet påbörjas om:",
        "1. du uttryckligen har samtyckt till att vi påbörjar fullgörandet av avtalet före ångerfristens utgång,",
        "2. du har bekräftat din kännedom om att du genom ditt samtycke förlorar din ångerrätt när fullgörandet av avtalet påbörjas, och",
        "3. vi har tillhandahållit dig en bekräftelse enligt § 312f (2) BGB på ett varaktigt medium (via e-post).",
        "Eftersom du lämnar detta samtycke och denna bekräftelse i kassan genom att acceptera de allmänna villkoren innan du klickar på ”Beställ med betalningsskyldighet”, och din fulla digitala åtkomst aktiveras omedelbart vid betalningsbekräftelse, är ångerrätten utesluten enligt § 356 (5) BGB så snart den digitala åtkomsten har aktiverats.",
      ],
    },
    {
      id: "recht",
      heading: "2. Lagstadgad ångerrätt (före påbörjat fullgörande)",
      paragraphs: [
        "Om fullgörandet av avtalet (aktivering av digital åtkomst) i undantagsfall ännu inte har påbörjats gäller följande lagstadgade ångerrätt:",
        "Du har rätt att frånträda detta avtal inom fjorton dagar utan att ange något skäl. Ångerfristen är fjorton dagar från den dag då avtalet ingicks.",
        `För att utöva din ångerrätt måste du underrätta oss (${contact}) om ditt beslut att frånträda avtalet genom ett klart och tydligt meddelande (t.ex. ett brev skickat per post eller ett e-postmeddelande). Du kan använda bifogad standardblankett för ångerrätt, men det är inte obligatoriskt.`,
        "För att hålla ångerfristen räcker det att du skickar ditt meddelande om att du utövar ångerrätten innan ångerfristen har löpt ut och innan den digitala åtkomsten har aktiverats.",
      ],
    },
    {
      id: "folgen",
      heading: "3. Verkningar av giltigt frånträde (före aktivering)",
      paragraphs: [
        "Om du giltigt frånträder detta avtal innan ångerrätten har upphört genom aktivering av digital åtkomst enligt § 356 (5) BGB, ska vi utan onödigt dröjsmål och senast inom fjorton dagar från den dag då vi underrättades om ditt beslut betala tillbaka alla betalningar vi har fått från dig. Återbetalningen sker med samma betalningsmedel som du använde vid den ursprungliga transaktionen.",
      ],
    },
    {
      id: "praxis",
      heading: "4. Uppsägning av aktiva abonnemang",
      paragraphs: [
        "Oberoende av att ångerrätten upphör vid omedelbar aktivering (§ 356 (5) BGB) kan du när som helst säga upp ett aktivt månadsabonnemang (Investor Månadsvis eller Pro Månadsvis) med verkan från slutet av den redan betalda betalningsmånaden — med ett klick i ditt konto eller via ”Säg upp avtal här” i sidfoten på varje sida.",
      ],
    },
    {
      id: "formular",
      heading: "5. Standardblankett för ångerrätt",
      paragraphs: [
        "(Gäller endast om ångerrätten inte redan har upphört enligt § 356 (5) BGB genom aktivering av digital åtkomst.)",
        `Till ${operatorAddress()}, e-post ${LEGAL_OPERATOR.email}:`,
        "Härmed meddelar jag/vi (*) att jag/vi (*) frånträder mitt/vårt (*) avtal om tillhandahållande av följande digitala innehåll (*):",
        "Beställt den (*):",
        "Konsumentens/konsumenternas namn:",
        "Konsumentens/konsumenternas adress:",
        "Konsumentens/konsumenternas underskrift (endast vid meddelande på papper):",
        "Datum:",
        "(*) Stryk det som inte är tillämpligt.",
      ],
    },
  ],
};
