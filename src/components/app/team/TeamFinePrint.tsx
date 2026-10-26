interface TeamFinePrintProps {
  text: string;
}

/** What a team stores and when it is deleted — the fine print under the page. */
export default function TeamFinePrint({ text }: TeamFinePrintProps) {
  return <p className="mt-10 max-w-3xl border-l-4 border-ink pl-4 font-mono text-[11px] leading-relaxed text-muted">{text}</p>;
}
