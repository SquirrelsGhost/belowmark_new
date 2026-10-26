import BidLimitField from "@/components/app/bidding/BidLimitField";
import BidLimitInputGroup from "@/components/app/bidding/BidLimitInputGroup";
import { FIELD_GROUPS, FIELD_UNITS, FieldUnit, ZVG_ONLY_FIELDS } from "@/lib/bidding/biddingConstants";
import { MarketCode } from "@/lib/constants";
import { IBiddingTranslation } from "@/translations/bidding/IBiddingTranslation";
import { BidInputKey, BidInputs } from "@/types/bidding.types";

interface BidLimitInputsProps {
  labels: IBiddingTranslation["Limit"];
  market: MarketCode;
  inputs: BidInputs;
  /** e.g. { money: "€", pct: "%", m2: "m²", days: "Tage" } */
  suffixes: Record<FieldUnit, string>;
  /** Area the notice states (TR), offered as the hint of the area field */
  noticeAreaHint: string | null;
  onChange: (key: BidInputKey, value: number | null) => void;
}

/** Every input of the bid limit, grouped; ZVG-only fields only for German proceedings. */
export default function BidLimitInputs({ labels, market, inputs, suffixes, noticeAreaHint, onChange }: BidLimitInputsProps) {
  return (
    <div className="flex flex-col gap-5">
      {FIELD_GROUPS.map(({ group, fields }) => (
        <BidLimitInputGroup key={group} title={labels.Groups[group]}>
          {fields
            .filter((key) => market === "DE" || !ZVG_ONLY_FIELDS.includes(key))
            .map((key) => (
              <BidLimitField
                key={key}
                id={`bietlimit-${key}`}
                label={labels.Fields[key].label}
                hint={key === "areaM2" && noticeAreaHint ? noticeAreaHint : labels.Fields[key].hint}
                suffix={suffixes[FIELD_UNITS[key]]}
                value={inputs[key]}
                onChange={(value) => onChange(key, value)}
              />
            ))}
        </BidLimitInputGroup>
      ))}
    </div>
  );
}
