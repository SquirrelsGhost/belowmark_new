import fs from "node:fs";

// Colors (RGBA): Belowmark "Amtlicher Aushang" palette
const PAPER = [247, 244, 238, 255]; // #f7f4ee
const INK = [18, 17, 15, 255];      // #12110f
const SIGNAL = [200, 54, 43, 255];  // #c8362b
const TRANSPARENT = [0, 0, 0, 0];

function samplePixel(nx, ny) {
  const cx = Math.max(6, Math.min(26, nx));
  const cy = Math.max(6, Math.min(26, ny));
  const distCorner = Math.hypot(nx - cx, ny - cy);
  if (nx < 1 || nx > 31 || ny < 1 || ny > 31 || distCorner > 5) {
    return TRANSPARENT;
  }
  if (nx < 3 || nx > 29 || ny < 3 || ny > 29 || distCorner > 3) {
    return INK;
  }
  if (nx >= 5 && nx <= 27 && ny >= 8.5 && ny <= 12.5) {
    return SIGNAL;
  }
  if (Math.hypot(nx - 16, ny - 21) <= 5.2) {
    return INK;
  }
  return PAPER;
}

function renderBmpFrame(size) {
  const xorSize = size * size * 4;
  const andRowBytes = Math.ceil(size / 32) * 4;
  const andSize = andRowBytes * size;
  const buf = Buffer.alloc(40 + xorSize + andSize, 0);

  buf.writeUInt32LE(40, 0);
  buf.writeInt32LE(size, 4);
  buf.writeInt32LE(size * 2, 8);
  buf.writeUInt16LE(1, 12);
  buf.writeUInt16LE(32, 14);
  buf.writeUInt32LE(0, 16);
  buf.writeUInt32LE(xorSize + andSize, 20);

  const grid = 4;
  for (let y = 0; y < size; y++) {
    const bmpRow = size - 1 - y;
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < grid; sy++) {
        for (let sx = 0; sx < grid; sx++) {
          const nx = ((x + (sx + 0.5) / grid) / size) * 32;
          const ny = ((y + (sy + 0.5) / grid) / size) * 32;
          const [pr, pg, pb, pa] = samplePixel(nx, ny);
          r += pr * (pa / 255);
          g += pg * (pa / 255);
          b += pb * (pa / 255);
          a += pa;
        }
      }
      const samples = grid * grid;
      const finalA = Math.round(a / samples);
      const alphaNorm = a / (samples * 255);
      const finalR = alphaNorm > 0 ? Math.round(r / samples / alphaNorm) : 0;
      const finalG = alphaNorm > 0 ? Math.round(g / samples / alphaNorm) : 0;
      const finalB = alphaNorm > 0 ? Math.round(b / samples / alphaNorm) : 0;

      const offset = 40 + (bmpRow * size + x) * 4;
      buf[offset + 0] = finalB;
      buf[offset + 1] = finalG;
      buf[offset + 2] = finalR;
      buf[offset + 3] = finalA;
    }
  }
  return buf;
}

const sizes = [16, 32, 48];
const frames = sizes.map(renderBmpFrame);
const headerSize = 6 + sizes.length * 16;
const totalSize = headerSize + frames.reduce((s, f) => s + f.length, 0);
const ico = Buffer.alloc(totalSize);

ico.writeUInt16LE(0, 0);
ico.writeUInt16LE(1, 2);
ico.writeUInt16LE(sizes.length, 4);

let dataOffset = headerSize;
sizes.forEach((size, i) => {
  const entryOffset = 6 + i * 16;
  ico[entryOffset + 0] = size;
  ico[entryOffset + 1] = size;
  ico[entryOffset + 2] = 0;
  ico[entryOffset + 3] = 0;
  ico.writeUInt16LE(1, entryOffset + 4);
  ico.writeUInt16LE(32, entryOffset + 6);
  ico.writeUInt32LE(frames[i].length, entryOffset + 8);
  ico.writeUInt32LE(dataOffset, entryOffset + 12);
  frames[i].copy(ico, dataOffset);
  dataOffset += frames[i].length;
});

fs.writeFileSync("src/app/favicon.ico", ico);
fs.writeFileSync("public/favicon.ico", ico);
console.log(`Generated Belowmark small-logo favicon.ico (${ico.length} bytes)`);
