import { err } from "@/lib/api";
import { GeoService } from "@/services/GeoService";

const FILES = { "de.svg": "DE", "at.svg": "AT", "ch.svg": "CH", "it.svg": "IT", "es.svg": "ES", "fr.svg": "FR", "gb.svg": "GB", "tr.svg": "TR" } as const;

/**
 * GET /karten/<land>.svg (de, at, ch, it, es, fr, gb, tr)
 *
 * Region outlines for the small locator maps (see src/lib/locatorSprite.ts).
 * Public geodata, no session needed. Pages link it with a content version,
 * so it is cached for a year.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ datei: string }> }): Promise<Response> {
  try {
    const { datei } = await params;
    const country = FILES[datei as keyof typeof FILES];
    if (!country) return err("Not found", 404);
    const { svg } = await GeoService.getLocatorSprite(country);
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[GET /karten/[datei]]", error);
    return err("Internal server error");
  }
}
