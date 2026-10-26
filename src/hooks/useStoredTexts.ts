import { useMemo, useSyncExternalStore } from "react";

/** Same event useStoredText fires after a write in this tab. */
const CHANGE_EVENT = "belowmark:stored-text";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function read(key: string): string {
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

/**
 * Many localStorage texts at once, live like useStoredText — for views that add
 * up several proceedings. The snapshot is one string, so React sees a change only
 * when a stored value really changed. The server and first paint see "" for each.
 */
export function useStoredTexts(keys: string[]): string[] {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => JSON.stringify(keys.map(read)),
    () => "",
  );
  return useMemo(() => (snapshot ? (JSON.parse(snapshot) as string[]) : keys.map(() => "")), [snapshot, keys]);
}
