import { err, ok } from "@/lib/api";
import { hasPermission } from "@/lib/permissions";
import { REPORT_UPLOAD } from "@/lib/report/reportConfig";
import { ListingService } from "@/services/ListingService";
import { OfficialPortalService } from "@/services/OfficialPortalService";
import { ReportError, ReportService } from "@/services/ReportService";
import { getSessionUser } from "@/services/sicherheit/SessionUserService";
import { Listing } from "@/types/listing.types";

/** What the upload form needs back; it reloads the page to show the full analysis. */
interface ReportUploadResponse {
  id: string;
  findings: number;
  method: "rules" | "rules+ai";
}

interface ReportDeleteResponse {
  removed: true;
}

/** Signed-in users with capability `gutachten:analyze`, and only proceedings of their own market. */
async function authorise(req: Request, listingId: unknown): Promise<{ userId: string; listing: Listing } | Response> {
  const user = await getSessionUser(req, false);
  if (!user) return err("unauthorized", 401);
  if (user.banned) return err("banned", 403);
  if (!hasPermission(user.permissions, "gutachten:analyze")) return err("plan", 403);
  if (typeof listingId !== "string" || listingId.length > 128) return err("listing", 400);
  const listing = await ListingService.getByKey(user.market === "TR" ? "TR" : "DE", listingId);
  return listing ? { userId: user.id, listing } : err("listing", 404);
}

export async function POST(req: Request): Promise<Response> {
  try {
    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return err("file", 400);
    }
    const target = await authorise(req, form.get(REPORT_UPLOAD.fieldListing));
    if (target instanceof Response) return target;

    const sourceFileId = form.get("sourceFileId");
    const sourceDoc = form.get("sourceDoc");
    const file = form.get(REPORT_UPLOAD.fieldFile);

    let fileName: string;
    let bytes: Uint8Array;

    if (typeof sourceFileId === "string" || typeof sourceDoc === "string") {
      const portalDoc = await OfficialPortalService.fetchDocumentBuffer(target.listing, {
        fileId: typeof sourceFileId === "string" ? sourceFileId : null,
        doc: typeof sourceDoc === "string" ? sourceDoc : null,
      });
      if (!portalDoc) return err("file", 400);
      if (portalDoc.buffer.byteLength > REPORT_UPLOAD.maxBytes) return err("tooLarge", 413);
      fileName = portalDoc.fileName;
      bytes = new Uint8Array(portalDoc.buffer);
    } else {
      if (!(file instanceof File) || file.size === 0) return err("file", 400);
      if (file.size > REPORT_UPLOAD.maxBytes) return err("tooLarge", 413);
      fileName = file.name;
      bytes = new Uint8Array(await file.arrayBuffer());
    }

    const report = await ReportService.analyze(target.userId, target.listing, fileName, bytes, REPORT_UPLOAD.maxPages);
    const data: ReportUploadResponse = { id: report.id, findings: report.findings.length, method: report.method };
    return ok(data, 201);
  } catch (error) {
    if (error instanceof ReportError) return err(error.code, 422);
    console.error("[POST /api/gutachten]", error);
    return err("internal");
  }
}

export async function DELETE(req: Request): Promise<Response> {
  try {
    const target = await authorise(req, new URL(req.url).searchParams.get(REPORT_UPLOAD.fieldListing));
    if (target instanceof Response) return target;
    await ReportService.remove(target.userId, target.listing.key);
    const data: ReportDeleteResponse = { removed: true };
    return ok(data);
  } catch (error) {
    console.error("[DELETE /api/gutachten]", error);
    return err("internal");
  }
}
