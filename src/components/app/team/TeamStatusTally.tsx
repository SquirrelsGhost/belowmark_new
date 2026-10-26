import { TEAM_STATUSES, TeamStatus } from "@/lib/team/teamConfig";
import { STATUS_TONES } from "@/lib/team/teamStyles";

interface TeamStatusTallyProps {
  counts: Record<TeamStatus, number>;
  labels: Record<TeamStatus, string>;
}

/** How many proceedings sit in each status — the team's work at a glance. */
export default function TeamStatusTally({ counts, labels }: TeamStatusTallyProps) {
  return (
    <dl className="grid grid-cols-4 border-y border-rule">
      {TEAM_STATUSES.map((status) => (
        <div key={status} className="border-r border-rule px-2 py-2 last:border-r-0">
          <dt className={`flex items-center gap-1 font-mono text-[9px] tracking-[0.12em] uppercase ${STATUS_TONES[status].text}`}>
            <span aria-hidden="true" className={`size-1.5 rounded-full ${STATUS_TONES[status].dot}`} />
            {labels[status]}
          </dt>
          <dd className="mt-0.5 font-display text-2xl leading-none">{counts[status]}</dd>
        </div>
      ))}
    </dl>
  );
}
