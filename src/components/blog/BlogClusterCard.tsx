import Link from "next/link";
import { BLOG_COPY } from "@/lib/blog/blogCopy";
import { blogArticleCoverPath } from "@/lib/blog/blogSeo";
import { BlogClusterItem, BlogLang } from "@/types/blog.types";

interface BlogClusterCardProps {
  cluster: BlogClusterItem;
  lang: BlogLang;
  index: number;
}

export default function BlogClusterCard({ cluster, lang, index }: BlogClusterCardProps) {
  const entry = cluster.languages[lang] ?? cluster.languages.de;
  if (!entry) return null;

  const copy = BLOG_COPY[lang] ?? BLOG_COPY.de;
  const coverSrc = blogArticleCoverPath(cluster.clusterKey, lang);
  const dossierNo = String(index + 1).padStart(2, "0");

  return (
    <article className="group flex flex-col justify-between border-2 border-ink bg-paper-bright transition-transform duration-200 hover:-translate-y-0.5">
      <div>
        <div className="flex items-center justify-between border-b border-ink bg-paper-deep px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-ink">
          <span className="font-semibold text-signal">
            AKTE #{dossierNo} · {cluster.category}
          </span>
          <span>
            {cluster.dayKey} · {entry.readingTimeMin} {copy.min}
          </span>
        </div>

        <Link href={entry.url} className="block overflow-hidden border-b-2 border-ink bg-ink">
          <img
            src={coverSrc}
            alt={`${entry.title}${entry.focusKeyword ? ` – ${entry.focusKeyword}` : ""}`}
            width={1200}
            height={630}
            loading="lazy"
            className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </Link>

        <div className="p-6">
          <h2 className="font-display text-2xl leading-tight text-ink">
            <Link href={entry.url} className="transition-colors hover:text-signal">
              {entry.title}
            </Link>
          </h2>
          <p className="mt-3 font-serif text-base leading-relaxed text-ink-soft">{entry.excerpt}</p>
        </div>
      </div>

      <div className="border-t border-rule-strong bg-paper px-6 py-3.5">
        <Link
          href={entry.url}
          className="inline-flex items-center font-narrow text-xs font-semibold uppercase tracking-[0.08em] text-signal group-hover:underline"
        >
          {copy.read}
        </Link>
      </div>
    </article>
  );
}
