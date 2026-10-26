import { MarketCode } from "../../lib/constants";
import { TeamRole, TeamStatus } from "../../lib/team/teamConfig";
import { IMetaTags } from "../../services/MetaTagService";
import { TeamErrorCode } from "../../types/team.types";

/**
 * Translation contract of the team accounts: overview, team page, the team
 * panel on the Aktenblatt, the invitation page and mail. Kept apart from
 * IAppTranslation so parallel work on the app strings does not collide.
 * Placeholders in curly braces are filled with `fill`.
 */
export interface ITeamTranslation {
  MetaTags: { Overview: IMetaTags; Team: IMetaTags; Invitation: IMetaTags };
  Nav: string;
  Markets: Record<MarketCode, string>;
  Roles: Record<TeamRole, string>;
  RoleHints: Record<TeamRole, string>;
  Statuses: Record<TeamStatus, string>;
  Errors: Record<TeamErrorCode, string>;
  Saved: string;
  /** Shown instead of a name when the person has left the team */
  FormerMember: string;

  Overview: {
    Eyebrow: string;
    Title: string;
    Lead: string;
    Empty: { Title: string; Body: string };
    /** "{count} Mitglieder" */
    Members: string;
    /** "{count} Objekte" */
    Listings: string;
    /** "Ihre Rolle: {role}" */
    YourRole: string;
    Paused: string;
    Open: string;
    Invitations: {
      Title: string;
      /** "{inviter} lädt Sie als {role} ein" */
      From: string;
      FromUnknown: string;
      /** "gültig bis {date}" */
      Expires: string;
      Accept: string;
      Decline: string;
    };
    Create: {
      Title: string;
      NameLabel: string;
      Placeholder: string;
      Submit: string;
      Pending: string;
      /** "Arbeitet im Markt {market}. Sie werden Inhaber, {seats} Plätze inklusive Ihnen." */
      Hint: string;
      /** "{count} von {max} eigenen Teams" */
      Usage: string;
    };
    Locked: { Title: string; Body: string; Cta: string; MailSubject: string };
    Privacy: string;
  };

  Team: {
    /** "Team · {market}" */
    Eyebrow: string;
    Tabs: { List: string; Members: string; Label: string };
    Filter: { Label: string; All: string };
    Paused: string;
    ReadOnly: string;
    Empty: { Title: string; Body: string; Cta: string };
    Row: {
      /** "{status} · gesetzt von {name}, {date}" */
      StatusBy: string;
      /** "{status} · gesetzt {date}" */
      StatusAt: string;
      /** "{count} Notizen" */
      Notes: string;
      NoteOne: string;
      NoNotes: string;
      /** "Letzte Notiz von {name}, {date}" */
      LastNote: string;
      Open: string;
      Missing: string;
      Remove: string;
    };
  };

  Members: {
    Title: string;
    /** "{count} von {max} Plätzen belegt (offene Einladungen zählen mit)" */
    Seats: string;
    /** "seit {date}" */
    Joined: string;
    You: string;
    RoleLabel: string;
    SaveRole: string;
    Remove: string;
    Transfer: string;
    TransferHint: string;
    Invite: { Title: string; EmailLabel: string; RoleLabel: string; Submit: string; Pending: string; Sent: string; Hint: string };
    Pending: {
      Title: string;
      /** "{email} · als {role} · gültig bis {date}" */
      Line: string;
      /** "eingeladen von {name}" */
      By: string;
      Revoke: string;
    };
    Leave: { Title: string; Body: string; Submit: string; OwnerHint: string };
    Settings: { Title: string; NameLabel: string; Rename: string };
    Delete: { Title: string; Body: string; ConfirmLabel: string; Submit: string };
  };

  Panel: {
    Title: string;
    Lead: string;
    /** "Team {team}" */
    TeamLabel: string;
    StatusLabel: string;
    /** "Status von {name}, {date}" */
    StatusBy: string;
    NotesTitle: string;
    NoNotes: string;
    NotePlaceholder: string;
    NoteSubmit: string;
    /** "Sichtbar für alle Mitglieder von {team}. Gelöscht, wenn Sie das Team verlassen." */
    NoteHint: string;
    DeleteNote: string;
    Remove: string;
    Paused: string;
    ViewerOnly: string;
    OpenTeam: string;
  };

  Invitation: {
    Eyebrow: string;
    Title: string;
    /** "{inviter} lädt Sie in das Team „{team}“ ein." */
    Lead: string;
    LeadUnknown: string;
    /** "Rolle: {role} — {hint}" */
    RoleLine: string;
    /** "Markt: {market}" */
    MarketLine: string;
    /** "Für {email}, gültig bis {date}" */
    ForLine: string;
    Privacy: string;
    Accept: string;
    Decline: string;
    LoginToAccept: string;
    SignupHint: string;
    SignupCta: string;
    /** "Sie sind als {email} angemeldet. Die Einladung gilt für eine andere Adresse." */
    WrongAccount: string;
    SwitchAccount: string;
    Blocked: string;
    Declined: { Title: string; Body: string };
    Invalid: { Title: string; Body: string };
    ToTeams: string;
  };

  Mail: {
    Invite: {
      /** "{inviter} lädt Sie in das Team „{team}“ ein" */
      Subject: string;
      Preheader: string;
      Greeting: string;
      /** Uses {inviter}, {team}, {role}, {market} */
      Body: string;
      Action: string;
      /** "Der Link gilt {days} Tage. …" */
      Expiry: string;
      Ignore: string;
    };
    Signature: string;
    Footer: string;
  };
}
