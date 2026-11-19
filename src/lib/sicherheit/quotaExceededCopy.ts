import { LocaleOption } from "@/lib/constants";

export interface QuotaExceededLocaleCopy {
  kicker: string;
  title: string;
  bodyFree: string;
  bodyPaid: string;
  warning: string;
  retryPrefix: string;
  minutes: string;
  ctaFree: string;
  ctaBack: string;
}

export const QUOTA_EXCEEDED_COPY: Record<LocaleOption, QuotaExceededLocaleCopy> = {
  de: {
    kicker: "Sicherheitsschutz · Abruflimit erreicht",
    title: "Ungewöhnlich hohe Abruffrequenz erkannt",
    bodyFree:
      "Im kostenlosen Konto ist das Kontingent für Einzelabrufe zum Schutz vor automatisiertem Datenabzug begrenzt. Mit dem Investor-Tarif schalten Sie das volle Arbeitskontingent, alle Verkehrswerte und Gutachten frei.",
    bodyPaid:
      "Zum Schutz vor automatisiertem Massen-Scraping ist die Anzahl gleichzeitiger Abrufe begrenzt. Bitte warten Sie einen kurzen Moment, bevor Sie weitere Verfahren öffnen.",
    warning:
      "Wichtiger Hinweis (§ 9 AGB): Automatisiertes Auslesen (Scraping/Bots) oder das Umgehen von Schutzmechanismen führt zur sofortigen, dauerhaften Kontosperrung ohne Anspruch auf Rückerstattung.",
    retryPrefix: "Erneuter Abruf möglich in ca.",
    minutes: "Min.",
    ctaFree: "Investor-Tarif 7 Tage gratis testen",
    ctaBack: "Zurück zur Übersicht",
  },
  tr: {
    kicker: "Güvenlik Koruması · Sorgu Sınırı",
    title: "Olağandışı sorgu sıklığı algılandı",
    bodyFree:
      "Otomatik veri çekimini önlemek amacıyla ücretsiz hesaplarda günlük detay görüntüleme sayısı sınırlandırılmıştır. Tam erişim, muhammen bedeller ve şartnameler için Yatırımcı paketine geçebilirsiniz.",
    bodyPaid:
      "Otomatik toplu veri çekimini (scraping) engellemek için anlık sorgu sınırı uygulanmaktadır. Lütfen kısa bir süre bekleyip tekrar deneyin.",
    warning:
      "Önemli Uyarı (§ 9 AGB): Otomatik veri çekimi (scraping/bot) veya güvenlik sınırlarını aşma girişimleri hesabın derhal kapatılmasına yol açar.",
    retryPrefix: "Tekrar deneme süresi:",
    minutes: "dk.",
    ctaFree: "7 Gün Ücretsiz Dene",
    ctaBack: "Listeye Dön",
  },
  en: {
    kicker: "Security Guard · Request Limit Reached",
    title: "Unusually high request rate detected",
    bodyFree:
      "Free alert accounts include a daily preview quota to prevent automated bulk scraping. Start your 7-day Investor trial (0.00 today) to unlock full dossier quotas, valuations, and official PDFs.",
    bodyPaid:
      "To protect against automated bulk scraping, concurrent requests are rate-limited. Please wait a brief moment before opening additional files.",
    warning:
      "Notice (§ 9 Terms): Automated scraping or bypassing security controls results in immediate account suspension without refund.",
    retryPrefix: "Retry available in approx.",
    minutes: "min",
    ctaFree: "Start 7-Day Free Trial",
    ctaBack: "Back to Search",
  },
  fr: {
    kicker: "Protection anti-scraping · Limite atteinte",
    title: "Fréquence de consultation inhabituelle détectée",
    bodyFree:
      "Le compte gratuit limite le nombre d'aperçus quotidiens contre l'extraction automatisée. Activez l'essai Investisseur 7 jours (0,00 € aujourd'hui) pour débloquer tous les dossiers et PDF.",
    bodyPaid:
      "Pour empêcher l'extraction massive automatisée, le nombre de requêtes simultanées est limité. Veuillez patienter quelques instants.",
    warning:
      "Rappel (§ 9 CGV) : toute extraction automatisée (scraping/bots) entraîne la suspension immédiate du compte.",
    retryPrefix: "Nouvel essai possible dans env.",
    minutes: "min",
    ctaFree: "Essayer 7 jours gratuitement",
    ctaBack: "Retour à la liste",
  },
  es: {
    kicker: "Protección de seguridad · Límite alcanzado",
    title: "Frecuencia de consulta inusual detectada",
    bodyFree:
      "La cuenta gratuita limita las vistas diarias para evitar el scraping automatizado. Inicia la prueba Inversor de 7 días (0,00 € hoy) para desbloquear todos los expedientes y PDFs.",
    bodyPaid:
      "Para evitar la extracción masiva automatizada, las consultas simultáneas están limitadas. Espera unos instantes antes de abrir más lotes.",
    warning:
      "Aviso (§ 9 Condiciones): la extracción automatizada (scraping/bots) conlleva el bloqueo inmediato de la cuenta.",
    retryPrefix: "Disponible de nuevo en aprox.",
    minutes: "min",
    ctaFree: "Probar 7 días gratis",
    ctaBack: "Volver al listado",
  },
  it: {
    kicker: "Protezione anti-scraping · Limite raggiunto",
    title: "Frequenza di consultazione insolita rilevata",
    bodyFree:
      "L'account gratuito prevede un limite giornaliero contro lo scraping automatico. Attiva la prova Investitore di 7 giorni (0,00 € oggi) per sbloccare tutti i fascicoli e le perizie PDF.",
    bodyPaid:
      "Per proteggere la piattaforma dallo scraping massivo, le richieste simultanee sono limitate. Attendi qualche istante prima di proseguire.",
    warning:
      "Avviso (§ 9 Condizioni): l'estrazione automatizzata (scraping/bot) comporta il blocco immediato dell'account.",
    retryPrefix: "Nuovo tentativo tra circa",
    minutes: "min",
    ctaFree: "Prova 7 giorni gratis",
    ctaBack: "Torna alla ricerca",
  },
  pl: {
    kicker: "Ochrona bezpieczeństwa · Osiągnięto limit zapytań",
    title: "Wykryto nietypowo wysoką częstotliwość zapytań",
    bodyFree:
      "Darmowe konto zawiera dzienny limit podglądów chroniący przed automatycznym scrapingiem. Uruchom 7-dniowy okres próbny Investor (0,00 zł dzisiaj), aby odblokować pełne akta, wyceny i oficjalne dokumenty PDF.",
    bodyPaid:
      "W celu ochrony przed masowym scrapingiem liczba jednoczesnych zapytań jest ograniczona. Odczekaj chwilę przed otwarciem kolejnych spraw.",
    warning:
      "Uwaga (§ 9 Regulaminu): automatyczne pobieranie danych (scraping/boty) prowadzi do natychmiastowej blokady konta bez zwrotu środków.",
    retryPrefix: "Ponowna próba możliwa za ok.",
    minutes: "min",
    ctaFree: "Wypróbuj 7 dni za darmo",
    ctaBack: "Powrót do listy",
  },
  cs: {
    kicker: "Bezpečnostní ochrana · Dosažen limit požadavků",
    title: "Zjištěna neobvykle vysoká frekvence požadavků",
    bodyFree:
      "Bezplatný účet má denní limit zobrazení jako ochranu před automatizovaným scrapingem. Spusťte 7denní zkušební verzi Investor (dnes 0 Kč) a odemkněte plné spisy, odhady a oficiální PDF.",
    bodyPaid:
      "Z důvodu ochrany před hromadným scrapingem je počet souběžných požadavků omezen. Počkejte prosím chvíli, než otevřete další řízení.",
    warning:
      "Upozornění (§ 9 Podmínek): automatizovaný scraping nebo obcházení ochrany vede k okamžitému zablokování účtu bez nároku na vrácení peněz.",
    retryPrefix: "Další pokus možný přibližně za",
    minutes: "min",
    ctaFree: "Vyzkoušet 7 dní zdarma",
    ctaBack: "Zpět na přehled",
  },
  nl: {
    kicker: "Beveiliging · Aanvraaglimiet bereikt",
    title: "Ongewoon hoge aanvraagfrequentie gedetecteerd",
    bodyFree:
      "Het gratis account heeft een dagelijkse weergavelimiet tegen geautomatiseerd scrapen. Start uw 7-daagse Investor-proefperiode (€ 0,00 vandaag) voor volledige dossiers, taxaties en officiële PDF's.",
    bodyPaid:
      "Om geautomatiseerd bulk-scrapen te voorkomen is het aantal gelijktijdige aanvragen begrensd. Wacht een kort moment voordat u meer dossiers opent.",
    warning:
      "Let op (§ 9 Voorwaarden): geautomatiseerd scrapen of omzeilen van beveiliging leidt tot onmiddellijke blokkering van het account zonder restitutie.",
    retryPrefix: "Opnieuw proberen over ca.",
    minutes: "min",
    ctaFree: "7 dagen gratis proberen",
    ctaBack: "Terug naar overzicht",
  },
  sv: {
    kicker: "Säkerhetsskydd · Förfrågningsgräns nådd",
    title: "Ovanligt hög förfrågningsfrekvens upptäckt",
    bodyFree:
      "Gratiskontot har en daglig gräns som skydd mot automatiserad skrapning. Starta din 7-dagars kostnadsfria Investor-provperiod (0 kr idag) för fullständiga akter, värderingar och officiella PDF-dokument.",
    bodyPaid:
      "För att skydda mot automatiserad masskrapning är antalet samtidiga förfrågningar begränsat. Vänta en kort stund innan du öppnar fler ärenden.",
    warning:
      "Observera (§ 9 Villkor): automatiserad skrapning eller kringgående av säkerhetskontroller leder till omedelbar avstängning utan återbetalning.",
    retryPrefix: "Nytt försök möjligt om ca",
    minutes: "min",
    ctaFree: "Prova 7 dagar gratis",
    ctaBack: "Tillbaka till sökningen",
  },
};
