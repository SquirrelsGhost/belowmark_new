import Link from "next/link";
import Icon, { IconName } from "@/components/ui/Icon";

interface SearchViewOption {
  href: string;
  label: string;
  icon: IconName;
  isActive: boolean;
}

interface SearchViewSwitchProps {
  label: string;
  options: SearchViewOption[];
  className?: string;
}

/** List or map — two tabs that keep every filter, because both live in the URL. */
export default function SearchViewSwitch({ label, options, className = "" }: SearchViewSwitchProps) {
  return (
    <nav aria-label={label} className={`inline-flex border-2 border-ink ${className}`}>
      {options.map((option) => (
        <Link
          key={option.href}
          href={option.href}
          aria-current={option.isActive ? "page" : undefined}
          className={`flex items-center gap-2 px-3 py-1.5 font-narrow text-xs font-semibold tracking-[0.08em] uppercase ${
            option.isActive ? "bg-ink text-paper-bright" : "bg-paper-bright text-ink hover:bg-paper-deep"
          }`}
        >
          <Icon name={option.icon} className="size-4" />
          {option.label}
        </Link>
      ))}
    </nav>
  );
}
