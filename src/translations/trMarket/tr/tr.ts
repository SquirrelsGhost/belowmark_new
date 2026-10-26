import { ITrMarketTranslation } from "../ITrMarketTranslation";

export const TR_MARKET_TR: ITrMarketTranslation = {
  Age: {
    Title: "Muhammen bedelin yaşı",
    Lead: "Muhammen bedel, takibin başladığı yılın nominal tutarıdır. Türkiye'deki enflasyonla eski dosyalarda bu küçük bir ayrıntı değildir.",
    FileYear: "Dosya yılı",
    Basis: "Değer tespiti en geç Aralık {year} — mümkün olan en geç tarih, yani şüphede küçük olan rakam.",
    Factor: "O tarihten bu yana tüketici fiyatları",
    Lost: "Nominal tutarın alım gücü kaybı",
    Today: "{month} lirasıyla muhammen bedel",
    TodayNote: "Yalnızca alım gücü çevrildi — yeni bir kıymet takdiri ya da piyasa fiyatı değildir.",
    Young: "{year} dosyası: muhammen bedel yeni, enflasyon düzeltmesi burada bir şey değiştirmez.",
    NoYear: "Dosya numarası bir yıl içermiyor. Yıl olmadan değerlendirme yok.",
    Unavailable: "Resmî fiyat serisi yeterince güncel değil. Donmuş bir rakam yerine hiç rakam yok.",
    Source: "{label}, {source} · {month} itibarıyla",
  },

  Euro: {
    Title: "Euro karşılığı",
    Value: "Muhammen bedel",
    StartingBid: "Başlangıç teklifi",
    AllIn: "Masraflar dahil başlangıç teklifi",
    Rate: "1 € = {rate} · TCMB döviz alış kuru, {date}",
    Note: "Merkez Bankası'nın günlük kuruyla çevrildi, ödeme günündeki kurla değil. Ödeme liradır.",
    Unavailable: "Güncel bir Merkez Bankası kuru yok{last}. Günlük kur yüklendiğinde euro tutarları görünür — eski bir kurla hesap yapılmaz.",
    LastRate: " (son kur {date})",
  },

  CheckKit: {
    Title: "e-Satış için kontrol kiti",
    Lead: "Fotoğraflar, bilirkişi raporu ve ihale şartları e-Satış'ta, yalnızca e-Devlet girişiyle görünür. Bağlantı oraya bilgi taşımaz — bu bilgileri kopyalayıp orada yapıştırın.",
    Copy: "Kontrol kitini kopyala",
    Copied: "Kopyalandı",
    Open: "e-Satış'ı aç",
    NotStated: "belirtilmemiş",
  },

  Converter: {
    Title: "Döviz hesaplayıcı ₺ ↔ €",
    Subtitle: "TCMB günlük kuruyla",
    Lira: "Lira tutarı",
    Euro: "Euro tutarı",
    Unavailable: "Güncel bir Merkez Bankası kuru yok{last}. Günlük kur yüklendiğinde hesaplayıcı görünür.",
  },
};
