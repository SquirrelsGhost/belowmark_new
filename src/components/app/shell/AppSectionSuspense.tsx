import { ReactNode, Suspense } from "react";
import AppContentSkeleton from "@/components/app/shell/AppContentSkeleton";

interface AppSectionSuspenseProps {
  variant?: "list" | "search" | "panel" | "listing";
  children: ReactNode;
}

/**
 * Streams an async page section while showing the editorial skeleton immediately.
 */
export default function AppSectionSuspense({ variant = "list", children }: AppSectionSuspenseProps) {
  return <Suspense fallback={<AppContentSkeleton variant={variant} />}>{children}</Suspense>;
}
