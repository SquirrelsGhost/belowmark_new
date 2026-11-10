import Link from "next/link";
import PseoListingPreviewCard from "@/components/pseo/PseoListingPreviewCard";
import { PRICING_COUNTRIES, PricingCountryCode, ROUTES } from "@/lib/constants";
import { PUBLIC_SEARCH_COPY } from "@/lib/pseo/publicSearchCopy";
import { SegmentKey } from "@/lib/snapshot";
import { PseoLocale, PseoPreviewListing } from "@/types/pseo.types";

interface PublicSearchViewProps {
  country: PricingCountryCode;
  locale: PseoLocale;
  query: string;
  segment: SegmentKey | "";
  page: number;
  total: number;
  items: PseoPreviewListing[];
}

const COUNTRY_BADGES: Record<PricingCountryCode, string> = {
  DE: "🇩🇪 DE",
  AT: "🇦🇹 AT",
  CH: "🇨🇭 CH",
  TR: "🇹🇷 TR",
  IT: "🇮🇹 IT",
  ES: "🇪🇸 ES",
  FR: "🇫🇷 FR",
  GB: "🇬🇧 UK",
};

const SEGMENT_ORDER: ReadonlyArray<keyof typeof PUBLIC_SEARCH_COPY.de.types> = [
  "house",
  "apartment",
  "multiFamily",
  "land",
  "commercial",
  "farmland",
];

export default function PublicSearchView({
  country,
  locale,
  query,
  segment,
  page,
  total,
  items,
}: PublicSearchViewProps) {
  const C = PUBLIC_SEARCH_COPY[locale];
  const signupUrl = `${ROUTES.signup}?markt=${country}${query ? `&stadt=${encodeURIComponent(query)}` : ""}`;

  const buildPageHref = (nextPage: number) => {
    const p = new URLSearchParams();
    p.set("markt", country);
    if (query) p.set("q", query);
    if (segment) p.set("typ", segment);
    if (nextPage > 1) p.set("seite", String(nextPage));
    return `/suche?${p.toString()}`;
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b-2 border-ink pb-6">
        <span className="inline-block bg-signal px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-paper-bright">
          {C.eyebrow}
        </span>
        <h1 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-5xl">{C.title}</h1>
        <p className="mt-3 max-w-3xl font-serif text-lg leading-relaxed text-ink-soft">{C.lead}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {PRICING_COUNTRIES.map((code) => {
            const active = code === country;
            return (
              <Link
                key={code}
                href={`/suche?markt=${code}`}
                className={`border-2 border-ink px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
                  active ? "bg-ink text-paper-bright" : "bg-paper-bright text-ink hover:bg-signal hover:border-signal hover:text-paper-bright"
                }`}
              >
                {COUNTRY_BADGES[code]}
              </Link>
            );
          })}
        </div>
      </header>

      <form action="/suche" method="get" className="mt-6 border-2 border-ink bg-paper-bright p-5 shadow-[4px_4px_0_0_var(--color-ink)]">
        <input type="hidden" name="markt" value={country} />
        <div className="grid gap-4 sm:grid-cols-12">
          <div className="sm:col-span-6">
            <label htmlFor="pub-q" className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
              {C.queryLabel}
            </label>
            <input
              id="pub-q"
              name="q"
              type="search"
              defaultValue={query}
              placeholder={C.queryPlaceholder}
              className="mt-1.5 w-full border-2 border-ink bg-paper px-3.5 py-2.5 font-mono text-sm text-ink focus:border-signal focus:outline-none"
            />
          </div>
          <div className="sm:col-span-4">
            <label htmlFor="pub-typ" className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
              {C.typeLabel}
            </label>
            <select
              id="pub-typ"
              name="typ"
              defaultValue={segment}
              className="mt-1.5 w-full border-2 border-ink bg-paper px-3 py-2.5 font-mono text-sm text-ink focus:border-signal focus:outline-none"
            >
              <option value="">{C.allTypes}</option>
              {SEGMENT_ORDER.map((seg) => (
                <option key={seg} value={seg}>
                  {C.types[seg]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end sm:col-span-2">
            <button
              type="submit"
              className="w-full border-2 border-ink bg-signal px-4 py-2.5 font-narrow text-xs font-semibold uppercase tracking-wider text-paper-bright transition-colors hover:bg-ink"
            >
              {C.submitLabel}
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-3.5 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-2 text-ink-soft">
            <span>{C.lockedFiltersLabel}</span>
            {C.lockedFilterItems.map((lf) => (
              <Link key={lf} href={signupUrl} className="border border-rule-strong bg-paper px-2 py-0.5 text-[11px] text-ink hover:border-signal hover:text-signal">
                🔒 {lf}
              </Link>
            ))}
          </div>
          <Link href={signupUrl} className="font-semibold text-signal underline underline-offset-4 hover:text-ink">
            {C.unlockFiltersCta}
          </Link>
        </div>
      </form>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-2xl text-ink">{C.resultsCount(total)}</h2>
        {total > items.length && (
          <div className="flex gap-2 font-mono text-xs">
            <Link
              href={buildPageHref(1)}
              className={`border border-ink px-3 py-1 ${page === 1 ? "bg-ink text-paper-bright" : "bg-paper-bright text-ink"}`}
            >
              1
            </Link>
            <Link
              href={buildPageHref(2)}
              className={`border border-ink px-3 py-1 ${page === 2 ? "bg-ink text-paper-bright" : "bg-paper-bright text-ink"}`}
            >
              2
            </Link>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-6 border-2 border-ink bg-paper-bright p-8 text-center">
          <h3 className="font-display text-2xl text-ink">{C.emptyTitle}</h3>
          <p className="mt-2 font-serif text-base text-ink-soft">{C.emptyBody}</p>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <PseoListingPreviewCard key={item.key} item={item} locale={locale} />
          ))}
        </div>
      )}

      <div className="mt-10 border-2 border-ink bg-paper-dark p-6 sm:p-8 shadow-[4px_4px_0_0_var(--color-ink)]">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">{C.moreTitle}</h2>
        <p className="mt-2 max-w-2xl font-serif text-base text-ink-soft">{C.moreBody}</p>
        <Link
          href={signupUrl}
          className="mt-5 inline-flex items-center bg-signal px-6 py-3.5 font-narrow text-sm font-semibold uppercase tracking-wider text-paper-bright transition-colors hover:bg-ink"
        >
          {C.moreCta}
        </Link>
      </div>
    </section>
  );
}
