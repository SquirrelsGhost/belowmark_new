import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Standardised API response shapes.
 *
 * Every endpoint returns one of these — never a raw object.
 * Consumers can always check `success` before reading `data` or `error`.
 */
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/**
 * Returns a 200 JSON response with { success: true, data }.
 */
export function ok<T>(data: T, status = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * Returns an error JSON response with { success: false, error }.
 */
export function err(
  message: string,
  status = 500
): NextResponse<ApiError> {
  return NextResponse.json({ success: false, error: message }, { status });
}

/**
 * Parses and validates a JSON request body against a Zod schema.
 * Returns either `{ success: true, data }` or `{ success: false, response }` ready to return.
 */
export async function parseBody<T>(
  req: Request,
  schema: z.ZodType<T>
): Promise<
  | { success: true; data: T }
  | { success: false; response: NextResponse<ApiError> }
> {
  try {
    const raw: unknown = await req.json();
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const message = parsed.error.issues
        .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
        .join(", ");
      return { success: false, response: err(message, 400) };
    }
    return { success: true, data: parsed.data };
  } catch {
    return { success: false, response: err("Invalid JSON body", 400) };
  }
}
