"use client";

import { useEffect } from "react";

/** "/" jumps into the search field from anywhere on the page, as in most tools. */
export default function SearchHotkey({ targetId }: { targetId: string }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const active = document.activeElement;
      if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement || active instanceof HTMLSelectElement) return;
      const field = document.getElementById(targetId);
      if (!(field instanceof HTMLInputElement)) return;
      event.preventDefault();
      field.focus();
      field.select();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [targetId]);
  return null;
}
