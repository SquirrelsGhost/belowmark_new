import { BLOG_COPY } from "@/lib/blog/blogCopy";
import { BlogArticleFaqItem, BlogArticleSection, BlogLang } from "@/types/blog.types";

interface BlogArticleSectionsProps {
  lang: BlogLang;
  sections: BlogArticleSection[];
  faq: BlogArticleFaqItem[];
}

export default function BlogArticleSections({ lang, sections, faq }: BlogArticleSectionsProps) {
  const copy = BLOG_COPY[lang] ?? BLOG_COPY.de;

  return (
    <div className="space-y-10 border-2 border-ink bg-paper-bright p-6 sm:p-10">
      {sections.map((sec, idx) => (
        <section key={sec.heading} className="space-y-4">
          <div className="flex items-baseline gap-3 border-b border-rule-strong pb-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-signal">
              § 0{idx + 1}
            </span>
            <h2 className="font-display text-2xl leading-tight text-ink sm:text-3xl">{sec.heading}</h2>
          </div>
          {sec.paragraphs.map((paragraph, pIdx) => (
            <p key={pIdx} className="font-serif text-lg leading-relaxed text-ink-soft">
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      {faq.length > 0 && (
        <section className="border-t-2 border-ink pt-8">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">{copy.faqTitle}</h2>
          <div className="mt-5 space-y-4">
            {faq.map((item, idx) => (
              <div key={item.q} className="border border-ink bg-paper p-5">
                <h3 className="font-narrow text-base font-semibold uppercase tracking-wide text-signal">
                  {idx + 1}. {item.q}
                </h3>
                <p className="mt-2 font-serif text-base leading-relaxed text-ink">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
