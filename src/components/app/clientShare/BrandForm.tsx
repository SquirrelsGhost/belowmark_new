// Saves the letterhead through a Server Action and reports the result inline
"use client";

import { useActionState } from "react";
import BrandField from "@/components/app/clientShare/BrandField";
import { CONTROL_CLASSES, LABEL_CLASSES } from "@/lib/appStyles";
import { BrandActionState, saveBrandAction } from "@/lib/clientShare/brandActions";
import { CLIENT_SHARE } from "@/lib/clientShare/clientShareConfig";
import { IClientShareTranslation } from "@/translations/clientShare/IClientShareTranslation";
import { BrokerBrandView } from "@/types/clientShare.types";

interface BrandFormProps {
  brand: BrokerBrandView | null;
  labels: IClientShareTranslation;
}

const SUBMIT = "inline-flex h-10 cursor-pointer items-center bg-ink px-4 font-narrow text-xs font-semibold tracking-[0.08em] text-paper-bright uppercase disabled:opacity-60";
/** Shown in the colour picker when no accent is saved: the belowmark red */
const DEFAULT_ACCENT = "#c8362b";

/** Name, contact line, links and accent colour of the letterhead. */
export default function BrandForm({ brand, labels }: BrandFormProps) {
  const [state, formAction, isPending] = useActionState<BrandActionState, FormData>(saveBrandAction, { ok: true });
  const { Brand: B, Errors } = labels;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <BrandField label={B.DisplayName}>
        <input name="displayName" required maxLength={CLIENT_SHARE.displayNameMax} defaultValue={brand?.displayName ?? ""} autoComplete="organization" className={CONTROL_CLASSES} />
      </BrandField>
      <BrandField label={B.Contact} hint={B.ContactHint}>
        <input name="contactLine" maxLength={CLIENT_SHARE.contactMax} defaultValue={brand?.contactLine ?? ""} className={CONTROL_CLASSES} />
      </BrandField>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BrandField label={B.Website}>
          <input name="website" type="text" inputMode="url" autoComplete="url" maxLength={CLIENT_SHARE.urlMax} defaultValue={brand?.website ?? ""} placeholder="https://" className={CONTROL_CLASSES} />
        </BrandField>
        <BrandField label={B.Imprint} hint={B.ImprintHint}>
          <input name="imprintUrl" type="text" inputMode="url" autoComplete="url" maxLength={CLIENT_SHARE.urlMax} defaultValue={brand?.imprintUrl ?? ""} placeholder="https://" className={CONTROL_CLASSES} />
        </BrandField>
      </div>
      <label className="flex items-center gap-3">
        <input name="accentColor" type="color" defaultValue={brand?.accentColor ?? DEFAULT_ACCENT} className="h-10 w-14 cursor-pointer border border-rule-strong bg-paper-bright" />
        <span>
          <span className={`${LABEL_CLASSES} block`}>{B.Accent}</span>
          <span className="block text-[11px] leading-snug text-muted">{B.AccentHint}</span>
        </span>
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={isPending} className={SUBMIT}>
          {B.Save}
        </button>
        {state.ok && state.saved && <span role="status" className="font-mono text-[11px] text-verdict">{B.Saved}</span>}
        {!state.ok && state.error && (
          <span role="alert" className="text-sm text-signal">
            {Errors[state.error]}
          </span>
        )}
      </div>
    </form>
  );
}
