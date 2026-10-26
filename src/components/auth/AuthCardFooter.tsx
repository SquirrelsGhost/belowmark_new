import AuthTextLink from "@/components/auth/AuthTextLink";

interface AuthCardFooterProps {
  question?: string;
  href: string;
  label: string;
}

/** "No account yet? Sign up" — the tear-off strip of the card. */
export default function AuthCardFooter({ question, href, label }: AuthCardFooterProps) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-ink-soft">
      {question && <span>{question}</span>}
      <AuthTextLink href={href} label={label} />
    </p>
  );
}
