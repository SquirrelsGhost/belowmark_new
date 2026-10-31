// Needs state: the address shows as one compact line, the form opens only on "Bearbeiten" / "Adresse hinterlegen"
"use client";

import { useCallback, useState } from "react";
import BillingAddressForm, { type BillingAddressValues } from "@/components/account/BillingAddressForm";
import BillingAddressEmpty from "@/components/account/BillingAddressEmpty";
import BillingAddressSummary from "@/components/account/BillingAddressSummary";
import BillingNotice from "@/components/billing/BillingNotice";
import { IAccountTranslation } from "@/translations/account/IAccountTranslation";

interface BillingAddressEditorProps {
  t: IAccountTranslation["Address"];
  initial: BillingAddressValues | null;
}

/** Empty: one line with "Adresse hinterlegen". Saved: one line with name and address plus "Bearbeiten". The form opens on demand. */
export default function BillingAddressEditor({ t, initial }: BillingAddressEditorProps) {
  const [saved, setSaved] = useState(initial);
  const [isEditing, setIsEditing] = useState(false);
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
  if (!isEditing) return <BillingAddressEmpty message={t.Empty} addLabel={t.Add} onAdd={() => setIsEditing(true)} />;
  return <BillingAddressForm t={t} initial={saved} onSaved={onSaved} onCancel={() => setIsEditing(false)} />;
}
