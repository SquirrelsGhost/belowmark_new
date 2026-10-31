interface AppContentSkeletonProps {
  variant?: "list" | "search" | "panel" | "listing";
}

const SKELETON_ROWS = [1, 2, 3, 4] as const;
const BLOCK_CLASS = "animate-pulse bg-paper-warm/80";
const SOFT_BLOCK_CLASS = "animate-pulse bg-paper-warm/50";

/**
 * Editorial placeholder shown while dynamic page content streams in,
 * while the page header and navigation are already interactive.
 */
export default function AppContentSkeleton({ variant = "list" }: AppContentSkeletonProps) {
  if (variant === "panel") {
    return (
      <div aria-busy="true" className="mt-10 border border-rule bg-paper-bright/50 p-6">
        <div className={`h-3 w-28 ${BLOCK_CLASS}`} />
        <div className={`mt-3 h-7 w-64 ${BLOCK_CLASS}`} />
        <div className={`mt-4 h-16 w-full ${SOFT_BLOCK_CLASS}`} />
      </div>
    );
  }

  if (variant === "search") {
    return (
      <div aria-busy="true" className="mt-8 flex flex-col gap-8">
        <div className="border border-rule bg-paper-bright/60 p-5">
          <div className={`h-3 w-36 ${BLOCK_CLASS}`} />
          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8">
            {SKELETON_ROWS.map((item) => (
              <div key={item} className={`h-14 ${SOFT_BLOCK_CLASS}`} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="h-96 border border-rule bg-paper-bright/50 p-5">
            <div className={`h-4 w-32 ${BLOCK_CLASS}`} />
            <div className={`mt-4 h-10 w-full ${SOFT_BLOCK_CLASS}`} />
            <div className={`mt-4 h-10 w-full ${SOFT_BLOCK_CLASS}`} />
            <div className={`mt-4 h-24 w-full ${SOFT_BLOCK_CLASS}`} />
          </div>
          <div className="flex flex-col divide-y divide-rule border-t border-ink">
            {SKELETON_ROWS.map((row) => (
              <div key={row} className="flex gap-5 py-5">
                <div className={`h-20 w-16 shrink-0 ${BLOCK_CLASS}`} />
                <div className="flex flex-1 flex-col gap-2.5">
                  <div className={`h-3 w-40 ${SOFT_BLOCK_CLASS}`} />
                  <div className={`h-6 w-3/4 ${BLOCK_CLASS}`} />
                  <div className={`h-3.5 w-1/2 ${SOFT_BLOCK_CLASS}`} />
                </div>
                <div className={`hidden h-14 w-28 shrink-0 sm:block ${SOFT_BLOCK_CLASS}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div aria-busy="true" className="mt-8 flex flex-col divide-y divide-rule border-t border-ink">
      {SKELETON_ROWS.map((row) => (
        <div key={row} className="flex items-center justify-between gap-6 py-5">
          <div className="flex flex-1 flex-col gap-2.5">
            <div className={`h-3 w-32 ${SOFT_BLOCK_CLASS}`} />
            <div className={`h-6 w-2/3 ${BLOCK_CLASS}`} />
            <div className={`h-3.5 w-1/2 ${SOFT_BLOCK_CLASS}`} />
          </div>
          <div className={`h-9 w-24 shrink-0 ${SOFT_BLOCK_CLASS}`} />
        </div>
      ))}
    </div>
  );
}
