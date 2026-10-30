import AccountPanel from "@/components/account/AccountPanel";
import BillingAddressEditor from "@/components/account/BillingAddressEditor";
import { IAccountTranslation } from "@/translations/account/IAccountTranslation";

interface BillingAddressPanelProps {
  t: IAccountTranslation["Address"];
  initial: { name: string; address: string; vatId: string } | null;
}

/** "Rechnungsadresse": who the invoices are made out to. */
export default function BillingAddressPanel({ t, initial }: BillingAddressPanelProps) {
  return (
    <AccountPanel id="rechnungsadresse" title={t.Title} description={t.Description}>
      <BillingAddressEditor t={t} initial={initial} />
    </AccountPanel>
  );
}
