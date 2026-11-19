// Needs state and transition to switch country & preview local prices directly inside /konto
"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import AccountPlanCard from "@/components/account/AccountPlanCard";
import AuthTextLink from "@/components/auth/AuthTextLink";
import BillingNotice from "@/components/billing/BillingNotice";
import MarketDropdown, { MarketDropdownOption } from "@/components/ui/MarketDropdown";
import { AccountPlanCardView } from "@/lib/billing/accountOfferView";
import { fill } from "@/lib/billing/billingFormat";
import { LocaleOption, PricingCountryCode } from "@/lib/constants";
import { setMarketAction } from "@/lib/regionActions";

interface AccountOfferPickerProps {
  title: string;
  lead: string;
  marketLabel: string;
  initialCountry: PricingCountryCode;
  locale: LocaleOption;
  cardsByMarket: Record<PricingCountryCode, AccountPlanCardView[]>;
  marketOptions: readonly MarketDropdownOption[];
  closedNotices: Partial<Record<PricingCountryCode, string>>;
  currentLabel: string;
  /** Template: "Preise für {country}." */
  countryNoteTemplate: string;
  team: { question: string; href: string; label: string };
}

/** "Paket wählen": interactive 12-country switcher + Investor and Pro side by side. */
export default function AccountOfferPicker({
  title,
  lead,
  marketLabel,
  initialCountry,
  locale,
  cardsByMarket,
  marketOptions,
  closedNotices,
  currentLabel,
  countryNoteTemplate,
  team,
}: AccountOfferPickerProps) {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<PricingCountryCode>(initialCountry);
  const [isPending, startTransition] = useTransition();

  const cards = cardsByMarket[selectedCountry] ?? cardsByMarket[initialCountry];
  const selectedMeta = marketOptions.find((m) => m.code === selectedCountry) ?? marketOptions[0];
  const closedNotice = closedNotices[selectedCountry];
  const displayCode = selectedCountry === "GB" ? "UK" : selectedCountry;
  const formattedCountry = `${selectedMeta.label} (${displayCode})`;

  const handleCountryChange = (next: PricingCountryCode) => {
    setSelectedCountry(next);
    startTransition(async () => {
      try {
        await setMarketAction(next);
        router.refresh();
      } catch {}
    });
  };

  return (
    <div className="mt-8 grid min-w-0 gap-5">
      <div>
        <h3 className="font-narrow text-lg font-semibold tracking-[0.04em] uppercase">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{lead}</p>
      </div>

      <div className="grid min-w-0 gap-2 border-2 border-ink/25 bg-paper p-3.5 sm:p-4">
        <label htmlFor="account-market-select" className="font-mono text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
          <span className="text-signal">●</span> {marketLabel}
        </label>
        <MarketDropdown
          id="account-market-select"
          value={selectedCountry}
          locale={locale}
          disabled={isPending}
          onChange={handleCountryChange}
          options={marketOptions}
        />
      </div>

      {closedNotice && <BillingNotice tone="signal" message={closedNotice} />}

      <div className="grid min-w-0 items-start gap-5 md:grid-cols-2">
        {cards.map((card) => (
          <AccountPlanCard key={card.plan} card={card} currentLabel={currentLabel} />
        ))}
      </div>

      <p className="flex flex-wrap items-baseline gap-x-4 gap-y-2 text-xs text-muted">
        <span>{fill(countryNoteTemplate, { country: formattedCountry })}</span>
        <span aria-hidden="true">·</span>
        <span>{team.question}</span>
        <AuthTextLink href={team.href} label={team.label} size="xs" />
      </p>
    </div>
  );
}
