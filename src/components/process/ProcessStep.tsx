import Reveal from "@/components/ui/Reveal";

interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
  delay?: number;
}

export default function ProcessStep({ number, title, description, delay = 0 }: ProcessStepProps) {
  return (
    <li>
      <Reveal delay={delay} className="flex flex-col items-center text-center">
        <span className="relative grid size-14 place-items-center rounded-full border-sheen font-serif text-2xl italic">
          {number}
        </span>
        <h3 className="mt-6 text-xl font-medium tracking-tight">{title}</h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">{description}</p>
      </Reveal>
    </li>
  );
}
