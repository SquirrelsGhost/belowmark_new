interface FieldMessagesProps {
  id: string;
  hint?: string;
  error?: string;
}

/** Error first (it matters more), hint below. */
export default function FieldMessages({ id, hint, error }: FieldMessagesProps) {
  return (
    <>
      {error && (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-sm leading-snug font-medium text-signal-deep">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="mt-0.5 size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 7v6m0 3.5v.01M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z" />
          </svg>
          {error}
        </p>
      )}
      {hint && <p id={`${id}-hint`} className="text-xs leading-relaxed text-muted">{hint}</p>}
    </>
  );
}
