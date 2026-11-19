import { LEGAL_OPERATOR, operatorAddress } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export function vatSentenceSv(vatMode: "inclusive" | "kleinunternehmer" | null): string {
  if (vatMode === "kleinunternehmer") {
    return "Alla priser är slutpriser. Enligt § 19 i den tyska mervärdesskattelagen (UStG) debiteras ingen mervärdesskatt.";
  }
  return "Alla priser är slutpriser inklusive tillämplig lagstadgad mervärdesskatt (moms).";
}

export function termsSv(vatMode: "inclusive" | "kleinunternehmer" | null): LegalDocument {
  return {
    title: "Allmänna villkor (AGB)",
    asOf: "Per den 31 oktober 2026",
    basis: "Gäller för användningen av plattformen Belowmark (belowmark.com).",
    sections: [
      {
        id: "geltung",
        heading: "1. Tillämpningsområde och avtalsparter",
        paragraphs: [
          `Dessa allmänna villkor gäller för alla avtal om användning av onlinetjänsten Belowmark som ingås mellan ${operatorAddress()} (nedan kallad ”Leverantören”) och kunden.`,
          "Med konsument avses varje fysisk person som ingår en rättshandling för ändamål som huvudsakligen faller utanför dennes näringsverksamhet eller självständiga yrkesverksamhet (§ 13 i den tyska civillagen, BGB). Avvikande villkor från kunden gäller endast om Leverantören uttryckligen godkänner dem.",
        ],
      },
      {
        id: "leistung",
        heading: "2. Tjänstens innehåll",
        paragraphs: [
          "Belowmark sammanställer offentligt kungjord information om exekutiva och offentliga fastighetsauktioner i Europa (Tyskland, Österrike, Schweiz, Italien, Spanien, Frankrike, Storbritannien) och Turkiet, strukturerar den och beräknar nyckeltal (såsom lagstadgade budgränser, handpenning/säkerhet och förvärvskostnader). Under avtalstiden får kunden personlig åtkomst till webbapplikationen för den marknad som valts vid registreringen.",
          "Belowmark är ett verktyg för research och beslutsunderlag. Tjänsten utgör inte juridisk, skatterättslig, fastighetsmäklar- eller investeringsrådgivning och innehåller ingen rekommendation om att lägga ett visst bud. Varje uppgift måste kontrolleras mot domstolens eller auktionsmyndighetens officiella originalhandlingar innan ett ekonomiskt beslut fattas.",
          "Uppgifterna kommer från tredjepartskällor (domstols- och myndighetsportaler, officiella kungörelser och annonsportaler). Leverantören lämnar ingen garanti för uppgifternas riktighet, fullständighet eller aktualitet; listningar kan vara ofullständiga. Beräknade siffror är matematiska resultat utifrån dessa uppgifter och utgör inte auktoriserade värderingar.",
        ],
      },
      {
        id: "tarife",
        heading: "3. Planer och priser",
        paragraphs: [
          "Free Scout: kostnadsfri, obegränsad löptid med begränsad omfattning (fastighetslista synlig, marknadsvärden och auktionsdatum låsta). Inga betalningsuppgifter samlas in.",
          "Provperiod: Efter verifiering av e-postadressen får kunden tillgång till Investor-omfattningen kostnadsfritt i 14 dagar. Provperioden upphör automatiskt och övergår inte i ett betalabonnemang.",
          "Investor Månadsvis: Full individuell åtkomst för 39,00 € / £35 / CHF 39 (europeiska marknader) eller 599,00 TL (turkiska marknaden) per månad, betalas i förskott med automatisk månadsvis förlängning om det inte sägs upp.",
          "Investor Tre månader: Full individuell åtkomst i tre kalendermånader mot en engångsbetalning om 99,00 € / £89 / CHF 99 (europeiska marknader) eller 1 490,00 TL (turkiska marknaden) i förskott. Förlängs inte automatiskt; ingen uppsägning krävs.",
          "Pro Månadsvis: Full åtkomst inklusive kundlänkar med eget brevhuvud och gemensamma teamlistor (upp till 3 team med upp till 5 platser vardera) för 129,00 € / £115 / CHF 129 (europeiska marknader) eller 1 990,00 TL (turkiska marknaden) per månad, betalas i förskott med automatisk månadsvis förlängning.",
          "Pro Tre månader: Full Pro-åtkomst i tre kalendermånader mot en engångsbetalning om 329,00 € / £295 / CHF 329 (europeiska marknader) eller 4 990,00 TL (turkiska marknaden) i förskott. Förlängs inte automatiskt; ingen uppsägning krävs. Utökade företagskvoter för team (från 299,00 € per månad) avtalas individuellt efter förfrågan.",
          vatSentenceSv(vatMode),
        ],
      },
      {
        id: "vertragsschluss",
        heading: "4. Avtalets ingående",
        paragraphs: [
          "Genom registrering och verifiering av e-postadressen ingås ett kostnadsfritt användaravtal (Free Scout med provperiod).",
          "Betald Investor- eller Pro-åtkomst bokas i kontot via beställningsöversikten, där plan, pris, löptid och förlängningsvillkor sammanfattas. Genom att klicka på knappen ”Beställ med betalningsskyldighet” lämnar kunden ett bindande anbud och skickas vidare till betalningsleverantören Stripes kassasida. Avtalet ingås så snart Stripe bekräftar betalningen och Leverantören aktiverar åtkomsten; kunden får bekräftelse via e-post.",
          "Leverantören sparar avtalstexten (beställning, plan, pris samt gällande version av dessa villkor) och skickar den till kunden via e-post tillsammans med orderbekräftelsen. Den aktuella versionen av villkoren finns alltid tillgänglig på belowmark.com/agb.",
        ],
      },
      {
        id: "zahlung",
        heading: "5. Betalning och fakturor",
        paragraphs: [
          "Betalningar hanteras via Stripe Payments Europe, Ltd. (Irland). Betalningsuppgifter anges uteslutande på Stripes kassasida och lagras aldrig hos Leverantören.",
          "Månadsabonnemang debiteras i förskott vid början av varje betalningsperiod. Fakturor finns tillgängliga i kontot under ”Fakturor och betalningsmetoder” och skickas även via e-post.",
          "Om en debitering misslyckas försöker Stripe debitera igen. Om betalning uteblir upphör full åtkomst vid slutet av den redan betalda perioden, medan det kostnadsfria kontot kvarstår.",
        ],
      },
      {
        id: "laufzeit",
        heading: "6. Avtalstid och uppsägning",
        paragraphs: [
          "Månadsabonnemang för Investor och Pro löper tills vidare och kan sägas upp när som helst med verkan från utgången av den redan betalda månaden. Full åtkomst gäller fram till det datumet. Ingen proportionell återbetalning ges för innevarande betalningsmånad vid ordinarie uppsägning.",
          `Uppsägning kan göras via knappen ”Säg upp avtal här” i sidfoten på varje sida (åtkomlig utan inloggning), i kontoinställningarna, via Stripes kundportal eller i textform till ${LEGAL_OPERATOR.email}. Efter uppsägning via uppsägningsknappen får kunden omedelbart en bekräftelse via e-post med uppgift om innehåll, datum och klockslag för mottagande samt det datum då avtalet upphör.`,
          "Tremånaderspaket upphör automatiskt vid utgången av de bokade kalendermånaderna. Det kostnadsfria Free Scout-avtalet kan sägas upp när som helst genom att kontot raderas.",
          "Rätten för båda parter till omedelbar uppsägning av synnerliga skäl påverkas inte.",
        ],
      },
      {
        id: "widerruf",
        heading: "7. Ångerrätt och dess upphörande för digitalt innehåll (§ 356 (5) BGB)",
        paragraphs: [
          "Belowmark är en digital produkt som aktiveras omedelbart vid mottagen betalning. Genom att acceptera dessa allmänna villkor i kassan samtycker kunden uttryckligen till att Leverantören påbörjar fullgörandet av avtalet (tillhandahållande och omedelbar aktivering av betald digital åtkomst) före utgången av den lagstadgade ångerfristen, och bekräftar sin kännedom om att den lagstadgade ångerrätten upphör omedelbart när åtkomsten aktiveras (enligt § 356 (5) i den tyska civillagen, BGB).",
          "Den fullständiga informationen om ångerrättens upphörande enligt § 356 (5) BGB finns på belowmark.com/widerruf och skickas till kunden via e-post tillsammans med avtalsbekräftelsen.",
        ],
      },
      {
        id: "verfuegbarkeit",
        heading: "8. Tillgänglighet",
        paragraphs: [
          "Leverantören strävar efter hög och kontinuerlig tillgänglighet men garanterar ingen viss upptid i procent. Underhåll, driftstörningar hos tredje part eller avbrott i officiella källportaler kan tillfälligt begränsa åtkomsten eller datamängdens aktualitet.",
        ],
      },
      {
        id: "nutzung",
        heading: "9. Nyttjanderätt, förbud mot skrapning och kontospärr utan återbetalning",
        paragraphs: [
          "Kunden får en icke-exklusiv, icke-överlåtbar rätt att under avtalstiden använda tjänsten uteslutande för egen research via en vanlig webbläsare. Följande är strikt förbjudet: (a) att dela inloggningsuppgifter eller låta flera personer dela konto utanför bokade teamplatser, (b) varje systematisk, automatiserad eller skriptbaserad utläsning, insamling, kopiering eller indexering av data, texter, nyckeltal eller dokument (särskilt via botar, crawlers, scrapers, headless-webbläsare eller skript), (c) att kringgå tekniska skyddsåtgärder, hastighetsbegränsningar eller säkerhetsmekanismer (inklusive att utlösa honeypot-fällor), samt (d) massnedladdning, vidareförsäljning, underlicensiering eller offentliggörande av bearbetade data eller dokument.",
          "Varje överträdelse av ovanstående förbud utgör ett väsentligt avtalsbrott och ger Leverantören rätt till omedelbar uppsägning av synnerliga skäl (§ 314 BGB) samt omedelbar, permanent spärr av användarkontot och enhetsidentifieraren utan föregående varning.",
          "Vid sådan kontospärr eller omedelbar uppsägning till följd av kundens avtalsbrott (särskilt skrapning, automatiserad dataextraktion eller kringgående av säkerhetsmekanismer) upphör nyttjanderätten med omedelbar verkan. Eventuella krav från kunden på återbetalning eller proportionell ersättning för redan erlagda avgifter för innevarande betalningsmånad eller bokade flermånadersperioder är i sådant fall uteslutna. Leverantörens rätt till skadestånd och förbudsföreläggande kvarstår.",
        ],
      },
      {
        id: "haftung",
        heading: "10. Ansvar",
        paragraphs: [
          "Leverantören ansvarar obegränsat vid uppsåt och grov oaktsamhet, vid skada på liv, kropp eller hälsa samt enligt tvingande produktansvarslagstiftning. Vid ringa oaktsamhet ansvarar Leverantören endast för brott mot väsentliga avtalsförpliktelser (förpliktelser vars fullgörande över huvud taget möjliggör ett korrekt genomförande av avtalet och som kunden regelmässigt får förlita sig på), begränsat till den förutsebara, avtalstypiska skadan.",
          "Om inte ett fall enligt föregående stycke föreligger ansvarar Leverantören inte för ekonomiska beslut som kunden fattar, i synnerhet inte för bud som läggs på auktioner och följderna av dessa.",
        ],
      },
      {
        id: "aenderungen",
        heading: "11. Ändringar av villkor och priser",
        paragraphs: [
          "Leverantören meddelar kunden i textform om ändringar av dessa villkor eller av priset för månadsabonnemang minst sex veckor innan de träder i kraft. Ändringar träder i kraft först om kunden samtycker; om kunden inte samtycker har båda parter rätt att säga upp avtalet per dagen då ändringen skulle ha trätt i kraft.",
        ],
      },
      {
        id: "recht",
        heading: "12. Tillämplig lag och behörig domstol",
        paragraphs: [
          "Tysk rätt ska tillämpas, med uteslutande av FN:s köplag (CISG). I förhållande till konsumenter gäller detta lagval endast i den mån det inte berövar konsumenten det skydd som följer av tvingande bestämmelser i lagen i den stat där konsumenten har sin vanliga vistelseort.",
          `Om kunden är näringsidkare, offentligrättslig juridisk person eller offentligrättslig specialfond är exklusivt forum Leverantörens säte (${LEGAL_OPERATOR.court}).`,
        ],
      },
    ],
  };
}
