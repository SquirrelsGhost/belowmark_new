import { LocaleOption } from "@/lib/constants";
import { IMailTemplate } from "@/translations/auth/IAuthTranslation";

export interface WelcomeMailBundle {
  template: IMailTemplate;
  highlights: [string, string, string];
  docCode: string;
  eyebrow: string;
}

export function buildWelcomeMailBundle(lang: LocaleOption, endDate: string): WelcomeMailBundle {
  switch (lang) {
    case "tr":
      return {
        template: {
          Subject: "Hoş geldiniz — 1 Ücretsiz Dosya hakkınız ve ihale alarmınız aktif",
          Preheader: "E-postanız doğrulandı. Seçtiğiniz 1 ihalenin tüm detaylarını hemen ücretsiz açın veya 7 gün ücretsiz deneyin.",
          Greeting: "Merhaba,",
          Body: "E-posta adresiniz doğrulandı ve Belowmark hesabınız etkinleştirildi. Hesabınızda kart bilgisi girmeden seçtiğiniz 1 ihaleyi tamamen açabileceğiniz 1 Ücretsiz Dosya hakkınız tanımlandı (Esas No, açık adres, teklif hesaplayıcı, resmi PDF ve yapay zekâ risk analizi dahil). Tüm ihalelere sınırsız erişim için Investor paketini istediğiniz zaman 7 gün ücretsiz (bugün 0 ₺) deneyebilirsiniz.",
          Action: "1 Ücretsiz Dosya hakkımı kullan",
          Expiry: `Kayıtlı aramalarınız, izleme listeniz ve 1 Ücretsiz Dosya hakkınız hesabınızda açık kalır (referans: ${endDate}).`,
          Ignore: "Arama alarmlarınızı ve 7 günlük ücretsiz Investor denemesini (/buchen) istediğiniz zaman hesabınızdan yönetebilirsiniz.",
        },
        highlights: [
          "1 Ücretsiz Dosya Hakkı: Seçtiğiniz 1 ihalede Esas No, açık adres, resmi PDF ve YZ analizi ücretsiz",
          "7 Gün Ücretsiz Investor Denemesi: Tüm ihalelere sınırsız erişim (bugün 0 ₺, tek tıkla iptal)",
          "Kayıtlı Arama Alarmları (/app/alerts): Yeni ilan ve tarih değişikliklerinde otomatik e-posta",
        ],
        docCode: "BM-HESAP · ETKİNLEŞTİRME",
        eyebrow: "Hesap Açılışı ve 1 Ücretsiz Dosya Hakkı",
      };
    case "fr":
      return {
        template: {
          Subject: "Bienvenue sur Belowmark — votre 1 Dossier Gratuit et vos alertes sont activés",
          Preheader: "E-mail confirmé. Débloquez intégralement 1 bien de votre choix sans carte ou essayez 7 jours gratuitement.",
          Greeting: "Bonjour,",
          Body: "Votre adresse e-mail est confirmée et votre compte Belowmark est actif. Vous disposez dès maintenant d'un Dossier Complet Gratuit (sans carte bancaire) à utiliser sur le bien de votre choix : numéro de rôle, adresse exacte, cahier des conditions de vente (PDF), analyse IA et comparatif DVF/m². Pour accéder à toutes les ventes sans limite, profitez de 7 jours d'essai gratuit (0,00 € aujourd'hui).",
          Action: "Débloquer mon 1er bien gratuitement",
          Expiry: `Votre Dossier Gratuit, votre liste de suivi et vos alertes restent actifs dans votre compte (réf. : ${endDate}).`,
          Ignore: "Gérez vos alertes et lancez votre essai gratuit de 7 jours (/buchen) à tout moment depuis votre compte.",
        },
        highlights: [
          "1 Dossier Gratuit inclus : débloquez 1 vente complète (rôle, adresse, PDF officiels & IA) sans carte",
          "Essai gratuit 7 jours (0,00 € aujourd'hui) : accès illimité à toutes les enchères Licitor & TJ",
          "Alertes de recherche (/app/alerts) : e-mail automatique dès la publication de nouveaux biens",
        ],
        docCode: "BM-COMPTE · ACTIVATION",
        eyebrow: "Ouverture de Compte & 1 Dossier Gratuit",
      };
    case "es":
      return {
        template: {
          Subject: "Bienvenido a Belowmark — tu 1 Expediente Gratis y tus alertas BOE están activos",
          Preheader: "Correo confirmado. Desbloquea 1 subasta completa gratis sin tarjeta o prueba 7 días gratis.",
          Greeting: "Hola,",
          Body: "Tu correo electrónico ha sido confirmado y tu cuenta de Belowmark ya está activa. Tienes disponible 1 Expediente Completo Gratis (sin tarjeta) para desbloquear la subasta BOE que elijas con número de procedimiento, dirección exacta, edictos/cargas en PDF, calculadora 70 %/50 % LEC y análisis IA. Para analizar todas las subastas sin límite, activa tu prueba gratuita de 7 días (0,00 € hoy).",
          Action: "Canjear mi 1 Expediente Gratis",
          Expiry: `Tu Expediente Gratis, lista de seguimiento y alertas permanecen activos gratis (ref.: ${endDate}).`,
          Ignore: "Gestiona tus alertas e inicia tu prueba gratuita de 7 días (/buchen) cuando quieras desde tu cuenta.",
        },
        highlights: [
          "1 Expediente Gratis incluido: desbloquea 1 subasta completa (expediente, dirección, PDFs e IA) sin tarjeta",
          "7 días de prueba gratis (0,00 € hoy): acceso ilimitado a todas las subastas del BOE",
          "Alertas de búsqueda (/app/alerts): aviso automático de nuevos lotes y cambios de fecha",
        ],
        docCode: "BM-CUENTA · ACTIVACIÓN",
        eyebrow: "Activación de Cuenta y 1 Expediente Gratis",
      };
    case "it":
      return {
        template: {
          Subject: "Benvenuto su Belowmark — il tuo 1 Fascicolo Gratis e gli avvisi sono attivi",
          Preheader: "E-mail confermata. Sblocca gratis 1 asta completa senza carta oppure prova 7 giorni gratis.",
          Greeting: "Buongiorno,",
          Body: "Il tuo indirizzo e-mail è stato confermato e il tuo account Belowmark è attivo. Hai subito a disposizione 1 Fascicolo Completo Gratis (senza carta) per sbloccare un lotto a tua scelta con R.G. completo, indirizzo civico esatto, perizia CTU in PDF, calcolatore offerta minima 75 % e analisi IA. Per confrontare tutte le aste senza limiti, puoi attivare 7 giorni di prova gratuita (0,00 € oggi).",
          Action: "Sblocca il mio 1° Fascicolo Gratis",
          Expiry: `Il tuo Fascicolo Gratis, i preferiti e gli avvisi automatici restano attivi nel tuo profilo (rif.: ${endDate}).`,
          Ignore: "Puoi gestire avvisi e avviare la prova gratuita di 7 giorni (/buchen) direttamente dal tuo account.",
        },
        highlights: [
          "1 Fascicolo Gratis incluso: sblocca 1 lotto completo (R.G., indirizzo, perizia PDF e IA) senza carta",
          "7 giorni di prova gratuita (0,00 € oggi): accesso illimitato a tutte le aste giudiziarie PVP",
          "Avvisi di ricerca (/app/alerts): e-mail automatica per nuovi lotti e variazioni d'udienza",
        ],
        docCode: "BM-PROFILO · ATTIVAZIONE",
        eyebrow: "Attivazione Account e 1 Fascicolo Gratis",
      };
    case "en":
      return {
        template: {
          Subject: "Welcome to Belowmark — your 1 Free Dossier & auction alerts are active",
          Preheader: "Email verified. Unlock 1 full property dossier free (no card) or start a 7-day free trial.",
          Greeting: "Hello,",
          Body: "Your email address has been verified and your Belowmark account is active. Your account includes 1 complimentary Full Property Dossier (no card required) — unlock any single auction property with its unredacted case number, exact street address, official court/legal pack PDFs, AI risk verdict, and bid calculator. Want unlimited access to all properties? Start your 7-day free Investor trial anytime (0.00 due today).",
          Action: "Redeem my 1 Free Dossier",
          Expiry: `Your 1 Free Dossier, watchlist, and automated search alerts stay active in your account (ref: ${endDate}).`,
          Ignore: "Manage your search alerts and start your 7-day free Investor trial (/buchen) anytime from your account.",
        },
        highlights: [
          "1 Free Full Dossier included: unlock 1 complete property file (address, PDFs & AI check) with no card",
          "7-Day Free Trial (0.00 today): unlimited access to every auction lot, cancel in 1 click before day 8",
          "Search Alerts (/app/alerts): automatic emails on new lots and auction date changes",
        ],
        docCode: "BM-ACCOUNT · ACTIVATED",
        eyebrow: "Account Activation & 1 Free Dossier",
      };
    default:
      return {
        template: {
          Subject: "Willkommen bei Belowmark — Ihr 1 Gratis-Dossier & Such-Alert sind aktiv",
          Preheader: "E-Mail bestätigt. Schalten Sie sofort 1 Wunschobjekt komplett gratis frei oder testen Sie 7 Tage kostenlos.",
          Greeting: "Guten Tag,",
          Body: "Ihre E-Mail-Adresse ist bestätigt und Ihr Belowmark-Konto wurde freigeschaltet. In Ihrem Konto liegt ab sofort 1 vollständiges Gratis-Dossier bereit (ohne Zahlungsmittel): Öffnen Sie ein beliebiges Wunschobjekt komplett ungeschwärzt mit Aktenzeichen, Hausnummer, 5/10- & 7/10-Gebotsrechner, amtlichem Gutachten-PDF und KI-Risiko-Analyse. Für unbegrenzten Zugriff auf alle Verfahren können Sie den Investor-Zugang jederzeit 7 Tage kostenlos testen (0,00 € heute).",
          Action: "1 Gratis-Dossier jetzt einlösen",
          Expiry: `Ihr Gratis-Dossier, Merkliste, Karte und automatische Such-Alerts bleiben dauerhaft aktiv (Stand: ${endDate}).`,
          Ignore: "Ihre Such-Alerts und die 7-tägige kostenlose Testphase (/buchen) verwalten Sie jederzeit direkt in Ihrem Konto.",
        },
        highlights: [
          "1 Gratis-Dossier inklusive: 1 Wunschobjekt komplett mit Aktenzeichen, Adresse, PDF & KI-Check öffnen",
          "7 Tage kostenlos testen (0,00 € heute): Unbegrenzter Vollzugang für alle Objekte, 1-Klick-Kündigung vor Tag 8",
          "Such-Alerts (/app/alerts): Automatische E-Mail bei neuen Verfahren und Terminänderungen",
        ],
        docCode: "BM-KONTO · FREISCHALTUNG",
        eyebrow: "Kontoeröffnung & 1 Gratis-Dossier",
      };
  }
}
