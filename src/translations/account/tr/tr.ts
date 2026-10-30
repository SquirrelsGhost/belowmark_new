import { IAccountTranslation } from "../IAccountTranslation";

export const ACCOUNT_TR: IAccountTranslation = {
  Nav: {
    Label: "Hesabınızın bölümleri",
    Sections: {
      uebersicht: { Title: "Genel bakış", Hint: "Bilgiler ve durum" },
      tarif: { Title: "Tarife ve faturalar", Hint: "Süre, PDF, adres" },
      sicherheit: { Title: "Güvenlik", Hint: "Şifre, cihazlar" },
      daten: { Title: "Verileriniz", Hint: "Dışa aktar, sil" },
    },
  },

  Overview: {
    Title: "Bir bakışta",
    Description: "Hesabınızın durumu. Ayrıntılar soldaki bölümlerde.",
    Plan: "Tarife",
    PlanCta: "Tarife ve faturalar",
    LatestInvoice: "Son fatura",
    NoInvoice: "Henüz fatura yok.",
    AllInvoices: "Tüm faturalar",
    Research: "Araştırma",
    ResearchBody: "İlanlar, harita, takip listesi ve teklif hesaplayıcı.",
    ResearchCta: "Araştırmaya git",
  },

  Portal: {
    Label: "Stripe'ta ödeme yöntemi",
    Hint: "Stripe müşteri portalını açar: kartı değiştirin veya aboneliği yönetin. Faturalarınız hemen aşağıda.",
    Unavailable: "Stripe üzerinden bir kez ödeme yaptıktan sonra ödeme yönteminizi Stripe'ta yönetebilirsiniz.",
  },

  Invoices: {
    Title: "Faturalar",
    Description: "Her ödeme için sıra numaralı ayrı bir fatura. PDF olarak, istediğiniz zaman.",
    Empty: "Henüz fatura yok. Bir ödeme onaylandığında burada görünür.",
    Count: "{count} fatura",
    CountOne: "1 fatura",
    Columns: { Number: "Numara · Tarih", Service: "Hizmet", Amount: "Tutar", Document: "Belge" },
    Paid: "Ödendi",
    Test: "Test",
    Upgrade: "Yükseltme",
    Renewal: "Yenileme",
    Download: "PDF",
    View: "Görüntüle",
    DownloadLabel: "{number} numaralı faturayı PDF olarak indir",
    Note: "Faturalar Almanya'daki sağlayıcı tarafından Almanca düzenlenir. Kayıtlarınız için saklayın.",
  },

  Address: {
    Title: "Fatura adresi",
    Description: "Faturalarınızda görünür. 250 €'ya kadar e-posta adresi yeterlidir; üzerindeki tutarlar ve muhasebeniz için ad ve adres gerekir.",
    Missing: "Henüz fatura adresi yok. Adressiz eski faturalar, kaydettiğinizde bu adresi bir kez alır.",
    Name: "Ad veya firma",
    NameHint: "Faturada görünmesini istediğiniz şekilde.",
    Address: "Adres",
    AddressHint: "Sokak ve numara, posta kodu ve şehir, ülke — her satıra bir bilgi.",
    VatId: "KDV / vergi no.",
    VatIdHint: "Yalnızca şirketler için.",
    Optional: "isteğe bağlı",
    Edit: "Düzenle",
    Cancel: "Vazgeç",
    Submit: "Adresi kaydet",
    Pending: "Kaydediliyor …",
    Saved: "Kaydedildi. Yeni faturalar bu adresi taşır.",
    ErrorTitle: "Lütfen bilgilerinizi kontrol edin",
    Errors: {
      name_required: "Lütfen bir ad girin.",
      address_required: "Lütfen bir adres girin.",
      too_long: "Bir bilgi çok uzun.",
      rate_limited: "Çok fazla deneme. Lütfen biraz bekleyin.",
      unknown: "Bu işe yaramadı. Lütfen tekrar deneyin.",
    },
  },
};
