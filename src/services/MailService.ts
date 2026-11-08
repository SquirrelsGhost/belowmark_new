import "server-only";
import { randomUUID } from "node:crypto";
import nodemailer, { Transporter } from "nodemailer";
import { env } from "@/lib/env";

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  unsubscribeUrl?: string;
  isAutomated?: boolean;
}

const SEND_TIMEOUT_MS = 15_000;
const LOCAL_DEV_RECIPIENT = /\.(local|invalid|test)$/i;

function resolveSenderDomain(): string {
  const raw = env.smtpUser?.split("@")[1]?.trim().toLowerCase();
  return raw && /^[a-z0-9.-]+\.[a-z]{2,}$/.test(raw) ? raw : "belowmark.com";
}

const globalForMail = globalThis as unknown as {
  mailTransport: Transporter | undefined;
  mailTransportKey: string | undefined;
};

function createMailerTransport(): Transporter {
  return nodemailer.createTransport({
    name: resolveSenderDomain(),
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: env.smtpUser ? { user: env.smtpUser, pass: env.smtpPass } : undefined,
    tls: {
      servername: env.smtpHost || undefined,
      rejectUnauthorized: process.env.SMTP_TLS_STRICT === "true",
    },
    connectionTimeout: SEND_TIMEOUT_MS,
    greetingTimeout: SEND_TIMEOUT_MS,
    socketTimeout: SEND_TIMEOUT_MS,
  });
}

function transport(forceReset = false): Transporter {
  const key = `${env.smtpHost}:${env.smtpPort}:${env.smtpUser}:v4`;
  if (forceReset || !globalForMail.mailTransport || globalForMail.mailTransportKey !== key) {
    globalForMail.mailTransport = createMailerTransport();
    globalForMail.mailTransportKey = key;
  }
  return globalForMail.mailTransport;
}

function isTransientSocketError(err: unknown): boolean {
  const code = (err as { code?: string })?.code ?? "";
  return code === "ECONNRESET" || code === "ETIMEDOUT" || code === "ESOCKET" || code === "EPIPE" || code === "ECONNECTION";
}

/**
 * MailService
 *
 * Sends transactional & automated mail over SMTP with RFC-compliant headers,
 * automatic connection recovery on transient socket resets, and safe handling
 * for local `.local` test accounts.
 */
export class MailService {
  static isAvailable = (): boolean => Boolean(env.smtpHost && env.smtpPass) || process.env.NODE_ENV !== "production";

  static send = async (message: MailMessage): Promise<void> => {
    const recipient = message.to.trim();
    if (process.env.NODE_ENV !== "production") {
      console.info(`\n[mail:dev] → ${recipient}\n[mail:dev] ${message.subject}\n${message.text}\n`);
    }
    // Never send synthetic .local / .test addresses to a real external SMTP server
    if (LOCAL_DEV_RECIPIENT.test(recipient)) {
      return;
    }
    if (!env.smtpHost || !env.smtpPass) {
      if (process.env.NODE_ENV === "production") throw new Error("SMTP is not configured");
      return;
    }

    const replyTo = message.replyTo || env.operatorEmail || "contact@belowmark.com";
    const senderDomain = resolveSenderDomain();
    const headers: Record<string, string> = {
      "X-Auto-Response-Suppress": "OOF, AutoReply",
    };
    if (message.unsubscribeUrl || message.isAutomated) {
      headers["Auto-Submitted"] = "auto-generated";
    }
    if (message.unsubscribeUrl) {
      headers["List-Unsubscribe"] = `<${message.unsubscribeUrl}>, <mailto:${replyTo}?subject=Unsubscribe>`;
      headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
    }

    const mailOptions = {
      messageId: `<${randomUUID()}@${senderDomain}>`,
      from: env.mailFrom,
      replyTo,
      to: recipient,
      subject: message.subject,
      text: message.text,
      html: message.html,
      headers,
    };

    try {
      await transport().sendMail(mailOptions);
    } catch (err) {
      if (isTransientSocketError(err)) {
        await transport(true).sendMail(mailOptions);
        return;
      }
      throw err;
    }
  };
}
