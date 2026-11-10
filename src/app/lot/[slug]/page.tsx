import { Metadata } from "next";
import { generatePublicListingMetadata, renderPublicListingPage } from "@/lib/pseo/publicListingPage";

// Reads session cookie to show direct Investor Workbench button when signed in.
export const instant = false;

interface LotSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LotSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  return generatePublicListingMetadata(slug);
}

export default async function PublicLotPage({ params }: LotSlugPageProps) {
  const { slug } = await params;
  return renderPublicListingPage(slug, "/lot");
}
