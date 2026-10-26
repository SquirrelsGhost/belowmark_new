// Runs a Server Action on one client link (revoke, delete, new address) and shows the result inline
"use client";

import { useActionState } from "react";
import ClientShareCreated from "@/components/app/clientShare/ClientShareCreated";
import { ClientShareActionState, changeClientShareAction } from "@/lib/clientShare/clientShareActions";
import { IClientShareTranslation } from "@/translations/clientShare/IClientShareTranslation";

interface ShareActionButtonProps {
  shareId: string;
  intent: "revoke" | "delete" | "renew";
  label: string;
  errorLabel: string;
  /** Needed for "renew": the new address is shown once */
  created?: IClientShareTranslation["Created"];
  renewedTitle?: string;
}

const INTENT_CLASSES: Record<ShareActionButtonProps["intent"], string> = {
  renew: "border-rule-strong bg-paper-bright text-ink hover:border-ink",
  revoke: "border-ink bg-ink text-paper-bright",
  delete: "border-transparent text-signal hover:border-signal",
};

export default function ShareActionButton({ shareId, intent, label, errorLabel, created, renewedTitle }: ShareActionButtonProps) {
  const [state, formAction, isPending] = useActionState<ClientShareActionState, FormData>(changeClientShareAction, { ok: true });
  if (state.ok && state.path && state.printPath && created) {
    return (
      <div className="w-full">
        <ClientShareCreated path={state.path} printPath={state.printPath} labels={created} title={renewedTitle} />
      </div>
    );
  }
  return (
    <form action={formAction} className="inline-flex flex-col items-start">
      <input type="hidden" name="shareId" value={shareId} />
      <input type="hidden" name="intent" value={intent} />
      <button
        type="submit"
        disabled={isPending}
        className={`h-8 cursor-pointer border px-3 font-narrow text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors disabled:opacity-60 ${INTENT_CLASSES[intent]}`}
      >
        {label}
      </button>
      {!state.ok && (
        <span role="alert" className="mt-1 font-mono text-[10px] text-signal">
          {errorLabel}
        </span>
      )}
    </form>
  );
}
