interface HoneypotProps {
  id?: string;
}

const DEFAULT_ID = "website";
const HONEYPOT_LABEL = "Website";

/** Field people never see; a filled one marks the submission as automated. */
export default function Honeypot({ id = DEFAULT_ID }: HoneypotProps = {}) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={id}>{HONEYPOT_LABEL}</label>
      <input id={id} name={DEFAULT_ID} type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
