import { LocaleOption } from "@/lib/constants";

export interface SignupBannerLocaleCopy {
  listingBadge: string;
  alertBadge: string;
  appraised: string;
  minBid: string;
  listingNote: (city: string) => string;
  cityTitle: (city: string) => string;
  cityNote: (city: string) => string;
}

export const SIGNUP_BANNER_COPY: Record<LocaleOption, SignupBannerLocaleCopy> = {
  de: {
    listingBadge: "🎁 IHR 1 GRATIS-DOSSIER (OHNE ZAHLUNGSMETHODE · KEIN ABO)",
    alertBadge: "🎁 1 GRATIS-DOSSIER + KOSTENLOSER E-MAIL-SUCHAUFTRAG",
    appraised: "Verkehrswert / Schätzwert",
    minBid: "Einstieg / Mindestgebot",
    listingNote: (city) =>
      `Nach Bestätigung Ihrer E-Mail schalten wir genau dieses Objekt automatisch als Ihr 1 Gratis-Dossier komplett ungeschwärzt frei (inkl. Aktenzeichen, exakter Adresse, Gerichts-PDF & KI-Analyse) und aktivieren Ihren kostenlosen Such-Alert für ${city}. 14 Tage unverbindlich testen — endet automatisch, keine Zahlungsdaten hinterlegt, keine automatische Abbuchung oder Abo-Verlängerung.`,
    cityTitle: (city) => `1 Gratis-Dossier + Automatischer Such-Alert für ${city}`,
    cityNote: (city) =>
      `Sobald Sie Ihre E-Mail bestätigen, ist Ihr 1 Gratis-Dossier für ein Objekt Ihrer Wahl freigeschaltet und Ihr täglicher Suchauftrag für ${city} sofort aktiv. 14 Tage unverbindlich testen — endet automatisch, keine Zahlungsdaten hinterlegt, keine automatische Abbuchung.`,
  },
  tr: {
    listingBadge: "🎁 1 ÜCRETSİZ TAM DOSYANIZ (KARTSIZ · ABONELİK YOK)",
    alertBadge: "🎁 1 ÜCRETSİZ DOSYA + E-POSTA İHALE ALARMI",
    appraised: "Muhammen Bedel",
    minBid: "Başlangıç / %50 Sınır",
    listingNote: (city) =>
      `E-postanızı doğruladığınız anda bu ihale dosyası 1 Ücretsiz Dosya hakkınızla sansürsüz olarak (esas no, açık adres, şartname PDF ve yapay zekâ analizi) otomatik açılır ve ${city} alarmınız kurulur. 14 gün bağlayıcılık olmadan deneyin — otomatik sona erer, kart bilgisi veya otomatik abonelik yenilemesi yoktur.`,
    cityTitle: (city) => `1 Ücretsiz Dosya + ${city} İcra & E-İhale Alarmı`,
    cityNote: (city) =>
      `E-postanızı doğruladığınız anda 1 ücretsiz tam dosya açma hakkınız tanımlanır ve ${city} bölgesindeki yeni ihaleler için günlük bildiriminiz başlar. 14 gün bağlayıcılık olmadan deneyin — otomatik biter, ödeme bilgisi veya otomatik çekim yoktur.`,
  },
  en: {
    listingBadge: "🎁 YOUR 1 FREE PROPERTY DOSSIER (NO CARD · NO AUTO-RENEWAL)",
    alertBadge: "🎁 1 FREE DOSSIER + AUCTION EMAIL ALERT",
    appraised: "Market Benchmark",
    minBid: "Guide / Minimum Bid",
    listingNote: (city) =>
      `Right after confirming your email, we automatically unlock this exact lot as your 1 Free Dossier (full case number, street address, court PDF & AI report) and activate your free alert for ${city}. 14-day commitment-free test — ends automatically, no payment details stored, no automatic charge or subscription renewal.`,
    cityTitle: (city) => `1 Free Dossier + Property Auction Alert for ${city}`,
    cityNote: (city) =>
      `Confirm your email below to unlock 1 full auction dossier of your choice for free and activate daily alerts for ${city}. 14-day commitment-free test — ends automatically, no card on file, no auto-renewal.`,
  },
  it: {
    listingBadge: "🎁 IL TUO 1° FASCICOLO GRATUITO (SENZA CARTA · NESSUN ABBONAMENTO)",
    alertBadge: "🎁 1 FASCICOLO GRATIS + AVVISO ASTE",
    appraised: "Prezzo Base / Stima",
    minBid: "Offerta Minima",
    listingNote: (city) =>
      `Subito dopo la conferma dell'email sbloccheremo automaticamente questo immobile come tuo 1° Fascicolo Gratuito (R.G.E., indirizzo esatto, PDF tribunale e analisi IA) e attiveremo l'avviso per ${city}. 14 giorni senza impegno — termina automaticamente, nessun dato di pagamento salvato, nessun rinnovo automatico.`,
    cityTitle: (city) => `1 Fascicolo Gratis + Avviso Aste per ${city}`,
    cityNote: (city) =>
      `Conferma la tua email per sbloccare gratuitamente 1 fascicolo completo a tua scelta e ricevere i nuovi avvisi d'asta a ${city}. 14 giorni senza impegno — termina automaticamente, nessuna carta né addebito automatico.`,
  },
  es: {
    listingBadge: "🎁 SU 1er EXPEDIENTE GRATIS (SIN TARJETA · SIN SUSCRIPCIÓN)",
    alertBadge: "🎁 1 EXPEDIENTE GRATIS + ALERTA BOE",
    appraised: "Valor de Subasta",
    minBid: "Umbral Mínimo",
    listingNote: (city) =>
      `Al confirmar su correo desbloquearemos automáticamente este inmueble como su 1er Expediente Gratis (n.º BOE, dirección exacta, edicto PDF e informe IA) y activaremos su alerta en ${city}. 14 días sin compromiso — finaliza automáticamente, sin datos de pago guardados ni renovación automática.`,
    cityTitle: (city) => `1 Expediente Gratis + Alerta de Subastas en ${city}`,
    cityNote: (city) =>
      `Confirme su correo para activar 1 expediente completo gratis y recibir avisos automáticos de nuevas subastas BOE en ${city}. 14 días sin compromiso — finaliza automáticamente, sin tarjeta ni cobro automático.`,
  },
  fr: {
    listingBadge: "🎁 VOTRE 1er DOSSIER COMPLET GRATUIT (SANS CARTE · SANS ABONNEMENT)",
    alertBadge: "🎁 1 DOSSIER GRATUIT + ALERTE ENCHÈRES",
    appraised: "Valeur Référence",
    minBid: "Mise à Prix",
    listingNote: (city) =>
      `Dès confirmation de votre e-mail, nous débloquons automatiquement ce bien comme votre 1er Dossier Gratuit (n° de rôle TJ, adresse exacte, cahier PDF et analyse IA) et activons votre alerte (${city}). 14 jours sans engagement — fin automatique, aucune carte enregistrée, aucun renouvellement automatique.`,
    cityTitle: (city) => `1 Dossier Gratuit + Alerte Automatique (${city})`,
    cityNote: (city) =>
      `Confirmez votre e-mail pour débloquer 1 dossier complet gratuit et activer les alertes de nouvelles ventes judiciaires (${city}). 14 jours sans engagement — fin automatique, aucune donnée bancaire ni prélèvement.`,
  },
  pl: {
    listingBadge: "🎁 TWOJE 1 DARMOWE PEŁNE AKTA (BEZ KARTY · BEZ SUBSKRYPCJI)",
    alertBadge: "🎁 1 DARMOWE AKTA + ALERT LICYTACJI E-MAIL",
    appraised: "Suma oszacowania",
    minBid: "Cena wywołania",
    listingNote: (city) =>
      `Zaraz po potwierdzeniu adresu e-mail automatycznie odblokujemy tę nieruchomość jako Twoje 1 Darmowe Akta (sygnatura, dokładny adres, obwieszczenie PDF i analiza AI) oraz uruchomimy darmowy alert dla ${city}. 14 dni bez zobowiązań — kończy się automatycznie, bez danych karty i bez automatycznego odnowienia.`,
    cityTitle: (city) => `1 Darmowe Akta + Alert Licytacji Komorniczych dla ${city}`,
    cityNote: (city) =>
      `Potwierdź swój adres e-mail, aby bezpłatnie odblokować 1 pełne akta wybranej licytacji i otrzymywać codzienne powiadomienia dla ${city}. 14 dni bez zobowiązań — kończy się automatycznie, bez karty.`,
  },
  cs: {
    listingBadge: "🎁 VÁŠ 1 ZDARMA KOMPLETNÍ SPIS (BEZ KARTY · BEZ PŘEDPLATNÉHO)",
    alertBadge: "🎁 1 SPIS ZDARMA + E-MAILOVÝ HLÍDACÍ PES",
    appraised: "Výsledná / odhadní cena",
    minBid: "Nejnižší podání",
    listingNote: (city) =>
      `Ihned po potvrzení e-mailu automaticky odemkneme přesně tuto nemovitost jako váš 1 Spis zdarma (spisová značka, přesná adresa, znalecký posudek PDF a AI analýza) a aktivujeme hlídání pro ${city}. 14 dní nezávazně — končí automaticky, bez uložení karty a bez automatického prodloužení.`,
    cityTitle: (city) => `1 Spis zdarma + Hlídací pes exekučních dražeb pro ${city}`,
    cityNote: (city) =>
      `Potvrďte svůj e-mail pro bezplatné odemčení 1 kompletního spisu dle výběru a aktivaci denních upozornění pro ${city}. 14 dní nezávazně — končí automaticky, bez karty.`,
  },
  nl: {
    listingBadge: "🎁 UW 1 GRATIS VOLLEDIG DOSSIER (GEEN KAART · GEEN ABONNEMENT)",
    alertBadge: "🎁 1 GRATIS DOSSIER + E-MAIL VEILINGALERT",
    appraised: "Marktwaarde / Taxatie",
    minBid: "Richtprijs / Inzet",
    listingNote: (city) =>
      `Direct na bevestiging van uw e-mail ontgrendelen wij dit object automatisch als uw 1 Gratis Dossier (volledig zaaknummer, exact adres, veiling-PDF & AI-analyse) en activeren uw gratis alert voor ${city}. 14 dagen vrijblijvend — eindigt automatisch, geen betaalgegevens opgeslagen.`,
    cityTitle: (city) => `1 Gratis Dossier + Executieveiling-alert voor ${city}`,
    cityNote: (city) =>
      `Bevestig uw e-mailadres om gratis 1 volledig dossier naar keuze te openen en dagelijkse meldingen voor ${city} te ontvangen. 14 dagen vrijblijvend — eindigt automatisch, zonder kaart.`,
  },
  sv: {
    listingBadge: "🎁 DIN 1 KOSTNADSFRIA FULLSTÄNDIGA AKT (INGET KORT · INGEN PRENUMERATION)",
    alertBadge: "🎁 1 GRATIS AKT + E-POSTBEVAKNING AV AUKTIONER",
    appraised: "Marknadsvärde",
    minBid: "Riktpris / Utgångsbud",
    listingNote: (city) =>
      `Direkt efter att du bekräftat din e-post låser vi automatiskt upp just detta objekt som din 1 Gratis Akt (målnummer, exakt adress, värderings-PDF & AI-analys) och aktiverar din kostnadsfria bevakning för ${city}. 14 dagar utan bindning — avslutas automatiskt, inga betaluppgifter sparas.`,
    cityTitle: (city) => `1 Gratis Akt + Auktionsbevakning för ${city}`,
    cityNote: (city) =>
      `Bekräfta din e-postadress för att låsa upp 1 valfri fullständig akt gratis och få dagliga bevakningar för ${city}. 14 dagar utan bindning — avslutas automatiskt, inget kort krävs.`,
  },
};
