import FactRow from "@/components/app/listing/FactRow";
import TrPanel from "@/components/app/tr/TrPanel";
import TrPanelNote from "@/components/app/tr/TrPanelNote";
import Redacted from "@/components/ui/Redacted";
import { fill, formatMoney } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { formatPercent } from "@/lib/format";
import { valueAge } from "@/lib/tr/inflation";
import { formatFactor, formatMonth } from "@/lib/tr/trFormat";
import { ITrMarketTranslation } from "@/translations/trMarket/ITrMarketTranslation";
import { TufeSeries } from "@/types/trIndicators.types";

interface TrValueAgeProps {
  value: number | null;
  fileYear: number | null;
  /** null = the series is missing or too old to use */
  tufe: TufeSeries | null;
  labels: ITrMarketTranslation["Age"];
  notStated: string;
  locale: LocaleOption;
  isLocked: boolean;
  lockedLabel: string;
}

/** What the appraised value from the file year means in today's lira — or why there is nothing to say. */
export default function TrValueAge({ value, fileYear, tufe, labels, notStated, locale, isLocked, lockedLabel }: TrValueAgeProps) {
  const age = tufe ? valueAge(tufe, fileYear) : null;
  const reason = !tufe ? labels.Unavailable : fileYear === null ? labels.NoYear : age === null ? fill(labels.Young, { year: fileYear }) : null;

  return (
    <TrPanel title={labels.Title} lead={labels.Lead}>
      <dl className="divide-y divide-rule px-4">
        <FactRow label={labels.FileYear} value={fileYear === null ? null : String(fileYear)} notStated={notStated} mono />
        {age && <FactRow label={labels.Factor} value={formatFactor(age.factor, locale)} notStated={notStated} mono />}
        {age && <FactRow label={labels.Lost} value={formatPercent(age.lostPct, locale)} notStated={notStated} mono />}
        {age && value !== null && (
          <FactRow
            label={fill(labels.Today, { month: formatMonth(age.toMonth, locale) })}
            value={isLocked ? <Redacted label={lockedLabel} width="sm" /> : `≈ ${formatMoney(value * age.factor, "TR", locale)}`}
            notStated={notStated}
            mono
          />
        )}
      </dl>
      {age && <TrPanelNote text={`${fill(labels.Basis, { year: age.year })} ${labels.TodayNote}`} />}
      {reason && <TrPanelNote text={reason} tone={tufe ? "muted" : "caution"} />}
      {tufe && <TrPanelNote text={fill(labels.Source, { label: tufe.meta.label, source: tufe.meta.source, month: formatMonth(tufe.meta.to, locale) })} />}
    </TrPanel>
  );
}
