// Needs useActionState & router.refresh() to unlock the 1 free dossier interactively
"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { claimFreeUnlockAction, FreeUnlockActionState } from "@/lib/listing/claimFreeUnlockAction";

interface FreeUnlockButtonProps {
  listingKey: string;
  ctaLabel: string;
  pendingLabel: string;
  noteLabel: string;
  errorUsedLabel: string;
  errorDeviceLabel: string;
  errorGenericLabel: string;
  redirectHref?: string;
}

const INITIAL_STATE: FreeUnlockActionState = { status: "idle" };

const BUTTON_CLASSES = [
  "inline-flex items-center justify-center gap-2 border-2 border-ink bg-signal px-5 py-3",
  "font-mono text-xs font-semibold tracking-[0.12em] uppercase text-paper-bright",
  "shadow-[3px_3px_0_0_var(--color-ink)] transition-transform hover:-translate-y-0.5",
  "disabled:cursor-wait disabled:opacity-70",
].join(" ");

export default function FreeUnlockButton({
  listingKey,
  ctaLabel,
  pendingLabel,
  noteLabel,
  errorUsedLabel,
  errorDeviceLabel,
  errorGenericLabel,
  redirectHref,
}: FreeUnlockButtonProps) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(claimFreeUnlockAction, INITIAL_STATE);

  useEffect(() => {
    if (state.status === "unlocked") {
      if (redirectHref) {
        router.push(redirectHref);
      } else {
        router.refresh();
      }
    }
  }, [redirectHref, router, state.status]);

  const errorMessage =
    state.status === "error"
      ? state.reason === "already_used"
        ? errorUsedLabel
        : state.reason === "device_used"
          ? errorDeviceLabel
          : errorGenericLabel
      : null;

  return (
    <form action={action} className="flex flex-col items-stretch gap-2 sm:items-start lg:items-end">
      <input type="hidden" name="listingKey" value={listingKey} />
      <button type="submit" disabled={isPending} className={BUTTON_CLASSES}>
        <span>{isPending ? pendingLabel : ctaLabel}</span>
        <span aria-hidden="true">→</span>
      </button>
      <p className="font-mono text-[11px] text-ink-muted">{noteLabel}</p>
      {errorMessage && (
        <p role="alert" className="max-w-xs font-mono text-[11px] font-semibold text-signal lg:text-right">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
