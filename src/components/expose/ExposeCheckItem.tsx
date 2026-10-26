import { EXPOSE_LAWS } from "@/lib/expose/exposeConstants";
import { ExposeCheckText } from "@/translations/expose/IExposeTranslation";
import { ExposeCheckState } from "@/types/expose.types";

interface ExposeCheckItemProps {
  check: ExposeCheckText;
  state: ExposeCheckState;
  stateLabel: string;
}

const STATE_CLASSES: Record<ExposeCheckState, string> = {
  ok: "bg-verdict text-paper-bright",
  open: "bg-signal text-paper-bright",
  hint: "border border-caution text-caution",
};

/** One check: its state, what to do, and the rule it rests on (linked where the statute is online). */
export default function ExposeCheckItem({ check, state, stateLabel }: ExposeCheckItemProps) {
  const basis = "font-mono text-[10px] text-muted";
  return (
    <li className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 border-b border-rule py-2 sm:grid-cols-[5.5rem_minmax(0,1fr)_minmax(0,10rem)]">
      <span className={`h-fit px-1.5 py-0.5 text-center font-mono text-[10px] tracking-[0.12em] uppercase ${STATE_CLASSES[state]}`}>{stateLabel}</span>
      <div className="text-[12px] leading-snug">
        <p className="font-semibold">{check.title}</p>
        <p className="text-ink-soft">{check.text}</p>
      </div>
      {check.law ? (
        <a href={EXPOSE_LAWS[check.law]} target="_blank" rel="noopener" className={`${basis} col-start-2 underline-offset-2 hover:underline sm:col-start-auto sm:text-right`}>
          {check.basis}
        </a>
      ) : (
        <span className={`${basis} col-start-2 sm:col-start-auto sm:text-right`}>{check.basis}</span>
      )}
    </li>
  );
}
