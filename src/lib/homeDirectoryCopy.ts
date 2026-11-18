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
    eyebrow: "08 · DIRECT ACCESS · ALL 8 MARKETS, BID CALCULATORS & LEGAL GUIDES",
    title: "Official Judicial Auction Directories & Free Bid Calculators (DE · AT · CH · IT · ES · FR · UK · TR)",
    topRegionsHeading: "Most searched states, cantons, regions & metropolitan areas",
  },
  de: {
    ariaLabel: "Offizielle Länderverzeichnisse & Gebotsrechner",
    eyebrow: "08 · DIREKTZUGANG · ALLE 8 MÄRKTE, GEBOTSRECHNER & RECHTS-GUIDES",
    title: "Amtliche Versteigerungsverzeichnisse & Kostenlose Gebotsrechner (DE · AT · CH · IT · ES · FR · UK · TR)",
    topRegionsHeading: "Meistgesuchte Bundesländer, Kantone, Regionen & Metropolen",
  },
  tr: {
    ariaLabel: "Resmi Ülke İhale Rehberleri ve Teklif Hesaplayıcılar",
    eyebrow: "08 · DOĞRUDAN ERİŞİM · TÜM 8 PAZAR, TEKLİF HESAPLAYICILAR VE HUKUK REHBERLERİ",
    title: "Resmi İcra ve Müzayede Dizinleri ile Ücretsiz Teklif Hesaplayıcılar (DE · AT · CH · IT · ES · FR · UK · TR)",
    topRegionsHeading: "En çok aranan iller, eyaletler, kantonlar ve büyükşehirler",
  },
  it: {
    ariaLabel: "Elenchi Ufficiali delle Aste e Calcolatori di Offerta",
    eyebrow: "08 · ACCESSO DIRETTO · TUTTI GLI 8 MERCATI, CALCOLATORI E GUIDE LEGALI",
    title: "Elenchi Ufficiali delle Aste Giudiziarie e Calcolatori Gratuiti (DE · AT · CH · IT · ES · FR · UK · TR)",
    topRegionsHeading: "Regioni, cantoni, stati federali e metropoli più cercati",
  },
  es: {
    ariaLabel: "Directorios Oficiales de Subastas y Calculadoras de Puja",
    eyebrow: "08 · ACCESO DIRECTO · LOS 8 MERCADOS, CALCULADORAS DE PUJA Y GUÍAS LEGALES",
    title: "Directorios Oficiales de Subastas Judiciales y Calculadoras Gratuitas (DE · AT · CH · IT · ES · FR · UK · TR)",
    topRegionsHeading: "Comunidades, regiones, cantones y metrópolis más buscados",
  },
  fr: {
    ariaLabel: "Répertoires Officiels d'Enchères et Calculateurs de Mise",
    eyebrow: "08 · ACCÈS DIRECT · LES 8 MARCHÉS, CALCULATEURS D'ENCHÈRES ET GUIDES JURIDIQUES",
    title: "Répertoires Officiels d'Enchères Judiciaires et Calculateurs Gratuits (DE · AT · CH · IT · ES · FR · UK · TR)",
    topRegionsHeading: "Régions, cantons, Länder et métropoles les plus recherchés",
  },
};
