import { useCallback, useMemo } from "react";
import { useStoredText } from "@/hooks/useStoredText";
import { exposeKey, holdingKey } from "@/lib/expose/exposeConstants";
import { parseExposeInputs, parseHolding } from "@/lib/expose/exposeStorage";
import { ExposeHolding, ExposeInputs } from "@/types/expose.types";

export interface ExposeState {
  inputs: ExposeInputs;
  /** The hearing result the portfolio feature stored, or null */
  holding: ExposeHolding | null;
  setInputs: (patch: Partial<ExposeInputs>) => void;
  reset: () => void;
}

/** The seller's exposé inputs from localStorage, shared live between the form and the printed sheet. */
export function useExpose(listingId: string): ExposeState {
  const [raw, write] = useStoredText(exposeKey(listingId));
  const [holdingRaw] = useStoredText(holdingKey(listingId));
  const inputs = useMemo(() => parseExposeInputs(raw), [raw]);
  const holding = useMemo(() => parseHolding(holdingRaw), [holdingRaw]);
  const setInputs = useCallback((patch: Partial<ExposeInputs>) => write(JSON.stringify({ ...inputs, ...patch })), [inputs, write]);
  const reset = useCallback(() => write(null), [write]);
  return { inputs, holding, setInputs, reset };
}
