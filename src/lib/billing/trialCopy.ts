import { BillingCurrency } from "@/lib/billing/billingConfig";
import { formatCardPrice, formatPrice } from "@/lib/billing/billingFormat";
import { LocaleOption } from "@/lib/constants";

export const STRIPE_TRIAL_DAYS = 7;

export interface TrialLocaleCopy {
  /** Homepage Free card badge */
  homeFreeBadge: string;
  /** Homepage Investor/Pro card note */
  homeTrialBadge: string;
  /** /buchen radio card badge on monthly subscription */
  orderBadge: string;
  /** /buchen radio card period label during 7-day trial */
  orderTrialPeriod: string;
  /** /buchen radio card subline: "{price}" = recurring price, "{period}" = monthly word */
  orderTrialTerm: (recurringCardPrice: string, period: string) => string;
  /** /buchen summary Start value when trial applies */
  summaryStartTrial: string;
  /** /buchen summary label for recurring charge from day 8 */
  summaryAfterTrialLabel: string;
  /** /buchen summary value for recurring charge from day 8 */
  summaryAfterTrialValue: (recurringTotal: string, period: string) => string;
  /** /buchen summary Total label when 0.00 due today */
  summaryDueTodayLabel: string;
  /** /buchen summary note under 0.00 Total */
  summaryDueTodayNote: (recurringTotal: string, period: string, vat: string) => string;
  /** § 312j BGB compliant submit button for 7-day trial */
  submitTrial: string;
  /** Payment note below button when trial applies */
  paymentNoteTrial: string;
  /** Order confirmation email price string when 0.00 trial starts */
  mailTrialPrice: (zeroFormatted: string, recurringFormatted: string, period: string) => string;
  /** ListingUnlockBanner copy */
  unlock: {
    kickerCanClaim: string;
    kickerUsed: string;
    titleCanClaim: string;
    titleTrial: string;
    titleStandard: string;
    bodyCanClaim: string;
    bodyTrial: string;
    bodyStandard: string;
    items: [string, string, string, string];
    claimFreeCta: string;
    claimFreePending: string;
    claimFreeNote: string;
    claimFreeErrorUsed: string;
    claimFreeErrorDevice: string;
    claimFreeErrorGeneric: string;
    secondaryTrialCta: string;
    primaryTrialCta: string;
    primaryTrialNote: string;
    primaryStandardCta: string;
    primaryStandardNote: string;
    viewUnlockedPrefix: string;
    viewUnlockedLink: string;
  };
  /** Celebratory banner shown on the 1 unlocked free dossier */
  unlockedNotice: {
    kicker: string;
    title: string;
    body: string;
    ctaTrial: string;
    ctaStandard: string;
    noteTrial: string;
  };
}

export function formatZeroTrialPrice(currency: BillingCurrency, lang: LocaleOption, card = false): string {
  return card ? formatCardPrice({ amount: 0, currency }, lang) : formatPrice({ amount: 0, currency }, lang);
}

export const TRIAL_COPY: Record<LocaleOption, TrialLocaleCopy> = {
  de: {
    homeFreeBadge: "Inkl. 1 Gratis-Dossier nach E-Mail-Bestätigung",
    homeTrialBadge: "7 Tage kostenlos testen · Heute 0,00 €",
    orderBadge: "7 Tage gratis",
    orderTrialPeriod: "7 Tage testen",
    orderTrialTerm: (price, period) =>
      `Heute 0,00 € für 7 Tage Vollzugang — danach ${price} ${period}. Jederzeit mit 1 Klick vor Ablauf kündbar.`,
    summaryStartTrial: "Sofort — 7 Tage kostenlos testen",
    summaryAfterTrialLabel: "Ab Tag 8 (falls nicht gekündigt)",
    summaryAfterTrialValue: (price, period) => `${price} ${period} · monatlich kündbar`,
    summaryDueTodayLabel: "Heute fällig (Tag 1–7)",
    summaryDueTodayNote: (price, period, vat) =>
      `Heute 0,00 € (Zahlungsmittel wird bei Stripe hinterlegt). Ab Tag 8 automatisch ${price} ${period} (${vat}), sofern Sie nicht vor Ablauf mit 1 Klick im Konto kündigen.`,
    submitTrial: "7 Tage kostenlos testen · danach zahlungspflichtig",
    paymentNoteTrial:
      "Heute 0,00 € Abbuchung bei Stripe (Karte, Apple Pay, Google Pay). 1-Klick-Kündigung jederzeit im Konto vor Tag 8.",
    mailTrialPrice: (zero, recurring, period) =>
      `${zero} heute (7 Tage kostenlose Testphase, ab Tag 8 ${recurring} ${period})`,
    unlock: {
      kickerCanClaim: "1 Gratis-Dossier verfügbar · Volle Einsicht für 1 Wunschobjekt",
      kickerUsed: "Vorschau-Modus · Gratis-Dossier bereits für ein anderes Objekt eingelöst",
      titleCanClaim: "Dieses Objekt jetzt als Ihr 1 Gratis-Dossier komplett freischalten",
      titleTrial: "Alle Objekte & Gutachten jetzt 7 Tage kostenlos testen (0,00 € heute)",
      titleStandard: "Vollständige Akte, Adresse & Verkehrswert für dieses Objekt freischalten",
      bodyCanClaim:
        "Jedes bestätigte Konto erhält einmalig 1 vollständiges Objekt-Dossier kostenlos (ohne Zahlungsmethode) — inklusive Aktenzeichen, Hausnummer, Gebotsrechner, Gerichts-PDF & KI-Risiko-Check:",
      bodyTrial:
        "Sie haben Ihr 1 Gratis-Dossier bereits genutzt. Testen Sie jetzt den kompletten Investor-Zugang für alle Verfahren 7 Tage lang für 0,00 € — jederzeit mit 1 Klick vor Ablauf kündbar:",
      bodyStandard:
        "Im kostenlosen Such-Alert-Konto sind Identifikationsmerkmale zum Schutz vor automatisiertem Scraping geschwärzt. Mit dem Investor-Zugang schalten Sie alle Verfahren sofort frei:",
      items: [
        "Ungekürztes Aktenzeichen & Grundbuchblatt",
        "Exakte Hausnummer, Flurstück & Lagekarte",
        "Verkehrswert, 5/10- & 7/10-Limits + Gebotsrechner",
        "Amtliche Edikt-/Gutachten-PDFs & KI-Risiko-Analyse",
      ],
      claimFreeCta: "1 Gratis-Dossier für dieses Objekt einlösen (0 €)",
      claimFreePending: "Dossier wird freigeschaltet …",
      claimFreeNote: "Einmalig 1 Objekt pro Konto · Sofort ohne Zahlungsmittel · Kein Abo, endet automatisch ohne Kosten",
      claimFreeErrorUsed: "Ihr 1 Gratis-Dossier wurde bereits eingelöst. Nutzen Sie optional die 7-Tage-Testphase.",
      claimFreeErrorDevice: "Auf diesem Gerät wurde bereits ein Gratis-Dossier eingelöst. Nutzen Sie optional die 7-Tage-Testphase.",
      claimFreeErrorGeneric: "Freischaltung fehlgeschlagen. Bitte Seite neu laden und erneut versuchen.",
      secondaryTrialCta: "Oder direkt alle Objekte 7 Tage gratis testen →",
      primaryTrialCta: "Jetzt 7 Tage kostenlos testen (0,00 € heute)",
      primaryTrialNote: "Heute 0,00 € bei Stripe · Vor Tag 8 jederzeit mit 1 Klick kündbar",
      primaryStandardCta: "Vollständige Akte jetzt freischalten",
      primaryStandardNote: "Sofortige Freischaltung nach Buchung · Monatlich kündbar",
      viewUnlockedPrefix: "Ihr freigeschaltetes Gratis-Dossier:",
      viewUnlockedLink: "Freigeschaltetes Objekt öffnen →",
    },
    unlockedNotice: {
      kicker: "✓ Ihr 1 Gratis-Dossier ist aktiv (100 % kostenlos · kein Abo)",
      title: "Alle Aktenzeichen, Adressen, PDFs & KI-Analysen sind für dieses Objekt freigeschaltet",
      body: "Dieses Verfahren bleibt dauerhaft kostenlos in Ihrem Konto geöffnet — keine Zahlungsdaten hinterlegt, keine automatische Abbuchung oder Abo-Verlängerung (keine Kündigung nötig). Möchten Sie optional alle Versteigerungen vergleichen?",
      ctaTrial: "Alle Objekte 7 Tage gratis testen",
      ctaStandard: "Alle Objekte freischalten",
      noteTrial: "Optionaler Vollzugang · Heute 0,00 € · Jederzeit vor Tag 8 kündbar",
    },
  },
  tr: {
    homeFreeBadge: "E-posta onayı sonrası 1 Ücretsiz Dosya dahil",
    homeTrialBadge: "7 gün ücretsiz dene · Bugün 0,00 ₺",
    orderBadge: "7 gün ücretsiz",
    orderTrialPeriod: "7 gün deneme",
    orderTrialTerm: (price, period) =>
      `7 gün tam erişim için bugün 0 ₺ — ardından ${price} ${period}. Süre dolmadan tek tıkla iptal edilebilir.`,
    summaryStartTrial: "Hemen — 7 gün ücretsiz deneme",
    summaryAfterTrialLabel: "8. günden itibaren (iptal edilmezse)",
    summaryAfterTrialValue: (price, period) => `${price} ${period} · aylık iptal imkânı`,
    summaryDueTodayLabel: "Bugün ödenecek tutar (1–7. gün)",
    summaryDueTodayNote: (price, period, vat) =>
      `Bugün 0,00 ₺ (ödeme yöntemi Stripe üzerinde doğrulanır). 8. günden önce hesabınızdan tek tıkla iptal etmezseniz otomatik olarak ${price} ${period} (${vat}) tahsil edilir.`,
    submitTrial: "7 gün ücretsiz dene · sonrasında ücretli abonelik",
    paymentNoteTrial:
      "Bugün Stripe'ta 0,00 ₺ çekim (Kart, Apple Pay, Google Pay). 8. günden önce hesapta tek tıkla iptal.",
    mailTrialPrice: (zero, recurring, period) =>
      `Bugün ${zero} (7 gün ücretsiz deneme, 8. günden itibaren ${recurring} ${period})`,
    unlock: {
      kickerCanClaim: "1 Ücretsiz Dosya hakkınız hazır · Seçtiğiniz 1 ihale için tam erişim",
      kickerUsed: "Önizleme Modu · Ücretsiz dosya hakkınız başka bir ihalede kullanıldı",
      titleCanClaim: "Bu ihaleyi 1 Ücretsiz Dosya hakkınızla şimdi tamamen açın",
      titleTrial: "Tüm ihaleleri ve raporları 7 gün ücretsiz deneyin (bugün 0 ₺)",
      titleStandard: "Bu ihale için tam esas numarasını, açık adresi ve muhammen bedeli açın",
      bodyCanClaim:
        "Doğrulanmış her hesap, kart bilgisi girmeden seçtiği 1 ihale dosyasını tamamen ücretsiz açabilir — Esas No, açık adres, teklif hesaplayıcı, resmi PDF ve yapay zekâ risk analizi dahil:",
      bodyTrial:
        "1 Ücretsiz Dosya hakkınızı kullandınız. Şimdi tüm ihalelere sınırsız erişimi 7 gün boyunca 0 ₺ ile deneyin — süre bitmeden tek tıkla iptal edebilirsiniz:",
      bodyStandard:
        "Ücretsiz bildirim hesabında dosya kimlik bilgileri gizlenmiştir. Yatırımcı erişimi ile tüm dosyaları anında açabilirsiniz:",
      items: [
        "Tam Esas No, İcra Dairesi ve Ada/Parsel bilgileri",
        "Açık sokak adresi, bağımsız bölüm ve konum haritası",
        "Muhammen bedel, %50 açılış bedeli, teminat ve ihale hesaplayıcı",
        "Resmi şartname/ilan PDF belgeleri ve yapay zeka risk analizi",
      ],
      claimFreeCta: "Bu ihale için 1 Ücretsiz Dosya hakkımı kullan (0 ₺)",
      claimFreePending: "Dosya açılıyor …",
      claimFreeNote: "Hesap başına 1 ihale · Kart gerekmez · Abonelik veya otomatik yenileme yok",
      claimFreeErrorUsed: "Ücretsiz dosya hakkınız zaten kullanıldı. İsterseniz 7 günlük ücretsiz denemeyi başlatabilirsiniz.",
      claimFreeErrorDevice: "Bu cihazda daha önce ücretsiz dosya hakkı kullanıldı. İsterseniz 7 günlük denemeyi başlatabilirsiniz.",
      claimFreeErrorGeneric: "İşlem tamamlanamadı. Lütfen sayfayı yenileyip tekrar deneyin.",
      secondaryTrialCta: "Veya tüm ihaleleri 7 gün ücretsiz deneyin →",
      primaryTrialCta: "7 gün ücretsiz dene (bugün 0 ₺)",
      primaryTrialNote: "Bugün 0 ₺ · 8. günden önce tek tıkla iptal",
      primaryStandardCta: "Dosyanın tamamını şimdi aç",
      primaryStandardNote: "Ödeme sonrası anında erişim · İstediğiniz zaman iptal edin",
      viewUnlockedPrefix: "Açık ücretsiz dosyanız:",
      viewUnlockedLink: "Açtığınız ihaleye git →",
    },
    unlockedNotice: {
      kicker: "✓ 1 Ücretsiz Dosya hakkınız aktif (%100 ücretsiz · abonelik yok)",
      title: "Esas numarası, açık adres, resmi PDF'ler ve yapay zekâ analizi tamamen açık",
      body: "Bu ihale dosyası hesabınızda kalıcı olarak ücretsiz açıktır — kart bilgisi kayıtlı değildir, otomatik çekim veya abonelik yenilemesi yoktur (iptal gerekmez). İsteğe bağlı olarak tüm ihaleleri karşılaştırmak ister misiniz?",
      ctaTrial: "Tüm ihaleleri 7 gün ücretsiz dene",
      ctaStandard: "Tüm ihaleleri aç",
      noteTrial: "İsteğe bağlı tam erişim · Bugün 0 ₺ · 8. günden önce iptal edilebilir",
    },
  },
  en: {
    homeFreeBadge: "Includes 1 Free Full Dossier after email verification",
    homeTrialBadge: "7-day free trial · 0.00 due today",
    orderBadge: "7 days free",
    orderTrialPeriod: "7-day trial",
    orderTrialTerm: (price, period) =>
      `0.00 due today for 7 days of full access — then ${price} ${period}. Cancel in 1 click anytime before day 8.`,
    summaryStartTrial: "Immediately — 7-day free trial",
    summaryAfterTrialLabel: "From day 8 (unless cancelled)",
    summaryAfterTrialValue: (price, period) => `${price} ${period} · cancel monthly anytime`,
    summaryDueTodayLabel: "Due today (Days 1–7)",
    summaryDueTodayNote: (price, period, vat) =>
      `0.00 charged today (payment method verified by Stripe). Automatically renews at ${price} ${period} (${vat}) on day 8 unless cancelled with 1 click in your account beforehand.`,
    submitTrial: "Start 7-day free trial · paid subscription after",
    paymentNoteTrial:
      "0.00 charged today on Stripe (Card, Apple Pay, Google Pay). One-click cancellation anytime in your account before day 8.",
    mailTrialPrice: (zero, recurring, period) =>
      `${zero} today (7-day free trial, then ${recurring} ${period} from day 8)`,
    unlock: {
      kickerCanClaim: "1 Free Dossier available · Unlock 1 full property file now",
      kickerUsed: "Preview Mode · Your 1 Free Dossier was used on another property",
      titleCanClaim: "Unlock this property completely as your 1 Free Dossier",
      titleTrial: "Try full Investor access across all lots free for 7 days (0.00 today)",
      titleStandard: "Unlock the full case file, exact street address & appraised value",
      bodyCanClaim:
        "Every verified account includes 1 complimentary full property dossier (no card required) — including unredacted case number, street address, bid calculator, official PDFs & AI risk check:",
      bodyTrial:
        "You have already redeemed your 1 Free Dossier. Start your 7-day free Investor trial now to unlock all auction properties for 0.00 today — cancel in 1 click anytime before day 8:",
      bodyStandard:
        "In the free alert account, identifying case fields are redacted. Upgrade to Investor access to unlock all official dossier records immediately:",
      items: [
        "Unredacted court file number & land registry reference",
        "Exact street address, parcel number & location map",
        "Appraised value, statutory minimum bid limits & bid calculator",
        "Official court notice PDFs & AI risk verdict",
      ],
      claimFreeCta: "Redeem 1 Free Dossier on this property (0.00)",
      claimFreePending: "Unlocking dossier …",
      claimFreeNote: "1 free property per account · No card needed · No subscription or auto-renewal",
      claimFreeErrorUsed: "Your 1 Free Dossier was already used. Optionally start a 7-day free trial for unlimited access.",
      claimFreeErrorDevice: "A Free Dossier was already claimed on this device. Optionally start a 7-day free trial.",
      claimFreeErrorGeneric: "Could not unlock right now. Please reload the page and try again.",
      secondaryTrialCta: "Or unlock all properties with a 7-day free trial →",
      primaryTrialCta: "Start 7-day free trial (0.00 today)",
      primaryTrialNote: "0.00 due today via Stripe · Cancel in 1 click before day 8",
      primaryStandardCta: "Unlock full dossier now",
      primaryStandardNote: "Instant activation · Cancel monthly anytime",
      viewUnlockedPrefix: "Your unlocked free dossier:",
      viewUnlockedLink: "Open unlocked property →",
    },
    unlockedNotice: {
      kicker: "✓ Your 1 Free Dossier is active (100% free · no subscription)",
      title: "Full case number, street address, official PDFs & AI verdict unlocked on this property",
      body: "This dossier stays permanently free in your account — no payment details stored, no automatic charge or subscription renewal (no cancellation needed). Want optional unlimited access to all auction lots?",
      ctaTrial: "Try all properties 7 days free",
      ctaStandard: "Unlock all properties",
      noteTrial: "Optional full access · 0.00 today · Cancel anytime before day 8",
    },
  },
  fr: {
    homeFreeBadge: "1 Dossier Complet Gratuit inclus après validation e-mail",
    homeTrialBadge: "Essai gratuit 7 jours · 0,00 € aujourd'hui",
    orderBadge: "7 jours gratuits",
    orderTrialPeriod: "essai 7 jours",
    orderTrialTerm: (price, period) =>
      `0,00 € aujourd'hui pendant 7 jours d'accès complet — puis ${price} ${period}. Résiliable en 1 clic avant la fin de l'essai.`,
    summaryStartTrial: "Immédiat — 7 jours d'essai gratuit",
    summaryAfterTrialLabel: "À partir du 8e jour (sauf résiliation)",
    summaryAfterTrialValue: (price, period) => `${price} ${period} · résiliable chaque mois`,
    summaryDueTodayLabel: "À payer aujourd'hui (Jours 1 à 7)",
    summaryDueTodayNote: (price, period, vat) =>
      `0,00 € débité aujourd'hui (moyen de paiement enregistré sur Stripe). Puis ${price} ${period} (${vat}) à compter du 8e jour, sauf résiliation en 1 clic depuis votre compte avant l'échéance.`,
    submitTrial: "Essayer 7 jours gratuitement · puis abonnement payant",
    paymentNoteTrial:
      "0,00 € débité aujourd'hui sur Stripe (Carte, Apple Pay, Google Pay). Résiliation en 1 clic à tout moment avant le 8e jour.",
    mailTrialPrice: (zero, recurring, period) =>
      `${zero} aujourd'hui (essai gratuit de 7 jours, puis ${recurring} ${period} dès le 8e jour)`,
    unlock: {
      kickerCanClaim: "1 Dossier Gratuit disponible · Débloquez 1 bien complet sans carte",
      kickerUsed: "Mode aperçu · Votre Dossier Gratuit a déjà été utilisé sur un autre bien",
      titleCanClaim: "Débloquer intégralement ce bien avec votre 1 Dossier Gratuit",
      titleTrial: "Essayez l'accès Investisseur complet 7 jours gratuitement (0,00 € aujourd'hui)",
      titleStandard: "Débloquer le dossier complet, l'adresse exacte et la mise à prix",
      bodyCanClaim:
        "Chaque compte vérifié bénéficie d'un dossier immobilier complet offert (sans carte bancaire) — incluant numéro de rôle, adresse exacte, calculateur d'enchères, PDF officiels et analyse IA :",
      bodyTrial:
        "Vous avez déjà utilisé votre Dossier Gratuit. Testez maintenant l'accès Investisseur illimité sur toutes les ventes pendant 7 jours à 0,00 € — résiliable en 1 clic avant le 8e jour :",
      bodyStandard:
        "Dans le compte d'alerte gratuit, les identifiants du dossier sont masqués. Passez à l'accès Investisseur pour débloquer immédiatement toutes les pièces officielles :",
      items: [
        "Numéro de rôle complet et référence cadastrale",
        "Adresse exacte, parcelle et carte de localisation",
        "Valeur d'estimation, mise à prix et calculateur d'enchères",
        "Cahier des conditions de vente / PDF officiels et analyse IA",
      ],
      claimFreeCta: "Débloquer ce bien avec mon 1 Dossier Gratuit (0 €)",
      claimFreePending: "Déblocage du dossier …",
      claimFreeNote: "1 bien offert par compte · Sans carte bancaire · Aucun abonnement ni renouvellement automatique",
      claimFreeErrorUsed: "Votre Dossier Gratuit a déjà été utilisé. Vous pouvez essayer l'accès complet 7 jours gratuitement.",
      claimFreeErrorDevice: "Un Dossier Gratuit a déjà été activé sur cet appareil. Essayez l'accès 7 jours gratuitement.",
      claimFreeErrorGeneric: "Déblocage impossible pour le moment. Veuillez recharger la page.",
      secondaryTrialCta: "Ou tester tous les biens gratuitement pendant 7 jours →",
      primaryTrialCta: "Essayer 7 jours gratuitement (0,00 € aujourd'hui)",
      primaryTrialNote: "0,00 € aujourd'hui sur Stripe · Résiliable en 1 clic avant le 8e jour",
      primaryStandardCta: "Débloquer le dossier complet",
      primaryStandardNote: "Activation immédiate · Résiliable chaque mois",
      viewUnlockedPrefix: "Votre dossier gratuit débloqué :",
      viewUnlockedLink: "Ouvrir le bien débloqué →",
    },
    unlockedNotice: {
      kicker: "✓ Votre 1 Dossier Gratuit est actif (100 % gratuit · sans abonnement)",
      title: "Numéro de rôle, adresse exacte, pièces PDF et analyse IA débloqués pour ce bien",
      body: "Ce dossier reste ouvert gratuitement dans votre compte — aucune carte enregistrée, aucun prélèvement ni renouvellement automatique (aucune résiliation nécessaire). Souhaitez-vous comparer toutes les enchères en option ?",
      ctaTrial: "Essayer tous les biens 7 jours gratuits",
      ctaStandard: "Débloquer tous les biens",
      noteTrial: "Accès complet facultatif · 0,00 € aujourd'hui · Résiliable avant le 8e jour",
    },
  },
  es: {
    homeFreeBadge: "Incluye 1 Expediente Completo Gratis tras confirmar tu correo",
    homeTrialBadge: "Prueba gratis 7 días · 0,00 € hoy",
    orderBadge: "7 días gratis",
    orderTrialPeriod: "prueba 7 días",
    orderTrialTerm: (price, period) =>
      `0,00 € hoy por 7 días de acceso total — después ${price} ${period}. Cancela con 1 clic antes del día 8.`,
    summaryStartTrial: "Inmediato — 7 días de prueba gratuita",
    summaryAfterTrialLabel: "A partir del día 8 (si no cancelas)",
    summaryAfterTrialValue: (price, period) => `${price} ${period} · cancelación mensual`,
    summaryDueTodayLabel: "Importe hoy (Días 1–7)",
    summaryDueTodayNote: (price, period, vat) =>
      `0,00 € hoy (método de pago verificado en Stripe). A partir del día 8 se cobra ${price} ${period} (${vat}), salvo que canceles con 1 clic desde tu cuenta antes de que finalice la prueba.`,
    submitTrial: "Probar 7 días gratis · después suscripción de pago",
    paymentNoteTrial:
      "0,00 € cobrados hoy en Stripe (Tarjeta, Apple Pay, Google Pay). Cancelación en 1 clic en cualquier momento antes del día 8.",
    mailTrialPrice: (zero, recurring, period) =>
      `${zero} hoy (7 días de prueba gratuita, después ${recurring} ${period} desde el día 8)`,
    unlock: {
      kickerCanClaim: "1 Expediente Gratis disponible · Desbloquea 1 subasta completa sin tarjeta",
      kickerUsed: "Modo vista previa · Ya utilizaste tu Expediente Gratis en otro lote",
      titleCanClaim: "Desbloquear esta subasta completa con tu 1 Expediente Gratis",
      titleTrial: "Prueba el acceso Inversor en todas las subastas BOE 7 días gratis (0,00 € hoy)",
      titleStandard: "Desbloquear el expediente completo, dirección exacta y valor de tasación",
      bodyCanClaim:
        "Cada cuenta verificada incluye 1 expediente judicial completo gratis (sin tarjeta) — con número de procedimiento, dirección exacta, calculadora 70 %/50 % LEC, PDFs oficiales y análisis IA:",
      bodyTrial:
        "Ya has canjeado tu Expediente Gratis. Prueba ahora el acceso Inversor ilimitado durante 7 días por 0,00 € hoy — cancela en 1 clic antes del día 8:",
      bodyStandard:
        "En la cuenta gratuita de alertas, los datos identificativos están ocultos. Active el acceso Inversor para desbloquear al instante todos los datos oficiales:",
      items: [
        "Número de expediente judicial completo y referencia registral",
        "Dirección exacta, parcela catastral y mapa de ubicación",
        "Valor de tasación, puja mínima recomendada y calculadora",
        "Edicto oficial / certificación de cargas en PDF y análisis IA",
      ],
      claimFreeCta: "Canjear 1 Expediente Gratis en esta subasta (0 €)",
      claimFreePending: "Desbloqueando expediente …",
      claimFreeNote: "1 lote gratis por cuenta · Sin tarjeta · Sin suscripción ni renovación automática",
      claimFreeErrorUsed: "Tu Expediente Gratis ya fue utilizado. Si quieres, inicia tu prueba gratuita de 7 días.",
      claimFreeErrorDevice: "Ya se utilizó un Expediente Gratis en este dispositivo. Puedes iniciar la prueba de 7 días.",
      claimFreeErrorGeneric: "No se pudo desbloquear. Recarga la página e inténtalo de nuevo.",
      secondaryTrialCta: "O prueba todas las subastas gratis durante 7 días →",
      primaryTrialCta: "Probar 7 días gratis (0,00 € hoy)",
      primaryTrialNote: "0,00 € hoy en Stripe · Cancela con 1 clic antes del día 8",
      primaryStandardCta: "Desbloquear expediente completo",
      primaryStandardNote: "Activación inmediata · Cancelación mensual en cualquier momento",
      viewUnlockedPrefix: "Tu expediente gratuito desbloqueado:",
      viewUnlockedLink: "Abrir subasta desbloqueada →",
    },
    unlockedNotice: {
      kicker: "✓ Tu 1 Expediente Gratis está activo (100 % gratis · sin suscripción)",
      title: "Expediente completo, dirección exacta, PDFs oficiales y análisis IA desbloqueados",
      body: "Esta subasta permanece abierta gratis en tu cuenta — sin datos de pago guardados ni cobro o renovación automática (no requiere cancelación). ¿Quieres analizar opcionalmente todas las subastas?",
      ctaTrial: "Probar todas 7 días gratis",
      ctaStandard: "Desbloquear todas las subastas",
      noteTrial: "Acceso completo opcional · 0,00 € hoy · Cancela antes del día 8",
    },
  },
  it: {
    homeFreeBadge: "Include 1 Fascicolo Completo Gratis dopo la conferma e-mail",
    homeTrialBadge: "Prova gratuita 7 giorni · 0,00 € oggi",
    orderBadge: "7 giorni gratis",
    orderTrialPeriod: "prova 7 giorni",
    orderTrialTerm: (price, period) =>
      `0,00 € oggi per 7 giorni di accesso completo — poi ${price} ${period}. Disdetta con 1 clic prima dell'8° giorno.`,
    summaryStartTrial: "Immediato — 7 giorni di prova gratuita",
    summaryAfterTrialLabel: "Dall'8° giorno (salvo disdetta)",
    summaryAfterTrialValue: (price, period) => `${price} ${period} · disdetta mensile`,
    summaryDueTodayLabel: "Totale oggi (Giorni 1–7)",
    summaryDueTodayNote: (price, period, vat) =>
      `0,00 € addebitati oggi (metodo di pagamento verificato su Stripe). Dall'8° giorno ${price} ${period} (${vat}), salvo disdetta con 1 clic nel tuo account prima della scadenza.`,
    submitTrial: "Prova 7 giorni gratis · poi abbonamento a pagamento",
    paymentNoteTrial:
      "0,00 € addebitati oggi su Stripe (Carta, Apple Pay, Google Pay). Disdetta con 1 clic in qualsiasi momento prima dell'8° giorno.",
    mailTrialPrice: (zero, recurring, period) =>
      `${zero} oggi (7 giorni di prova gratuita, poi ${recurring} ${period} dall'8° giorno)`,
    unlock: {
      kickerCanClaim: "1 Fascicolo Gratis disponibile · Sblocca 1 asta completa senza carta",
      kickerUsed: "Modalità anteprima · Il tuo Fascicolo Gratis è già stato usato su un altro lotto",
      titleCanClaim: "Sblocca integralmente questo lotto con il tuo 1 Fascicolo Gratis",
      titleTrial: "Prova l'accesso Investitore su tutte le aste per 7 giorni gratis (0,00 € oggi)",
      titleStandard: "Sblocca il fascicolo completo, l'indirizzo esatto e la perizia",
      bodyCanClaim:
        "Ogni account verificato include 1 fascicolo d'asta completo gratuito (senza carta) — con R.G. completo, indirizzo civico, calcolatore offerta minima 75 %, perizia PDF e analisi IA:",
      bodyTrial:
        "Hai già utilizzato il tuo Fascicolo Gratis. Attiva ora 7 giorni di prova gratuita del piano Investitore su tutti i lotti a 0,00 € oggi — disdetta in 1 clic prima dell'8° giorno:",
      bodyStandard:
        "Nell'account gratuito di avviso i dati identificativi sono oscurati. Attiva l'accesso Investitore per sbloccare subito tutti i documenti ufficiali:",
      items: [
        "Numero di R.G. completo e dati catastali (foglio/particella/sub)",
        "Indirizzo civico esatto e mappa di localizzazione",
        "Valore di stima, offerta minima (75 %) e calcolatore d'asta",
        "Avviso di vendita / perizia PDF ufficiale e analisi rischi IA",
      ],
      claimFreeCta: "Sblocca questo lotto con 1 Fascicolo Gratis (0 €)",
      claimFreePending: "Sblocco fascicolo in corso …",
      claimFreeNote: "1 lotto gratis per account · Senza carta · Nessun abbonamento né rinnovo automatico",
      claimFreeErrorUsed: "Il tuo Fascicolo Gratis è già stato utilizzato. Se vuoi, avvia la prova gratuita di 7 giorni.",
      claimFreeErrorDevice: "Un Fascicolo Gratis è già stato riscattato su questo dispositivo. Puoi avviare la prova di 7 giorni.",
      claimFreeErrorGeneric: "Impossibile sbloccare ora. Ricarica la pagina e riprova.",
      secondaryTrialCta: "Oppure prova tutti i lotti gratis per 7 giorni →",
      primaryTrialCta: "Prova 7 giorni gratis (0,00 € oggi)",
      primaryTrialNote: "0,00 € oggi su Stripe · Disdetta con 1 clic prima dell'8° giorno",
      primaryStandardCta: "Sblocca il fascicolo completo",
      primaryStandardNote: "Attivazione immediata · Disdetta mensile in qualsiasi momento",
      viewUnlockedPrefix: "Il tuo fascicolo gratuito sbloccato:",
      viewUnlockedLink: "Apri il lotto sbloccato →",
    },
    unlockedNotice: {
      kicker: "✓ Il tuo 1 Fascicolo Gratis è attivo (100% gratis · nessun abbonamento)",
      title: "R.G., indirizzo esatto, perizia PDF e analisi IA sbloccati per questo immobile",
      body: "Questo fascicolo resta sempre aperto gratuitamente nel tuo account — nessun dato di pagamento salvato, nessun addebito né rinnovo automatico (nessuna disdetta necessaria). Vuoi confrontare facoltativamente tutte le aste?",
      ctaTrial: "Prova tutte le aste 7 giorni gratis",
      ctaStandard: "Sblocca tutte le aste",
      noteTrial: "Accesso completo facoltativo · 0,00 € oggi · Disdetta prima dell'8° giorno",
    },
  },
  pl: {
    homeFreeBadge: "W tym 1 Darmowe Pełne Akta po potwierdzeniu e-mail",
    homeTrialBadge: "7 dni za darmo · Dzisiaj 0,00 zł",
    orderBadge: "7 dni za darmo",
    orderTrialPeriod: "7 dni próby",
    orderTrialTerm: (price, period) =>
      `Dzisiaj 0,00 zł za 7 dni pełnego dostępu — następnie ${price} ${period}. Anulowanie 1 kliknięciem przed końcem okresu próbnego.`,
    summaryStartTrial: "Natychmiast — 7 dni za darmo",
    summaryAfterTrialLabel: "Od 8. dnia (jeśli nie anulowano)",
    summaryAfterTrialValue: (price, period) => `${price} ${period} · miesięczne wypowiedzenie`,
    summaryDueTodayLabel: "Do zapłaty dzisiaj (Dni 1–7)",
    summaryDueTodayNote: (price, period, vat) =>
      `Dzisiaj 0,00 zł (metoda płatności weryfikowana w Stripe). Od 8. dnia automatycznie ${price} ${period} (${vat}), chyba że wcześniej anulujesz 1 kliknięciem na koncie.`,
    submitTrial: "Wypróbuj 7 dni za darmo · potem plan płatny",
    paymentNoteTrial:
      "Dzisiaj 0,00 zł w Stripe (karta, Apple Pay, Google Pay). Anulowanie 1 kliknięciem przed 8. dniem.",
    mailTrialPrice: (zero, recurring, period) =>
      `${zero} dzisiaj (7 dni bezpłatnego testu, od 8. dnia ${recurring} ${period})`,
    unlock: {
      kickerCanClaim: "1 Darmowe Pełne Akta dostępne · Pełny wgląd w 1 wybraną licytację",
      kickerUsed: "Tryb podglądu · Darmowe akta zostały już wykorzystane dla innego obiektu",
      titleCanClaim: "Odblokuj ten obiekt teraz jako swoje 1 Darmowe Pełne Akta",
      titleTrial: "Przetestuj wszystkie licytacje i operaty przez 7 dni za darmo (0,00 zł dzisiaj)",
      titleStandard: "Odblokuj pełne akta, adres i sumę oszacowania dla tej nieruchomości",
      bodyCanClaim:
        "Każde potwierdzone konto otrzymuje jednorazowo 1 kompletne akta licytacji za darmo (bez podawania karty) — z sygnaturą, dokładnym adresem, kalkulatorem KPC, PDF z sądu i analizą AI:",
      bodyTrial:
        "Twoje 1 Darmowe Akta zostały już wykorzystane. Przetestuj pełny dostęp Investor do wszystkich licytacji przez 7 dni za 0,00 zł — anulowanie 1 kliknięciem przed końcem:",
      bodyStandard:
        "Na darmowym koncie dane identyfikacyjne są ukryte w celu ochrony przed scrapingiem. Z planem Investor natychmiast odblokujesz wszystkie sprawy:",
      items: [
        "Pełna sygnatura akt i numer księgi wieczystej (KW)",
        "Dokładny adres, numer działki i mapa lokalizacji",
        "Suma oszacowania, progi 3/4 i 2/3 oraz kalkulator licytacji",
        "Oficjalne obwieszczenia / operaty PDF i analiza ryzyka AI",
      ],
      claimFreeCta: "Odbierz 1 Darmowe Akta dla tego obiektu (0 zł)",
      claimFreePending: "Odblokowywanie akt …",
      claimFreeNote: "Jednorazowo 1 nieruchomość na konto · Bez karty · Brak subskrypcji i automatycznych opłat",
      claimFreeErrorUsed: "Twoje 1 Darmowe Akta zostały już wykorzystane. Możesz uruchomić 7-dniowy okres próbny.",
      claimFreeErrorDevice: "Na tym urządzeniu wykorzystano już darmowe akta. Możesz uruchomić 7-dniowy test.",
      claimFreeErrorGeneric: "Nie udało się odblokować. Odśwież stronę i spróbuj ponownie.",
      secondaryTrialCta: "Lub przetestuj wszystkie obiekty 7 dni za darmo →",
      primaryTrialCta: "Wypróbuj 7 dni za darmo (0,00 zł dzisiaj)",
      primaryTrialNote: "Dzisiaj 0,00 zł w Stripe · Anulowanie 1 kliknięciem przed 8. dniem",
      primaryStandardCta: "Odblokuj pełne akta teraz",
      primaryStandardNote: "Natychmiastowa aktywacja · Miesięczne wypowiedzenie",
      viewUnlockedPrefix: "Twoje odblokowane darmowe akta:",
      viewUnlockedLink: "Otwórz odblokowany obiekt →",
    },
    unlockedNotice: {
      kicker: "✓ Twoje 1 Darmowe Akta są aktywne (100% za darmo · bez subskrypcji)",
      title: "Sygnatura, dokładny adres, dokumenty PDF i analiza AI są odblokowane dla tej sprawy",
      body: "Ta sprawa pozostaje trwale otwarta za darmo na Twoim koncie — bez karty, bez automatycznych opłat i bez konieczności wypowiedzenia. Chcesz porównać wszystkie licytacje?",
      ctaTrial: "Przetestuj wszystkie obiekty 7 dni za darmo",
      ctaStandard: "Odblokuj wszystkie obiekty",
      noteTrial: "Opcjonalny pełny dostęp · 0,00 zł dzisiaj · Anuluj przed 8. dniem",
    },
  },
  cs: {
    homeFreeBadge: "Včetně 1 kompletního spisu zdarma po potvrzení e-mailu",
    homeTrialBadge: "7 dní zdarma · Dnes 0 Kč",
    orderBadge: "7 dní zdarma",
    orderTrialPeriod: "7 dní na zkoušku",
    orderTrialTerm: (price, period) =>
      `Dnes 0 Kč na 7 dní plného přístupu — poté ${price} ${period}. Zrušení 1 kliknutím před vypršením.`,
    summaryStartTrial: "Okamžitě — 7 dní zdarma",
    summaryAfterTrialLabel: "Od 8. dne (pokud nebude zrušeno)",
    summaryAfterTrialValue: (price, period) => `${price} ${period} · měsíční výpověď`,
    summaryDueTodayLabel: "K úhradě dnes (Dny 1–7)",
    summaryDueTodayNote: (price, period, vat) =>
      `Dnes 0 Kč (platební metoda ověřena přes Stripe). Od 8. dne automaticky ${price} ${period} (${vat}), pokud předem nezrušíte 1 kliknutím v účtu.`,
    submitTrial: "Vyzkoušet 7 dní zdarma · poté placený tarif",
    paymentNoteTrial:
      "Dnes 0 Kč přes Stripe (karta, Apple Pay, Google Pay). Zrušení 1 kliknutím kdykoli před 8. dnem.",
    mailTrialPrice: (zero, recurring, period) =>
      `${zero} dnes (7 dní zdarma na zkoušku, od 8. dne ${recurring} ${period})`,
    unlock: {
      kickerCanClaim: "1 Spis zdarma k dispozici · Plný náhled pro 1 vybranou dražbu",
      kickerUsed: "Režim náhledu · Spis zdarma již byl použit u jiné nemovitosti",
      titleCanClaim: "Odemknout tuto nemovitost nyní jako svůj 1 Spis zdarma",
      titleTrial: "Vyzkoušejte všechny dražby a posudky na 7 dní zdarma (dnes 0 Kč)",
      titleStandard: "Odemknout kompletní spis, adresu a odhadní cenu této nemovitosti",
      bodyCanClaim:
        "Každý ověřený účet získá jednorázově 1 kompletní spis dražby zcela zdarma (bez karty) — včetně spisové značky, přesné adresy, kalkulačky, PDF posudku a AI analýzy:",
      bodyTrial:
        "Svůj 1 Spis zdarma jste již využili. Vyzkoušejte kompletní přístup Investor ke všem dražbám na 7 dní za 0 Kč — zrušení 1 kliknutím předem:",
      bodyStandard:
        "V bezplatném účtu jsou identifikační údaje skryté proti automatizovanému scrapingu. S tarifem Investor okamžitě odemknete všechna řízení:",
      items: [
        "Úplná spisová značka a údaje z katastru nemovitostí (LV)",
        "Přesná adresa, číslo parcely a mapa polohy",
        "Výsledná cena, nejnižší podání (2/3) a kalkulačka dražby",
        "Oficiální dražební vyhlášky / znalecké posudky PDF a AI analýza rizik",
      ],
      claimFreeCta: "Odemknout 1 Spis zdarma pro tuto nemovitost (0 Kč)",
      claimFreePending: "Odemkání spisu …",
      claimFreeNote: "Jednorázově 1 nemovitost na účet · Bez karty · Žádné předplatné ani automatické platby",
      claimFreeErrorUsed: "Váš 1 Spis zdarma již byl vyčerpán. Můžete využít 7denní zkušební verzi.",
      claimFreeErrorDevice: "Na tomto zařízení již byl spis zdarma využit. Můžete spustit 7denní zkoušku.",
      claimFreeErrorGeneric: "Odemknutí se nezdařilo. Obnovte stránku a zkuste to znovu.",
      secondaryTrialCta: "Nebo vyzkoušejte všechny objekty 7 dní zdarma →",
      primaryTrialCta: "Vyzkoušet 7 dní zdarma (dnes 0 Kč)",
      primaryTrialNote: "Dnes 0 Kč u Stripe · Zrušení 1 kliknutím před 8. dnem",
      primaryStandardCta: "Odemknout kompletní spis nyní",
      primaryStandardNote: "Okamžitá aktivace · Měsíční výpověď",
      viewUnlockedPrefix: "Váš odemčený spis zdarma:",
      viewUnlockedLink: "Otevřít odemčený objekt →",
    },
    unlockedNotice: {
      kicker: "✓ Váš 1 Spis zdarma je aktivní (100% zdarma · bez předplatného)",
      title: "Spisová značka, přesná adresa, PDF posudky a AI analýza jsou pro tento objekt odemčeny",
      body: "Toto řízení zůstává trvale zdarma otevřené ve vašem účtu — bez uložené karty a bez automatického prodloužení. Chcete porovnat všechny dražby?",
      ctaTrial: "Vyzkoušet všechny dražby 7 dní zdarma",
      ctaStandard: "Odemknout všechny dražby",
      noteTrial: "Volitelný plný přístup · Dnes 0 Kč · Zrušení před 8. dnem",
    },
  },
  nl: {
    homeFreeBadge: "Incl. 1 Gratis Volledig Dossier na e-mailbevestiging",
    homeTrialBadge: "7 dagen gratis proberen · € 0,00 vandaag",
    orderBadge: "7 dagen gratis",
    orderTrialPeriod: "7 dagen proberen",
    orderTrialTerm: (price, period) =>
      `Vandaag € 0,00 voor 7 dagen volledige toegang — daarna ${price} ${period}. Op elk moment met 1 klik opzegbaar.`,
    summaryStartTrial: "Direct — 7 dagen gratis proberen",
    summaryAfterTrialLabel: "Vanaf dag 8 (indien niet opgezegd)",
    summaryAfterTrialValue: (price, period) => `${price} ${period} · maandelijks opzegbaar`,
    summaryDueTodayLabel: "Vandaag te betalen (Dag 1–7)",
    summaryDueTodayNote: (price, period, vat) =>
      `Vandaag € 0,00 (betaalmethode geverifieerd via Stripe). Vanaf dag 8 automatisch ${price} ${period} (${vat}), tenzij u vooraf met 1 klik in uw account opzegt.`,
    submitTrial: "7 dagen gratis proberen · daarna betaald",
    paymentNoteTrial:
      "Vandaag € 0,00 bij Stripe (kaart, Apple Pay, Google Pay). Op elk moment met 1 klik opzegbaar vóór dag 8.",
    mailTrialPrice: (zero, recurring, period) =>
      `${zero} vandaag (7 dagen gratis proefperiode, vanaf dag 8 ${recurring} ${period})`,
    unlock: {
      kickerCanClaim: "1 Gratis Dossier beschikbaar · Volledig inzicht in 1 veiling naar keuze",
      kickerUsed: "Voorbeeldmodus · Uw Gratis Dossier is al gebruikt voor een ander object",
      titleCanClaim: "Ontgrendel dit object nu als uw 1 Gratis Volledig Dossier",
      titleTrial: "Test alle executieveilingen & voorwaarden 7 dagen gratis (€ 0,00 vandaag)",
      titleStandard: "Volledig dossier, exact adres en taxatiewaarde ontgrendelen",
      bodyCanClaim:
        "Elk bevestigd account ontvangt eenmalig 1 volledig veilingdossier gratis (zonder betaalkaart) — inclusief zaaknummer, huisnummer, biedcalculator, notaris-PDF & AI-risicocheck:",
      bodyTrial:
        "U heeft uw 1 Gratis Dossier al gebruikt. Test nu de volledige Investor-toegang voor alle veilingen 7 dagen lang voor € 0,00 — met 1 klik opzegbaar:",
      bodyStandard:
        "In het gratis alert-account zijn identificatiegegevens afgeschermd tegen scrapen. Met Investor ontgrendelt u direct alle procedures:",
      items: [
        "Volledig zaaknummer & kadastrale gegevens",
        "Exact huisnummer, perceel & locatiekaart",
        "Marktwaarde, inzet/afslag-drempels + biedcalculator",
        "Officiële veilingvoorwaarden PDF & AI-risicoanalyse",
      ],
      claimFreeCta: "1 Gratis Dossier voor dit object activeren (€ 0)",
      claimFreePending: "Dossier wordt ontgrendeld …",
      claimFreeNote: "Eenmalig 1 object per account · Zonder kaart · Geen abonnement of automatische kosten",
      claimFreeErrorUsed: "Uw 1 Gratis Dossier is al gebruikt. Start optioneel de 7-daagse proefperiode.",
      claimFreeErrorDevice: "Op dit apparaat is al een gratis dossier gebruikt. U kunt de 7-daagse proef starten.",
      claimFreeErrorGeneric: "Ontgrendelen mislukt. Ververs de pagina en probeer het opnieuw.",
      secondaryTrialCta: "Of test alle objecten direct 7 dagen gratis →",
      primaryTrialCta: "Nu 7 dagen gratis proberen (€ 0,00 vandaag)",
      primaryTrialNote: "Vandaag € 0,00 bij Stripe · Vóór dag 8 met 1 klik opzegbaar",
      primaryStandardCta: "Volledig dossier nu ontgrendelen",
      primaryStandardNote: "Directe activering · Maandelijks opzegbaar",
      viewUnlockedPrefix: "Uw ontgrendelde gratis dossier:",
      viewUnlockedLink: "Ontgrendeld object openen →",
    },
    unlockedNotice: {
      kicker: "✓ Uw 1 Gratis Dossier is actief (100% gratis · geen abonnement)",
      title: "Zaaknummer, exact adres, PDF's & AI-analyse zijn ontgrendeld voor dit object",
      body: "Dit dossier blijft blijvend gratis geopend in uw account — geen betaalgegevens opgeslagen en geen automatische verlenging. Wilt u alle veilingen vergelijken?",
      ctaTrial: "Alle objecten 7 dagen gratis testen",
      ctaStandard: "Alle objecten ontgrendelen",
      noteTrial: "Optionele volledige toegang · € 0,00 vandaag · Opzegbaar vóór dag 8",
    },
  },
  sv: {
    homeFreeBadge: "Inkl. 1 Gratis Fullständig Akt efter e-postbekräftelse",
    homeTrialBadge: "Prova 7 dagar gratis · 0 kr idag",
    orderBadge: "7 dagar gratis",
    orderTrialPeriod: "7 dagars provperiod",
    orderTrialTerm: (price, period) =>
      `0 kr idag för 7 dagars full åtkomst — därefter ${price} ${period}. Avsluta med 1 klick innan perioden löper ut.`,
    summaryStartTrial: "Omedelbart — prova 7 dagar gratis",
    summaryAfterTrialLabel: "Från dag 8 (om ej uppsagd)",
    summaryAfterTrialValue: (price, period) => `${price} ${period} · säg upp månadsvis`,
    summaryDueTodayLabel: "Att betala idag (Dag 1–7)",
    summaryDueTodayNote: (price, period, vat) =>
      `0 kr idag (betalningsmetod verifieras via Stripe). Från dag 8 automatiskt ${price} ${period} (${vat}) om du inte avslutar med 1 klick i kontot innan dess.`,
    submitTrial: "Prova 7 dagar gratis · därefter betald plan",
    paymentNoteTrial:
      "0 kr idag hos Stripe (kort, Apple Pay, Google Pay). Avsluta med 1 klick före dag 8.",
    mailTrialPrice: (zero, recurring, period) =>
      `${zero} idag (7 dagars kostnadsfri provperiod, från dag 8 ${recurring} ${period})`,
    unlock: {
      kickerCanClaim: "1 Gratis Akt tillgänglig · Full insyn i 1 valfri auktion",
      kickerUsed: "Förhandsgranskning · Din Gratis Akt har redan använts på ett annat objekt",
      titleCanClaim: "Lås upp detta objekt nu som din 1 Gratis Fullständiga Akt",
      titleTrial: "Prova alla auktioner & värderingar gratis i 7 dagar (0 kr idag)",
      titleStandard: "Lås upp fullständig akt, adress och marknadsvärde för detta objekt",
      bodyCanClaim:
        "Varje verifierat konto får 1 komplett auktionsakt helt gratis (utan kort) — inklusive målnummer, exakt adress, budkalkylator, Kronofogdens PDF och AI-riskanalys:",
      bodyTrial:
        "Du har redan använt din 1 Gratis Akt. Prova komplett Investor-åtkomst till alla auktioner i 7 dagar för 0 kr — avsluta med 1 klick före dag 8:",
      bodyStandard:
        "I gratiskontot är identifierande uppgifter dolda mot skrapning. Med Investor låser du upp alla ärenden direkt:",
      items: [
        "Fullständigt målnummer & fastighetsbeteckning",
        "Exakt gatuadress, tomt & lägeskarta",
        "Marknadsvärde, handpenning (10 %) & budkalkylator",
        "Officiella värderingsutlåtanden PDF & AI-riskanalys",
      ],
      claimFreeCta: "Lås upp 1 Gratis Akt för detta objekt (0 kr)",
      claimFreePending: "Låser upp akt …",
      claimFreeNote: "1 objekt per konto · Utan kort · Ingen prenumeration eller automatisk debitering",
      claimFreeErrorUsed: "Din 1 Gratis Akt har redan använts. Starta gärna 7-dagars provperioden.",
      claimFreeErrorDevice: "En gratis akt har redan lösts in på denna enhet. Du kan starta 7-dagars provperioden.",
      claimFreeErrorGeneric: "Kunde inte låsa upp. Ladda om sidan och försök igen.",
      secondaryTrialCta: "Eller prova alla objekt gratis i 7 dagar →",
      primaryTrialCta: "Prova 7 dagar gratis (0 kr idag)",
      primaryTrialNote: "0 kr idag hos Stripe · Avsluta med 1 klick före dag 8",
      primaryStandardCta: "Lås upp fullständig akt nu",
      primaryStandardNote: "Omedelbar aktivering · Säg upp månadsvis",
      viewUnlockedPrefix: "Din upplåsta gratis akt:",
      viewUnlockedLink: "Öppna upplåst objekt →",
    },
    unlockedNotice: {
      kicker: "✓ Din 1 Gratis Akt är aktiv (100% gratis · ingen prenumeration)",
      title: "Målnummer, exakt adress, PDF-dokument & AI-analys är upplåsta för detta objekt",
      body: "Detta ärende förblir kostnadsfritt öppet i ditt konto — inga betaluppgifter sparas och ingen automatisk förnyelse sker. Vill du jämföra alla auktioner?",
      ctaTrial: "Prova alla auktioner gratis i 7 dagar",
      ctaStandard: "Lås upp alla auktioner",
      noteTrial: "Valfri full åtkomst · 0 kr idag · Avsluta före dag 8",
    },
  },
};
