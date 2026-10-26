interface StampProps {
  label: string;
  tone?: "signal" | "ink" | "verdict";
  /** Tilt for a hand-stamped feel */
  tilt?: "left" | "right" | "none";
}

const TONE_CLASSES: Record<NonNullable<StampProps["tone"]>, string> = {
  signal: "border-signal text-signal",
  ink: "border-ink text-ink",
  verdict: "border-verdict text-verdict",
};

const TILT_CLASSES: Record<NonNullable<StampProps["tilt"]>, string> = {
  left: "-rotate-6",
  right: "rotate-[4deg]",
  none: "",
};

/** Rubber-stamp label with a double border. */
export default function Stamp({ label, tone = "signal", tilt = "left" }: StampProps) {
  return (
    <span
      className={`inline-flex items-center border-2 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-[0.18em] uppercase outline outline-1 outline-offset-2 outline-current/50 ${TONE_CLASSES[tone]} ${TILT_CLASSES[tilt]}`}
    >
      {label}
    </span>
  );
}
