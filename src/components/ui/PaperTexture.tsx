/** Fixed paper-fibre layer over the whole page for a printed-notice feel. */
export default function PaperTexture() {
  return <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] bg-fibre" />;
}
