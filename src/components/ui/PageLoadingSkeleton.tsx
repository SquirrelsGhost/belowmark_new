import BrandMark from "@/components/brand/BrandMark";
import Container from "@/components/ui/Container";

interface PageLoadingSkeletonProps {
  className?: string;
}

const CARDS = [1, 2, 3] as const;

/**
 * Instant top-level route shell so public and account pages switch immediately on click.
 */
export default function PageLoadingSkeleton({ className = "" }: PageLoadingSkeletonProps) {
  return (
    <div aria-busy="true" className={`min-h-screen bg-paper text-ink ${className}`.trim()}>
      <div className="border-b border-ink bg-paper/95">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <BrandMark />
            <div className="flex items-center gap-4">
              <div className="hidden h-3.5 w-20 animate-pulse bg-paper-warm/80 sm:block" />
              <div className="hidden h-3.5 w-20 animate-pulse bg-paper-warm/80 sm:block" />
              <div className="h-8 w-24 animate-pulse bg-paper-warm/90" />
            </div>
          </div>
        </Container>
      </div>
      <Container>
        <div className="pt-10 pb-16">
          <div className="h-3 w-40 animate-pulse bg-paper-warm/80" />
          <div className="mt-4 h-14 w-80 max-w-full animate-pulse bg-paper-warm/90 sm:h-20 sm:w-[28rem]" />
          <div aria-hidden="true" className="mt-5 h-[3px] origin-left animate-draw bg-signal" />
          <div className="mt-5 h-4 w-2/3 max-w-xl animate-pulse bg-paper-warm/60" />
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {CARDS.map((card) => (
              <div key={card} className="h-52 border border-rule bg-paper-bright/60 p-6">
                <div className="h-3 w-24 animate-pulse bg-paper-warm/80" />
                <div className="mt-4 h-7 w-3/4 animate-pulse bg-paper-warm/90" />
                <div className="mt-4 h-20 w-full animate-pulse bg-paper-warm/50" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
