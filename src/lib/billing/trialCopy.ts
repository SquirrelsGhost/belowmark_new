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
      claimFreeNote: "Einmalig 1 Objekt pro Konto · Sofort ohne Zahlungsmittel",
      claimFreeErrorUsed: "Ihr 1 Gratis-Dossier wurde bereits eingelöst. Nutzen Sie jetzt die 7-Tage-Testphase.",
      claimFreeErrorDevice: "Auf diesem Gerät wurde bereits ein Gratis-Dossier eingelöst. Nutzen Sie die 7-Tage-Testphase.",
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
      kicker: "✓ Ihr 1 Gratis-Dossier ist aktiv",
      title: "Alle Aktenzeichen, Adressen, PDFs & KI-Analysen sind für dieses Objekt freigeschaltet",
      body: "Dieses Verfahren bleibt dauerhaft in Ihrem Konto geöffnet. Möchten Sie unbegrenzt alle Versteigerungen vergleichen?",
      ctaTrial: "Alle Objekte 7 Tage gratis testen",
      ctaStandard: "Alle Objekte freischalten",
      noteTrial: "Heute 0,00 € · Jederzeit vor Tag 8 kündbar",
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
      claimFreeNote: "Hesap başına 1 ihale · Kart gerekmez, anında açılır",
      claimFreeErrorUsed: "Ücretsiz dosya hakkınız zaten kullanıldı. 7 günlük ücretsiz denemeyi başlatabilirsiniz.",
      claimFreeErrorDevice: "Bu cihazda daha önce ücretsiz dosya hakkı kullanıldı. 7 günlük denemeyi başlatabilirsiniz.",
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
      kicker: "✓ 1 Ücretsiz Dosya hakkınız bu ihalede aktif",
      title: "Esas numarası, açık adres, resmi PDF'ler ve yapay zekâ analizi tamamen açık",
      body: "Bu ihale dosyası hesabınızda kalıcı olarak açıktır. Tüm ihaleleri sınırsız karşılaştırmak ister misiniz?",
      ctaTrial: "Tüm ihaleleri 7 gün ücretsiz dene",
      ctaStandard: "Tüm ihaleleri aç",
      noteTrial: "Bugün 0 ₺ · 8. günden önce iptal edilebilir",
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
      claimFreeNote: "1 free property per account · Instant, no card needed",
      claimFreeErrorUsed: "Your 1 Free Dossier was already used. Start your 7-day free trial for unlimited access.",
      claimFreeErrorDevice: "A Free Dossier was already claimed on this device. Start your 7-day free trial instead.",
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
      kicker: "✓ Your 1 Free Dossier is active",
      title: "Full case number, street address, official PDFs & AI verdict unlocked on this property",
      body: "This dossier stays permanently unlocked in your account. Want unlimited access to compare every auction lot?",
      ctaTrial: "Try all properties 7 days free",
      ctaStandard: "Unlock all properties",
      noteTrial: "0.00 today · Cancel anytime before day 8",
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
      claimFreeNote: "1 bien offert par compte · Immédiat, sans carte bancaire",
      claimFreeErrorUsed: "Votre Dossier Gratuit a déjà été utilisé. Profitez de l'essai gratuit de 7 jours.",
      claimFreeErrorDevice: "Un Dossier Gratuit a déjà été activé sur cet appareil. Lancez l'essai gratuit de 7 jours.",
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
      kicker: "✓ Votre 1 Dossier Gratuit est actif",
      title: "Numéro de rôle, adresse exacte, pièces PDF et analyse IA débloqués pour ce bien",
      body: "Ce dossier reste accessible en permanence dans votre compte. Vous souhaitez comparer toutes les enchères sans limite ?",
      ctaTrial: "Essayer tous les biens 7 jours gratuits",
      ctaStandard: "Débloquer tous les biens",
      noteTrial: "0,00 € aujourd'hui · Résiliable avant le 8e jour",
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
      claimFreeNote: "1 lote gratis por cuenta · Al instante y sin tarjeta",
      claimFreeErrorUsed: "Tu Expediente Gratis ya fue utilizado. Inicia ahora tu prueba gratuita de 7 días.",
      claimFreeErrorDevice: "Ya se utilizó un Expediente Gratis en este dispositivo. Inicia la prueba de 7 días.",
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
      kicker: "✓ Tu 1 Expediente Gratis está activo",
      title: "Expediente completo, dirección exacta, PDFs oficiales y análisis IA desbloqueados",
      body: "Esta subasta permanece abierta de forma permanente en tu cuenta. ¿Quieres analizar todas las subastas sin límite?",
      ctaTrial: "Probar todas 7 días gratis",
      ctaStandard: "Desbloquear todas las subastas",
      noteTrial: "0,00 € hoy · Cancela antes del día 8",
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
      claimFreeNote: "1 lotto gratis per account · Immediato, senza carta",
      claimFreeErrorUsed: "Il tuo Fascicolo Gratis è già stato utilizzato. Avvia la prova gratuita di 7 giorni.",
      claimFreeErrorDevice: "Un Fascicolo Gratis è già stato riscattato su questo dispositivo. Avvia la prova di 7 giorni.",
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
      kicker: "✓ Il tuo 1 Fascicolo Gratis è attivo",
      title: "R.G., indirizzo esatto, perizia PDF e analisi IA sbloccati per questo immobile",
      body: "Questo fascicolo resta sempre aperto nel tuo account. Vuoi confrontare tutte le aste giudiziarie senza limiti?",
      ctaTrial: "Prova tutte le aste 7 giorni gratis",
      ctaStandard: "Sblocca tutte le aste",
      noteTrial: "0,00 € oggi · Disdetta prima dell'8° giorno",
    },
  },
};
