import { IAuthIntro } from "@/translations/auth/IAuthTranslation";

interface AuthIntroProps {
  intro: IAuthIntro;
  formPrefix: string;
  lineLabel: string;
}

/**
 * The notice-board half of an auth page: the headline sits above the red
 * market line, the promise below it — the same grammar as the landing hero.
 */
export default function AuthIntro({ intro, formPrefix, lineLabel }: AuthIntroProps) {
  return (
    <section className="flex flex-col lg:sticky lg:top-24 lg:col-span-6">
      <p className="flex items-baseline justify-between border-t border-rule-strong pt-3 font-mono text-xs tracking-wider text-muted uppercase">
        <span>§ {formPrefix} {intro.FormNumber}</span>
        <span aria-hidden="true">Belowmark</span>
      </p>
      <h1 className="mt-6 font-display text-[clamp(2.6rem,7.5vw,5.75rem)] leading-[0.86] text-balance hyphens-auto">{intro.HeadlineTop}</h1>
      <div aria-hidden="true" className="relative mt-6 mb-5">
        <span className="block h-[3px] origin-left animate-draw bg-signal" />
        <span className="absolute -top-5 right-0 font-mono text-[10px] tracking-[0.18em] text-signal uppercase">{lineLabel}</span>
      </div>
      <p className="max-w-xl font-narrow text-2xl leading-tight font-semibold text-ink-soft text-balance sm:text-3xl">{intro.HeadlineBelow}</p>
      <p className="mt-4 hidden max-w-md leading-relaxed text-muted text-pretty sm:block">{intro.Lede}</p>
      <ol className="mt-8 hidden max-w-md border-t border-rule sm:block">
        {intro.Points.map((point, index) => (
          <li key={point} className="flex items-baseline gap-4 border-b border-rule py-3 text-sm text-ink-soft">
            <span className="font-mono text-xs font-semibold text-signal">{String(index + 1).padStart(2, "0")}</span>
            {point}
          </li>
        ))}
      </ol>
    </section>
  );
}
