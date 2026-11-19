import { operatorAddress, LEGAL_OPERATOR } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

const contact = `${operatorAddress()}, e-mail ${LEGAL_OPERATOR.email}, telefoon ${LEGAL_OPERATOR.phone}`;

export const WITHDRAWAL_NL: LegalDocument = {
  title: "Herroepingsbeleid & verval bij digitale inhoud",
  asOf: "Stand 31 oktober 2026",
  basis: "Voor consumenten bij overeenkomsten voor de levering van digitale inhoud die niet op een materiële drager wordt geleverd (§§ 312g, 355, 356 lid 5 Duits Burgerlijk Wetboek, BGB).",
  sections: [
    {
      id: "erloeschen",
      heading: "1. Voortijdig verval van het herroepingsrecht (§ 356 lid 5 BGB)",
      paragraphs: [
        "Bij een overeenkomst voor de levering van digitale inhoud die niet op een materiële drager wordt geleverd (activering van volledige digitale toegang tot taxatiewaarden, taxatieanalyses, wettelijke biedlimieten, termijncalculators en documenten op Belowmark) vervalt het herroepingsrecht onmiddellijk bij aanvang van de uitvoering van de overeenkomst indien:",
        "1. u er uitdrukkelijk mee heeft ingestemd dat wij vóór het verstrijken van de herroepingstermijn beginnen met de uitvoering van de overeenkomst,",
        "2. u heeft bevestigd ervan op de hoogte te zijn dat u door uw instemming bij aanvang van de uitvoering van de overeenkomst uw herroepingsrecht verliest, en",
        "3. wij u een bevestiging overeenkomstig § 312f lid 2 BGB op een duurzame gegevensdrager (per e-mail) hebben verstrekt.",
        "Omdat u deze instemming en bevestiging tijdens het bestelproces geeft door de Algemene Voorwaarden te accepteren voordat u op \"Bestellen met betalingsverplichting\" klikt, en uw volledige digitale toegang direct na betalingsbevestiging wordt geactiveerd, is herroeping op grond van § 356 lid 5 BGB uitgesloten zodra de digitale toegang is geactiveerd.",
      ],
    },
    {
      id: "recht",
      heading: "2. Wettelijk herroepingsrecht (vóór aanvang van de uitvoering)",
      paragraphs: [
        "Indien bij wijze van uitzondering nog niet is begonnen met de uitvoering van de overeenkomst (activering van de digitale toegang), geldt het volgende wettelijke herroepingsrecht:",
        "U heeft het recht om binnen veertien dagen zonder opgave van redenen deze overeenkomst te herroepen. De herroepingstermijn bedraagt veertien dagen vanaf de dag van het sluiten van de overeenkomst.",
        `Om uw herroepingsrecht uit te oefenen, moet u ons (${contact}) via een ondubbelzinnige verklaring (bijv. een per post verzonden brief of een e-mail) op de hoogte stellen van uw beslissing om deze overeenkomst te herroepen. U kunt hiervoor gebruikmaken van het bijgevoegde modelformulier voor herroeping, maar bent hiertoe niet verplicht.`,
        "Om de herroepingstermijn na te leven, volstaat het om uw mededeling betreffende uw uitoefening van het herroepingsrecht te verzenden voordat de herroepingstermijn is verstreken en voordat de digitale toegang is geactiveerd.",
      ],
    },
    {
      id: "folgen",
      heading: "3. Gevolgen van een geldige herroeping (vóór activering)",
      paragraphs: [
        "Als u deze overeenkomst geldig herroept voordat het herroepingsrecht door activering van de digitale toegang krachtens § 356 lid 5 BGB is vervallen, betalen wij alle van u ontvangen betalingen onverwijld en in ieder geval niet later dan veertien dagen nadat wij op de hoogte zijn gesteld van uw beslissing om deze overeenkomst te herroepen aan u terug. Wij betalen u terug met hetzelfde betaalmiddel als waarmee u de oorspronkelijke transactie heeft verricht.",
      ],
    },
    {
      id: "praxis",
      heading: "4. Opzegging van lopende abonnementen",
      paragraphs: [
        "Los van het verval van het herroepingsrecht bij onmiddellijke activering (§ 356 lid 5 BGB) kunt u een actief maandabonnement (Investor Maandelijks of Pro Maandelijks) op elk moment opzeggen tegen het einde van de reeds betaalde facturatiemaand — met één klik in uw account of via \"Overeenkomsten hier opzeggen\" in de voettekst van elke pagina.",
      ],
    },
    {
      id: "formular",
      heading: "5. Modelformulier voor herroeping",
      paragraphs: [
        "(Alleen van toepassing indien het herroepingsrecht niet reeds op grond van § 356 lid 5 BGB bij activering van de digitale toegang is vervallen.)",
        `Aan ${operatorAddress()}, e-mail ${LEGAL_OPERATOR.email}:`,
        "Ik/Wij (*) deel/delen (*) u hierbij mede dat ik/wij (*) onze overeenkomst betreffende de levering van de volgende digitale inhoud (*) herroep/herroepen (*):",
        "Besteld op (*):",
        "Naam/Namen consument(en):",
        "Adres consument(en):",
        "Handtekening van consument(en) (alleen wanneer dit formulier op papier wordt ingediend):",
        "Datum:",
        "(*) Doorhalen wat niet van toepassing is.",
      ],
    },
  ],
};
