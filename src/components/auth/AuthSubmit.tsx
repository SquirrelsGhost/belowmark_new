// Reads the pending state of the surrounding form
"use client";

import { useFormStatus } from "react-dom";
import Button from "@/components/ui/Button";

interface AuthSubmitProps {
  label: string;
  pendingLabel: string;
  variant?: "ink" | "signal" | "outline";
}

/** Full-width submit that says what is happening while the server works. */
export default function AuthSubmit({ label, pendingLabel, variant = "ink" }: AuthSubmitProps) {
  const { pending } = useFormStatus();
  return (
    <div aria-live="polite" aria-busy={pending}>
      <Button type="submit" label={pending ? pendingLabel : label} variant={variant} size="lg" fullWidth withArrow={!pending} disabled={pending} />
    </div>
  );
}
