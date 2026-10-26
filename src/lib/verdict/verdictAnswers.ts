import { EMPTY_VERDICT_ANSWERS, VERDICT_OPTIONS } from "@/lib/verdict/verdictConstants";
import { VerdictAnswerKey, VerdictAnswers } from "@/types/verdict.types";

/** Reads the stored answers — anything unknown or malformed stays unanswered, never guessed. */
export function parseVerdictAnswers(raw: string): VerdictAnswers {
  const answers: VerdictAnswers = { ...EMPTY_VERDICT_ANSWERS };
  if (!raw) return answers;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return answers;
  }
  if (!data || typeof data !== "object") return answers;
  for (const key of Object.keys(VERDICT_OPTIONS) as VerdictAnswerKey[]) {
    const value = (data as Record<string, unknown>)[key];
    if ((VERDICT_OPTIONS[key] as string[]).includes(value as string)) (answers as Record<VerdictAnswerKey, unknown>)[key] = value;
  }
  return answers;
}

export const hasAnyAnswer = (answers: VerdictAnswers): boolean => Object.values(answers).some((value) => value !== null);
