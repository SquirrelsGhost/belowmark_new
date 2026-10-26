import { ReactNode } from "react";
import Container from "@/components/ui/Container";

interface AppMainProps {
  id: string;
  children: ReactNode;
}

/** Main landmark with the site-wide column. */
export default function AppMain({ id, children }: AppMainProps) {
  return (
    <main id={id} className="pb-16">
      <Container>{children}</Container>
    </main>
  );
}
