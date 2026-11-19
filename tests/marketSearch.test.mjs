import assert from "node:assert/strict";
import test from "node:test";
import { PRICING_COUNTRIES } from "../src/lib/constants.ts";
import { MARKET_CURRENCY_BADGES, MARKET_SEARCH_TERMS, matchesMarketSearch } from "../src/lib/marketSearch.ts";

test("all 12 pricing countries have multilingual search terms and currency badges", () => {
  assert.equal(PRICING_COUNTRIES.length, 12);
  for (const code of PRICING_COUNTRIES) {
    assert.ok(MARKET_SEARCH_TERMS[code]?.length > 5, `Missing search terms for ${code}`);
    assert.ok(MARKET_CURRENCY_BADGES[code]?.length === 3, `Missing currency badge for ${code}`);
  }
});

test("matchesMarketSearch finds countries across ISO codes, native names, localized labels, and currencies", () => {
  assert.equal(matchesMarketSearch("TR", "Almanya", "", ""), true);
  assert.equal(matchesMarketSearch("TR", "Türkei", "UYAP", "türkiye"), true);
  assert.equal(matchesMarketSearch("TR", "Turkey", "UYAP", "try"), true);
  assert.equal(matchesMarketSearch("GB", "Birleşik Krallık", "Auctions", "uk"), true);
  assert.equal(matchesMarketSearch("CH", "İsviçre", "SHAB", "chf"), true);
  assert.equal(matchesMarketSearch("PL", "Polen", "KRK", "pln"), true);
  assert.equal(matchesMarketSearch("CZ", "Tschechien", "EKČR", "czk"), true);
  assert.equal(matchesMarketSearch("SE", "Schweden", "Kronofogden", "kronofogden"), true);
  assert.equal(matchesMarketSearch("DE", "Almanya", "ZVG", "polonya"), false);
});
