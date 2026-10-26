import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { ConsumerDeclaration, consumerDeclarations, users } from "@/db/schema";
import { normalizeEmail } from "@/lib/auth/normalizeEmail";
import { LocaleOption } from "@/lib/constants";
import { BillingMailService } from "@/services/billing/BillingMailService";
import { BillingService } from "@/services/billing/BillingService";

export interface CancellationInput {
  name: string;
  email: string;
  contractReference: string | null;
  type: "ordinary" | "extraordinary";
  reason: string | null;
  requestedEnd: Date | null;
}

export interface WithdrawalInput {
  name: string;
  email: string;
  contractReference: string | null;
  statement: string;
}

async function findUserId(email: string, sessionUserId: string | null): Promise<string | null> {
  if (sessionUserId) return sessionUserId;
  const [row] = await db.select({ id: users.id }).from(users).where(eq(users.email, normalizeEmail(email)));
  return row?.id ?? null;
}

/** Stores, confirms and reports a declaration. Mails never block the receipt: the row is the proof. */
async function record(values: typeof consumerDeclarations.$inferInsert, lang: LocaleOption): Promise<ConsumerDeclaration> {
  const [declaration] = await db.insert(consumerDeclarations).values(values).returning();
  try {
    await BillingMailService.sendDeclarationReceipt(declaration, lang);
    await db.update(consumerDeclarations).set({ confirmationSentAt: new Date() }).where(eq(consumerDeclarations.id, declaration.id));
  } catch (error) {
    console.error("[declaration] receipt mail", error);
  }
  if (declaration.kind === "withdrawal" || declaration.status === "manual") {
    await BillingMailService.notifyOperator(declaration).catch((error) => console.error("[declaration] operator mail", error));
  }
  return declaration;
}

/**
 * ConsumerDeclarationService
 *
 * "Verträge hier kündigen" (§ 312k BGB) and "Vertrag widerrufen" (§ 356a
 * BGB). Both work without sign-in. An ordinary cancellation that matches a
 * running monthly subscription is carried out at once (end of the paid
 * month); everything else — extraordinary cancellations, a specific later
 * date, no matching account, every withdrawal — goes to a person, and the
 * receipt says so instead of promising a result.
 */
export class ConsumerDeclarationService {
  static cancel = async (input: CancellationInput, sessionUserId: string | null, lang: LocaleOption): Promise<ConsumerDeclaration> => {
    const userId = await findUserId(input.email, sessionUserId);
    let effectiveEnd: Date | null = null;
    let status: "processed" | "manual" = "manual";

    if (userId && input.type === "ordinary") {
      const access = await BillingService.access(userId);
      const wantsLater = input.requestedEnd && access.endsAt && input.requestedEnd.getTime() > access.endsAt.getTime();
      if (access.isActive && !wantsLater) {
        effectiveEnd = await BillingService.cancelRenewal(userId);
        status = effectiveEnd ? "processed" : "manual";
      }
    }

    return record(
      {
        kind: "cancellation",
        userId,
        name: input.name,
        email: input.email,
        contractReference: input.contractReference,
        cancellationType: input.type,
        reason: input.reason,
        requestedEnd: input.requestedEnd,
        effectiveEnd,
        status,
      },
      lang,
    );
  };

  static withdraw = async (input: WithdrawalInput, sessionUserId: string | null, lang: LocaleOption): Promise<ConsumerDeclaration> => {
    const userId = await findUserId(input.email, sessionUserId);
    return record(
      {
        kind: "withdrawal",
        userId,
        name: input.name,
        email: input.email,
        contractReference: input.contractReference,
        reason: input.statement,
        status: "manual",
      },
      lang,
    );
  };

  /** A receipt, shown again on the confirmation page (id is unguessable; content is the person's own). */
  static get = async (id: string): Promise<ConsumerDeclaration | null> => {
    if (!/^[0-9a-f-]{36}$/.test(id)) return null;
    const [row] = await db.select().from(consumerDeclarations).where(eq(consumerDeclarations.id, id));
    return row ?? null;
  };
}
