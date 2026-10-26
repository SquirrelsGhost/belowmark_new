import Icon from "@/components/ui/Icon";
import Stamp from "@/components/ui/Stamp";

interface PhotoSlotProps {
  label: string;
  href: string;
}

/**
 * Where a photo would be: an empty, hatched frame with a stamp. Stock images
 * would suggest a house we have never seen — the frame links to the original.
 */
export default function PhotoSlot({ label, href }: PhotoSlotProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group relative flex aspect-[4/3] items-center justify-center overflow-hidden border-2 border-ink bg-paper-bright bg-[repeating-linear-gradient(45deg,transparent_0_9px,var(--rule)_9px_10px)]"
    >
      <span aria-hidden="true" className="absolute inset-3 border border-dashed border-rule-strong/30" />
      <span className="flex flex-col items-center gap-3">
        <Icon name="camera" className="size-9 text-ink-soft transition-transform group-hover:scale-110" />
        <Stamp label={label} tilt="left" />
      </span>
    </a>
  );
}
