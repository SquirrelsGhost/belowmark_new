import Button from "@/components/ui/Button";
import { BILLING_ROUTES } from "@/lib/billing/billingConfig";
import { TranslationService } from "@/services/TranslationService";
import { BillingTranslations } from "@/translations/billing/BillingTranslations";
import { Locale } from "@/translations/Translations";

interface WithdrawalCalloutProps {
  className?: string;
}

const CALLOUT_COPY: Record<Locale, { title: string; body: string }> = {
  [Locale.TR]: {
    title: "Dijital ürünlerde erişim açıldıktan sonra cayma hakkı yoktur (§ 356 Abs. 5 BGB).",
    body: "Tam erişim, değerler ve analizler ödeme onaylanır onaylanmaz derhal açıldığı için cayma hakkı erişimin açılmasıyla birlikte sona erer. Devam eden aylık aboneliğinizi ise istediğiniz zaman ödenmiş ayın sonuna kadar feshedebilirsiniz.",
  },
  [Locale.DE]: {
    title: "Kein Widerruf nach Freischaltung digitaler Produkte (§ 356 Abs. 5 BGB).",
    body: "Da sämtliche digitalen Daten, Verkehrswerte und Auswertungen unmittelbar mit der Buchung freigeschaltet werden, erlischt das Widerrufsrecht sofort mit der Freischaltung. Ein laufendes Monatsabo können Sie jederzeit ordentlich zum Ende des bezahlten Monats kündigen.",
  },
  [Locale.EN]: {
    title: "No right of withdrawal after activation of digital products (§ 356 (5) BGB).",
    body: "Because all digital data, valuations and analyses are unlocked immediately upon payment confirmation, the right of withdrawal expires immediately upon activation. You may cancel a recurring monthly subscription at any time to the end of the current billing month.",
  },
  [Locale.IT]: {
    title: "Nessun recesso dopo l'attivazione di prodotti digitali (§ 356 comma 5 BGB).",
    body: "Poiché tutti i dati digitali, le perizie e le analisi vengono sbloccati immediatamente con la conferma del pagamento, il diritto di recesso si estingue subito con l'attivazione. Puoi disdire un abbonamento mensile in qualsiasi momento con effetto alla fine del mese pagato.",
  },
  [Locale.ES]: {
    title: "Sin derecho de desistimiento tras la activación de productos digitales (§ 356 apdo. 5 BGB).",
    body: "Dado que todos los datos digitales, tasaciones y análisis se desbloquean inmediatamente tras confirmarse el pago, el derecho de desistimiento se extingue de inmediato con la activación. Puedes cancelar una suscripción mensual en cualquier momento al final del mes abonado.",
  },
  [Locale.FR]: {
    title: "Aucune rétractation après l'activation des contenus numériques (§ 356 al. 5 BGB).",
    body: "Toutes les données numériques, mises à prix et analyses étant débloquées immédiatement dès confirmation du paiement, le droit de rétractation s'éteint dès l'activation. Vous pouvez résilier un abonnement mensuel à tout moment pour la fin du mois payé.",
  },
};

const BOX_CLASSES = "flex flex-col items-start gap-4 border-2 border-ink bg-paper-bright p-6 shadow-[6px_6px_0_0_var(--signal)]";

/** Clarifies on /widerruf that digital products expire immediately upon activation, and links to ordinary subscription cancellation. */
export default async function WithdrawalCallout({ className }: WithdrawalCalloutProps = {}) {
  const locale = await TranslationService.GetUserLocale();
  const { Footer } = BillingTranslations[locale];
  const copy = CALLOUT_COPY[locale] ?? CALLOUT_COPY[Locale.DE];

  return (
    <div className={className ? `${BOX_CLASSES} ${className}` : BOX_CLASSES}>
      <p className="font-narrow text-2xl leading-tight font-semibold">{copy.title}</p>
      <p className="max-w-xl text-sm leading-relaxed text-ink-soft">{copy.body}</p>
      <Button label={Footer.Cancel} href={BILLING_ROUTES.cancel} variant="signal" withArrow />
    </div>
  );
}
