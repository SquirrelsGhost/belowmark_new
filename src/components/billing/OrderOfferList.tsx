import AuthTextLink from "@/components/auth/AuthTextLink";
import OrderOfferOption from "@/components/billing/OrderOfferOption";
import type { OrderOfferView } from "@/components/billing/OrderForm";

interface OrderOfferListProps {
  legend: string;
  legendClassName: string;
  offers: OrderOfferView[];
  selectedId: string;
  onSelect: (id: string) => void;
  /** Link to the prorated Pro upgrade while Investor runs */
  upgrade?: { href: string; label: string };
}

/** Step 02 of /buchen: the four offers as radio cards, plus the upgrade link when it applies. */
export default function OrderOfferList({ legend, legendClassName, offers, selectedId, onSelect, upgrade }: OrderOfferListProps) {
  return (
    <fieldset className="grid gap-3">
      <legend className={legendClassName}>
        <span className="text-signal">02</span> {legend}
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {offers.map((item) => (
          <OrderOfferOption key={item.id} {...item} isSelected={item.id === selectedId} onSelect={() => onSelect(item.id)} />
        ))}
      </div>
      {upgrade && <AuthTextLink href={upgrade.href} label={upgrade.label} />}
    </fieldset>
  );
}
