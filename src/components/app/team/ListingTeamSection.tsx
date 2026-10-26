import TeamActionButton from "@/components/app/team/TeamActionButton";
import TeamHint from "@/components/app/team/TeamHint";
import TeamNoteForm from "@/components/app/team/TeamNoteForm";
import TeamNoteItem from "@/components/app/team/TeamNoteItem";
import TeamNoteList from "@/components/app/team/TeamNoteList";
import TeamPanelCard from "@/components/app/team/TeamPanelCard";
import TeamStatusPicker from "@/components/app/team/TeamStatusPicker";
import { fill } from "@/lib/appFormat";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { deleteTeamNoteAction, removeFromTeamAction } from "@/lib/team/teamBoardActions";
import { TEAM_PANEL_ID, teamHref } from "@/lib/team/teamConfig";
import { canDo } from "@/lib/team/teamRoles";
import { TeamBoardService } from "@/services/team/TeamBoardService";
import { getTeamTranslation } from "@/translations/team/TeamTranslations";

interface ListingTeamSectionProps {
  listingKey: string;
  market: MarketCode;
  userId: string;
  locale: LocaleOption;
}

/**
 * "Im Team bewerten" on the Aktenblatt: per team of the viewer the shared
 * status and the notes on this proceeding. Renders nothing for people
 * without a team in this market.
 */
export default async function ListingTeamSection({ listingKey, market, userId, locale }: ListingTeamSectionProps) {
  const panels = await TeamBoardService.panelsFor(userId, market, listingKey);
  if (panels.length === 0) return null;
  const t = getTeamTranslation(locale);
  const { Panel: P } = t;
  const date = (value: Date) => formatDate(value.toISOString(), locale);

  return (
    <section id={TEAM_PANEL_ID} aria-label={P.Title} className="mt-12 scroll-mt-24">
      <h2 className="font-display text-4xl">{P.Title}</h2>
      <div aria-hidden="true" className="mt-3 h-[3px] w-16 bg-signal" />
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">{P.Lead}</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {panels.map(({ team, entry, notes }) => {
          const canEdit = team.isActive && canDo(team.role, "setStatus");
          const canWrite = team.isActive && canDo(team.role, "writeNote");
          const mayModerate = canDo(team.role, "moderateNotes");
          return (
            <TeamPanelCard key={team.id} teamName={team.name} teamHref={teamHref(team.id)} openLabel={P.OpenTeam} notice={!team.isActive ? P.Paused : team.role === "viewer" ? P.ViewerOnly : undefined}>
              <TeamStatusPicker teamId={team.id} listingId={listingKey} current={entry?.status ?? null} labels={t.Statuses} groupLabel={P.StatusLabel} errors={t.Errors} isDisabled={!canEdit} />
              {entry && <TeamHint text={entry.statusByName ? fill(P.StatusBy, { name: entry.statusByName, date: date(entry.statusAt) }) : date(entry.statusAt)} />}
              <TeamNoteList title={P.NotesTitle} emptyLabel={P.NoNotes} isEmpty={notes.length === 0}>
                {notes.map((note) => (
                  <TeamNoteItem key={note.id} author={note.authorName} date={date(note.createdAt)} body={note.body}>
                    {(note.authorId === userId || mayModerate) && (
                      <TeamActionButton action={deleteTeamNoteAction} fields={{ teamId: team.id, noteId: note.id }} label={P.DeleteNote} errors={t.Errors} tone="danger" />
                    )}
                  </TeamNoteItem>
                ))}
              </TeamNoteList>
              {canWrite && (
                <TeamNoteForm teamId={team.id} listingId={listingKey} placeholder={P.NotePlaceholder} submitLabel={P.NoteSubmit} hint={fill(P.NoteHint, { team: team.name })} savedLabel={t.Saved} errors={t.Errors} />
              )}
              {entry && canEdit && (
                <TeamActionButton action={removeFromTeamAction} fields={{ teamId: team.id, listingId: listingKey }} label={P.Remove} errors={t.Errors} tone="danger" />
              )}
            </TeamPanelCard>
          );
        })}
      </div>
    </section>
  );
}
