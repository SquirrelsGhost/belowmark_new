import { ReactNode } from "react";

interface TeamCreateSlotProps {
  children: ReactNode;
}

/** Column under the team cards that holds the create form or the Pro note. */
export default function TeamCreateSlot({ children }: TeamCreateSlotProps) {
  return <div className="mt-12 max-w-2xl">{children}</div>;
}
