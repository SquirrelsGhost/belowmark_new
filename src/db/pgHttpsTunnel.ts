import { Duplex } from "node:stream";
import tls from "node:tls";
import type { PoolConfig } from "pg";

interface TunnelOptions {
  host: string;
  port: number;
  path: string;
  tunnelKey: string;
}

const MAX_UPGRADE_HEADER_BYTES = 8192;

class PgHttpsTunnelStream extends Duplex {
  private readonly opts: TunnelOptions;
  private socket: tls.TLSSocket | null = null;
  private noDelay = true;
  private keepAlive = false;
  private keepAliveDelay = 0;
  private upgraded = false;
  private headerBuf: Buffer = Buffer.alloc(0);
  private pendingWrites: Array<{ chunk: Buffer; callback: (error?: Error | null) => void }> = [];

  constructor(opts: TunnelOptions) {
    super();
    this.opts = opts;
  }

  connect(): this {
    const sock = tls.connect({
      host: this.opts.host,
      port: this.opts.port,
      servername: this.opts.host,
      ALPNProtocols: ["http/1.1"],
      rejectUnauthorized: true,
    });
    this.socket = sock;
    sock.setNoDelay(this.noDelay);
    if (this.keepAlive) {
      sock.setKeepAlive(true, this.keepAliveDelay);
    }

    sock.once("secureConnect", () => {
      const req =
        `GET ${this.opts.path} HTTP/1.1\r\n` +
        `Host: ${this.opts.host}\r\n` +
        `Connection: Upgrade\r\n` +
        `Upgrade: bm-pg-raw\r\n` +
        `X-BM-Tunnel-Key: ${this.opts.tunnelKey}\r\n\r\n`;
      sock.write(req);
    });

    sock.on("data", (chunk: Buffer) => {
      if (!this.upgraded) {
        this.headerBuf = Buffer.concat([this.headerBuf, chunk]);
        const sepIdx = this.headerBuf.indexOf("\r\n\r\n");
        if (sepIdx === -1) {
          if (this.headerBuf.length > MAX_UPGRADE_HEADER_BYTES) {
            this.destroy(new Error("[pgHttpsTunnel] Upgrade response header exceeded limit"));
          }
          return;
        }
        const headerText = this.headerBuf.subarray(0, sepIdx).toString("latin1");
        const statusLine = headerText.split("\r\n")[0] ?? "";
        if (!statusLine.startsWith("HTTP/1.1 101 ")) {
          this.destroy(new Error(`[pgHttpsTunnel] Upgrade rejected: ${statusLine}`));
          return;
        }
        const rest = this.headerBuf.subarray(sepIdx + 4);
        this.headerBuf = Buffer.alloc(0);
        this.upgraded = true;
        this.emit("connect");

        for (const item of this.pendingWrites.splice(0)) {
          sock.write(item.chunk, item.callback);
        }
        if (rest.length > 0 && !this.push(rest)) {
          sock.pause();
        }
        return;
      }

      if (!this.push(chunk)) {
        sock.pause();
      }
    });

    sock.once("end", () => {
      this.push(null);
    });

    sock.once("error", (err) => {
      this.destroy(err);
    });

    sock.once("close", () => {
      if (!this.destroyed) {
        this.destroy();
      }
    });

    return this;
  }

  override _read(): void {
    this.socket?.resume();
  }

  override _write(chunk: Buffer, _encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
    if (!this.socket || !this.upgraded) {
      this.pendingWrites.push({ chunk, callback });
      return;
    }
    this.socket.write(chunk, callback);
  }

  override _final(callback: (error?: Error | null) => void): void {
    if (this.socket && !this.socket.destroyed) {
      this.socket.end(callback);
    } else {
      callback();
    }
  }

  override _destroy(error: Error | null, callback: (error: Error | null) => void): void {
    if (this.socket && !this.socket.destroyed) {
      this.socket.destroy();
    }
    for (const item of this.pendingWrites.splice(0)) {
      item.callback(error ?? new Error("[pgHttpsTunnel] Stream destroyed before connect"));
    }
    callback(error);
  }

  setNoDelay(noDelay = true): this {
    this.noDelay = noDelay;
    this.socket?.setNoDelay(noDelay);
    return this;
  }

  setKeepAlive(enable = false, initialDelay = 0): this {
    this.keepAlive = enable;
    this.keepAliveDelay = initialDelay;
    this.socket?.setKeepAlive(enable, initialDelay);
    return this;
  }

  ref(): this {
    this.socket?.ref();
    return this;
  }

  unref(): this {
    this.socket?.unref();
    return this;
  }
}

/**
 * Builds a `pg.PoolConfig` / `pg.ClientConfig` from a PostgreSQL URL.
 * Supports `?pgtunnel=https&tunnelkey=...` for TLS-443 HTTP/1.1 Upgrade passthrough
 * through cloud firewalls that block raw TCP 5432.
 */
export function buildPgConnectionConfig(connectionString: string, extra?: Partial<PoolConfig>): PoolConfig {
  try {
    const url = new URL(connectionString);
    if (url.searchParams.get("pgtunnel") === "https") {
      const host = url.hostname;
      const port = Number(url.port || "443");
      const path = url.searchParams.get("tunnelpath") || "/_bm_pg_tunnel";
      const tunnelKey = url.searchParams.get("tunnelkey") || "";
      return {
        ...extra,
        host,
        port,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: decodeURIComponent(url.pathname.replace(/^\//, "")),
        ssl: false,
        stream: () => new PgHttpsTunnelStream({ host, port, path, tunnelKey }),
      };
    }
  } catch {
    // Fall back to standard connectionString handling
  }
  return { ...extra, connectionString };
}
