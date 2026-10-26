import VerdictQuestion from "@/components/app/verdict/VerdictQuestion";
import { TEXT_LINK_CLASSES } from "@/lib/appStyles";
import { MarketCode } from "@/lib/constants";
import { VERDICT_ANCHORS, VERDICT_OPTIONS } from "@/lib/verdict/verdictConstants";
import { IVerdictTranslation } from "@/translations/verdict/IVerdictTranslation";
import { VerdictAnswerKey, VerdictAnswers } from "@/types/verdict.types";

interface VerdictQuestionsProps {
  listingId: string;
  answers: VerdictAnswers;
  labels: IVerdictTranslation["Questions"];
  market: MarketCode;
  onChange: (key: VerdictAnswerKey, value: string | null) => void;
  onReset: (() => void) | null;
}

/** What no document can say: inspection, rights, occupancy, basis of the costs. */
export default function VerdictQuestions({ listingId, answers, labels, market, onChange, onReset }: VerdictQuestionsProps) {
  const keys = Object.keys(VERDICT_OPTIONS) as VerdictAnswerKey[];
  return (
    <section id={VERDICT_ANCHORS.questions} aria-label={labels.Title} className="flex scroll-mt-24 flex-col gap-4 border-2 border-ink bg-paper p-4">
      <div>
        <h3 className="font-narrow text-sm font-bold tracking-[0.12em] uppercase">{labels.Title}</h3>
        <p className="mt-1 text-xs leading-snug text-ink-soft">{labels.Lead}</p>
      </div>
      {keys.map((key) => {
        const item = labels.Items[key];
        const text = key === "rights" ? labels.Rights[market] : item;
        return (
          <VerdictQuestion
            key={key}
            name={`urteil-${key}-${listingId}`}
            label={text.Label}
            hint={text.Hint}
            options={VERDICT_OPTIONS[key].map((value) => ({ value, label: item.Options[value] }))}
            value={answers[key]}
            unansweredLabel={labels.Unanswered}
            onChange={(value) => onChange(key, value)}
          />
        );
      })}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-3">
        <p className="font-mono text-[10px] text-muted">{labels.StorageHint}</p>
        {onReset && (
          <button type="button" onClick={onReset} className={`${TEXT_LINK_CLASSES} cursor-pointer`}>
            {labels.Reset}
          </button>
        )}
      </div>
    </section>
  );
}
