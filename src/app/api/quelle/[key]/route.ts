import { connection } from "next/server";
import { err, ok } from "@/lib/api";
import { ListingService } from "@/services/ListingService";
import { OfficialPortalService } from "@/services/OfficialPortalService";
import { SessionService } from "@/services/SessionService";
import { OfficialPortalDetails } from "@/types/listing.types";

interface RouteContext {
  params: Promise<{ key: string }>;
}

/**
 * GET /api/quelle/[key]?format=json   → JSON OfficialPortalDetails via ok()
 * GET /api/quelle/[key]?mode=portal   → Referer-safe bridge to zvg-portal.de or 302 to official portal
 * GET /api/quelle/[key]?fileId=…      → Streams official PDF (Gutachten, Exposé, Bekanntmachung, Fotos)
 */
export async function GET(request: Request, { params }: RouteContext): Promise<Response> {
  await connection();
  try {
    const user = await SessionService.getCurrentUser();
    if (!user) return err("Nicht angemeldet", 401);

    const { key: rawKey } = await params;
    const key = decodeURIComponent(rawKey);
    const market = user.market === "TR" ? "TR" : "DE";

    const listing =
      (await ListingService.getByKey(market, key)) ??
      (await ListingService.getByKey(market === "DE" ? "TR" : "DE", key));

    if (!listing) return err("Verfahren nicht gefunden", 404);

    const url = new URL(request.url);
    const format = url.searchParams.get("format");
    const mode = url.searchParams.get("mode");
    const photo = url.searchParams.get("photo");
    const fileId = url.searchParams.get("fileId");
    const doc = url.searchParams.get("doc");

    if (format === "json") {
      const data: OfficialPortalDetails = await OfficialPortalService.getDetails(listing);
      return ok(data);
    }

    if (photo !== null) {
      const photoIdx = Number.parseInt(photo, 10);
      if (!Number.isFinite(photoIdx) || photoIdx < 0 || photoIdx > 25) {
        return err("Ungültiger Foto-Index", 400);
      }
      const photoBuf = await OfficialPortalService.fetchPhotoBuffer(listing, photoIdx);
      if (!photoBuf) return err("Kein Objektfoto gefunden", 404);
      return new Response(new Uint8Array(photoBuf), {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "private, max-age=86400",
        },
      });
    }

    if (mode === "portal") {
      const isZvgPortal =
        listing.key.startsWith("zvgportal-") || (listing.officialUrl ?? "").includes("zvg-portal.de");
      if (isZvgPortal) {
        const html = OfficialPortalService.buildPortalBridgeHtml(listing);
        return new Response(html, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "private, no-store",
          },
        });
      }
      return Response.redirect(listing.officialUrl || "https://www.zvg-portal.de/", 302);
    }

    const docResult = await OfficialPortalService.fetchDocumentBuffer(listing, { fileId, doc });
    if (!docResult) {
      return err("Amtliches Dokument konnte vom Quellportal nicht geladen werden.", 404);
    }

    const safeFilename = docResult.fileName.replace(/[^\w.-]+/g, "_");
    return new Response(new Uint8Array(docResult.buffer), {
      headers: {
        "Content-Type": docResult.contentType,
        "Content-Disposition": `inline; filename="${safeFilename}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("[GET /api/quelle/[key]]", error);
    return err("Internal server error");
  }
}
