import VerdictReasonGroup from "@/components/app/verdict/VerdictReasonGroup";
import VerdictReasonItem from "@/components/app/verdict/VerdictReasonItem";
import VerdictSourceTag from "@/components/app/verdict/VerdictSourceTag";
import { TEXT_LINK_CLASSES } from "@/lib/appStyles";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { VERDICT_ANCHORS } from "@/lib/verdict/verdictConstants";
import { REASON_ACTIONS, VERDICT_GROUPS, VerdictNames, reasonText, sourceText, sourceUrl } from "@/lib/verdict/verdictText";
import { IVerdictTranslation } from "@/translations/verdict/IVerdictTranslation";
import { VerdictReason } from "@/types/verdict.types";

interface VerdictReasonsProps {
  reasons: VerdictReason[];
  labels: IVerdictTranslation;
  names: VerdictNames;
  market: MarketCode;
  locale: LocaleOption;
  /** Links to the inputs — off in the printed file */
  withActions: boolean;
}

/** All reasons of the verdict, grouped by weight, each with its sources. */
export default function VerdictReasons({ reasons, labels, names, market, locale, withActions }: VerdictReasonsProps) {
  return (
    <div className="flex flex-col gap-6">
      {VERDICT_GROUPS.map((severity) => {
        const group = reasons.filter((reason) => reason.severity === severity);
        if (group.length === 0) return null;
        return (
          <VerdictReasonGroup key={severity} title={labels.Groups[severity]}>
            {group.map((reason, index) => {
              const action = withActions ? (reason.action ?? REASON_ACTIONS[reason.code]) : undefined;
              const tags = [...new Map(reason.sources.map((source) => [sourceText(source, labels.Sources), sourceUrl(source)])).entries()];
              return (
                <VerdictReasonItem
                  key={`${reason.code}-${reason.risk ?? ""}-${index}`}
                  severity={severity}
                  text={reasonText(reason, labels, market, locale, names)}
                  quote={reason.quote ?? null}
                  sources={tags.map(([label, href]) => (
                    <VerdictSourceTag key={label} label={label} href={href} />
                  ))}
                  action={action && <a href={`#${VERDICT_ANCHORS[action]}`} className={`${TEXT_LINK_CLASSES} ml-1 text-signal`}>{`${labels.Actions[action]} ↓`}</a>}
                />
              );
            })}
          </VerdictReasonGroup>
        );
      })}
    </div>
  );
}
