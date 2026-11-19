import { MarketCode } from "../../../lib/constants";
import { ClosingTaskText } from "../IClosingTranslation";

/** Taakteksten in het Nederlands, voor beide markten. Elke uitspraak heeft zijn bron in closingTasks.ts. */
export const CLOSING_TASKS_NL: Record<MarketCode, Record<string, ClosingTaskText>> = {
  DE: {
    "de.ruling": {
      title: "Gunningsbeschikking (Zuschlagsbeschluss) veiligstellen",
      detail:
        "Met de gunning wordt u eigenaar, nog vóór de inschrijving in het kadaster (§ 90 ZVG). Laat de beschikking aan u uitreiken of toezenden en bewaar deze zorgvuldig: later dient zij ook als executoriale titel voor een eventuele ontruiming. De rechtbank factureert de gunningskosten afzonderlijk (0,5-tarief volgens KV 2214 GKG).",
    },
    "de.appeal": {
      title: "Onherroepelijkheid (Rechtskraft) afwachten",
      detail:
        "Tegen de gunning kan direct beroep (sofortige Beschwerde) worden ingesteld. Voor iedereen die bij de veiling- of uitspraakzitting aanwezig was, begint de termijn bij de uitspraak (§ 98 ZVG) en bedraagt twee weken (§ 569 ZPO). Voor afwezigen begint de termijn pas na betekening — de onherroepelijkheid kan dus later intreden. Geef tot die tijd geen opdrachten die u niet meer kunt annuleren.",
    },
    "de.risk": {
      title: "Behandel het object vanaf vandaag als het uwe",
      detail:
        "Het risico van toevallig tenietgaan gaat bij de gunning op u over, samen met de baten en lasten (§ 56 ZVG). Controleer of het pand veilig is (leegstand, vorst, toegang) en leg de staat vast met gedateerde foto's.",
    },
    "de.insurerNotice": {
      title: "Opstalverzekeraar informeren",
      detail:
        "Een bestaande opstalverzekering gaat op u over (§ 99 jo. § 95 VVG). U moet de eigendomsverkrijging onverwijld melden aan de verzekeraar; anders kan deze van de uitkeringsplicht worden ontheven (§ 97 VVG). Vraag verzekeraar en polisnummer op bij de executierechtbank of controleer het taxatierapport. Bestaat er geen polis, verzeker het pand dan direct zelf.",
    },
    "de.insuranceCancel": {
      title: "Overgenomen verzekering controleren en zo nodig opzeggen",
      detail:
        "U kunt de overgenomen verzekering met onmiddellijke ingang of tegen het einde van de lopende verzekeringsperiode opzeggen, maar uitsluitend binnen één maand na verkrijging — of binnen één maand nadat u van de polis kennis heeft genomen (§ 96 lid 2 VVG). Zeg pas op zodra aaneensluitende vervangende dekking geregeld is.",
    },
    "de.charges": {
      title: "Lopende lasten overnemen",
      detail:
        "Vanaf de gunning draagt u alle lopende lasten (§ 56 ZVG): evenredige onroerendezaakbelasting, VvE-bijdragen (Hausgeld) bij appartementsrechten, elektriciteit, water en verwarming. Noteer meterstanden en meld de overname bij nutsbedrijven en, indien van toepassing, de VvE-beheerder (WEG-Verwaltung). Achterstallige VvE-bijdragen van de vorige eigenaar worden uit de veilingopbrengst voldaan (rangklasse 2, § 10 lid 1 nr. 2 ZVG); volgens het Bundesgerichtshof (BGH V ZR 209/12) leidt dit voorrecht niet tot zakelijke aansprakelijkheid van de koper.",
    },
    "de.interest": {
      title: "Let op de 4% rente over het contante bod (Bargebot)",
      detail:
        "Over het contante bod is vanaf de gunning rente verschuldigd (§ 49 lid 2 ZVG) van 4% per jaar (§ 246 BGB). De rente loopt tot aan de betaling. Overleg met de gerechtsambtenaar (Rechtspfleger) of een eerdere storting bij de rechtbank (§ 49 lid 4 ZVG) in uw geval zinvol is.",
    },
    "de.summons": {
      title: "Oproep voor de verdelingszitting (Verteilungstermin) invoeren",
      detail:
        "Na de gunning plant de rechtbank de verdelingszitting en roept u als koper op; de oproep moet ten minste twee weken van tevoren worden betekend (§ 105 ZVG). Vul de datum hierboven in — de checklist berekent daaruit de betalings- en zittingstermijnen.",
    },
    "de.financing": {
      title: "Uitbetaling afstemmen met uw bank",
      detail:
        "Belowmark-regel: uw bank moet de uitbetalingsdatum ten minste twee weken vóór de verdelingszitting kennen. Geef het zaaknummer, de gegevens van de gerechtskas (Gerichtskasse) en het betalingskenmerk uit de oproep door. Het bankdossier vat dit samen voor uw bank.",
    },
    "de.pay": {
      title: "Contant bod (Bargebot) overmaken",
      detail:
        "Het contante bod moet vóór de verdelingszitting per bankoverschrijving aan de gerechtskas (Gerichtskasse) worden betaald; het bedrag moet vóór de zitting zijn bijgeschreven en het betalingsbewijs moet op de zitting worden overgelegd (§ 49 lid 1 en 3 ZVG). Contante betaling is niet toegestaan. Deze lijst plant de overschrijving vijf dagen vooraf — dat is een veiligheidsmarge, geen wettelijke termijn.",
    },
    "de.attend": {
      title: "Verdelingszitting (Verteilungstermin)",
      detail:
        "Neem het betalingsbewijs mee (§ 49 lid 3 ZVG). Op de zitting wordt het verdelingsplan (Teilungsplan) opgesteld en uitgevoerd — dit is een voorwaarde voor uw inschrijving in het kadaster (§ 130 ZVG).",
    },
    "de.default": {
      title: "Ken de gevolgen van niet-betaling",
      detail:
        "Als u niet betaalt, wordt het verdelingsplan uitgevoerd door de vordering op u over te dragen aan de gerechtigde schuldeisers (§ 118 ZVG). Die schuldeisers kunnen vervolgens zonder nieuwe executoriale titel direct een herveiling (Wiederversteigerung) tegen u starten (§ 133 ZVG). U blijft eigenaar en schuldenaar — terugtreden is niet mogelijk.",
    },
    "de.taxNotice": {
      title: "Overdrachtsbelasting (Grunderwerbsteuer) betalen",
      detail:
        "De rechtbank meldt de gunning aan de belastingdienst (§ 18 lid 1 nr. 3 GrEStG). De belasting is verschuldigd één maand na bekendmaking van de aanslag (§ 15 GrEStG). Vul de datum van de aanslag hierboven in.",
    },
    "de.clearance": {
      title: "Fiscale verklaring van geen bezwaar (Unbedenklichkeitsbescheinigung)",
      detail:
        "Zonder deze verklaring wordt u niet in het kadaster ingeschreven (§ 22 lid 1 GrEStG). De belastingdienst geeft haar af zodra de belasting is betaald, verzekerd of uitgesteld (§ 22 lid 2 GrEStG) en stuurt haar meestal rechtstreeks naar de rechtbank of het kadaster. Informeer actief als er na betaling meerdere weken verstrijken.",
    },
    "de.courtFees": {
      title: "Gerechts- en kadasterkosten betalen",
      detail:
        "Gunningskosten (0,5-tarief volgens KV 2214 GKG, over het hoogste bod plus in stand blijvende rechten) en later de kosten voor uw kadastrale inschrijving (1,0-tarief volgens KV 14110 GNotKG). De biedlimietcalculator op de dossierpagina toont deze bedragen.",
    },
    "de.registry": {
      title: "Kadasterverzoek van de rechtbank (Grundbuchersuchen) afwachten",
      detail:
        "Zodra het verdelingsplan is uitgevoerd en de gunning onherroepelijk is, verzoekt de rechtbank het kadaster u als eigenaar in te schrijven en vervallen rechten alsmede de executieaantekening door te halen (§ 130 lid 1 ZVG). Een zekerheidsrecht (Grundschuld) voor uw bank kan pas daarna worden ingeschreven (§ 130 lid 3 ZVG).",
    },
    "de.extract": {
      title: "Kadastraal uittreksel controleren",
      detail:
        "Vraag na inschrijving een uittreksel op: staat u als eigenaar vermeld? Zijn de executieaantekening en vervallen rechten doorgehaald? Blijven uitsluitend de rechten staan die volgens de veilingvoorwaarden in stand moesten blijven?",
    },
    "de.eviction": {
      title: "Ontruiming op grond van de gunningsbeschikking",
      detail:
        "Tegen een bewoner zonder in stand blijvend recht — zoals de voormalige eigenaar — dient de gunningsbeschikking zelf als ontruimingstitel (§ 93 lid 1 ZVG). U heeft een executoriale grosse met betekeningsbewijs nodig (§ 750 ZPO) en schakelt de gerechtsdeurwaarder in (§ 885 ZPO); een beperkte ontruimingsopdracht op grond van § 885a ZPO kan kosten besparen. Niet mogelijk tegen bewoners met een recht dat de gunning overleeft (§ 93 lid 1 zin 2 ZVG). U hoeft geen uitgaven te vergoeden die vóór de gunning zijn gedaan (§ 93 lid 2 ZVG).",
    },
    "de.tenantTakeover": {
      title: "Bestaande huurovereenkomsten overnemen",
      detail:
        "Bestaande huur- en pachtovereenkomsten gaan op u over (§ 57 ZVG jo. § 566 BGB). Informeer huurders schriftelijk over de eigendomsovergang en het nieuwe bankrekeningnummer. U kunt aansprakelijk zijn voor terugbetaling van een waarborgsom, ook als u deze nooit van de vorige eigenaar heeft ontvangen (§ 566a BGB) — vraag bewijs van de borg op.",
    },
    "de.tenantNotice": {
      title: "Bijzonder opzeggingsrecht: uitsluitend tegen de eerst mogelijke datum",
      detail:
        "U mag opzeggen met inachtneming van de wettelijke opzegtermijn, maar uitsluitend tegen de eerst toegestane datum — anders vervalt dit bijzondere recht (§ 57a ZVG). Bij woonruimte moet de opzegging de huurder uiterlijk op de derde werkdag van een maand bereiken (§ 573c BGB). De wettelijke huurbescherming blijft van kracht: u heeft een gerechtvaardigd belang nodig, zoals eigen gebruik (§ 573 BGB). De hier getoonde datum is behoudend berekend (zaterdagen tellen als werkdag, feestdagen zijn niet afgetrokken) — laat de opzegging door een advocaat controleren.",
    },
    "de.handover": {
      title: "Oplevering vastleggen",
      detail:
        "Sleutels, meterstanden, staat van het pand met foto's, gebreken, achtergebleven spullen — met datum en handtekeningen. Vervang de sloten zodra u het bezit heeft.",
    },
    "de.inspect": {
      title: "Staat opnemen en renovatie plannen",
      detail:
        "Er geldt geen garantie of vrijwaring (§ 56 ZVG). Vergelijk de werkelijke staat met het taxatierapport en vraag offertes op voordat u opdrachten verstrekt. Vervolgens kunt u de renovatieschattingen in de biedlimietcalculator vervangen door echte offertes.",
    },
    "de.energy": {
      title: "Verplichte energetische maatregelen na eigendomsoverdracht",
      detail:
        "Voor een- en tweegezinswoningen die op 01-02-2002 door de vorige eigenaar werden bewoond, gaan bepaalde na-isolatieverplichtingen (bijv. isolatie van de bovenste verdiepingsvloer) op de nieuwe eigenaar over met een termijn van twee jaar na eigendomsovergang (voorheen § 47 GEG). De GEG is in 2026 vervangen door de Gebäudemodernisierungsgesetz — controleer de actuele regels met een energieadviseur.",
    },
    "de.permits": {
      title: "Vergunningen vóór verbouwingen controleren",
      detail:
        "Of verbouwingen, een bestemmingswijziging of werkzaamheden aan een monument vergunningplichtig zijn, wordt bepaald door deelstaatrecht (bouwverordening, monumentenwet). Stem dit vóór aanvang af met de gemeentelijke bouw- en woningtoezichtdienst.",
    },
    "de.condo": {
      title: "VvE-documenten (WEG) opvragen",
      detail:
        "Bij appartementsrechten: meld de eigendomsovergang bij de beheerder en vraag de begroting (Wirtschaftsplan), de laatste jaarafrekening, het besluitenregister en de splitsingsakte (Teilungserklärung) op. Let op reeds vastgestelde eenmalige bijdragen (Sonderumlagen).",
    },
  },
  TR: {
    "tr.pay": {
      title: "Veilingprijs (ihale bedeli) betalen — 7 dagen",
      detail:
        "De koopsom en kosten moeten binnen zeven dagen na publicatie van het veilingresultaatprotocol (artırma sonuç tutanağı) worden voldaan, ook als iemand vernietiging van de veiling heeft verzocht (Elektronik Satış Yönetmeliği art. 20/1; İİK art. 130). Sinds Wet nr. 7343 bestaat er geen verlenging van tien dagen meer. Vul de publicatiedatum van het protocol hierboven in.",
    },
    "tr.fees": {
      title: "Belastingen en kosten volgens de Şartname voorbereiden",
      detail:
        "De kadastrale overdrachtsbelasting (tapu harcı) bedraagt 20‰ van de koopprijs per partij (Wet nr. 492 Harçlar Kanunu, Tarief 4 art. 20/a). Indien de veilingvoorwaarden (Şartname) alle tapu-kosten aan de koper toerekenen, acht het Ministerie van Justitie dit toelaatbaar (İİDB, 12-01-2023) — in dat geval bedraagt het 40‰. Tel daarbij btw (KDV) volgens de bekendmaking en zegelrecht (damga vergisi) op. Lees de Şartname van uw procedure.",
    },
    "tr.default": {
      title: "Ken de gevolgen van niet-betaling",
      detail:
        "Bij niet-tijdige betaling annuleert het executiekantoor de gunning (ihale) en bent u aansprakelijk voor een eventueel prijsverschil (İİK art. 133). Voor veilingen die op of na 31-07-2026 worden aangekondigd, geldt bovendien een boete van 5% van het bod (İİK art. 114 zoals gewijzigd bij Wet nr. 7589).",
    },
    "tr.annulment": {
      title: "Vernietigingstermijn (ihalenin feshi) afwachten",
      detail:
        "Belanghebbenden kunnen binnen zeven dagen vernietiging van de veiling verzoeken (ihalenin feshi, İİK art. 134), of in bijzondere gevallen vanaf bekendwording tot maximaal één jaar. Zolang een procedure loopt, kan de eigendom niet worden ingeschreven. Geef tot die tijd geen opdrachten die u niet kunt annuleren.",
    },
    "tr.registry": {
      title: "Kadastrale inschrijving (tescil) opvolgen",
      detail:
        "Zodra de gunning onherroepelijk (kesinleşme) en betaald is, stuurt het executiekantoor een officieel verzoek (tescil müzekkeresi) naar het Tapu-kantoor om u als eigenaar in te schrijven (İİK art. 134). Vraag na of deze brief daadwerkelijk is verzonden.",
    },
    "tr.deed": {
      title: "Uw Tapu-inschrijving controleren",
      detail:
        "Controleer na inschrijving via e-Devlet (Tapu Bilgileri): staat u als eigenaar geregistreerd en zijn beslagen (haciz) en hypotheken (ipotek) doorgehaald?",
    },
    "tr.dask": {
      title: "Nieuwe DASK-aardbevingsverzekering afsluiten",
      detail:
        "De verplichte aardbevingsverzekering is wettelijk voorgeschreven (Wet nr. 6305). Sinds 05-09-2026 gaat de polis van de vorige eigenaar niet meer over; deze eindigt bij inschrijving (Algemene Voorwaarden DASK, Staatsblad 21-08-2026/33347). Sluit een eigen polis af; nutsbedrijven vereisen deze vaak voor nieuwe aansluitingen. Vraag bij het Tapu-kantoor na of deze bij inschrijving na een veiling wordt gecontroleerd.",
    },
    "tr.propertyTax": {
      title: "Aangifte onroerendezaakbelasting (emlak vergisi) regelen",
      detail:
        "Eigendomsoverdracht brengt een aangifteplicht bij de gemeente met zich mee (Wet nr. 1319 art. 23); uw belastingplicht begint in het volgende kalenderjaar (art. 33). Vraag bij de gemeente na of de melding van het Tapu-kantoor volstaat en vraag een overzicht op van eventuele openstaande belastingen op het object.",
    },
    "tr.eviction": {
      title: "Ontruiming via het executiekantoor",
      detail:
        "Als de schuldenaar of een bewoner zonder geldige titel in het pand verblijft, betekent het executiekantoor op uw verzoek een ontruimingsbevel met een termijn van 15 dagen, gevolgd door gedwongen ontruiming (İİK art. 135/2). Huurders met een officieel gedateerd huurcontract van vóór het beslag genieten bescherming (zie Huurders). Stel uw verzoek niet uit.",
    },
    "tr.tenant": {
      title: "Huurders: de huurovereenkomst gaat op u over",
      detail:
        "De nieuwe eigenaar treedt in de plaats van de verhuurder (TBK art. 310). Wilt u opzeggen wegens eigen gebruik, dan moet u de huurder binnen één maand na verkrijging schriftelijk informeren en kunt u op zijn vroegst na zes maanden een ontruimingsvordering instellen (TBK art. 351). Stem met een advocaat af welke datum bij een veiling als verkrijgingsdatum geldt — deze lijst rekent behoudend vanaf de veilingdatum.",
    },
    "tr.handover": {
      title: "Oplevering vastleggen",
      detail:
        "Sleutels, meterstanden en staat van het pand met gedateerde foto's. Zet elektriciteit, water en gas (abonelik) op uw naam en vervang de sloten.",
    },
    "tr.inspect": {
      title: "Staat opnemen en renovatie plannen",
      detail:
        "Vergelijk de werkelijke staat met het taxatierapport (kıymet takdir raporu) en vraag offertes op voordat u opdrachten verstrekt.",
    },
    "tr.permits": {
      title: "Vergunningen voor verbouwingen",
      detail:
        "Voor verbouwingen kan een bouwvergunning vereist zijn (yapı ruhsatı, Wet nr. 3194 İmar Kanunu art. 21). Informeer vóór aanvang bij de gemeente.",
    },
    "tr.condo": {
      title: "Gebouwbeheer informeren",
      detail:
        "Bij appartementsrechten: meld u bij het gebouwbeheer (yönetim) en vraag de maandelijkse bijdrage (aidat) en het beheerreglement (yönetim planı, Wet nr. 634 Kat Mülkiyeti Kanunu) op.",
    },
  },
};
