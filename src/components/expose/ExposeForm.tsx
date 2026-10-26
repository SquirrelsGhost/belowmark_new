// Edits the seller's exposé inputs kept in localStorage; the sheet below follows live
"use client";

import ExposeFormContact from "@/components/expose/ExposeFormContact";
import ExposeFormEnergy from "@/components/expose/ExposeFormEnergy";
import ExposeFormObject from "@/components/expose/ExposeFormObject";
import ExposeFormOffer from "@/components/expose/ExposeFormOffer";
import ExposeFormTexts from "@/components/expose/ExposeFormTexts";
import { useExpose } from "@/hooks/useExpose";
import { TEXT_LINK_CLASSES } from "@/lib/appStyles";
import { MarketCode } from "@/lib/constants";
import { IExposeTranslation } from "@/translations/expose/IExposeTranslation";

interface ExposeFormProps {
  listingId: string;
  market: MarketCode;
  currency: string;
  labels: IExposeTranslation;
}

/** Screen-only panel: everything only the seller can know. Never printed. */
export default function ExposeForm({ listingId, market, currency, labels }: ExposeFormProps) {
  const { inputs, setInputs, reset } = useExpose(listingId);
  const { Form } = labels;
  const group = { inputs, setInputs, market, currency };
  return (
    <section aria-label={Form.Title} className="flex flex-col gap-4 border-2 border-ink bg-paper-bright p-5">
      <div>
        <h2 className="font-narrow text-sm font-bold tracking-[0.14em] uppercase">{Form.Title}</h2>
        <p className="mt-1 text-[13px] leading-snug text-ink-soft">{Form.Lead}</p>
      </div>
      <ExposeFormOffer {...group} labels={Form} priceTypes={labels.Sheet.PriceTypes} roles={labels.Contact.Roles} />
      <ExposeFormObject {...group} labels={Form} facts={labels.Facts} />
      <ExposeFormEnergy {...group} labels={Form} energy={labels.Energy} />
      <ExposeFormTexts inputs={inputs} setInputs={setInputs} labels={Form} />
      <ExposeFormContact inputs={inputs} setInputs={setInputs} labels={Form} />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-3">
        <p className="text-[11px] text-muted">{Form.StorageHint}</p>
        <button type="button" onClick={reset} className={`${TEXT_LINK_CLASSES} cursor-pointer text-muted`}>
          {Form.Reset}
        </button>
      </div>
    </section>
  );
}
