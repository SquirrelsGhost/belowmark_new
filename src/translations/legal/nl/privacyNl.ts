import { filled, LEGAL_OPERATOR, operatorAddress } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export const PRIVACY_NL: LegalDocument = {
  title: "Privacyverklaring",
  asOf: "Stand 31 oktober 2026",
  basis: "Informatie op grond van artikel 13 en 14 van de Algemene Verordening Gegevensbescherming (AVG / GDPR).",
  sections: [
    {
      id: "verantwortlicher",
      heading: "1. Verwerkingsverantwoordelijke",
      paragraphs: [
        `${operatorAddress()}. E-mail ${LEGAL_OPERATOR.email}, telefoon ${LEGAL_OPERATOR.phone}. Wij hebben geen functionaris voor gegevensbescherming aangesteld omdat daartoe geen wettelijke verplichting bestaat.`,
      ],
    },
    {
      id: "aufruf",
      heading: "2. Bezoek aan de website",
      paragraphs: [
        "Bij het opvragen van elke pagina verwerkt de server technisch noodzakelijke gegevens: IP-adres, tijdstip, opgevraagde URL, user-agent-header en serverstatuscode. De rechtsgrondslag is art. 6 lid 1 onder f AVG; ons gerechtvaardigd belang ligt in een veilige en storingsvrije werking.",
        `De applicatie zelf schrijft geen toegangslogboeken weg. Logbestanden kunnen wel bij de hostingprovider ontstaan: ${filled(LEGAL_OPERATOR.hosting, "Hostingprovider, serverlocatie en bewaartermijn van logbestanden invullen")}.`,
      ],
    },
    {
      id: "konto",
      heading: "3. Account en authenticatie",
      paragraphs: [
        "Voor een account slaan wij op: e-mailadres, een cryptografische wachtwoordhash (scrypt, nooit in leesbare tekst), gekozen markt en taal, tijdstip van e-mailverificatie, einddatum van de proefperiode, afgenomen abonnement en looptijd, en tijdstip van de laatste aanmelding. De rechtsgrondslag is art. 6 lid 1 onder b AVG (uitvoering van een overeenkomst).",
        "Voor elke aanmelding houden wij een serversessie bij met een hash van de browser-user-agent, een ingekort IP-adres en de vervaldatum. Zo kunnen wij gestolen sessiecookies detecteren en alle apparaten uitloggen. De rechtsgrondslag is art. 6 lid 1 onder f AVG (accountbeveiliging). Sessies verlopen automatisch.",
        "Tijdens registratie en aanmelding berekent uw browser een hardware-vingerafdrukhash op basis van technische kenmerken (grafische kaart, scherm, CPU-kernen, tijdzone) en slaat deze op in de lokale opslag (\"ec_hw_id\"). Deze wordt uitsluitend gebruikt om geblokkeerde apparaten te herkennen en accounts te beschermen tegen geautomatiseerde aanvallen (§ 25 lid 2 nr. 2 TDDDG, art. 6 lid 1 onder f AVG).",
        "Wij controleren nieuwe wachtwoorden tegen bekende datalekken (Have I Been Pwned). Daarbij worden uitsluitend de eerste vijf tekens van een SHA-1-hash verzonden, nooit het wachtwoord zelf (k-anonimiteit). De rechtsgrondslag is art. 6 lid 1 onder f AVG.",
        "Om misbruik te voorkomen tellen wij verzoeken per IP-adres en e-mailadres over korte tijdvakken (minuten tot uren).",
      ],
    },
    {
      id: "app",
      heading: "4. Inhoud die u in uw account aanmaakt",
      paragraphs: [
        "Opgeslagen volglijsten met notities en opgeslagen zoekopdrachten (meldingen) worden in onze database bewaard. Voor meldingen sturen wij e-mails zolang de melding actief is. Geüploade taxatierapport-PDF's worden geanalyseerd; wij slaan het uitgelezen analyseresultaat op (bestandsnaam, gevonden passages met paginanummers), niet het PDF-bestand zelf. De rechtsgrondslag is art. 6 lid 1 onder b AVG.",
        "Indien de uitgebreide taxatieanalyse is ingeschakeld, wordt de tekst van het geüploade taxatierapport doorgestuurd naar onze AI-verwerker voor gestructureerde extractie (op basis van EU-standaardcontractbepalingen krachtens art. 46 lid 2 onder c AVG).",
        "Due-diligencechecklists, invoer voor de biedlimiet, persoonlijke oordeelnotities, referentiewaarden en het bankdossier worden uitsluitend opgeslagen in de lokale opslag van uw browser (\"belowmark:…\"). Deze gegevens bereiken onze server nooit.",
      ],
    },
    {
      id: "zahlung",
      heading: "5. Boeking en betaling",
      paragraphs: [
        "Wanneer u een bestelling plaatst, slaan wij de bestelgegevens op: abonnement, prijs, markt, versie van de Algemene Voorwaarden, tijdstip van uw instemming met onmiddellijke uitvoering en betalingsstatus. De rechtsgrondslag is art. 6 lid 1 onder b AVG, en art. 6 lid 1 onder c AVG voor wettelijke bewaarplichten.",
        "De betaling wordt verwerkt op de afrekenpagina van Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Dublin 2, Ierland. Wij geven uw e-mailadres en bestelgegevens door aan Stripe; uw betaalgegevens vult u rechtstreeks bij Stripe in en deze bereiken ons nooit. Van Stripe ontvangen wij een klant-ID, betalingsstatus en factuur. Stripe verwerkt gegevens daarnaast als zelfstandig verwerkingsverantwoordelijke (bijv. voor fraudepreventie en wettelijke verplichtingen; zie stripe.com/privacy). Voor zover gegevens worden doorgegeven aan gelieerde ondernemingen in de VS, gebeurt dit op basis van het EU-VS Data Privacy Framework en EU-standaardcontractbepalingen.",
        "De afrekenpagina van Stripe wordt gehost op een Stripe-domein. Wij laden geen externe Stripe-scripts op belowmark.com zelf.",
        "Facturen en boekhoudkundige bescheiden worden bewaard gedurende de wettelijke handels- en fiscaalrechtelijke bewaartermijnen (§ 147 AO, § 257 HGB).",
      ],
    },
    {
      id: "erklaerungen",
      heading: "6. Opzeggings- en herroepingsverklaringen",
      paragraphs: [
        "Verklaringen die worden ingediend via \"Overeenkomsten hier opzeggen\" en \"Overeenkomst herroepen\" worden opgeslagen met naam, e-mailadres, contractreferentie, inhoud van de verklaring en datum en tijdstip van ontvangst, en wij sturen een bevestiging per e-mail. Wij bewaren deze gedurende drie jaar vanaf het einde van het kalenderjaar van ontvangst als bewijs van naleving (art. 6 lid 1 onder c en f AVG).",
      ],
    },
    {
      id: "mail",
      heading: "7. Transactionele e-mails",
      paragraphs: [
        `Wij versturen uitsluitend e-mails die nodig zijn voor de overeenkomst: verificatielinks, wachtwoordherstellinks, boekings- en opzeggingsbevestigingen en door u expliciet aangemaakte meldingen. Geen reclame, geen nieuwsbrieven, geen open- of kliktracking. Verzending vindt plaats via ${filled(LEGAL_OPERATOR.mailProvider, "SMTP-provider invullen")}.`,
      ],
    },
    {
      id: "cookies",
      heading: "8. Cookies en lokale opslag",
      paragraphs: [
        "Wij plaatsen geen analyse-, advertentie- of trackingcookies en integreren geen dergelijke diensten van derden. Daarom is geen cookiebanner vereist.",
        "Sessiecookie (\"__Host-bm_session\"): houdt uw aanmeldstatus bij; strikt noodzakelijk voor de gevraagde dienst (§ 25 lid 2 nr. 2 TDDDG). Deze verloopt wanneer u de browser sluit of, als \"Ingelogd blijven\" is geselecteerd, na 30 dagen.",
        "\"BELOWMARK_COUNTRY\" en \"BELOWMARK_MARKET\" (elk één jaar): onthouden uw gekozen land/taal en markt zodat taal en prijzen overeenkomen (§ 25 lid 2 nr. 2 TDDDG).",
        "Weblettertypen worden lokaal op onze eigen server gehost en niet via Google geladen.",
      ],
    },
    {
      id: "karten",
      heading: "9. Kaarten en luchtfoto's",
      paragraphs: [
        "Op objectdetailpagina's laadt uw browser kaarttegels rechtstreeks van basemap.de (Bundesamt für Kartographie und Geodäsie, Duitsland) of OpenStreetMap (OpenStreetMap Foundation, VK), evenals luchtfoto's van Esri (server.arcgisonline.com, VS). Deze aanbieders ontvangen uw IP-adres en de opgevraagde tegelcoördinaten. De rechtsgrondslag is art. 6 lid 1 onder f AVG (weergave van de objectlocatie).",
        "Links naar Google Maps, officiële gerechtsportalen en advertentieportalen openen pas externe pagina's wanneer u erop klikt; daarop is het privacybeleid van de betreffende beheerder van toepassing.",
      ],
    },
    {
      id: "dauer",
      heading: "10. Bewaartermijn en verwijdering",
      paragraphs: [
        "Wij bewaren accountgegevens totdat u uw account verwijdert. In uw account onder \"Uw gegevens\" kunt u alle opgeslagen gegevens als JSON downloaden en uw account zelf verwijderen. Bij verwijdering wissen wij onmiddellijk uw account, sessies, volglijst, meldingen en taxatieanalyses. Bestelgegevens en wettelijke verklaringen blijven zonder persoonlijke accountkoppeling bewaard zolang wettelijke bewaartermijnen dat vereisen.",
        "Eenmalige tokens (e-mailverificatie, wachtwoordherstel) worden bij gebruik verwijderd en verlopen na respectievelijk 24 uur of 1 uur.",
      ],
    },
    {
      id: "rechte",
      heading: "11. Uw rechten",
      paragraphs: [
        "U heeft recht op inzage (art. 15), rectificatie (art. 16), gegevenswissing (art. 17), beperking van de verwerking (art. 18), gegevensoverdraagbaarheid (art. 20) en het recht bezwaar te maken tegen verwerking op basis van gerechtvaardigde belangen (art. 21 AVG). Neem contact met ons op via het bovenstaande adres, of start export en verwijdering rechtstreeks in uw account.",
        `U heeft het recht een klacht in te dienen bij een toezichthoudende autoriteit voor gegevensbescherming, in het bijzonder bij de voor ons bevoegde autoriteit: ${LEGAL_OPERATOR.supervisoryAuthority}.`,
        "Geautomatiseerde besluitvorming of profilering in de zin van art. 22 AVG vindt niet plaats.",
      ],
    },
  ],
};
