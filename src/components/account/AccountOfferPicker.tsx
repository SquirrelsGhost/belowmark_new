import AccountPlanCard from "@/components/account/AccountPlanCard";
import AuthTextLink from "@/components/auth/AuthTextLink";
import BillingNotice from "@/components/billing/BillingNotice";
import { AccountPlanCardView } from "@/lib/billing/accountOfferView";

interface AccountOfferPickerProps {
  title: string;
  lead: string;
  cards: AccountPlanCardView[];
  currentLabel: string;
  /** "Preise für Deutschland (DE)." */
  countryNote: string;
  changeCountry: { href: string; label: string };
  team: { question: string; href: string; label: string };
  /** Booking closed for this market (configuration or legal gate) */
  closedNotice?: string;
}

/** "Paket wählen": Investor and Pro side by side, each price one click away from the order summary. */
export default function AccountOfferPicker({ title, lead, cards, currentLabel, countryNote, changeCountry, team, closedNotice }: AccountOfferPickerProps) {
  return (
    <div className="mt-8 grid gap-5">
      <div>
        <h3 className="font-narrow text-lg font-semibold tracking-[0.04em] uppercase">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{lead}</p>
      </div>
      {closedNotice && <BillingNotice tone="signal" message={closedNotice} />}
      <div className="grid gap-5 md:grid-cols-2">
        {cards.map((card) => (
          <AccountPlanCard key={card.plan} card={card} currentLabel={currentLabel} />
        ))}
      </div>
      <p className="flex flex-wrap items-baseline gap-x-4 gap-y-2 text-xs text-muted">
        <span>{countryNote}</span>
        <AuthTextLink href={changeCountry.href} label={changeCountry.label} size="xs" />
        <span aria-hidden="true">·</span>
        <span>{team.question}</span>
        <AuthTextLink href={team.href} label={team.label} size="xs" />
      </p>
    </div>
  );
}
