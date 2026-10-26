/**
 * Solves a micro SHA-256 Proof-of-Work challenge in the browser (~10ms)
 * to block credential-stuffing botnets before invoking server-side scrypt.
 */
export async function loeseLoginPoW(): Promise<{ powTs: number; powNonce: number }> {
  const powTs = Date.now();
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    return { powTs, powNonce: 0 };
  }
  const encoder = new TextEncoder();
  for (let nonce = 0; nonce < 250_000; nonce++) {
    const data = encoder.encode(`ec-pow-v1:${powTs}:${nonce}`);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const bytes = new Uint8Array(hashBuffer);
    // "000" in hex corresponds to: first byte === 0 and upper nibble of second byte === 0
    if (bytes[0] === 0 && (bytes[1] & 0xf0) === 0) {
      return { powTs, powNonce: nonce };
    }
  }
  return { powTs, powNonce: 0 };
}
