// Needs state for show/hide, Caps Lock detection and the live strength meter
"use client";

import { KeyboardEvent, ReactNode, useEffect, useRef, useState } from "react";
import AuthIcon from "@/components/auth/AuthIcon";
import FieldMessages from "@/components/auth/FieldMessages";
import PasswordStrength from "@/components/auth/PasswordStrength";
import { describedBy, FIELD_INPUT_CLASSES, FIELD_LABEL_CLASSES } from "@/lib/auth/fieldStyles";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";

interface PasswordFieldProps {
  id: string;
  name: string;
  label: string;
  number: string;
  /** "current-password" for sign-in, "new-password" wherever a password is chosen */
  autoComplete: "current-password" | "new-password";
  fields: IAuthTranslation["Fields"];
  hint?: string;
  error?: string;
  /** Shows the strength meter (new passwords only) */
  withStrength?: boolean;
  aside?: ReactNode;
}

const TOGGLE_CLASSES =
  "absolute inset-y-0 right-0 flex w-12 items-center justify-center text-ink-soft transition-colors hover:text-ink focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-signal";

/** Password input with visibility toggle, Caps Lock warning and optional strength meter. */
export default function PasswordField({ id, name, label, number, autoComplete, fields, hint, error, withStrength = false, aside }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // React resets the form after each submit — keep the meter in step with the empty field.
  useEffect(() => {
    const form = inputRef.current?.form;
    const clear = () => setValue("");
    form?.addEventListener("reset", clear);
    return () => form?.removeEventListener("reset", clear);
  }, []);

  const checkCaps = (event: KeyboardEvent<HTMLInputElement>) => setCapsLock(event.getModifierState("CapsLock"));
  const capsId = `${id}-caps`;
  const strengthId = `${id}-strength`;

  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={FIELD_LABEL_CLASSES}>
          <span className="text-signal">{number}</span> {label}
        </label>
        {aside}
      </div>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          spellCheck={false}
          autoCapitalize="none"
          maxLength={128}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={checkCaps}
          onKeyUp={checkCaps}
          onBlur={() => setCapsLock(false)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error, [capsLock && capsId, withStrength && strengthId].filter(Boolean).join(" ") || undefined)}
          className={`${FIELD_INPUT_CLASSES} pr-12`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? fields.HidePassword : fields.ShowPassword}
          aria-pressed={visible}
          aria-controls={id}
          className={TOGGLE_CLASSES}
        >
          <AuthIcon name={visible ? "eyeOff" : "eye"} className="size-5" />
        </button>
      </div>
      {capsLock && (
        <p id={capsId} role="status" className="font-mono text-[11px] tracking-wider text-caution uppercase">
          ⇪ {fields.CapsLock}
        </p>
      )}
      {withStrength && <PasswordStrength id={strengthId} password={value} strength={fields.Strength} />}
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  );
}
