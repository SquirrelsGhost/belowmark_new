// ---------------------------------------------------------------------------
// Local Antigravity CLI (`agy.exe`) helper for Heim-PC automations.
// Zero paid cloud LLM keys required. Strict deterministic fallback whenever
// `agy.exe` is unavailable (e.g. Vercel / CI) or `--no-agy` is passed.
// ---------------------------------------------------------------------------

import { execFile, spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const AGY_MODEL = "gemini-3.8-flash-medium";
const AGY_PRINT_TIMEOUT = "45s";

export function isAgyDisabled() {
  return process.argv.includes("--no-agy") || process.env.BELOWMARK_NO_AGY === "1";
}

export function resolveAgyBinary() {
  if (isAgyDisabled()) return null;
  const candidates = [
    process.env.AGY_BIN?.trim(),
    process.env.PYCIE_AGY_BIN?.trim(),
    "C:\\Users\\emrea\\AppData\\Local\\agy\\bin\\agy.exe",
    path.join(os.homedir(), "AppData", "Local", "agy", "bin", "agy.exe"),
    path.join(os.homedir(), ".local", "bin", "agy"),
  ].filter(Boolean);

  for (const bin of candidates) {
    try {
      if (fs.existsSync(bin)) return bin;
    } catch {
      // ignore fs check errors
    }
  }
  return null;
}

function ensureAgyMcpConfigClean() {
  const mcpPath = path.join(os.homedir(), ".gemini", "config", "mcp_config.json");
  try {
    if (!fs.existsSync(mcpPath)) return;
    let raw = fs.readFileSync(mcpPath, "utf8");
    if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
    const parsed = JSON.parse(raw);
    if (
      parsed?.mcpServers &&
      (parsed.mcpServers["firebase-mcp-server"] || parsed.mcpServers["local-agent-hub"])
    ) {
      delete parsed.mcpServers["firebase-mcp-server"];
      delete parsed.mcpServers["local-agent-hub"];
      fs.writeFileSync(mcpPath, JSON.stringify(parsed, null, 2), "utf8");
    }
  } catch {
    // non-fatal
  }
}

function getScratchDir() {
  const dir = path.join(os.tmpdir(), "belowmark-agy-scratch");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function extractJsonObject(stdout) {
  const trimmed = String(stdout || "").trim();
  if (!trimmed) return null;

  const cleaned = trimmed.replace(/```(?:json)?/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  return JSON.parse(cleaned.slice(start, end + 1));
}

function readCache(cacheDir, cacheKey) {
  if (!cacheDir || !cacheKey) return null;
  const hash = crypto.createHash("sha256").update(cacheKey).digest("hex").slice(0, 20);
  const file = path.join(cacheDir, `${hash}.json`);
  try {
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function writeCache(cacheDir, cacheKey, payload) {
  if (!cacheDir || !cacheKey) return;
  try {
    fs.mkdirSync(cacheDir, { recursive: true });
    const hash = crypto.createHash("sha256").update(cacheKey).digest("hex").slice(0, 20);
    const file = path.join(cacheDir, `${hash}.json`);
    fs.writeFileSync(file, JSON.stringify(payload, null, 2), "utf8");
  } catch {
    // non-fatal cache write failure
  }
}

/**
 * Synchronous `agy.exe` JSON call with optional disk cache and instant null fallback.
 */
export function callAgyJsonSync(prompt, { cacheDir = null, cacheKey = null, timeoutMs = 48_000 } = {}) {
  const agyBin = resolveAgyBinary();
  if (!agyBin) return null;

  const cached = readCache(cacheDir, cacheKey);
  if (cached?.data) return cached;

  ensureAgyMcpConfigClean();
  const framedPrompt = [
    "IMPORTANT: Do NOT call any tools, do NOT read files, do NOT run commands.",
    "Respond ONLY with a single valid JSON object (no markdown fences, no commentary).",
    "",
    prompt,
  ].join("\n");

  try {
    const res = spawnSync(
      agyBin,
      [
        "--model",
        AGY_MODEL,
        "--disable-slash-commands",
        "--print-timeout",
        AGY_PRINT_TIMEOUT,
        "-p",
        framedPrompt,
      ],
      {
        cwd: getScratchDir(),
        encoding: "utf8",
        timeout: timeoutMs,
        maxBuffer: 4 * 1024 * 1024,
        windowsHide: true,
      },
    );
    if (res.error || res.status !== 0) return null;
    const data = extractJsonObject(res.stdout);
    if (!data || typeof data !== "object") return null;
    const result = { provider: `agy-cli:${AGY_MODEL}`, data };
    writeCache(cacheDir, cacheKey, result);
    return result;
  } catch {
    return null;
  }
}

/**
 * Asynchronous `agy.exe` JSON call with instant null fallback.
 */
export async function callAgyJson(prompt, { cacheDir = null, cacheKey = null, timeoutMs = 48_000 } = {}) {
  const agyBin = resolveAgyBinary();
  if (!agyBin) return null;

  const cached = readCache(cacheDir, cacheKey);
  if (cached?.data) return cached;

  ensureAgyMcpConfigClean();
  const framedPrompt = [
    "IMPORTANT: Do NOT call any tools, do NOT read files, do NOT run commands.",
    "Respond ONLY with a single valid JSON object (no markdown fences, no commentary).",
    "",
    prompt,
  ].join("\n");

  try {
    const { stdout } = await execFileAsync(
      agyBin,
      [
        "--model",
        AGY_MODEL,
        "--disable-slash-commands",
        "--print-timeout",
        AGY_PRINT_TIMEOUT,
        "-p",
        framedPrompt,
      ],
      {
        cwd: getScratchDir(),
        encoding: "utf8",
        timeout: timeoutMs,
        maxBuffer: 4 * 1024 * 1024,
        windowsHide: true,
      },
    );
    const data = extractJsonObject(stdout);
    if (!data || typeof data !== "object") return null;
    const result = { provider: `agy-cli:${AGY_MODEL}`, data };
    writeCache(cacheDir, cacheKey, result);
    return result;
  } catch {
    return null;
  }
}
