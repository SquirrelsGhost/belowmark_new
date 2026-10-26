import { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import WithdrawalCallout from "@/components/consumer/WithdrawalCallout";
import { legalMetadata } from "@/lib/legal/legalPage";

// This page reads request-time data (cookies/headers) for locale detection.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata((t) => t.Meta.Withdrawal);
}

export default function WithdrawalPage() {
  return <LegalPage documentKey="withdrawal" after={<WithdrawalCallout />} />;
}
