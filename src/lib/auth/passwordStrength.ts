import { PASSWORD_RULES } from "@/lib/auth/authConfig";

/** 0 = too short … 4 = strong. Pure, so the meter and the server agree. */
export type PasswordScore = 0 | 1 | 2 | 3 | 4;

/** Typical choices that pass length rules but are guessed first. */
const COMMON_FRAGMENTS = [
  "password", "passwort", "parola", "sifre", "şifre", "qwertz", "qwerty", "123456", "abcdef",
  "belowmark", "zwangsversteigerung", "immobilie", "letmein", "welcome", "willkommen", "iloveyou",
];

function hasSequence(value: string): boolean {
  const lower = value.toLowerCase();
  for (let i = 0; i + 3 < lower.length; i++) {
    const a = lower.charCodeAt(i);
    if (lower.charCodeAt(i + 1) === a + 1 && lower.charCodeAt(i + 2) === a + 2 && lower.charCodeAt(i + 3) === a + 3) return true;
    if (lower[i] === lower[i + 1] && lower[i] === lower[i + 2] && lower[i] === lower[i + 3]) return true;
  }
  return false;
}

export function scorePassword(password: string): PasswordScore {
  if (password.length < PASSWORD_RULES.minLength) return 0;
  const lower = password.toLowerCase();
  const classes = [/[a-zäöüßçğışö]/, /[A-ZÄÖÜÇĞİŞ]/, /\d/, /[^\p{L}\d]/u].filter((re) => re.test(password)).length;
  const unique = new Set(lower).size;

  let score = 1;
  if (password.length >= 14) score++;
  if (password.length >= 18 || classes >= 3) score++;
  if (classes >= 3 && password.length >= 12) score++;
  if (COMMON_FRAGMENTS.some((fragment) => lower.includes(fragment))) score -= 2;
  if (hasSequence(password) || unique < 5) score -= 1;
  return Math.max(1, Math.min(4, score)) as PasswordScore;
}

/** Minimum score accepted on sign-up and reset. */
export const MIN_PASSWORD_SCORE: PasswordScore = 2;
