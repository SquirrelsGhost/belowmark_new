export interface FooterDirectoryUi {
  marketsColumnTitle: string;
  atlasLabel: string;
  atlasHref: string;
  blogHref: string;
  drawerTitle: string;
  drawerBadge: string;
  directoriesHeading: string;
  calculatorsHeading: string;
  regionsHeading: string;
  guidesHeading: string;
}

const EN_UI: FooterDirectoryUi = {
  marketsColumnTitle: "Official Portals",
  atlasLabel: "European Market Atlas",
  atlasHref: "/en/atlas",
  blogHref: "/en/blog",
  drawerTitle: "All 12 Country Directories, Bid Calculators, Regions & Legal Guides",
  drawerBadge: "12 MARKETS · A–Z",
  directoriesHeading: "12 Official Auction Directories",
  calculatorsHeading: "12 Statutory Bid Calculators",
  regionsHeading: "Most Searched States, Cantons, Regions & Cities",
  guidesHeading: "Legal Guides by Language",
};

const LOCALIZED_UI: Record<string, FooterDirectoryUi> = {
  en: EN_UI,
  de: {
    marketsColumnTitle: "Amtliche Register",
    atlasLabel: "Europäischer Markt-Atlas",
    atlasHref: "/atlas",
    blogHref: "/blog",
    drawerTitle: "Alle 12 Länder-Verzeichnisse, Gebotsrechner, Regionen & Rechts-Guides",
    drawerBadge: "12 MÄRKTE · A–Z",
    directoriesHeading: "12 Amtliche Versteigerungsregister",
    calculatorsHeading: "12 Gesetzliche Gebots- & Kostenrechner",
    regionsHeading: "Meistgesuchte Bundesländer, Kantone, Regionen & Metropolen",
    guidesHeading: "Rechts-Ratgeber nach Sprache",
  },
  tr: {
    marketsColumnTitle: "Resmi Dizinler",
    atlasLabel: "Avrupa Pazar Atlası",
    atlasHref: "/tr/atlas",
    blogHref: "/tr/blog",
    drawerTitle: "Tüm 12 Ülke Dizini, Teklif Hesaplayıcılar, Büyükşehirler ve Hukuk Rehberleri",
    drawerBadge: "12 PAZAR · A–Z",
    directoriesHeading: "12 Resmi İcra ve Müzayede Dizini",
    calculatorsHeading: "12 Yasal Teklif ve Teminat Hesaplayıcı",
    regionsHeading: "En Çok Aranan İller, Eyaletler, Kantonlar ve Büyükşehirler",
    guidesHeading: "Dillere Göre Hukuk Rehberleri",
  },
  it: {
    marketsColumnTitle: "Portali Ufficiali",
    atlasLabel: "Atlante Europeo delle Aste",
    atlasHref: "/it/atlas",
    blogHref: "/it/blog",
    drawerTitle: "Tutti i 12 Registri Nazionali, Calcolatori d'Offerta, Regioni e Guide Legali",
    drawerBadge: "12 MERCATI · A–Z",
    directoriesHeading: "12 Elenchi Ufficiali delle Aste",
    calculatorsHeading: "12 Calcolatori di Offerta e Imposte",
    regionsHeading: "Regioni, Cantoni, Länder e Metropoli più cercati",
    guidesHeading: "Guide Legali per Lingua",
  },
  es: {
    marketsColumnTitle: "Portales Oficiales",
    atlasLabel: "Atlas Europeo de Subastas",
    atlasHref: "/es/atlas",
    blogHref: "/es/blog",
    drawerTitle: "Los 12 Registros Nacionales, Calculadoras de Puja, Regiones y Guías Legales",
    drawerBadge: "12 MERCADOS · A–Z",
    directoriesHeading: "12 Directorios Oficiales de Subastas",
    calculatorsHeading: "12 Calculadoras de Puja y Depósito",
    regionsHeading: "Comunidades, Regiones, Cantones y Metrópolis más buscados",
    guidesHeading: "Guías Legales por Idioma",
  },
  fr: {
    marketsColumnTitle: "Portails Officiels",
    atlasLabel: "Atlas Européen des Enchères",
    atlasHref: "/fr/atlas",
    blogHref: "/fr/blog",
    drawerTitle: "Les 12 Répertoires Nationaux, Calculateurs de Mise, Régions et Guides Juridiques",
    drawerBadge: "12 MARCHÉS · A–Z",
    directoriesHeading: "12 Répertoires Officiels d'Enchères",
    calculatorsHeading: "12 Calculateurs de Mise et Frais",
    regionsHeading: "Régions, Cantons, Länder et Métropoles les plus recherchés",
    guidesHeading: "Guides Juridiques par Langue",
  },
  nl: {
    ...EN_UI,
    marketsColumnTitle: "Veilingregisters",
    atlasLabel: "Europese Marktatlas",
    drawerTitle: "Alle 12 Landelijke Veilingregisters, Biedcalculators, Regio's & Juridische Gidsen",
    drawerBadge: "12 MARKTEN · A–Z",
    directoriesHeading: "12 Officiële Veilingregisters",
    calculatorsHeading: "12 Wettelijke Biedcalculators",
    regionsHeading: "Meest gezochte provincies, regio's, kantons en steden",
    guidesHeading: "Juridische Gidsen per Taal",
  },
  pl: {
    ...EN_UI,
    marketsColumnTitle: "Rejestry Licytacji",
    atlasLabel: "Europejski Atlas Rynku",
    drawerTitle: "Wszystkie 12 Rejestrów Krajowych, Kalkulatory Wadium, Regiony i Poradniki",
    drawerBadge: "12 RYNKÓW · A–Z",
    directoriesHeading: "12 Oficjalnych Rejestrów Licytacji",
    calculatorsHeading: "12 Ustawowych Kalkulatorów Licytacji",
    regionsHeading: "Najczęściej wyszukiwane województwa, regiony i metropolie",
    guidesHeading: "Poradniki Prawne wg Języka",
  },
  cs: {
    ...EN_UI,
    marketsColumnTitle: "Dražební Portály",
    atlasLabel: "Evropský Atlas Dražeb",
    drawerTitle: "Všech 12 Národních Rejstříků, Kalkulačky Nejnižšího Podání, Kraje a Průvodci",
    drawerBadge: "12 TRHŮ · A–Z",
    directoriesHeading: "12 Oficiálních Dražebních Rejstříků",
    calculatorsHeading: "12 Zákonných Kalkulaček Dražeb",
    regionsHeading: "Nejvyhledávanější kraje, spolkové země, kantony a metropole",
    guidesHeading: "Právní Průvodci podle Jazyka",
  },
  sv: {
    ...EN_UI,
    marketsColumnTitle: "Auktionsregister",
    atlasLabel: "Europeisk Marknadsatlas",
    drawerTitle: "Alla 12 Nationella Auktionsregister, Budkalkylatorer, Län & Juridiska Guider",
    drawerBadge: "12 MARKNADER · A–Z",
    directoriesHeading: "12 Officiella Auktionsregister",
    calculatorsHeading: "12 Lagstadgade Budkalkylatorer",
    regionsHeading: "Mest sökta län, delstater, kantoner och storstäder",
    guidesHeading: "Juridiska Guider per Språk",
  },
};

export function getFooterDirectoryUi(lang?: string): FooterDirectoryUi {
  if (!lang) return EN_UI;
  const normalized = lang.slice(0, 2).toLowerCase();
  return LOCALIZED_UI[normalized] ?? EN_UI;
}
