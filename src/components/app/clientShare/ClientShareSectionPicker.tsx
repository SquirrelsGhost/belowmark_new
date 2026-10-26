import { LABEL_CLASSES } from "@/lib/appStyles";
import { CLIENT_SHARE_SECTIONS } from "@/lib/clientShare/clientShareConfig";
import { ClientShareSection } from "@/types/clientShare.types";

interface ClientShareSectionPickerProps {
  legend: string;
  names: Record<ClientShareSection, string>;
  hints: Record<ClientShareSection, string>;
}

/** Checkboxes for the parts of the link; all on by default, the broker takes out what the client should not see. */
export default function ClientShareSectionPicker({ legend, names, hints }: ClientShareSectionPickerProps) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className={`${LABEL_CLASSES} mb-1`}>{legend}</legend>
      {CLIENT_SHARE_SECTIONS.map((section) => (
        <label key={section} className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" name="sections" value={section} defaultChecked className="mt-1 size-4 accent-signal" />
          <span>
            <span className="block text-sm font-semibold">{names[section]}</span>
            <span className="block text-[12px] leading-snug text-muted">{hints[section]}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}
