import Icon from "@/components/ui/Icon";

interface EvidenceRowProps {
  figure: string;
  basis: string;
  source: string;
  url: string;
}

/** One figure and where it comes from. */
export default function EvidenceRow({ figure, basis, source, url }: EvidenceRowProps) {
  return (
    <tr className="align-top">
      <th scope="row" className="py-2.5 pr-4 font-semibold whitespace-nowrap">{figure}</th>
      <td className="py-2.5 pr-4 text-ink-soft">{basis}</td>
      <td className="py-2.5">
        <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-[11px] whitespace-nowrap text-signal hover:underline">
          {source}
          <Icon name="arrowUpRight" className="size-3.5" />
        </a>
      </td>
    </tr>
  );
}
