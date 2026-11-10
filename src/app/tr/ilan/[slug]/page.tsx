import { Metadata } from "next";
import { generatePublicListingMetadata, renderPublicListingPage } from "@/lib/pseo/publicListingPage";

// Reads session cookie to show direct Investor Workbench button when signed in.
export const instant = false;

interface TrIlanSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TrIlanSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  return generatePublicListingMetadata(slug);
}

export default async function PublicTrIlanPage({ params }: TrIlanSlugPageProps) {
  const { slug } = await params;
  return renderPublicListingPage(slug, "/tr/ilan");
}
