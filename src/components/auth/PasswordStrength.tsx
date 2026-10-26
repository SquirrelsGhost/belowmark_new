import { PASSWORD_RULES } from "@/lib/auth/authConfig";
import { scorePassword } from "@/lib/auth/passwordStrength";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";

interface PasswordStrengthProps {
  id: string;
  password: string;
  strength: IAuthTranslation["Fields"]["Strength"];
}

const SEGMENTS = [1, 2, 3, 4] as const;
const SCORE_COLORS = ["bg-rule", "bg-signal", "bg-caution", "bg-verdict", "bg-verdict"] as const;

/**
 * Four ink segments plus a length counter. Uses the same scorer as the
 * server, so "ordentlich" here means the server will accept it.
 */
export default function PasswordStrength({ id, password, strength }: PasswordStrengthProps) {
  const score = scorePassword(password);
  const long = password.length >= PASSWORD_RULES.minLength;

  return (
    <div id={id} className="grid gap-1.5">
      <div aria-hidden="true" className="grid grid-cols-4 gap-1">
        {SEGMENTS.map((segment) => (
          <span key={segment} className={`h-1 transition-colors duration-300 ${score >= segment ? SCORE_COLORS[score] : "bg-rule"}`} />
        ))}
      </div>
      <div className="flex items-center justify-between font-mono text-[11px] tracking-wider text-muted uppercase">
        <span aria-live="polite">
          {strength.Label}: <span className="font-semibold text-ink">{password ? strength.Levels[score] : "—"}</span>
        </span>
        <span className={long ? "text-verdict" : ""}>
          {long ? "✓ " : ""}
          {strength.Requirement} · {password.length}
        </span>
      </div>
    </div>
  );
}
