import { LABEL_CLASSES } from "@/lib/appStyles";

interface VerdictUnknowablesProps {
  title: string;
  items: string[];
}

/** The limits of the verdict, said plainly — what no source in the app can know. */
export default function VerdictUnknowables({ title, items }: VerdictUnknowablesProps) {
  return (
    <section aria-label={title} className="bg-hatch px-3 py-3">
      <h3 className={LABEL_CLASSES}>{title}</h3>
      <ul className="mt-2 flex list-disc flex-col gap-1 pl-4 text-xs leading-snug text-ink-soft">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
