// Creates the calendar feed address through a Server Action and shows it once
"use client";

import { useActionState } from "react";
import CopyButton from "@/components/app/listing/CopyButton";
import { DeadlineActionState, renewFeedAction } from "@/lib/deadlines/deadlineActions";

interface DeadlineFeedPanelProps {
  hasFeed: boolean;
  labels: {
    Title: string;
    Body: string;
    Create: string;
    Renew: string;
    Copy: string;
    Copied: string;
    Shown: string;
    Hidden: string;
    Error: string;
  };
}

/** The subscribable calendar: one secret address per user, renewable when it leaked. */
export default function DeadlineFeedPanel({ hasFeed, labels }: DeadlineFeedPanelProps) {
  const [state, formAction, isPending] = useActionState<DeadlineActionState, FormData>(renewFeedAction, { ok: true });
  const exists = hasFeed || Boolean(state.feedUrl);
  return (
    <section aria-label={labels.Title} className="flex flex-col gap-3 border border-ink bg-paper-bright p-5">
      <h2 className="font-narrow text-sm font-bold tracking-[0.12em] uppercase">{labels.Title}</h2>
      <p className="max-w-2xl text-sm leading-relaxed text-ink-soft">{labels.Body}</p>
      {state.feedUrl && (
        <div className="flex flex-col gap-2">
          <code className="block overflow-x-auto border border-rule-strong bg-paper px-3 py-2 font-mono text-[12px] break-all whitespace-pre-wrap">{state.feedUrl}</code>
          <div className="flex flex-wrap items-center gap-3">
            <CopyButton text={state.feedUrl} label={labels.Copy} copiedLabel={labels.Copied} />
            <span className="font-mono text-[10px] text-signal">{labels.Shown}</span>
          </div>
        </div>
      )}
      {!state.feedUrl && hasFeed && <p className="font-mono text-[11px] text-muted">{labels.Hidden}</p>}
      <form action={formAction}>
        <button
          type="submit"
          disabled={isPending}
          className="h-10 cursor-pointer border border-ink bg-ink px-4 font-narrow text-xs font-semibold tracking-[0.08em] text-paper-bright uppercase shadow-[3px_3px_0_0_var(--signal)] disabled:opacity-60"
        >
          {exists ? labels.Renew : labels.Create}
        </button>
      </form>
      {!state.ok && (
        <span role="alert" className="font-mono text-[10px] text-signal">
          {labels.Error}
        </span>
      )}
    </section>
  );
}
