// Recomputes the checks whenever the seller's inputs or photos change
"use client";

import { useMemo } from "react";
import ExposeCheckItem from "@/components/expose/ExposeCheckItem";
import { useExpose } from "@/hooks/useExpose";
import { useExposePhotos } from "@/hooks/useExposePhotos";
import { fill } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { buildExposeChecks } from "@/lib/expose/exposeChecks";
import { resolveFacts } from "@/lib/expose/exposeFacts";
import { IExposeTranslation } from "@/translations/expose/IExposeTranslation";
import { ExposeBase } from "@/types/expose.types";

interface ExposeChecksProps {
  base: ExposeBase;
  locale: LocaleOption;
  labels: IExposeTranslation["Checks"];
}

/** Screen-only: what is still open before the exposé goes out, each with its legal basis. Never printed. */
export default function ExposeChecks({ base, locale, labels }: ExposeChecksProps) {
  const { inputs } = useExpose(base.listingKey);
  const { photos } = useExposePhotos(base.listingKey);
  const checks = useMemo(
    () => buildExposeChecks({ base, inputs, facts: resolveFacts(base, inputs, locale), photoCount: photos.length }),
    [base, inputs, locale, photos.length],
  );
  const texts = labels.Items[base.market];
  const count = (state: string) => checks.filter((check) => check.state === state).length;
  return (
    <section aria-label={labels.Title} className="flex flex-col gap-2 border-2 border-ink bg-paper-bright p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-narrow text-sm font-bold tracking-[0.14em] uppercase">{labels.Title}</h2>
        <p className="font-mono text-[11px] text-muted">{fill(labels.Summary, { open: count("open"), ok: count("ok") })}</p>
      </div>
      <p className="text-[13px] leading-snug text-ink-soft">{labels.Lead}</p>
      <ul className="flex flex-col">
        {checks.map(({ id, state }) => {
          const check = texts[id];
          return check ? <ExposeCheckItem key={id} check={check} state={state} stateLabel={labels.States[state]} /> : null;
        })}
      </ul>
    </section>
  );
}
