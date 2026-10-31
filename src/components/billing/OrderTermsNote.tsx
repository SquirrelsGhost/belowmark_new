import { Fragment } from "react";
import AuthTextLink from "@/components/auth/AuthTextLink";
import { ROUTES } from "@/lib/constants";

interface OrderTermsNoteProps {
  /** "Es gelten die {terms}. … {withdrawal} … {privacy}." */
  template: string;
  labels: { terms: string; withdrawal: string; privacy: string };
}

const HREFS = { terms: ROUTES.terms, withdrawal: ROUTES.withdrawal, privacy: ROUTES.privacy } as const;

/** Inline sentence that turns {terms}, {withdrawal} and {privacy} placeholders into links (new tab). */
export default function OrderTermsNote({ template, labels }: OrderTermsNoteProps) {
  return (
    <>
      {template.split(/(\{terms\}|\{withdrawal\}|\{privacy\})/).map((part, index) => {
        const key = part.slice(1, -1) as keyof typeof HREFS;
        return <Fragment key={index}>{part.startsWith("{") && HREFS[key] ? <AuthTextLink href={HREFS[key]} label={labels[key]} newTab /> : part}</Fragment>;
      })}
    </>
  );
}
