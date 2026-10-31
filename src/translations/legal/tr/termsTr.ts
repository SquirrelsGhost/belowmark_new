import { LEGAL_OPERATOR, operatorAddress } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export function vatSentenceTr(vatMode: "inclusive" | "kleinunternehmer" | null): string {
  if (vatMode === "kleinunternehmer") {
    return "Tüm fiyatlar nihai fiyatlardır. Alman Katma Değer Vergisi Kanunu (UStG) § 19 uyarınca KDV hesaplanmaz.";
  }
  return "Tüm fiyatlar nihai fiyatlardır ve geçerli yasal katma değer vergisini içerir.";
}

export function termsTr(vatMode: "inclusive" | "kleinunternehmer" | null): LegalDocument {
  return {
    title: "Genel İşlem Şartları (AGB)",
    asOf: "Güncelleme: 31 Ekim 2026",
    basis: "Belowmark (belowmark.com) platformunun kullanımına ilişkin sözleşme şartları.",
    sections: [
      {
        id: "geltung",
        heading: "1. Kapsam ve Sözleşme Tarafları",
        paragraphs: [
          `Bu şartlar, ${operatorAddress()} (bundan böyle „Sağlayıcı“) ile müşteri arasında Belowmark çevrim içi hizmetinin kullanımına ilişkin kurulan tüm sözleşmeler için geçerlidir.`,
          "Tüketici, sözleşmeyi ağırlıklı olarak ticari veya mesleki faaliyetlerine atfedilemeyecek amaçlarla akdeden her gerçek kişidir (§ 13 BGB / 6502 sayılı TKHK). Müşterinin farklı şartları yalnızca Sağlayıcı açıkça onayladığında geçerli olur.",
        ],
      },
      {
        id: "leistung",
        heading: "2. Hizmetin Konusu",
        paragraphs: [
          "Belowmark, Avrupa'daki (Almanya, Avusturya, İsviçre, İtalya, İspanya, Fransa, Birleşik Krallık) cebri icra ihaleleri ile Türkiye'deki icra ve kamu ihalelerine ilişkin kamuya açık bilgileri derler, düzenler ve bunlardan analiz göstergeleri (örneğin yasal değer sınırları, teminat tutarları, satın alma ek maliyetleri) hesaplar. Müşteri, sözleşme süresi boyunca seçtiği pazar için web uygulamasına kişisel erişim hakkı elde eder.",
          "Belowmark bir araştırma ve ön inceleme aracıdır. Hizmet; hukuki, vergisel, gayrimenkul veya yatırım danışmanlığı niteliği taşımaz ve belirli bir pey sürme tavsiyesi içermez. Her türlü ekonomik karardan önce tüm bilgiler resmî ihale dosyası ve şartname üzerinden kontrol edilmelidir.",
          "Veriler üçüncü taraf kaynaklardan (adli portallar, resmî ilan portalları ve ilan siteleri) derlenmektedir. Sağlayıcı, bu verilerin doğruluğu, eksiksizliği ve güncelliği konusunda garanti vermez; ihale listesi kısmen eksik olabilir. Hesaplanan değerler bu verilere dayalı matematiksel sonuçlar olup resmî ekspertiz raporu yerine geçmez.",
        ],
      },
      {
        id: "tarife",
        heading: "3. Tarifeler ve Ücretler",
        paragraphs: [
          "Free Scout: Sınırlı kapsamla ücretsiz ve süresiz kullanım (ihale listesi görünür, muhammen bedeller ve ihale tarihleri kilitlidir). Ödeme bilgisi talep edilmez.",
          "Deneme Süresi: E-posta adresinin doğrulanmasının ardından müşteri 14 gün boyunca Investor kapsamını ücretsiz kullanabilir. Deneme süresi kendiliğinden sona erer ve ücretli bir aboneliğe dönüşmez.",
          "Investor Aylık: Aylık peşin ödemeli bireysel tam erişim (Avrupa pazarları için 39,00 € / £35 / CHF 39; Türkiye pazarı için 599,00 TL). İptal edilmediği sürece her ay otomatik olarak bir ay uzar.",
          "Investor Üç Ay: Üç takvim ayı boyunca tam erişim, tek seferlik peşin ödeme (Avrupa pazarları için 99,00 € / £89 / CHF 99; Türkiye pazarı için 1.490,00 TL). Otomatik olarak yenilenmez; fesih gerekmez.",
          "Pro Aylık: Kendi antetinizle müşteri bağlantıları ve ortak ekip listeleri (her biri en fazla 5 koltuklu 3 ekibe kadar) dahil tam erişim, aylık peşin (Avrupa pazarları için 129,00 € / £115 / CHF 129; Türkiye pazarı için 1.990,00 TL). Her ay otomatik olarak bir ay uzar.",
          "Pro Üç Ay: Üç takvim ayı boyunca Pro kapsamında tam erişim, tek seferlik peşin ödeme (Avrupa pazarları için 329,00 € / £295 / CHF 329; Türkiye pazarı için 4.990,00 TL). Otomatik olarak yenilenmez; fesih gerekmez. Genişletilmiş kurumsal ekip kontenjanları (aylık 299,00 €'dan itibaren) talep üzerine bireysel olarak kararlaştırılır.",
          vatSentenceTr(vatMode),
        ],
      },
      {
        id: "vertragsschluss",
        heading: "4. Sözleşmenin Kurulması",
        paragraphs: [
          "Kayıt ve e-posta adresinin doğrulanmasıyla birlikte ücretsiz kullanım sözleşmesi (Free Scout) kurulur.",
          "Ücretli Investor veya Pro erişimi, kullanıcı hesabındaki sipariş özeti sayfasından satın alınır. Bu sayfada seçilen tarife, fiyat, süre ve yenilenme koşulları özetlenir. Müşteri, „Ödeme yükümlülüğüyle sipariş ver“ düğmesine tıklayarak bağlayıcı bir teklif sunar ve ödeme hizmeti sağlayıcısı Stripe'ın güvenli ödeme sayfasına yönlendirilir. Sözleşme, Stripe ödemeyi onayladığında ve Sağlayıcı erişimi açtığında kurulur; müşteriye e-postayla teyit gönderilir.",
          "Sağlayıcı sözleşme metnini (sipariş, tarife, fiyat ve bu şartların geçerli sürümü) kaydeder ve sipariş onayıyla birlikte müşteriye e-postayla gönderir. Güncel şartlara her zaman belowmark.com/agb adresinden ulaşılabilir.",
        ],
      },
      {
        id: "zahlung",
        heading: "5. Ödeme ve Faturalar",
        paragraphs: [
          "Ödemeler Stripe Payments Europe, Ltd. (İrlanda) altyapısı üzerinden işlenir. Ödeme bilgileri yalnızca Stripe'ın ödeme sayfasında girilir ve Sağlayıcı nezdinde saklanmaz.",
          "Aylık abonelikler her dönemin başında peşin olarak tahsil edilir. Faturalara kullanıcı hesabındaki „Faturalar ve ödeme yöntemi“ bölümünden ulaşılabilir ve ayrıca e-postayla gönderilir.",
          "Tahsilatın başarısız olması halinde Stripe tahsilatı yeniden dener. Ödeme alınamazsa tam erişim ödenmiş dönemin sonunda sona erer; ücretsiz hesap kapsamı korunur.",
        ],
      },
      {
        id: "laufzeit",
        heading: "6. Süre ve Fesih",
        paragraphs: [
          "Aylık Investor ve Pro abonelikleri belirsiz sürelidir ve halihazırda ödenmiş olan ayın sonuna kadar her zaman feshedilebilir. Bu tarihe kadar tam erişim devam eder. Olağan fesihte içinde bulunulan ay için kıstelyevm iade yapılmaz.",
          `Fesih işlemi, her sayfanın alt kısmında yer alan ve giriş yapmadan kullanılabilen „Sözleşmeyi buradan feshet“ düğmesi üzerinden, kullanıcı hesabından, Stripe müşteri portalından veya ${LEGAL_OPERATOR.email} adresine yazılı bildirimle yapılabilir. Fesih sonrasında müşteriye derhal e-postayla alındı ve bitiş tarihi onayı gönderilir.`,
          "Üç aylık paketler satın alınan sürenin sonunda kendiliğinden sona erer. Ücretsiz Free Scout hesabı, hesabın silinmesiyle her zaman sonlandırılabilir.",
          "Tarafların haklı sebeple olağanüstü fesih hakkı saklıdır.",
        ],
      },
      {
        id: "widerruf",
        heading: "7. Dijital İçeriklerde Cayma Hakkı ve Cayma Hakkının Sona Ermesi (§ 356 Abs. 5 BGB / MSY md. 15/1-ğ)",
        paragraphs: [
          "Belowmark, ödemenin onaylanmasının ardından derhal kullanıma açılan dijital bir üründür. Müşteri, sipariş sürecinde bu Genel İşlem Şartlarını (AGB) kabul ederek, cayma süresi dolmadan önce Sağlayıcının sözleşmenin ifasına (ücretli dijital erişimin sağlanmasına ve açılmasına) derhal başlamasına açıkça onay verir ve erişimin açılmasıyla birlikte yasal cayma hakkının derhal sona ereceğini (§ 356 Abs. 5 BGB ve Mesafeli Sözleşmeler Yönetmeliği md. 15/1-ğ uyarınca) bildiğini teyit eder.",
          "Cayma hakkının sona ermesine ilişkin ayrıntılı bilgilendirme belowmark.com/widerruf adresinde yer almakta olup sözleşme onayıyla birlikte müşteriye e-postayla da iletilir.",
        ],
      },
      {
        id: "verfuegbarkeit",
        heading: "8. Hizmetin Sürekliliği",
        paragraphs: [
          "Sağlayıcı, hizmetin kesintisiz erişilebilir olması için özen gösterir ancak belirli bir kesintisizlik oranı taahhüt etmez. Bakım çalışmaları, üçüncü taraf kesintileri veya resmî kaynak portallardaki arızalar erişimi veya verilerin güncelliğini geçici olarak kısıtlayabilir.",
        ],
      },
      {
        id: "nutzung",
        heading: "9. Kullanım Hakları, Scraping Yasağı ve İadesiz Hesap Kapatma",
        paragraphs: [
          "Müşteri, sözleşme süresi boyunca hizmeti yalnızca kendi araştırma amaçları doğrultusunda standart bir web tarayıcısı üzerinden kullanmak üzere devredilemez, basit bir kullanım hakkı elde eder. Özellikle şu eylemler kesinlikle yasaktır: (a) satın alınan ekip koltukları dışında giriş bilgilerinin üçüncü kişilerle paylaşılması veya hesabın birden fazla kişi tarafından ortak kullanılması, (b) verilerin, metinlerin, göstergelerin veya belgelerin bot, crawler, scraper, headless tarayıcı veya betikler (script) aracılığıyla sistematik, otomatik veya toplu olarak çekilmesi, kopyalanması veya indekslenmesi, (c) teknik koruma önlemlerinin, istek sınırlarının (rate-limit) veya güvenlik mekanizmalarının (honeypot tuzakları dahil) aşılması ve (d) işlenmiş verilerin veya belgelerin toplu olarak indirilmesi, yeniden satılması, alt lisanslanması veya kamuya açılması.",
          "Yukarıdaki yasakların ihlali, sözleşmenin esaslı bir ihlalini oluşturur ve Sağlayıcıya önceden ihtara gerek olmaksızın sözleşmeyi haklı sebeple derhal feshetme (§ 314 BGB) ve kullanıcı hesabını ve kullanılan cihaz kimliğini kalıcı olarak engelleme hakkı verir.",
          "Müşterinin sözleşmeye aykırı davranışı (özellikle scraping, otomatik veri çekimi veya güvenlik önlemlerinin aşılması) nedeniyle hesabın kapatılması veya sözleşmenin olağanüstü feshedilmesi halinde kullanım hakkı derhal sona erer. Bu durumda müşterinin içinde bulunulan fatura dönemi veya peşin ödenmiş çoklu dönemler için ödediği ücretlerin tamamen veya kısmen iadesini talep etme hakkı yoktur. Sağlayıcının tazminat ve ihlalin durdurulması talepleri saklıdır.",
        ],
      },
      {
        id: "haftung",
        heading: "10. Sorumluluk Sınırlaması",
        paragraphs: [
          "Sağlayıcı; kast ve ağır ihmal hallerinde, yaşam, beden veya sağlık bütünlüğünün ihlalinde ve zorunlu yasal sorumluluk hallerinde sınırsız sorumludur. Hafif ihmalde ise yalnızca sözleşmenin amacına ulaşması için vazgeçilmez olan esaslı sözleşme yükümlülüklerinin ihlalinden ve sözleşme kurulurken öngörülebilen tipik zararla sınırlı olmak üzere sorumludur.",
          "Yukarıdaki fıkra kapsamına giren bir hal bulunmadıkça Sağlayıcı, müşterinin aldığı ekonomik kararlardan, özellikle ihalelerde verdiği tekliflerden ve bunların sonuçlarından sorumlu değildir.",
        ],
      },
      {
        id: "aenderungen",
        heading: "11. Şartların ve Fiyatların Değiştirilmesi",
        paragraphs: [
          "Sağlayıcı, bu şartlarda veya aylık abonelik fiyatlarında yapılacak değişiklikleri yürürlüğe girmesinden en az altı hafta önce yazılı olarak (e-postayla) bildirir. Değişiklikler yalnızca müşterinin onaylaması halinde geçerli olur; müşteri onaylamazsa her iki taraf da sözleşmeyi değişikliğin yürürlük tarihi itibarıyla feshedebilir.",
        ],
      },
      {
        id: "recht",
        heading: "12. Uygulanacak Hukuk ve Yetkili Mahkeme",
        paragraphs: [
          "Milletlerarası Mal Satımına İlişkin Sözleşmeler Hakkında BM Antlaşması (CISG) hariç olmak üzere Alman hukuku uygulanır. Tüketiciler açısından bu hukuk seçimi, yalnızca tüketicinin mutat meskeninin bulunduğu ülke hukukunun emredici hükümlerinin sağladığı korumayı ortadan kaldırmadığı ölçüde geçerlidir.",
          `Müşterinin tacir, kamu tüzel kişisi veya kamu hukuku özel malvarlığı olması halinde yetkili mahkeme Sağlayıcının merkezinin bulunduğu yer mahkemesidir (${LEGAL_OPERATOR.court}).`,
        ],
      },
    ],
  };
}
