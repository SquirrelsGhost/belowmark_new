import WatchButton from "@/components/app/watchlist/WatchButton";

interface WatchlistMissingProps {
  listingId: string;
  message: string;
  watchLabels: { watch: string; unwatch: string; error: string };
}

/** A saved key that is no longer in the data — said, not hidden. */
export default function WatchlistMissing({ listingId, message, watchLabels }: WatchlistMissingProps) {
  return (
    <li className="flex items-center justify-between gap-4 border-b border-rule bg-hatch px-3 py-3">
      <p className="text-sm text-muted">
        <span className="font-mono text-[11px]">{listingId}</span> — {message}
      </p>
      <WatchButton listingId={listingId} isSaved watchLabel={watchLabels.watch} unwatchLabel={watchLabels.unwatch} errorLabel={watchLabels.error} />
    </li>
  );
}
