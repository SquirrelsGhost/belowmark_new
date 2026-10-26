import Link from "next/link";
import Container from "@/components/ui/Container";
import { APP_ROUTES } from "@/lib/appConstants";

interface AppPlanBannerProps {
  message: string;
  /** Shows the upgrade link (free plan and last trial days) */
  ctaLabel?: string;
  tone: "trial" | "free";
}

/** One line under the masthead that says what this access includes. */
export default function AppPlanBanner({ message, ctaLabel, tone }: AppPlanBannerProps) {
  return (
    <div className={`border-b border-rule ${tone === "free" ? "bg-signal/10" : "bg-paper-deep"}`}>
      <Container className="flex min-h-10 flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2">
        <p className="flex items-center gap-2 text-sm text-ink-soft">
          <span aria-hidden="true" className={`size-2 rounded-full ${tone === "free" ? "bg-signal" : "bg-verdict"}`} />
          {message}
        </p>
        {ctaLabel && (
          <Link href={APP_ROUTES.order} className="font-narrow text-xs font-semibold tracking-[0.1em] text-signal uppercase underline-offset-4 hover:underline">
            {ctaLabel} →
          </Link>
        )}
      </Container>
    </div>
  );
}
