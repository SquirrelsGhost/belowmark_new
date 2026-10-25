import Link from "next/link";
import { APP_NAME, ROUTES } from "@/lib/constants";

/** Wordmark with a small gradient glyph. */
export default function NavigationLogo() {
  return (
    <Link href={ROUTES.home} className="mr-auto flex items-center gap-2.5 text-ink" aria-label={APP_NAME}>
      <span aria-hidden="true" className="relative grid size-7 place-items-center overflow-hidden rounded-lg bg-ink">
        <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-r from-iris via-ember to-lagoon" />
        <span className="relative mb-1.5 h-px w-3.5 bg-canvas" />
      </span>
      <span className="text-[15px] font-semibold tracking-tight">{APP_NAME.toLowerCase()}</span>
    </Link>
  );
}
