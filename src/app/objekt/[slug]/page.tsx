import { Metadata } from "next";
import { generatePublicListingMetadata, renderPublicListingPage } from "@/lib/pseo/publicListingPage";

// Reads session cookie to show direct Investor Workbench button when signed in.
export const instant = false;

interface ObjektSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ObjektSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  return generatePublicListingMetadata(slug);
}

export default async function PublicObjektPage({ params }: ObjektSlugPageProps) {
  const { slug } = await params;
  return renderPublicListingPage(slug, "/objekt");
}
