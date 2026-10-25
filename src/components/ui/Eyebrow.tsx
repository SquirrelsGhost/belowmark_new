interface EyebrowProps {
  label: string;
  /** Shows a pulsing status dot before the label */
  withDot?: boolean;
}

const EYEBROW_CLASSES =
  "inline-flex items-center gap-2 rounded-full border border-line-strong bg-glass px-3.5 py-1.5 text-xs font-medium tracking-wide text-muted backdrop-blur-xl";

/** Small pill label placed above headlines. */
export default function Eyebrow({ label, withDot = false }: EyebrowProps) {
  return (
    <span className={EYEBROW_CLASSES}>
      {withDot && (
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-pulse-dot rounded-full bg-lagoon" />
          <span className="relative inline-flex size-1.5 rounded-full bg-lagoon" />
        </span>
      )}
      {label}
    </span>
  );
}
