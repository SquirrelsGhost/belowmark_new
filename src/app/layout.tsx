import { Archivo, IBM_Plex_Mono, Newsreader } from "next/font/google";
import { env } from "@/lib/env";
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
});

/**
 * No page-level metadata here — every page exports its own generateMetadata()
 * using TranslationService + MetaTagService so that meta tags are locale-aware.
 *
 * The only global concern kept here is metadataBase (required for resolving
 * relative OG image URLs) and the robots directive.
 */
export const metadata = {
  metadataBase: new URL(env.appUrl),
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${archivo.variable} ${plexMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="relative min-h-full overflow-x-hidden bg-paper font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
