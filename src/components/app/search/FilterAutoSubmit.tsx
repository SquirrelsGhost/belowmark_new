// Listens to change events of the surrounding form to apply filters without a click
"use client";

import { useEffect, useRef } from "react";

/** Text fields wait this long after the last keystroke before searching. */
const TYPING_DELAY_MS = 450;

interface FilterAutoSubmitProps {
  className?: string;
}

/** Invisible helper: submits the parent form whenever a filter changes. */
export default function FilterAutoSubmit({ className }: FilterAutoSubmitProps = {}) {
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const form = anchor.current?.closest("form");
    if (!form) return;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const submitSoon = (event: Event) => {
      const target = event.target as HTMLInputElement;
      clearTimeout(timer);
      const delay = event.type === "input" && target.type === "search" ? TYPING_DELAY_MS : 0;
      timer = setTimeout(() => form.requestSubmit(), delay);
    };
    const onInput = (event: Event) => {
      if ((event.target as HTMLInputElement).type === "search") submitSoon(event);
    };
    const onChange = (event: Event) => {
      if ((event.target as HTMLInputElement).type !== "search") submitSoon(event);
    };

    form.addEventListener("input", onInput);
    form.addEventListener("change", onChange);
    return () => {
      clearTimeout(timer);
      form.removeEventListener("input", onInput);
      form.removeEventListener("change", onChange);
    };
  }, []);

  return <span ref={anchor} className={className} hidden />;
}
