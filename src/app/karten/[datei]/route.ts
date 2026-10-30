import { err } from "@/lib/api";
import { GeoService } from "@/services/GeoService";

const FILES = { "de.svg": "DE", "tr.svg": "TR" } as const;

/**
 * GET /karten/de.svg, /karten/tr.svg
 *
 * Region outlines for the small locator maps (see src/lib/locatorSprite.ts).
 * Public geodata, no session needed. Pages link it with a content version,
 * so it is cached for a year.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ datei: string }> }): Promise<Response> {
  try {
    const { datei } = await params;
    const market = FILES[datei as keyof typeof FILES];
    if (!market) return err("Not found", 404);
    const { svg } = await GeoService.getLocatorSprite(market);
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
