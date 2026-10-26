import Button from "@/components/ui/Button";
import { BILLING_ROUTES } from "@/lib/billing/billingConfig";
import { TranslationService } from "@/services/TranslationService";
import { BillingTranslations } from "@/translations/billing/BillingTranslations";
import { Locale } from "@/translations/Translations";

/** Clarifies on /widerruf that digital products expire immediately upon activation, and links to ordinary subscription cancellation. */
export default async function WithdrawalCallout() {
  const locale = await TranslationService.GetUserLocale();
  const { Footer } = BillingTranslations[locale];
  const isTr = locale === Locale.TR;

  return (
    <div className="flex flex-col items-start gap-4 border-2 border-ink bg-paper-bright p-6 shadow-[6px_6px_0_0_var(--signal)]">
      <p className="font-narrow text-2xl leading-tight font-semibold">
        {isTr
          ? "Dijital ürünlerde erişim açıldıktan sonra cayma hakkı yoktur (§ 356 Abs. 5 BGB)."
          : "Kein Widerruf nach Freischaltung digitaler Produkte (§ 356 Abs. 5 BGB)."}
      </p>
      <p className="max-w-xl text-sm leading-relaxed text-ink-soft">
        {isTr
          ? "Tam erişim, değerler ve analizler ödeme onaylanır onaylanmaz derhal açıldığı için cayma hakkı erişimin açılmasıyla birlikte sona erer. Devam eden aylık aboneliğinizi ise istediğiniz zaman ödenmiş ayın sonuna kadar feshedebilirsiniz."
          : "Da sämtliche digitalen Daten, Verkehrswerte und Auswertungen unmittelbar mit der Buchung freigeschaltet werden, erlischt das Widerrufsrecht sofort mit der Freischaltung. Ein laufendes Monatsabo können Sie jederzeit ordentlich zum Ende des bezahlten Monats kündigen."}
      </p>
      <Button label={Footer.Cancel} href={BILLING_ROUTES.cancel} variant="signal" withArrow />
    </div>
  );
}
