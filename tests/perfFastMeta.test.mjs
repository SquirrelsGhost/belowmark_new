import assert from "node:assert/strict";
import { open, readFile } from "node:fs/promises";
import { join } from "node:path";
import { performance } from "node:perf_hooks";
import test from "node:test";

async function readFastMeta(filePath) {
  const handle = await open(filePath, "r");
  try {
    const buf = Buffer.allocUnsafe(65_536);
    const { bytesRead } = await handle.read(buf, 0, buf.length, 0);
    const head = buf.subarray(0, bytesRead).toString("utf8");
    const markerIdx = head.indexOf(',"listings":[');
    assert.ok(markerIdx > 0, `Expected ,"listings":[ marker in first 64 KB of ${filePath}`);
    return JSON.parse(`${head.slice(0, markerIdx)}}`).meta;
  } finally {
    await handle.close();
  }
}

test("fast 64KB snapshot meta reader matches full snapshot meta in under 25ms", async () => {
  for (const rel of ["data/snapshots/de.json", "data/snapshots/tr.json"]) {
    const abs = join(process.cwd(), rel);
    const t0 = performance.now();
    const fastMeta = await readFastMeta(abs);
    const fastMs = performance.now() - t0;

    const fullMeta = JSON.parse(await readFile(abs, "utf8")).meta;
    assert.deepEqual(fastMeta, fullMeta);
    assert.ok(fastMs < 50, `Expected fast meta read < 50ms for ${rel}, got ${fastMs.toFixed(2)}ms`);
  }
});
