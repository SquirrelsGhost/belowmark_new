import { useCallback, useMemo } from "react";
import { useStoredText } from "@/hooks/useStoredText";
import { bankFileKey } from "@/lib/bankFile/bankFileConstants";
import { parseBankFileInputs } from "@/lib/bankFile/bankFileStorage";
import { getFinancingRequest, getPaymentSteps } from "@/lib/bankFile/financingRequest";
import { inputsKey, parseInputs } from "@/lib/bidding/biddingStorage";
import { getBidLimit } from "@/lib/bidding/bidLimit";
import { BankFileInputs, FinancingRequest, PaymentStep } from "@/types/bankFile.types";
import { BidContext, BidInputs } from "@/types/bidding.types";

export interface BankFileState {
  bank: BankFileInputs;
  bidInputs: BidInputs;
  request: FinancingRequest;
  steps: PaymentStep[];
  setBank: (patch: Partial<BankFileInputs>) => void;
  /** Equity and repayment are the same facts as in the bid limit — they are kept there */
  setBidInput: (patch: Partial<BidInputs>) => void;
  reset: () => void;
}

/**
 * The bank file's live state from localStorage: its own inputs plus the bid
 * limit's figures, so both screens always show the same equity and costs.
 */
export function useBankFile(listingId: string, context: BidContext): BankFileState {
  const [bankRaw, writeBank] = useStoredText(bankFileKey(listingId));
  const [bidRaw, writeBid] = useStoredText(inputsKey(listingId));
  const bank = useMemo(() => parseBankFileInputs(bankRaw), [bankRaw]);
  const bidInputs = useMemo(() => parseInputs(bidRaw), [bidRaw]);
  const limit = useMemo(() => getBidLimit(context, bidInputs), [context, bidInputs]);
  const request = useMemo(() => getFinancingRequest(context, bidInputs, bank, limit), [context, bidInputs, bank, limit]);
  const steps = useMemo(() => getPaymentSteps(context, request, bank), [context, request, bank]);

  const setBank = useCallback((patch: Partial<BankFileInputs>) => writeBank(JSON.stringify({ ...bank, ...patch })), [bank, writeBank]);
  const setBidInput = useCallback((patch: Partial<BidInputs>) => writeBid(JSON.stringify({ ...bidInputs, ...patch })), [bidInputs, writeBid]);
  const reset = useCallback(() => writeBank(null), [writeBank]);

  return { bank, bidInputs, request, steps, setBank, setBidInput, reset };
}
