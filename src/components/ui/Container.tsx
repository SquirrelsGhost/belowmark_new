import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/** Content column with the site-wide max width and gutters. */
export default function Container({ children, className = "" }: ContainerProps) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}
