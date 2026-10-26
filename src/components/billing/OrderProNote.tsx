import AuthTextLink from "@/components/auth/AuthTextLink";

interface OrderProNoteProps {
  title: string;
  body: string;
  cta: string;
  href: string;
}

/** Pro is agreed in person, so it gets a contact line instead of a price button. */
export default function OrderProNote({ title, body, cta, href }: OrderProNoteProps) {
  return (
    <aside className="mt-8 max-w-md border-2 border-dashed border-ink/50 p-5">
      <p className="font-narrow text-lg font-semibold">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
      <p className="mt-3">
        <AuthTextLink href={href} label={cta} />
      </p>
    </aside>
  );
}
