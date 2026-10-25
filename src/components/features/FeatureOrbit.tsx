import Icon, { IconName } from "@/components/ui/Icon";

const ORBIT_ICONS: IconName[] = ["globe", "plug", "chart", "users", "bolt"];

/** Row of connected integration nodes. */
export default function FeatureOrbit() {
  return (
    <div aria-hidden="true" className="relative flex items-center justify-between">
      <span className="absolute inset-x-4 top-1/2 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      {ORBIT_ICONS.map((icon) => (
        <span
          key={icon}
          className="relative grid size-12 place-items-center rounded-2xl border border-line-strong bg-canvas-raised text-muted transition-colors duration-300 group-hover:text-ink"
        >
          <Icon name={icon} className="size-5" />
        </span>
      ))}
    </div>
  );
}
