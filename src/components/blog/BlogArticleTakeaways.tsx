import { BLOG_COPY } from "@/lib/blog/blogCopy";
import { BlogLang } from "@/types/blog.types";

interface BlogArticleTakeawaysProps {
  lang: BlogLang;
  takeaways: string[];
}

export default function BlogArticleTakeaways({ lang, takeaways }: BlogArticleTakeawaysProps) {
  if (takeaways.length === 0) return null;
  const copy = BLOG_COPY[lang] ?? BLOG_COPY.de;

  return (
    <section className="mb-10 border-2 border-ink bg-paper-deep p-6">
      <h2 className="font-display text-xl tracking-tight text-ink">{copy.takeawaysTitle}</h2>
      <ul className="mt-4 space-y-2.5 border-t border-rule-strong pt-4 font-serif text-base leading-relaxed text-ink">
        {takeaways.map((item, idx) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-0.5 shrink-0 border border-ink bg-signal px-1.5 py-0.2 font-mono text-[11px] font-semibold text-paper-bright">
              0{idx + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
