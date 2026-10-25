/** Fixed film-grain layer above everything for a tactile, print-like finish. */
export default function GrainOverlay() {
  return <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 bg-grain mix-blend-overlay" />;
}
