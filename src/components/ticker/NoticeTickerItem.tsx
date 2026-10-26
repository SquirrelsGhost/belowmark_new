import Redacted from "@/components/ui/Redacted";

interface NoticeTickerItemProps {
  court: string;
  segment: string;
  state: string;
  date: string;
  valueLabel: string;
}

/** One hearing in the wire feed — the value stays blacked out. */
export default function NoticeTickerItem({ court, segment, state, date, valueLabel }: NoticeTickerItemProps) {
  return (
    <li className="flex items-center gap-3 border-r border-paper/15 px-6 py-3.5 font-mono text-xs whitespace-nowrap uppercase">
      <span className="font-semibold">{court}</span>
      <span className="text-paper/50">·</span>
      <span>{segment}</span>
      <span className="border border-paper/30 px-1.5 text-[10px]">{state}</span>
      <span className="text-paper/50">{date}</span>
      <span className="inline-flex items-center [&>span]:bg-paper-bright/80">
        <Redacted label={valueLabel} width="sm" />
      </span>
    </li>
  );
}
