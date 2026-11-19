import { filled, LEGAL_OPERATOR, operatorAddress } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export const PRIVACY_SV: LegalDocument = {
  title: "Integritetspolicy",
  asOf: "Per den 31 oktober 2026",
  basis: "Information enligt artiklarna 13 och 14 i EU:s dataskyddsförordning (GDPR).",
  sections: [
    {
      id: "verantwortlicher",
      heading: "1. Personuppgiftsansvarig",
      paragraphs: [
        `${operatorAddress()}. E-post ${LEGAL_OPERATOR.email}, telefon ${LEGAL_OPERATOR.phone}. Vi har inte utsett något dataskyddsombud eftersom det inte föreligger någon lagstadgad skyldighet att göra det.`,
      ],
    },
    {
      id: "aufruf",
      heading: "2. Besök på webbplatsen",
      paragraphs: [
        "När du besöker en sida behandlar servern tekniskt nödvändiga uppgifter: IP-adress, tidsstämpel, begärd URL, webbläsarens user-agent och serverns statuskod. Rättslig grund är artikel 6.1 f GDPR; vårt berättigade intresse består i en säker och störningsfri drift.",
        `Själva applikationen skriver inga åtkomstloggar. Loggar kan skapas hos hostingleverantören: ${filled(LEGAL_OPERATOR.hosting, "Ange hostingleverantör, serverplats och lagringstid för loggar")}.`,
      ],
    },
    {
      id: "konto",
      heading: "3. Konto och autentisering",
      paragraphs: [
        "För ett användarkonto lagrar vi: e-postadress, en kryptografisk lösenordshash (scrypt, aldrig klartext), vald marknad och språk, tidpunkt för e-postverifiering, slutdatum för provperiod, bokad plan och löptid samt tidpunkt för senaste inloggning. Rättslig grund är artikel 6.1 b GDPR (fullgörande av avtal).",
        "Vid varje inloggning för vi en serversession med en hash av webbläsarens user-agent, en trunkerad IP-adress och utgångstidpunkt. Det gör att vi kan upptäcka stulna sessionskakor och logga ut alla enheter. Rättslig grund är artikel 6.1 f GDPR (kontosäkerhet). Sessioner löper ut automatiskt.",
        "Vid registrering och inloggning beräknar din webbläsare en maskinvaruhash utifrån tekniska egenskaper (grafikkort, skärm, processorkärnor, tidszon) och sparar den i lokal lagring (\"ec_hw_id\"). Den används uteslutande för att känna igen spärrade enheter och skydda konton mot automatiserade angrepp (§ 25 (2) nr 2 TDDDG, artikel 6.1 f GDPR).",
        "Vi kontrollerar nya lösenord mot kända dataläckor (Have I Been Pwned). Endast de fem första tecknen i en SHA-1-hash överförs, aldrig själva lösenordet (k-anonymitet). Rättslig grund är artikel 6.1 f GDPR.",
        "För att motverka missbruk räknar vi anrop per IP-adress och e-postadress under korta tidsfönster (minuter till timmar).",
      ],
    },
    {
      id: "app",
      heading: "4. Innehåll du skapar i ditt konto",
      paragraphs: [
        "Sparade bevakningslistor med anteckningar och sparade sökningar (bevakningar/larm) lagras i vår databas. För bevakningar skickar vi e-post så länge bevakningen är aktiv. Uppladdade värderingsutlåtanden i PDF-format analyseras; vi lagrar endast det extraherade analysresultatet (filnamn, matchade utdrag med sidnummer), inte själva PDF-filen. Rättslig grund är artikel 6.1 b GDPR.",
        "Om utökad analys av värderingsutlåtanden är aktiverad överförs texten i det uppladdade utlåtandet till vår AI-underleverantör för strukturerad extraktion (med EU:s standardavtalsklausuler enligt artikel 46.2 c GDPR).",
        "Kontrollistor, inmatningar för budgräns, egna slutsatsanteckningar, jämförelsevärden och bankunderlaget sparas uteslutande i din webbläsares lokala lagring (\"belowmark:…\"). Dessa uppgifter når aldrig vår server.",
      ],
    },
    {
      id: "zahlung",
      heading: "5. Beställning och betalning",
      paragraphs: [
        "När du gör en beställning lagrar vi orderuppgifterna: plan, pris, marknad, version av villkoren, tidsstämpel för ditt samtycke till omedelbart påbörjande samt betalningsstatus. Rättslig grund är artikel 6.1 b GDPR samt artikel 6.1 c GDPR för lagstadgad arkivering.",
        "Betalning sker på kassasidan hos Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Dublin 2, Irland. Vi överför din e-postadress och beställningsuppgifter till Stripe; dina betalningsuppgifter anger du direkt hos Stripe och de når aldrig oss. Från Stripe får vi ett kund-ID, betalningsstatus och faktura. Stripe behandlar även personuppgifter som självständigt personuppgiftsansvarig (t.ex. för bedrägeribekämpning och lagstadgade skyldigheter; se stripe.com/privacy). Eventuell överföring till närstående bolag i USA sker med stöd av EU-US Data Privacy Framework och EU:s standardavtalsklausuler.",
        "Stripes kassasida ligger på en Stripe-domän. Vi bäddar inte in tredjepartsskript från Stripe på belowmark.com.",
        "Fakturor och bokföringsunderlag sparas under de lagstadgade tidsfrister som gäller enligt handels- och skatterätt (§ 147 AO, § 257 HGB).",
      ],
    },
    {
      id: "erklaerungen",
      heading: "6. Uppsägnings- och ångermeddelanden",
      paragraphs: [
        "Meddelanden som skickas via ”Säg upp avtal här” och ”Ångra avtal” lagras med namn, e-postadress, avtalsreferens, meddelandets innehåll samt datum och klockslag för mottagande, och vi skickar en bekräftelse via e-post. Vi sparar dessa i tre år från utgången av det kalenderår då de mottogs för att kunna dokumentera efterlevnad (artikel 6.1 c och f GDPR).",
      ],
    },
    {
      id: "mail",
      heading: "7. Transaktionella e-postmeddelanden",
      paragraphs: [
        `Vi skickar endast e-post som krävs för avtalet: verifieringslänkar, länkar för lösenordsåterställning, beställnings- och uppsägningsbekräftelser samt bevakningsmejl som du själv skapat. Ingen reklam, inga nyhetsbrev och ingen öppnings- eller klickspårning. Utskick sker via ${filled(LEGAL_OPERATOR.mailProvider, "Ange SMTP-leverantör")}.`,
      ],
    },
    {
      id: "cookies",
      heading: "8. Kakor (cookies) och lokal lagring",
      paragraphs: [
        "Vi sätter inga analys-, reklam- eller spårningskakor och bäddar inte in några sådana tredjepartstjänster. Därför krävs ingen samtyckesbanner för kakor.",
        "Sessionskaka (\"__Host-bm_session\"): håller dig inloggad; strikt nödvändig för den begärda tjänsten (§ 25 (2) nr 2 TDDDG). Den löper ut när du stänger webbläsaren eller efter 30 dagar om ”Förbli inloggad” är valt.",
        "\"BELOWMARK_COUNTRY\" och \"BELOWMARK_MARKET\" (ett år vardera): kommer ihåg ditt valda land/språk och marknad så att språk och priser stämmer (§ 25 (2) nr 2 TDDDG).",
        "Webbtypsnitt lagras lokalt på vår egen server och laddas inte från Google.",
      ],
    },
    {
      id: "karten",
      heading: "9. Kartor och flygbilder",
      paragraphs: [
        "På fastigheternas detaljsidor laddar din webbläsare kartrutor direkt från basemap.de (Bundesamt für Kartographie und Geodäsie, Tyskland) eller OpenStreetMap (OpenStreetMap Foundation, Storbritannien), samt flygbilder från Esri (server.arcgisonline.com, USA). Dessa leverantörer får din IP-adress och begärda kartkoordinater. Rättslig grund är artikel 6.1 f GDPR (visning av fastighetens läge).",
        "Länkar till Google Maps, officiella domstolsportaler och annonsportaler öppnar externa sidor först när du klickar på dem; där gäller respektive operatörs integritetspolicy.",
      ],
    },
    {
      id: "dauer",
      heading: "10. Lagringstid och radering",
      paragraphs: [
        "Vi lagrar kontouppgifter tills du raderar ditt konto. Under ”Dina uppgifter” i kontot kan du ladda ner alla lagrade uppgifter som JSON och själv radera kontot. Vid radering tar vi omedelbart bort konto, sessioner, bevakningslista, larm och analyser av värderingsutlåtanden. Beställningsunderlag och lagstadgade förklaringar sparas utan koppling till ett personligt konto så länge lagstadgade arkiveringsfrister kräver det.",
        "Engångstokens (e-postverifiering, lösenordsåterställning) raderas vid användning och löper ut efter 24 timmar respektive 1 timme.",
      ],
    },
    {
      id: "rechte",
      heading: "11. Dina rättigheter",
      paragraphs: [
        "Du har rätt till tillgång (artikel 15), rättelse (artikel 16), radering (artikel 17), begränsning av behandling (artikel 18), dataportabilitet (artikel 20) samt rätt att invända mot behandling som grundar sig på berättigat intresse (artikel 21 GDPR). Kontakta oss på adressen ovan, eller starta export och radering direkt i ditt konto.",
        `Du har rätt att lämna in klagomål till en dataskyddsmyndighet, särskilt den tillsynsmyndighet som ansvarar för oss: ${LEGAL_OPERATOR.supervisoryAuthority}.`,
        "Automatiserat beslutsfattande eller profilering i den mening som avses i artikel 22 GDPR förekommer inte.",
      ],
    },
  ],
};
