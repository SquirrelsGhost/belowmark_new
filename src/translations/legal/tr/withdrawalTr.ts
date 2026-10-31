import { LEGAL_OPERATOR, operatorAddress } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

const contact = `${operatorAddress()}, E-posta ${LEGAL_OPERATOR.email}, Telefon ${LEGAL_OPERATOR.phone}`;

export const WITHDRAWAL_TR: LegalDocument = {
  title: "Cayma Bilgilendirmesi ve Dijital İçeriklerde Cayma Hakkının Sona Ermesi",
  asOf: "Güncelleme: 31 Ekim 2026",
  basis: "Fiziksel bir veri taşıyıcısı üzerinde sunulmayan dijital içerik sözleşmelerinde tüketiciler için bilgilendirme (§§ 312g, 355, 356 Abs. 5 BGB / Mesafeli Sözleşmeler Yönetmeliği md. 15/1-ğ).",
  sections: [
    {
      id: "erloeschen",
      heading: "1. Cayma Hakkının Erken Sona Ermesi (§ 356 Abs. 5 BGB / MSY md. 15/1-ğ)",
      paragraphs: [
        "Fiziksel bir ortamda sunulmayan dijital içeriklerin sağlanmasına ilişkin sözleşmelerde (Belowmark üzerindeki muhammen bedellere, ekspertiz analizlerine, değer sınırlarına, süre hesaplayıcılarına ve belgelere tam dijital erişimin açılması), aşağıdaki şartların gerçekleşmesiyle birlikte cayma hakkı sözleşmenin ifasına başlandığı anda derhal sona erer:",
        "1. Cayma süresi dolmadan önce sözleşmenin ifasına başlamamıza açıkça onay vermiş olmanız,",
        "2. Bu onayınızla birlikte sözleşmenin ifasına başlanmasıyla cayma hakkınızın sona ereceğini bildiğinizi teyit etmiş olmanız ve",
        "3. Tarafımızca size kalıcı veri saklayıcısı (e-posta) üzerinden § 312f Abs. 2 BGB uyarınca sözleşme ve onay teyidinin gönderilmiş olması.",
        "Sipariş sürecinde „Ödeme yükümlülüğüyle sipariş ver“ düğmesine tıklamadan önce Genel İşlem Şartlarını (AGB) kabul ederek bu onayı verdiğiniz ve ödemenin onaylanmasının hemen ardından dijital tam erişiminiz açıldığı için, erişim açıldıktan sonra § 356 Abs. 5 BGB ve Mesafeli Sözleşmeler Yönetmeliği md. 15/1-ğ uyarınca cayma hakkı kullanılamaz.",
      ],
    },
    {
      id: "recht",
      heading: "2. Yasal Cayma Hakkı (İfaya Başlanmadan Önce)",
      paragraphs: [
        "Sözleşmenin ifasına (dijital erişimin açılmasına) istisnai olarak henüz başlanmamış olması halinde aşağıdaki yasal cayma hakkı geçerlidir:",
        "On dört gün içinde herhangi bir gerekçe göstermeksizin bu sözleşmeden cayma hakkına sahipsiniz. Cayma süresi, sözleşmenin kurulduğu günden itibaren on dört gündür.",
        `Cayma hakkınızı kullanmak için bize (${contact}) bu sözleşmeden cayma kararınızı bildiren açık bir beyan (örneğin posta ile gönderilen bir mektup veya e-posta) iletmeniz gerekmektedir. Bunun için aşağıda yer alan örnek cayma formunu kullanabilirsiniz; ancak bu formun kullanımı zorunlu değildir.`,
        "Cayma süresine uyulmuş sayılması için, cayma hakkının kullanıldığına ilişkin bildirimin cayma süresi dolmadan ve dijital erişim açılmadan önce gönderilmiş olması yeterlidir.",
      ],
    },
    {
      id: "folgen",
      heading: "3. Geçerli Caymanın Sonuçları (Erişim Açılmadan Önce)",
      paragraphs: [
        "Cayma hakkı dijital erişimin açılmasıyla (§ 356 Abs. 5 BGB) sona ermeden önce sözleşmeden geçerli şekilde caymanız halinde, sizden aldığımız tüm ödemeleri, cayma bildiriminizin bize ulaştığı günden itibaren gecikmeksizin ve en geç on dört gün içinde iade ederiz. Bu geri ödemede, ilk işlemde kullandığınız ödeme yönteminin aynısını kullanırız.",
      ],
    },
    {
      id: "praxis",
      heading: "4. Devam Eden Aboneliklerin Feshi",
      paragraphs: [
        "Anında açılan dijital içeriklerde cayma hakkının sona ermesinden (§ 356 Abs. 5 BGB) bağımsız olarak, devam eden aylık aboneliğinizi (Investor aylık veya Pro aylık) halihazırda ödenmiş olan fatura ayının sonuna kadar istediğiniz zaman olağan yolla feshedebilirsiniz — hesabınızdan tek tıkla veya her sayfanın altındaki „Sözleşmeyi buradan feshet“ bağlantısı üzerinden.",
      ],
    },
    {
      id: "formular",
      heading: "5. Örnek Cayma Formu",
      paragraphs: [
        "(Yalnızca cayma hakkının dijital erişimin açılmasıyla § 356 Abs. 5 BGB uyarınca henüz sona ermemiş olması halinde uygulanır.)",
        `Alıcı: ${operatorAddress()}, E-posta ${LEGAL_OPERATOR.email}:`,
        "Aşağıda belirtilen dijital içeriklerin sağlanmasına ilişkin kurduğum/kurduğumuz (*) sözleşmeden caydığımı/caydığımızı (*) bildiririm:",
        "Sipariş tarihi (*):",
        "Tüketicinin adı soyadı:",
        "Tüketicinin adresi:",
        "Tüketicinin imzası (yalnızca kağıt üzerinde gönderilmesi halinde):",
        "Tarih:",
        "(*) Uygun olmayanı çizin.",
      ],
    },
  ],
};
