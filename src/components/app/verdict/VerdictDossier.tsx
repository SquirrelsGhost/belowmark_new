// Reads the bidder's figures and answers from localStorage and rebuilds the verdict live
"use client";

import { useMemo } from "react";
import VerdictHeadline from "@/components/app/verdict/VerdictHeadline";
import VerdictQuestions from "@/components/app/verdict/VerdictQuestions";
import VerdictReasons from "@/components/app/verdict/VerdictReasons";
import VerdictStressTest from "@/components/app/verdict/VerdictStressTest";
import VerdictUnknowables from "@/components/app/verdict/VerdictUnknowables";
import { useStoredText } from "@/hooks/useStoredText";
import { inputsKey, parseInputs } from "@/lib/bidding/biddingStorage";
import { LocaleOption } from "@/lib/constants";
import { buildVerdict } from "@/lib/verdict/buildVerdict";
import { hasAnyAnswer, parseVerdictAnswers } from "@/lib/verdict/verdictAnswers";
import { verdictAnswersKey } from "@/lib/verdict/verdictConstants";
import { VerdictNames } from "@/lib/verdict/verdictText";
import { IVerdictTranslation } from "@/translations/verdict/IVerdictTranslation";
import { BidContext } from "@/types/bidding.types";
import { VerdictAnswerKey, VerdictEvidence } from "@/types/verdict.types";

interface VerdictDossierProps {
  listingId: string;
  evidence: VerdictEvidence;
  context: BidContext | null;
  labels: IVerdictTranslation;
  names: VerdictNames;
  locale: LocaleOption;
}

const FRAME_TONE = {
  go: "border-verdict",
  open: "border-caution",
  stop: "border-signal",
  none: "border-rule-strong",
} as const;

/** The verdict for one proceeding: headline, reasons with sources, the bidder's answers and the stress test. */
export default function VerdictDossier({ listingId, evidence, context, labels, names, locale }: VerdictDossierProps) {
  const [rawInputs] = useStoredText(inputsKey(listingId));
  const [rawAnswers, writeAnswers] = useStoredText(verdictAnswersKey(listingId));
  const inputs = useMemo(() => parseInputs(rawInputs), [rawInputs]);
  const answers = useMemo(() => parseVerdictAnswers(rawAnswers), [rawAnswers]);
  const verdict = useMemo(() => buildVerdict(evidence, context, inputs, answers), [evidence, context, inputs, answers]);
  const market = evidence.market;

  const answer = (key: VerdictAnswerKey, value: string | null) => writeAnswers(JSON.stringify({ ...answers, [key]: value }));

  return (
    <div className={`grid border-2 bg-paper-bright shadow-[8px_8px_0_0_var(--ink)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] ${FRAME_TONE[verdict.state]}`}>
      <div className="flex flex-col gap-8 border-b border-rule p-5 lg:border-r lg:border-b-0">
        <VerdictHeadline verdict={verdict} labels={labels} market={market} locale={locale} />
        <VerdictReasons reasons={verdict.reasons} labels={labels} names={names} market={market} locale={locale} withActions />
      </div>
      <div className="flex flex-col gap-6 p-5">
        {verdict.state !== "none" && (
          <VerdictQuestions listingId={listingId} answers={answers} labels={labels.Questions} market={market} onChange={answer} onReset={hasAnyAnswer(answers) ? () => writeAnswers(null) : null} />
        )}
        {verdict.stress.length > 0 && <VerdictStressTest cases={verdict.stress} labels={labels.Stress} market={market} locale={locale} />}
        <VerdictUnknowables title={labels.Unknowables.Title} items={labels.Unknowables.Items} />
        <p className="text-[11px] leading-snug text-muted">{labels.Section.Disclaimer}</p>
      </div>
    </div>
  );
}
