import { RefObject, useEffect } from "react";
import { AuthFormState } from "@/types/auth.types";

/**
 * After a failed submit, moves focus to the first invalid field — or to the
 * error summary when the problem is form-wide — so keyboard and screen-reader
 * users land exactly where the fix is needed.
 */
export function useFocusFirstError(formRef: RefObject<HTMLFormElement | null>, state: AuthFormState): void {
  useEffect(() => {
    if (state.status !== "error") return;
    const form = formRef.current;
    const target = form?.querySelector<HTMLElement>('[aria-invalid="true"]') ?? form?.querySelector<HTMLElement>("[data-error-summary]");
    target?.focus();
  }, [formRef, state]);
}
