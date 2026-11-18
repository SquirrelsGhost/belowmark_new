import Link from "next/link";
import { BLOG_HUBS, TOP_REGIONS_AND_CITIES } from "@/lib/footerDirectoryData";

interface FooterDirectoryRegionsProps {
  regionsHeading: string;
  guidesHeading: string;
}

const sectionHeadingClass = "font-mono text-[10px] font-semibold tracking-[0.18em] text-paper/55 uppercase";
const regionChipClass =
  "inline-flex items-center border border-paper/14 bg-paper/[0.03] px-2.5 py-1 font-mono text-[11px] text-paper/78 transition-colors hover:border-signal hover:bg-paper/[0.07] hover:text-paper-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";
const guideChipClass =
  "group/guide inline-flex items-center gap-2 border border-paper/16 bg-paper/[0.04] px-3 py-1.5 font-mono text-[11px] text-paper/85 transition-colors hover:border-signal hover:bg-signal hover:text-paper-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";
const isoBadgeClass =
  "bg-paper/14 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-paper-bright transition-colors group-hover/guide:bg-paper-bright group-hover/guide:text-ink";

export default function FooterDirectoryRegions({
  regionsHeading,
  guidesHeading,
}: FooterDirectoryRegionsProps) {
  return (
    <div className="mt-7 grid gap-6 border-t border-paper/15 pt-6 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <h4 className={sectionHeadingClass}>{regionsHeading}</h4>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {TOP_REGIONS_AND_CITIES.map((item) => (
            <Link key={item.href} href={item.href} className={regionChipClass}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5">
        <h4 className={sectionHeadingClass}>{guidesHeading}</h4>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {BLOG_HUBS.map((guide) => (
            <Link key={guide.href} href={guide.href} className={guideChipClass}>
              <span className={isoBadgeClass}>{guide.code}</span>
              <span>{guide.drawerLabel}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
