import { PseoLocale } from "@/types/pseo.types";

export interface PublicSearchCopy {
  eyebrow: string;
  title: string;
  lead: string;
  queryLabel: string;
  queryPlaceholder: string;
  typeLabel: string;
  allTypes: string;
  types: {
    house: string;
    apartment: string;
    multiFamily: string;
    land: string;
    commercial: string;
    farmland: string;
  };
  submitLabel: string;
  lockedFiltersLabel: string;
  lockedFilterItems: readonly [string, string, string];
  unlockFiltersCta: string;
  resultsCount: (total: number) => string;
  emptyTitle: string;
  emptyBody: string;
  moreTitle: string;
  moreBody: string;
  moreCta: string;
}

export const PUBLIC_SEARCH_COPY: Record<PseoLocale, PublicSearchCopy> = {
  de: {
    eyebrow: "ÖFFENTLICHE LIVE-SUCHE · 8 LÄNDER · 19.700+ VERFAHREN",
    title: "Zwangsversteigerungen & Gerichtliche Auktionen durchsuchen",
    lead: "Stöbern Sie sofort ohne Anmeldung durch tausende amtlich veröffentlichte Immobilien-Versteigerungen. Für Ihr 1 Gratis-Dossier (inkl. Aktenzeichen, Hausnummer & PDF-Gutachten) klicken Sie einfach auf Ihr Wunschobjekt.",
    queryLabel: "Stadt, PLZ oder Amtsgericht",
    queryPlaceholder: "z. B. Berlin, München, Zürich, Wien, 5020 …",
    typeLabel: "Objektart",
    allTypes: "Alle Objektarten",
    types: {
      house: "Einfamilienhaus / Villa",
      apartment: "Eigentumswohnung",
      multiFamily: "Mehrfamilienhaus",
      land: "Baugrundstück",
      commercial: "Gewerbe / Büro",
      farmland: "Ackerland / Forst",
    },
    submitLabel: "Jetzt filtern →",
    lockedFiltersLabel: "Im Investor-Cockpit zusätzlich freischaltbar:",
    lockedFilterItems: [
      "Nur ohne Wertgrenzen (< 50 %)",
      "Nur mit Original-Gutachten (PDF)",
      "Sortierung nach höchstem Abschlag",
    ],
    unlockFiltersCta: "🎁 Alle Filter + 1 Gratis-Dossier kostenlos öffnen →",
    resultsCount: (n) => `${n.toLocaleString("de-DE")} aktive Verfahren gefunden`,
    emptyTitle: "Keine Verfahren für diesen Filter gefunden",
    emptyBody: "Prüfen Sie die Schreibweise oder wählen Sie oben ein anderes Land bzw. Alle Objektarten.",
    moreTitle: "Alle Seiten, Kartenansicht & E-Mail-Sofort-Alerts freischalten",
    moreBody: "Legen Sie in 20 Sekunden Ihr kostenloses Konto an: Sie erhalten sofort 1 komplettes Gratis-Dossier (ohne Karte) + Such-Alerts für neue Termine.",
    moreCta: "Kostenloses Konto anlegen (inkl. 1 Gratis-Dossier) →",
  },
  tr: {
    eyebrow: "AÇIK CANLI ARAMA · 81 İL · 14.700+ AKTİF İHALE",
    title: "İcradan ve Mahkemeden Satılık Gayrimenkul Arama",
    lead: "Kayıt olmadan binlerce güncel UYAP e-ihale taşınmazını il, ilçe, icra dairesi veya gayrimenkul türüne göre anında filtreleyin. Tam Esas No ve PDF şartname için 1 Ücretsiz Dosya hakkınızı kullanın.",
    queryLabel: "İl, İlçe, Mahalle veya İcra Dairesi",
    queryPlaceholder: "Örn. İstanbul, Çankaya, Bodrum, Ümraniye …",
    typeLabel: "Taşınmaz Türü",
    allTypes: "Tüm Türler",
    types: {
      house: "Müstakil Ev / Villa",
      apartment: "Daire / Konut",
      multiFamily: "Bina / Apartman",
      land: "Arsa",
      commercial: "Dükkan / İşyeri",
      farmland: "Tarla / Bağ / Bahçe",
    },
    submitLabel: "İhaleleri Filtrele →",
    lockedFiltersLabel: "Yatırımcı Panelinde ek olarak açılan filtreler:",
    lockedFilterItems: [
      "Sadece Yüksek İskontolu Fırsatlar",
      "m² Piyasa Karşılaştırmalı Dosyalar",
      "En Yüksek İskonto Sıralaması",
    ],
    unlockFiltersCta: "🎁 Tüm Filtreleri + 1 Ücretsiz Dosyayı Aç →",
    resultsCount: (n) => `${n.toLocaleString("tr-TR")} aktif ihale bulundu`,
    emptyTitle: "Bu filtreye uygun aktif ihale bulunamadı",
    emptyBody: "Arama kelimesini değiştirin veya yukarıdan Tüm Türler seçeneğini işaretleyin.",
    moreTitle: "Tüm Sayfaları, Harita Görünümünü ve Anlık İhale Alarmlarını Açın",
    moreBody: "20 saniyede ücretsiz hesabınızı oluşturun: Kartsız 1 Ücretsiz Dosya hakkı ve yeni ihale bildirimleri anında tanımlanır.",
    moreCta: "Ücretsiz Hesap Oluştur (1 Dosya Hediye) →",
  },
  en: {
    eyebrow: "PUBLIC LIVE SEARCH · 8 COUNTRIES · 19,700+ AUCTION LOTS",
    title: "Search Distressed & Court Property Auctions Live",
    lead: "Browse thousands of official judicial and distressed property auctions across the UK and Europe with no login wall. Click any lot to claim your 1 Free Dossier (exact address, legal pack PDF & AI check).",
    queryLabel: "City, Postcode or Auctioneer",
    queryPlaceholder: "e.g. London, Manchester, Birmingham, SW1 …",
    typeLabel: "Property Type",
    allTypes: "All Property Types",
    types: {
      house: "Houses & Villas",
      apartment: "Flats & Apartments",
      multiFamily: "Multi-Family Blocks",
      land: "Development Land",
      commercial: "Commercial / Retail",
      farmland: "Agricultural Land",
    },
    submitLabel: "Filter Lots →",
    lockedFiltersLabel: "Unlock inside the Investor Workbench:",
    lockedFilterItems: [
      "No-Reserve / Waived-Limit Lots Only",
      "With Legal Pack PDF Attached",
      "Sort by Steepest Market Discount",
    ],
    unlockFiltersCta: "🎁 Unlock All Filters + 1 Free Dossier →",
    resultsCount: (n) => `${n.toLocaleString("en-GB")} active auction lots matched`,
    emptyTitle: "No active lots matched your filter",
    emptyBody: "Try clearing the keyword or switching country/property type above.",
    moreTitle: "Unlock Unlimited Pages, Interactive Map & Instant Email Alerts",
    moreBody: "Create your free account in 20 seconds — includes 1 Free Dossier (no card required) and instant auction alerts.",
    moreCta: "Create Free Account (1 Free Dossier) →",
  },
  it: {
    eyebrow: "RICERCA LIVE APERTA · 8 PAESI · 19.700+ ASTE ATTIVE",
    title: "Motore di Ricerca Aste Giudiziarie Immobiliari (PVP)",
    lead: "Esplora subito senza registrazione migliaia di immobili all'asta per comune, CAP o Tribunale. Clicca su un lotto per sbloccare il tuo 1 Fascicolo Gratis (R.G.E., indirizzo e Perizia PDF).",
    queryLabel: "Comune, CAP o Tribunale",
    queryPlaceholder: "es. Milano, Roma, Napoli, Torino …",
    typeLabel: "Tipologia",
    allTypes: "Tutte le Tipologie",
    types: {
      house: "Casa / Villa",
      apartment: "Appartamento",
      multiFamily: "Palazzina / Stabile",
      land: "Terreno Edificabile",
      commercial: "Locale Commerciale",
      farmland: "Terreno Agricolo",
    },
    submitLabel: "Filtra Aste →",
    lockedFiltersLabel: "Disponibili nel Cockpit Investor:",
    lockedFilterItems: [
      "Solo Ribassi d'Asta (> 25%)",
      "Con Perizia CTU PDF Allegata",
      "Ordina per Massimo Sconto OMI",
    ],
    unlockFiltersCta: "🎁 Sblocca Filtri Pro + 1 Fascicolo Gratis →",
    resultsCount: (n) => `${n.toLocaleString("it-IT")} lotti attivi trovati`,
    emptyTitle: "Nessun lotto trovato per questo filtro",
    emptyBody: "Prova a rimuovere la parola chiave o a selezionare Tutte le Tipologie.",
    moreTitle: "Sblocca Tutte le Pagine, Mappa Interattiva e Avvisi Email",
    moreBody: "Registrati gratis in 20 secondi (senza carta): ricevi subito 1 Fascicolo Gratuito completo.",
    moreCta: "Registrati Gratis (1 Fascicolo Incluso) →",
  },
  es: {
    eyebrow: "BUSCADOR ABIERTO EN VIVO · 8 PAÍSES · 19.700+ SUBASTAS",
    title: "Buscador Abierto de Subastas BOE sin Certificado Digital",
    lead: "Filtra al instante miles de subastas judiciales de viviendas, locales y solares en España y Europa sin registro previo. Haz clic en cualquier lote para abrir tu 1 Expediente Gratis.",
    queryLabel: "Ciudad, Código Postal o Juzgado",
    queryPlaceholder: "ej. Madrid, Sevilla, Málaga, Barcelona, Valencia …",
    typeLabel: "Tipo de Inmueble",
    allTypes: "Todos los Inmuebles",
    types: {
      house: "Casa / Chalet",
      apartment: "Piso / Vivienda",
      multiFamily: "Edificio Completo",
      land: "Solar Urbano",
      commercial: "Local / Nave",
      farmland: "Finca Rústica",
    },
    submitLabel: "Buscar Subastas →",
    lockedFiltersLabel: "Filtros avanzados en el Panel Investor:",
    lockedFilterItems: [
      "Solo Sin Puja Mínima / Gran Descuento",
      "Con Edicto y Cargas PDF",
      "Ordenar por Mayor Descuento",
    ],
    unlockFiltersCta: "🎁 Desbloquear Filtros + 1 Expediente Gratis →",
    resultsCount: (n) => `${n.toLocaleString("es-ES")} subastas activas encontradas`,
    emptyTitle: "No se encontraron subastas con este filtro",
    emptyBody: "Prueba otra ciudad o selecciona Todos los Inmuebles.",
    moreTitle: "Desbloquea Todas las Páginas, Mapa y Alertas BOE por Email",
    moreBody: "Crea tu cuenta gratuita en 20 segundos (sin tarjeta): incluye 1 Expediente Gratis completo.",
    moreCta: "Crear Cuenta Gratis (1 Expediente Incluido) →",
  },
  fr: {
    eyebrow: "RECHERCHE EN DIRECT · 8 PAYS · 19 700+ VENTES AUX ENCHÈRES",
    title: "Rechercher les Ventes aux Enchères Immobilières (Licitor & TJ)",
    lead: "Parcourez librement sans inscription des milliers d'adjudications immobilières par ville, code postal ou Tribunal Judiciaire. Cliquez sur un bien pour ouvrir votre 1 Dossier Gratuit.",
    queryLabel: "Ville, Code Postal ou Tribunal",
    queryPlaceholder: "ex. Paris, Lyon, Marseille, Nice, Bordeaux …",
    typeLabel: "Type de Bien",
    allTypes: "Tous les Biens",
    types: {
      house: "Maison / Villa",
      apartment: "Appartement",
      multiFamily: "Immeuble de Rapport",
      land: "Terrain Constructible",
      commercial: "Local Commercial",
      farmland: "Terrain Agricole",
    },
    submitLabel: "Filtrer →",
    lockedFiltersLabel: "Filtres avancés dans le Cockpit Investor :",
    lockedFilterItems: [
      "Baisse de Mise à Prix Uniquement",
      "Avec Cahier CCV (PDF)",
      "Tri par Plus Forte Décote DVF",
    ],
    unlockFiltersCta: "🎁 Débloquer les Filtres + 1 Dossier Gratuit →",
    resultsCount: (n) => `${n.toLocaleString("fr-FR")} ventes actives trouvées`,
    emptyTitle: "Aucune vente trouvée pour ce filtre",
    emptyBody: "Essayez une autre commune ou sélectionnez Tous les Biens.",
    moreTitle: "Débloquez Toutes les Pages, la Carte et les Alertes E-mail",
    moreBody: "Créez votre compte gratuit en 20 secondes (sans carte) : 1 Dossier Gratuit inclus immédiatement.",
    moreCta: "Créer un Compte Gratuit (1 Dossier Inclus) →",
  },
};
