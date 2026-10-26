import { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { legalMetadata } from "@/lib/legal/legalPage";

// This page reads request-time data (cookies/headers) for locale detection.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata((t) => t.Meta.Terms);
}

export default function TermsPage() {
  return <LegalPage documentKey="terms" />;
}
