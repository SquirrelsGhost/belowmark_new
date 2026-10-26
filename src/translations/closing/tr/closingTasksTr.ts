import { MarketCode } from "../../../lib/constants";
import { ClosingTaskText } from "../IClosingTranslation";

/** Task texts in Turkish, for both markets. Every statement has its source in closingTasks.ts. */
export const CLOSING_TASKS_TR: Record<MarketCode, Record<string, ClosingTaskText>> = {
  DE: {
    "de.ruling": {
      title: "Zuschlag kararını saklayın",
      detail:
        "Zuschlag ile, tapuya (Grundbuch) yazılmadan önce malik olursunuz (§ 90 ZVG). Kararı alın veya gönderilmesini isteyin ve saklayın: ileride tahliye için de dayanak belgedir. Zuschlag harcını (0,5 harç, KV 2214 GKG) mahkeme ayrıca faturalandırır.",
    },
    "de.appeal": {
      title: "Kesinleşmeyi bekleyin",
      detail:
        "Zuschlag'a karşı ivedi itiraz (sofortige Beschwerde) yolu vardır. İhale veya tefhim duruşmasında hazır olanlar için süre tefhimle başlar (§ 98 ZVG) ve iki haftadır (§ 569 ZPO). Hazır olmayanlar için tebliğle başlar — kesinleşme daha geç olabilir. O zamana kadar geri alınamayacak işler vermeyin.",
    },
    "de.risk": {
      title: "Taşınmazı bugünden itibaren sizin sayın",
      detail:
        "Hasar riski, yararlar ve yükler Zuschlag ile size geçer (§ 56 ZVG). Taşınmazın güvende olup olmadığını kontrol edin (boşluk, don, giriş) ve durumunu tarihli fotoğraflarla belgeleyin.",
    },
    "de.insurerNotice": {
      title: "Bina sigortacısına bildirin",
      detail:
        "Mevcut bina sigortası size geçer (§ 99 ile § 95 VVG). Devir sigortacıya gecikmeksizin bildirilmelidir; aksi halde sigortacı ödemeden kurtulabilir (§ 97 VVG). Sigortacı ve poliçe numarasını mahkemeye veya bilirkişi raporuna sorun. Sözleşme yoksa hemen kendiniz sigorta yaptırın.",
    },
    "de.insuranceCancel": {
      title: "Devralınan sigortayı kontrol edin",
      detail:
        "Devralınan sözleşmeyi hemen veya sigorta dönemi sonunda feshedebilirsiniz, ancak edinmeden itibaren bir ay içinde; sözleşmeyi bilmiyorsanız öğrenmeden itibaren (§ 96 Abs. 2 VVG). Yeni koruma kesintisiz başlamadan feshetmeyin.",
    },
    "de.charges": {
      title: "Cari giderleri üstlenin",
      detail:
        "Zuschlag'dan itibaren yükler size aittir (§ 56 ZVG): emlak vergisi (Grundsteuer) oranlı, kat mülkiyetinde aidat (Hausgeld), elektrik, su, ısınma. Sayaçları kaydedin, abonelikleri ve yönetimi bilgilendirin. Önceki malikin aidat borçları satış bedelinden karşılanır (2. sıra, § 10 Abs. 1 Nr. 2 ZVG); BGH'ye göre (V ZR 209/12) bu öncelik alıcı için ayni sorumluluk doğurmaz.",
    },
    "de.interest": {
      title: "Nakit teklif üzerindeki faizi unutmayın",
      detail:
        "Nakit teklife (Bargebot) Zuschlag'dan itibaren faiz işler (§ 49 Abs. 2 ZVG), yıllık % 4 (§ 246 BGB). Faiz ödemeye kadar işler. Mahkemeye erken depo etmenin (§ 49 Abs. 4 ZVG) size uygun olup olmadığını icra memuruna (Rechtspfleger) sorun.",
    },
    "de.summons": {
      title: "Paylaştırma duruşmasının tarihini girin",
      detail:
        "Zuschlag'dan sonra mahkeme paylaştırma duruşmasını (Verteilungstermin) belirler ve alıcı olarak sizi çağırır; çağrı en az iki hafta önce ulaşmalıdır (§ 105 ZVG). Tarihi yukarıya girin — liste ödeme ve duruşmayı buna göre hesaplar.",
    },
    "de.financing": {
      title: "Kredi ödemesini bankayla planlayın",
      detail:
        "Belowmark kuralı: paylaştırma duruşmasından iki hafta önce banka ödeme talebini bilmeli. Çağrı yazısındaki dosya numarası, mahkeme veznesi ve açıklamayı bankaya verin. Banka dosyası bunu bankanız için özetler.",
    },
    "de.pay": {
      title: "Nakit teklifi havale edin",
      detail:
        "Nakit teklif paylaştırma duruşmasından önce mahkeme veznesine havale ile ödenir; tutar duruşmadan önce hesaba geçmiş ve dekont duruşmada hazır olmalıdır (§ 49 Abs. 1, 3 ZVG). Elden ödeme öngörülmemiştir. Liste havaleyi beş gün öncesine koyar — bu yasal süre değil, güvenlik payıdır.",
    },
    "de.attend": {
      title: "Paylaştırma duruşması",
      detail:
        "Ödeme belgesini getirin (§ 49 Abs. 3 ZVG). Duruşmada paylaştırma planı yapılır ve uygulanır — bu, tapuya yazılmanızın şartıdır (§ 130 ZVG).",
    },
    "de.default": {
      title: "Ödemezseniz ne olur",
      detail:
        "Ödemezseniz, plan sizden alacağın hak sahiplerine devriyle uygulanır (§ 118 ZVG). Alacaklılar yeni bir ilama gerek olmadan sizin aleyhinize yeniden ihale isteyebilir (§ 133 ZVG). Malik ve borçlu olarak kalırsınız — vazgeçme öngörülmemiştir.",
    },
    "de.taxNotice": {
      title: "Tapu devir vergisini (Grunderwerbsteuer) ödeyin",
      detail:
        "Mahkeme Zuschlag'ı vergi dairesine bildirir (§ 18 Abs. 1 Nr. 3 GrEStG). Vergi, tarhiyatın tebliğinden bir ay sonra muaccel olur (§ 15 GrEStG). Tebliğ tarihini yukarıya girin.",
    },
    "de.clearance": {
      title: "Vergi uygunluk belgesi",
      detail:
        "Bu belge olmadan tapuya yazılmazsınız (§ 22 Abs. 1 GrEStG). Vergi dairesi, vergi ödendiğinde, teminata bağlandığında veya ertelendiğinde verir (§ 22 Abs. 2 GrEStG) ve genellikle mahkemeye ya da tapu dairesine gönderir. Ödemeden haftalar sonra hâlâ yoksa sorun.",
    },
    "de.courtFees": {
      title: "Mahkeme masraflarını ödeyin",
      detail:
        "Zuschlag harcı (KV 2214 GKG'ye göre 0,5 harç; değer: en yüksek teklif artı baki kalan haklar) ve sonra tescil harcı (KV 14110 GNotKG'ye göre 1,0 harç). Dosya sayfasındaki teklif limiti hesabı tutarları gösterir.",
    },
    "de.registry": {
      title: "Tapuya tescil yazısını bekleyin",
      detail:
        "Paylaştırma planı uygulanmış ve Zuschlag kesinleşmişse mahkeme tapu dairesinden sizi malik olarak yazmasını, sona eren hakları ve ihale şerhini silmesini ister (§ 130 Abs. 1 ZVG). Bankanız için ipotek (Grundschuld) ancak bundan sonra yazılır (§ 130 Abs. 3 ZVG).",
    },
    "de.extract": {
      title: "Tapu kaydını kontrol edin",
      detail:
        "Tescilden sonra kayıt örneği isteyin: Malik olarak siz mi yazılısınız? İhale şerhi ve sona eren haklar silinmiş mi? Yalnızca ihale şartlarına göre baki kalan haklar mı duruyor?",
    },
    "de.eviction": {
      title: "Zuschlag kararıyla tahliye",
      detail:
        "Zilyede, örneğin eski malike karşı Zuschlag kararının kendisi tahliye belgesidir (§ 93 Abs. 1 ZVG). İcra edilebilir nüsha ve tebliğ gerekir (§ 750 ZPO), sonra icra memuru (Gerichtsvollzieher) görevlendirilir (§ 885 ZPO); § 885a ZPO'ya göre sınırlı tahliye masraf azaltabilir. Zuschlag'dan sonra da süren bir hakka dayanan zilyede karşı olmaz (§ 93 Abs. 1 S. 2 ZVG). Zuschlag öncesi yapılan masrafları ödemek zorunda değilsiniz (§ 93 Abs. 2 ZVG).",
    },
    "de.tenantTakeover": {
      title: "Kira sözleşmesini devralın",
      detail:
        "Mevcut kira sözleşmeleri size geçer (§ 57 ZVG ile § 566 BGB). Kiracıyı malik değişikliği ve yeni hesap hakkında yazılı bilgilendirin. Depozitonun iadesinden, hiç almamış olsanız bile, sorumlu olabilirsiniz (§ 566a BGB) — depozito belgesini isteyin.",
    },
    "de.tenantNotice": {
      title: "Özel fesih: yalnızca ilk tarihe",
      detail:
        "Yasal süreyle feshedebilirsiniz, ama yalnızca ilk mümkün tarihe — aksi halde hak düşer (§ 57a ZVG). Konutta bu, fesih bildiriminin en geç ayın üçüncü iş gününde ulaşması demektir (§ 573c BGB). Kiracı koruması sürer: haklı bir menfaat, örneğin kendi ihtiyacınız gerekir (§ 573 BGB). Buradaki tarih temkinli hesaplanmıştır (cumartesiler sayılır, resmî tatiller dikkate alınmaz) — feshi bir avukata kontrol ettirin.",
    },
    "de.handover": {
      title: "Teslimi belgeleyin",
      detail: "Anahtarlar, sayaçlar, fotoğraflı durum, kusurlar, bırakılan eşyalar — tarihli ve imzalı. Zilyetliği alır almaz kilitleri değiştirin.",
    },
    "de.inspect": {
      title: "Durumu tespit edin, tadilatı planlayın",
      detail:
        "Ayıp sorumluluğu yoktur (§ 56 ZVG). Durumu bilirkişi raporuyla karşılaştırın ve iş vermeden önce teklif alın. Teklif limitindeki tadilat tutarlarını gerçek tekliflerle değiştirebilirsiniz.",
    },
    "de.energy": {
      title: "Malik değişikliğinden sonra iyileştirme yükümlülükleri",
      detail:
        "Eski malikin 01.02.2002'de kendisinin oturduğu bir veya iki daireli evlerde bazı iyileştirme yükümlülükleri (ör. en üst kat tavanının yalıtımı) yeni malike geçer; mülkiyet geçişinden itibaren iki yıl süre vardır (önceden § 47 GEG). GEG 2026'da Gebäudemodernisierungsgesetz ile değiştirildi — güncel metni bir enerji danışmanıyla kontrol edin.",
    },
    "de.permits": {
      title: "Tadilattan önce izinleri netleştirin",
      detail:
        "Tadilat, kullanım değişikliği veya tescilli yapıdaki işler için izin gerekip gerekmediğini eyalet hukuku (Bauordnung, Denkmalschutzgesetz) belirler. İşe başlamadan önce yapı dairesine sorun.",
    },
    "de.condo": {
      title: "Kat mülkiyeti belgelerini isteyin",
      detail:
        "Kat mülkiyetinde: yönetimi malik değişikliği hakkında bilgilendirin, işletme planı, son yıllık hesap, kararlar ve kat mülkiyeti sözleşmesini isteyin (WEG). Kararlaştırılmış ek ödemelere dikkat edin.",
    },
  },
  TR: {
    "tr.pay": {
      title: "İhale bedelini ödeyin — 7 gün",
      detail:
        "İhale bedeli ve masraflar, artırma sonuç tutanağının ilanından itibaren yedi gün içinde ödenir; ihalenin feshi istenmiş olsa bile (Elektronik Satış Yönetmeliği m.20/1; İİK m.130). 7343 sayılı Kanundan beri on günlük ek süre yoktur. İlan tarihini yukarıya girin.",
    },
    "tr.fees": {
      title: "Şartnameye göre masrafları hazırlayın",
      detail:
        "Tapu harcı her taraf için satış bedelinin binde 20'sidir (492 s. Harçlar Kanunu, (4) s. Tarife m.20/a). Şartnamede tapu harcının tamamının alıcıya ait olduğu yazıyorsa Adalet Bakanlığı bunu uygun görmektedir (İİDB, 12.01.2023) — o zaman binde 40'tır. Buna ilandaki KDV ve damga vergisi eklenir. Dosyanızın şartnamesini okuyun.",
    },
    "tr.default": {
      title: "Ödemezseniz ne olur",
      detail:
        "Bedel ödenmezse icra dairesi ihale kararını kaldırır ve ihale farkından siz sorumlu olursunuz (İİK m.133). 31.07.2026'dan itibaren ilan edilen satışlarda buna teklifin % 5'i oranında ceza eklenir (7589 s. Kanunla değişik İİK m.114).",
    },
    "tr.annulment": {
      title: "İhalenin feshi süresini bekleyin",
      detail:
        "İlgililer yedi gün içinde ihalenin feshini isteyebilir (İİK m.134); bazı hallerde öğrenmeden itibaren, en geç bir yıl. Dava sürerken tescil yapılmaz. O zamana kadar geri alınamayacak işler vermeyin.",
    },
    "tr.registry": {
      title: "Tescili takip edin",
      detail:
        "İhale kesinleşip bedel ödenince icra dairesi sizin adınıza tescil için tapu müdürlüğüne yazı gönderir (İİK m.134). Tescil müzekkeresinin gönderilip gönderilmediğini sorun.",
    },
    "tr.deed": {
      title: "Tapu kaydını kontrol edin",
      detail: "Tescilden sonra e-Devlet (Tapu Bilgileri) üzerinden kontrol edin: Malik olarak siz mi yazılısınız, hacizler ve ipotekler terkin edilmiş mi?",
    },
    "tr.dask": {
      title: "Yeni DASK poliçesi yaptırın",
      detail:
        "Zorunlu deprem sigortası kanunen zorunludur (6305 s. Kanun). 05.09.2026'dan beri önceki malikin poliçesi devredilmez, tescille sona erer (DASK Genel Şartları, RG 21.08.2026/33347). Kendi poliçenizi yaptırın; abonelikler için çoğu zaman istenir. İhale tescilinde tapunun bunu arayıp aramadığını tapu müdürlüğüne sorun.",
    },
    "tr.propertyTax": {
      title: "Emlak vergisini netleştirin",
      detail:
        "Mülkiyetin devri belediyeye bildirim sebebidir (1319 s. Kanun m.23); mükellefiyet izleyen yıl başlar (m.33). Tapunun bildiriminin yeterli olup olmadığını ve taşınmazın birikmiş vergisini belediyeye sorun.",
    },
    "tr.eviction": {
      title: "İcra dairesi üzerinden tahliye",
      detail:
        "Taşınmazda borçlu veya hakkı olmayan biri oturuyorsa icra dairesi talebiniz üzerine 15 gün süreli tahliye emri tebliğ eder, sonra zorla tahliye edilir (İİK m.135/2). Hacizden önce resmî belgeyle kurulmuş kira sözleşmesi olan kiracıyı bu korur (bkz. kiracı). Talebi uzun süre geciktirmeyin.",
    },
    "tr.tenant": {
      title: "Kiracı: sözleşme size geçer",
      detail:
        "Yeni malik kira sözleşmesinin tarafı olur (TBK m.310). İhtiyaç nedeniyle tahliye isterseniz bunu edinmeden itibaren bir ay içinde kiracıya yazılı bildirmeli ve en erken altı ay sonra dava açabilirsiniz (TBK m.351). İhalede edinme tarihinin hangi gün sayılacağını bir avukatla netleştirin — liste temkinli olarak ihale tarihinden hesaplar.",
    },
    "tr.handover": {
      title: "Teslimi belgeleyin",
      detail: "Anahtarlar, sayaçlar, fotoğraflı durum, tarihli. Elektrik, su ve doğalgaz aboneliklerini üzerinize alın, kilitleri değiştirin.",
    },
    "tr.inspect": {
      title: "Durumu tespit edin, tadilatı planlayın",
      detail: "Durumu kıymet takdir raporuyla karşılaştırın ve iş vermeden önce teklif alın.",
    },
    "tr.permits": {
      title: "Tadilat için izin",
      detail: "Tadilat için yapı ruhsatı gerekebilir (3194 s. İmar Kanunu m.21). Önce belediyeye sorun.",
    },
    "tr.condo": {
      title: "Yönetimi bilgilendirin",
      detail: "Kat mülkiyetinde: yönetimi bilgilendirin, aidatı ve yönetim planını öğrenin (634 s. Kat Mülkiyeti Kanunu).",
    },
  },
};
