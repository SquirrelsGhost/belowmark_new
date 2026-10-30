import { BlogLang } from "@/types/blog.types";

export interface BlogUiCopy {
  dateline: string;
  badgeSuffix: string;
  dossierPrefix: string;
  dossiersCountLabel: string;
  langNavLabel: string;
  defaultH1Top: string;
  defaultH1Below: string;
  sub: string;
  read: string;
  min: string;
  backToHub: string;
  directAnswerLabel: string;
  takeawaysTitle: string;
  faqTitle: string;
  ctaEyebrow: string;
  ctaHeadline: string;
  ctaSub: string;
  primaryBtn: string;
  secondaryBtn: string;
}

export const BLOG_LANG_SWITCH: readonly { code: BlogLang; flag: string; label: string; href: string }[] = [
  { code: "de", flag: "DE", label: "Deutsch", href: "/blog" },
  { code: "tr", flag: "TR", label: "Türkçe", href: "/tr/blog" },
  { code: "en", flag: "EN", label: "English", href: "/en/blog" },
  { code: "ar", flag: "AR", label: "العربية", href: "/ar/blog" },
  { code: "ru", flag: "RU", label: "Русский", href: "/ru/blog" },
];

export const BLOG_COPY: Record<BlogLang, BlogUiCopy> = {
  de: {
    dateline: "Amtliches Fachverzeichnis · ZVG & UYAP Analysen",
    badgeSuffix: "FACHVERZEICHNIS & RATGEBER",
    dossierPrefix: "AKTE",
    dossiersCountLabel: "Dossiers · 5 Sprachen",
    langNavLabel: "Sprachauswahl",
    defaultH1Top: "Zwangsversteigerungen & Ausschreibungen.",
    defaultH1Below: "Praxisleitfäden unter Marktwert.",
    sub: "Quellenbasierte Analysen zu §§ 68, 74a, 85a ZVG, Verkehrswertgutachten, Sicherheitsleistung und UYAP E-İhale in 5 Sprachen (DE · TR · EN · AR · RU).",
    read: "Akte & Leitfaden öffnen →",
    min: "Min. Lesezeit",
    backToHub: "← Alle Fachbeiträge",
    directAnswerLabel: "Amtliche Kurzfassung · Direktantwort",
    takeawaysTitle: "Wichtigste Prüfpunkte auf einen Blick",
    faqTitle: "Häufig gestellte Rechts- & Praxisfragen (FAQ)",
    ctaEyebrow: "Live-Verfahren prüfen",
    ctaHeadline: "Alle ZVG- & UYAP-Termine mit 5/10- und 7/10-Grenze live abgleichen",
    ctaSub: "Berechnen Sie Mindestgebot, Sicherheitsleistung und Grunderwerbsteuer je Verfahren oder testen Sie den Vollzugang.",
    primaryBtn: "Zugang kostenlos testen →",
    secondaryBtn: "Zum Gebotsrechner →",
  },
  tr: {
    dateline: "Resmî Rehber · ZVG & UYAP İhale Analizleri",
    badgeSuffix: "İHALE REHBERİ & ANALİZ",
    dossierPrefix: "DOSYA",
    dossiersCountLabel: "Rehber · 5 Dil",
    langNavLabel: "Dil seçimi",
    defaultH1Top: "İcra ve İhalelerde Gayrimenkul.",
    defaultH1Below: "Piyasa Altı Uygulama Rehberleri.",
    sub: "Almanya (ZVG §§ 68, 74a, 85a) ve Türkiye (UYAP E-İhale) gayrimenkul ihaleleri, teminat ve bilirkişi raporu analizleri (DE · TR · EN · AR · RU).",
    read: "Rehberi incele →",
    min: "dk okuma",
    backToHub: "← Tüm Rehberler",
    directAnswerLabel: "Özet Değerlendirme · Doğrudan Yanıt",
    takeawaysTitle: "Tek Bakışta Kritik Kontrol Noktaları",
    faqTitle: "Sıkça Sorulan Sorular (SSS)",
    ctaEyebrow: "Canlı İhale Radarı",
    ctaHeadline: "Tüm ZVG ve UYAP ihalelerini 5/10 ve 7/10 sınırlarıyla canlı inceleyin",
    ctaSub: "Her dosya için asgari teklif, teminat ve vergi yükünü hesaplayın veya platformu ücretsiz deneyin.",
    primaryBtn: "Ücretsiz dene →",
    secondaryBtn: "Teklif hesaplayıcı →",
  },
  en: {
    dateline: "Official Dossier Index · Foreclosure & Auction Guides",
    badgeSuffix: "FORECLOSURE & AUCTION GUIDES",
    dossierPrefix: "DOSSIER",
    dossiersCountLabel: "Dossiers · 5 Languages",
    langNavLabel: "Language selection",
    defaultH1Top: "Court Foreclosures & Public Auctions.",
    defaultH1Below: "Below-Market Investment Guides.",
    sub: "Evidence-based guides on German court auctions (ZVG §§ 68, 74a, 85a), appraisal reports, security deposits, and Turkish UYAP e-auctions across 5 languages.",
    read: "Read full dossier →",
    min: "min read",
    backToHub: "← All Guides",
    directAnswerLabel: "Executive Summary · Direct Answer",
    takeawaysTitle: "Key Verification Points at a Glance",
    faqTitle: "Frequently Asked Questions (FAQ)",
    ctaEyebrow: "Live Auction Radar",
    ctaHeadline: "Benchmark live court foreclosure proceedings with 5/10 and 7/10 limits",
    ctaSub: "Calculate minimum bids, security deposits, and transfer taxes per proceeding or start a free trial.",
    primaryBtn: "Start free trial →",
    secondaryBtn: "Open Bid Calculator →",
  },
  ar: {
    dateline: "الدليل الرسمي · تحليلات المزادات العقارية القضائية",
    badgeSuffix: "أدلة المزادات العقارية",
    dossierPrefix: "ملف",
    dossiersCountLabel: "أدلة · 5 لغات",
    langNavLabel: "اختيار اللغة",
    defaultH1Top: "المزادات العقارية والبيوع القضائية.",
    defaultH1Below: "أدلة الشراء بأقل من القيمة السوقية.",
    sub: "أدلة عملية موثقة حول مزادات المحاكم الألمانية (ZVG) ونظام المزادات الإلكترونية التركي (UYAP) وتقييم العقارات بخمس لغات.",
    read: "اقرأ الدليل الكامل ←",
    min: "دقائق قراءة",
    backToHub: "→ جميع الأدلة",
    directAnswerLabel: "ملخص تنفيذي · إجابة مباشرة",
    takeawaysTitle: "أهم نقاط الفحص والتحقق باختصار",
    faqTitle: "الأسئلة الشائعة (FAQ)",
    ctaEyebrow: "رادار المزادات المباشر",
    ctaHeadline: "افحص المزادات العقارية الرسمية وقارن الحدود القانونية 5/10 و7/10 مباشرة",
    ctaSub: "احسب الحد الأدنى للعطاء والتأمين وضريبة نقل الملكية لكل ملف أو ابدأ تجربتك المجانية.",
    primaryBtn: "ابدأ التجربة المجانية ←",
    secondaryBtn: "حاسبة العطاءات ←",
  },
  ru: {
    dateline: "Официальный справочник · Аналитика судебных торгов ZVG и UYAP",
    badgeSuffix: "СПРАВОЧНИК И РУКОВОДСТВА",
    dossierPrefix: "ДОСЬЕ",
    dossiersCountLabel: "Досье · 5 языков",
    langNavLabel: "Выбор языка",
    defaultH1Top: "Судебные аукционы по недвижимости.",
    defaultH1Below: "Покупка объектов ниже рынка.",
    sub: "Практические руководства по судебным торгам Германии (ZVG §§ 68, 74a, 85a), оценке стоимости, залогу и торгам UYAP в Турции на 5 языках.",
    read: "Открыть руководство →",
    min: "мин чтения",
    backToHub: "← Все руководства",
    directAnswerLabel: "Краткое резюме · Прямой ответ",
    takeawaysTitle: "Ключевые пункты проверки кратко",
    faqTitle: "Часто задаваемые вопросы (FAQ)",
    ctaEyebrow: "Радар актуальных торгов",
    ctaHeadline: "Проверяйте лоты судебных торгов с расчетом лимитов 5/10 и 7/10",
    ctaSub: "Рассчитайте минимальную ставку, залог и налог на покупку или протестируйте доступ бесплатно.",
    primaryBtn: "Попробовать бесплатно →",
    secondaryBtn: "Калькулятор ставок →",
  },
};
