interface AlertsUsageProps {
  label: string;
}

export default function AlertsUsage({ label }: AlertsUsageProps) {
  return <p className="font-mono text-xs tracking-wide text-muted uppercase">{label}</p>;
}
