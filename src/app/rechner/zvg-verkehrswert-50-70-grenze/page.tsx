import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { generateMetadata as generateCalcMetadata } from "@/app/rechner/5-10-und-7-10-grenze/page";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return generateCalcMetadata();
}

export default function ZvgRechnerAliasPage(): never {
  permanentRedirect("/rechner/5-10-und-7-10-grenze");
}
