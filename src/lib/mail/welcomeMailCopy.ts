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
          Subject: "Hoş geldiniz — 1 Ücretsiz Dosya hakkınız ve ihale alarmınız aktif (abonelik yok)",
          Preheader: "E-postanız doğrulandı. Kart bilgisi veya otomatik abonelik olmadan 14 gün bağlayıcılıksız deneyin.",
          Greeting: "Merhaba,",
          Body: "E-posta adresiniz doğrulandı ve Belowmark hesabınız etkinleştirildi. Hesabınızda hiçbir ödeme bilgisi kayıtlı değildir: Seçtiğiniz 1 ihaleyi tamamen ücretsiz açabileceğiniz 1 Ücretsiz Dosya hakkınız tanımlandı (Esas No, açık adres, teklif hesaplayıcı, resmi PDF ve yapay zekâ risk analizi dahil). Hesabınız ve 14 günlük bağlayıcılıksız deneme süreniz tamamen ücretsizdir — kendiliğinden sona erer, otomatik çekim veya abonelik yenilemesi kesinlikle yapılmaz.",
          Action: "1 Ücretsiz Dosya hakkımı kullan",
          Expiry: `14 günlük bağlayıcılıksız test süresi (${endDate} tarihine kadar) otomatik sona erer — kart bilgisi kayıtlı değildir, otomatik çekim veya abonelik yoktur (iptal etmenize gerek yoktur). 1 Ücretsiz Dosya hakkınız, takip listeniz ve alarmlarınız kalıcı olarak ücretsiz kalır.`,
          Ignore: "Arama alarmlarınızı hesabınızdan yönetebilir; dilerseniz ileride tüm ihalelere sınırsız erişim için Investor paketini (/buchen) ayrıca inceleyebilirsiniz.",
        },
        highlights: [
          "%100 Ücretsiz & Bağlayıcılıksız: Ödeme yöntemi kayıtlı değil, otomatik abonelik veya ücret çekimi yok",
          "1 Ücretsiz Dosya Hakkı: Seçtiğiniz 1 ihalede Esas No, açık adres, resmi PDF ve YZ analizi kalıcı açık",
          "Kayıtlı Arama Alarmları (/app/alerts): Yeni ilan ve tarih değişikliklerinde ücretsiz otomatik e-posta",
        ],
        docCode: "BM-HESAP · ETKİNLEŞTİRME",
        eyebrow: "Hesap Açılışı · Abonelik Yok, Otomatik Sona Erer",
      };
    case "fr":
      return {
        template: {
          Subject: "Bienvenue sur Belowmark — votre 1 Dossier Gratuit et vos alertes sont actifs (sans abonnement)",
          Preheader: "E-mail confirmé. Testez 14 jours sans engagement — aucune carte enregistrée, aucun renouvellement automatique.",
          Greeting: "Bonjour,",
          Body: "Votre adresse e-mail est confirmée et votre compte Belowmark est actif. Aucune coordonnée bancaire n'est enregistrée sur votre compte : vous disposez dès maintenant d'un Dossier Complet Gratuit à utiliser sur le bien de votre choix (numéro de rôle, adresse exacte, cahier des ventes PDF, analyse IA et comparatif DVF/m²). Votre période de découverte de 14 jours est 100 % sans engagement et prend fin automatiquement sans frais ni abonnement automatique.",
          Action: "Débloquer mon 1er bien gratuitement",
          Expiry: `Période d'essai sans engagement jusqu'au ${endDate} — prend fin automatiquement sans frais. Aucune carte enregistrée, aucun prélèvement ni renouvellement automatique (aucune résiliation nécessaire). Votre Dossier Gratuit, vos favoris et vos alertes restent actifs gratuitement.`,
          Ignore: "Gérez vos alertes à tout moment depuis votre compte ; l'accès illimité Investor (/buchen) reste entièrement facultatif.",
        },
        highlights: [
          "100 % sans engagement : aucune carte bancaire enregistrée, aucun prélèvement ni renouvellement automatique",
          "1 Dossier Gratuit inclus : débloquez 1 vente complète (rôle, adresse, PDF officiels & IA) sans carte",
          "Alertes de recherche (/app/alerts) : e-mail gratuit automatique dès la publication de nouveaux biens",
        ],
        docCode: "BM-COMPTE · ACTIVATION",
        eyebrow: "Ouverture de Compte · Sans Abonnement Automatique",
      };
    case "es":
      return {
        template: {
          Subject: "Bienvenido a Belowmark — tu 1 Expediente Gratis y tus alertas BOE están activos (sin suscripción)",
          Preheader: "Correo confirmado. Prueba 14 días sin compromiso — sin tarjeta registrada ni renovación automática.",
          Greeting: "Hola,",
          Body: "Tu correo electrónico ha sido confirmado y tu cuenta de Belowmark ya está activa. No hay ningún método de pago guardado en tu cuenta: tienes disponible 1 Expediente Completo Gratis para desbloquear la subasta BOE que elijas (procedimiento, dirección exacta, edictos PDF, calculadora 70 %/50 % LEC y análisis IA). Tu periodo de prueba de 14 días sin compromiso finaliza automáticamente sin costes ni renovación automática.",
          Action: "Canjear mi 1 Expediente Gratis",
          Expiry: `Periodo de prueba de 14 días hasta el ${endDate} — finaliza automáticamente sin costes. Sin datos de pago registrados ni renovación automática (no es necesario cancelar). Tu Expediente Gratis, seguimiento y alertas siguen activos gratis.`,
          Ignore: "Gestiona tus alertas desde tu cuenta; si más adelante deseas acceso ilimitado a todas las subastas (/buchen), es totalmente opcional.",
        },
        highlights: [
          "100 % sin compromiso: sin tarjeta guardada, sin cargos automáticos ni renovación de suscripción",
          "1 Expediente Gratis incluido: desbloquea 1 subasta completa (expediente, dirección, PDFs e IA) gratis",
          "Alertas de búsqueda (/app/alerts): aviso gratuito automático de nuevos lotes y cambios de fecha",
        ],
        docCode: "BM-CUENTA · ACTIVACIÓN",
        eyebrow: "Activación de Cuenta · Sin Suscripción Automática",
      };
    case "it":
      return {
        template: {
          Subject: "Benvenuto su Belowmark — il tuo 1 Fascicolo Gratis e gli avvisi sono attivi (nessun abbonamento)",
          Preheader: "E-mail confermata. Prova 14 giorni senza impegno — nessuna carta salvata, nessun rinnovo automatico.",
          Greeting: "Buongiorno,",
          Body: "Il tuo indirizzo e-mail è stato confermato e il tuo account Belowmark è attivo. Nessun metodo di pagamento è salvato nel tuo profilo: hai subito a disposizione 1 Fascicolo Completo Gratis per sbloccare un lotto a tua scelta (R.G. completo, indirizzo civico, perizia CTU in PDF, calcolatore 75 % e analisi IA). Il tuo periodo di prova di 14 giorni senza impegno termina automaticamente senza costi né rinnovo automatico.",
          Action: "Sblocca il mio 1° Fascicolo Gratis",
          Expiry: `Periodo di prova di 14 giorni fino al ${endDate} — termina automaticamente senza costi. Nessun dato di pagamento salvato, nessun addebito né abbonamento automatico (nessuna disdetta necessaria). Il tuo Fascicolo Gratis, i preferiti e gli avvisi restano attivi gratuitamente.`,
          Ignore: "Puoi gestire gli avvisi dal tuo account in qualsiasi momento; il piano illimitato Investor (/buchen) è interamente facoltativo.",
        },
        highlights: [
          "100% senza impegno: nessuna carta registrata, nessun addebito né rinnovo automatico",
          "1 Fascicolo Gratis incluso: sblocca 1 lotto completo (R.G., indirizzo, perizia PDF e IA) gratuitamente",
          "Avvisi di ricerca (/app/alerts): e-mail gratuita automatica per nuovi lotti e variazioni d'udienza",
        ],
        docCode: "BM-PROFILO · ATTIVAZIONE",
        eyebrow: "Attivazione Account · Nessun Abbonamento Automatico",
      };
    case "pl":
      return {
        template: {
          Subject: "Witamy w Belowmark — Twoje 1 Darmowe Akta i alerty licytacji są aktywne (bez subskrypcji)",
          Preheader: "E-mail potwierdzony. Testuj przez 14 dni bez zobowiązań — brak zapisanej karty i brak automatycznego odnowienia.",
          Greeting: "Dzień dobry,",
          Body: "Twój adres e-mail został potwierdzony, a konto Belowmark jest już aktywne. Na koncie nie zapisano żadnych danych płatniczych: masz do dyspozycji 1 pełne Darmowe Akta Nieruchomości do wykorzystania na wybranej licytacji komorniczej (pełna sygnatura KM, dokładny adres, obwieszczenia i operat PDF, kalkulator 3/4 i 2/3 sumy oszacowania oraz analiza ryzyka AI). 14-dniowy okres próbny jest w 100% niezobowiązujący i kończy się automatycznie bez żadnych opłat ani automatycznej subskrypcji.",
          Action: "Wykorzystaj moje 1 Darmowe Akta",
          Expiry: `14-dniowy niezobowiązujący okres testowy do ${endDate} — kończy się automatycznie bez opłat. Brak zapisanej karty, brak automatycznych obciążeń i odnowień (nie trzeba niczego wypowiadać). Twoje 1 Darmowe Akta, obserwowana lista i alerty pozostają bezpłatnie aktywne.`,
          Ignore: "Alertami wyszukiwania możesz zarządzać w każdej chwili w koncie; późniejsze przejście na nielimitowany plan Investor (/buchen) jest całkowicie dobrowolne.",
        },
        highlights: [
          "100% bez zobowiązań: brak zapisanej karty, brak automatycznych opłat i odnowień subskrypcji",
          "1 Darmowe Pełne Akta w pakiecie: odblokuj 1 wybraną nieruchomość (sygnatura, adres, PDF i AI) na stałe",
          "Alerty wyszukiwania (/app/alerts): bezpłatne automatyczne e-maile o nowych licytacjach i zmianach terminów",
        ],
        docCode: "BM-KONTO · AKTYWACJA",
        eyebrow: "Aktywacja Konta · Bez Automatycznej Subskrypcji",
      };
    case "cs":
      return {
        template: {
          Subject: "Vítejte v Belowmark — Váš 1 Bezplatný Spis a hlídací psi dražeb jsou aktivní (bez předplatného)",
          Preheader: "E-mail potvrzen. Vyzkoušejte 14 dní nezávazně — žádná uložená karta, žádné automatické prodlužování.",
          Greeting: "Dobrý den,",
          Body: "Vaše e-mailová adresa byla ověřena a Váš účet Belowmark je aktivní. Na účtu nejsou uloženy žádné platební údaje: máte okamžitě k dispozici 1 kompletní Bezplatný Spis k odemknutí libovolné dražby (plná spisová značka EX, přesná adresa, dražební vyhláška a znalecký posudek v PDF, kalkulačka nejnižšího podání 2/3 a AI analýza rizik). Vaše 14denní nezávazné zkušební období skončí automaticky bez jakýchkoliv poplatků či automatického předplatného.",
          Action: "Uplatnit můj 1 Bezplatný Spis",
          Expiry: `14denní nezávazné zkušební období do ${endDate} — končí automaticky a zdarma. Žádné uložené platební údaje, žádné automatické stržení ani předplatné (není nutná výpověď). Váš Bezplatný Spis, sledované položky i hlídací psi zůstávají trvale zdarma.`,
          Ignore: "Hlídací psy můžete kdykoliv spravovat ve svém účtu; případný přechod na neomezený tarif Investor (/buchen) je zcela dobrovolný.",
        },
        highlights: [
          "100% nezávazně: žádná platební karta v účtu, žádné automatické strhávání ani obnovení",
          "1 Bezplatný Spis v ceně: odemkněte 1 kompletní dražbu (spisová značka, adresa, PDF a AI) natrvalo zdarma",
          "Hlídací psi (/app/alerts): bezplatné automatické e-maily o nových dražbách a změnách termínů",
        ],
        docCode: "BM-ÚČET · AKTIVACE",
        eyebrow: "Aktivace Účtu · Bez Automatického Předplatného",
      };
    case "nl":
      return {
        template: {
          Subject: "Welkom bij Belowmark — uw 1 Gratis Dossier & veilingalerts zijn actief (geen abonnement)",
          Preheader: "E-mail bevestigd. Test 14 dagen vrijblijvend — geen betaalgegevens opgeslagen, geen automatische verlenging.",
          Greeting: "Goedendag,",
          Body: "Uw e-mailadres is bevestigd en uw Belowmark-account is actief. Er zijn geen betaalgegevens opgeslagen in uw account: u beschikt direct over 1 volledig Gratis Dossier om een executieveiling naar keuze volledig te ontgrendelen (volledig dossiernummer, exact huisadres, officiële veilingvoorwaarden & proces-verbaal in PDF, biedcalculator en AI-risicoanalyse). Uw vrijblijvende proefperiode van 14 dagen eindigt automatisch zonder kosten of stilzwijgende verlenging.",
          Action: "Mijn 1 Gratis Dossier inwisselen",
          Expiry: `14 dagen vrijblijvend testen t/m ${endDate} — eindigt automatisch zonder kosten. Geen kaart geregistreerd, geen automatische incasso of abonnement (opzeggen niet nodig). Uw Gratis Dossier, volglijst en zoekalerts blijven blijvend gratis actief.`,
          Ignore: "Beheer uw zoekalerts op elk moment in uw account; overstappen naar onbeperkte Investor-toegang (/buchen) is volledig optioneel.",
        },
        highlights: [
          "100% vrijblijvend: geen betaalkaart geregistreerd, geen automatische afschrijving of verlenging",
          "1 Gratis Volledig Dossier inbegrepen: ontgrendel 1 veilingpand (adres, officiële PDF's & AI-check) gratis",
          "Zoekalerts (/app/alerts): gratis automatische e-mails bij nieuwe veilingen en gewijzigde zittingsdata",
        ],
        docCode: "BM-ACCOUNT · ACTIVATIE",
        eyebrow: "Accountactivatie · Geen Automatisch Abonnement",
      };
    case "sv":
      return {
        template: {
          Subject: "Välkommen till Belowmark — din 1 Kostnadsfria Akt och dina bevakningar är aktiva (ingen prenumeration)",
          Preheader: "E-post bekräftad. Testa 14 dagar utan bindning — inga kortuppgifter sparade, ingen automatisk förnyelse.",
          Greeting: "Hej,",
          Body: "Din e-postadress är verifierad och ditt Belowmark-konto är nu aktivt. Inga betalningsuppgifter finns sparade på ditt konto: du har nu 1 komplett Kostnadsfri Fastighetsakt redo att användas på valfri exekutiv auktion (fullständigt målnummer, exakt gatuadress, objektsbeskrivning och värderingsutlåtande i PDF, budkalkylator samt AI-riskanalys). Din 14-dagars testperiod utan bindning avslutas automatiskt utan kostnad eller automatisk prenumeration.",
          Action: "Lös in min 1 Kostnadsfria Akt",
          Expiry: `14 dagars fri testperiod t.o.m. ${endDate} — avslutas automatiskt utan kostnad. Inget kort registrerat, ingen automatisk debitering eller förnyelse (ingen uppsägning behövs). Din Kostnadsfria Akt, minneslista och bevakningar förblir kostnadsfritt aktiva.`,
          Ignore: "Hantera dina sökbevakningar när som helst på ditt konto; att uppgradera till obegränsad Investor-åtkomst (/buchen) senare är helt valfritt.",
        },
        highlights: [
          "100 % utan bindning: inget betalkort sparat, ingen automatisk debitering eller prenumerationsförnyelse",
          "1 Kostnadsfri Komplett Akt ingår: lås upp 1 valfritt objekt (målnummer, adress, PDF & AI-kontroll) gratis",
          "Sökbevakningar (/app/alerts): kostnadsfria automatiska mejl vid nya utrop och ändrade visnings-/auktionsdatum",
        ],
        docCode: "BM-KONTO · AKTIVERING",
        eyebrow: "Kontoaktivering · Ingen Automatisk Prenumeration",
      };
    case "en":
      return {
        template: {
          Subject: "Welcome to Belowmark — your 1 Free Dossier & auction alerts are active (no subscription)",
          Preheader: "Email verified. Test 14 days commitment-free — no payment details stored, no auto-renewal.",
          Greeting: "Hello,",
          Body: "Your email address has been verified and your Belowmark account is active. No payment details are stored on your account: you now have 1 complimentary Full Property Dossier ready to redeem on any single auction property (unredacted case number, exact street address, official court/legal pack PDFs, AI risk verdict, and bid calculator). Your 14-day commitment-free test period ends automatically with zero charges and zero subscription auto-renewal.",
          Action: "Redeem my 1 Free Dossier",
          Expiry: `14-day commitment-free test period until ${endDate} — ends automatically at zero cost. No payment details on file, no automatic charge or subscription renewal (no cancellation needed). Your 1 Free Dossier, watchlist, and alerts stay active for free.`,
          Ignore: "Manage your search alerts anytime in your account; upgrading to unlimited Investor access (/buchen) later is completely optional.",
        },
        highlights: [
          "100% commitment-free: no card on file, no automatic billing or subscription renewal",
          "1 Free Full Dossier included: unlock 1 complete property file (address, PDFs & AI check) permanently free",
          "Search Alerts (/app/alerts): free automatic emails on new lots and auction date changes",
        ],
        docCode: "BM-ACCOUNT · ACTIVATED",
        eyebrow: "Account Activation · No Automatic Subscription",
      };
    default:
      return {
        template: {
          Subject: "Willkommen bei Belowmark — Ihr 1 Gratis-Dossier & Such-Alert sind aktiv (kein Abo)",
          Preheader: "E-Mail bestätigt. 14 Tage unverbindlich testen — endet automatisch, keine Zahlungsdaten hinterlegt.",
          Greeting: "Guten Tag,",
          Body: "Ihre E-Mail-Adresse ist bestätigt und Ihr Belowmark-Konto wurde freigeschaltet. Für Ihr Konto sind keinerlei Zahlungsdaten hinterlegt: Ab sofort liegt 1 vollständiges Gratis-Dossier bereit — öffnen Sie ein beliebiges Wunschobjekt komplett ungeschwärzt mit Aktenzeichen, Hausnummer, 5/10- & 7/10-Gebotsrechner, amtlichem Gutachten-PDF und KI-Risiko-Analyse. Ihr 14-tägiger Testzeitraum ist 100 % unverbindlich und endet automatisch ohne Kosten oder Abo-Verlängerung.",
          Action: "1 Gratis-Dossier jetzt einlösen",
          Expiry: `14 Tage unverbindlich testen bis ${endDate} — endet automatisch ohne Kosten. Keine Zahlungsdaten hinterlegt, keine automatische Abbuchung oder Abo-Verlängerung (keine Kündigung nötig). Ihr Gratis-Dossier, Merkliste und Such-Alerts bleiben dauerhaft kostenlos aktiv.`,
          Ignore: "Ihre kostenlosen Such-Alerts verwalten Sie jederzeit im Konto; ein späteres Upgrade auf den Investor-Vollzugang (/buchen) ist rein optional.",
        },
        highlights: [
          "100 % unverbindlich & ohne Abo-Falle: Keine Zahlungsdaten hinterlegt, endet automatisch ohne Abbuchung",
          "1 Gratis-Dossier inklusive: 1 Wunschobjekt dauerhaft mit Aktenzeichen, Adresse, PDF & KI-Check öffnen",
          "Kostenlose Such-Alerts (/app/alerts): Automatische E-Mail bei neuen Verfahren und Terminänderungen",
        ],
        docCode: "BM-KONTO · FREISCHALTUNG",
        eyebrow: "Kontoeröffnung · Kein Abo, Endet Automatisch",
      };
  }
}
