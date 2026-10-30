// Needs browser navigator.serviceWorker and caches APIs to unregister stale service workers
"use client";

import { useEffect } from "react";

interface ServiceWorkerCleanupProps {
  enabled?: boolean;
}

/**
 * Unregisters any lingering Service Workers (e.g. from other localhost:3000 apps)
 * whose fetch handler resolves `respondWith(undefined)` and throws
 * `Uncaught (in promise) TypeError: Failed to convert value to 'Response'`.
 */
export default function ServiceWorkerCleanup({ enabled = true }: ServiceWorkerCleanupProps = {}) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          for (const registration of registrations) {
            void registration.unregister();
          }
        })
        .catch(() => {});
    }

    if ("caches" in window) {
      window.caches
        .keys()
        .then((keys) => {
          for (const key of keys) {
            void window.caches.delete(key);
          }
        })
        .catch(() => {});
    }
  }, [enabled]);

  return null;
}
