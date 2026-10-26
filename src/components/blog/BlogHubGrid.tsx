import { ReactNode } from "react";

interface BlogHubGridProps {
  children: ReactNode;
}

export default function BlogHubGrid({ children }: BlogHubGridProps) {
  return <div className="grid grid-cols-1 gap-8 md:grid-cols-2">{children}</div>;
}
