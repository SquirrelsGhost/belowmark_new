import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { isRateFresh } from "@/lib/tr/currency";
import { isTufeStale } from "@/lib/tr/inflation";
import { TcmbEuroRate, TufeSeries } from "@/types/trIndicators.types";

/** Literal paths so the bundler can trace the files. A missing or broken file means "no figure". */
async function readJson<T>(file: "tufe" | "kurs"): Promise<T | null> {
  try {
    const raw =
      file === "tufe"
        ? await readFile(join(process.cwd(), "data", "tr", "tufe.json"), "utf8")
        : await readFile(join(process.cwd(), "data", "tr", "kurs.json"), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export interface TrIndicators {
  /** null when the file is missing or the series lags more than three months */
  tufe: TufeSeries | null;
  /** null when no rate was fetched or it is older than five days */
  euro: TcmbEuroRate | null;
  /** Date of the last rate on file, also when it is too old to use — to say why there is none */
  euroDate: string | null;
}

/**
 * TrIndicatorService
 *
 * Official Turkish reference figures next to the notice data: the consumer
 * price index (TÜFE) and the TCMB euro rate. Both are files written by
 * scripts — read per request, so a new file needs no restart.
 */
export class TrIndicatorService {
  static get = async (now: number): Promise<TrIndicators> => {
    const [tufe, euro] = await Promise.all([readJson<TufeSeries>("tufe"), readJson<TcmbEuroRate>("kurs")]);
    return {
      tufe: tufe && !isTufeStale(tufe, now) ? tufe : null,
      euro: euro && isRateFresh(euro, now) ? euro : null,
      euroDate: euro?.meta.date ?? null,
    };
  };
}
