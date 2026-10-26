import Button from "@/components/ui/Button";
import TeamActionButton from "@/components/app/team/TeamActionButton";
import TeamEmpty from "@/components/app/team/TeamEmpty";
import TeamListing from "@/components/app/team/TeamListing";
import TeamListingMissing from "@/components/app/team/TeamListingMissing";
import TeamListingRow from "@/components/app/team/TeamListingRow";
import TeamStatusFilter from "@/components/app/team/TeamStatusFilter";
import TeamStatusPicker from "@/components/app/team/TeamStatusPicker";
import { APP_ROUTES, listingHref } from "@/lib/appConstants";
import { fill, getDateParts } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { getPlaceTitle, getStatusLabel } from "@/lib/listingLabels";
import { getHearingStatus, getNextDate } from "@/lib/listingMath";
import { removeFromTeamAction } from "@/lib/team/teamBoardActions";
import { TEAM_PARAMS, TEAM_STATUSES, teamHref, TeamStatus } from "@/lib/team/teamConfig";
import { canDo } from "@/lib/team/teamRoles";
import { ListingService } from "@/services/ListingService";
import { TeamBoardService } from "@/services/team/TeamBoardService";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { ITeamTranslation } from "@/translations/team/ITeamTranslation";
import { TeamView } from "@/types/team.types";

interface TeamBoardViewProps {
  team: TeamView;
  filter: TeamStatus | null;
  t: ITeamTranslation;
  app: IAppTranslation;
  locale: LocaleOption;
  now: number;
}

/** The team's shared list, filtered by status, newest status change first. */
export default async function TeamBoardView({ team, filter, t, app, locale, now }: TeamBoardViewProps) {
  const { Team: T } = t;
  const entries = await TeamBoardService.list(team.id);
  const listings = new Map((await ListingService.getMany(team.market, entries.map((entry) => entry.listingId))).map((listing) => [listing.key, listing]));
  const shown = filter ? entries.filter((entry) => entry.status === filter) : entries;
  const canEdit = team.isActive && canDo(team.role, "setStatus");
  const date = (value: Date) => formatDate(value.toISOString(), locale);
  const base = teamHref(team.id);

  if (entries.length === 0) {
    return (
      <TeamEmpty title={T.Empty.Title} body={T.Empty.Body}>
        <Button label={T.Empty.Cta} href={APP_ROUTES.search} variant="ink" withArrow />
      </TeamEmpty>
    );
  }

  return (
    <>
      <TeamStatusFilter
        label={T.Filter.Label}
        options={[
          { href: base, label: T.Filter.All, count: entries.length, status: null, isActive: filter === null },
          ...TEAM_STATUSES.map((status) => ({
            href: `${base}?${TEAM_PARAMS.status}=${status}`,
            label: t.Statuses[status],
            count: team.statusCounts[status],
            status,
            isActive: filter === status,
          })),
        ]}
      />
      <TeamListing label={T.Tabs.List}>
        {shown.map((entry) => {
          const listing = listings.get(entry.listingId);
          const remove = canEdit && (
            <TeamActionButton action={removeFromTeamAction} fields={{ teamId: team.id, listingId: entry.listingId }} label={T.Row.Remove} errors={t.Errors} tone="danger" />
          );
          if (!listing) {
            return (
              <TeamListingMissing key={entry.listingId} listingId={entry.listingId} message={T.Row.Missing}>
                {remove}
              </TeamListingMissing>
            );
          }
          const hearing = getHearingStatus(listing, now);
          const parts = getDateParts(getNextDate(listing, now) ?? listing.firstSeenAt ?? new Date(now).toISOString(), listing.market, locale);
          const status = t.Statuses[entry.status];
          return (
            <TeamListingRow
              key={entry.listingId}
              href={listingHref(listing.key)}
              dateLabel={`${parts.day} ${parts.month}`}
              timeLabel={`${parts.weekday} ${parts.time} · ${parts.year}`}
              hearingLabel={getStatusLabel(hearing, app.Row)}
              isOver={hearing.state === "past" || hearing.state === "cancelled"}
              title={`${getPlaceTitle(listing)} · ${app.Segments[listing.segment]}`}
              subtitle={`${listing.authority} · ${listing.fileNo}`}
              status={entry.status}
              statusLine={entry.statusByName ? fill(T.Row.StatusBy, { status, name: entry.statusByName, date: date(entry.statusAt) }) : fill(T.Row.StatusAt, { status, date: date(entry.statusAt) })}
              notesLabel={entry.noteCount === 0 ? T.Row.NoNotes : entry.noteCount === 1 ? T.Row.NoteOne : fill(T.Row.Notes, { count: entry.noteCount })}
              lastNote={entry.lastNote && { byline: fill(T.Row.LastNote, { name: entry.lastNote.authorName, date: date(entry.lastNote.createdAt) }), body: entry.lastNote.body }}
            >
              <TeamStatusPicker teamId={team.id} listingId={listing.key} current={entry.status} labels={t.Statuses} groupLabel={t.Panel.StatusLabel} errors={t.Errors} isDisabled={!canEdit} size="small" />
              {remove}
            </TeamListingRow>
          );
        })}
      </TeamListing>
    </>
  );
}
