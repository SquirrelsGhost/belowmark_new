import Button from "@/components/ui/Button";

interface TeamProPanelProps {
  title: string;
  body: string;
  cta: string;
  /** mailto link with subject */
  href: string;
}

/** Why the viewer cannot create a team yet — Pro is agreed individually, so the button writes a mail. */
export default function TeamProPanel({ title, body, cta, href }: TeamProPanelProps) {
  return (
    <section aria-label={title} className="flex flex-col items-start gap-4 border-2 border-dashed border-ink bg-hatch p-6">
      <h2 className="font-display text-3xl">{title}</h2>
      <p className="max-w-xl text-sm leading-relaxed text-ink-soft">{body}</p>
      <Button label={cta} href={href} variant="signal" withArrow />
    </section>
  );
}
