import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/** Centered content column with the site-wide max width and gutters. */
export default function Container({ children, className = "" }: ContainerProps) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}
