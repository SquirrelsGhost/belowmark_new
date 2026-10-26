interface AuthErrorSummaryProps {
  title: string;
  message: string;
}

/**
 * Form-wide error, announced immediately (role="alert") and focusable so
 * useFocusFirstError can move the keyboard here.
 */
export default function AuthErrorSummary({ title, message }: AuthErrorSummaryProps) {
  return (
    <div role="alert" tabIndex={-1} data-error-summary className="border-l-4 border-signal bg-signal/[0.07] px-4 py-3 outline-none focus-visible:outline-2 focus-visible:outline-signal">
      <p className="font-mono text-[11px] font-semibold tracking-[0.14em] text-signal-deep uppercase">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink">{message}</p>
    </div>
  );
}
