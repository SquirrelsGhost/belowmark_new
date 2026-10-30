import { IClosingTranslation } from "../IClosingTranslation";
import { CLOSING_TASKS_TR } from "./closingTasksTr";

export const CLOSING_TR: IClosingTranslation = {
  MetaTags: {
    Tasks: {
      title: "İhaleden sonra — Belowmark",
      description: "İhaleden sonraki görev listesi: ödeme, harçlar, tapu tescili, tahliye, DASK ve tadilat — süreler sizin tarihlerinizden, her kural kaynağıyla.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["ihale", "icra", "tapu", "tahliye"],
      url: "https://belowmark.com/app",
    },
    Results: {
      title: "İhale sonuçları — Belowmark",
      description: "İcra ihalelerinde gerçekte ödenen tutarlar: muhammen bedele oranla ihale bedeli, bildirilen sonuçlardan, anonim ve grup başına en az beş ihaleden.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["ihale bedeli", "muhammen bedel", "icra", "ihale sonucu"],
      url: "https://belowmark.com/app/ergebnisse",
    },
  },

  Section: {
    Eyebrow: "İhaleden sonra",
    Title: "Sonuç ve ihale",
    Lead: {
      DE: "Duruşmada bulundunuz mu? Ne teklif edildiğini girin. Portal sonuç yayınlamıyor — bildirimlerinizden anonim bir fiyat özeti oluşur. Zuschlag'ı siz aldıysanız görev listesi sizi tapuya kadar götürür.",
      TR: "İhaleye katıldınız mı? Ne teklif edildiğini girin. Portal sonuç yayınlamıyor — bildirimlerinizden anonim bir fiyat özeti oluşur. İhale size kaldıysa görev listesi sizi tapuya kadar götürür.",
    },
  },

  Result: {
    Title: "İhale sonucunu bildirin",
    Lead: "Yalnızca rakamlar, isim yok. Bildiriminizi istediğiniz zaman düzeltebilirsiniz.",
    NotYet: "Sonucu ihale tarihinden itibaren girebilirsiniz.",
    HearingDate: "İhale tarihi",
    Outcome: "Sonuç",
    Outcomes: {
      awarded: "İhale yapıldı",
      refused: "İhale kararı verilmedi",
      pending: "Karar ertelendi",
      noBids: "Teklif yok",
      cancelled: "İhale yapılmadı",
    },
    HighestBid: {
      DE: { label: "En yüksek teklif (Bargebot)", hint: "Tutanak veya Zuschlag kararındaki gibi" },
      TR: { label: "İhale bedeli", hint: "Artırma sonuç tutanağındaki gibi" },
    },
    RetainedRights: { label: "Baki kalan haklar", hint: "Belirtilmişse — fiyata dahildir" },
    BidderCount: { label: "Teklif veren sayısı", hint: "Biliyorsanız" },
    Source: "Rakamlar nereden?",
    Sources: { attended: "Kendim katıldım", protocol: "Tutanak / karar", court: "Daireden bilgi" },
    IsBuyer: { DE: "Zuschlag bana kaldı", TR: "İhale bana kaldı" },
    AwardDate: {
      DE: { label: "Zuschlag tefhim tarihi", hint: "Boş = duruşma günü" },
      TR: { label: "Sonuç tutanağının ilan tarihi", hint: "7 günlük ödeme süresi bu günden başlar" },
    },
    Shared: { label: "Fiyat özetine anonim olarak ekle", hint: "Yalnızca bölge ve taşınmaz türü başına medyan gösterilir, en az beş ihaleden — kaydınız asla tek başına görünmez." },
    Privacy: "Bu dosya için ihale tarihini, sonucu, tutarları ve teklif veren sayısını saklarız; teklif verenlerin, alıcıların veya maliklerin adlarını saklamayız.",
    Save: "Sonucu kaydet",
    Saved: "Kaydedildi.",
    SavedBuyer: "Kaydedildi. Görev listeniz oluşturuldu.",
    Errors: {
      auth: "Lütfen tekrar giriş yapın.",
      locked: "Görev listesi Yatırımcı paketine dahildir.",
      date: "Lütfen geçerli bir tarih girin (ihaleden önce olamaz).",
      future: "Sonuç ancak ihale tarihinden itibaren bildirilebilir.",
      outcome: "Lütfen sonucu seçin.",
      bid: "İhale yapıldıysa lütfen bedeli girin (tam sayı).",
      ratio: "Bedel muhammen değerle uyuşmuyor — lütfen kontrol edin.",
      bidders: "Lütfen makul bir teklif veren sayısı girin.",
      buyer: "„Bana kaldı“ yalnızca „İhale yapıldı“ sonucuyla seçilebilir.",
      unknown: "Kaydedilemedi. Lütfen tekrar deneyin.",
    },
    Ratio: "muhammen bedelin {pct}'i",
    StatsLink: "Fiyat özetini gör",
  },

  Teaser: {
    Title: "İhaleden sonraki görev listeniz",
    Lead: "Ödeme, harçlar, tapu, teslim, sigorta, tadilat — sizin sürelerinizle.",
    Button: "Görev listesini aç",
    Progress: "{total} görevden {done} tamam",
    Next: "Sıradaki: {title} · {date}",
    NoDate: "İhale tarihini girin, liste süreleri hesaplasın.",
  },

  Tasks: {
    Kicker: "İhaleden sonra",
    Title: "Görev listesi",
    Lead: {
      DE: "Zuschlag'dan tapuya (Grundbuch) tescile ve teslime kadar. Süreleri yalnızca girdiğiniz tarihlerden hesaplarız. Her bilgi kaynağını gösterir.",
      TR: "İhaleden tapu tesciline ve teslime kadar. Süreleri yalnızca girdiğiniz tarihlerden hesaplarız. Her bilgi kaynağını gösterir.",
    },
    Back: "Dosyaya dön",
    Disclaimer:
      "Bu liste bir yol göstericidir, hukuki danışmanlık değildir. Mevzuatı sadeleştirerek aktarır (26.10.2026 itibarıyla) ve sizin dosyanızı bilmez. Süreler, fesih ve tahliye konusunda icra dairesine, notere veya avukata danışın.",
    Locked: {
      Title: "Görev listesi Yatırımcı paketinde",
      Body: "Sonucunuz kaydedildi. Süreli ve hatırlatmalı görev listesi Yatırımcı paketine dahildir.",
      Cta: "Yatırımcı paketini al",
    },
    Dates: {
      Title: "Tarihleriniz",
      Lead: "Liste bu tarihlerden hesaplar. Bilmediklerinizi boş bırakın.",
      Fields: {
        DE: {
          awardDate: { label: "Zuschlag tefhim tarihi", hint: "Zorunlu" },
          distributionDate: { label: "Paylaştırma duruşması", hint: "Çağrı yazısında yazar" },
          taxNoticeDate: { label: "Vergi tarhiyatı tarihi", hint: "Tebliğ tarihi" },
          handoverDate: { label: "Teslim / tahliye tarihi", hint: "Planlanan veya gerçekleşen" },
        },
        TR: {
          awardDate: { label: "Sonuç tutanağının ilan tarihi", hint: "Zorunlu — 7 günün başlangıcı" },
          handoverDate: { label: "Teslim / tahliye tarihi", hint: "Planlanan veya gerçekleşen" },
        },
      },
      FromPortfolio: "Portföyünüzden alındı — lütfen kaydedin.",
      Save: "Tarihleri kaydet",
      Saved: "Kaydedildi.",
      Required: "Lütfen en azından ihale tarihini girin.",
      Errors: {
        auth: "Lütfen tekrar giriş yapın.",
        locked: "Görev listesi Yatırımcı paketine dahildir.",
        date: "Lütfen en azından ihale tarihini girin.",
        unknown: "Kaydedilemedi. Lütfen tekrar deneyin.",
      },
    },
    Conditions: {
      Title: "Durumunuz",
      Lead: "Yalnızca uygun görevleri gösterir. Bu tarayıcıda hatırlanır.",
      Items: { tenant: "Kiracı var", ownerOccupied: "Eski malik hâlâ oturuyor", condo: "Kat mülkiyeti (daire)", house: "Bir veya iki daireli ev" },
    },
    Phases: { first: "İlk günler", payment: "Ödeme", register: "Vergi ve tapu", possession: "Zilyetlik ve kiracı", works: "Tadilat ve işletme" },
    Due: { deadline: "en geç {date}", earliest: "en erken {date}", on: "{date} itibarıyla" },
    Missing: "Tarih eksik: {field}",
    States: { done: "Tamam", overdue: "Süresi geçti", soon: "Yaklaşıyor", open: "Açık", undated: "Tarihsiz" },
    Basis: { law: "Kanun", practice: "Usul", rule: "Belowmark kuralı" },
    Check: "Mevzuat değişti veya kesin değil — kontrol edin",
    MarkDone: "Tamam",
    MarkOpen: "Tekrar aç",
    Sources: "Kaynaklar",
    Progress: "{total} görevden {done} tamam",
    Items: CLOSING_TASKS_TR,
  },

  Results: {
    Kicker: "İhale sonuçları",
    Title: "Gerçekte ne ödeniyor",
    Lead: "Bildirilen ihale bedellerinin muhammen bedele oranı. Rakamlar mahkemeden değil kullanıcılardan gelir — bir fiyat seviyesi gösterir, taşınmazınızın değerini değil.",
    Method: {
      Title: "Nasıl hesaplıyoruz",
      Items: [
        "Oran = (ihale bedeli + baki kalan haklar) ÷ ilandaki muhammen bedel.",
        "Aynı ihaleyi birden çok kullanıcı bildirirse bir kez, bildirimlerin medyanıyla sayılır.",
        "Rakamlar grup başına en az beş ihaleden sonra görünür. Altında yalnızca sayıyı gösteririz.",
        "Özette isim ve dosya numarası yoktur. Kendi bildirimlerinizi yalnızca siz görürsünüz.",
      ],
    },
    Table: { Region: "Bölge", Segment: "Tür", Awarded: "İhaleler", Median: "Medyan", Range: "Orta yarı", Bidders: "Teklif veren (medyan)", Reported: "Bildirilen ihaleler" },
    AllSegments: "Tüm türler",
    Total: "Toplam",
    OtherRegion: "Bölgesiz",
    TooFew: "{n} — çok az (en az {min})",
    Empty: "Pazarınızda henüz bildirim yok. Kullanıcılar ihale sonuçlarını girdikçe özet dolar — dosya sayfasında „Sonuç ve ihale“ altında.",
    Locked: "Fiyat özeti Yatırımcı paketine dahildir. Bildirim yapabilirsiniz.",
    Own: { Title: "Bildirimleriniz", Lead: "Yalnızca siz görürsünüz.", Empty: "Henüz bir şey bildirmediniz.", Shared: "özette", Private: "özel", Buyer: "Size kaldı" },
  },
};
