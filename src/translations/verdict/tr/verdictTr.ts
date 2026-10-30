import { IVerdictTranslation } from "../IVerdictTranslation";

export const VERDICT_TR: IVerdictTranslation = {
  Section: {
    Eyebrow: "Karar",
    Title: "Teklif vermeli mi?",
    Lead: "İlan, yüklediğiniz bilirkişi raporu, mevzuat ve kendi rakamlarınızdan çıkan bir karar. Önemli bir nokta açık kaldığı sürece „teklif verin“ demez ve her gerekçenin kaynağını gösterir.",
    Disclaimer: "Girdiğiniz bilgilere dayalı bir yatırım notudur; hukuki danışmanlık veya yatırım tavsiyesi değildir. Esas olan tapu kaydı, bilirkişi raporu ve satış şartnamesidir.",
  },
  Locked: {
    Title: "Karar Investor planında",
    Body: "Karar; risk kontrolünü, bilirkişi raporunu ve teklif limitini her taşınmaz için tek bir net öneride birleştirir. Investor planında kullanılabilir.",
  },

  States: {
    go: { Stamp: "Teklif verin", Headline: "{amount} tutarına kadar teklif verin", Sub: "Rakamlarınıza ve mevcut kaynaklara göre. Bu tutarın üzerine çıkmayın." },
    open: { Stamp: "Henüz hazır değil", Headline: "Şimdilik {amount} tutarına kadar", Sub: "Bu limit şartlıdır. Aşağıdaki açık noktalar netleşince karara dönüşür." },
    stop: { Stamp: "Teklif vermeyin", Headline: "Teklif vermeyin", Sub: "Kaynaklara göre en az bir gerekçe açıkça aleyhte — aşağıya bakın." },
    none: { Stamp: "Karar yok", Headline: "Karar verilemiyor", Sub: "Bu ihale için şu anda bir değerlendirme yapılamıyor." },
  },
  GoUnverified: "Dikkat: Tadilat masraflarınız ne yerinde ne de bir teklifle doğrulandı. Limit, bu rakam kadar güvenilirdir.",
  OpenNoLimit: { Headline: "Henüz limit yok", Sub: "Teklif limitinde hedefleriniz olmadan üst sınır da olmaz. Aşağıdaki liste eksikleri gösteriyor." },
  Groups: {
    none: "Neden karar yok",
    stop: "Neden olmaz",
    gap: "Teklif vermeden önce",
    caution: "Göz önünde tutun",
    ok: "Lehte olanlar",
  },

  Reasons: {
    noValue: "İlanda muhammen bedel yok. Bu olmadan ne sınırlar ne de masraflar hesaplanabilir.",
    cancelled: "İhale portala göre iptal edilmiş.",
    past: "İhale tarihi geçmiş.",
    unreachable: "Hedefleriniz hiçbir teklif tutarında — 0'da bile — tutmuyor. Masraflar ve kira buna yetmiyor.",
    belowStart: "{amount} limitiniz {other} başlangıç bedelinin altında. Bu kadar düşük teklif verilemez.",
    belowHalf: "Devam eden haklarla birlikte {amount} limitiniz kıymetin 5/10'unun ({other}) altında. İlk oturumda ihale resen reddedilir.",
    rightStays: "Kaynağa göre {risk} var. İhaleden sonra devam edebilir ve kullanımı ya da değeri azaltabilir. Önce kalıp kalmayacağını netleştirin.",
    noTargets: "Teklif limitinde henüz hedef yok (getiri, nakit akışı veya satış değeri). Hedef olmadan üst sınır da olmaz.",
    noReport: "Bilirkişi raporu yüklenmedi. Haklar, hasarlar ve kirlilik yalnızca ilandan biliniyor — ilan ise bunlar hakkında genelde bir şey söylemiyor.",
    noRenovation: "Tadilat tutarı girilmedi. Tahmininizi girin — yapılacak bir şey yoksa 0.",
    noClearance: "Kiracı veya kullanıcı olabilir ama tahliye ya da geçiş masrafı girilmedi (0 da olabilir).",
    askInspection: "Taşınmazı görüp görmediğinizi belirtin.",
    askOccupancy: "Taşınmazı kimin kullandığını — bildiğiniz kadarıyla — belirtin.",
    askRights: "Tapu kaydını ve satış şartnamesini takyidat açısından inceleyip incelemediğinizi belirtin.",
    rightsOpen: "Takyidatı henüz incelemediniz. İhaleden sonra kalan yükler teklifinize ek olarak size kalır.",
    askCostBasis: "Tadilat ve tahliye masraflarınızın neye dayandığını belirtin.",
    costsIncomplete: "Yasal bir masraf kalemi ilandan hesaplanamıyor (ör. KDV oranı yok) — toplam masraf eksik.",
    contamination: "Rapora göre kirlilik var. Temizliğin maliyetini ancak bir uzman raporu gösterir. Masraflarınız bir teklife dayanana kadar teklif vermeyin.",
    rightPriced: "Kaynağa göre {risk} var — incelendi ve {amount} ile teklif limitine dahil edildi.",
    notInside: "Taşınmazın içini görmediniz. Tadilat tutarınız bu yüzden doğrulanmamış — aşağıdaki stres testi ek masrafın limiti nasıl etkilediğini gösterir.",
    reportOutsideOnly: "Bilirkişi de taşınmazın içine (tamamen) girememiş.",
    estimateOnly: "Tadilat masraflarınız kendi tahmininiz, bir teklif değil.",
    defects: "Rapor hasar veya kusur belirtiyor. Tadilat tutarınızın bunları karşılayıp karşılamadığını kontrol edin.",
    tenant: "Taşınmaz (muhtemelen) kullanımda veya kirada. Tahliye zaman ve ayrı bir süreç gerektirebilir — bunu hesaba katın.",
    heritage: "Kaynağa göre sit alanı / tescil var. Tadilat koruma kurulu iznine bağlıdır ve genelde daha pahalıdır.",
    easement: "Rapor irtifak veya geçit hakkı belirtiyor. Bunlar çoğu zaman devam eder.",
    contaminationUnclear: "Rapor kirlilik olup olmadığını açık bırakıyor.",
    oldValuation: "Kıymet takdiri ihaleden {years} yıl önce yapılmış. Piyasa ve durum o zamandan beri değişmiş olabilir.",
    valueMismatch: "Rapor {amount}, ilan {other} diyor. Hangi değerin geçerli olduğunu icra dairesine sorun.",
    sevenTenths: "Devam eden haklarla birlikte {amount} limitiniz 7/10'un ({other}) altında.",
    atCeiling: "Limit hesap sınırına (muhammen bedelin üç katı) dayanıyor. Hedefleriniz muhtemelen fazla cömert.",
    conflicting: "„{risk}“ konusunda kaynaklar çelişiyor.",
    limitBy: "„{criterion}“ hedefiniz {amount} tutarına kadar bir teklifi taşıyor.",
    legalClear: "Limit bu ihalenin yasal alt sınırının üzerinde.",
    limitsWaived: "Bu dosyada değer sınırları zaten kalkmış.",
    rightsClear: "Kaynağa göre oturma hakkı, intifa hakkı ve üst hakkı yok.",
  },
  MarketReasons: {
    belowStart: {
      DE: "{amount} limitiniz {other} asgari teklifin altında.",
      TR: "{amount} limitiniz {other} başlangıç bedelinin (muhammen bedelin %50'si) altında. Hiçbir artırmada bu kadar düşük teklif verilemez.",
    },
    rightStays: {
      DE: "Kaynağa göre {risk} var. İhaleden sonra devam edebilir. Mahkemeye sorup değerini teklif limitinde „devam eden haklar“ alanına girmeden (0 da olabilir) teklif vermeyin.",
      TR: "Kaynağa göre {risk} var. İhaleden sonra devam edip etmeyeceği tapu kaydı ve satış şartnamesinden anlaşılır. Bunu inceleyip rakamlarınıza yansıtmadan teklif vermeyin.",
    },
    rightsOpen: {
      DE: "Devam eden hakları henüz mahkemeye sormadınız. İhaleden sonra kalan haklar teklifinize ek olarak size kalır.",
      TR: "Tapu kaydını ve satış şartnamesini henüz incelemediniz. İhaleden sonra kalan yükler teklifinize ek olarak size kalır.",
    },
    askRights: {
      DE: "Devam eden hakları mahkemeye sorup sormadığınızı belirtin.",
      TR: "Tapu kaydını ve satış şartnamesini takyidat açısından inceleyip incelemediğinizi belirtin.",
    },
    tenant: {
      DE: "Taşınmaz (muhtemelen) kirada. Kira sözleşmeleri ihale alıcısına geçer — hayal ettiğiniz kirayla değil, mevcut kirayla hesaplayın.",
      TR: "Taşınmaz (muhtemelen) kullanımda veya kirada. Tahliye zaman ve ayrı bir süreç gerektirebilir — bunu hesaba katın.",
    },
  },
  Actions: {
    limit: "Teklif limitine girin",
    report: "Raporu yükleyin",
    questions: "Aşağıda yanıtlayın",
  },

  Sources: {
    Label: "Kaynak",
    notice: "İlan",
    report: "Rapor s. {page}",
    input: "Rakamlarınız",
    answer: "Yanıtınız",
    rule: "belowmark kuralı",
  },

  Questions: {
    Title: "Yalnızca sizin bilebilecekleriniz",
    Lead: "Hiçbir belge içerisinin nasıl olduğunu veya orada kimin yaşadığını söylemez. Yanıtlarınız karara dahil edilir — yanıt yoksa nokta açık kalır.",
    Items: {
      inspection: {
        Label: "Taşınmazı gördünüz mü?",
        Hint: "İcra satışlarında içeriyi görmek çoğu zaman mümkün değildir.",
        Options: { inside: "Evet, içini", outside: "Yalnızca dışarıdan", none: "Hiç" },
      },
      rights: {
        Label: "Tapu kaydı ve satış şartnamesi takyidat açısından incelendi mi?",
        Hint: "Şerhler, intifa ve sükna hakkı tapu kaydında ve e-Satış'taki satış şartnamesinde yer alır.",
        Options: { confirmed: "Evet, incelendi", open: "Henüz değil" },
      },
      occupancy: {
        Label: "Taşınmazı kim kullanıyor?",
        Hint: "Rapordan, komşulardan veya alacaklıdan — bilindiği kadarıyla.",
        Options: { vacant: "Boş", owner: "Malik / borçlu", tenant: "Kiracı", unknown: "Bilmiyorum" },
      },
      costBasis: {
        Label: "Tadilat ve tahliye masraflarınız neye dayanıyor?",
        Hint: "Yalnızca masraf girdiyseniz önemlidir.",
        Options: { quote: "Teklif / uzman", estimate: "Kendi tahminim" },
      },
    },
    Rights: {
      DE: { Label: "Devam eden haklar mahkemeye soruldu mu?", Hint: "En düşük teklifi ve devam eden hakları icra memuru ihaleden önce sorulduğunda bildirir." },
      TR: { Label: "Tapu kaydı ve satış şartnamesi takyidat açısından incelendi mi?", Hint: "Şerhler, intifa ve sükna hakkı tapu kaydında ve e-Satış'taki satış şartnamesinde yer alır." },
    },
    Unanswered: "açık",
    Reset: "Yanıtları sil",
    StorageHint: "Yanıtlarınız yalnızca bu tarayıcıda saklanır.",
  },

  Stress: {
    Title: "Stres testi",
    Lead: "Tahmin değil, örnek hesap: Tadilat ve tahliye girdiğinizden pahalıya çıkarsa limitiniz ne olur?",
    Row: "+%{pct} masraf: {limit}",
    Unreachable: "artık anlamlı teklif yok",
    BelowThreshold: "yasal sınırın altında",
    NoLimit: "hesaplanamıyor",
  },

  Unknowables: {
    Title: "belowmark'ın bilemeyecekleri",
    Items: [
      "İçerinin durumu — rapor yalnızca bilirkişinin görebildiğini gösterir.",
      "Gerçek tadilat maliyeti — bunun için yerinde bir uzman gerekir.",
      "Kullanıcıların kendiliğinden çıkıp çıkmayacağı ve tahliyenin ne kadar süreceği.",
      "Kaç kişinin ve ne kadar teklif vereceği.",
      "İhalenin son anda iptal edilip edilmeyeceği — bir gün önce tekrar kontrol edin.",
    ],
  },

  File: {
    Title: "Karar",
  },
};
