import { filled, LEGAL_OPERATOR } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export const IMPRINT_TR: LegalDocument = {
  title: "Künye (Impressum)",
  asOf: "Güncelleme: 31 Ekim 2026",
  basis: "Alman Dijital Hizmetler Kanunu (DDG) § 5 ve Medya Devlet Sözleşmesi (MStV) § 18 Abs. 2 uyarınca yasal hizmet sağlayıcı bilgileri.",
  sections: [
    {
      id: "anbieter",
      heading: "Hizmet Sağlayıcı",
      paragraphs: [],
      facts: [
        { label: "Hizmet Sağlayıcı", value: LEGAL_OPERATOR.business },
        { label: "Sahibi", value: LEGAL_OPERATOR.owner },
        { label: "Adres", value: `${LEGAL_OPERATOR.street}, ${LEGAL_OPERATOR.city}, ${LEGAL_OPERATOR.country}` },
        { label: "E-posta", value: LEGAL_OPERATOR.email },
        { label: "Telefon", value: LEGAL_OPERATOR.phone },
        { label: "İçerikten Sorumlu Kişi (§ 18 Abs. 2 MStV)", value: `${LEGAL_OPERATOR.owner}, adres yukarıdaki gibidir` },
      ],
    },
    {
      id: "streitbeilegung",
      heading: "Tüketici Uyuşmazlıklarının Çözümü",
      paragraphs: [
        "Bir tüketici hakem heyeti veya uzlaştırma kurulu nezdindeki uyuşmazlık çözüm süreçlerine katılmaya istekli veya yükümlü değiliz (§ 36 VSBG).",
      ],
    },
    {
      id: "hosting",
      heading: "Altyapı ve Barındırma",
      paragraphs: [`Barındırma (Hosting): ${filled(LEGAL_OPERATOR.hosting, "Hosting sağlayıcısı, adresi ve sunucu konumu")}.`],
    },
    {
      id: "verweise",
      heading: "Dış Bağlantılar",
      paragraphs: [
        "Belowmark, resmî portallara (örneğin zvg-portal.de, ilan.gov.tr, esatis.uyap.gov.tr) ve kamuya açık ilan sitelerine bağlantılar içerir. Bu sitelerin içeriğinden yalnızca ilgili işletmeciler sorumludur. Bağlantı verildiği sırada hukuka aykırı bir içerik tespit edilmemiştir; hukuka aykırılık öğrenildiği takdirde ilgili bağlantı derhal kaldırılır.",
      ],
    },
  ],
};
