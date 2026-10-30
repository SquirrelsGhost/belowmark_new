import { connection } from "next/server";
import { err } from "@/lib/api";
import { INVOICE_INLINE_PARAM } from "@/lib/invoice/invoiceConfig";
import { InvoicePdfService } from "@/services/invoice/InvoicePdfService";
import { InvoiceService } from "@/services/invoice/InvoiceService";
import { SessionService } from "@/services/SessionService";

/**
 * GET /konto/rechnungen/<id>/pdf — an invoice of the signed-in account as a
 * PDF file (?ansicht=1 opens it in the browser instead of saving it).
 * Returns a file on success; errors use err().
 */
export async function GET(request: Request, { params }: RouteContext<"/konto/rechnungen/[id]/pdf">): Promise<Response> {
  await connection();
  try {
    const user = await SessionService.getCurrentUser();
    if (!user) return err("Nicht angemeldet", 401);
    const { id } = await params;
    const invoice = await InvoiceService.getForUser(id, user.id);
    if (!invoice) return err("Rechnung nicht gefunden", 404);
    const pdf = await InvoicePdfService.render(invoice);
    const inline = new URL(request.url).searchParams.has(INVOICE_INLINE_PARAM);
    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${InvoicePdfService.fileName(invoice)}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[GET /konto/rechnungen/[id]/pdf]", error);
    return err("Rechnung konnte nicht erzeugt werden");
  }
}
