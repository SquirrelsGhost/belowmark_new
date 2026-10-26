import { ReactNode } from "react";
import { BlogLang } from "@/types/blog.types";

interface BlogHubSectionProps {
  lang: BlogLang;
  children: ReactNode;
}

export default function BlogHubSection({ lang, children }: BlogHubSectionProps) {
  const isRtl = lang === "ar";

  return (
    <section dir={isRtl ? "rtl" : "ltr"} className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
      {children}
    </section>
  );
}
