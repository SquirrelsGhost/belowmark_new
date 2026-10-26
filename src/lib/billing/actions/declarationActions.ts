"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { RATE_LIMITS } from "@/lib/auth/authConfig";
import { getRequestInfo } from "@/lib/auth/requestInfo";
import { BILLING_ROUTES } from "@/lib/billing/billingConfig";
import { DeclarationFormState } from "@/lib/billing/billingForm.types";
import { DECLARATION_RECEIPT_PARAM } from "@/lib/billing/billingRoutes";
import { RateLimitService } from "@/services/RateLimitService";
import { ConsumerDeclarationService } from "@/services/billing/ConsumerDeclarationService";
import { SessionService } from "@/services/SessionService";
import { TranslationService } from "@/services/TranslationService";
import { DeclarationErrorCode } from "@/translations/billing/IBillingTranslation";

const text = (max: number) => z.string().trim().max(max);
const emailSchema = z.string().trim().max(254).pipe(z.email());

/** Keeps what was typed, so an error never empties the form. */
function echo(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const key of ["name", "email", "contract", "type", "when", "date", "reason", "statement"]) values[key] = String(formData.get(key) ?? "");
  return values;
}

async function guard(formData: FormData): Promise<DeclarationFormState | null> {
  // Honeypot: people never see this field, scripts fill it
  if (String(formData.get("website") ?? "")) return { status: "error", code: "unknown", values: echo(formData) };
  const { ip } = await getRequestInfo();
  const { allowed } = await RateLimitService.hit(`declaration:ip:${ip}`, RATE_LIMITS.declarationIp);
  return allowed ? null : { status: "error", code: "rate_limited", values: echo(formData) };
}

function fieldErrors(formData: FormData, needs: { reason?: boolean; date?: boolean }): DeclarationFormState["fields"] {
  const fields: Partial<Record<"name" | "email" | "date" | "reason", DeclarationErrorCode>> = {};
  if (!text(200).min(2).safeParse(formData.get("name") ?? "").success) fields.name = "name_required";
  if (!emailSchema.safeParse(formData.get("email") ?? "").success) fields.email = "email_invalid";
  if (needs.reason && !text(4000).min(3).safeParse(formData.get("reason") ?? "").success) fields.reason = "reason_required";
  if (needs.date) {
    const date = new Date(String(formData.get("date") ?? ""));
    if (Number.isNaN(date.getTime()) || date.getTime() <= Date.now()) fields.date = "date_invalid";
  }
  return Object.keys(fields).length ? fields : undefined;
}

/** "Jetzt kündigen" (§ 312k BGB). Works without sign-in; the receipt goes to the address given. */
export async function cancelContractAction(_previous: DeclarationFormState, formData: FormData): Promise<DeclarationFormState> {
  const blocked = await guard(formData);
  if (blocked) return blocked;
  const type = formData.get("type") === "extraordinary" ? "extraordinary" : "ordinary";
  const atDate = formData.get("when") === "date";
  const fields = fieldErrors(formData, { reason: type === "extraordinary", date: atDate });
  if (fields) return { status: "error", fields, values: echo(formData) };

  let id: string;
  try {
    const user = await SessionService.getCurrentUser();
    const lang = TranslationService.ToLocaleOption(await TranslationService.GetUserLocale());
    const declaration = await ConsumerDeclarationService.cancel(
      {
        name: String(formData.get("name")).trim(),
        email: String(formData.get("email")).trim(),
        contractReference: String(formData.get("contract") ?? "").trim().slice(0, 200) || null,
        type,
        reason: type === "extraordinary" ? String(formData.get("reason")).trim() : null,
        requestedEnd: atDate ? new Date(String(formData.get("date"))) : null,
      },
      user?.id ?? null,
      lang,
    );
    id = declaration.id;
  } catch (error) {
    console.error("[cancelContractAction]", error);
    return { status: "error", code: "unknown", values: echo(formData) };
  }
  redirect(`${BILLING_ROUTES.cancel}?${DECLARATION_RECEIPT_PARAM}=${id}`);
}

/** "Widerruf bestätigen" (§ 356a BGB). */
export async function withdrawContractAction(_previous: DeclarationFormState, formData: FormData): Promise<DeclarationFormState> {
  const blocked = await guard(formData);
  if (blocked) return blocked;
  const fields = fieldErrors(formData, {});
  const statement = String(formData.get("statement") ?? "").trim().slice(0, 4000);
  if (fields || statement.length < 3) {
    return { status: "error", fields: { ...fields, ...(statement.length < 3 ? { reason: "reason_required" as const } : {}) }, values: echo(formData) };
  }

  let id: string;
  try {
    const user = await SessionService.getCurrentUser();
    const lang = TranslationService.ToLocaleOption(await TranslationService.GetUserLocale());
    const declaration = await ConsumerDeclarationService.withdraw(
      {
        name: String(formData.get("name")).trim(),
        email: String(formData.get("email")).trim(),
        contractReference: String(formData.get("contract") ?? "").trim().slice(0, 200) || null,
        statement,
      },
      user?.id ?? null,
      lang,
    );
    id = declaration.id;
  } catch (error) {
    console.error("[withdrawContractAction]", error);
    return { status: "error", code: "unknown", values: echo(formData) };
  }
  redirect(`${BILLING_ROUTES.withdraw}?${DECLARATION_RECEIPT_PARAM}=${id}`);
}
