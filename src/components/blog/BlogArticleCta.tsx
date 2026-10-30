import Link from "next/link";
import { BLOG_COPY } from "@/lib/blog/blogCopy";
import { ROUTES } from "@/lib/constants";
import { BlogLang } from "@/types/blog.types";

interface BlogArticleCtaProps {
  lang: BlogLang;
}

export default function BlogArticleCta({ lang }: BlogArticleCtaProps) {
  const copy = BLOG_COPY[lang] ?? BLOG_COPY.de;

  return (
    <aside className="mt-10 border-2 border-ink bg-ink p-7 text-paper-bright sm:p-9">
      <span className="inline-block bg-signal px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-paper-bright">
        {copy.ctaEyebrow}
      </span>
      <h3 className="mt-3 font-display text-2xl leading-tight text-paper-bright sm:text-3xl">
        {copy.ctaHeadline}
      </h3>
      <p className="mt-2 max-w-2xl font-serif text-base leading-relaxed text-paper">{copy.ctaSub}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={ROUTES.signup}
          className="inline-flex h-11 items-center border-2 border-signal bg-signal px-5 font-narrow text-xs font-semibold uppercase tracking-[0.08em] text-paper-bright transition-colors hover:bg-signal-deep"
        >
          {copy.primaryBtn}
        </Link>
        <Link
          href={lang === "tr" ? "/tr/icra-ihale" : "/zwangsversteigerungen"}
          className="inline-flex h-11 items-center border-2 border-paper-bright px-5 font-narrow text-xs font-semibold uppercase tracking-[0.08em] text-paper-bright transition-colors hover:bg-paper-bright hover:text-ink"
        >
          {lang === "tr" ? "81 İl İcra & İhale Veritabanı →" : "Alle 530 Amtsgerichte & Termine →"}
        </Link>
        <Link
          href={lang === "tr" ? "/tr/hesaplama/icra-ihale-teminat" : "/rechner/5-10-und-7-10-grenze"}
          className="inline-flex h-11 items-center border border-paper-bright/60 px-4 font-mono text-xs text-paper transition-colors hover:border-paper-bright hover:text-paper-bright"
        >
          {lang === "tr" ? "İcra İhale %50 & Teminat Hesaplama" : "5/10- & 7/10-Grenze Rechner"}
        </Link>
      </div>
    </aside>
  );
}
