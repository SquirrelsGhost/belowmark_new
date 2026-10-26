import { BLOG_COPY } from "@/lib/blog/blogCopy";
import { blogArticleCoverPath } from "@/lib/blog/blogSeo";
import { BlogClusterItem, BlogLang } from "@/types/blog.types";

interface BlogArticleHeaderProps {
  cluster: BlogClusterItem;
  lang: BlogLang;
}

export default function BlogArticleHeader({ cluster, lang }: BlogArticleHeaderProps) {
  const entry = cluster.languages[lang] ?? cluster.languages.de;
  if (!entry) return null;

  const copy = BLOG_COPY[lang] ?? BLOG_COPY.de;
  const coverPath = blogArticleCoverPath(cluster.clusterKey, lang);
  const coverAlt = `${entry.title}${entry.focusKeyword ? ` – ${entry.focusKeyword}` : ""}`;

  return (
    <header className="mb-10">
      <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider text-muted">
        <span className="border border-ink bg-signal px-2.5 py-0.5 font-semibold text-paper-bright">
          {cluster.category}
        </span>
        <span className="text-ink-soft">belowmark.com</span>
        <span>·</span>
        <span>{cluster.dayKey}</span>
        <span>·</span>
        <span>
          {entry.readingTimeMin} {copy.min}
        </span>
      </div>

      <h1 className="mt-4 font-display text-3xl leading-[1.02] text-ink sm:text-5xl">{entry.title}</h1>

      <div className="mt-6 border-2 border-ink border-l-8 border-l-signal bg-paper-bright p-5">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-signal">
          {copy.directAnswerLabel}
        </p>
        <p className="mt-2 font-serif text-lg leading-relaxed text-ink">{entry.excerpt}</p>
      </div>

      <figure className="mt-8 overflow-hidden border-2 border-ink bg-ink">
        <img
          src={coverPath}
          alt={coverAlt}
          width={1200}
          height={630}
          loading="eager"
          className="h-auto w-full object-cover"
        />
      </figure>
    </header>
  );
}
