import Link from "next/link";
import { APP_ROUTES } from "@/lib/appConstants";
import { LocaleOption } from "@/lib/constants";
import { QUOTA_EXCEEDED_COPY } from "@/lib/sicherheit/quotaExceededCopy";

interface QuotaExceededNoticeProps {
  locale: LocaleOption;
  retryAfterMinutes: number;
  isLocked: boolean;
}

export default function QuotaExceededNotice({ locale, retryAfterMinutes, isLocked }: QuotaExceededNoticeProps) {
  const text = QUOTA_EXCEEDED_COPY[locale] ?? QUOTA_EXCEEDED_COPY.de;
  return (
    <section className="my-8 border-2 border-ink bg-paper-bright p-6 sm:p-8">
      <p className="font-mono text-[11px] tracking-[0.16em] text-signal uppercase">{text.kicker}</p>
      <h2 className="mt-2 font-narrow text-2xl font-bold text-ink">{text.title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
        {isLocked ? text.bodyFree : text.bodyPaid}
      </p>
      <p className="mt-3 max-w-2xl border-l-2 border-signal pl-3 font-mono text-xs leading-relaxed text-ink">
        {text.warning}
      </p>
      <p className="mt-3 font-mono text-xs text-muted">
        {text.retryPrefix} {retryAfterMinutes} {text.minutes}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {isLocked && (
          <Link
            href={APP_ROUTES.order}
            className="bg-signal px-4 py-2 font-narrow text-xs font-bold tracking-[0.14em] text-paper-bright uppercase hover:bg-ink"
          >
            {text.ctaFree}
          </Link>
        )}
        <Link
          href={APP_ROUTES.search}
          className="border border-ink px-4 py-2 font-narrow text-xs font-bold tracking-[0.14em] text-ink uppercase hover:bg-paper-warm"
        >
          {text.ctaBack}
        </Link>
      </div>
    </section>
  );
}
