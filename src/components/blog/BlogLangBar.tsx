import Link from "next/link";
import { BLOG_LANG_SWITCH } from "@/lib/blog/blogCopy";
import { BlogClusterItem, BlogLang } from "@/types/blog.types";

interface BlogLangBarProps {
  lang: BlogLang;
  backHref?: string;
  backLabel?: string;
  cluster?: BlogClusterItem;
}

const ACTIVE_LINK_CLASS =
  "border-2 border-ink bg-signal px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-paper-bright";
const INACTIVE_LINK_CLASS =
  "border border-rule-strong bg-paper-bright px-3 py-1 font-mono text-xs font-medium uppercase tracking-wider text-ink-soft transition-colors hover:border-ink hover:bg-ink hover:text-paper-bright";

export default function BlogLangBar({ lang, backHref, backLabel, cluster }: BlogLangBarProps) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-4">
      {backHref && backLabel ? (
        <Link
          href={backHref}
          className="font-mono text-xs font-semibold uppercase tracking-wider text-signal hover:underline"
        >
          {backLabel}
        </Link>
      ) : (
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
          BELOWMARK · DE / TR / EN / AR / RU
        </span>
      )}

      <nav aria-label="Sprachauswahl" className="flex flex-wrap items-center gap-1.5">
        {BLOG_LANG_SWITCH.map((item) => {
          const targetHref = cluster ? (cluster.languages[item.code]?.url ?? item.href) : item.href;
          const isCurrent = item.code === lang;
          return (
            <Link
              key={item.code}
              href={targetHref}
              className={isCurrent ? ACTIVE_LINK_CLASS : INACTIVE_LINK_CLASS}
            >
              {item.flag} · {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
