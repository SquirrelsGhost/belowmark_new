import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { generateMetadata as generateHubMetadata } from "@/app/zwangsversteigerungen/page";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return generateHubMetadata();
}

export default function ZwangsversteigerungAliasPage(): never {
  permanentRedirect("/zwangsversteigerungen");
}
