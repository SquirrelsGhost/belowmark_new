import type { LocaleOption } from "@/lib/constants";

export interface HomeDirectoryHeadingCopy {
  ariaLabel: string;
  eyebrow: string;
  title: string;
  topRegionsHeading: string;
}

export const HOME_DIRECTORY_COPY: Record<LocaleOption, HomeDirectoryHeadingCopy> = {
  en: {
    ariaLabel: "Official Country Auction Directories & Bid Calculators",
    eyebrow: "08 · DIRECT ACCESS · ALL 12 MARKETS, BID CALCULATORS & LEGAL GUIDES",
    title: "Official Judicial Auction Directories & Free Bid Calculators (DE · AT · CH · IT · ES · FR · UK · NL · PL · CZ · SE · TR)",
    topRegionsHeading: "Most searched states, cantons, regions & metropolitan areas",
  },
  de: {
    ariaLabel: "Offizielle Länderverzeichnisse & Gebotsrechner",
    eyebrow: "08 · DIREKTZUGANG · ALLE 12 MÄRKTE, GEBOTSRECHNER & RECHTS-GUIDES",
    title: "Amtliche Versteigerungsverzeichnisse & Kostenlose Gebotsrechner (DE · AT · CH · IT · ES · FR · UK · NL · PL · CZ · SE · TR)",
    topRegionsHeading: "Meistgesuchte Bundesländer, Kantone, Regionen & Metropolen",
  },
  tr: {
    ariaLabel: "Resmi Ülke İhale Rehberleri ve Teklif Hesaplayıcılar",
    eyebrow: "08 · DOĞRUDAN ERİŞİM · TÜM 12 PAZAR, TEKLİF HESAPLAYICILAR VE HUKUK REHBERLERİ",
    title: "Resmi İcra ve Müzayede Dizinleri ile Ücretsiz Teklif Hesaplayıcılar (DE · AT · CH · IT · ES · FR · UK · NL · PL · CZ · SE · TR)",
    topRegionsHeading: "En çok aranan iller, eyaletler, kantonlar ve büyükşehirler",
  },
  it: {
    ariaLabel: "Elenchi Ufficiali delle Aste e Calcolatori di Offerta",
    eyebrow: "08 · ACCESSO DIRETTO · TUTTI I 12 MERCATI, CALCOLATORI E GUIDE LEGALI",
    title: "Elenchi Ufficiali delle Aste Giudiziarie e Calcolatori Gratuiti (DE · AT · CH · IT · ES · FR · UK · NL · PL · CZ · SE · TR)",
    topRegionsHeading: "Regioni, cantoni, stati federali e metropoli più cercati",
  },
  es: {
    ariaLabel: "Directorios Oficiales de Subastas y Calculadoras de Puja",
    eyebrow: "08 · ACCESO DIRECTO · LOS 12 MERCADOS, CALCULADORAS DE PUJA Y GUÍAS LEGALES",
    title: "Directorios Oficiales de Subastas Judiciales y Calculadoras Gratuitas (DE · AT · CH · IT · ES · FR · UK · NL · PL · CZ · SE · TR)",
    topRegionsHeading: "Comunidades, regiones, cantones y metrópolis más buscados",
  },
  fr: {
    ariaLabel: "Répertoires Officiels d'Enchères et Calculateurs de Mise",
    eyebrow: "08 · ACCÈS DIRECT · LES 12 MARCHÉS, CALCULATEURS D'ENCHÈRES ET GUIDES JURIDIQUES",
    title: "Répertoires Officiels d'Enchères Judiciaires et Calculateurs Gratuits (DE · AT · CH · IT · ES · FR · UK · NL · PL · CZ · SE · TR)",
    topRegionsHeading: "Régions, cantons, Länder et métropoles les plus recherchés",
  },
  pl: {
    ariaLabel: "Oficjalne Rejestry Licytacji i Kalkulatory Wadium",
    eyebrow: "08 · BEZPOŚREDNI DOSTĘP · WSZYSTKIE 12 RYNKÓW, KALKULATORY I PORADNIKI",
    title: "Oficjalne Rejestry Licytacji Komorniczych i Darmowe Kalkulatory (PL · DE · AT · CH · IT · ES · FR · UK · NL · CZ · SE · TR)",
    topRegionsHeading: "Najczęściej wyszukiwane województwa, regiony i metropolie",
  },
  cs: {
    ariaLabel: "Oficiální Rejstříky Dražeb a Kalkulačky Jistoty",
    eyebrow: "08 · PŘÍMÝ PŘÍSTUP · VŠECH 12 TRHŮ, KALKULAČKY A PRÁVNÍ PRŮVODCI",
    title: "Oficiální Rejstříky Exekučních Dražeb a Kalkulačky Zdarma (CZ · DE · AT · CH · IT · ES · FR · UK · NL · PL · SE · TR)",
    topRegionsHeading: "Nejčastěji vyhledávané kraje, regiony a metropole",
  },
  nl: {
    ariaLabel: "Officiële Veilingregisters en Biedcalculators",
    eyebrow: "08 · DIRECTE TOEGANG · ALLE 12 MARKTEN, CALCULATORS & JURIDISCHE GIDSEN",
    title: "Officiële Executieveiling-registers & Gratis Calculators (NL · DE · AT · CH · IT · ES · FR · UK · PL · CZ · SE · TR)",
    topRegionsHeading: "Meest gezochte provincies, regio's, kantons en steden",
  },
  sv: {
    ariaLabel: "Officiella Auktionsregister och Kalkylatorer",
    eyebrow: "08 · DIREKTÅTKOMST · ALLA 12 MARKNADER, KALKYLATORER & JURIDISKA GUIDER",
    title: "Officiella Exekutiva Auktionsregister & Kostnadsfria Kalkylatorer (SE · DE · AT · CH · IT · ES · FR · UK · NL · PL · CZ · TR)",
    topRegionsHeading: "Mest sökta län, regioner, kantoner och storstäder",
  },
};
