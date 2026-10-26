import { DAY_MS } from "@/lib/appConstants";
import { TcmbEuroRate } from "@/types/trIndicators.types";

/** The TCMB publishes on working days; older than this and the rate is not used. */
export const RATE_MAX_AGE_DAYS = 5;

export function isRateFresh(rate: TcmbEuroRate, now: number): boolean {
  const published = Date.parse(`${rate.meta.date}T00:00:00+03:00`);
  return Number.isFinite(published) && now - published <= RATE_MAX_AGE_DAYS * DAY_MS;
}

/** Lira to euro at the TCMB forex buying rate. */
export const liraToEuro = (lira: number, rate: TcmbEuroRate): number => lira / rate.eur.buying;

export const euroToLira = (euro: number, rate: TcmbEuroRate): number => euro * rate.eur.buying;
