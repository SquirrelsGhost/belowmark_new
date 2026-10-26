interface BidderFileSourcesProps {
  links: { label: string; url: string }[];
  disclaimer: string;
}

/** Every source with its full address, so it can be typed in from paper. */
export default function BidderFileSources({ links, disclaimer }: BidderFileSourcesProps) {
  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-1 text-[12px]">
        {links.map((link) => (
          <li key={link.url} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3">
            <span className="text-ink-soft">{link.label}</span>
            <a href={link.url} className="font-mono text-[11px] break-all text-ink">{link.url}</a>
          </li>
        ))}
      </ul>
      <p className="border-t border-rule pt-2 text-[11px] leading-snug text-muted">{disclaimer}</p>
    </div>
  );
}
