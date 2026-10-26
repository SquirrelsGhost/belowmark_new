import { Fragment } from "react";
import AuthTextLink from "@/components/auth/AuthTextLink";
import { ROUTES } from "@/lib/constants";

interface OrderTermsNoteProps {
  /** "Es gelten die {terms}. … {withdrawal} … {privacy}." */
  template: string;
  labels: { terms: string; withdrawal: string; privacy: string };
}

const HREFS = { terms: ROUTES.terms, withdrawal: ROUTES.withdrawal, privacy: ROUTES.privacy } as const;

/** The sentence that brings AGB, Widerrufsbelehrung and Datenschutz into the order, each as a link (new tab). */
export default function OrderTermsNote({ template, labels }: OrderTermsNoteProps) {
  return (
    <p className="text-sm leading-relaxed text-ink-soft">
      {template.split(/(\{terms\}|\{withdrawal\}|\{privacy\})/).map((part, index) => {
        const key = part.slice(1, -1) as keyof typeof HREFS;
        return <Fragment key={index}>{part.startsWith("{") && HREFS[key] ? <AuthTextLink href={HREFS[key]} label={labels[key]} newTab /> : part}</Fragment>;
      })}
    </p>
  );
}
