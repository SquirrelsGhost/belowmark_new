import { IAlertsTranslation } from "../IAlertsTranslation";

export const ALERTS_TR: IAlertsTranslation = {
  MetaTags: {
    title: "Alarmlar — Belowmark",
    description: "E-posta bildirimli kayıtlı aramalar: aramanıza uyan yeni bir ihale çıktığında veya bir ihale tarihi değiştiğinde haberiniz olur.",
    imgUrl: "https://belowmark.com/og/home.png",
    tags: ["Alarm", "icra", "ihale"],
    url: "https://belowmark.com/app/alerts",
  },
  Nav: "Alarmlar",

  Page: {
    Eyebrow: "Kayıtlı aramalar",
    Title: "Alarmlar",
    Lead: "Her alarm kayıtlı bir aramadır. Aramanıza uyan yeni bir ilan çıkarsa ya da daire bir ihale tarihini değiştirirse e-posta alırsınız — dosya numarası ve ilan sayfasının bağlantısıyla.",
    Usage: "{count} / {max} alarm",
    Empty: {
      Title: "Henüz alarm yok.",
      Body: "İlanlarda filtrelerinizi seçin — il, taşınmaz türü, değer aralığı, arama kelimesi — ve aramayı sonuç sayısının altından alarm olarak kaydedin.",
      Cta: "İlanlara git",
    },
    HowItWorks:
      "Karşılaştırma resmî verilerin her güncellenmesinden sonra yapılır. Yalnızca ilanın kendisinin söylediği bildirilir: yeni bir ilan, ertelenen bir tarih, iptal edilen bir ihale. Aramanın tarih aralığı ve sıralaması alarma dahil değildir — alarm hep ileriye bakar.",
  },

  Card: {
    Active: "Etkin",
    Paused: "Duraklatıldı",
    Pause: "Duraklat",
    Resume: "Devam et",
    Delete: "Sil",
    OpenSearch: "Aramayı aç",
    Matches: "{count} açık sonuç",
    MatchesOne: "1 açık sonuç",
    NotifyNew: "Yeni ilanlar",
    NotifyChanges: "Tarih değişiklikleri",
    LastSent: "Son e-posta: {date}",
    NeverSent: "Henüz e-posta yok",
    LastChecked: "Kontrol: {date}",
    Error: "Olmadı. Lütfen tekrar deneyin.",
  },

  Summary: {
    AllRegions: { DE: "Tüm eyaletler", TR: "Tüm iller" },
    AllSegments: "Tüm türler",
    Query: "“{query}”",
    Min: "{value} üzeri",
    Max: "{value} altı",
  },

  Save: {
    Toggle: "Aramayı alarm olarak kaydet",
    Title: "Alarm oluştur",
    NameLabel: "Ad",
    NotifyNew: "Yeni ilanlarda e-posta",
    NotifyChanges: "Tarih değişikliği ve iptallerde e-posta",
    Hint: "Arama kelimesi, il, taşınmaz türü ve değer aralığı kaydedilir. Bugün zaten uyan ilanlar bilinen sayılır — bundan sonrası bildirilir.",
    Submit: "Alarmı kaydet",
    Pending: "Kaydediliyor …",
    Saved: "Kaydedildi. Bir gelişme olduğunda e-posta alacaksınız.",
    Manage: "Alarmları yönet",
    Errors: {
      limit: "Zaten 10 alarmınız var. Yenisini oluşturmadan önce birini silin.",
      invalid: "Lütfen alarma bir ad verin ve en az bir bildirim seçin.",
      failed: "Alarm kaydedilemedi. Lütfen tekrar deneyin.",
    },
  },

  Mail: {
    Subject: "Alarmlarınızda {count} yenilik",
    SubjectOne: "Alarmlarınızda 1 yenilik",
    Preheader: "Kayıtlı aramalarınızdan yeni ilanlar ve değişen ihale tarihleri.",
    Greeting: "Merhaba,",
    Intro: "son kontrolden bu yana kayıtlı aramalarınızda şunlar oldu:",
    Kinds: { new: "Yeni", cancelled: "İptal", reinstated: "Yeniden ilan", rescheduled: "Tarih değişti" },
    NextDate: "İhale {date}",
    Moved: "önce {before}, şimdi {after}",
    Value: { DE: "Verkehrswert", TR: "Muhammen bedel" },
    More: "+ {count} ilan daha",
    OpenSearch: "Aramayı aç",
    LockedValues: "Tutarları uygulamada tam erişimle görürsünüz.",
    Manage: "Alarmları yönet veya duraklat",
    Source: { DE: "Tüm bilgilerin kaynağı: zvg-portal.de", TR: "Tüm bilgilerin kaynağı: ilan.gov.tr" },
    Signature: "Belowmark ekibi",
    Footer: "Belowmark · Kaynaklı icra ihaleleri · belowmark.com",
  },
};
