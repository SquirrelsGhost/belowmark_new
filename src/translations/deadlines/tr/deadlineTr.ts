import { IDeadlineTranslation } from "../IDeadlineTranslation";

export const DEADLINE_TR: IDeadlineTranslation = {
  MetaTags: {
    title: "Süre Takibi — Belowmark",
    description: "İlandan ihaleye kadar tüm süreler, mevzuat kaynağıyla: teminat, artırma başlangıcı ve bitişi. E-posta hatırlatması ve takvim aboneliği ile.",
    imgUrl: "https://belowmark.com/og/home.png",
    tags: ["süre", "icra ihalesi", "teminat", "takvim"],
    url: "https://belowmark.com/app/termine",
  },
  Nav: "Süreler",

  Section: {
    Eyebrow: "Süre takibi",
    Title: "Süreler ve yol haritası",
    Lead: {
      DE: "İhaleye kadar her süre, ilandaki tarihten hesaplanır ve kanun maddesiyle gösterilir. Dosyayı takip edin; e-posta ve takvimle hatırlatalım.",
      TR: "e-Satış artırmalarının her süresi, ilandaki tarihlerden hesaplanır ve mevzuat maddesiyle gösterilir. Dosyayı takip edin; e-posta ve takvimle hatırlatalım.",
    },
    Locked: {
      Title: "Hatırlatmalı süreler",
      Body: "Süre takibi teminat ve artırma tarihlerini ilandan hesaplar, e-posta ve takvimle hatırlatır. Investor paketine dahildir.",
    },
    NoDates: "İlanda tarih yok; bu yüzden süre hesaplanamıyor.",
    Cancelled: "Satış düşmüş. Süreler artık işlemiyor.",
    Phases: { before: "İhaleden önce", hearing: "İhale", after: "İhaleden sonra" },
    Basis: { law: "Mevzuat", notice: "İlan", user: "Sizin girdiğiniz", rule: "belowmark önerisi" },
    Kinds: { deadline: "Son gün", appointment: "Tarih", task: "Bu günden itibaren", info: "Bilgi" },
    AfterAwardEmpty: "İhaleden sonraki süreler (ödeme, tescil, tahliye) sonucu girdiğinizde burada görünür.",
    Reminders: "Hatırlatma",
    ReminderDay: "1 gün önce",
    ReminderDays: "{days} gün önce",
    ReminderToday: "aynı gün",
    Disclaimer: "Resmî tatiller hesaba katılmadan ve hiçbir gün geç kalmayacak şekilde hesaplanmıştır. Esas olan kanun ve icra dairesinin bildirimidir; hukuki danışmanlık değildir.",
  },

  Status: {
    Past: "geçti",
    Today: "bugün",
    Tomorrow: "yarın",
    InDays: "{days} gün sonra",
  },

  Follow: {
    Start: "Dosyayı takip et",
    Stop: "Takibi bırak",
    Following: "Bu dosyayı takip ediyorsunuz.",
    NotFollowing: "Henüz hatırlatma kurulmadı.",
    MailOn: "E-posta hatırlatması açık",
    MailOff: "E-posta hatırlatması kapalı",
    Download: "Süreleri takvime aktar (.ics)",
    Overview: "Tüm süreler",
    Error: "Olmadı. Lütfen tekrar deneyin.",
  },

  Checklist: {
    Title: "İhaleye kadar yol haritası",
    Hint: "İşaretler bu tarayıcıda kalır. belowmark işaretli adımları kendimiz tanırız.",
    Progress: "{total} adımdan {done} tamam",
    Auto: "tanındı",
    Steps: {
      DE: [
        { id: "gutachten", Label: "Bilirkişi raporunu okut", Hint: "Raporu yükleyin; risk lambası hakları, kiracıyı ve yapım yılını kontrol eder." },
        { id: "inspection", Label: "Taşınmazı gör", Hint: "En azından dışarıdan; sorular karar bölümünde." },
        { id: "limit", Label: "Teklif limitini belirle", Hint: "Hangi teklife kadar kârlı? Sizin rakamlarınız, sizin sınırınız." },
        { id: "bank", Label: "Finansmanı sor", Hint: "Banka dosyası ödeme planını ve süreleri bankaya gösterir." },
        { id: "deposit", Label: "Teminatı netleştir", Hint: "Havale, çek veya banka kefaleti: günler zaman çizelgesinde." },
        { id: "papers", Label: "Teklif dosyasını yazdır", Hint: "Kimlik, vekâletname, teminat belgesi ve limitiniz kâğıtta." },
      ],
      TR: [
        { id: "gutachten", Label: "Kıymet takdir raporunu okut", Hint: "Raporu yükleyin; risk lambası hakları, kiracıyı ve durumu kontrol eder." },
        { id: "inspection", Label: "Taşınmazı gör", Hint: "En azından dışarıdan; sorular karar bölümünde." },
        { id: "limit", Label: "Teklif limitini belirle", Hint: "Tapu harcı ve KDV dahil hangi teklife kadar kârlı?" },
        { id: "bank", Label: "Finansmanı önceden netleştir", Hint: "Artırmadan sonra ödeme için yalnızca 7 gün var; bankadan ön onay olmadan zor." },
        { id: "deposit", Label: "Teminatı yatır", Hint: "Portaldan nakit veya teminat mektubu: süreler zaman çizelgesinde." },
        { id: "papers", Label: "e-Devlet ve portal erişimini kontrol et", Hint: "Teklif yalnızca e-Devlet ile e-Satış portalına girişle verilir." },
      ],
    },
  },

  Items: {
    DE: {
      Notice: {
        Title: "İlan yayımlandı",
        Detail: "İhale tarihi en az altı hafta önce ilan edilmiş olmalıdır. Hazırlığınız buradan başlar.",
      },
      Transfer: {
        Title: "Havale ile teminat: hesaba geçmiş olmalı",
        Detail: "Nakit kabul edilmez. Havale ancak ihaleden önce mahkeme veznesinin hesabına geçmiş ve dekont ihalede ibraz edilirse geçerlidir. Hesap ve açıklamayı mahkeme bildirir. Güvenli hesap: bir gün önce.{amount}",
      },
      Cheque: {
        Title: "Çek için en erken gün",
        Detail: "Çek (Verrechnungsscheck) ancak ihaleden en erken üç iş günü önce, Almanya'da izinli bir banka veya Bundesbank tarafından düzenlenmiş ve yurt içinde ödenebilir ise geçerlidir. Daha önce düzenlenen çek reddedilir. Cumartesi iş günü sayıldı, tatiller düşülmedi; yani asla erken değil.",
      },
      Hearing: {
        Title: "İhale günü",
        Detail: "{authority}. Teklif çağrısı ile kapanış arasında en az 30 dakika bulunur. Yanınızda: kimlik, teminat belgesi, temsilde onaylı vekâletname.",
      },
      Award: {
        Title: "İhale kararı en geç (düzenleyici süre)",
        Detail: "Zuschlag ihalede veya en fazla bir hafta sonrasına konan ayrı bir tefhim gününde açıklanır. Tefhimle malik olursunuz. Gerçek tarihi mahkeme bildirir.",
      },
      Amount: " Bir ilgili teminat isterse tutar: {amount} (muhammen bedelin %10'u).",
    },
    TR: {
      Notice: {
        Title: "İlan yayımlandı",
        Detail: "Artırma, başlangıçtan en az 15 gün önce e-Satış portalında ilan edilmiş olmalıdır.",
      },
      RoundStart: {
        Title: "{round}. artırma başlıyor",
        Detail: "Bundan sonra e-Satış portalında teklif verilebilir; teklif süresi yedi gündür.{startingBid}",
      },
      Cash: {
        Title: "{round}. artırma: nakit teminat saat 23.30'a kadar",
        Detail: "Teminatı portal üzerinden icra dairesinin hesabına en geç artırma bitiminden önceki gün saat 23.30'a kadar yatırın.{amount}",
      },
      Letter: {
        Title: "{round}. artırma: teminat mektubu mesai bitimine kadar",
        Detail: "Teminat mektubu en geç artırma bitiminden önceki iş günü mesai bitimine kadar icra dairesine verilmelidir. Resmî tatiller düşülmedi; bu gün tatile denk gelirse bir önceki iş günü geçerlidir.",
      },
      RoundEnd: {
        Title: "{round}. artırma bitiyor",
        Detail: "Son on dakikada yeni teklif gelirse artırma her seferinde üç dakika uzar, toplamda en fazla bir saat. Ardından artırma sonuç tutanağı ilan edilir; ödeme için yedi gün o andan başlar.",
      },
      Amount: " Tutar: {amount} (muhammen bedelin %10'u).",
      StartingBid: " İlandaki başlangıç bedeli: {amount}.",
    },
  },

  Page: {
    Eyebrow: "Süre takibi",
    Title: "Süreler",
    Lead: "Takip ettiğiniz dosyaların tüm süreleri tek listede. E-postayla hatırlatılır, kendi takviminize abone olunur.",
    Count: "{count} dosya takipte",
    Empty: {
      Title: "Henüz takip edilen dosya yok",
      Body: "Bir dosya sayfası açın ve „Süreler ve yol haritası“ bölümünde „Dosyayı takip et“e dokunun.",
      Cta: "Aramaya git",
    },
    Next: "Sıradaki",
    NothingAhead: "Açık süre kalmadı.",
    OpenListing: "Dosyaya git",
    Missing: "Güncel veride artık yok",
    Feed: {
      Title: "Takvim aboneliği",
      Body: "Bu adresi Google Takvim, Outlook veya Apple Takvim'e abonelik olarak ekleyin (\"URL ile\"). Yeni dosyalar ve değişen tarihler kendiliğinden gelir, öncesinde hatırlatmayla.",
      Create: "Abonelik adresi oluştur",
      Renew: "Yeni adres oluştur",
      Copy: "Kopyala",
      Copied: "Kopyalandı",
      Shown: "Yalnızca şimdi görünür. Adresi açık metin olarak saklamıyoruz; bilen herkes sürelerinizi görür.",
      Hidden: "Abonelik kurulu. Adresi mi kaybettiniz? Yenisini oluşturun, eskisi çalışmayı bırakır.",
      Error: "Adres oluşturulamadı.",
    },
    HowItWorks: "Her sürede yazan günlerde sabah e-postayla ve takvim aboneliğinde hatırlatılır. Tarihler ilan verisinden gelir; icra dairesi bir şey değiştirirse süre bir sonraki veri güncellemesinde izler.",
  },

  Mail: {
    Subject: "{count} süre yaklaşıyor",
    SubjectOne: "Bir süre yaklaşıyor",
    Preheader: "belowmark süre takibiniz.",
    Greeting: "Merhaba,",
    Intro: "takip ettiğiniz dosyalarda yaklaşanlar:",
    Today: "bugün",
    Tomorrow: "yarın",
    InDays: "{days} gün sonra",
    OpenListing: "Dosyayı aç",
    Manage: "Hatırlatmaları yönet",
    Signature: "belowmark",
    Footer: "Bu e-postayı bir dosyayı takip ettiğiniz için alıyorsunuz. „Süreler“ sayfasından kapatabilirsiniz.",
    Source: "Dayanak",
  },

  Ics: {
    CalendarName: "belowmark süreler",
    Source: "Kaynak",
  },
};
