// Reads the broker's figures from this browser's storage at submit time and sends them with the form
"use client";

import { useActionState } from "react";
import ClientShareCreated from "@/components/app/clientShare/ClientShareCreated";
import ClientShareSectionPicker from "@/components/app/clientShare/ClientShareSectionPicker";
import { CONTROL_CLASSES, LABEL_CLASSES } from "@/lib/appStyles";
import { fill } from "@/lib/appFormat";
import { bankFileKey } from "@/lib/bankFile/bankFileConstants";
import { inputsKey } from "@/lib/bidding/biddingStorage";
import { CLIENT_SHARE } from "@/lib/clientShare/clientShareConfig";
import { ClientShareActionState, createClientShareAction } from "@/lib/clientShare/clientShareActions";
import { LocaleOption } from "@/lib/constants";
import { verdictAnswersKey } from "@/lib/verdict/verdictConstants";
import { IClientShareTranslation } from "@/translations/clientShare/IClientShareTranslation";

interface ClientShareFormProps {
  listingKey: string;
  defaultLocale: LocaleOption;
  labels: IClientShareTranslation;
}

const read = (key: string): string => {
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
};

const SUBMIT = "inline-flex h-11 cursor-pointer items-center bg-signal px-5 font-narrow text-sm font-semibold tracking-[0.08em] text-paper-bright uppercase shadow-[4px_4px_0_0_var(--ink)] disabled:opacity-60";

/** What the client will see, for how long and in which language — then the link, once. */
export default function ClientShareForm({ listingKey, defaultLocale, labels }: ClientShareFormProps) {
  const [state, formAction, isPending] = useActionState<ClientShareActionState, FormData>(createClientShareAction, { ok: true });
  const { Form, Errors } = labels;

  const submit = (formData: FormData) => {
    formData.set("bidInputs", read(inputsKey(listingKey)));
    formData.set("answers", read(verdictAnswersKey(listingKey)));
    formData.set("bank", read(bankFileKey(listingKey)));
    formAction(formData);
  };

  if (state.ok && state.path && state.printPath) return <ClientShareCreated path={state.path} printPath={state.printPath} labels={labels.Created} />;

  return (
    <form action={submit} className="grid grid-cols-1 gap-5 border border-rule-strong bg-paper-bright p-5 lg:grid-cols-2">
      <input type="hidden" name="listingKey" value={listingKey} />
      <ClientShareSectionPicker legend={Form.Sections} names={Form.SectionNames} hints={Form.SectionHints} />
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className={LABEL_CLASSES}>{Form.Expiry}</span>
            <select name="expiryDays" defaultValue={CLIENT_SHARE.defaultExpiryDays} className={CONTROL_CLASSES}>
              {CLIENT_SHARE.expiryDays.map((days) => (
                <option key={days} value={days}>
                  {fill(Form.ExpiryOption, { days })}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className={LABEL_CLASSES}>{Form.Language}</span>
            <select name="locale" defaultValue={defaultLocale} className={CONTROL_CLASSES}>
              <option value="de">{Form.Languages.de}</option>
              <option value="tr">{Form.Languages.tr}</option>
            </select>
          </label>
        </div>
        <label className="flex flex-col gap-1">
          <span className={LABEL_CLASSES}>{Form.Label}</span>
          <input name="label" maxLength={CLIENT_SHARE.labelMax} autoComplete="off" className={CONTROL_CLASSES} />
          <span className="text-[11px] leading-snug text-muted">{Form.LabelHint}</span>
        </label>
        <label className="flex flex-col gap-1">
          <span className={LABEL_CLASSES}>{Form.Message}</span>
          <textarea name="message" rows={3} maxLength={CLIENT_SHARE.messageMax} placeholder={Form.MessagePlaceholder} className={`${CONTROL_CLASSES} h-auto py-2`} />
        </label>
      </div>
      <div className="flex flex-col gap-3 lg:col-span-2">
        <p className="text-[12px] leading-snug text-muted">{Form.Frozen}</p>
        {!state.ok && state.error && (
          <p role="alert" className="border-l-4 border-signal px-2 text-sm text-signal">
            {Errors[state.error]}
          </p>
        )}
        <div>
          <button type="submit" disabled={isPending} className={SUBMIT}>
            {isPending ? Form.Submitting : Form.Submit}
          </button>
        </div>
      </div>
    </form>
  );
}
