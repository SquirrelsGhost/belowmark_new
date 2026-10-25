interface StatItemProps {
  value: string;
  label: string;
}

export default function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="flex flex-col-reverse items-center gap-2 bg-glass px-6 py-10 text-center">
      <dt className="text-xs font-medium tracking-[0.18em] text-subtle uppercase">{label}</dt>
      <dd className="font-serif text-4xl tracking-tight sm:text-5xl">{value}</dd>
    </div>
  );
}
