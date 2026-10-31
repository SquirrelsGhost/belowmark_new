// Computes browser Micro-PoW (`loeseLoginPoW`) and hardware fingerprint (`HW-...`)
"use client";

import { useEffect, useRef, useState } from "react";
import { getHardwareFingerprint } from "@/lib/auth/hardwareFingerprint";
import { loeseLoginPoW, loeseLoginPoWSync } from "@/lib/auth/loginPowClient";

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

    const refreshChallenge = () => {
      void loeseLoginPoW().then((res) => {
        if (active) setPow({ ...res, hw: getHardwareFingerprint() });
      });
    };

    refreshChallenge();

    const interval = setInterval(refreshChallenge, 4 * 60 * 1000);
    window.addEventListener("focus", refreshChallenge);

    const form = wrapperRef.current?.closest("form");

    // Guarantee every submission carries a fresh, non-empty PoW token and
    // hardware fingerprint even if submitted immediately or after a failed attempt.
    const handleFormData = (event: FormDataEvent) => {
      const fresh = loeseLoginPoWSync();
      const hw = getHardwareFingerprint();
      event.formData.set("powTs", String(fresh.powTs));
      event.formData.set("powNonce", String(fresh.powNonce));
      event.formData.set("hardwareFingerprint", hw);
    };

    // Prevent React 19's automatic form.reset() after a Server Action from
    // wiping the user's inputs, checkboxes, and hidden fields on error.
    const handleReset = (event: Event) => {
      event.preventDefault();
      refreshChallenge();
    };

    form?.addEventListener("formdata", handleFormData);
    form?.addEventListener("reset", handleReset);

    return () => {
      active = false;
      clearInterval(interval);
      window.removeEventListener("focus", refreshChallenge);
      form?.removeEventListener("formdata", handleFormData);
      form?.removeEventListener("reset", handleReset);
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
        <input id="auth-hp-field" type="text" name="honeypot" tabIndex={-1} autoComplete="new-password" defaultValue="" />
      </div>
      <input type="hidden" name="powTs" value={pow ? String(pow.powTs) : ""} />
      <input type="hidden" name="powNonce" value={pow ? String(pow.powNonce) : ""} />
      <input type="hidden" name="hardwareFingerprint" value={pow ? pow.hw : ""} />
    </>
  );
}
