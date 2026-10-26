"use client";

import { ReactNode, useRef, useState } from "react";

interface HoverInfo {
  title: string;
  detail: string | null;
  x: number;
  y: number;
  /** Open to the left near the right edge */
  flip: boolean;
}

/**
 * Shows a small index card next to whatever region or dot the pointer (or
 * keyboard focus) is on. Reads the text from data attributes, so the map
 * itself stays server-rendered and works without JavaScript.
 */
export default function MapHoverLayer({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [info, setInfo] = useState<HoverInfo | null>(null);

  const show = (target: EventTarget | null, clientX?: number, clientY?: number) => {
    const element = target instanceof Element ? target.closest<SVGElement>("[data-title]") : null;
    const box = ref.current?.getBoundingClientRect();
    if (!element || !box) return setInfo(null);
    const rect = element.getBoundingClientRect();
    const x = (clientX ?? rect.left + rect.width / 2) - box.left;
    const y = (clientY ?? rect.top) - box.top;
    setInfo({ title: element.dataset.title ?? "", detail: element.dataset.detail ?? null, x, y, flip: x > box.width * 0.6 });
  };

  return (
    <div
      ref={ref}
      className="relative"
      onPointerMove={(event) => show(event.target, event.clientX, event.clientY)}
      onPointerLeave={() => setInfo(null)}
      onFocus={(event) => show(event.target)}
      onBlur={() => setInfo(null)}
    >
      {children}
      {info && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-10 max-w-64 border border-ink bg-paper-bright px-3 py-2 shadow-[3px_3px_0_0_var(--ink)]"
          style={{ left: info.x, top: info.y, transform: `translate(${info.flip ? "calc(-100% - 14px)" : "14px"}, -50%)` }}
        >
          <p className="font-narrow text-sm leading-tight font-bold">{info.title}</p>
          {info.detail && <p className="mt-0.5 font-mono text-[11px] text-ink-soft">{info.detail}</p>}
        </div>
      )}
    </div>
  );
}
