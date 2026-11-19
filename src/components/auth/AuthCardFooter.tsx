// Reads any typed/autofilled e-mail on the active auth card so switching between Login/Signup/Forgot carries it over
"use client";

import { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import AuthTextLink from "@/components/auth/AuthTextLink";

interface AuthCardFooterProps {
  question?: string;
  href: string;
  label: string;
}

function resolveHrefWithLiveEmail(baseHref: string, anchor: HTMLElement): string {
  const card = anchor.closest("article, aside, main") ?? document;
  const input = card.querySelector<HTMLInputElement>('input[type="email"], input[name="email"]');
  const liveEmail = input?.value.trim();
  if (!liveEmail) return baseHref;
  const url = new URL(baseHref, window.location.origin);
  if (!url.searchParams.has("email")) {
    url.searchParams.set("email", liveEmail.slice(0, 254));
  }
  return `${url.pathname}${url.search}${url.hash}`;
}

/** "No account yet? Sign up" — the tear-off strip of the card, preserving typed e-mail across auth routes. */
export default function AuthCardFooter({ question, href, label }: AuthCardFooterProps) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLSpanElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const anchor = (event.target as HTMLElement | null)?.closest("a");
    if (!anchor) return;
    const nextHref = resolveHrefWithLiveEmail(href, anchor);
    if (nextHref !== href) {
      event.preventDefault();
      router.push(nextHref);
    }
  };

  return (
    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-ink-soft">
      {question && <span>{question}</span>}
      <span onClick={handleClick}>
        <AuthTextLink href={href} label={label} />
      </span>
    </p>
  );
}
