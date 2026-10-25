import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { env } from "@/lib/env";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Editorial display face for headlines — paired with Geist for UI text. */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
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
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="relative min-h-full overflow-x-hidden bg-canvas font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
