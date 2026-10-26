import { connection } from "next/server";
import { err } from "@/lib/api";
import { AccountDataService } from "@/services/AccountDataService";
import { SessionService } from "@/services/SessionService";

/**
 * GET /konto/export — every stored datum of the signed-in account as a JSON
 * file (Art. 15 and 20 DSGVO). Returns a file instead of JSON on success;
 * errors use err().
 */
export async function GET(): Promise<Response> {
  await connection();
  try {
    const user = await SessionService.getCurrentUser();
    if (!user) return err("Nicht angemeldet", 401);
    const data = await AccountDataService.export(user.id);
    const day = new Date().toISOString().slice(0, 10);
    return new Response(JSON.stringify(data, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="belowmark-daten-${day}.json"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("[GET /konto/export]", error);
    return err("Export fehlgeschlagen");
  }
}
