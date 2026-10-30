// Uses the Clipboard API and a short "copied" state
"use client";

import { useEffect, useRef, useState } from "react";

interface CopyButtonProps {
  text: string;
  label: string;
  copiedLabel: string;
}

const RESET_MS = 1800;

/** Copies e.g. the file number — needed on the court portal and when calling the court. */
export default function CopyButton({ text, label, copiedLabel }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      setCopied(true);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setCopied(false);
      }, RESET_MS);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-11 cursor-pointer items-center gap-2 border border-rule-strong bg-paper-bright px-3 font-narrow text-xs font-semibold tracking-[0.08em] uppercase hover:border-ink"
    >
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
