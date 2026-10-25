interface HeroPreviewRowProps {
  label: string;
  time: string;
  accent: "iris" | "ember" | "lagoon";
}

const ACCENT_CLASSES: Record<HeroPreviewRowProps["accent"], string> = {
  iris: "bg-iris/15 text-iris",
  ember: "bg-ember/15 text-ember",
  lagoon: "bg-lagoon/15 text-lagoon",
};

/** Single activity entry in the hero product preview. */
export default function HeroPreviewRow({ label, time, accent }: HeroPreviewRowProps) {
  return (
    <div className="flex flex-1 items-center gap-3 rounded-2xl border border-line bg-glass p-4">
      <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${ACCENT_CLASSES[accent]}`}>
        <span className="size-2 rounded-full bg-current" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{label}</p>
        <span aria-hidden="true" className="mt-1.5 block h-1.5 w-2/3 rounded-full bg-line-strong" />
      </div>
      <span className="font-mono text-[11px] text-subtle">{time}</span>
    </div>
  );
}
