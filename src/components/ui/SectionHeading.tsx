import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
}

/** Centered section intro: eyebrow pill, two-tone serif headline, lead text. */
export default function SectionHeading({ eyebrow, title, titleAccent, description }: SectionHeadingProps) {
  return (
    <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
      <Eyebrow label={eyebrow} />
      <h2 className="font-serif text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl">
        {title} <em className="text-muted">{titleAccent}</em>
      </h2>
      <p className="max-w-xl text-base leading-relaxed text-muted text-pretty sm:text-lg">{description}</p>
    </Reveal>
  );
}
