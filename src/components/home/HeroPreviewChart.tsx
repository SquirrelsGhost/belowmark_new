const LINE_PATH = "M0 110 C40 100 60 70 100 76 S160 112 200 88 S260 30 300 42 S360 70 400 22";
const AREA_PATH = `${LINE_PATH} L400 140 L0 140 Z`;
const GRID_LINES = [35, 70, 105] as const;

/** Smooth area chart drawn in SVG — no chart library needed for a decorative preview. */
export default function HeroPreviewChart() {
  return (
    <svg viewBox="0 0 400 140" className="mt-6 h-36 w-full" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <linearGradient id="hero-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--iris)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--iris)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hero-line" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="var(--iris)" />
          <stop offset="60%" stopColor="var(--ember)" />
          <stop offset="100%" stopColor="var(--lagoon)" />
        </linearGradient>
      </defs>
      {GRID_LINES.map((y) => (
        <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="var(--line)" strokeDasharray="3 5" />
      ))}
      <path d={AREA_PATH} fill="url(#hero-area)" />
      <path d={LINE_PATH} fill="none" stroke="url(#hero-line)" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx="400" cy="22" r="4" fill="var(--lagoon)" />
    </svg>
  );
}
