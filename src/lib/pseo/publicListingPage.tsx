import "server-only";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import PublicListingDetailView from "@/components/pseo/PublicListingDetailView";
import { DEFAULT_BLOG_OG } from "@/lib/blog/blogSeo";
import { buildPublicListingMeta } from "@/lib/pseo/publicListingCopy";
import { MetaTagService } from "@/services/MetaTagService";
import { FreeUnlockService } from "@/services/FreeUnlockService";
import { PublicListingService } from "@/services/PublicListingService";
import { SessionService } from "@/services/SessionService";

export async function generatePublicListingMetadata(slug: string): Promise<Metadata> {
  const item = await PublicListingService.resolveBySlug(slug);
  if (!item) {
    return { title: "Belowmark", robots: { index: false, follow: false } };
  }
  const { title, description } = buildPublicListingMeta(item);
  return MetaTagService.CreateMetaTags({
    title,
    description,
    imgUrl: DEFAULT_BLOG_OG,
    tags: [item.segmentLabel, item.cleanCity, item.authority, item.regionName].filter(Boolean),
    url: item.canonicalUrl,
  });
}

export async function renderPublicListingPage(slug: string, currentPrefix: "/objekt" | "/tr/ilan" | "/lot") {
  const item = await PublicListingService.resolveBySlug(slug);
  if (!item) {
    notFound();
  }
  const currentPath = `${currentPrefix}/${encodeURIComponent(decodeURIComponent(slug))}`;
  if (item.canonicalPath !== currentPath && item.canonicalPath !== `${currentPrefix}/${slug}`) {
    permanentRedirect(item.canonicalPath);
  }
  const user = await SessionService.getCurrentUser();
  const freeStatus = user && !user.hasFullAccess
    ? await FreeUnlockService.getStatus(user.id, item.key)
    : null;
  return (
    <BlogShell lang={item.locale}>
      <PublicListingDetailView
        item={item}
        isSignedIn={Boolean(user)}
        canClaimFreeUnlock={freeStatus?.canClaimFreeUnlock ?? false}
      />
    </BlogShell>
  );
}
