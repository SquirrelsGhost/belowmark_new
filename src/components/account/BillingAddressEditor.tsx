// Needs state: the saved address shows as a compact card, the form opens only on "Bearbeiten"
"use client";

import { useCallback, useState } from "react";
import BillingAddressForm, { type BillingAddressValues } from "@/components/account/BillingAddressForm";
import BillingAddressSummary from "@/components/account/BillingAddressSummary";
import BillingNotice from "@/components/billing/BillingNotice";
import { IAccountTranslation } from "@/translations/account/IAccountTranslation";

interface BillingAddressEditorProps {
  t: IAccountTranslation["Address"];
  initial: BillingAddressValues | null;
}

/** Empty: the form. Saved: one line with name and address plus a small "Bearbeiten" button. */
export default function BillingAddressEditor({ t, initial }: BillingAddressEditorProps) {
  const [saved, setSaved] = useState(initial);
  const [isEditing, setIsEditing] = useState(!initial);
  const [justSaved, setJustSaved] = useState(false);

  const onSaved = useCallback((values: BillingAddressValues) => {
    setSaved(values);
    setIsEditing(false);
    setJustSaved(true);
  }, []);

  if (!isEditing && saved) {
    return (
      <div className="grid gap-3">
        {justSaved && <BillingNotice tone="verdict" message={t.Saved} />}
        <BillingAddressSummary {...saved} vatLabel={t.VatId} editLabel={t.Edit} onEdit={() => { setJustSaved(false); setIsEditing(true); }} />
      </div>
    );
  }
  return <BillingAddressForm t={t} initial={saved} onSaved={onSaved} onCancel={saved ? () => setIsEditing(false) : undefined} />;
}
