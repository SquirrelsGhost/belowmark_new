import AccountOfferRow from "@/components/account/AccountOfferRow";
import { AccountPlanCardView } from "@/lib/billing/accountOfferView";

interface AccountPlanCardProps {
  card: AccountPlanCardView;
  currentLabel: string;
}

/** One plan (Investor or Pro) as a card with its monthly and three-month price lines. */
export default function AccountPlanCard({ card, currentLabel }: AccountPlanCardProps) {
  return (
    <article className={`relative flex flex-col border-2 bg-paper-bright p-5 ${card.isCurrent ? "border-signal" : "border-ink"}`}>
      {card.isCurrent && (
        <span className="absolute -top-2.5 right-4 border border-ink bg-signal px-2 py-0.5 font-mono text-[9px] font-semibold tracking-[0.14em] text-paper-bright uppercase">
          {currentLabel}
        </span>
      )}
      <header className="flex-1 border-b-2 border-ink pb-3">
        <h3 className="font-display text-2xl leading-none uppercase">{card.name}</h3>
        <p className="mt-1.5 text-sm leading-snug text-ink-soft">{card.summary}</p>
      </header>
      <div className="mt-4 grid">
        {card.rows.map((row) => (
          <AccountOfferRow key={row.id} row={row} />
        ))}
      </div>
    </article>
  );
}
