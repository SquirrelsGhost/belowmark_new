import { Archivo, IBM_Plex_Mono, Newsreader } from "next/font/google";
import { headers } from "next/headers";
import ServiceWorkerCleanup from "@/components/ui/ServiceWorkerCleanup";
import { env } from "@/lib/env";
import { TranslationService } from "@/services/TranslationService";
import "@/styles/globals.css";

/** Variable width grotesk — condensed for display, normal for body text. */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
});

/** Typewriter-like mono for file numbers, amounts and dates. */
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

/** Editorial serif, used sparingly for the italic "rule" quotes. */
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  // Only a few quotes use it: loaded when used, not preloaded on every page
  preload: false,
});

/**
 * No page-level metadata here — every page exports its own generateMetadata()
 * using TranslationService + MetaTagService so that meta tags are locale-aware.
 *
 * The only global concern kept here is metadataBase (required for resolving
 * relative OG image URLs) and the robots directive.
 */
// Reads request-time data (cookies/headers) via TranslationService for locale detection.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export const metadata = {
  metadataBase: new URL(env.appUrl),
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [rawLocale, reqHeaders] = await Promise.all([
    TranslationService.GetUserLocale(),
    headers(),
  ]);
  const locale = TranslationService.ToLocaleOption(rawLocale);
  const pathname = reqHeaders.get("x-pathname") ?? "";
  const blogLangMatch = /^\/(tr|en|ar|ru)\/blog(\/|$)/.exec(pathname);
  const htmlLang = blogLangMatch ? (blogLangMatch[1] as "tr" | "en" | "ar" | "ru") : locale;

  return (
    <html
      lang={htmlLang}
      dir={htmlLang === "ar" ? "rtl" : "ltr"}
      className={`${archivo.variable} ${plexMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="relative min-h-full overflow-x-hidden bg-paper font-sans text-ink">
        <ServiceWorkerCleanup />
        {children}
      </body>
    </html>
  );
}
