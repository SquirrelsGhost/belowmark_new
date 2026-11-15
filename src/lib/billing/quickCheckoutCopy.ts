import { LocaleOption } from "@/lib/constants";

export interface QuickCheckoutLocaleCopy {
  pending: string;
  consentPrefix: string;
  terms: string;
  withdrawal: string;
  privacy: string;
  consentError: string;
  genericError: string;
  tabSubscription: string;
  tabPass: (price: string) => string;
  trialSummary: (price: string) => string;
  stdSummary: (price: string) => string;
  passSummary: (price: string) => string;
  passSubmit: (price: string) => string;
  passNote: string;
  oneTimeLink: (price: string) => string;
}

export const QUICK_CHECKOUT_COPY: Record<LocaleOption, QuickCheckoutLocaleCopy> = {
  de: {
    pending: "Weiter zu Stripe …",
    consentPrefix: "Ich akzeptiere",
    terms: "AGB",
    withdrawal: "Widerrufsbelehrung",
    privacy: "Datenschutz",
    consentError: "Bitte bestätigen Sie kurz die Bedingungen vor dem Start.",
    genericError: "Weiterleitung fehlgeschlagen — bitte über Tarifübersicht öffnen.",
    tabSubscription: "0,00 € Test (7 Tage)",
    tabPass: (p) => `14-Tage-Pass (${p} · kein Abo)`,
    trialSummary: (p) => `Heute 0,00 € für 7 Tage Vollzugang · ab Tag 8 ${p}/Monat (jederzeit vorab mit 1 Klick kündbar).`,
    stdSummary: (p) => `Sofortiger Vollzugang · ${p}/Monat · monatlich kündbar.`,
    passSummary: (p) => `Einmalig ${p} für 14 Tage Vollzugang (alle Akten, PDFs & KI) — kein Abo, endet automatisch.`,
    passSubmit: (p) => `14-Tage-Pass ohne Abo starten (${p}) →`,
    passNote: "Einmalzahlung per Karte, Apple Pay oder Google Pay · keine Verlängerung.",
    oneTimeLink: (p) => `Längerer Zeitraum ohne Abo? 3-Monats-Einmalpass (${p}) →`,
  },
  tr: {
    pending: "Stripe'a yönlendiriliyor …",
    consentPrefix: "Kabul ediyorum:",
    terms: "Kullanım Koşulları",
    withdrawal: "Cayma Hakkı",
    privacy: "Gizlilik",
    consentError: "Devam etmeden önce lütfen koşulları onaylayın.",
    genericError: "İşlem başlatılamadı — lütfen paket sayfasından deneyin.",
    tabSubscription: "0,00 TL Deneme (7 Gün)",
    tabPass: (p) => `14 Günlük Paket (${p} · Abonelik Yok)`,
    trialSummary: (p) => `Bugün 0,00 TL (7 gün tam erişim) · 8. günden itibaren ${p}/ay (öncesinde tek tıkla iptal).`,
    stdSummary: (p) => `Anında tam erişim · ${p}/ay · istediğiniz zaman iptal.`,
    passSummary: (p) => `Tek seferlik ${p} ile 14 gün tam erişim (tüm esas nolar, PDF şartnameler & yapay zekâ) — abonelik yok, otomatik biter.`,
    passSubmit: (p) => `14 Günlük Paketi Başlat (${p} · Abonelik Yok) →`,
    passNote: "Tüm banka/kredi kartları geçerlidir · tek çekim, otomatik yenilenmez.",
    oneTimeLink: (p) => `Daha uzun süre mi lazım? 3 Aylık Tek Seferlik Paket (${p}) →`,
  },
  en: {
    pending: "Opening Stripe …",
    consentPrefix: "I agree to the",
    terms: "Terms",
    withdrawal: "Withdrawal",
    privacy: "Privacy",
    consentError: "Please confirm the terms to start checkout.",
    genericError: "Could not start checkout — please use the plan page.",
    tabSubscription: "0.00 Trial (7 Days)",
    tabPass: (p) => `14-Day Pass (${p} · No Sub)`,
    trialSummary: (p) => `Due today: 0.00 for 7 days full access · then ${p}/month (cancel in 1 click before day 8).`,
    stdSummary: (p) => `Instant full access · ${p}/month · cancel anytime.`,
    passSummary: (p) => `One-time ${p} for 14 days full access (all court files, PDFs & AI) — no subscription, never renews.`,
    passSubmit: (p) => `Get 14-Day Pass (${p} · No Subscription) →`,
    passNote: "Single payment via Card, Apple Pay or Google Pay · ends automatically.",
    oneTimeLink: (p) => `Need longer access without a subscription? 3-Month Pass (${p}) →`,
  },
  fr: {
    pending: "Redirection Stripe …",
    consentPrefix: "J'accepte les",
    terms: "CGV",
    withdrawal: "Rétractation",
    privacy: "Confidentialité",
    consentError: "Veuillez confirmer les conditions pour continuer.",
    genericError: "Redirection impossible — veuillez passer par la page tarifs.",
    tabSubscription: "Essai 0,00 € (7j)",
    tabPass: (p) => `Pass 14 Jours (${p} · Sans Abo)`,
    trialSummary: (p) => `0,00 € aujourd'hui pendant 7 jours · puis ${p}/mois (résiliable en 1 clic avant le 8e jour).`,
    stdSummary: (p) => `Accès complet immédiat · ${p}/mois · sans engagement.`,
    passSummary: (p) => `Paiement unique de ${p} pour 14 jours d'accès complet (rôles TJ, PDF & IA) — sans abonnement.`,
    passSubmit: (p) => `Activer le Pass 14 Jours (${p} · Sans Abo) →`,
    passNote: "Paiement unique par carte, Apple Pay ou Google Pay · fin automatique.",
    oneTimeLink: (p) => `Besoin de plus de temps sans abonnement ? Pass 3 Mois (${p}) →`,
  },
  es: {
    pending: "Abriendo Stripe …",
    consentPrefix: "Acepto los",
    terms: "Términos",
    withdrawal: "Desistimiento",
    privacy: "Privacidad",
    consentError: "Confirma las condiciones para continuar.",
    genericError: "No se pudo abrir el pago — usa la página de tarifas.",
    tabSubscription: "Prueba 0,00 € (7d)",
    tabPass: (p) => `Pase 14 Días (${p} · Sin Suscripción)`,
    trialSummary: (p) => `Hoy 0,00 € durante 7 días · desde el día 8 ${p}/mes (cancelable en 1 clic antes).`,
    stdSummary: (p) => `Acceso completo inmediato · ${p}/mes · cancela cuando quieras.`,
    passSummary: (p) => `Pago único de ${p} por 14 días de acceso total (edictos BOE, PDF e IA) — sin suscripción.`,
    passSubmit: (p) => `Activar Pase 14 Días (${p} · Pago Único) →`,
    passNote: "Pago único con tarjeta, Apple Pay o Google Pay · no se renueva.",
    oneTimeLink: (p) => `¿Más tiempo sin suscripción? Pase Único de 3 Meses (${p}) →`,
  },
  it: {
    pending: "Apertura Stripe …",
    consentPrefix: "Accetto",
    terms: "Termini",
    withdrawal: "Recesso",
    privacy: "Privacy",
    consentError: "Conferma le condizioni per procedere.",
    genericError: "Impossibile avviare il pagamento — apri la pagina piani.",
    tabSubscription: "Prova 0,00 € (7g)",
    tabPass: (p) => `Pass 14 Giorni (${p} · Senza Abb.)`,
    trialSummary: (p) => `Oggi 0,00 € per 7 giorni completi · dal giorno 8 ${p}/mese (disdetta in 1 clic prima).`,
    stdSummary: (p) => `Accesso completo immediato · ${p}/mese · disdici quando vuoi.`,
    passSummary: (p) => `Pagamento unico di ${p} per 14 giorni completi (R.G.E., perizie PDF e IA) — senza abbonamento.`,
    passSubmit: (p) => `Attiva Pass 14 Giorni (${p} · Una Tantum) →`,
    passNote: "Pagamento singolo con carta, Apple Pay o Google Pay · scade da solo.",
    oneTimeLink: (p) => `Più tempo senza abbonamento? Pass Unico 3 Mesi (${p}) →`,
  },
};
