import Stamp from "@/components/ui/Stamp";
import { fill, formatMoney } from "@/lib/appFormat";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { IVerdictTranslation } from "@/translations/verdict/IVerdictTranslation";
import { Verdict } from "@/types/verdict.types";

interface VerdictHeadlineProps {
  verdict: Verdict;
  labels: IVerdictTranslation;
  market: MarketCode;
  locale: LocaleOption;
}

const STAMP_TONE = { go: "verdict", open: "ink", stop: "signal", none: "ink" } as const;

const HEADLINE_TONE = {
  go: "text-verdict",
  open: "text-ink",
  stop: "text-signal",
  none: "text-ink-soft",
} as const;

/** The verdict as the loudest line of the Aktenblatt: stamp, "bid up to X" or "do not bid", and what it rests on. */
export default function VerdictHeadline({ verdict, labels, market, locale }: VerdictHeadlineProps) {
  const noLimit = verdict.state === "open" && verdict.limit === null;
  const state = labels.States[verdict.state];
  const headline = noLimit ? labels.OpenNoLimit.Headline : fill(state.Headline, { amount: verdict.limit === null ? "—" : formatMoney(verdict.limit, market, locale) });

  return (
    <div className="flex flex-col items-start gap-3">
      <Stamp label={state.Stamp} tone={STAMP_TONE[verdict.state]} tilt="left" />
      <p className={`font-display text-4xl leading-[0.95] sm:text-5xl ${HEADLINE_TONE[verdict.state]}`}>{headline}</p>
      <p className="max-w-md text-sm leading-snug text-ink-soft">{noLimit ? labels.OpenNoLimit.Sub : state.Sub}</p>
      {verdict.state === "go" && verdict.costsUnverified && <p className="max-w-md border-l-4 border-caution bg-caution/10 px-3 py-2 text-sm leading-snug text-caution">{labels.GoUnverified}</p>}
    </div>
  );
}
