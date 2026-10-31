import { PASSWORD_RULES } from "@/lib/auth/authConfig";

/** 0 = too short … 4 = strong. Pure, so the meter and the server agree. */
export type PasswordScore = 0 | 1 | 2 | 3 | 4;

/** Typical choices that pass length rules but are guessed first. */
const COMMON_FRAGMENTS = [
  "password", "passwort", "parola", "sifre", "şifre", "qwertz", "qwerty", "123456", "abcdef",
  "belowmark", "zwangsversteigerung", "immobilie", "letmein", "welcome", "willkommen", "iloveyou",
];

export function scorePassword(password: string): PasswordScore {
  if (password.length < PASSWORD_RULES.minLength) return 0;
  const lower = password.toLowerCase();
  const classes = [/[a-zäöüßçğışö]/, /[A-ZÄÖÜÇĞİŞ]/, /\d/, /[^\p{L}\d]/u].filter((re) => re.test(password)).length;
  const unique = new Set(lower).size;

  let score = 1;
  if (classes >= 2 || password.length >= 12) score++;
  if (password.length >= 14 || classes >= 3) score++;
  if (classes >= 3 && password.length >= 12) score++;
  if (COMMON_FRAGMENTS.some((fragment) => lower === fragment)) score -= 2;
  if (unique < 4) score -= 1;
  return Math.max(1, Math.min(4, score)) as PasswordScore;
}

/** Minimum score accepted on sign-up and reset (any password meeting minLength >= 10 has score >= 1). */
export const MIN_PASSWORD_SCORE: PasswordScore = 1;
