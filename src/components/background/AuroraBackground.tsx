const BLOB_BASE = "absolute rounded-full blur-[120px] will-change-transform";

/**
 * Soft, slowly drifting colour fields behind the hero. Purely decorative.
 */
export default function AuroraBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className={`${BLOB_BASE} -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 bg-iris-deep/35 animate-aurora`} />
      <div className={`${BLOB_BASE} top-20 -left-40 h-[420px] w-[520px] bg-ember/20 animate-aurora-slow`} />
      <div className={`${BLOB_BASE} top-40 -right-40 h-[420px] w-[520px] bg-lagoon/15 animate-aurora`} />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent to-canvas" />
    </div>
  );
}
