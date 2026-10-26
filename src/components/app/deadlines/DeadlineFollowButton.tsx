// Runs the follow / unfollow Server Action and shows a failure inline
"use client";

import { useActionState } from "react";
import { DeadlineActionState, toggleFollowAction } from "@/lib/deadlines/deadlineActions";

interface DeadlineFollowButtonProps {
  listingKey: string;
  isFollowing: boolean;
  followLabel: string;
  unfollowLabel: string;
  errorLabel: string;
}

const BUTTON = "h-10 cursor-pointer border px-4 font-narrow text-xs font-semibold tracking-[0.08em] uppercase transition-[box-shadow,colors] disabled:opacity-60";

export default function DeadlineFollowButton({ listingKey, isFollowing, followLabel, unfollowLabel, errorLabel }: DeadlineFollowButtonProps) {
  const [state, formAction, isPending] = useActionState<DeadlineActionState, FormData>(toggleFollowAction, { ok: true });
  return (
    <form action={formAction} className="inline-flex flex-col items-start">
      <input type="hidden" name="listingKey" value={listingKey} />
      <input type="hidden" name="intent" value={isFollowing ? "unfollow" : "follow"} />
      <button
        type="submit"
        disabled={isPending}
        className={`${BUTTON} ${isFollowing ? "border-rule-strong bg-paper-bright text-ink hover:border-ink" : "border-ink bg-ink text-paper-bright shadow-[3px_3px_0_0_var(--signal)] hover:shadow-[5px_5px_0_0_var(--signal)]"}`}
      >
        {isFollowing ? unfollowLabel : followLabel}
      </button>
      {!state.ok && (
        <span role="alert" className="mt-1 font-mono text-[10px] text-signal">
          {errorLabel}
        </span>
      )}
    </form>
  );
}
