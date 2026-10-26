// Rebuilds the verdict from the figures and answers the bidder stored on the Aktenblatt
"use client";

import { useMemo } from "react";
import VerdictHeadline from "@/components/app/verdict/VerdictHeadline";
import VerdictReasons from "@/components/app/verdict/VerdictReasons";
import VerdictStressTest from "@/components/app/verdict/VerdictStressTest";
import { useStoredText } from "@/hooks/useStoredText";
import { inputsKey, parseInputs } from "@/lib/bidding/biddingStorage";
import { LocaleOption } from "@/lib/constants";
import { buildVerdict } from "@/lib/verdict/buildVerdict";
import { parseVerdictAnswers } from "@/lib/verdict/verdictAnswers";
import { verdictAnswersKey } from "@/lib/verdict/verdictConstants";
import { VerdictNames } from "@/lib/verdict/verdictText";
import { IVerdictTranslation } from "@/translations/verdict/IVerdictTranslation";
import { BidContext } from "@/types/bidding.types";
import { VerdictEvidence } from "@/types/verdict.types";

interface BidderFileVerdictProps {
  listingId: string;
  evidence: VerdictEvidence;
  context: BidContext | null;
  labels: IVerdictTranslation;
  names: VerdictNames;
  locale: LocaleOption;
}

/** The verdict on paper: headline, reasons with their sources, stress test — no inputs. */
export default function BidderFileVerdict({ listingId, evidence, context, labels, names, locale }: BidderFileVerdictProps) {
  const [rawInputs] = useStoredText(inputsKey(listingId));
  const [rawAnswers] = useStoredText(verdictAnswersKey(listingId));
  const verdict = useMemo(
    () => buildVerdict(evidence, context, parseInputs(rawInputs), parseVerdictAnswers(rawAnswers)),
    [evidence, context, rawInputs, rawAnswers],
  );

  return (
    <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6">
      <div className="flex flex-col gap-4">
        <VerdictHeadline verdict={verdict} labels={labels} market={evidence.market} locale={locale} />
        {verdict.stress.length > 0 && <VerdictStressTest cases={verdict.stress} labels={labels.Stress} market={evidence.market} locale={locale} />}
        <p className="text-[11px] leading-snug text-muted">{labels.Section.Disclaimer}</p>
      </div>
      <VerdictReasons reasons={verdict.reasons} labels={labels} names={names} market={evidence.market} locale={locale} withActions={false} />
    </div>
  );
}
