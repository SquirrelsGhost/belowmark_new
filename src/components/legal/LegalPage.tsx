import { ReactNode } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import LegalDocumentView from "@/components/legal/LegalDocumentView";
import LegalNotice from "@/components/legal/LegalNotice";
import { getLegalDocument, getLegalPageContext } from "@/lib/legal/legalPage";
import { LegalDocumentKey } from "@/translations/legal/LegalDocuments";

interface LegalPageProps {
  documentKey: LegalDocumentKey;
  after?: ReactNode;
}

/** Shared body of /impressum, /agb, /widerruf and /datenschutz. */
export default async function LegalPage({ documentKey, after }: LegalPageProps) {
  const { t, layout, lang, isApproved } = await getLegalPageContext();
  const document = getLegalDocument(documentKey);
  const notices = (
    <>
      {!isApproved && <LegalNotice title={t.Legal.DraftTitle} body={t.Legal.DraftBody} />}
      {t.Legal.LanguageNote && <LegalNotice body={t.Legal.LanguageNote} tone="ink" />}
    </>
  );
  return (
    <AuthLayout lang={lang} layout={layout}>
      <LegalDocumentView document={document} contentsLabel={t.Legal.Contents} lineLabel={layout.LineLabel} notices={notices} after={after} />
    </AuthLayout>
  );
}
