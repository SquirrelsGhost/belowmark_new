import Icon from "@/components/ui/Icon";

interface LocationMissingProps {
  message: string;
}

/** Shown instead of a map when the notice gives no place we can put on one. */
export default function LocationMissing({ message }: LocationMissingProps) {
  return (
    <div className="flex h-80 flex-col items-center justify-center gap-3 border-2 border-dashed border-rule-strong/40 bg-paper-bright p-6 text-center sm:h-96">
      <Icon name="pin" className="size-8 text-muted" />
      <p className="max-w-sm text-sm text-ink-soft">{message}</p>
    </div>
  );
}
