interface PaperTextureProps {
  className?: string;
}

const TEXTURE_CLASSES = "pointer-events-none fixed inset-0 z-[60] bg-fibre";

/** Fixed paper-fibre layer over the whole page for a printed-notice feel. */
export default function PaperTexture({ className }: PaperTextureProps = {}) {
  return <div aria-hidden="true" className={className ? `${TEXTURE_CLASSES} ${className}` : TEXTURE_CLASSES} />;
}
