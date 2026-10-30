import "server-only";
import { aliasedTable, and, asc, count, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { teamListings, teamNotes, users } from "@/db/schema";
import { MarketCode } from "@/lib/constants";
import { DEFAULT_TEAM_STATUS, isTeamStatus, TeamStatus, TEAMS } from "@/lib/team/teamConfig";
import { displayName, TeamService } from "@/services/team/TeamService";
import { TeamErrorCode, TeamListingPanel, TeamListingView, TeamNoteView } from "@/types/team.types";

const statusSetter = aliasedTable(users, "status_setter");

const NOTE_COLUMNS = { id: teamNotes.id, authorId: teamNotes.authorId, name: users.name, email: users.email, body: teamNotes.body, createdAt: teamNotes.createdAt, listingId: teamNotes.listingId };

const toNote = (row: { id: string; authorId: string; name: string | null; email: string; body: string; createdAt: Date }): TeamNoteView => ({
  id: row.id,
  authorId: row.authorId,
  authorName: displayName(row.name, row.email),
  body: row.body,
  createdAt: row.createdAt,
});

/**
 * TeamBoardService
 *
 * The shared list of a team: which proceedings it looks at, where each one
 * stands, and the notes the members wrote. Callers have checked the role.
 */
export class TeamBoardService {
  static list = async (teamId: string): Promise<TeamListingView[]> => {
    const rows = await db
      .select({
        listingId: teamListings.listingId,
        status: teamListings.status,
        statusAt: teamListings.statusAt,
        addedAt: teamListings.createdAt,
        setterName: statusSetter.name,
        setterEmail: statusSetter.email,
      })
      .from(teamListings)
      .leftJoin(statusSetter, eq(statusSetter.id, teamListings.statusBy))
      .where(eq(teamListings.teamId, teamId))
      .orderBy(desc(teamListings.statusAt));
    if (rows.length === 0) return [];

    const [counts, notes] = await Promise.all([
      db.select({ listingId: teamNotes.listingId, total: count() }).from(teamNotes).where(eq(teamNotes.teamId, teamId)).groupBy(teamNotes.listingId),
      db.select(NOTE_COLUMNS).from(teamNotes).innerJoin(users, eq(users.id, teamNotes.authorId)).where(eq(teamNotes.teamId, teamId)).orderBy(desc(teamNotes.createdAt)),
    ]);
    const noteCounts = new Map(counts.map((row) => [row.listingId, row.total]));
    const lastNotes = new Map<string, TeamNoteView>();
    for (const note of notes) if (!lastNotes.has(note.listingId)) lastNotes.set(note.listingId, toNote(note));

    return rows.map((row) => ({
      listingId: row.listingId,
      status: isTeamStatus(row.status) ? row.status : DEFAULT_TEAM_STATUS,
      statusByName: row.setterEmail ? displayName(row.setterName, row.setterEmail) : null,
      statusAt: row.statusAt,
      addedAt: row.addedAt,
      noteCount: noteCounts.get(row.listingId) ?? 0,
      lastNote: lastNotes.get(row.listingId) ?? null,
    }));
  };

  static notes = async (teamId: string, listingId: string): Promise<TeamNoteView[]> => {
    const rows = await db
      .select(NOTE_COLUMNS)
      .from(teamNotes)
      .innerJoin(users, eq(users.id, teamNotes.authorId))
      .where(and(eq(teamNotes.teamId, teamId), eq(teamNotes.listingId, listingId)))
      .orderBy(asc(teamNotes.createdAt));
    return rows.map(toNote);
  };

  static has = async (teamId: string, listingId: string): Promise<boolean> => {
    const [row] = await db.select({ listingId: teamListings.listingId }).from(teamListings).where(and(eq(teamListings.teamId, teamId), eq(teamListings.listingId, listingId)));
    return Boolean(row);
  };

  static add = async (teamId: string, listingId: string, userId: string): Promise<TeamErrorCode | null> => {
    if (await TeamBoardService.has(teamId, listingId)) return null;
    const [row] = await db.select({ total: count() }).from(teamListings).where(eq(teamListings.teamId, teamId));
    if ((row?.total ?? 0) >= TEAMS.maxListingsPerTeam) return "list_full";
    await db.insert(teamListings).values({ teamId, listingId, addedBy: userId, statusBy: userId }).onConflictDoNothing();
    return null;
  };

  /** Takes the proceeding off the team's list, with all notes on it. */
  static remove = async (teamId: string, listingId: string): Promise<void> => {
    await db.delete(teamNotes).where(and(eq(teamNotes.teamId, teamId), eq(teamNotes.listingId, listingId)));
    await db.delete(teamListings).where(and(eq(teamListings.teamId, teamId), eq(teamListings.listingId, listingId)));
  };

  /** Sets the status; a proceeding not on the list yet is added with it. */
  static setStatus = async (teamId: string, listingId: string, status: TeamStatus, userId: string): Promise<TeamErrorCode | null> => {
    if (!isTeamStatus(status)) return "invalid";
    const error = await TeamBoardService.add(teamId, listingId, userId);
    if (error) return error;
    await db
      .update(teamListings)
      .set({ status, statusBy: userId, statusAt: new Date() })
      .where(and(eq(teamListings.teamId, teamId), eq(teamListings.listingId, listingId)));
    return null;
  };

  static addNote = async (teamId: string, listingId: string, authorId: string, body: string): Promise<TeamErrorCode | null> => {
    const error = await TeamBoardService.add(teamId, listingId, authorId);
    if (error) return error;
    const [row] = await db.select({ total: count() }).from(teamNotes).where(and(eq(teamNotes.teamId, teamId), eq(teamNotes.listingId, listingId)));
    if ((row?.total ?? 0) >= TEAMS.maxNotesPerListing) return "notes_full";
    await db.insert(teamNotes).values({ teamId, listingId, authorId, body });
    return null;
  };

  /** Deletes a note: the author's own, or any when `asModerator` (owner, admin). Returns false when nothing matched. */
  static deleteNote = async (teamId: string, noteId: string, userId: string, asModerator: boolean): Promise<boolean> => {
    const scope = asModerator ? and(eq(teamNotes.teamId, teamId), eq(teamNotes.id, noteId)) : and(eq(teamNotes.teamId, teamId), eq(teamNotes.id, noteId), eq(teamNotes.authorId, userId));
    const deleted = await db.delete(teamNotes).where(scope).returning({ id: teamNotes.id });
    return deleted.length > 0;
  };

  /** For the Aktenblatt: every team of the viewer in this market, with this proceeding's entry and notes. */
  static panelsFor = async (userId: string, market: MarketCode, listingId: string): Promise<TeamListingPanel[]> => {
    const myTeams = (await TeamService.listForUser(userId)).filter((team) => team.market === market);
    if (myTeams.length === 0) return [];
    const ids = myTeams.map((team) => team.id);
    const entries = await db
      .select({ teamId: teamListings.teamId })
      .from(teamListings)
      .where(and(inArray(teamListings.teamId, ids), eq(teamListings.listingId, listingId)));
    const onList = new Set(entries.map((entry) => entry.teamId));

    return Promise.all(
      myTeams.map(async (team) => {
        if (!onList.has(team.id)) return { team, entry: null, notes: [] };
        const [list, notes] = await Promise.all([TeamBoardService.list(team.id), TeamBoardService.notes(team.id, listingId)]);
        return { team, entry: list.find((item) => item.listingId === listingId) ?? null, notes };
      }),
    );
  };
}
