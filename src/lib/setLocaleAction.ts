"use server";

import { cookies } from "next/headers";
import { LOCALE_COOKIE_MAX_AGE, LOCALE_COOKIE_NAME, LOCALE_OPTIONS } from "@/lib/constants";

type LocaleOption = (typeof LOCALE_OPTIONS)[number];

/**
 * Server Action: persists the manually chosen locale in the cookie that
 * TranslationService reads first.
 */
export async function setLocaleAction(locale: LocaleOption): Promise<void> {
  if (!LOCALE_OPTIONS.includes(locale)) return;
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
}
