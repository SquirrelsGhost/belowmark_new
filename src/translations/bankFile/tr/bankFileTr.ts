import { IBankFileTranslation } from "../IBankFileTranslation";

export const BANK_FILE_TR: IBankFileTranslation = {
  MetaTags: {
    BankFile: {
      title: "Banka Dosyası — Belowmark",
      description: "İcra ihalesinden alınacak taşınmaz için kredi talebi: tutar, özkaynak, ihale sonrası ödeme planı ve teminat — her rakam kaynağıyla birlikte.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Banka dosyası", "Kredi", "İcra ihalesi"],
      url: "https://belowmark.com/app",
    },
  },

  Teaser: {
    Eyebrow: "Finansman",
    Title: "Banka dosyası",
    Lead: {
      DE: "Teminatı ihalede, kalan bedeli paylaştırma gününden önce ödersiniz. Dosya bankaya her şeyi tek seferde sunar: tutar, özkaynak, kanuna göre ödeme planı ve teminat için bankanın ne yapması gerektiği. Kredi onayının yerini tutmaz — onu yalnızca banka verir.",
      TR: "Teminatı teklif vermeden önce, kalan bedeli tutanağın ilanından itibaren 7 gün içinde ödersiniz. Dosya bankaya her şeyi tek seferde sunar: tutar, özkaynak ve kanuna göre ödeme planı. Kredi onayının yerini tutmaz — onu yalnızca banka verir.",
    },
    Button: "Banka dosyasını aç",
    ButtonHint: "Dosya yeni sekmede açılır. Orada teklif, özkaynak ve teminat yolunu girip PDF olarak kaydedersiniz.",
  },

  File: {
    Kicker: "Kredi talebi · İcra ihalesi",
    Title: "Banka dosyası",
    PrintedAt: "Oluşturma: {date}",
    DataAsOf: "İlan verisi: {date}",
    Print: "Yazdır / PDF",
    PrintHint: "Yazdırma penceresinde „PDF olarak kaydet“i seçin.",
    Back: "Dosya sayfasına dön",
    Locked: "Banka dosyası Investor planına dahildir",
    NoValue: "belirtilmedi",
    Sections: {
      ask: "Bankaya talep",
      request: "Finansman ihtiyacı",
      schedule: "İhaleden itibaren ödeme planı",
      deposit: "Teminat — bankanın yapması gereken",
      collateral: "Bankanın teminatı — ne zaman doğar",
      object: "Taşınmaz ve değer",
      risks: "Haklar ve riskler",
      limit: "Azami teklifin dayanağı",
      documents: "Banka için belgeler",
      notThis: "Bu dosya ne değildir",
      sources: "Kaynaklar",
    },
  },

  Form: {
    Title: "Dosya için bilgileriniz",
    Lead: "Her alan boş başlar. Özkaynak, faiz ve anapara ödemesi teklif limiti hesaplayıcısıyla ortaktır — burada değiştirince orada da değişir.",
    StorageHint: "Yalnızca bu tarayıcıda saklanır. Girdiler yazdırılmaz, yalnızca sonuç.",
    Fields: {
      plannedBid: { label: "Planlanan azami teklif", hint: "Teklif limitinizi almak için boş bırakın." },
      equity: { label: "Özkaynak", hint: "Kendi koyduğunuz tutar, teminat dahil." },
      interestPct: { label: "Hesap faizi", hint: "Sizin varsayımınız. Gerçek faizi banka söyler." },
      repaymentPct: { label: "Başlangıç anapara ödemesi", hint: "Yıllık, kredinin yüzdesi olarak." },
      fixedYears: { label: "İstenen vade / sabit faiz süresi", hint: "" },
    },
    Applicant: { label: "Başvuran (isteğe bağlı)", hint: "Talepte görünür. Bu tarayıcıda kalır.", placeholder: "Ad soyad" },
    Method: { label: "Teminat yolu", empty: "henüz açık" },
    Methods: {
      cheque: "Bundesbank / banka çeki",
      guarantee: "Banka kefaleti",
      transfer: "Mahkeme veznesine havale",
      portal: "e-Satış portalı",
    },
    Use: { label: "Kullanım", empty: "henüz açık" },
    Uses: { own: "Oturmak", rent: "Kiraya vermek", resale: "Yeniden satmak" },
    YearsSuffix: "yıl",
    Reset: "Dosya bilgilerini sil",
  },

  Ask: {
    Salutation: "Sayın yetkili,",
    Intro: "{court} nezdindeki {fileNo} sayılı dosyada {object} için teklif vermeyi planlıyorum. İhale: {date}. İlandaki değer: {value}.",
    Applicant: "Başvuran: {name}",
    NoApplicant: "Başvuran: ______________________",
    Requests: {
      loan: "{amount} tutarında finansman — toplam maliyet {total} eksi özkaynak {equity} (döküm bölüm 02'de).",
      guarantee: "İhale için teminat olarak {amount} tutarında süresiz, şartsız ve müteselsil kefalet (§ 69 Abs. 3 ZVG).",
      cheque: "İhaleden en erken üç iş günü önce düzenlenmiş {amount} tutarında Bundesbank veya banka çeki (§ 69 Abs. 2 ZVG).",
      transfer: "İhaleden önce hesaba geçecek şekilde mahkeme veznesine {amount} havale ve dekontu (§ 69 Abs. 4 ZVG).",
      portal: "Teklif vermeden önce e-Satış portalında {amount} tutarında teminatın hazır olması.",
      timing: "İhaleden önce yazılı kredi ön onayı; çünkü sonrasındaki ödemeler bölüm 03'teki sürelere bağlıdır.",
    },
    MissingBid: "Azami teklif eksik — yukarıya girin veya teklif limitinizi hesaplayın.",
    MissingEquity: "Özkaynak eksik — o olmadan kredi tutarı söylenemez.",
    MissingMethod: "Teminat yolu henüz açık.",
    Closing: "Sorularınız ve raporun incelenmesi için memnuniyetle hazırım.",
  },

  Request: {
    UsesTitle: "Fonların kullanımı",
    SourcesTitle: "Fonların kaynağı",
    Bid: "Azami teklif",
    BidFromLimit: "teklif limitinizden",
    BidOwn: "sizin girdiniz",
    Total: "Toplam maliyet",
    Equity: "Özkaynak",
    Loan: "Kredi ihtiyacı",
    LoanToValue: "Kredinin değere oranı",
    LoanToValueNote: "İcradaki değer — banka kendi ekspertizini yapar.",
    EquityShare: "Özkaynak oranı",
    TermsTitle: "Koşullara dair istekler",
    Interest: "Hesap faizi",
    InterestNote: "sizin varsayımınız, teklif değil",
    Repayment: "Başlangıç anapara ödemesi",
    MonthlyRate: "Hesap faizinizle aylık taksit",
    FixedYears: "Vade / sabit faiz süresi",
    Use: "Kullanım",
    Incomplete: "Yasal bir masraf kalemi hesaplanamadı (ör. ilanda KDV oranı yok) — toplam maliyet olduğundan düşük.",
    EquityShortForDeposit: "Özkaynağınız teminatı karşılamıyor. Bu durumda banka teminatı önceden finanse etmeli veya kefalet vermeli.",
    Guarantee: "Ek olarak: teminat için kefalet",
    GuaranteeBasis: "§ 69 Abs. 3 ZVG",
  },

  Schedule: {
    Columns: { when: "Ne zaman", what: "Ne", amount: "Tutar" },
    Steps: {
      DE: {
        deposit: { when: "İhalede, teklifin hemen ardından", text: "Teminat: bir ilgili isterse değerin onda biri. Bunu bekleyin.", basis: "§§ 67, 68 Abs. 1 ZVG", law: "zvg68" },
        balance: { when: "Paylaştırma gününden önce (tarihi mahkeme ihaleden sonra belirler)", text: "Nakit bedel mahkeme veznesine — gün öncesinde hesapta, dekont duruşmada. Mahkeme veznesine havale edilmiş teminat mahsup edilir.", basis: "§ 49 Abs. 3, § 107 Abs. 3 ZVG", law: "zvg49" },
        bidInterest: { when: "Nakit bedelle birlikte", text: "İhaleden paylaştırma gününe kadar nakit bedele %4 faiz.", basis: "§ 49 Abs. 2 ZVG, § 246 BGB", law: "zvg49" },
        transferTax: { when: "Vergi tebliğinden bir ay sonra", text: "Teklif ve devam eden haklar üzerinden tapu alım vergisi (Grunderwerbsteuer).", basis: "§§ 9, 15 GrEStG", law: "grestg" },
        courtFee: { when: "Mahkemenin masraf hesabına göre", text: "İhale kararı harcı.", basis: "KV 2214 GKG" },
        registryFee: { when: "Tescilden sonra", text: "Tapuya malik olarak tescil.", basis: "KV 14110 GNotKG" },
        own: { when: "Planınıza göre", text: "Tadilat, tahliye ve diğer.", basis: "sizin girdiniz" },
      },
      TR: {
        deposit: { when: "Teklif vermeden önce", text: "e-Satış portalında teminat.", basis: "İİK m.114/7", law: "esatis" },
        balance: { when: "Artırma sonuç tutanağının ilanından itibaren 7 gün içinde", text: "Kalan bedel (teklif eksi teminat), nakden. Ek süre yok.", basis: "İİK m.130", law: "iik" },
        fees: { when: "İcra dairesinin bildirimine göre, tescilden önce", text: "KDV, tapu harcı, damga vergisi, döner sermaye.", basis: "Satış şartnamesi" },
        own: { when: "Planınıza göre", text: "Tadilat, tahliye ve diğer.", basis: "sizin girdiniz" },
      },
    },
    BalanceGuaranteeNote: "Kefalette mahsup yoktur — nakit bedelin tamamı ödenir.",
    BalanceOpenNote: "Teminat yolu açık — mahsupsuz hesaplandı.",
    MissingInterestDays: "Paylaştırma gününe kadarki günleri teklif limitine girin",
    Unknown: "hesaplanamıyor",
    Footnote: {
      DE: "İhaleden sonraki tarihleri mahkeme ve vergi dairesi belirler. Dosya bu yüzden uydurma bir tarih değil, kanundaki sırayı verir.",
      TR: "7 günlük süre ihale gününden değil, tutanağın portalda ilanından itibaren işler.",
    },
  },

  Deposit: {
    Lead: {
      DE: "Tutar: değerin onda biri (§ 68 Abs. 1 ZVG). Nakit kabul edilmez (§ 69 Abs. 1 ZVG). Yalnızca şu üç yol geçerlidir:",
      TR: "Teminat teklif vermeden önce e-Satış portalında yatırılır. İcra dairesinin hangi teminat türlerini kabul ettiği ilanın şartnamesinde yazar.",
    },
    Ways: {
      DE: [
        { id: "cheque", title: "Bundesbank veya banka çeki", text: "Almanya'da yetkili bir kredi kuruluşu ya da Bundesbank tarafından, yurt içinde ödenebilir, ihaleden en erken üç iş günü önce düzenlenmiş olmalı. Daha erken düzenlenen çek reddedilir.", basis: "§ 69 Abs. 2 ZVG", law: "zvg69" },
        { id: "guarantee", title: "Banka kefaleti", text: "Süresiz, şartsız ve müteselsil; böyle bir kredi kuruluşundan, yurt içinde ifa edilecek. Banka bunun için komisyon isteyebilir.", basis: "§ 69 Abs. 3 ZVG", law: "zvg69" },
        { id: "transfer", title: "Mahkeme veznesine havale", text: "Tutar ihaleden önce vezne hesabına geçmiş, dekont ihalede hazır olmalı. Hesap bilgisini ve açıklamayı mahkeme verir.", basis: "§ 69 Abs. 4 ZVG", law: "zvg69" },
      ],
      TR: [{ id: "portal", title: "e-Satış portalında teminat", text: "Teklif vermeden önce portalda yatırılır, giriş e-Devlet ile. Bedelden mahsup edilir; ihaleden sonra ödemeyen teminatı kaybeder.", basis: "İİK m.114/7, m.130", law: "esatis" }],
    },
    Chosen: "seçildi",
  },

  Collateral: {
    Lead: {
      DE: "Bankalar Alman icra ihalelerinde esas olarak şu yüzden çekinir: ipotekleri (Grundschuld) tapuya yazılmadan ödeme yaparlar. Kanundaki akış:",
      TR: "Bankalar icra ihalelerinde esas olarak şu yüzden çekinir: 7 gün içinde ödemeleri gerekir, ipotek ise ancak tescilden sonra gelir. Kanundaki akış:",
    },
    Items: {
      DE: [
        { text: "İhale kararıyla (Zuschlag) malik olursunuz — noter sözleşmesi olmadan ve tescilden önce.", basis: "§ 90 Abs. 1 ZVG" },
        { text: "Banka için ipoteği (Grundschuld) ihaleden sonra verebilirsiniz. Ancak tapuya, mahkeme sizi malik olarak tescil ettirmek için tapu dairesine başvurduktan sonra yazılır.", basis: "§ 130 Abs. 3 ZVG", law: "zvg130" },
        { text: "Mahkeme bu başvuruyu ancak paylaştırma planı uygulanıp ihale kararı kesinleşince yapar — yani paylaştırma gününden sonra.", basis: "§ 130 Abs. 1 ZVG", law: "zvg130" },
        { text: "Tescil için tapu dairesi vergi dairesinin ilişiksizlik belgesini ister; bu genelde tapu alım vergisinin ödenmesine bağlıdır.", basis: "§ 22 GrEStG", law: "grestg" },
        { text: "Nakit bedeli ödemezseniz mahkeme alacağı hak sahiplerine devreder, taşınmazınıza ipotek koyar ve yeniden ihale gündeme gelir.", basis: "§§ 118, 128, 133 ZVG", law: "zvg118" },
        { text: "Tescile kadarki süreyi bankanın nasıl güvenceye alacağına — örneğin ipoteği ihaleden hemen sonra noterde kurup ödemeyi doğrudan veznede yapmak — banka karar verir.", basis: "bankanın kararı" },
      ],
      TR: [
        { text: "Teminat teklif öncesi portalda yatırılır ve bedelden mahsup edilir.", basis: "İİK m.114/7", law: "iik" },
        { text: "Kalan bedeli tutanağın portalda ilanından itibaren 7 gün içinde nakden ödersiniz. 2021 değişikliğinden beri ek süre yoktur.", basis: "İİK m.130 (7343 sayılı Kanun)", law: "iik" },
        { text: "Tescil ancak ihale kesinleşince yapılır. Banka lehine ipotek ancak bundan sonra kurulabilir.", basis: "İİK m.134", law: "iik" },
        { text: "Ödemezseniz teminat yanar. 31.07.2026 ve sonrasında ilan edilen ihalelerde kanun ayrıca teklifin %5'i oranında idari para cezası öngörür.", basis: "İİK m.114/7-9 (7589 sayılı Kanun)", law: "iik" },
        { text: "Sonuç: Teklif öncesi kredi ön onayı olmadan 7 günlük süreye bir bankayla yetişmek çok zordur.", basis: "Süreler İİK m.130, m.134" },
      ],
    },
  },

  Object: {
    ReportTitle: "Rapordan temel veriler",
    NoReport: "Rapor yüklenmedi. Dosya sayfasından yükleyin — banka onu zaten eksiksiz ister.",
    ReportFrom: "„{file}“ dosyasından, sayfasıyla birebir",
    RisksLead: "İlan ve rapordan risk lambası. Gri: hiçbir kaynak bir şey söylemiyor.",
    RiskFrom: { notice: "İlan", report: "Rapor s. {pages}", none: "kaynak yok" },
  },

  Documents: {
    Lead: "Bankaların genelde görmek istedikleri. Her bankanın kendi listesi vardır — sorun.",
    Groups: {
      DE: [
        { title: "Taşınmaz", items: ["Eksiksiz değer raporu (mahkemede veya zvg-portal.de'de)", "İhale ilanı (Terminsbestimmung)", "Tapu kaydı (genelde raporun eki)", "Kadastro paftası ve alan hesabı", "Kiradaysa kira sözleşmeleri", "Planlanıyorsa tadilat maliyet planı"] },
        { title: "Siz", items: ["Kimlik", "Son aylara ait gelir belgeleri", "Vergi tahakkukları", "Özkaynak kanıtı", "Bankanın öz beyan formu", "Mevcut kredilerin listesi"] },
      ],
      TR: [
        { title: "Taşınmaz", items: ["Satış ilanı ve şartname", "Kıymet takdir raporu", "Tapu kaydı ve ada / parsel bilgisi", "Varsa fotoğraflar ve kroki"] },
        { title: "Siz", items: ["Kimlik / pasaport", "Gelir belgeleri", "Vergi numarası", "Özkaynak kanıtı"] },
      ],
    },
  },

  NotThis: {
    Items: [
      { text: "Kredi onayı veya teklif değildir. Finansman olup olmayacağına ve koşullarına yalnızca banka karar verir.", basis: "—" },
      { text: "Kredi aracılığı değildir. Belowmark kredi aracılığı yapmaz ve sizin adınıza hiçbir bankayla görüşmez.", basis: "§ 34i GewO", law: "gewo34i" },
      { text: "Banka ekspertizi değildir. Değer, icra dosyasındaki rapordan gelir; banka kendi değerlemesini yapar.", basis: "—" },
      { text: "Hukuki danışmanlık değildir. Kanun maddeleri okumanız için bağlantılıdır.", basis: "—" },
    ],
  },

  SourceNames: {
    notice: "Resmî ilan",
    document: "İlan (PDF)",
    zvg: "Zwangsversteigerungsgesetz (ZVG)",
    grestg: "Grunderwerbsteuergesetz (GrEStG)",
    gewo: "Gewerbeordnung § 34i",
    iik: "İcra ve İflas Kanunu (İİK)",
    esatis: "UYAP e-Satış",
  },
};
