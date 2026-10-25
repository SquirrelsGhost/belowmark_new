import HeroPreviewChart from "@/components/home/HeroPreviewChart";
import HeroPreviewRow from "@/components/home/HeroPreviewRow";

interface HeroPreviewProps {
  windowTitle: string;
  metricLabel: string;
  metricValue: string;
  metricDelta: string;
  liveLabel: string;
  rowOne: string;
  rowTwo: string;
  rowThree: string;
}

const WINDOW_DOTS = ["bg-ember/70", "bg-iris/70", "bg-lagoon/70"] as const;
const SIDEBAR_ITEMS = [80, 64, 72, 56, 68] as const;
const SIDEBAR_WIDTHS: Record<number, string> = { 80: "w-20", 64: "w-16", 72: "w-18", 56: "w-14", 68: "w-16" };

/** Decorative product window: glass frame, sidebar, metric, chart and activity feed. */
export default function HeroPreview(props: HeroPreviewProps) {
  return (
    <div className="relative mx-auto max-w-5xl text-left">
      <div aria-hidden="true" className="absolute -inset-x-10 -top-10 -bottom-20 -z-10 rounded-[3rem] bg-iris-deep/20 blur-3xl" />
      <div className="overflow-hidden rounded-3xl border-sheen shadow-[0_40px_120px_-30px_rgb(0_0_0/0.7)]">
        <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
          {WINDOW_DOTS.map((dot) => (
            <span key={dot} className={`size-2.5 rounded-full ${dot}`} />
          ))}
          <span className="mx-auto font-mono text-[11px] text-subtle">{props.windowTitle}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
          <aside aria-hidden="true" className="hidden flex-col gap-3 border-r border-line p-5 md:flex">
            {SIDEBAR_ITEMS.map((width, index) => (
              <span key={index} className={`h-2 rounded-full ${SIDEBAR_WIDTHS[width]} ${index === 0 ? "bg-ink/70" : "bg-line-strong"}`} />
            ))}
          </aside>
          <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[1.6fr_1fr]">
            <div className="rounded-2xl border border-line bg-glass p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-subtle">{props.metricLabel}</p>
                  <p className="mt-1 font-serif text-5xl tracking-tight">{props.metricValue}</p>
                  <p className="mt-1 text-xs text-lagoon">{props.metricDelta}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-lagoon/10 px-2.5 py-1 text-[11px] font-medium text-lagoon">
                  <span className="size-1.5 animate-pulse-dot rounded-full bg-lagoon" />
                  {props.liveLabel}
                </span>
              </div>
              <HeroPreviewChart />
            </div>
            <div className="flex flex-col gap-3">
              <HeroPreviewRow label={props.rowOne} accent="iris" time="2m" />
              <HeroPreviewRow label={props.rowTwo} accent="ember" time="8m" />
              <HeroPreviewRow label={props.rowThree} accent="lagoon" time="14m" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
