import { TeamStatus } from "@/lib/team/teamConfig";

/** Colour of each team status: work in progress ink, visit amber, bid green, dropped grey. */
export const STATUS_TONES: Record<TeamStatus, { text: string; dot: string; border: string }> = {
  pruefen: { text: "text-ink", dot: "bg-ink", border: "border-ink" },
  besichtigen: { text: "text-caution", dot: "bg-caution", border: "border-caution" },
  bieten: { text: "text-verdict", dot: "bg-verdict", border: "border-verdict" },
  verworfen: { text: "text-muted", dot: "bg-muted", border: "border-muted" },
};

export const SMALL_BUTTON_CLASSES =
  "h-8 cursor-pointer border px-3 font-narrow text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors disabled:cursor-default disabled:opacity-60";

export const BUTTON_TONES = {
  ink: "border-ink bg-ink text-paper-bright",
  plain: "border-rule-strong bg-paper-bright text-ink hover:border-ink",
  danger: "border-transparent text-signal hover:border-signal",
} as const;

export type ButtonTone = keyof typeof BUTTON_TONES;

export const SUBMIT_CLASSES =
  "h-10 cursor-pointer bg-ink px-4 font-narrow text-xs font-semibold tracking-[0.1em] text-paper-bright uppercase shadow-[3px_3px_0_0_var(--signal)] disabled:opacity-60";

export const PANEL_CLASSES = "border-2 border-ink bg-paper-bright p-5";
