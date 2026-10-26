import "server-only";
import nodemailer, { Transporter } from "nodemailer";
import { env } from "@/lib/env";

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
}

const SEND_TIMEOUT_MS = 15_000;

const globalForMail = globalThis as unknown as {
  mailTransport: Transporter | undefined;
  mailTransportKey: string | undefined;
};

function transport(): Transporter {
  const key = `${env.smtpHost}:${env.smtpPort}:${env.smtpUser}:v2`;
  if (!globalForMail.mailTransport || globalForMail.mailTransportKey !== key) {
    globalForMail.mailTransport = nodemailer.createTransport({
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
    globalForMail.mailTransportKey = key;
  }
  return globalForMail.mailTransport;
}

/**
 * MailService
 *
 * Sends transactional mail over SMTP. Without SMTP_HOST:
 *  - development prints the mail (incl. its link) to the server console,
 *    so every flow can be clicked through locally;
 *  - production reports "not available" — callers then refuse the action
 *    instead of promising a link that never arrives.
 */
export class MailService {
  static isAvailable = (): boolean => Boolean(env.smtpHost) || process.env.NODE_ENV !== "production";

  static send = async (message: MailMessage): Promise<void> => {
    if (process.env.NODE_ENV !== "production") {
      console.info(`\n[mail:dev] → ${message.to}\n[mail:dev] ${message.subject}\n${message.text}\n`);
    }
    if (!env.smtpHost) {
      if (process.env.NODE_ENV === "production") throw new Error("SMTP is not configured");
      return;
    }
    await transport().sendMail({ from: env.mailFrom, ...message });
  };
}
