import AppContentSkeleton from "@/components/app/shell/AppContentSkeleton";
import AppMain from "@/components/app/shell/AppMain";
import { APP_MAIN_ID } from "@/lib/appConstants";

interface AppLoadingSkeletonProps {
  variant?: "list" | "search" | "panel" | "listing";
}

/**
 * Instant route shell for /app/* transitions: keeps the masthead and tab bar
 * interactive and renders the header frame + red signal rule at 0ms.
 */
export default function AppLoadingSkeleton({ variant = "list" }: AppLoadingSkeletonProps) {
  return (
    <AppMain id={APP_MAIN_ID}>
      <div aria-busy="true" className="pt-8 sm:pt-10">
        <div className="h-3 w-36 animate-pulse bg-paper-warm/80" />
        <div className="mt-3 h-12 w-72 max-w-full animate-pulse bg-paper-warm/90 sm:h-16 sm:w-96" />
        <div aria-hidden="true" className="mt-4 h-[3px] origin-left animate-draw bg-signal" />
        <div className="mt-4 h-4 w-2/3 max-w-xl animate-pulse bg-paper-warm/60" />
      </div>
      <AppContentSkeleton variant={variant} />
    </AppMain>
  );
}
