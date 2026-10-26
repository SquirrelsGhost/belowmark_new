import Icon from "@/components/ui/Icon";

interface CompareRowProps {
  criterion: string;
  manual: string;
  belowmark: string;
}

export default function CompareRow({ criterion, manual, belowmark }: CompareRowProps) {
  return (
    <tr className="border-b border-rule last:border-b-0">
      <th scope="row" className="px-4 py-5 text-left align-top font-narrow text-lg font-semibold">{criterion}</th>
      <td className="px-4 py-5 align-top text-ink-soft">
        <span className="flex items-start gap-3">
          <Icon name="cross" className="mt-0.5 size-4 shrink-0 text-muted" />
          <span className="line-through decoration-ink/30">{manual}</span>
        </span>
      </td>
      <td className="bg-ink/[0.04] px-4 py-5 align-top font-medium">
        <span className="flex items-start gap-3">
          <Icon name="check" className="mt-0.5 size-4 shrink-0 text-signal" />
          {belowmark}
        </span>
      </td>
    </tr>
  );
}
