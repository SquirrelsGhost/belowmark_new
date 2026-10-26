interface ClientShareUnavailableProps {
  title: string;
  body: string;
}

/** One answer for unknown, expired, revoked and plan-less links — nothing to tell them apart. */
export default function ClientShareUnavailable({ title, body }: ClientShareUnavailableProps) {
  return (
    <div className="flex flex-col gap-3 py-10">
      <div aria-hidden="true" className="h-1.5 w-24 bg-signal" />
      <h1 className="font-display text-4xl leading-tight">{title}</h1>
      <p className="max-w-lg text-sm leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}
