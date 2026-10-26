import { Fragment } from "react";
import AuthCheckbox from "@/components/auth/AuthCheckbox";
import AuthTextLink from "@/components/auth/AuthTextLink";
import { ROUTES } from "@/lib/constants";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";

interface TermsConsentProps {
  fields: IAuthTranslation["Fields"];
  defaultChecked?: boolean;
  error?: string;
}

/** Consent checkbox; "{terms}" and "{privacy}" in the sentence become links (new tab). */
export default function TermsConsent({ fields, defaultChecked, error }: TermsConsentProps) {
  const links: Record<string, { href: string; label: string }> = {
    terms: { href: ROUTES.terms, label: fields.TermsLink },
    privacy: { href: ROUTES.privacy, label: fields.PrivacyLink },
  };
  const parts = fields.Terms.split(/(\{terms\}|\{privacy\})/);

  return (
    <AuthCheckbox id="signup-terms" name="terms" required defaultChecked={defaultChecked} error={error}>
      {parts.map((part, index) => {
        const link = links[part.slice(1, -1)];
        return <Fragment key={index}>{link ? <AuthTextLink href={link.href} label={link.label} newTab /> : part}</Fragment>;
      })}
    </AuthCheckbox>
  );
}
