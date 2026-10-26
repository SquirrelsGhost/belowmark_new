/** Which hearing the bid is placed in — limits only apply to the first one. */
export type HearingKind = "first" | "followUp";

/** Legal outcome of a bid relative to the ZVG value limits. */
export type Verdict = "refused" | "contestable" | "clear" | "waived";
