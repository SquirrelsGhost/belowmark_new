import { ReactNode } from "react";
import LegalContents from "@/components/legal/LegalContents";
import LegalPageHeader from "@/components/legal/LegalPageHeader";
import LegalSectionView from "@/components/legal/LegalSectionView";
import { LegalDocument } from "@/types/legal.types";

interface LegalDocumentViewProps {
  document: LegalDocument;
  contentsLabel: string;
  lineLabel: string;
  /** <LegalNotice /> elements above the text */
  notices?: ReactNode;
  /** Extra block after the text, e.g. the "Vertrag widerrufen" button */
  after?: ReactNode;
}

/** A legal page: header, notices, contents on the left, clauses on the right. */
export default function LegalDocumentView({ document, contentsLabel, lineLabel, notices, after }: LegalDocumentViewProps) {
  return (
    <>
      <div className="lg:col-span-12">
        <LegalPageHeader title={document.title} asOf={document.asOf} basis={document.basis} lineLabel={lineLabel} />
      </div>
      <aside className="lg:sticky lg:top-24 lg:col-span-3">
        <LegalContents label={contentsLabel} sections={document.sections} />
      </aside>
      <article lang="de" className="grid max-w-3xl gap-10 lg:col-span-8 lg:col-start-5">
        {notices && <div className="grid gap-3">{notices}</div>}
        {document.sections.map((section) => (
          <LegalSectionView key={section.id} section={section} />
        ))}
        {after}
      </article>
    </>
  );
}
