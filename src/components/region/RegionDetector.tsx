// Needs the browser time zone, which only exists on the client
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MarketCode, TURKEY_TIME_ZONE } from "@/lib/constants";
import { setDetectedCountryAction } from "@/lib/regionActions";

interface RegionDetectorProps {
  /** Country the server rendered with */
  country: MarketCode;
}

/**
 * Fallback when the host sends no geo header: reads the time zone once per
 * page load and, if it points to another country, stores it and re-renders.
 * A phone on automatic time zone therefore switches on arrival in Turkey.
 */
export default function RegionDetector({ country }: RegionDetectorProps) {
  const router = useRouter();

  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    const detected: MarketCode = TURKEY_TIME_ZONE.test(timeZone) ? "TR" : "DE";
    if (detected === country) return;
    setDetectedCountryAction(detected).then(() => router.refresh());
  }, [country, router]);

  return null;
}
