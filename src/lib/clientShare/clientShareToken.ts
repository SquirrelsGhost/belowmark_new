import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { CLIENT_SHARE } from "@/lib/clientShare/clientShareConfig";

/** A new link token: shown to the broker once, only its hash is stored. */
export const newShareToken = (): string => randomBytes(CLIENT_SHARE.tokenBytes).toString("base64url");

export const hashShareToken = (token: string): string => createHash("sha256").update(token, "utf8").digest("hex");

/** Tokens are base64url of tokenBytes — anything else is not looked up at all. */
export const isShareTokenShape = (token: string): boolean => /^[A-Za-z0-9_-]{43}$/.test(token);
