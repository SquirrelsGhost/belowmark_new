// Interactive public calculator for 5/10 & 7/10 limits (DE) and UYAP E-Satis deposit/limits (TR)
"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

interface PseoPublicCalculatorProps {
  locale: "de" | "tr";
}

export default function PseoPublicCalculator({ locale }: PseoPublicCalculatorProps) {
  const isTr = locale === "tr";
  const [appraisedValue, setAppraisedValue] = useState<number>(isTr ? 4500000 : 320000);
  const [taxRatePct, setTaxRatePct] = useState<number>(isTr ? 4 : 5.0);
  const [repairBudget, setRepairBudget] = useState<number>(isTr ? 350000 : 25000);

  const currency = isTr ? "TRY" : "EUR";
  const fmt = (val: number) =>
    new Intl.NumberFormat(isTr ? "tr-TR" : "de-DE", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Math.round(val));

  const limit50 = appraisedValue * 0.5;
  const limit70 = appraisedValue * 0.7;
  const deposit10 = appraisedValue * 0.1;
  const courtFee = isTr ? appraisedValue * 0.022 : appraisedValue * 0.009;
  const transferTax = limit70 * (taxRatePct / 100);
  const totalAt70 = limit70 + courtFee + transferTax + repairBudget;
  const discountAt50 = appraisedValue - limit50;

  return (
    <div className="mt-8 grid gap-6 border-2 border-ink bg-paper-bright p-6 sm:p-8 lg:grid-cols-12">
      <div className="space-y-5 lg:col-span-6">
        <div>
          <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink">
            {isTr ? "Muhammen Bedel (Bilirkişi Değeri TRY)" : "Verkehrswert laut Gutachten (§ 74a ZVG in EUR)"}
          </label>
          <input
            type="number"
            min={10000}
            step={5000}
            value={appraisedValue}
            onChange={(e) => setAppraisedValue(Math.max(0, Number(e.target.value) || 0))}
            className="mt-2 h-11 w-full border-2 border-ink bg-paper px-3.5 font-mono text-base font-semibold text-ink"
          />
        </div>

        <div>
          <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink">
            {isTr ? "Tapu Harcı + KDV Oranı (%)" : "Grunderwerbsteuer Bundesland (%)"}
          </label>
          <input
            type="number"
            min={0}
            max={25}
            step={0.5}
            value={taxRatePct}
            onChange={(e) => setTaxRatePct(Math.max(0, Number(e.target.value) || 0))}
            className="mt-2 h-11 w-full border-2 border-ink bg-paper px-3.5 font-mono text-base font-semibold text-ink"
          />
        </div>

        <div>
          <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink">
            {isTr ? "Tahmini Tadilat & Tahliye Bütçesi (TRY)" : "Geplantes Sanierungs- & Räumungspuffer-Budget (EUR)"}
          </label>
          <input
            type="number"
            min={0}
            step={2500}
            value={repairBudget}
            onChange={(e) => setRepairBudget(Math.max(0, Number(e.target.value) || 0))}
            className="mt-2 h-11 w-full border-2 border-ink bg-paper px-3.5 font-mono text-base font-semibold text-ink"
          />
        </div>
      </div>

      <div className="flex flex-col justify-between border-2 border-ink bg-paper-deep p-6 lg:col-span-6">
        <div className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-rule-strong pb-3">
            <span className="font-mono text-xs uppercase text-ink-soft">
              {isTr ? "%10 Elektronik Teminat (UYAP)" : "10 % Sicherheitsleistung (§ 68 ZVG)"}
            </span>
            <span className="font-mono text-lg font-bold text-ink">{fmt(deposit10)}</span>
          </div>

          <div className="flex items-baseline justify-between border-b border-rule-strong pb-3">
            <span className="font-mono text-xs uppercase text-ink-soft">
              {isTr ? "%50 Artırma Alt Sınırı (+ Masraf)" : "5/10-Grenze (§ 85a ZVG Mindestgebot)"}
            </span>
            <span className="font-mono text-xl font-bold text-signal">{fmt(limit50)}</span>
          </div>

          <div className="flex items-baseline justify-between border-b border-rule-strong pb-3">
            <span className="font-mono text-xs uppercase text-ink-soft">
              {isTr ? "%70 Güvenli Teklif Eşiği" : "7/10-Grenze (§ 74a ZVG Gläubigerschutz)"}
            </span>
            <span className="font-mono text-lg font-bold text-ink">{fmt(limit70)}</span>
          </div>

          <div className="flex items-baseline justify-between border-b border-rule-strong pb-3">
            <span className="font-mono text-xs uppercase text-ink-soft">
              {isTr ? "Toplam Maliyet (%70 + Harç + Tadilat)" : "Gesamtkapitalbedarf bei 7/10 inkl. Steuer & Sanierung"}
            </span>
            <span className="font-mono text-lg font-bold text-ink">{fmt(totalAt70)}</span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs uppercase text-ink-soft">
              {isTr ? "Piyasa Değeri Avantajı (%50'de)" : "Rechnerischer Abschlag bei 5/10-Zuschlag"}
            </span>
            <span className="font-mono text-base font-semibold text-signal">-{fmt(discountAt50)}</span>
          </div>
        </div>

        <div className="mt-6 pt-4">
          <Link
            href={ROUTES.signup}
            className="inline-flex h-11 w-full items-center justify-center border-2 border-signal bg-signal px-5 font-narrow text-xs font-semibold uppercase tracking-wider text-paper-bright hover:bg-signal-deep"
          >
            {isTr
              ? "14.752 İcra İlanında Otomatik Hesapla →"
              : "Jetzt für alle 3.803 ZVG-Objekte inkl. Abteilung II prüfen →"}
          </Link>
        </div>
      </div>
    </div>
  );
}
