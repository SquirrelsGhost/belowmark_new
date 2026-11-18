// Needs the browser IANA time zone, which only exists on the client
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { detectCountryFromTimeZone } from "@/lib/regionLocale";
import { setDetectedCountryAction } from "@/lib/regionActions";

interface RegionDetectorProps {
  /** 2-letter ISO country code the server rendered with (null when fell back to global English) */
  country: string | null;
}

/**
 * Fallback when the host sends no Geo-IP header: reads the browser IANA time zone
 * once per page load and, if physical location differs from what SSR assumed,
 * stores the 2-letter country code and refreshes into that country's language.
 */
export default function RegionDetector({ country }: RegionDetectorProps) {
  const router = useRouter();

  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    const detected = detectCountryFromTimeZone(timeZone);
    if (!detected) return;
    if (detected === country) return;
    if (country === null && detected === "US") return;

    setDetectedCountryAction(detected)
      .then(() => router.refresh())
      .catch(() => {});
  }, [country, router]);

  return null;
}
