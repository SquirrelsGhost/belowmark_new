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
          Subject: "Hoş geldiniz — Belowmark hesabınız ve otomatik ihale alarmınız aktif",
          Preheader: "E-posta adresiniz doğrulandı. İhaleleri inceleyin ve Investor paketiyle tam dosya detaylarını açın.",
          Greeting: "Merhaba,",
          Body: "E-posta adresiniz başarıyla doğrulandı ve Belowmark hesabınız etkinleştirildi. Bölgeniz için otomatik e-posta ihale alarmınız kuruldu. Dosya numaralarını (Esas No), TKGM ada/parsel bilgilerini, bilirkişi raporu yapay zeka analizini ve teklif sınırı hesaplayıcısını açmak için istediğiniz zaman Investor paketine geçebilirsiniz.",
          Action: "İhaleleri ve hesabımı aç",
          Expiry: `Kayıtlı aramalarınız ve izleme listeniz ücretsiz hesabınızda açık kalır (referans: ${endDate}).`,
          Ignore: "Hesap ayarlarınızı, kayıtlı aramalarınızı ve Investor abonelik seçeneklerinizi istediğiniz zaman hesabınızdan yönetebilirsiniz.",
        },
        highlights: [
          "Resmî icra ve mahkeme ihaleleri — muhammen bedel, yasal sınırlar ve masraflarla",
          "Kayıtlı Arama Alarmları (/app/alerts): Yeni ilan ve tarih değişikliklerinde otomatik e-posta",
          "Süre ve İhale Takipçisi (/app/termine): İhale öncesi otomatik hatırlatmalar ve takvim akışı",
        ],
        docCode: "BM-HESAP · ETKİNLEŞTİRME",
        eyebrow: "Hesap Açılışı ve Ücretsiz İhale Alarmı",
      };
    case "fr":
      return {
        template: {
          Subject: "Bienvenue sur Belowmark — votre compte et vos alertes d'enchères sont activés",
          Preheader: "Adresse e-mail confirmée. Consultez les audiences et débloquez les dossiers complets avec l'accès Investisseur.",
          Greeting: "Bonjour,",
          Body: "Votre adresse e-mail est confirmée et votre compte Belowmark est désormais actif. Vos alertes e-mail gratuites pour les nouvelles ventes aux enchères judiciaires sont opérationnelles. Pour débloquer les numéros de rôle complets, les adresses exactes, le cahier des conditions de vente (PDF), l'analyse IA et le comparatif DVF/m², vous pouvez activer l'accès Investisseur à tout moment.",
          Action: "Ouvrir les enchères et mon compte",
          Expiry: `Votre liste de suivi, la carte et vos alertes automatiques restent actives gratuitement (réf. : ${endDate}).`,
          Ignore: "Gérez vos alertes, vos échéances et votre formule Investisseur (/buchen) directement depuis votre espace compte.",
        },
        highlights: [
          "Ventes aux enchères judiciaires (Licitor & TJ) : mise à prix, CARPA 10 % et décote DVF",
          "Alertes de recherche (/app/alerts) : e-mail automatique dès la publication de nouveaux biens",
          "Suivi d'audiences (/app/termine) : rappels d'échéances et calendrier synchronisé",
        ],
        docCode: "BM-COMPTE · ACTIVATION",
        eyebrow: "Ouverture de Compte & Alerte Gratuite",
      };
    case "es":
      return {
        template: {
          Subject: "Bienvenido a Belowmark — tu cuenta y tus alertas de subastas BOE están activas",
          Preheader: "Correo confirmado. Revisa las subastas activas y desbloquea los expedientes completos con el acceso Inversor.",
          Greeting: "Hola,",
          Body: "Tu dirección de correo electrónico ha sido confirmada y tu cuenta de Belowmark ya está activa. Tus alertas gratuitas por correo para nuevas subastas judiciales del BOE están configuradas. Para desbloquear números de expediente completos, direcciones exactas, edictos y certificaciones de cargas en PDF, análisis IA y calculadora de puja máxima, puedes activar el plan Inversor en cualquier momento.",
          Action: "Abrir subastas y mi cuenta",
          Expiry: `Tu lista de seguimiento, mapa y alertas automáticas permanecen activos gratis (ref.: ${endDate}).`,
          Ignore: "Gestiona tus alertas, plazos y el acceso Inversor (/buchen) en cualquier momento desde tu cuenta.",
        },
        highlights: [
          "Subastas judiciales BOE con Valor de Subasta, reglas del 70 % / 50 % (LEC) y depósito del 5 %",
          "Alertas de búsqueda (/app/alerts): aviso automático de nuevos lotes y cambios de fecha",
          "Calendario de plazos (/app/termine): recordatorios antes del cierre de pujas",
        ],
        docCode: "BM-CUENTA · ACTIVACIÓN",
        eyebrow: "Activación de Cuenta y Alerta Gratuita",
      };
    case "it":
      return {
        template: {
          Subject: "Benvenuto su Belowmark — il tuo account e gli avvisi d'asta sono attivi",
          Preheader: "Indirizzo e-mail confermato. Esplora i lotti PVP e sblocca le perizie complete con il piano Investitore.",
          Greeting: "Buongiorno,",
          Body: "Il tuo indirizzo e-mail è stato confermato e il tuo account Belowmark è attivo. Gli avvisi gratuiti per le nuove aste giudiziarie immobiliari sono pronti. Per sbloccare i numeri di R.G. completi, gli indirizzi civici esatti, le perizie CTU e gli avvisi di vendita in PDF, l'analisi rischi IA e il calcolatore d'asta, puoi attivare il piano Investitore in qualsiasi momento.",
          Action: "Apri le aste e il mio account",
          Expiry: `Lista preferiti, mappa e avvisi automatici restano attivi gratuitamente nel tuo profilo (rif.: ${endDate}).`,
          Ignore: "Puoi gestire avvisi, scadenze e il piano Investitore (/buchen) direttamente dal tuo account.",
        },
        highlights: [
          "Aste giudiziarie PVP con Prezzo Base, Offerta Minima al 75 % (art. 571 c.p.c.) e cauzione 10 %",
          "Avvisi di ricerca (/app/alerts): e-mail automatica per nuovi lotti e variazioni d'udienza",
          "Scadenzario (/app/termine): promemoria automatici prima del termine di presentazione offerte",
        ],
        docCode: "BM-PROFILO · ATTIVAZIONE",
        eyebrow: "Attivazione Account e Avvisi Gratuiti",
      };
    case "en":
      return {
        template: {
          Subject: "Welcome to Belowmark — your account & auction alerts are active",
          Preheader: "Email verified. Browse live auction lots and unlock full legal dossiers anytime with Investor access.",
          Greeting: "Hello,",
          Body: "Your email address has been verified and your Belowmark account is active. Your free automated email alerts for new property auction lots are ready. To unlock unredacted case numbers, exact street addresses, official court/legal pack PDFs, AI risk analysis, and the maximum bid calculator, you can upgrade to Investor access anytime.",
          Action: "Open auctions & my account",
          Expiry: `Your watchlist, map view, and automated search alerts remain active in your free account (ref: ${endDate}).`,
          Ignore: "Manage your search alerts, auction deadlines, and Investor plan (/buchen) anytime from your account.",
        },
        highlights: [
          "Official property auctions with appraised/guide prices, statutory bid limits, and deposits",
          "Search Alerts (/app/alerts): automatic emails on new lots and auction date changes",
          "Deadline Companion (/app/termine): automated pre-auction reminders & calendar feed",
        ],
        docCode: "BM-ACCOUNT · ACTIVATED",
        eyebrow: "Account Activation & Free Auction Alerts",
      };
    default:
      return {
        template: {
          Subject: "Willkommen bei Belowmark — Ihr Konto & Such-Alert sind aktiviert",
          Preheader: "Ihre E-Mail-Adresse ist bestätigt. Prüfen Sie aktuelle Termine und schalten Sie Aktenzeichen & Gutachten-KI frei.",
          Greeting: "Guten Tag,",
          Body: "Ihre E-Mail-Adresse ist bestätigt und Ihr Belowmark-Konto wurde freigeschaltet. Ihr kostenloser E-Mail-Suchauftrag für neue Versteigerungstermine ist aktiv. Um vollständige Aktenzeichen, exakte Hausnummern, Original-Bekanntmachungen/Gutachten, die Gutachten-KI und die Bankmappe freizuschalten, können Sie jederzeit den Investor-Zugang buchen.",
          Action: "Verfahren & Konto öffnen",
          Expiry: `Merkliste, Karte und automatische Such-Alerts stehen Ihnen im Basiskonto dauerhaft zur Verfügung (Stand: ${endDate}).`,
          Ignore: "Ihre Such-Alerts, Fristen-Erinnerungen und den Investor-Tarif (/buchen) verwalten Sie jederzeit direkt in Ihrem Konto.",
        },
        highlights: [
          "Amtliche Zwangsversteigerungen mit Verkehrswert, 5/10- & 7/10-Grenzen und Gesamtkosten",
          "Such-Alerts (/app/alerts): Automatische E-Mail bei neuen Verfahren und Terminänderungen",
          "Termin-Begleiter (/app/termine): Automatische Fristen-Erinnerungen per E-Mail & Kalender-Feed",
        ],
        docCode: "BM-KONTO · FREISCHALTUNG",
        eyebrow: "Kontoeröffnung & Kostenloser Such-Alert",
      };
  }
}
