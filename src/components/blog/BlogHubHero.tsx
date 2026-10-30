import { BLOG_COPY } from "@/lib/blog/blogCopy";
import { BlogLang } from "@/types/blog.types";

interface BlogHubHeroProps {
  lang: BlogLang;
  totalArticlesCount: number;
}

export default function BlogHubHero({ lang, totalArticlesCount }: BlogHubHeroProps) {
  const copy = BLOG_COPY[lang] ?? BLOG_COPY.de;

  return (
    <header className="mb-12 border-b-2 border-ink pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-signal">
          <span className="inline-block size-2 bg-signal" />
          {copy.dateline}
        </span>
        <span className="border border-ink bg-paper-bright px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink">
          {totalArticlesCount} {copy.dossiersCountLabel}
        </span>
      </div>

      <h1 className="mt-4 font-display text-4xl leading-[0.96] tracking-tight text-ink sm:text-6xl">
        <span className="block">{copy.defaultH1Top}</span>
        <span className="mt-2 block border-t-4 border-signal pt-2 text-signal">{copy.defaultH1Below}</span>
      </h1>

      <p className="mt-5 max-w-3xl font-serif text-lg leading-relaxed text-ink-soft">{copy.sub}</p>
    </header>
  );
}
