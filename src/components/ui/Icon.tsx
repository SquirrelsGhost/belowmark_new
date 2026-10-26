/**
 * Minimal inline icon set (24×24, stroke-based). Keeps the bundle free of an
 * icon library while staying consistent in weight and style.
 */
const ICON_PATHS = {
  arrowRight: "M4 12h15M13 6l6 6-6 6",
  arrowUpRight: "M7 17 17 7M8 7h9v9",
  check: "m4 12.5 5 5L20 6.5",
  cross: "M6 6l12 12M18 6 6 18",
  plus: "M12 5v14M5 12h14",
  file: "M14 3H6v18h12V7l-4-4Zm0 0v4h4",
  scale: "M12 4v16M5 20h14M4 8h16M7 8l-3 7h6L7 8Zm10 0-3 7h6l-3-7Z",
  list: "M9 6h11M9 12h11M9 18h11M4 6h1M4 12h1M4 18h1",
  map: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14",
  pin: "M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11Zm0-9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  camera: "M4 8h3l2-3h6l2 3h3v11H4V8Zm8 9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
  calendar: "M4 6h16v14H4V6Zm0 4h16M8 3v4m8-4v4",
} as const;

export type IconName = keyof typeof ICON_PATHS;

interface IconProps {
  name: IconName;
  className?: string;
}

export default function Icon({ name, className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      className={className}
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}
