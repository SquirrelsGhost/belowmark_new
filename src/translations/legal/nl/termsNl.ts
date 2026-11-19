import { LEGAL_OPERATOR, operatorAddress } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export function vatSentenceNl(vatMode: "inclusive" | "kleinunternehmer" | null): string {
  if (vatMode === "kleinunternehmer") {
    return "Alle prijzen zijn eindprijzen. Op grond van § 19 van de Duitse Wet op de omzetbelasting (UStG) wordt geen btw in rekening gebracht.";
  }
  return "Alle prijzen zijn eindprijzen en inclusief de toepasselijke wettelijke btw.";
}

export function termsNl(vatMode: "inclusive" | "kleinunternehmer" | null): LegalDocument {
  return {
    title: "Algemene Voorwaarden (AGB)",
    asOf: "Stand 31 oktober 2026",
    basis: "Van toepassing op het gebruik van het Belowmark-platform (belowmark.com).",
    sections: [
      {
        id: "geltung",
        heading: "1. Toepassingsgebied en contractpartijen",
        paragraphs: [
          `Deze Algemene Voorwaarden zijn van toepassing op alle overeenkomsten voor het gebruik van de onlinedienst Belowmark die worden gesloten tussen ${operatorAddress()} (hierna "Aanbieder") en de klant.`,
          "Consument is iedere natuurlijke persoon die een rechtshandeling aangaat voor doeleinden die overwegend niet aan zijn bedrijfs- of zelfstandige beroepsactiviteit kunnen worden toegerekend (§ 13 van het Duitse Burgerlijk Wetboek, BGB). Afwijkende voorwaarden van de klant gelden uitsluitend indien de Aanbieder daarmee uitdrukkelijk instemt.",
        ],
      },
      {
        id: "leistung",
        heading: "2. Onderwerp van de dienstverlening",
        paragraphs: [
          "Belowmark verzamelt openbaar bekendgemaakte informatie over gerechtelijke en openbare vastgoedveilingen in Europa (Duitsland, Oostenrijk, Zwitserland, Italië, Spanje, Frankrijk, Verenigd Koninkrijk) en Turkije, structureert deze en berekent kerncijfers (zoals wettelijke bieddrempels, waarborgsommen en aankoopkosten). Gedurende de looptijd van de overeenkomst krijgt de klant persoonlijke toegang tot de webapplicatie voor de bij registratie gekozen markt.",
          "Belowmark is een onderzoeks- en due-diligencehulpmiddel. De dienst vormt geen juridisch, fiscaal, makelaars- of beleggingsadvies en bevat geen aanbeveling om een bepaald bod uit te brengen. Elk gegeven moet vóór het nemen van een financiële beslissing worden geverifieerd aan de hand van de officiële originele gerechts- of veilingstukken.",
          "De gegevens zijn afkomstig van externe bronnen (gerechts- en overheidsportalen, officiële bekendmakingsbladen en advertentieportalen). De Aanbieder aanvaardt geen garantie voor de juistheid, volledigheid of actualiteit van deze gegevens; vermeldingen kunnen onvolledig zijn. Berekende cijfers zijn wiskundige uitkomsten op basis van deze informatie en vormen geen gecertificeerde taxaties.",
        ],
      },
      {
        id: "tarife",
        heading: "3. Abonnementen en prijzen",
        paragraphs: [
          "Free Scout: gratis, onbeperkte duur met beperkte omvang (objectlijst zichtbaar, taxatiewaarden en veilingdata afgeschermd). Er worden geen betaalgegevens verzameld.",
          "Proefperiode: na verificatie van het e-mailadres ontvangt de klant gedurende 14 dagen kosteloos de omvang van de Investor-toegang. De proefperiode eindigt automatisch en wordt niet omgezet in een betaald abonnement.",
          "Investor Maandelijks: volledige individuele toegang voor € 39,00 / £ 35 / CHF 39 (Europese markten) of 599,00 TL (Turkse markt) per maand, vooraf te betalen, met automatische maandelijkse verlenging tenzij opgezegd.",
          "Investor Drie Maanden: volledige individuele toegang gedurende drie kalendermaanden tegen een eenmalige betaling van € 99,00 / £ 89 / CHF 99 (Europese markten) of 1.490,00 TL (Turkse markt), vooraf te betalen. Wordt niet automatisch verlengd; opzegging is niet nodig.",
          "Pro Maandelijks: volledige toegang inclusief klantlinks met eigen briefhoofd en gedeelde teamvolglijsten (tot 3 teams met maximaal 5 plekken per team) voor € 129,00 / £ 115 / CHF 129 (Europese markten) of 1.990,00 TL (Turkse markt) per maand, vooraf te betalen, met automatische maandelijkse verlenging.",
          "Pro Drie Maanden: volledige Pro-toegang gedurende drie kalendermaanden tegen een eenmalige betaling van € 329,00 / £ 295 / CHF 329 (Europese markten) of 4.990,00 TL (Turkse markt), vooraf te betalen. Wordt niet automatisch verlengd; opzegging is niet nodig. Uitgebreide zakelijke teamquota (vanaf € 299,00 per maand) worden na voorafgaande aanvraag individueel overeengekomen.",
          vatSentenceNl(vatMode),
        ],
      },
      {
        id: "vertragsschluss",
        heading: "4. Totstandkoming van de overeenkomst",
        paragraphs: [
          "Door registratie en verificatie van het e-mailadres komt een kosteloze gebruiksovereenkomst (Free Scout met proefperiode) tot stand.",
          "Betaalde Investor- of Pro-toegang wordt in het account geboekt via de besteloverzichtspagina, waarop abonnement, prijs, looptijd en verlengingsvoorwaarden worden samengevat. Door te klikken op de knop \"Bestellen met betalingsverplichting\" doet de klant een bindend aanbod en wordt doorgestuurd naar de afrekenpagina van betaaldienstverlener Stripe. De overeenkomst komt tot stand zodra Stripe de betaling bevestigt en de Aanbieder de toegang activeert; de klant ontvangt een bevestiging per e-mail.",
          "De Aanbieder slaat de contracttekst (bestelling, abonnement, prijs en actuele versie van deze Algemene Voorwaarden) op en stuurt deze samen met de orderbevestiging per e-mail naar de klant. De actuele versie van deze Algemene Voorwaarden is altijd in te zien op belowmark.com/agb.",
        ],
      },
      {
        id: "zahlung",
        heading: "5. Betaling en facturen",
        paragraphs: [
          "Betalingen worden verwerkt via Stripe Payments Europe, Ltd. (Ierland). Betaalgegevens worden uitsluitend ingevoerd op de afrekenpagina van Stripe en worden nooit door de Aanbieder opgeslagen.",
          "Maandabonnementen worden vooraf bij aanvang van elke facturatieperiode afgeschreven. Facturen zijn beschikbaar in het account onder \"Facturen en betaalmethoden\" en worden per e-mail verzonden.",
          "Als een incasso mislukt, doet Stripe opnieuw een poging. Blijft betaling uit, dan eindigt de volledige toegang aan het einde van de betaalde periode terwijl de gratis accounttoegang behouden blijft.",
        ],
      },
      {
        id: "laufzeit",
        heading: "6. Looptijd en opzegging",
        paragraphs: [
          "Maandelijkse Investor- en Pro-abonnementen lopen voor onbepaalde tijd en kunnen op elk moment worden opgezegd tegen het einde van de reeds betaalde maand. De volledige toegang blijft tot die datum actief. Bij reguliere opzegging vindt geen pro-rata terugbetaling plaats voor de lopende facturatiemaand.",
          `Opzegging kan plaatsvinden via de knop "Overeenkomsten hier opzeggen" in de voettekst van elke pagina (ook zonder inloggen bereikbaar), in de accountinstellingen, via het Stripe-klantenportaal of in tekstvorm aan ${LEGAL_OPERATOR.email}. Na opzegging via de opzegknop ontvangt de klant direct per e-mail een bevestiging met vermelding van de inhoud, datum en tijdstip van ontvangst en de datum waarop de overeenkomst eindigt.`,
          "Driemaandspakketten eindigen automatisch na afloop van de geboekte kalendermaanden. De gratis Free Scout-overeenkomst kan op elk moment worden beëindigd door het account te verwijderen.",
          "Het recht op buitengewone opzegging om gewichtige redenen blijft voor beide partijen onverlet.",
        ],
      },
      {
        id: "widerruf",
        heading: "7. Herroepingsrecht en verval bij digitale inhoud (§ 356 lid 5 BGB)",
        paragraphs: [
          "Belowmark is een digitaal product dat direct na ontvangst van betaling wordt geactiveerd. Door tijdens het bestelproces akkoord te gaan met deze Algemene Voorwaarden stemt de klant er uitdrukkelijk mee in dat de Aanbieder vóór het verstrijken van de wettelijke herroepingstermijn begint met de uitvoering van de overeenkomst (beschikbaarstelling en onmiddellijke activering van de betaalde digitale toegang) en bevestigt hij ervan op de hoogte te zijn dat zijn wettelijke herroepingsrecht direct bij activering van de toegang vervalt (overeenkomstig § 356 lid 5 van het Duitse Burgerlijk Wetboek, BGB).",
          "De volledige informatie over het verval van het herroepingsrecht op grond van § 356 lid 5 BGB is beschikbaar op belowmark.com/widerruf en wordt samen met de contractbevestiging per e-mail aan de klant toegezonden.",
        ],
      },
      {
        id: "verfuegbarkeit",
        heading: "8. Beschikbaarheid",
        paragraphs: [
          "De Aanbieder streeft naar een continue beschikbaarheid van de dienst, maar garandeert geen specifiek beschikbaarheidspercentage. Onderhoud, storingen bij derden of uitval van officiële bronportalen kunnen de toegang of de actualiteit van de dataset tijdelijk beperken.",
        ],
      },
      {
        id: "nutzung",
        heading: "9. Gebruiksrechten, verbod op scraping en accountblokkering zonder restitutie",
        paragraphs: [
          "De klant verkrijgt gedurende de looptijd van de overeenkomst een niet-exclusief, niet-overdraagbaar recht om de dienst uitsluitend voor eigen onderzoeksdoeleinden via een reguliere webbrowser te gebruiken. Het volgende is strikt verboden: (a) het delen van inloggegevens of het gezamenlijk gebruiken van een account door meerdere personen buiten geboekte teamplekken, (b) elk systematisch, geautomatiseerd of scriptmatig uitlezen, verzamelen, kopiëren of indexeren van gegevens, teksten, kerncijfers of documenten (in het bijzonder via bots, crawlers, scrapers, headless browsers of scripts), (c) het omzeilen van technische beveiligingsmaatregelen, snelheidslimieten of beveiligingsmechanismen (inclusief het activeren van honeypot-vallen), en (d) het in bulk downloaden, doorverkopen, in sublicentie geven of openbaar maken van de verwerkte gegevens of documenten.",
          "Elke schending van bovenstaande verboden vormt een wezenlijke contractbreuk en geeft de Aanbieder het recht tot onmiddellijke buitengewone opzegging om gewichtige redenen (§ 314 BGB) alsmede tot onmiddellijke, definitieve blokkering van het gebruikersaccount en de apparaatidentificatie zonder voorafgaande waarschuwing.",
          "In geval van een dergelijke accountblokkering of buitengewone opzegging wegens contractbreuk door de klant (in het bijzonder scraping, geautomatiseerde data-extractie of omzeiling van beveiligingsmechanismen) eindigt het gebruiksrecht met onmiddellijke ingang. Iedere aanspraak van de klant op terugbetaling of pro-rata vergoeding van reeds betaalde bedragen voor de lopende facturatiemaand of geboekte meermaandelijkse perioden is in dat geval uitgesloten. Verdere aanspraken van de Aanbieder op schadevergoeding en een verbodsactie blijven onverlet.",
        ],
      },
      {
        id: "haftung",
        heading: "10. Aansprakelijkheid",
        paragraphs: [
          "De Aanbieder is onbeperkt aansprakelijk bij opzet en grove nalatigheid, voor schade aan leven, lichaam of gezondheid, en op grond van dwingende productaansprakelijkheidswetgeving. Bij lichte nalatigheid is de Aanbieder uitsluitend aansprakelijk voor schending van wezenlijke contractuele verplichtingen (verplichtingen waarvan de nakoming een behoorlijke uitvoering van de overeenkomst überhaupt mogelijk maakt en op de naleving waarvan de klant regelmatig mag vertrouwen), beperkt tot de voorzienbare, voor dit type overeenkomst typische schade.",
          "Tenzij een geval als bedoeld in het vorige lid zich voordoet, is de Aanbieder niet aansprakelijk voor financiële beslissingen van de klant, in het bijzonder niet voor op veilingen uitgebrachte biedingen en de gevolgen daarvan.",
        ],
      },
      {
        id: "aenderungen",
        heading: "11. Wijzigingen van deze voorwaarden en prijzen",
        paragraphs: [
          "De Aanbieder stelt de klant ten minste zes weken vóór inwerkingtreding in tekstvorm op de hoogte van wijzigingen in deze Algemene Voorwaarden of in de prijs van maandabonnementen. Wijzigingen treden alleen in werking indien de klant daarmee instemt; stemt de klant niet in, dan kan ieder der partijen de overeenkomst opzeggen tegen de datum waarop de wijziging ingaat.",
        ],
      },
      {
        id: "recht",
        heading: "12. Toepasselijk recht en bevoegde rechter",
        paragraphs: [
          "Duits recht is van toepassing, met uitsluiting van het VN-Koopverdrag (CISG). Ten aanzien van consumenten geldt deze rechtskeuze slechts voor zover zij de consument niet de bescherming ontneemt van dwingende bepalingen van het recht van de staat waar de consument zijn gewone verblijfplaats heeft.",
          `Indien de klant koopman, rechtspersoon van publiek recht of een publiekrechtelijk doelvermogen is, is de bevoegde rechter uitsluitend de rechter van de vestigingsplaats van de Aanbieder (${LEGAL_OPERATOR.court}).`,
        ],
      },
    ],
  };
}
