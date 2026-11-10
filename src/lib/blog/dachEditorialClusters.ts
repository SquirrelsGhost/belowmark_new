import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";
import { BlogArticleLangEntry, BlogClusterItem, BlogLang } from "@/types/blog.types";

function makeEntry(
  lang: BlogLang,
  slug: string,
  title: string,
  excerpt: string,
  focusKeyword: string,
  takeaways: string[],
  sections: Array<{ heading: string; paragraphs: string[] }>,
  faq: Array<{ q: string; a: string }>,
): BlogArticleLangEntry {
  const url = lang === "de" ? `/blog/${slug}` : `/${lang}/blog/${slug}`;
  return {
    title,
    slug,
    url,
    fullUrl: `${BELOWMARK_ORIGIN}${url}`,
    excerpt,
    readingTimeMin: 7,
    keywordsCount: 10,
    faqCount: faq.length,
    hasFullBody: true,
    focusKeyword,
    takeaways,
    sections,
    faq,
  };
}

export const DACH_EDITORIAL_CLUSTERS: readonly BlogClusterItem[] = [
  {
    clusterKey: "belowmark-oesterreich-ediktsdatei-vadium-eo-leitfaden",
    siteId: "belowmark",
    siteDomain: "belowmark.com",
    topicKey: "oesterreich-ediktsdatei-geringstes-gebot-vadium",
    category: "real-estate",
    dayKey: "2026-11-10",
    publishedAt: "2026-11-10T08:15:00.000Z",
    generationProvider: "editorial:dach-legal",
    indexNowPingedAt: null,
    languages: {
      de: makeEntry(
        "de",
        "zwangsversteigerung-oesterreich-ediktsdatei-vadium-geringstes-gebot",
        "Zwangsversteigerung Österreich (Ediktsdatei): § 151 EO, 10 % Vadium & Ablauf",
        "Praxisleitfaden für gerichtliche Liegenschaftsversteigerungen in Österreich: Wie das Geringste Gebot (50 % nach § 151 EO), das 10 % Vadium per Sparbuch, das Schätzgutachten und das Überbot (§ 195 EO) an allen Bezirksgerichten funktionieren.",
        "Zwangsversteigerung Österreich Ediktsdatei",
        [
          "In Österreich liegt das gesetzliche Geringste Gebot gemäß § 151 EO grundsätzlich bei der Hälfte (50 %) des gerichtlichen Schätzwerts, sofern das Exekutionsgericht keinen höheren Betrag festsetzt.",
          "Als Sicherheitsleistung (Vadium, § 147 EO) müssen Bieter im Versteigerungstermin 10 % des Schätzwerts vorweisen — zwingend als Sparbuch (Losungswort/Sparurkunde), niemals in bar.",
          "Binnen 14 Tagen nach Bekanntmachung der Zuschlagserteilung ist ein Überbot (§ 195 EO) möglich, wenn das Meistbot unter 75 % des Schätzwerts geblieben ist und der Überbieter mindestens +25 % mehr bietet.",
          "Nebenkosten beim Zuschlag in Österreich: 3,5 % Grunderwerbsteuer (GrESt) plus 1,1 % gerichtliche Grundbuchseintragungsgebühr (zusammen 4,6 %) — Maklerprovision fällt nicht an.",
        ],
        [
          {
            heading: "Ediktsdatei der Justiz & Zuständigkeit der Bezirksgerichte",
            paragraphs: [
              "Sämtliche gerichtlichen Liegenschaftsversteigerungen in den neun österreichischen Bundesländern (Wien, Niederösterreich, Oberösterreich, Steiermark, Tirol, Kärnten, Salzburg, Vorarlberg und Burgenland) werden nach der Exekutionsordnung (EO) über die zuständigen Bezirksgerichte abgewickelt und in der Ediktsdatei des Bundesministeriums für Justiz veröffentlicht.",
              "Entscheidend für Investoren ist das Langgutachten des allgemein beeideten und gerichtlich zertifizierten Sachverständigen (§ 140 EO). Es dokumentiert neben Nutzflächen, Bauzustand und Ertragswert vor allem bestehende Dienstbarkeiten, Miet- und Pachtverhältnisse sowie allfällige Vorränge im Grundbuch (C-Blatt), die ohne Anrechnung auf das Meistbot zu übernehmen sein können.",
            ],
          },
          {
            heading: "Geringstes Gebot (§ 151 EO) und 10 % Vadium (§ 147 EO)",
            paragraphs: [
              "Anders als im deutschen ZVG mit seiner zweistufigen 5/10- und 7/10-Grenze kennt die österreichische Exekutionsordnung in § 151 EO das Geringste Gebot in Höhe des halben Schätzwerts (50 %). Unter diesem Betrag darf der Zuschlag im Versteigerungstermin nicht erteilt werden.",
              "Wer im Verhandlungssaal des Bezirksgerichts mitbieten möchte, muss neben einem amtlichen Lichtbildausweis (und bei Kapitalgesellschaften einem aktuellen Firmenbuchauszug) das Vadium in Höhe von 10 % des vollen Schätzwerts hinterlegen. Bargeld ist nach österreichischem Exekutionsrecht ausgeschlossen — üblich sind vinkulierte oder übertragbare Einlagebücher (Sparurkunden) eines österreichischen Kreditinstituts.",
            ],
          },
          {
            heading: "Die 14-Tage-Überbotsfrist (§ 195 EO) strategisch kalkulieren",
            paragraphs: [
              "Eine Besonderheit des österreichischen Versteigerungsrechts ist das Überbot gemäß §§ 195 ff. EO: Erreicht das höchste Gebot im Termin zwar die 50-%-Schwelle, bleibt aber unter drei Vierteln (75 %) des gerichtlichen Schätzwerts, kann jeder Dritte innerhalb von 14 Tagen ab öffentlicher Bekanntmachung des Zuschlags beim Exekutionsgericht ein Überbot einreichen, das das Meistbot um mindestens ein Viertel (+25 %) übersteigt.",
              "Erfahrene Bieter kalkulieren deshalb genau an der 75-%-Schwelle: Ein Gebot knapp auf oder über 75 % des Schätzwerts schließt spätere Überbote gesetzlich aus und sichert den endgültigen Eigentumserwerb unmittelbar mit Rechtskraft des Zuschlagsbeschlusses.",
            ],
          },
        ],
        [
          {
            q: "Kann man beim Bezirksgericht in Österreich das Vadium in bar oder per Überweisung zahlen?",
            a: "Nein. Gemäß § 147 EO ist Bargeld als Vadium unzulässig. In der Praxis verlangen österreichische Bezirksgerichte eine Sparurkunde (Sparbuch) in Höhe von mindestens 10 % des gerichtlichen Schätzwerts.",
          },
          {
            q: "Wann ist ein Überbot nach § 195 EO ausgeschlossen?",
            a: "Sobald das im Termin erzielte Meistbot mindestens 75 % (drei Viertel) des gerichtlichen Schätzwerts erreicht, ist ein nachträgliches Überbot gesetzlich ausgeschlossen.",
          },
          {
            q: "Wie hoch sind die Kaufnebenkosten bei einer Zwangsversteigerung in Österreich?",
            a: "Es fallen 3,5 % Grunderwerbsteuer vom Meistbot (bzw. der Gegenleistung) sowie 1,1 % Grundbuchseintragungsgebühr an — insgesamt 4,6 % ohne Maklercourtage und ohne Notarpflicht für den Eigentumsübergang.",
          },
        ],
      ),
      en: makeEntry(
        "en",
        "austria-ediktsdatei-foreclosure-auctions-vadium-guide",
        "Property Foreclosure Auctions in Austria (Ediktsdatei): § 151 EO & 10% Vadium Guide",
        "Complete investor guide to Austrian court property auctions (Ediktsdatei): how the 50% minimum bid (§ 151 EO), 10% Vadium savings-book deposit, and the 14-day § 195 EO overbid window work across all 9 federal states.",
        "Austria foreclosure auctions Ediktsdatei",
        [
          "Under § 151 of the Austrian Enforcement Act (EO), the statutory minimum bid (Geringstes Gebot) equals 50% of the court-certified appraisal unless set higher in the auction conditions.",
          "Bidders must bring a 10% security deposit (Vadium, § 147 EO) in the form of an Austrian bank savings passbook (Sparurkunde) — cash is strictly prohibited in Austrian district courts.",
          "If the winning bid stays below 75% of appraised value, third parties have 14 days under § 195 EO to file a binding overbid (Überbot) at least 25% above the hammer price.",
          "Acquisition taxes in Austria total 4.6% (3.5% real estate transfer tax + 1.1% land register fee) with zero estate agent commission.",
        ],
        [
          {
            heading: "How the Austrian Ediktsdatei & District Courts Operate",
            paragraphs: [
              "All judicial real estate foreclosures across Austria's nine federal states (Vienna, Lower Austria, Upper Austria, Styria, Tyrol, Carinthia, Salzburg, Vorarlberg, and Burgenland) are published in the federal Ministry of Justice Ediktsdatei and conducted in person at the local Bezirksgericht.",
              "Each listing includes a court-commissioned valuation report (Langgutachten under § 140 EO) detailing floor areas, structural condition, tenancy agreements, and C-sheet encumbrances in the Austrian Grundbuch.",
            ],
          },
          {
            heading: "50% Minimum Bid, 10% Vadium & the 75% Overbid Shield",
            paragraphs: [
              "Bidding opens at 50% of the appraised value (§ 151 EO). To participate, bidders present photo ID and a 10% Vadium passbook (Sparurkunde). Non-EU buyers must also check state foreign-buyer rules (Grundverkehrsgesetze) in western states such as Tyrol, Salzburg, and Vorarlberg.",
              "Strategically, reaching 75% of the appraised value eliminates the 14-day post-auction overbid risk (§ 195 EO), locking in immediate legal certainty.",
            ],
          },
        ],
        [
          {
            q: "What is the minimum bid at an Austrian court property auction?",
            a: "By statute (§ 151 EO), the minimum acceptable bid is 50% of the court-appraised value unless the court edict specifies a higher threshold.",
          },
          {
            q: "How does the 10% Vadium deposit work in Austria?",
            a: "Bidders must present a bank savings instrument (Sparurkunde) for 10% of the full appraised value at the hearing; cash is not accepted.",
          },
        ],
      ),
      fr: makeEntry(
        "fr",
        "ventes-aux-encheres-autriche-ediktsdatei-vadium-guide",
        "Enchères Immobilières Judiciaires en Autriche (Ediktsdatei) : Seuil 50 % & Vadium",
        "Guide juridique des ventes forcées immobilières en Autriche (Ediktsdatei) : mise à prix minimale de 50 % (§ 151 EO), caution Vadium de 10 % et délai de surenchère de 14 jours (§ 195 EO).",
        "enchères immobilières Autriche Ediktsdatei",
        [
          "En Autriche, l'offre minimale légale (Geringstes Gebot, § 151 EO) est fixée à 50 % de la valeur d'expertise judiciaire.",
          "La consignation (Vadium de 10 %) doit être présentée sous forme de livret d'épargne bancaire autrichien (Sparurkunde), jamais en espèces.",
          "Une surenchère d'au moins +25 % (§ 195 EO) reste ouverte pendant 14 jours si l'adjudication est inférieure à 75 % de l'estimation.",
        ],
        [
          {
            heading: "Fonctionnement du portail officiel Ediktsdatei et des Bezirksgerichte",
            paragraphs: [
              "Toutes les saisies immobilières dans les 9 Länder autrichiens (Vienne, Basse-Autriche, Tyrol, Salzbourg, Styrie, etc.) sont publiées sur la base fédérale Ediktsdatei avec rapport d'expertise complet (§ 140 EO) et extrait du livre foncier (Grundbuch).",
              "Les frais d'acquisition se limitent à 3,5 % de droits de mutation (GrESt) et 1,1 % d'inscription au livre foncier, sans honoraires d'agence.",
            ],
          },
        ],
        [
          {
            q: "Quel est le dépôt de garantie pour enchérir en Autriche ?",
            a: "Un Vadium égal à 10 % de la valeur d'estimation judiciaire est requis à l'audience sous forme de titre d'épargne bancaire (§ 147 EO).",
          },
        ],
      ),
      it: makeEntry(
        "it",
        "aste-giudiziarie-austria-ediktsdatei-vadium-guida",
        "Aste Immobiliari in Austria (Ediktsdatei): Offerta Minima 50% (§ 151 EO) e Vadium",
        "Guida operativa alle esecuzioni immobiliari in Austria (Tirolo, Carinzia, Vienna, Salisburgo): offerta minima al 50%, cauzione Vadium del 10% e regola del rilancio entro 14 giorni (§ 195 EO).",
        "aste giudiziarie Austria Ediktsdatei",
        [
          "Nelle aste giudiziarie austriache l'offerta minima legale (§ 151 EO) è pari al 50% del valore di perizia del tribunale distrettuale (Bezirksgericht).",
          "Per partecipare occorre depositare un Vadium del 10% tramite libretto bancario (Sparurkunde), con esclusione del contante.",
          "Imposte di trasferimento contenute al 4,6% complessivo (3,5% imposta acquisto + 1,1% intavolazione nel Grundbuch).",
        ],
        [
          {
            heading: "Acquistare all'asta in Tirolo, Carinzia e Vienna tramite Ediktsdatei",
            paragraphs: [
              "Il portale federale Ediktsdatei pubblica tutte le perizie giudiziarie (§ 140 EO) dei tribunali austriaci. Se il prezzo di aggiudicazione resta sotto il 75% della stima, entro 14 giorni chiunque può presentare un Überbot (§ 195 EO) maggiorato di almeno il 25%; superare il 75% blinda invece l'aggiudicazione definitiva.",
            ],
          },
        ],
        [
          {
            q: "Quanto ammonta l'offerta minima nelle aste austriache?",
            a: "Ai sensi del § 151 EO l'offerta minima (Geringstes Gebot) è pari al 50% del valore di stima peritale.",
          },
        ],
      ),
      es: makeEntry(
        "es",
        "subastas-judiciales-austria-ediktsdatei-guia",
        "Subastas Judiciales en Austria (Ediktsdatei): Puja Mínima del 50 % y Vadium",
        "Cómo invertir en subastas inmobiliarias de los tribunales austriacos (Ediktsdatei): puja mínima del 50 % (§ 151 EO), fianza Vadium del 10 % e impuestos totales del 4,6 %.",
        "subastas judiciales Austria Ediktsdatei",
        [
          "El umbral mínimo legal en Austria (§ 151 EO) se sitúa en el 50 % de la tasación pericial judicial.",
          "La fianza obligatoria (Vadium) asciende al 10 % del valor de tasación mediante libreta bancaria austriaca.",
          "Los costes fiscales de transmisión suman un 4,6 % (3,5 % GrESt + 1,1 % Registro de la Propiedad).",
        ],
        [
          {
            heading: "Reglas clave de la Ley de Ejecución Austriaca (EO)",
            paragraphs: [
              "A través de la Ediktsdatei oficial del Ministerio de Justicia de Austria se publican los edictos y tasaciones completas de los nueve estados federados. Cuando la puja ganadora no alcanza el 75 % de la tasación, existe un plazo de 14 días para presentar una mejora mínima del 25 % (§ 195 EO).",
            ],
          },
        ],
        [
          {
            q: "¿Qué depósito exige un juzgado en Austria para pujar?",
            a: "Un Vadium del 10 % sobre el valor de tasación judicial (§ 147 EO), constituido mediante título de ahorro bancario.",
          },
        ],
      ),
      tr: makeEntry(
        "tr",
        "avusturya-icra-ihale-ediktsdatei-rehberi",
        "Avusturya İcra İhaleleri (Ediktsdatei): %50 Asgari Teklif (§ 151 EO) ve %10 Vadium",
        "Viyana, Aşağı Avusturya, Tirol ve Steiermark dahil 9 eyalette Avusturya mahkeme gayrimenkul ihalelerine katılım, %50 açılış eşiği, %10 Vadium teminatı ve %4,6 tapu vergisi rehberi.",
        "Avusturya icra ihale Ediktsdatei",
        [
          "Avusturya İcra Kanunu (§ 151 EO) uyarınca gayrimenkul ihalelerinde en düşük kabul edilebilir teklif (Geringstes Gebot) ekspertiz değerinin %50'sidir.",
          "İhaleye katılmak için ekspertiz bedelinin %10'u tutarında Vadium teminatı (§ 147 EO) banka cüzdanı olarak mahkemeye sunulur; nakit kabul edilmez.",
          "Tapu harcı ve alım vergisi toplamı yalnızca %4,6'dır (%3,5 GrESt + %1,1 Grundbuch kaydı).",
        ],
        [
          {
            heading: "Ediktsdatei Sistemi ve § 195 EO 14 Günlük Üst Teklif Kuralı",
            paragraphs: [
              "Avusturya Adalet Bakanlığı'nın resmi Ediktsdatei sisteminde yayımlanan ihalelerde bilirkişi raporu (Langgutachten) tüm daire ve arsa detaylarını içerir. İhale bedeli ekspertiz değerinin %75'inin altında kalırsa 14 gün içinde en az +%25 artışla üst teklif (Überbot) verilebilir; %75 ve üzeri teklifler ise ihaleyi kesinleştirir.",
            ],
          },
        ],
        [
          {
            q: "Avusturya mahkeme ihalesinde teminat oranı nedir?",
            a: "Ekspertiz değerinin %10'u oranında Vadium teminatı zorunludur (§ 147 EO).",
          },
        ],
      ),
    },
  },
  {
    clusterKey: "belowmark-schweiz-shab-schkg-deckungsprinzip-leitfaden",
    siteId: "belowmark",
    siteDomain: "belowmark.com",
    topicKey: "schweiz-shab-schkg-deckungsprinzip-doppelaufruf",
    category: "real-estate",
    dayKey: "2026-11-10",
    publishedAt: "2026-11-10T09:30:00.000Z",
    generationProvider: "editorial:dach-legal",
    indexNowPingedAt: null,
    languages: {
      de: makeEntry(
        "de",
        "zwangsversteigerung-schweiz-shab-deckungsprinzip-schkg-leitfaden",
        "Grundstücksteigerung Schweiz (SHAB): Art. 126 SchKG Deckungsprinzip & Doppelaufruf",
        "Wie betreibungs- und konkursamtliche Grundstücksteigerungen in allen 26 Schweizer Kantonen funktionieren: SHAB-Publikation, Lastenverzeichnis, Deckungsprinzip (Art. 126 SchKG), Doppelaufruf (Art. 142 SchKG) und Bankgarantie.",
        "Zwangsversteigerung Schweiz SHAB SchKG",
        [
          "Alle Schweizer Zwangsversteigerungen werden amtlich im Schweizerischen Handelsamtsblatt (SHAB / FOSC / FUSC) in den Rubriken SB01 (Betreibungsämter) und KK08 (Konkursämter) publiziert.",
          "Es gilt keine starre 50-%-Grenze, sondern das Deckungsprinzip (Art. 126 SchKG): Das Höchstangebot muss sämtliche dem betreibenden Gläubiger im Rang vorgehenden Pfandforderungen übersteigen.",
          "Bei langfristigen Miet- oder Pachtverträgen ohne Zustimmung vorgehender Pfandgläubiger erfolgt ein Doppelaufruf (Art. 142 SchKG) — erst mit Last, bei ungenügender Deckung nochmals ohne die Mietlast.",
          "Vor dem Zuschlag verlangen die Betreibungsämter eine sofortige Bar- oder Bankanzahlung (meist 10 % oder fixer CHF-Betrag per Check einer FINMA-Bank) sowie einen Finanzierungsnachweis.",
        ],
        [
          {
            heading: "Betreibungsamtliche (SB01) vs. Konkursamtliche Steigerung (KK08)",
            paragraphs: [
              "In der Schweiz regeln das Bundesgesetz über Schuldbetreibung und Konkurs (SchKG) sowie die Verordnung über die Zwangsverwertung von Grundstücken (VZG) sämtliche Immobilienversteigerungen in allen 26 Kantonen — von Zürich, Bern und Aargau über die Romandie (Waadt, Genf, Wallis, Freiburg) bis ins Tessin.",
              "Zentrales Dokument vor jedem Gebot sind die Steigerungsbedingungen samt Lastenverzeichnis, die in der Regel zehn Tage vor der Steigerung beim zuständigen Betreibungs- oder Konkursamt öffentlich aufliegen. Darin ist exakt aufgeführt, welche Grundpfandschulden (Schuldbriefe) dem Ersteigerer überbunden werden und welche bar abzuzahlen sind.",
            ],
          },
          {
            heading: "Deckungsprinzip (Art. 126 SchKG) & Doppelaufruf (Art. 142 SchKG)",
            paragraphs: [
              "Anders als in Deutschland oder Österreich gibt es in der Schweiz keine prozentuale Mindestquote vom Schätzwert. Massgebend ist allein Art. 126 SchKG: Der Zuschlag erfolgt an den Meistbietenden, sofern das Angebot den Gesamtbetrag all jener pfandgesicherten Forderungen übersteigt, die der Forderung des betreibenden Gläubigers im Rang vorgehen. Betreibt die erstrangige Hypothekarbank selbst (oder findet eine Konkurssteigerung im 2. Umgang statt), kann ein Zuschlag deutlich unter der amtlichen Schätzung erfolgen.",
              "Wurde auf der Liegenschaft nach Errichtung der Grundpfandrechte ein langfristiger Mietvertrag oder ein Wohnrecht begründet, wendet das Amt auf Verlangen den Doppelaufruf nach Art. 142 SchKG an: Reicht das Gebot beim ersten Aufruf (mit Übernahme des Mietvertrags) nicht zur Deckung der vorgehenden Grundpfandgläubiger aus, wird das Grundstück sofort ein zweites Mal ohne die Last ausgerufen.",
            ],
          },
          {
            heading: "Anzahlung per FINMA-Bankcheck, Lex Koller & Handänderungssteuer",
            paragraphs: [
              "Wer an einer Schweizer Grundstücksteigerung teilnimmt, muss unmittelbar vor dem Zuschlag die in den Steigerungsbedingungen definierte Anzahlung leisten — fast immer mittels Bankcheck einer dem Schweizer Bankengesetz (FINMA) unterstellten Bank oder Vorabüberweisung auf das Konto des Amtes. Ausländische Käufer ohne Niederlassungsbewilligung C müssen bei Wohnimmobilien zusätzlich die Bewilligungspflicht nach BewG (Lex Koller) beachten.",
              "Auch steuerlich unterscheiden sich die 26 Kantone stark: Während Zürich, Schwyz und Zug keine klassische Handänderungssteuer mehr erheben (nur geringe Grundbuchgebühren von ~0,2–0,3 %), fallen in Bern (1,8 %), Waadt (2,2 %), Genf (3,0 %) oder Neuenburg (3,3 %) kantonale Handänderungssteuern an.",
            ],
          },
        ],
        [
          {
            q: "Gibt es in der Schweiz eine 50-%-Mindestgrenze bei Zwangsversteigerungen?",
            a: "Nein. Nach Art. 126 SchKG gilt das Deckungsprinzip: Das Gebot muss lediglich die dem betreibenden Gläubiger im Rang vorgehenden Pfandforderungen decken. Betreibt der 1.-Rang-Gläubiger selbst, sind sehr tiefe Einstiegspreise möglich.",
          },
          {
            q: "Wie bezahlt man die Anzahlung beim Schweizer Betreibungsamt?",
            a: "Gemäss den jeweiligen Steigerungsbedingungen meist durch einen Bankcheck einer Schweizer Bank (FINMA-beaufsichtigt) oder durch rechtzeitige Vorabüberweisung auf das Konto des Betreibungs- bzw. Konkursamtes.",
          },
          {
            q: "Wo werden alle Termine in der Deutschschweiz, Romandie und im Tessin veröffentlicht?",
            a: "Zentral im Schweizerischen Handelsamtsblatt (SHAB / FOSC / FUSC) sowie in den kantonalen Amtsblättern — auf Belowmark dreisprachig mit kantonalem Gebührenrechner aufbereitet.",
          },
        ],
      ),
      fr: makeEntry(
        "fr",
        "ventes-aux-encheres-suisse-fosc-lp-principe-couverture-guide",
        "Ventes aux Enchères en Suisse (FOSC / LP) : Art. 126 LP, Double Mise à Prix & Caution",
        "Guide complet des ventes aux enchères forcées d'immeubles en Suisse romande (Vaud, Genève, Valais, Fribourg, Neuchâtel, Jura) et alémanique : publications FOSC/SHAB, état des charges, art. 126 LP et garantie bancaire.",
        "ventes aux enchères Suisse FOSC Office des poursuites",
        [
          "Toutes les réalisations forcées d'immeubles des 26 cantons sont publiées dans la Feuille officielle suisse du commerce (FOSC / SHAB) par les Offices des poursuites (SB01) et des faillites (KK08).",
          "Le principe de couverture (art. 126 LP) remplace tout seuil fixe : l'adjudication est prononcée dès que l'offre couvre les créances garanties par gage préférables à celle du créancier poursuivant.",
          "La double mise à prix (art. 142 LP) permet d'adjuger un bien libre d'un bail postérieur si l'offre avec charge ne couvre pas le créancier gagiste antérieur.",
          "Un acompte immédiat (chèque d'une banque suisse autorisée FINMA ou virement préalable) ainsi qu'une attestation de financement sont exigés selon les conditions de vente.",
        ],
        [
          {
            heading: "Conditions de vente et État des charges auprès de l'Office des poursuites",
            paragraphs: [
              "En Suisse romande (Genève, Lausanne/Vaud, Sion/Valais, Fribourg, Neuchâtel, Delémont/Jura) comme dans toute la Confédération, la vente aux enchères est régie par la Loi fédérale sur la poursuite pour dettes et la faillite (LP) et l'ORFI. Dix jours au moins avant l'enchère, les conditions de vente et l'état des charges sont déposés à l'Office.",
              "L'état des charges indique précisément quelles cédules hypothécaires sont déléguées à l'adjudicataire et quel montant doit être réglé au comptant.",
            ],
          },
          {
            heading: "Principe de couverture (art. 126 LP), Double mise à prix (art. 142 LP) & Droits de mutation",
            paragraphs: [
              "Lorsque le créancier poursuivant détient le gage de premier rang, le seuil minimal de couverture se réduit aux frais d'administration et de réalisation, ouvrant de fortes décotes par rapport à l'estimation officielle de l'Office.",
              "Côté fiscalité cantonale, les droits de mutation varient fortement d'un canton à l'autre : environ 2,2 % dans le canton de Vaud, 3,0 % à Genève, 3,3 % à Neuchâtel, 1,5 % en Valais et à Fribourg, contre ~0,2 % à Zurich.",
            ],
          },
        ],
        [
          {
            q: "Comment fonctionne le principe de couverture de l'article 126 LP en Suisse ?",
            a: "L'immeuble est adjugé au plus offrant si l'offre dépasse la somme des créances garanties par gage d'un rang antérieur à celui du créancier poursuivant.",
          },
          {
            q: "Quel acompte faut-il présenter lors d'une vente d'un Office des poursuites ?",
            a: "Les conditions de vente exigent généralement un acompte de 10 % (ou un montant forfaitaire en CHF) remis par chèque d'une banque suisse soumise à la FINMA ou viré d'avance sur le compte de l'Office.",
          },
        ],
      ),
      it: makeEntry(
        "it",
        "aste-immobiliari-svizzera-fusc-lef-ticino-guida",
        "Aste Immobiliari in Svizzera e Ticino (FUSC / LEF): Art. 126 LEF e Doppio Incanto",
        "Guida pratica agli incanti immobiliari degli Uffici di esecuzione e fallimenti in Ticino (Lugano, Locarno, Bellinzona, Mendrisio) e nei 26 Cantoni svizzeri: FUSC/SHAB, elenco oneri, art. 126 LEF e cauzione bancaria.",
        "aste immobiliari Svizzera Ticino FUSC LEF",
        [
          "Tutti gli incanti forzati di fondi e proprietà per piani (PPP) in Ticino e nei Grigioni sono pubblicati nel Foglio ufficiale svizzero di commercio (FUSC / SHAB).",
          "In base al principio di copertura (art. 126 LEF), il fondo viene aggiudicato se l'offerta supera i crediti pignoratizi di grado poziore rispetto al creditore procedente.",
          "Il doppio incanto (art. 142 LEF) tutela i creditori ipotecari anteriori rispetto a contratti di locazione o servitù iscritti successivamente.",
          "La cauzione (assegno di una banca svizzera vigilata FINMA o bonifico anticipato all'Ufficio) va predisposta rigorosamente secondo le condizioni d'incanto.",
        ],
        [
          {
            heading: "Come funzionano gli incanti degli Uffici d'esecuzione e fallimenti in Ticino",
            paragraphs: [
              "Il Canton Ticino è tradizionalmente uno dei mercati più attivi della Confederazione per numero di incanti immobiliari pubblicati nel FUSC (appartamenti di vacanza, case unifamiliari e proprietà per piani tra Lugano, Locarno, Mendrisio e Bellinzona).",
              "Prima dell'asta è fondamentale esaminare la perizia ufficiale, le condizioni d'incanto e l'elenco degli oneri (cartelle ipotecarie trasferite o da estinguere), oltre a verificare eventuali restrizioni LAFE (Lex Koller) per gli acquirenti residenti all'estero.",
            ],
          },
        ],
        [
          {
            q: "Esiste un'offerta minima fissa del 75% nelle aste svizzere come in Italia?",
            a: "No. In Svizzera non si applica il 75% italiano ma il principio di copertura dell'art. 126 LEF: basta superare i crediti ipotecari di grado precedente al creditore istante.",
          },
          {
            q: "Qual è l'imposta di trapasso in Canton Ticino per un acquisto all'asta?",
            a: "Tra imposta di trapasso e tassa d'iscrizione a Registro fondiario, in Ticino l'incidenza ordinaria si colloca intorno all'1,1% – 1,5% del prezzo di aggiudicazione.",
          },
        ],
      ),
      en: makeEntry(
        "en",
        "switzerland-shab-foreclosure-auctions-schkg-guide",
        "Swiss Property Foreclosure Auctions (SHAB / FOSC): Art. 126 SchKG & Canton Guide",
        "Investor guide to Swiss debt-enforcement and bankruptcy real estate auctions across all 26 cantons (Zurich, Geneva, Vaud, Ticino, Zug): SHAB notices, Art. 126 SchKG coverage rule, Lex Koller, and FINMA bank guarantees.",
        "Switzerland property foreclosure auctions SHAB",
        [
          "All forced real estate auctions across Switzerland's 26 cantons are published officially in the Swiss Official Gazette of Commerce (SHAB / FOSC / FUSC).",
          "Under Art. 126 SchKG (Coverage Principle), there is no fixed percentage floor — the winning bid simply needs to exceed prior-ranking mortgage claims ahead of the enforcing creditor.",
          "Bidders must provide an immediate down payment via a FINMA-licensed Swiss bank cheque or advance wire transfer to the local Betreibungsamt / Konkursamt.",
        ],
        [
          {
            heading: "Understanding Swiss SHAB Auctions, Double Call (Art. 142 SchKG) & Lex Koller",
            paragraphs: [
              "Swiss auctions are conducted by municipal or district Debt Enforcement Offices (Betreibungsämter) and Bankruptcy Offices (Konkursämter). Ten days prior to the auction, the schedule of encumbrances (Lastenverzeichnis) and auction terms are opened for inspection.",
              "Cantonal transfer taxes range from ~0.2% in Zurich and Zug to 2.2% in Vaud and 3.0% in Geneva. Non-resident foreign buyers acquiring residential property must verify Lex Koller (BewG) quota rules before bidding.",
            ],
          },
        ],
        [
          {
            q: "How are Swiss foreclosure auctions priced without a 50% statutory minimum?",
            a: "When a first-ranking mortgage bank enforces its claim (or in a second bankruptcy auction), the minimum coverage threshold can drop to administrative costs alone, enabling substantial discounts below official valuation.",
          },
        ],
      ),
      es: makeEntry(
        "es",
        "subastas-inmobiliarias-suiza-shab-schkg-guia",
        "Subastas Inmobiliarias en Suiza (SHAB / FOSC): Principio de Cobertura Art. 126 SchKG",
        "Cómo funcionan las subastas forzosas de inmuebles en los 26 cantones de Suiza (Zúrich, Ginebra, Vaud, Tesino): boletín oficial SHAB, principio de cobertura Art. 126 SchKG y garantía bancaria suiza.",
        "subastas inmobiliarias Suiza SHAB",
        [
          "Todas las subastas de las oficinas de ejecución y quiebras en Suiza se publican oficialmente en el boletín SHAB / FOSC / FUSC en CHF.",
          "Rige el principio de cobertura (Art. 126 SchKG): basta superar las cargas hipotecarias de rango preferente al acreedor ejecutante.",
          "Los impuestos cantonales de transmisión oscilan entre el 0,2 % en Zúrich/Zug y el 3,0 % en Ginebra.",
        ],
        [
          {
            heading: "Condiciones de subasta y cheque bancario FINMA en Suiza",
            paragraphs: [
              "Para participar en una subasta cantonal suiza es imprescindible revisar el pliego de condiciones (Steigerungsbedingungen) y aportar la garantía inicial mediante transferencia previa o cheque emitido por un banco suizo supervisado por FINMA.",
            ],
          },
        ],
        [
          {
            q: "¿Dónde se publican las subastas judiciales de viviendas en Suiza?",
            a: "En el Boletín Oficial Suizo de Comercio (SHAB / FOSC / FUSC), indexado diariamente en alemán, francés e italiano en Belowmark.",
          },
        ],
      ),
      tr: makeEntry(
        "tr",
        "isvicre-icra-ihale-shab-schkg-rehberi",
        "İsviçre Gayrimenkul İcra İhaleleri (SHAB / SchKG): 26 Kanton ve Art. 126 Kuralları",
        "Zürih, Cenevre, Vaud, Basel ve Ticino dahil İsviçre'nin 26 kantonunda resmi SHAB gayrimenkul icra ve iflas ihaleleri, Art. 126 SchKG karşılama ilkesi ve İsviçre banka teminatı rehberi.",
        "İsviçre icra ihale SHAB gayrimenkul",
        [
          "İsviçre'deki tüm icra (Betreibungsamt) ve iflas (Konkursamt) taşınmaz ihaleleri resmi ticaret gazetesi SHAB / FOSC / FUSC üzerinde CHF cinsinden yayımlanır.",
          "Sabit %50 sınırı yerine Art. 126 SchKG Karşılama İlkesi uygulanır: Teklifin takip yapan alacaklıdan önceki rehinleri aşması yeterlidir.",
          "Zürih ve Zug gibi kantonlarda tapu devir maliyeti ~%0,2 seviyesindedir; yabancı yatırımcılar konut alımlarında Lex Koller kurallarını kontrol etmelidir.",
        ],
        [
          {
            heading: "İsviçre SHAB İhalelerine Katılım ve Banka Teminatı",
            paragraphs: [
              "İhale şartnamesinde (Steigerungsbedingungen) belirtilen peşinat tutarı, FINMA denetimindeki bir İsviçre bankası çekiyle veya ihale öncesi İcra Dairesi hesabına havale edilerek tevsik edilir.",
            ],
          },
        ],
        [
          {
            q: "İsviçre'de tapu harcı ve devir vergisi ne kadardır?",
            a: "Kantona göre değişir: Zürih ve Zug'da yaklaşık %0,2 iken Bern'de %1,8, Vaud'da %2,2 ve Cenevre'de %3,0 civarındadır.",
          },
        ],
      ),
    },
  },
];
