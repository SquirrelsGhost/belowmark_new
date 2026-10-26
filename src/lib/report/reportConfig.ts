/** Limits and settings of the Gutachten reader. */
export const REPORT_UPLOAD = {
  /** Gutachten with photos and maps are large; above this the upload is refused */
  maxBytes: 40 * 1024 * 1024,
  maxPages: 400,
  mimeType: "application/pdf",
  fieldFile: "file",
  fieldListing: "listingId",
} as const;

export const REPORT_API = "/api/gutachten";

/**
 * Optional second reader. Runs only when ANTHROPIC_API_KEY is set
 * (REPORT_AI=off switches it off again). Every quote it returns is checked
 * against the page text and dropped if it does not stand there.
 */
export const REPORT_AI = {
  model: "claude-opus-5-5",
  effort: "medium",
  maxTokens: 16000,
  /** Characters of page text sent at most — about 120k tokens */
  maxChars: 450_000,
} as const;
