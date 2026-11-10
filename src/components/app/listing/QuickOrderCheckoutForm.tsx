// Needs useActionState for direct 1-click Stripe Checkout redirect from locked listings
"use client";

import Link from "next/link";
import { useActionState } from "react";
import AuthSubmit from "@/components/auth/AuthSubmit";
import { placeOrderAction } from "@/lib/billing/actions/placeOrderAction";
import { OFFERS } from "@/lib/billing/billingConfig";
import { INITIAL_ORDER_STATE } from "@/lib/billing/billingForm.types";
import { formatPrice } from "@/lib/billing/billingFormat";
import { LocaleOption, PricingCountryCode, ROUTES } from "@/lib/constants";

interface QuickOrderCheckoutFormProps {
  country: PricingCountryCode;
  locale: LocaleOption;
  stripeTrialEligible: boolean;
  submitLabel: string;
  noteLabel: string;
}

const COPY: Record<
  LocaleOption,
  {
    pending: string;
    consentPrefix: string;
    terms: string;
    withdrawal: string;
    privacy: string;
    consentError: string;
    genericError: string;
    trialSummary: (price: string) => string;
    stdSummary: (price: string) => string;
    oneTimeLink: (price: string) => string;
  }
> = {
  de: {
    pending: "Weiter zu Stripe …",
    consentPrefix: "Ich akzeptiere",
    terms: "AGB",
    withdrawal: "Widerrufsbelehrung",
    privacy: "Datenschutz",
    consentError: "Bitte bestätigen Sie kurz die Bedingungen vor dem Start.",
    genericError: "Weiterleitung fehlgeschlagen — bitte über Tarifübersicht öffnen.",
    trialSummary: (p) => `Heute 0,00 € für 7 Tage Vollzugang · ab Tag 8 ${p}/Monat (jederzeit vorab mit 1 Klick kündbar).`,
    stdSummary: (p) => `Sofortiger Vollzugang · ${p}/Monat · monatlich kündbar.`,
    oneTimeLink: (p) => `Kein Abo gewünscht? 3-Monats-Einmalpass (${p} · endet automatisch) →`,
  },
  tr: {
    pending: "Stripe'a yönlendiriliyor …",
    consentPrefix: "Kabul ediyorum:",
    terms: "Kullanım Koşulları",
    withdrawal: "Cayma Hakkı",
    privacy: "Gizlilik",
    consentError: "Devam etmeden önce lütfen koşulları onaylayın.",
    genericError: "İşlem başlatılamadı — lütfen paket sayfasından deneyin.",
    trialSummary: (p) => `Bugün 0,00 TL (7 gün tam erişim) · 8. günden itibaren ${p}/ay (öncesinde tek tıkla iptal).`,
    stdSummary: (p) => `Anında tam erişim · ${p}/ay · istediğiniz zaman iptal.`,
    oneTimeLink: (p) => `Abonelik istemiyor musunuz? 3 Aylık Tek Seferlik Paket (${p} · otomatik biter) →`,
  },
  en: {
    pending: "Opening Stripe …",
    consentPrefix: "I agree to the",
    terms: "Terms",
    withdrawal: "Withdrawal",
    privacy: "Privacy",
    consentError: "Please confirm the terms to start checkout.",
    genericError: "Could not start checkout — please use the plan page.",
    trialSummary: (p) => `Due today: 0.00 for 7 days full access · then ${p}/month (cancel in 1 click before day 8).`,
    stdSummary: (p) => `Instant full access · ${p}/month · cancel anytime.`,
    oneTimeLink: (p) => `Prefer no subscription? 3-Month One-Time Pass (${p} · never renews) →`,
  },
  fr: {
    pending: "Redirection Stripe …",
    consentPrefix: "J'accepte les",
    terms: "CGV",
    withdrawal: "Rétractation",
    privacy: "Confidentialité",
    consentError: "Veuillez confirmer les conditions pour continuer.",
    genericError: "Redirection impossible — veuillez passer par la page tarifs.",
    trialSummary: (p) => `0,00 € aujourd'hui pendant 7 jours · puis ${p}/mois (résiliable en 1 clic avant le 8e jour).`,
    stdSummary: (p) => `Accès complet immédiat · ${p}/mois · sans engagement.`,
    oneTimeLink: (p) => `Sans abonnement ? Pass 3 Mois Paiement Unique (${p} · fin automatique) →`,
  },
  es: {
    pending: "Abriendo Stripe …",
    consentPrefix: "Acepto los",
    terms: "Términos",
    withdrawal: "Desistimiento",
    privacy: "Privacidad",
    consentError: "Confirma las condiciones para continuar.",
    genericError: "No se pudo abrir el pago — usa la página de tarifas.",
    trialSummary: (p) => `Hoy 0,00 € durante 7 días · desde el día 8 ${p}/mes (cancelable en 1 clic antes).`,
    stdSummary: (p) => `Acceso completo inmediato · ${p}/mes · cancela cuando quieras.`,
    oneTimeLink: (p) => `¿Sin suscripción? Pase Único de 3 Meses (${p} · no se renueva) →`,
  },
  it: {
    pending: "Apertura Stripe …",
    consentPrefix: "Accetto",
    terms: "Termini",
    withdrawal: "Recesso",
    privacy: "Privacy",
    consentError: "Conferma le condizioni per procedere.",
    genericError: "Impossibile avviare il pagamento — apri la pagina piani.",
    trialSummary: (p) => `Oggi 0,00 € per 7 giorni completi · dal giorno 8 ${p}/mese (disdetta in 1 clic prima).`,
    stdSummary: (p) => `Accesso completo immediato · ${p}/mese · disdici quando vuoi.`,
    oneTimeLink: (p) => `Senza abbonamento? Pass Unico 3 Mesi (${p} · scade da solo) →`,
  },
};

export default function QuickOrderCheckoutForm({
  country,
  locale,
  stripeTrialEligible,
  submitLabel,
  noteLabel,
}: QuickOrderCheckoutFormProps) {
  const [state, action] = useActionState(placeOrderAction, INITIAL_ORDER_STATE);
  const L = COPY[locale] ?? COPY.de;
  const monthPrice = formatPrice(OFFERS["investor-monat"].prices[country], locale);
  const quarterPrice = formatPrice(OFFERS["investor-quartal"].prices[country], locale);
  const quarterHref = `/buchen?markt=${encodeURIComponent(country)}&tarif=investor-quartal`;

  return (
    <form action={action} className="grid w-full max-w-md gap-2.5 border-2 border-ink bg-paper-bright p-4">
      <input type="hidden" name="offer" value="investor-monat" />
      <input type="hidden" name="market" value={country} />
      <input type="hidden" name="source" value="listing-inline" />
      <p className="font-mono text-[11px] font-medium leading-relaxed text-ink">
        {stripeTrialEligible ? L.trialSummary(monthPrice) : L.stdSummary(monthPrice)}
      </p>
      <label className="flex items-start gap-2 font-mono text-[11px] leading-snug text-ink-soft">
        <input type="checkbox" name="consent" defaultChecked className="mt-0.5 size-4 shrink-0 accent-signal" />
        <span>
          {L.consentPrefix}{" "}
          <Link href={ROUTES.terms} className="underline hover:text-ink">{L.terms}</Link>,{" "}
          <Link href={ROUTES.withdrawal} className="underline hover:text-ink">{L.withdrawal}</Link> &{" "}
          <Link href={ROUTES.privacy} className="underline hover:text-ink">{L.privacy}</Link>.
        </span>
      </label>
      {state.status === "error" && (
        <p role="alert" className="font-mono text-[11px] font-semibold text-signal-deep">
          {state.code === "consent_required" ? L.consentError : L.genericError}
        </p>
      )}
      <AuthSubmit label={submitLabel} pendingLabel={L.pending} variant="signal" />
      <p className="font-mono text-[10px] text-ink-muted">{noteLabel}</p>
      <Link
        href={quarterHref}
        className="border-t border-rule pt-2 font-mono text-[11px] font-semibold text-ink underline underline-offset-4 hover:text-signal"
      >
        {L.oneTimeLink(quarterPrice)}
      </Link>
    </form>
  );
}
