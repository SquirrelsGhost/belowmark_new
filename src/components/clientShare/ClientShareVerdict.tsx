import VerdictHeadline from "@/components/app/verdict/VerdictHeadline";
import VerdictReasons from "@/components/app/verdict/VerdictReasons";
import VerdictStressTest from "@/components/app/verdict/VerdictStressTest";
import { EMPTY_BID_INPUTS } from "@/lib/bidding/biddingConstants";
import { LocaleOption } from "@/lib/constants";
import { buildVerdict } from "@/lib/verdict/buildVerdict";
import { EMPTY_VERDICT_ANSWERS } from "@/lib/verdict/verdictConstants";
import { VerdictNames } from "@/lib/verdict/verdictText";
import { IVerdictTranslation } from "@/translations/verdict/IVerdictTranslation";
import { ClientSharePayload } from "@/types/clientShare.types";
import { VerdictEvidence } from "@/types/verdict.types";

interface ClientShareVerdictProps {
  payload: ClientSharePayload;
  evidence: VerdictEvidence;
  labels: IVerdictTranslation;
  names: VerdictNames;
  locale: LocaleOption;
}

/** The verdict as it stood when the link was made: same rules as the Aktenblatt, frozen figures, no input links. */
export default function ClientShareVerdict({ payload, evidence, labels, names, locale }: ClientShareVerdictProps) {
  const verdict = buildVerdict(evidence, payload.context, payload.bidInputs ?? EMPTY_BID_INPUTS, payload.answers ?? EMPTY_VERDICT_ANSWERS);
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] print:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="flex flex-col gap-4">
        <VerdictHeadline verdict={verdict} labels={labels} market={evidence.market} locale={locale} />
        {verdict.stress.length > 0 && <VerdictStressTest cases={verdict.stress} labels={labels.Stress} market={evidence.market} locale={locale} />}
        <p className="text-[11px] leading-snug text-muted">{labels.Section.Disclaimer}</p>
      </div>
      <VerdictReasons reasons={verdict.reasons} labels={labels} names={names} market={evidence.market} locale={locale} withActions={false} />
    </div>
  );
}
