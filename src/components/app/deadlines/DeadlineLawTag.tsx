import VerdictSourceTag from "@/components/app/verdict/VerdictSourceTag";
import { DeadlineLaw } from "@/types/deadline.types";

interface DeadlineLawTagProps {
  law: DeadlineLaw | null;
  /** "Gesetz" / "Bekanntmachung" / … — shown when there is no statute to link */
  basisLabel: string;
}

/** The source of one date: the statute (linked) or where else it comes from. */
export default function DeadlineLawTag({ law, basisLabel }: DeadlineLawTagProps) {
  return <VerdictSourceTag label={law ? law.label : basisLabel} href={law?.href ?? null} />;
}
