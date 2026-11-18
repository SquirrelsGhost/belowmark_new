import Link from "next/link";
import FooterDirectoryRegions from "@/components/footer/FooterDirectoryRegions";
import { ALL_CALCULATORS, ALL_COUNTRY_HUBS } from "@/lib/footerDirectoryData";
import { getFooterDirectoryUi } from "@/lib/footerDirectoryUi";

interface FooterDirectoryDrawerProps {
  lang?: string;
  topRegionsHeading?: string;
}

const sectionHeadingClass = "font-mono text-[10px] font-semibold tracking-[0.18em] text-paper/55 uppercase";
const itemLinkClass =
  "group/item flex items-start gap-2.5 border border-paper/12 bg-paper/[0.025] px-3 py-2.5 text-xs leading-snug text-paper/82 transition-colors hover:border-paper/35 hover:bg-paper/[0.06] hover:text-paper-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";
const codeStampClass =
  "mt-0.5 shrink-0 bg-paper/14 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-paper-bright transition-colors group-hover/item:bg-signal";

/**
 * Server-rendered `<details>` gazette ledger keeping all 12 official portals, 12 calculators,
 * 24 prime regions & 8 multilingual guides in SSR HTML without overwhelming the page footer.
 */
export default function FooterDirectoryDrawer({ lang, topRegionsHeading }: FooterDirectoryDrawerProps) {
  const ui = getFooterDirectoryUi(lang);

  return (
    <details className="group border border-paper/18 bg-paper/[0.03] transition-colors open:border-paper/28 open:bg-paper/[0.045]">
      <summary className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-paper/[0.04] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal sm:px-5">
        <span className="inline-flex min-w-0 items-center gap-3">
          <span aria-hidden="true" className="size-2 shrink-0 bg-signal" />
          <span className="font-mono text-xs leading-snug font-medium text-paper/90">
            {ui.drawerTitle}
          </span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-3">
          <span className="hidden border border-paper/20 px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] text-paper/70 uppercase sm:inline-block">
            {ui.drawerBadge}
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="size-3.5 shrink-0 text-paper/70 transition-transform duration-200 group-open:rotate-180 group-open:text-signal"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M3.5 6L8 10.5L12.5 6" strokeLinecap="square" />
          </svg>
        </span>
      </summary>

      <div className="border-t border-paper/15 px-4 pt-6 pb-6 sm:px-5">
        <div className="grid gap-7 lg:grid-cols-2">
          <div>
            <h4 className={sectionHeadingClass}>{ui.directoriesHeading}</h4>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {ALL_COUNTRY_HUBS.map((hub) => (
                <Link key={hub.href} href={hub.href} className={itemLinkClass}>
                  <span className={codeStampClass}>{hub.code}</span>
                  <span>{hub.drawerLabel}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className={sectionHeadingClass}>{ui.calculatorsHeading}</h4>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {ALL_CALCULATORS.map((calc) => (
                <Link key={calc.href} href={calc.href} className={itemLinkClass}>
                  <span className={codeStampClass}>{calc.code}</span>
                  <span>{calc.drawerLabel}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <FooterDirectoryRegions
          regionsHeading={topRegionsHeading ?? ui.regionsHeading}
          guidesHeading={ui.guidesHeading}
        />
      </div>
    </details>
  );
}
