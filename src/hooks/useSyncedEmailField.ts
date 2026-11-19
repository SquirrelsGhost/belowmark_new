import { RefObject, useCallback, useEffect, useState } from "react";

const AUTOFILL_POLL_DELAYS_MS = [0, 120, 500, 1200] as const;

function readEmailInputValue(form: HTMLFormElement | null): string {
  if (!form) return "";
  const el = form.elements.namedItem("email");
  return el instanceof HTMLInputElement ? el.value : "";
}

/**
 * Keeps an auth form's e-mail state in sync across:
 * 1. URL `initialEmail` prefill
 * 2. Server Action `stateEmail` return value (purely derived when untouched)
 * 3. Silent browser / password-manager autofill on mount or focus
 * 4. Direct user typing / pasting
 */
export function useSyncedEmailField(
  formRef: RefObject<HTMLFormElement | null>,
  initialEmail?: string,
  stateEmail?: string,
) {
  const [typedEmail, setTypedEmail] = useState<string>(initialEmail ?? "");
  const [touched, setTouched] = useState<boolean>(Boolean(initialEmail));

  const setEmail = useCallback((next: string) => {
    setTouched(true);
    setTypedEmail(next);
  }, []);

  const syncFromDom = useCallback(() => {
    const domValue = readEmailInputValue(formRef.current).trim();
    if (domValue) {
      setTypedEmail((prev) => (prev.trim() ? prev : domValue));
    }
  }, [formRef]);

  useEffect(() => {
    const timers = AUTOFILL_POLL_DELAYS_MS.map((ms) => setTimeout(syncFromDom, ms));
    const form = formRef.current;
    form?.addEventListener("focusin", syncFromDom);
    form?.addEventListener("change", syncFromDom);
    form?.addEventListener("animationstart", syncFromDom);
    return () => {
      for (const timer of timers) clearTimeout(timer);
      form?.removeEventListener("focusin", syncFromDom);
      form?.removeEventListener("change", syncFromDom);
      form?.removeEventListener("animationstart", syncFromDom);
    };
  }, [formRef, syncFromDom]);

  const email = touched ? typedEmail : typedEmail || stateEmail || "";

  const readLiveEmail = useCallback((): string => {
    const domValue = readEmailInputValue(formRef.current).trim();
    return domValue || email.trim() || stateEmail?.trim() || initialEmail?.trim() || "";
  }, [formRef, email, stateEmail, initialEmail]);

  return { email, setEmail, readLiveEmail };
}
