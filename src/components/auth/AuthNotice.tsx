import { ReactNode } from "react";
import Stamp from "@/components/ui/Stamp";

interface AuthNoticeProps {
  stamp?: string;
  title: string;
  body: string;
  hint?: string;
  tone?: "verdict" | "signal";
  /** Follow-up action, e.g. a resend form or a link */
  children?: ReactNode;
}

/** Outcome of a form, stamped like a received application. */
export default function AuthNotice({ stamp, title, body, hint, tone = "verdict", children }: AuthNoticeProps) {
  return (
    <div role="status" className="grid gap-4">
      {stamp && (
        <div>
          <Stamp label={stamp} tone={tone} />
        </div>
      )}
      <p className="font-narrow text-2xl leading-tight font-semibold text-balance">{title}</p>
      <p className="leading-relaxed text-ink-soft">{body}</p>
      {hint && <p className="text-sm leading-relaxed text-muted">{hint}</p>}
      {children}
    </div>
  );
}
