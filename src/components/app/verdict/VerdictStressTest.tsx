import { fill, formatMoney } from "@/lib/appFormat";
import { LABEL_CLASSES } from "@/lib/appStyles";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { IVerdictTranslation } from "@/translations/verdict/IVerdictTranslation";
import { VerdictStressCase } from "@/types/verdict.types";

interface VerdictStressTestProps {
  cases: VerdictStressCase[];
  labels: IVerdictTranslation["Stress"];
  market: MarketCode;
  locale: LocaleOption;
}

/** What the limit does if renovation and clearance cost more than entered — a what-if, labelled as such. */
export default function VerdictStressTest({ cases, labels, market, locale }: VerdictStressTestProps) {
  const shown = (stress: VerdictStressCase) =>
    stress.limit === null ? labels.NoLimit : stress.limit === "unreachable" ? labels.Unreachable : formatMoney(stress.limit, market, locale);

  return (
    <section aria-label={labels.Title} className="flex flex-col gap-2">
      <h3 className={LABEL_CLASSES}>{labels.Title}</h3>
      <p className="text-xs leading-snug text-ink-soft">{labels.Lead}</p>
      <ul className="flex flex-col gap-1 font-mono text-[13px]">
        {cases.map((stress) => (
          <li key={stress.pct} className={stress.belowThreshold ? "text-signal" : "text-ink"}>
            {fill(labels.Row, { pct: stress.pct, limit: shown(stress) })}
            {stress.belowThreshold && stress.limit !== "unreachable" && <span className="text-[11px]">{` · ${labels.BelowThreshold}`}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
