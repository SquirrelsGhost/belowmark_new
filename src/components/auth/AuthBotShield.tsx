// Computes browser Micro-PoW (`loeseLoginPoW`) and hardware fingerprint (`HW-...`)
"use client";

import { useEffect, useRef, useState } from "react";
import { getHardwareFingerprint } from "@/lib/auth/hardwareFingerprint";
import { loeseLoginPoW } from "@/lib/auth/loginPowClient";

interface AuthBotShieldProps {
  /** Re-solves the PoW challenge whenever this counter or key changes (e.g. after a failed attempt) */
  refreshKey?: unknown;
}

/**
 * Hidden anti-botnet & device-binding fields for login and registration forms:
 * - Invisible honeypot input (`name="honeypot"`)
 * - SHA-256 Micro-Proof-of-Work (`powTs`, `powNonce` with `"000"` prefix)
 * - Hardware fingerprint (`hardwareFingerprint`: `HW-...`)
 */
export default function AuthBotShield({ refreshKey }: AuthBotShieldProps) {
  const [pow, setPow] = useState<{ powTs: number; powNonce: number; hw: string } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    let submitTimer: ReturnType<typeof setTimeout> | null = null;

    const refreshChallenge = () => {
      void loeseLoginPoW().then((res) => {
        if (active) setPow({ ...res, hw: getHardwareFingerprint() });
      });
    };

    refreshChallenge();

    const form = wrapperRef.current?.closest("form");
    const handleSubmit = () => {
      if (submitTimer) clearTimeout(submitTimer);
      submitTimer = setTimeout(() => {
        if (active) refreshChallenge();
      }, 50);
    };

    form?.addEventListener("submit", handleSubmit);

    return () => {
      active = false;
      if (submitTimer) clearTimeout(submitTimer);
      form?.removeEventListener("submit", handleSubmit);
    };
  }, [refreshKey]);

  return (
    <>
      <div
        ref={wrapperRef}
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
      >
        <label htmlFor="auth-hp-field">Website</label>
        <input id="auth-hp-field" type="text" name="honeypot" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <input type="hidden" name="powTs" value={pow ? String(pow.powTs) : ""} />
      <input type="hidden" name="powNonce" value={pow ? String(pow.powNonce) : ""} />
      <input type="hidden" name="hardwareFingerprint" value={pow ? pow.hw : ""} />
    </>
  );
}
