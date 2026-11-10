import { PublicListingResolved } from "@/services/PublicListingService";
import { PseoLocale } from "@/types/pseo.types";

const LOCALE_FMT: Record<PseoLocale, string> = {
  de: "de-DE",
  tr: "tr-TR",
  en: "en-GB",
  it: "it-IT",
  es: "es-ES",
  fr: "fr-FR",
};

export function fmtPublicMoney(amount: number | null, currency: "EUR" | "CHF" | "GBP" | "TRY", locale: PseoLocale, fallback: string): string {
  if (!amount || amount <= 0) return fallback;
  return new Intl.NumberFormat(LOCALE_FMT[locale], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface PublicListingLabels {
  eyebrowPrefix: string;
  onRequest: string;
  dateTbc: string;
  appraisedLabel: string;
  minBidLabel: string;
  thresholdLabel: string;
  depositLabel: string;
  factsHeading: string;
  areaLabel: string;
  pricePerM2Label: string;
  roomsLabel: string;
  yearBuiltLabel: string;
  hearingLabel: string;
  courtLabel: string;
  cityLabel: string;
  fileNoLabel: string;
  waivedYes: string;
  dossierHeading: string;
  dossierSub: string;
  lockedItems: readonly [string, string, string, string];
  unlockBadge: string;
  unlockTitle: string;
  unlockLead: string;
  signedInTitle: string;
  signedInLead: string;
  signedInCta: string;
  calcCta: string;
  searchCta: string;
  relatedHeading: string;
  faqHeading: string;
}

export const PUBLIC_LISTING_LABELS: Record<PseoLocale, PublicListingLabels> = {
  de: {
    eyebrowPrefix: "AMTLICHE VERSTEIGERUNG · OBJEKT-VORSCHAU",
    onRequest: "Im Gutachten",
    dateTbc: "Termin in Akte",
    appraisedLabel: "Verkehrswert / Schätzwert",
    minBidLabel: "50 %-Grenze / Einstieg",
    thresholdLabel: "70 %- / 75 %-Schwelle",
    depositLabel: "10 % Sicherheit",
    factsHeading: "Eckdaten & Verfahrensstand",
    areaLabel: "Wohn- / Nutzfläche",
    pricePerM2Label: "Schätzwert pro m²",
    roomsLabel: "Zimmer / Einheit",
    yearBuiltLabel: "Baujahr",
    hearingLabel: "Versteigerungstermin",
    courtLabel: "Zuständiges Gericht",
    cityLabel: "Standort / Gemeinde",
    fileNoLabel: "Aktenzeichen",
    waivedYes: "Wertgrenzen entfallen",
    dossierHeading: "Gesperrte Original-Dokumente in diesem Dossier",
    dossierSub: "Mit Ihrem 1 Gratis-Dossier (ohne Zahlungsdaten) sofort vollständig einsehbar:",
    lockedItems: [
      "Vollständiges gerichtliches Aktenzeichen & Grundbuchblatt",
      "Exakte Straßenanschrift, Hausnummer & Flurstück",
      "Amtliches Verkehrswertgutachten / Versteigerungsedikt (PDF)",
      "KI-Risiko- & Altlasten-Prüfung + Gebots-Kalkulation",
    ],
    unlockBadge: "🎁 1 GRATIS-DOSSIER INKLUSIVE · OHNE KARTE",
    unlockTitle: "Dieses Objekt-Dossier jetzt kostenlos öffnen",
    unlockLead: "Konto in 20 Sekunden anlegen: Dieses Objekt wird nach E-Mail-Bestätigung sofort als Ihr Gratis-Dossier entsperrt.",
    signedInTitle: "Sie sind bereits angemeldet",
    signedInLead: "Öffnen Sie dieses Verfahren direkt im Investor-Cockpit mit Gutachten-Prüfung und Gebotsrechner.",
    signedInCta: "Im Investor-Cockpit öffnen →",
    calcCta: "🧮 Gebots- & Nebenkostenrechner starten →",
    searchCta: "🔍 Alle 19.700+ Objekte live durchsuchen →",
    relatedHeading: "Weitere Versteigerungen in derselben Region / am selben Gericht",
    faqHeading: "Häufige Fragen zu diesem Versteigerungsobjekt",
  },
  tr: {
    eyebrowPrefix: "RESMİ E-İHALE · TAŞINMAZ ÖNİZLEME DOSYASI",
    onRequest: "Şartnamede",
    dateTbc: "İhale Takviminde",
    appraisedLabel: "Muhammen Bedel",
    minBidLabel: "%50 Başlangıç Bedeli",
    thresholdLabel: "1. Artırma Eşiği",
    depositLabel: "%10 Teminat Tutarı",
    factsHeading: "Taşınmaz Özellikleri ve İhale Bilgileri",
    areaLabel: "Yüzölçümü / Alan",
    pricePerM2Label: "m² Birim Değeri",
    roomsLabel: "Oda Sayısı",
    yearBuiltLabel: "Yapım Yılı",
    hearingLabel: "1. Artırma Tarihi",
    courtLabel: "İcra / Satış Dairesi",
    cityLabel: "İl / İlçe Konumu",
    fileNoLabel: "Esas Dosya No",
    waivedYes: "Fırsat İhalesi",
    dossierHeading: "Bu Dosyada Kilitli Resmi Belgeler",
    dossierSub: "1 Ücretsiz Dosya hakkınızla (kartsız) anında açılan bilgiler:",
    lockedItems: [
      "Tam Esas Numarası, Ada / Parsel ve Bağımsız Bölüm Bilgisi",
      "Açık Mahalle / Sokak Adresi ve İmar Durumu",
      "Resmi Bilirkişi Kıymet Takdiri & Satış Şartnamesi (PDF)",
      "Yapay Zeka Tapu Şerh / Risk Analizi ve Teklif Hesabı",
    ],
    unlockBadge: "🎁 1 ÜCRETSİZ DOSYA HEDİYE · KARTSIZ",
    unlockTitle: "Bu İhale Dosyasını Şimdi Ücretsiz Açın",
    unlockLead: "20 saniyede ücretsiz hesap oluşturun: E-posta doğrulaması sonrası bu taşınmaz dosyası otomatik olarak açılır.",
    signedInTitle: "Oturumunuz Açık",
    signedInLead: "Bu ihale dosyasını doğrudan yatırımcı panelinde tam analizle görüntüleyin.",
    signedInCta: "Yatırımcı Panelinde Aç →",
    calcCta: "🧮 %50 Açılış ve %10 Teminat Hesapla →",
    searchCta: "🔍 Tüm 14.700+ İhaleyi Canlı Ara →",
    relatedHeading: "Aynı Bölgedeki veya İcra Dairesindeki Diğer İhaleler",
    faqHeading: "Bu İcra İhalesi Hakkında Sık Sorulan Sorular",
  },
  en: {
    eyebrowPrefix: "OFFICIAL AUCTION LOT · DOSSIER PREVIEW",
    onRequest: "In Legal Pack",
    dateTbc: "See Catalogue",
    appraisedLabel: "Market Benchmark",
    minBidLabel: "Guide / Entry Level",
    thresholdLabel: "70% Target Cap",
    depositLabel: "10% Exchange Deposit",
    factsHeading: "Property Key Facts & Auction Status",
    areaLabel: "Floor / Plot Area",
    pricePerM2Label: "Benchmark per m²",
    roomsLabel: "Rooms / Layout",
    yearBuiltLabel: "Year Built",
    hearingLabel: "Auction Date",
    courtLabel: "Auctioneer / Authority",
    cityLabel: "Location",
    fileNoLabel: "Lot Reference",
    waivedYes: "No Reserve / Distressed",
    dossierHeading: "Locked Legal Pack & Full Address Inside This Dossier",
    dossierSub: "Included immediately with your 1 Free Dossier (no card needed):",
    lockedItems: [
      "Full Lot Reference, Title Register & Parcel Identifier",
      "Exact Street Address, Postcode & Location Pin",
      "Official Legal Pack / Catalogue Conditions (PDF)",
      "AI Special Conditions, Stamp Duty & ROI Verdict",
    ],
    unlockBadge: "🎁 1 FREE DOSSIER INCLUDED · NO CARD NEEDED",
    unlockTitle: "Unlock This Property Dossier for Free",
    unlockLead: "Create your free account in 20 seconds — this exact property unlocks automatically once you confirm your email.",
    signedInTitle: "You Are Signed In",
    signedInLead: "Open this lot directly inside the Investor Workbench.",
    signedInCta: "Open in Investor Workbench →",
    calcCta: "🧮 UK Stamp Duty & 10% Deposit Calculator →",
    searchCta: "🔍 Search All 19,700+ Live Auction Lots →",
    relatedHeading: "More Auction Lots in the Same Region",
    faqHeading: "Frequently Asked Questions About This Lot",
  },
  it: {
    eyebrowPrefix: "ASTA GIUDIZIARIA PVP · ANTEPRIMA FASCICOLO",
    onRequest: "In Perizia CTU",
    dateTbc: "Vedi Avviso",
    appraisedLabel: "Valore Stima CTU",
    minBidLabel: "Offerta Minima (75%)",
    thresholdLabel: "Soglia Prudenziale",
    depositLabel: "Cauzione 10%",
    factsHeading: "Dati Catastali & Stato Procedura",
    areaLabel: "Superficie Commerciale",
    pricePerM2Label: "Valore CTU al m²",
    roomsLabel: "Locali / Vani",
    yearBuiltLabel: "Anno Costruzione",
    hearingLabel: "Data Udienza Asta",
    courtLabel: "Tribunale Competente",
    cityLabel: "Comune",
    fileNoLabel: "Numero R.G.E.",
    waivedYes: "Ribasso d'Asta",
    dossierHeading: "Documenti Ufficiali Bloccati in Questo Fascicolo",
    dossierSub: "Sbloccabili subito gratis con il tuo 1 Fascicolo Gratuito (senza carta):",
    lockedItems: [
      "Numero R.G.E. completo, Lotto e Dati Catastali",
      "Indirizzo civico esatto e mappa particella",
      "Perizia CTU integrale e Avviso di Vendita (PDF)",
      "Analisi IA abusi edilizi, occupazione e calcolo imposte",
    ],
    unlockBadge: "🎁 1 FASCICOLO GRATIS INCLUSO · SENZA CARTA",
    unlockTitle: "Sblocca Gratis Questo Fascicolo d'Asta",
    unlockLead: "Registrati gratis in 20 secondi: questo immobile si sblocca automaticamente dopo la conferma email.",
    signedInTitle: "Accesso Effettuato",
    signedInLead: "Apri subito questa procedura nella piattaforma Investor.",
    signedInCta: "Apri nel Cockpit Investor →",
    calcCta: "🧮 Calcolatore Offerta Minima 75% & Cauzione →",
    searchCta: "🔍 Cerca Tutti i Lotti all'Asta →",
    relatedHeading: "Altre Aste Giudiziarie nella Stessa Zona / Tribunale",
    faqHeading: "Domande Frequenti su Questo Lotto all'Asta",
  },
  es: {
    eyebrowPrefix: "SUBASTA JUDICIAL BOE · VISTA PREVIA DEL EXPEDIENTE",
    onRequest: "Ver Edicto BOE",
    dateTbc: "Subasta Activa",
    appraisedLabel: "Valor de Subasta BOE",
    minBidLabel: "Umbral 50% (Art. 670.4)",
    thresholdLabel: "Adjudicación 70% LEC",
    depositLabel: "Depósito BOE 5%",
    factsHeading: "Datos del Inmueble y Estado de la Subasta",
    areaLabel: "Superficie Construida",
    pricePerM2Label: "Tasación por m²",
    roomsLabel: "Habitaciones",
    yearBuiltLabel: "Año Construcción",
    hearingLabel: "Cierre / Fecha BOE",
    courtLabel: "Juzgado / Autoridad",
    cityLabel: "Municipio",
    fileNoLabel: "Identificador BOE",
    waivedYes: "Sin Puja Mínima",
    dossierHeading: "Documentación Oficial Bloqueada en Este Expediente",
    dossierSub: "Disponible gratis al instante con tu 1 Expediente Gratuito (sin tarjeta):",
    lockedItems: [
      "Identificador SUB-JA completo, CRU / Finca Registral",
      "Dirección exacta con número de portal y planta",
      "Edicto oficial BOE y Certificación de Cargas (PDF)",
      "Análisis IA de cargas anteriores, ITP y puja óptima",
    ],
    unlockBadge: "🎁 1 EXPEDIENTE GRATIS INCLUIDO · SIN TARJETA",
    unlockTitle: "Desbloquea Gratis Este Expediente del BOE",
    unlockLead: "Crea tu cuenta gratis en 20 segundos: este inmueble queda desbloqueado automáticamente al confirmar tu email.",
    signedInTitle: "Sesión Iniciada",
    signedInLead: "Abre este expediente directamente en el panel Investor.",
    signedInCta: "Abrir en el Panel Investor →",
    calcCta: "🧮 Calculadora Regla 70%/50% LEC y Depósito 5% →",
    searchCta: "🔍 Buscar Todas las Subastas BOE Activas →",
    relatedHeading: "Más Subastas BOE en el Mismo Municipio / Juzgado",
    faqHeading: "Preguntas Frecuentes sobre Esta Subasta BOE",
  },
  fr: {
    eyebrowPrefix: "ENCHÈRE JUDICIAIRE · APERÇU DU DOSSIER",
    onRequest: "Voir Cahier CCV",
    dateTbc: "Audience TJ",
    appraisedLabel: "Valeur Réf. DVF",
    minBidLabel: "Mise à Prix Indicative",
    thresholdLabel: "Plafond Cible 70%",
    depositLabel: "Chèque CARPA 10%",
    factsHeading: "Caractéristiques du Bien & Audience",
    areaLabel: "Surface Habitable",
    pricePerM2Label: "Référence au m²",
    roomsLabel: "Pièces",
    yearBuiltLabel: "Année Construction",
    hearingLabel: "Date d'Audience TJ",
    courtLabel: "Tribunal Judiciaire",
    cityLabel: "Commune",
    fileNoLabel: "N° Rôle / Greffe",
    waivedYes: "Baisse de Mise à Prix",
    dossierHeading: "Pièces Officielles Verrouillées dans ce Dossier",
    dossierSub: "Débloquées gratuitement avec votre 1 Dossier Gratuit (sans carte) :",
    lockedItems: [
      "Numéro de Rôle du Greffe et références cadastrales",
      "Adresse postale exacte et localisation précise",
      "Cahier des Conditions de Vente (CCV) & Procès-verbal",
      "Analyse IA occupation, surenchère 10 % et frais totaux",
    ],
    unlockBadge: "🎁 1 DOSSIER GRATUIT INCLUS · SANS CARTE",
    unlockTitle: "Débloquez Gratuitement ce Dossier d'Enchère",
    unlockLead: "Créez votre compte gratuit en 20 secondes : ce bien est débloqué automatiquement dès validation de votre e-mail.",
    signedInTitle: "Vous êtes connecté",
    signedInLead: "Ouvrez directement cette vente dans le cockpit Investor.",
    signedInCta: "Ouvrir dans le Cockpit Investor →",
    calcCta: "🧮 Calculateur Consignation CARPA 10 % & Frais →",
    searchCta: "🔍 Rechercher Toutes les Enchères Actives →",
    relatedHeading: "Autres Ventes aux Enchères dans la Même Juridiction",
    faqHeading: "Questions Fréquentes sur ce Bien aux Enchères",
  },
};

export function buildPublicListingMeta(item: PublicListingResolved): { title: string; description: string } {
  const L = PUBLIC_LISTING_LABELS[item.locale];
  const valStr = fmtPublicMoney(item.appraisedValue, item.currency, item.locale, "");
  const minStr = fmtPublicMoney(item.minBidValue, item.currency, item.locale, "");
  const loc = [item.postcode, item.cleanCity].filter(Boolean).join(" ");

  switch (item.locale) {
    case "tr": {
      const priceBit = minStr ? ` · ${minStr}'den` : valStr ? ` · ${valStr}` : "";
      const full = `${item.headline}${priceBit} | İcra İhale`;
      const compact = `${item.segmentLabel} ${item.cleanCity}${priceBit} | İcra İhale`;
      return {
        title: full.length <= 65 ? full : compact.slice(0, 65),
        description: `${item.authority}: ${item.headline} (${loc}). Muhammen bedel ${valStr || L.onRequest}, %50 açılış ${minStr || L.onRequest}. Esas no ve şartname PDF'i ücretsiz açın.`,
      };
    }
    case "es": {
      const priceBit = minStr ? ` desde ${minStr}` : "";
      const full = `Subasta BOE ${item.cleanCity}: ${item.segmentLabel}${priceBit}`;
      return {
        title: full.slice(0, 65),
        description: `${item.headline} en ${loc} (${item.authority}). Tasación BOE ${valStr || L.onRequest}, umbral 50% ${minStr || L.onRequest}. Desbloquea edicto y cargas gratis.`,
      };
    }
    case "it": {
      const priceBit = minStr ? ` da ${minStr}` : "";
      const full = `Asta ${item.cleanCity}: ${item.segmentLabel}${priceBit} (PVP)`;
      return {
        title: full.slice(0, 65),
        description: `${item.headline} a ${loc} (${item.authority}). Stima CTU ${valStr || L.onRequest}, offerta minima 75% ${minStr || L.onRequest}. Sblocca R.G.E. e perizia gratis.`,
      };
    }
    case "fr": {
      const priceBit = minStr ? ` dès ${minStr}` : "";
      const full = `Enchère ${item.cleanCity} : ${item.segmentLabel}${priceBit}`;
      return {
        title: full.slice(0, 65),
        description: `${item.headline} à ${loc} (${item.authority}). Valeur réf. ${valStr || L.onRequest}, mise à prix ${minStr || L.onRequest}. Débloquez le dossier gratuit.`,
      };
    }
    case "en": {
      const priceBit = minStr ? ` from ${minStr}` : "";
      const full = `Auction ${item.cleanCity}: ${item.segmentLabel}${priceBit}`;
      return {
        title: full.slice(0, 65),
        description: `${item.headline} in ${loc} (${item.authority}). Benchmark ${valStr || L.onRequest}, guide ${minStr || L.onRequest}. Unlock full address & legal pack free.`,
      };
    }
    default: {
      const prefix = item.country === "CH" ? "Steigerung" : "Zwangsversteigerung";
      const priceBit = minStr ? ` ab ${minStr}` : valStr ? ` (${valStr})` : "";
      const full = `${prefix} ${item.cleanCity}: ${item.segmentLabel}${priceBit}`;
      const compact = `${item.segmentLabel} ${item.cleanCity}${priceBit} | ZVG`;
      return {
        title: full.length <= 65 ? full : compact.slice(0, 65),
        description: `${item.headline} (${item.authority})${minStr ? ` ab ${minStr} (50 %-Grenze)` : ""}: Verkehrswert ${valStr || L.onRequest}, Termin & 1 Gratis-Dossier inkl. Gutachten-PDF.`,
      };
    }
  }
}

export function buildPublicListingFaqs(item: PublicListingResolved): Array<{ q: string; a: string }> {
  const L = PUBLIC_LISTING_LABELS[item.locale];
  const valStr = fmtPublicMoney(item.appraisedValue, item.currency, item.locale, L.onRequest);
  const minStr = fmtPublicMoney(item.minBidValue, item.currency, item.locale, L.onRequest);
  const depStr = fmtPublicMoney(item.depositValue, item.currency, item.locale, L.onRequest);

  if (item.locale === "tr") {
    return [
      {
        q: `${item.cleanCity} (${item.segmentLabel}) icra ihalesinde muhammen bedel ve başlangıç fiyatı nedir?`,
        a: `Bu taşınmaz için bilirkişi muhammen bedeli ${valStr}, %50 birinci artırma başlangıç sınırı (artı satış giderleri) yaklaşık ${minStr} ve %10 elektronik teminat tutarı ${depStr} düzeyindedir.`,
      },
      {
        q: `Bu ihalenin tam Esas numarası ve bilirkişi raporu PDF'ine nasıl ulaşırım?`,
        a: `Bu sayfadaki ücretsiz kayıt formunu doldurarak 1 Ücretsiz Dosya hakkınızla (kredi kartı gerekmeden) ${item.authority} dosyasına ait Esas numarasını, açık adresi ve resmi şartnameyi anında açabilirsiniz.`,
      },
    ];
  }
  if (item.locale === "es") {
    return [
      {
        q: `¿Cuál es el Valor de Subasta BOE y el depósito del 5% para este inmueble en ${item.cleanCity}?`,
        a: `El Valor de Subasta judicial fijado es de ${valStr}, con un umbral orientativo del 50% en ${minStr} (Art. 670.4 LEC) y un depósito electrónico obligatorio del 5% equivalente a ${depStr}.`,
      },
      {
        q: `¿Cómo ver la dirección exacta, CRU y certificación de cargas de esta subasta?`,
        a: `Con tu cuenta gratuita en Belowmark recibes 1 Expediente Gratis (sin tarjeta) para desbloquear al instante el identificador BOE, la dirección exacta y el análisis de cargas de este lote.`,
      },
    ];
  }
  if (item.locale === "it") {
    return [
      {
        q: `Qual è il prezzo base e l'offerta minima (75%) per questo immobile a ${item.cleanCity}?`,
        a: `Il valore di stima CTU è pari a ${valStr}, l'offerta minima efficace al 75% (art. 571 c.p.c.) è indicativamente ${minStr} e la cauzione del 10% è pari a ${depStr}.`,
      },
      {
        q: `Come consultare la Perizia CTU, il numero R.G.E. e l'indirizzo civico?`,
        a: `Registrandoti gratuitamente su Belowmark ottieni 1 Fascicolo Gratis (senza carta) che sblocca subito R.G.E., indirizzo completo e documenti ufficiali del ${item.authority}.`,
      },
    ];
  }
  if (item.locale === "fr") {
    return [
      {
        q: `Quelle est la valeur de référence et la consignation CARPA pour ce bien à ${item.cleanCity} ?`,
        a: `La valeur de référence suivie est de ${valStr}, avec un seuil d'entrée estimé à ${minStr} et un chèque de banque CARPA de l'ordre de ${depStr} devant le ${item.authority}.`,
      },
      {
        q: `Comment obtenir le Cahier des Conditions de Vente (CCV) et l'adresse exacte ?`,
        a: `Créez gratuitement votre compte sur Belowmark (sans carte bancaire) pour débloquer immédiatement ce bien grâce à votre 1 Dossier Gratuit inclus.`,
      },
    ];
  }
  if (item.locale === "en") {
    return [
      {
        q: `What is the guide price and 10% auction deposit for this lot in ${item.cleanCity}?`,
        a: `The tracked benchmark is ${valStr}, with an indicative entry/guide threshold of ${minStr} and a standard 10% deposit around ${depStr}.`,
      },
      {
        q: `How do I unlock the exact street address and official legal pack PDF?`,
        a: `Create your free Belowmark account right on this page (no card required) to unlock this lot immediately using your 1 Free Dossier.`,
      },
    ];
  }
  return [
    {
      q: `Wie hoch sind Verkehrswert, Mindestgebot und Sicherheitsleistung für dieses Objekt in ${item.cleanCity}?`,
      a: `Der gerichtlich angesetzte Schätz-/Verkehrswert beträgt ${valStr}. Rechnerisch liegt die 50 %-Schwelle bei ${minStr} und die 10 % Sicherheitsleistung bei ${depStr} (${item.authority}).`,
    },
    {
      q: `Wie erhalte ich das vollständige Aktenzeichen, die Hausnummer und das Gutachten-PDF?`,
      a: `Direkt auf dieser Seite können Sie kostenlos Ihr Konto anlegen (ohne Zahlungsdaten) — nach E-Mail-Bestätigung wird genau dieses Objekt automatisch als Ihr 1 Gratis-Dossier mit Aktenzeichen und PDF freigeschaltet.`,
    },
  ];
}
