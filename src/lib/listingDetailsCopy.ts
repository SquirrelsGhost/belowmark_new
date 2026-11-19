import { LocaleOption } from "@/lib/constants";
import { SegmentKey } from "@/lib/snapshot";

/**
 * Localized UI strings for listing detail panels, galleries, metric chips,
 * and regional groupings across all 10 supported platform locales.
 */

export const SEGMENT_LABELS: Record<LocaleOption, Record<SegmentKey, string>> = {
  de: {
    house: "Haus",
    apartment: "Eigentumswohnung",
    multiFamily: "Mehrfamilien-/Geschäftshaus",
    land: "Grundstück",
    farmland: "Land- & Forstwirtschaft",
    commercial: "Gewerbe",
    other: "Sonstiges",
  },
  tr: {
    house: "Müstakil ev",
    apartment: "Daire",
    multiFamily: "Bina / apartman",
    land: "Arsa",
    farmland: "Tarla ve bahçe",
    commercial: "Ticari",
    other: "Diğer",
  },
  en: {
    house: "House",
    apartment: "Apartment / Flat",
    multiFamily: "Multi-family / Mixed-use",
    land: "Plot of land",
    farmland: "Agricultural & forestry",
    commercial: "Commercial",
    other: "Other",
  },
  it: {
    house: "Casa / Villa",
    apartment: "Appartamento",
    multiFamily: "Palazzina / Plurifamiliare",
    land: "Terreno",
    farmland: "Terreno agricolo / boschivo",
    commercial: "Commerciale / Ufficio",
    other: "Altro",
  },
  es: {
    house: "Casa / Chalet",
    apartment: "Piso / Apartamento",
    multiFamily: "Edificio plurifamiliar / Mixto",
    land: "Solar / Parcela",
    farmland: "Finca rústica / Agrícola y forestal",
    commercial: "Local comercial / Nave",
    other: "Otros",
  },
  fr: {
    house: "Maison individuelle",
    apartment: "Appartement",
    multiFamily: "Immeuble de rapport / Mixte",
    land: "Terrain à bâtir",
    farmland: "Terres agricoles & forestières",
    commercial: "Local commercial / Bureaux",
    other: "Autre",
  },
  pl: {
    house: "Dom jednorodzinny",
    apartment: "Lokal mieszkalny",
    multiFamily: "Kamienica / budynek wielorodzinny",
    land: "Działka gruntowa",
    farmland: "Nieruchomość rolna i leśna",
    commercial: "Lokal użytkowy / komercyjny",
    other: "Inna nieruchomość",
  },
  cs: {
    house: "Rodinný dům",
    apartment: "Bytová jednotka",
    multiFamily: "Činžovní / smíšený dům",
    land: "Pozemek / parcela",
    farmland: "Zemědělská půda a les",
    commercial: "Komerční objekt",
    other: "Ostatní",
  },
  nl: {
    house: "Woning",
    apartment: "Appartement",
    multiFamily: "Beleggingspand / Gemengd",
    land: "Bouwkavel / Perceel",
    farmland: "Agrarisch & bosgrond",
    commercial: "Bedrijfsruimte",
    other: "Overig",
  },
  sv: {
    house: "Småhus / Villa",
    apartment: "Bostadsrätt / Lägenhet",
    multiFamily: "Flerbostads- / Hyresfastighet",
    land: "Tomtmark",
    farmland: "Skogs- & lantbruk",
    commercial: "Kommersiell fastighet",
    other: "Övrigt",
  },
};

export function getLocalizedSegmentLabel(segment: SegmentKey, locale: LocaleOption): string {
  const map = SEGMENT_LABELS[locale] ?? SEGMENT_LABELS.en;
  return map[segment] ?? map.other;
}

export interface OfficialDetailsCopy {
  title: string;
  description: string;
  area: string;
  meta: string;
  grundbuch: string;
  proceeding: string;
  hearingPlace: string;
  zoning: string;
  creditor: string;
  living: string;
  net: string;
  usable: string;
  land: string;
  pricePerM2: string;
  entryPerM2: string;
  rooms: string;
  floor: string;
  yearBuilt: string;
  unitNo: string;
  arsaPayi: string;
  ownershipShare: string;
  sourcePrefix: string;
}

export const OFFICIAL_DETAILS_COPY: Record<LocaleOption, OfficialDetailsCopy> = {
  de: {
    title: "Amtliche Bekanntmachung, Flächen & Gerichtsdaten",
    description: "Amtliche Objektbeschreibung",
    area: "Flächenangaben & Richtwerte / m²",
    meta: "Objektmerkmale & Ausstattung",
    grundbuch: "Grundbuch & Flurstück",
    proceeding: "Art der Versteigerung",
    hearingPlace: "Versteigerungsort & Saal",
    zoning: "Bauplanungsrecht",
    creditor: "Gläubiger / Ansprechpartner",
    living: "Wohnfläche",
    net: "Nettofläche",
    usable: "Nutz-/Gewerbefläche",
    land: "Grundstücksfläche",
    pricePerM2: "Verkehrswert / m²",
    entryPerM2: "5/10-Grenze / m²",
    rooms: "Zimmer",
    floor: "Etage",
    yearBuilt: "Baujahr",
    unitNo: "Einheit Nr.",
    arsaPayi: "Miteigentumsanteil",
    ownershipShare: "Eigentumsanteil",
    sourcePrefix: "Direktabruf",
  },
  tr: {
    title: "Resmî İlan, Yüzölçümü & Tapu Detayları",
    description: "Taşınmaz & Bilirkişi Özeti",
    area: "Yüzölçümü & m² Değerleri",
    meta: "Bağımsız Bölüm & Yapı Bilgileri",
    grundbuch: "Tapu / Ada & Parsel",
    proceeding: "Satış Türü",
    hearingPlace: "İhale Mecrası",
    zoning: "İmar Durumu",
    creditor: "Alacaklı / Kurum",
    living: "Brüt / Bina Alanı",
    net: "Net Alan",
    usable: "Kullanım Alanı",
    land: "Arsa Yüzölçümü",
    pricePerM2: "Muhammen / m²",
    entryPerM2: "Başlangıç / m²",
    rooms: "Oda Sayısı",
    floor: "Bulunduğu Kat",
    yearBuilt: "Yapım Yılı",
    unitNo: "Bağımsız Bölüm No",
    arsaPayi: "Arsa Payı",
    ownershipShare: "Hisse Oranı",
    sourcePrefix: "Kaynak",
  },
  en: {
    title: "Official Notice, Floor Areas & Court Details",
    description: "Official Property Description",
    area: "Floor Areas & Price / m²",
    meta: "Property Specifications",
    grundbuch: "Land Register & Parcel",
    proceeding: "Type of Auction",
    hearingPlace: "Auction Venue",
    zoning: "Zoning & Planning",
    creditor: "Creditor / Contact",
    living: "Living Area",
    net: "Net Area",
    usable: "Usable / Commercial Area",
    land: "Plot Area",
    pricePerM2: "Valuation / m²",
    entryPerM2: "Opening Bid / m²",
    rooms: "Rooms",
    floor: "Floor",
    yearBuilt: "Year Built",
    unitNo: "Unit No.",
    arsaPayi: "Land Share",
    ownershipShare: "Ownership Share",
    sourcePrefix: "Source",
  },
  it: {
    title: "Avviso Ufficiale, Superfici e Dati Tribunale",
    description: "Descrizione Ufficiale dell'Immobile",
    area: "Superfici e Valore / m²",
    meta: "Caratteristiche dell'Immobile",
    grundbuch: "Catasto e Dati Tavolari",
    proceeding: "Tipo di Vendita",
    hearingPlace: "Luogo dell'Asta",
    zoning: "Destinazione Urbanistica",
    creditor: "Creditore / Referente",
    living: "Superficie Abitabile",
    net: "Superficie Netta",
    usable: "Superficie Commerciale / Utile",
    land: "Superficie Terreno",
    pricePerM2: "Valore di Stima / m²",
    entryPerM2: "Offerta Minima / m²",
    rooms: "Locali",
    floor: "Piano",
    yearBuilt: "Anno di Costruzione",
    unitNo: "Unità N.",
    arsaPayi: "Quota Millesimale",
    ownershipShare: "Quota di Proprietà",
    sourcePrefix: "Fonte",
  },
  es: {
    title: "Edicto Oficial, Superficies y Datos Judiciales",
    description: "Descripción Oficial del Inmueble",
    area: "Superficies y Valor / m²",
    meta: "Características del Inmueble",
    grundbuch: "Registro de la Propiedad y Catastro",
    proceeding: "Tipo de Subasta",
    hearingPlace: "Lugar / Portal de Subasta",
    zoning: "Clasificación Urbanística",
    creditor: "Acreedor / Contacto",
    living: "Superficie Construida",
    net: "Superficie Útil",
    usable: "Superficie Comercial",
    land: "Superficie de Parcela",
    pricePerM2: "Valor de Tasación / m²",
    entryPerM2: "Puja Mínima / m²",
    rooms: "Habitaciones",
    floor: "Planta",
    yearBuilt: "Año de Construcción",
    unitNo: "Unidad N.º",
    arsaPayi: "Cuota de Participación",
    ownershipShare: "Cuota de Propiedad",
    sourcePrefix: "Fuente",
  },
  fr: {
    title: "Annonce Officielle, Surfaces & Données Judiciaires",
    description: "Description Officielle du Bien",
    area: "Surfaces & Prix / m²",
    meta: "Caractéristiques du Bien",
    grundbuch: "Cadastre & Livre Foncier",
    proceeding: "Type de Vente",
    hearingPlace: "Lieu d'Audience",
    zoning: "Urbanisme",
    creditor: "Créancier / Contact",
    living: "Surface Habitable",
    net: "Surface Nette",
    usable: "Surface Utile / Commerciale",
    land: "Surface du Terrain",
    pricePerM2: "Estimation / m²",
    entryPerM2: "Mise à Prix / m²",
    rooms: "Pièces",
    floor: "Étage",
    yearBuilt: "Année de Construction",
    unitNo: "Lot N°",
    arsaPayi: "Tantièmes",
    ownershipShare: "Quote-part",
    sourcePrefix: "Source",
  },
  pl: {
    title: "Obwieszczenie, Powierzchnie i Dane Sądowe",
    description: "Oficjalny Opis Nieruchomości",
    area: "Powierzchnie i Wartość / m²",
    meta: "Parametry Nieruchomości",
    grundbuch: "Księga Wieczysta i Działka",
    proceeding: "Rodzaj Licytacji",
    hearingPlace: "Miejsce Licytacji",
    zoning: "Przeznaczenie (MPZP)",
    creditor: "Wierzyciel / Kontakt",
    living: "Powierzchnia Użytkowa",
    net: "Powierzchnia Netto",
    usable: "Powierzchnia Komercyjna",
    land: "Powierzchnia Działki",
    pricePerM2: "Oszacowanie / m²",
    entryPerM2: "Cena Wywołania / m²",
    rooms: "Pokoje",
    floor: "Piętro",
    yearBuilt: "Rok Budowy",
    unitNo: "Lokal Nr",
    arsaPayi: "Udział w Gruncie",
    ownershipShare: "Udział Własności",
    sourcePrefix: "Źródło",
  },
  cs: {
    title: "Úřední Vyhláška, Plochy a Soudní Údaje",
    description: "Úřední Popis Nemovitosti",
    area: "Plochy a Cena / m²",
    meta: "Parametry Nemovitosti",
    grundbuch: "Katastr Nemovitostí a Parcela",
    proceeding: "Typ Dražby",
    hearingPlace: "Místo Dražby",
    zoning: "Územní Plán",
    creditor: "Věřitel / Kontakt",
    living: "Obytná Plocha",
    net: "Čistá Plocha",
    usable: "Užitná / Komerční Plocha",
    land: "Plocha Pozemku",
    pricePerM2: "Odhadní Cena / m²",
    entryPerM2: "Nejnižší Podání / m²",
    rooms: "Pokoje",
    floor: "Podlaží",
    yearBuilt: "Rok Výstavby",
    unitNo: "Jednotka č.",
    arsaPayi: "Spoluvlastnický Podíl",
    ownershipShare: "Vlastnický Podíl",
    sourcePrefix: "Zdroj",
  },
  nl: {
    title: "Officiële Aankondiging, Oppervlakten & Gegevens",
    description: "Officiële Objectomschrijving",
    area: "Oppervlakten & Prijs / m²",
    meta: "Objectkenmerken",
    grundbuch: "Kadaster & Perceel",
    proceeding: "Soort Veiling",
    hearingPlace: "Veilinglocatie",
    zoning: "Bestemmingsplan",
    creditor: "Schuldeiser / Contact",
    living: "Woonoppervlakte",
    net: "Netto-oppervlakte",
    usable: "Gebruiks-/Bedrijfsoppervlakte",
    land: "Perceeloppervlakte",
    pricePerM2: "Taxatiewaarde / m²",
    entryPerM2: "Inzetprijs / m²",
    rooms: "Kamers",
    floor: "Verdieping",
    yearBuilt: "Bouwjaar",
    unitNo: "Eenheid Nr.",
    arsaPayi: "Aandeel in Grond",
    ownershipShare: "Eigendomsaandeel",
    sourcePrefix: "Bron",
  },
  sv: {
    title: "Officiell Kungörelse, Ytor & Myndighetsdata",
    description: "Officiell Objektbeskrivning",
    area: "Ytor & Pris / m²",
    meta: "Objektegenskaper",
    grundbuch: "Fastighetsregister & Beteckning",
    proceeding: "Auktionstyp",
    hearingPlace: "Auktionsplats",
    zoning: "Detaljplan",
    creditor: "Borgenär / Kontakt",
    living: "Boarea",
    net: "Nettoarea",
    usable: "Biarea / Lokalyta",
    land: "Tomtarea",
    pricePerM2: "Marknadsvärde / m²",
    entryPerM2: "Utgångspris / m²",
    rooms: "Rum",
    floor: "Våning",
    yearBuilt: "Byggår",
    unitNo: "Lägenhetsnr",
    arsaPayi: "Andelstal",
    ownershipShare: "Ägarandel",
    sourcePrefix: "Källa",
  },
};

export interface PhotoGalleryCopy {
  title: string;
  badge: string;
  fullscreen: string;
  prevPhoto: string;
  nextPhoto: string;
  source: string;
  photoTab: (count: number) => string;
  aerialTab: string;
  aerialHint: string;
}

export const PHOTO_GALLERY_COPY: Record<LocaleOption, PhotoGalleryCopy> = {
  de: {
    title: "Objektfoto",
    badge: "AMTLICHES OBJEKTFOTO",
    fullscreen: "Vollbild ↗",
    prevPhoto: "Vorheriges Foto",
    nextPhoto: "Nächstes Foto",
    source: "Quelle: Gutachten / Exposé / Justizportal",
    photoTab: (n) => `Objektfotos (${n})`,
    aerialTab: "Luftbild & Satellit",
    aerialHint: "Orthofoto des Zielgebiets · Klick öffnet Google Street View & 3D-Ansicht",
  },
  tr: {
    title: "Taşınmaz fotoğrafı",
    badge: "RESMÎ DOSYA FOTOĞRAFI",
    fullscreen: "Tam Ekran ↗",
    prevPhoto: "Önceki fotoğraf",
    nextPhoto: "Sonraki fotoğraf",
    source: "Kaynak: Resmî İhale Dosyası",
    photoTab: (n) => `Taşınmaz Fotoğrafları (${n})`,
    aerialTab: "Uydu & Hava Görünümü",
    aerialHint: "Taşınmaz çevresi uydu görünümü · Tıklayınca Sokak Görünümü açılır",
  },
  en: {
    title: "Property photo",
    badge: "OFFICIAL PROPERTY PHOTO",
    fullscreen: "Full screen ↗",
    prevPhoto: "Previous photo",
    nextPhoto: "Next photo",
    source: "Source: Official Appraisal / Auction File",
    photoTab: (n) => `Property Photos (${n})`,
    aerialTab: "Aerial & Satellite",
    aerialHint: "Aerial view of the area · Click to open Google Street View & 3D",
  },
  it: {
    title: "Foto immobile",
    badge: "FOTO UFFICIALE DEL LOTTO",
    fullscreen: "Schermo intero ↗",
    prevPhoto: "Foto precedente",
    nextPhoto: "Foto successiva",
    source: "Fonte: Perizia / Portale Aste",
    photoTab: (n) => `Foto Immobile (${n})`,
    aerialTab: "Vista Aerea & Satellite",
    aerialHint: "Vista satellitare dell'area · Clicca per aprire Google Street View & 3D",
  },
  es: {
    title: "Foto del inmueble",
    badge: "FOTO OFICIAL DEL EXPEDIENTE",
    fullscreen: "Pantalla completa ↗",
    prevPhoto: "Foto anterior",
    nextPhoto: "Foto siguiente",
    source: "Fuente: Edicto / Tasación Oficial",
    photoTab: (n) => `Fotos del Inmueble (${n})`,
    aerialTab: "Vista Aérea y Satélite",
    aerialHint: "Vista aérea de la zona · Haz clic para abrir Google Street View y 3D",
  },
  fr: {
    title: "Photo du bien",
    badge: "PHOTO OFFICIELLE DU DOSSIER",
    fullscreen: "Plein écran ↗",
    prevPhoto: "Photo précédente",
    nextPhoto: "Photo suivante",
    source: "Source : Cahier des Ventes / Portail Officiel",
    photoTab: (n) => `Photos du Bien (${n})`,
    aerialTab: "Vue Aérienne & Satellite",
    aerialHint: "Vue satellite du secteur · Cliquez pour ouvrir Google Street View & 3D",
  },
  pl: {
    title: "Zdjęcie nieruchomości",
    badge: "OFICJALNE ZDJĘCIE Z AKT",
    fullscreen: "Pełny ekran ↗",
    prevPhoto: "Poprzednie zdjęcie",
    nextPhoto: "Następne zdjęcie",
    source: "Źródło: Operat / Portal Licytacji",
    photoTab: (n) => `Zdjęcia Nieruchomości (${n})`,
    aerialTab: "Zdjęcie Lotnicze i Satelita",
    aerialHint: "Widok satelitarny okolicy · Kliknij, aby otworzyć Google Street View i 3D",
  },
  cs: {
    title: "Foto nemovitosti",
    badge: "ÚŘEDNÍ FOTO ZE SPISU",
    fullscreen: "Celá obrazovka ↗",
    prevPhoto: "Předchozí foto",
    nextPhoto: "Další foto",
    source: "Zdroj: Znalecký posudek / Dražební portál",
    photoTab: (n) => `Fotografie (${n})`,
    aerialTab: "Letecký a Satelitní Snímek",
    aerialHint: "Satelitní pohled na okolí · Kliknutím otevřete Google Street View a 3D",
  },
  nl: {
    title: "Objectfoto",
    badge: "OFFICIËLE OBJECTFOTO",
    fullscreen: "Volledig scherm ↗",
    prevPhoto: "Vorige foto",
    nextPhoto: "Volgende foto",
    source: "Bron: Taxatierapport / Veilingportaal",
    photoTab: (n) => `Objectfoto's (${n})`,
    aerialTab: "Luchtfoto & Satelliet",
    aerialHint: "Satellietbeeld van de omgeving · Klik voor Google Street View & 3D",
  },
  sv: {
    title: "Objektfoto",
    badge: "OFFICIELLT OBJEKTFOTO",
    fullscreen: "Helskärm ↗",
    prevPhoto: "Föregående bild",
    nextPhoto: "Nästa bild",
    source: "Källa: Värderingsutlåtande / Auktionsportal",
    photoTab: (n) => `Objektfoton (${n})`,
    aerialTab: "Flygbild & Satellit",
    aerialHint: "Satellitvy över området · Klicka för Google Street View & 3D",
  },
};

export interface DirectAnalyzeCopy {
  title: string;
  lead: string;
  button: (label: string) => string;
}

export const DIRECT_ANALYZE_COPY: Record<LocaleOption, DirectAnalyzeCopy> = {
  de: {
    title: "Amtliches Portaldokument mit 1 Klick auswerten",
    lead: "Kein manuelles Herunter- und Hochladen nötig: Das hinterlegte PDF wird direkt vom Justizportal abgerufen und auf Risiken & Kennzahlen geprüft.",
    button: (label) => `⚡ ${label} direkt auswerten`,
  },
  tr: {
    title: "Resmî portal belgesini tek tıkla analiz et",
    lead: "İndirip tekrar yüklemeye gerek yok: mahkeme portalındaki PDF doğrudan sunucuda çekilir ve incelenir.",
    button: (label) => `⚡ ${label} doğrudan analiz et`,
  },
  en: {
    title: "Analyze official portal document in 1 click",
    lead: "No manual download or upload needed: the court portal PDF is fetched directly on the server and checked for risks & key figures.",
    button: (label) => `⚡ Analyze ${label} directly`,
  },
  it: {
    title: "Analizza il documento ufficiale con 1 clic",
    lead: "Nessun download o caricamento manuale necessario: il PDF del portale viene recuperato direttamente sul server e analizzato per rischi e dati chiave.",
    button: (label) => `⚡ Analizza ${label} subito`,
  },
  es: {
    title: "Analizar el documento oficial en 1 clic",
    lead: "Sin descargas ni subidas manuales: el PDF del portal oficial se obtiene directamente en el servidor y se analiza en busca de riesgos y cifras clave.",
    button: (label) => `⚡ Analizar ${label} ahora`,
  },
  fr: {
    title: "Analyser le document officiel en 1 clic",
    lead: "Aucun téléchargement manuel requis : le PDF du portail officiel est récupéré directement sur le serveur et analysé pour les risques et chiffres clés.",
    button: (label) => `⚡ Analyser ${label} directement`,
  },
  pl: {
    title: "Przeanalizuj oficjalny dokument jednym kliknięciem",
    lead: "Bez ręcznego pobierania i wgrywania: plik PDF z portalu sądowego jest pobierany bezpośrednio na serwer i sprawdzany pod kątem ryzyk i kluczowych danych.",
    button: (label) => `⚡ Analizuj ${label} bezpośrednio`,
  },
  cs: {
    title: "Analyzujte úřední dokument na 1 kliknutí",
    lead: "Bez ručního stahování a nahrávání: PDF ze soudního portálu se stáhne přímo na serveru a zkontroluje na rizika a klíčové údaje.",
    button: (label) => `⚡ Analyzovat ${label} přímo`,
  },
  nl: {
    title: "Analyseer het officiële document met 1 klik",
    lead: "Geen handmatig downloaden of uploaden nodig: de PDF van het portaal wordt direct op de server opgehaald en gecontroleerd op risico's en kerncijfers.",
    button: (label) => `⚡ ${label} direct analyseren`,
  },
  sv: {
    title: "Analysera officiellt dokument med 1 klick",
    lead: "Ingen manuell nedladdning behövs: PDF-filen från portalen hämtas direkt på servern och granskas för risker och nyckeltal.",
    button: (label) => `⚡ Analysera ${label} direkt`,
  },
};

export interface RowBadgeCopy {
  photo: string;
  aerial: string;
  confidence: Record<string, string>;
}

export const ROW_BADGE_COPY: Record<LocaleOption, RowBadgeCopy> = {
  de: { photo: "FOTO", aerial: "LUFTBILD", confidence: { belastbar: "belastbar", mittel: "mittel" } },
  tr: { photo: "FOTO", aerial: "UYDU", confidence: { belastbar: "güvenilir", mittel: "orta" } },
  en: { photo: "PHOTO", aerial: "AERIAL", confidence: { belastbar: "solid", mittel: "medium" } },
  it: { photo: "FOTO", aerial: "SATELLITE", confidence: { belastbar: "affidabile", mittel: "medio" } },
  es: { photo: "FOTO", aerial: "SATÉLITE", confidence: { belastbar: "fiable", mittel: "medio" } },
  fr: { photo: "PHOTO", aerial: "AÉRIEN", confidence: { belastbar: "fiable", mittel: "moyen" } },
  pl: { photo: "FOTO", aerial: "SATELITA", confidence: { belastbar: "pewny", mittel: "średni" } },
  cs: { photo: "FOTO", aerial: "SATELIT", confidence: { belastbar: "spolehlivý", mittel: "střední" } },
  nl: { photo: "FOTO", aerial: "LUCHTFOTO", confidence: { belastbar: "betrouwbaar", mittel: "gemiddeld" } },
  sv: { photo: "FOTO", aerial: "FLYGBILD", confidence: { belastbar: "tillförlitlig", mittel: "medel" } },
};

export interface MetricChipCopy {
  living: string;
  building: string;
  net: string;
  usable: string;
  land: string;
  yearBuilt: string;
}

export const METRIC_CHIP_COPY: Record<LocaleOption, MetricChipCopy> = {
  de: { living: "Wfl.", building: "Wohn-/Geb.", net: "Netto", usable: "Nfl.", land: "Grundst.", yearBuilt: "Bj." },
  tr: { living: "Konut", building: "Brüt", net: "Net", usable: "Kullanım", land: "Arsa", yearBuilt: "Yapım" },
  en: { living: "Living", building: "Gross", net: "Net", usable: "Usable", land: "Plot", yearBuilt: "Built" },
  it: { living: "Abit.", building: "Lorda", net: "Netta", usable: "Utile", land: "Terreno", yearBuilt: "Anno" },
  es: { living: "Constr.", building: "Bruta", net: "Útil", usable: "Útil", land: "Parcela", yearBuilt: "Año" },
  fr: { living: "Hab.", building: "Brute", net: "Nette", usable: "Utile", land: "Terrain", yearBuilt: "Const." },
  pl: { living: "Pow.", building: "Brutto", net: "Netto", usable: "Użytk.", land: "Działka", yearBuilt: "Rok" },
  cs: { living: "Obyt.", building: "Hrubá", net: "Čistá", usable: "Užitná", land: "Pozemek", yearBuilt: "Rok" },
  nl: { living: "Woon", building: "Bruto", net: "Netto", usable: "Gebr.", land: "Perceel", yearBuilt: "Bouwj." },
  sv: { living: "Boarea", building: "Brutto", net: "Netto", usable: "Biarea", land: "Tomt", yearBuilt: "Byggår" },
};

export interface RegionGroupCopy {
  AT: string;
  CH: string;
  IT: string;
  ES: string;
  FR: string;
  GB: string;
  DE: string;
}

export const REGION_GROUP_COPY: Record<LocaleOption, RegionGroupCopy> = {
  de: {
    AT: "Österreich (Bundesländer)",
    CH: "Schweiz (Kantone)",
    IT: "Italien (Regionen)",
    ES: "Spanien (Comunidades)",
    FR: "Frankreich (Regionen)",
    GB: "England / UK (Regionen)",
    DE: "Deutschland (Bundesländer)",
  },
  tr: {
    AT: "Avusturya (Eyaletler)",
    CH: "İsviçre (Kantonlar)",
    IT: "İtalya (Bölgeler)",
    ES: "İspanya (Özerk Bölgeler)",
    FR: "Fransa (Bölgeler)",
    GB: "İngiltere / UK (Bölgeler)",
    DE: "Almanya (Eyaletler)",
  },
  en: {
    AT: "Austria (States)",
    CH: "Switzerland (Cantons)",
    IT: "Italy (Regions)",
    ES: "Spain (Autonomous Communities)",
    FR: "France (Regions)",
    GB: "United Kingdom (Regions)",
    DE: "Germany (States)",
  },
  it: {
    AT: "Austria (Stati federali)",
    CH: "Svizzera (Cantoni)",
    IT: "Italia (Regioni)",
    ES: "Spagna (Comunità autonome)",
    FR: "Francia (Regioni)",
    GB: "Regno Unito (Regioni)",
    DE: "Germania (Länder)",
  },
  es: {
    AT: "Austria (Estados federados)",
    CH: "Suiza (Cantones)",
    IT: "Italia (Regiones)",
    ES: "España (Comunidades Autónomas)",
    FR: "Francia (Regiones)",
    GB: "Reino Unido (Regiones)",
    DE: "Alemania (Estados federados)",
  },
  fr: {
    AT: "Autriche (Länder)",
    CH: "Suisse (Cantons)",
    IT: "Italie (Régions)",
    ES: "Espagne (Communautés autonomes)",
    FR: "France (Régions)",
    GB: "Royaume-Uni (Régions)",
    DE: "Allemagne (Länder)",
  },
  pl: {
    AT: "Austria (Kraje związkowe)",
    CH: "Szwajcaria (Kantony)",
    IT: "Włochy (Regiony)",
    ES: "Hiszpania (Wspólnoty autonomiczne)",
    FR: "Francja (Regiony)",
    GB: "Wielka Brytania (Regiony)",
    DE: "Niemcy (Kraje związkowe)",
  },
  cs: {
    AT: "Rakousko (Spolkové země)",
    CH: "Švýcarsko (Kantony)",
    IT: "Itálie (Regiony)",
    ES: "Španělsko (Autonomní společenství)",
    FR: "Francie (Regiony)",
    GB: "Velká Británie (Regiony)",
    DE: "Německo (Spolkové země)",
  },
  nl: {
    AT: "Oostenrijk (Deelstaten)",
    CH: "Zwitserland (Kantons)",
    IT: "Italië (Regio's)",
    ES: "Spanje (Autonome regio's)",
    FR: "Frankrijk (Regio's)",
    GB: "Verenigd Koninkrijk (Regio's)",
    DE: "Duitsland (Deelstaten)",
  },
  sv: {
    AT: "Österrike (Förbundsländer)",
    CH: "Schweiz (Kantoner)",
    IT: "Italien (Regioner)",
    ES: "Spanien (Autonoma regioner)",
    FR: "Frankrike (Regioner)",
    GB: "Storbritannien (Regioner)",
    DE: "Tyskland (Förbundsländer)",
  },
};
