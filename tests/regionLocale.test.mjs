import assert from "node:assert/strict";
import test from "node:test";
import {
  detectCountryFromTimeZone,
  formatGeoScopedCookie,
  normalizeGeoCountryCode,
  parseGeoScopedCookie,
  parsePrimaryAcceptLanguage,
  resolveFallbackFromAcceptLanguage,
  resolveLocaleForCountry,
  resolvePricingCountryForDetected,
} from "../src/lib/regionLocale.ts";

test("normalizeGeoCountryCode normalizes valid ISO codes and rejects sentinels", () => {
  assert.equal(normalizeGeoCountryCode("de"), "DE");
  assert.equal(normalizeGeoCountryCode(" tr "), "TR");
  assert.equal(normalizeGeoCountryCode("uk"), "GB");
  assert.equal(normalizeGeoCountryCode("XX"), null);
  assert.equal(normalizeGeoCountryCode("ZZ"), null);
  assert.equal(normalizeGeoCountryCode("T1"), null);
  assert.equal(normalizeGeoCountryCode(""), null);
  assert.equal(normalizeGeoCountryCode(undefined), null);
});

test("parsePrimaryAcceptLanguage respects q-values and declaration order", () => {
  assert.equal(parsePrimaryAcceptLanguage("de-DE,de;q=0.9,en-US;q=0.8"), "de-de");
  assert.equal(parsePrimaryAcceptLanguage("fr;q=0.6, it-IT;q=0.9, en;q=0.8"), "it-it");
  assert.equal(parsePrimaryAcceptLanguage("*;q=0.5"), null);
  assert.equal(parsePrimaryAcceptLanguage(""), null);
});

test("resolveLocaleForCountry maps countries to their native language and defaults all others to English", () => {
  // DACH
  assert.equal(resolveLocaleForCountry("DE"), "de");
  assert.equal(resolveLocaleForCountry("AT"), "de");
  assert.equal(resolveLocaleForCountry("LI"), "de");
  assert.equal(resolveLocaleForCountry("CH"), "de");
  assert.equal(resolveLocaleForCountry("CH", "fr-CH,fr;q=0.9"), "fr");
  assert.equal(resolveLocaleForCountry("CH", "it-CH,it;q=0.9"), "it");

  // Direct localized markets
  assert.equal(resolveLocaleForCountry("TR"), "tr");
  assert.equal(resolveLocaleForCountry("IT"), "it");
  assert.equal(resolveLocaleForCountry("SM"), "it");
  assert.equal(resolveLocaleForCountry("ES"), "es");
  assert.equal(resolveLocaleForCountry("MX"), "es");
  assert.equal(resolveLocaleForCountry("AR"), "es");
  assert.equal(resolveLocaleForCountry("FR"), "fr");
  assert.equal(resolveLocaleForCountry("MC"), "fr");
  assert.equal(resolveLocaleForCountry("GB"), "en");

  // Newly localized European markets -> native UI language
  assert.equal(resolveLocaleForCountry("NL"), "nl");
  assert.equal(resolveLocaleForCountry("PL"), "pl");
  assert.equal(resolveLocaleForCountry("CZ"), "cs");
  assert.equal(resolveLocaleForCountry("SE"), "sv");

  // Rest of the world & unknown -> English default (even if browser were e.g. pt-BR or ja)
  assert.equal(resolveLocaleForCountry("US"), "en");
  assert.equal(resolveLocaleForCountry("AE"), "en");
  assert.equal(resolveLocaleForCountry("PT"), "en");
  assert.equal(resolveLocaleForCountry("GR"), "en");
  assert.equal(resolveLocaleForCountry("JP"), "en");
  assert.equal(resolveLocaleForCountry("AU"), "en");
  assert.equal(resolveLocaleForCountry(null), "en");
});

test("resolveLocaleForCountry handles multilingual BE/LU/CA/CY nuances", () => {
  assert.equal(resolveLocaleForCountry("BE", "fr-BE,fr;q=0.9"), "fr");
  assert.equal(resolveLocaleForCountry("BE", "nl-BE,nl;q=0.9"), "nl");
  assert.equal(resolveLocaleForCountry("CA", "fr-CA,fr;q=0.9"), "fr");
  assert.equal(resolveLocaleForCountry("CA", "en-CA,en;q=0.9"), "en");
  assert.equal(resolveLocaleForCountry("CY", "tr-TR,tr;q=0.9"), "tr");
  assert.equal(resolveLocaleForCountry("CY", "el-CY,el;q=0.9"), "en");
});

test("resolvePricingCountryForDetected maps supported markets and marks unmatched countries", () => {
  assert.deepEqual(resolvePricingCountryForDetected("DE"), { pricingCountry: "DE", isCountryMatched: true });
  assert.deepEqual(resolvePricingCountryForDetected("TR"), { pricingCountry: "TR", isCountryMatched: true });
  assert.deepEqual(resolvePricingCountryForDetected("IT"), { pricingCountry: "IT", isCountryMatched: true });
  assert.deepEqual(resolvePricingCountryForDetected("IE"), { pricingCountry: "GB", isCountryMatched: true });
  assert.deepEqual(resolvePricingCountryForDetected("US"), { pricingCountry: "DE", isCountryMatched: false });
  assert.deepEqual(resolvePricingCountryForDetected(null), { pricingCountry: "DE", isCountryMatched: false });
});

test("resolveFallbackFromAcceptLanguage defaults to English when unmatched", () => {
  assert.deepEqual(resolveFallbackFromAcceptLanguage("de-DE,de;q=0.9"), { countryCode: "DE", locale: "de" });
  assert.deepEqual(resolveFallbackFromAcceptLanguage("de-AT,de;q=0.9"), { countryCode: "AT", locale: "de" });
  assert.deepEqual(resolveFallbackFromAcceptLanguage("tr-TR,tr;q=0.9"), { countryCode: "TR", locale: "tr" });
  assert.deepEqual(resolveFallbackFromAcceptLanguage("es-MX,es;q=0.9"), { countryCode: "ES", locale: "es" });
  assert.deepEqual(resolveFallbackFromAcceptLanguage("pt-BR,pt;q=0.9"), { countryCode: null, locale: "en" });
  assert.deepEqual(resolveFallbackFromAcceptLanguage(""), { countryCode: null, locale: "en" });
});

test("detectCountryFromTimeZone maps European, Turkish and international timezones accurately", () => {
  assert.equal(detectCountryFromTimeZone("Europe/Berlin"), "DE");
  assert.equal(detectCountryFromTimeZone("Europe/Vienna"), "AT");
  assert.equal(detectCountryFromTimeZone("Europe/Zurich"), "CH");
  assert.equal(detectCountryFromTimeZone("Europe/Istanbul"), "TR");
  assert.equal(detectCountryFromTimeZone("Europe/Rome"), "IT");
  assert.equal(detectCountryFromTimeZone("Europe/Madrid"), "ES");
  assert.equal(detectCountryFromTimeZone("Europe/Paris"), "FR");
  assert.equal(detectCountryFromTimeZone("Europe/London"), "GB");
  assert.equal(detectCountryFromTimeZone("Europe/Amsterdam"), "NL");
  assert.equal(detectCountryFromTimeZone("America/Mexico_City"), "MX");
  assert.equal(detectCountryFromTimeZone("America/New_York"), "US");
  assert.equal(detectCountryFromTimeZone("Asia/Dubai"), "US");
  assert.equal(detectCountryFromTimeZone("UTC"), null);
  assert.equal(detectCountryFromTimeZone(""), null);
});

test("parseGeoScopedCookie invalidates stale cookies when visitor travels to another country", () => {
  const cookieInDe = formatGeoScopedCookie("DE", "de");
  assert.equal(cookieInDe, "DE:de");
  // Still in DE -> valid
  assert.equal(parseGeoScopedCookie(cookieInDe, "DE"), "de");
  // Traveled to TR -> invalidated (returns null so TR auto-detection wins!)
  assert.equal(parseGeoScopedCookie(cookieInDe, "TR"), null);
  // Legacy unscoped cookie ("DE") -> rejected (returns null!)
  assert.equal(parseGeoScopedCookie("DE", "TR"), null);
  assert.equal(parseGeoScopedCookie("DE", "DE"), null);
  // Localhost / no geo country -> uses "--" scope
  const localCookie = formatGeoScopedCookie(null, "en");
  assert.equal(parseGeoScopedCookie(localCookie, null), "en");
  assert.equal(parseGeoScopedCookie(localCookie, "TR"), null);
});
