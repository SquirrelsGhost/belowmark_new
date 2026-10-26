import { useCallback, useSyncExternalStore } from "react";

/** Fired on this tab after a write — the storage event only reaches other tabs. */
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
 * A text kept in localStorage under `key`, shared live between every component
 * (and tab) that reads the same key. The server and first paint see "".
 */
export function useStoredText(key: string): [string, (next: string | null) => void] {
  const value = useSyncExternalStore(subscribe, () => read(key), () => "");
  const write = useCallback(
    (next: string | null) => {
      try {
        if (next === null) window.localStorage.removeItem(key);
        else window.localStorage.setItem(key, next);
      } catch {
        // Private mode: the value simply is not kept.
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [key],
  );
  return [value, write];
}
