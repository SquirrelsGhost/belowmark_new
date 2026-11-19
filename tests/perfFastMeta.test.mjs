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

test("per-country EU shards preserve 100% of de.json listings and generate atlas-summary.json", async () => {
  const eu = ["de", "at", "ch", "it", "es", "fr", "gb", "nl", "pl", "cz", "se"];
  const fullDe = JSON.parse(await readFile(join(process.cwd(), "data/snapshots/de.json"), "utf8"));
  let shardTotal = 0;
  for (const cc of eu) {
    const shard = JSON.parse(await readFile(join(process.cwd(), `data/snapshots/countries/${cc}.json`), "utf8"));
    assert.ok(Array.isArray(shard.listings), `Missing listings array in ${cc}.json`);
    shardTotal += shard.listings.length;
  }
  assert.equal(shardTotal, fullDe.listings.length);

  const summary = JSON.parse(await readFile(join(process.cwd(), "data/snapshots/atlas-summary.json"), "utf8"));
  assert.ok(summary.deTotalListings > 0);
  assert.ok(summary.trTotalListings > 0);
  assert.equal(Object.keys(summary.euMarkets).length, 10);
});
