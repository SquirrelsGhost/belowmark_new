import { filled, LEGAL_OPERATOR, operatorAddress } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export const PRIVACY_TR: LegalDocument = {
  title: "Gizlilik Bildirimi ve Kişisel Verilerin Korunması",
  asOf: "Güncelleme: 31 Ekim 2026",
  basis: "Avrupa Birliği Genel Veri Koruma Tüzüğü (DSGVO / GDPR) md. 13 ve 14 ile 6698 sayılı KVKK kapsamında aydınlatma metni.",
  sections: [
    {
      id: "verantwortlicher",
      heading: "1. Veri Sorumlusu",
      paragraphs: [
        `${operatorAddress()}. E-posta ${LEGAL_OPERATOR.email}, Telefon ${LEGAL_OPERATOR.phone}. Yasal bir zorunluluk bulunmadığından ayrıca bir veri koruma görevlisi atanmamıştır.`,
      ],
    },
    {
      id: "aufruf",
      heading: "2. Web Sitesinin Ziyaret Edilmesi",
      paragraphs: [
        "Her sayfa görüntülendiğinde sunucu teknik olarak zorunlu verileri işler: IP adresi, erişim zamanı, talep edilen adres, tarayıcı bilgisi ve sunucu yanıt kodu. Hukuki dayanak DSGVO md. 6/1-f'dir; meşru menfaat hizmetin güvenli ve kesintisiz işletilmesidir.",
        `Uygulamanın kendisi kalıcı erişim günlüğü tutmaz. Barındırma (hosting) sağlayıcısı nezdinde güvenlik günlükleri tutulabilir: ${filled(LEGAL_OPERATOR.hosting, "Hosting sağlayıcısı, sunucu konumu ve günlük saklama süresi")}.`,
      ],
    },
    {
      id: "konto",
      heading: "3. Kullanıcı Hesabı ve Oturum Açma",
      paragraphs: [
        "Kullanıcı hesabı için şu verileri saklarız: e-posta adresi, parolanın kriptografik özeti (scrypt, açık metin olarak asla saklanmaz), seçilen pazar ve dil, e-posta doğrulama zamanı, deneme süresi bitişi, satın alınan tarife ve süresi ile son giriş zamanı. Hukuki dayanak sözleşmenin ifasıdır (DSGVO md. 6/1-b).",
        "Her oturum için tarayıcı kimliğinin özetini, kısaltılmış IP adresini ve geçerlilik süresini içeren bir oturum kaydı tutarız. Bu sayede çalınan oturum çerezlerini tespit edebilir ve tüm cihazlardan çıkış yapılmasını sağlayabiliriz. Hukuki dayanak hesabın güvenliğidir (DSGVO md. 6/1-f).",
        "Kayıt ve giriş sırasında tarayıcı, teknik özelliklerden (ekran kartı, ekran çözünürlüğü, işlemci çekirdeği, saat dilimi) bir cihaz özeti hesaplar ve yerel depolamada („ec_hw_id“) saklar. Bu değer yalnızca engellenmiş cihazları tanımak ve hesapları otomatik saldırılardan korumak için kullanılır (§ 25 Abs. 2 Nr. 2 TDDDG, DSGVO md. 6/1-f).",
        "Yeni belirlenen parolaları bilinen veri sızıntılarına (Have I Been Pwned) karşı kontrol ederiz. Bu işlemde parolanın kendisi değil, yalnızca SHA-1 özetinin ilk beş karakteri iletilir (k-anonimlik). Hukuki dayanak DSGVO md. 6/1-f'dir.",
        "Kötüye kullanımı önlemek amacıyla IP adresi ve e-posta adresi başına düşen istek sayılarını kısa zaman aralıkları için sınırlandırırız.",
      ],
    },
    {
      id: "app",
      heading: "4. Hesabınızda Oluşturduğunuz İçerikler",
      paragraphs: [
        "Notlarınızı içeren takip listesi ve kayıtlı aramalar (alarmlar) veritabanımızda saklanır. Alarmlar açık olduğu sürece yeni ihaleler için e-posta gönderilir. Yüklenen bilirkişi/ekspertiz raporları analiz edilir; PDF dosyasının kendisi değil, yalnızca analiz sonucu (dosya adı, bulunan metin bölümleri ve sayfa numaraları) saklanır. Hukuki dayanak DSGVO md. 6/1-b'dir.",
        "Gelişmiş rapor analizi etkinleştirildiğinde, yüklenen raporun metni analiz edilmek üzere yapay zeka veri işleyenimize iletilir (DSGVO md. 46/2-c standart sözleşme kayıtları).",
        "Kontrol listesi, teklif sınırı hesaplamaları, değerlendirme yanıtları, emsal değerler ve banka dosyası yalnızca tarayıcınızda (yerel depolama, „belowmark:…“ anahtarları) saklanır; sunucularımıza iletilmez.",
      ],
    },
    {
      id: "zahlung",
      heading: "5. Satın Alma ve Ödeme",
      paragraphs: [
        "Satın alma işleminde sipariş bilgilerini saklarız: tarife, fiyat, pazar, kabul edilen genel işlem şartları sürümü, hizmetin derhal başlamasına ilişkin onay zamanı ve ödeme durumu. Hukuki dayanak sözleşmenin ifası (DSGVO md. 6/1-b) ve yasal saklama yükümlülüğüdür (DSGVO md. 6/1-c).",
        "Ödemeler Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Dublin 2, İrlanda tarafından sunulan ödeme sayfasında gerçekleştirilir. Stripe'a e-posta adresinizi ve sipariş bilgilerini iletiriz; kart ve ödeme bilgilerinizi doğrudan Stripe'a girersiniz, bu bilgiler bize ulaşmaz. Stripe'tan müşteri numarası, ödeme durumu ve fatura bilgisini alırız. Stripe kendi yasal yükümlülükleri ve dolandırıcılık önleme süreçleri kapsamında kendi gizlilik politikasına (stripe.com/de/privacy) göre veri sorumlusu olarak hareket eder.",
        "Stripe ödeme sayfası Stripe'a ait alan adında çalışır; belowmark.com üzerinde üçüncü taraf izleme betikleri çalıştırılmaz.",
        "Faturaları ve muhasebe belgelerini ticaret ve vergi mevzuatının öngördüğü süreler boyunca (§ 147 AO, § 257 HGB) saklarız.",
      ],
    },
    {
      id: "erklaerungen",
      heading: "6. Fesih ve Cayma Beyanları",
      paragraphs: [
        "„Sözleşmeyi buradan feshet“ ve „Sözleşmeden cay“ üzerinden iletilen beyanları ad, e-posta adresi, sözleşme bilgisi, içerik ve ulaşma tarihi/saati ile birlikte kaydeder ve e-postayla alındı onayı göndeririz. Bu kayıtları beyanın ulaştığını kanıtlayabilmek amacıyla üç yıl süreyle saklarız (DSGVO md. 6/1-c ve f).",
      ],
    },
    {
      id: "mail",
      heading: "7. E-postalar",
      paragraphs: [
        `Yalnızca sözleşmenin yürütülmesi için gerekli e-postaları göndeririz: doğrulama bağlantıları, parola sıfırlama bağlantıları, sipariş ve fesih onayları ile kendi oluşturduğunuz alarmlar. Reklam, bülten veya açılma/tıklama takibi yapılmaz. Gönderim altyapısı: ${filled(LEGAL_OPERATOR.mailProvider, "E-posta servis sağlayıcısı (SMTP)")}.`,
      ],
    },
    {
      id: "cookies",
      heading: "8. Çerezler ve Yerel Depolama",
      paragraphs: [
        "Analiz, reklam veya izleme çerezleri kullanmıyoruz ve bu tür üçüncü taraf hizmetleri entegre etmiyoruz. Bu nedenle çerez onay penceresine ihtiyaç duyulmaz.",
        "Oturum çerezi („__Host-bm_session“): Oturumun açık kalmasını sağlar; talep edilen hizmetin sunulması için teknik olarak zorunludur (§ 25 Abs. 2 Nr. 2 TDDDG). Tarayıcı kapatıldığında veya „Oturumu açık tut“ seçildiğinde 30 gün sonra sona erer.",
        "„BELOWMARK_COUNTRY“ ve „BELOWMARK_MARKET“ (birer yıl): Dil ve fiyatların doğru gösterilmesi için seçilen ülke ve pazarı hatırlar (§ 25 Abs. 2 Nr. 2 TDDDG).",
        "Yazı tipleri Google sunucularından değil, kendi sunucumuzdan yüklenir.",
      ],
    },
    {
      id: "karten",
      heading: "9. Haritalar ve Uydu Görüntüleri",
      paragraphs: [
        "Bir ihale detay sayfasında tarayıcınız harita katmanlarını doğrudan basemap.de (Almanya), OpenStreetMap (Birleşik Krallık) ve uydu görüntülerini Esri (ABD) sunucularından yükler. Bu sırada ilgili sağlayıcılar IP adresinizi ve talep edilen harita kesitini görür. Hukuki dayanak taşınmazın konumunun gösterilmesidir (DSGVO md. 6/1-f).",
        "Google Haritalar, resmî ihale portalları ve ilan sitelerine verilen bağlantılar yalnızca siz tıkladığınızda yeni sekmede açılır.",
      ],
    },
    {
      id: "dauer",
      heading: "10. Saklama Süresi ve Hesap Silme",
      paragraphs: [
        "Hesap verilerinizi siz hesabınızı silene kadar saklarız. Kullanıcı hesabınızdaki „Verileriniz“ bölümünden kayıtlı tüm verilerinizi JSON olarak indirebilir ve hesabınızı kendiniz kalıcı olarak silebilirsiniz. Silme işleminde hesap, oturumlar, takip listesi, alarmlar ve analiz sonuçları derhal silinir. Siparişler ve yasal beyanlar, kişiyle bağlantısı koparılarak yalnızca vergi ve ticaret hukukunun zorunlu kıldığı saklama süreleri boyunca tutulur.",
        "Tek kullanımlık bağlantılar (e-posta doğrulama, parola sıfırlama) kullanıldığında silinir ve en geç 24 saat / 1 saat içinde geçerliliğini yitirir.",
      ],
    },
    {
      id: "rechte",
      heading: "11. Haklarınız",
      paragraphs: [
        "Kişisel verilerinize ilişkin bilgi talep etme (md. 15), düzeltme (md. 16), silme (md. 17), işlemenin kısıtlanmasını isteme (md. 18), veri taşınabilirliği (md. 20) ve meşru menfaate dayalı işlemelere itiraz etme (DSGVO md. 21 / KVKK md. 11) haklarına sahipsiniz. Veri dışa aktarma ve hesap silme işlemlerini doğrudan hesabınızdan da gerçekleştirebilirsiniz.",
        `Ayrıca yetkili veri koruma denetim makamına şikayette bulunma hakkına sahipsiniz: ${LEGAL_OPERATOR.supervisoryAuthority}.`,
        "DSGVO md. 22 kapsamında otomatik karar verme veya profilleme yapılmamaktadır.",
      ],
    },
  ],
};
