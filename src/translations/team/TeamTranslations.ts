import { LocaleOption } from "../../lib/constants";
import { Locale } from "../Translations";
import { TEAM_CS } from "./cs/cs";
import { TEAM_DE } from "./de/de";
import { TEAM_EN } from "./en/en";
import { TEAM_ES } from "./es/es";
import { TEAM_FR } from "./fr/fr";
import { ITeamTranslation } from "./ITeamTranslation";
import { TEAM_IT } from "./it/it";
import { TEAM_NL } from "./nl/nl";
import { TEAM_PL } from "./pl/pl";
import { TEAM_SV } from "./sv/sv";
import { TEAM_TR } from "./tr/tr";

export const TeamTranslations: Record<Locale, ITeamTranslation> = {
  [Locale.DE]: TEAM_DE,
  [Locale.TR]: TEAM_TR,
  [Locale.EN]: TEAM_EN,
  [Locale.IT]: TEAM_IT,
  [Locale.ES]: TEAM_ES,
  [Locale.FR]: TEAM_FR,
  [Locale.PL]: TEAM_PL,
  [Locale.CS]: TEAM_CS,
  [Locale.NL]: TEAM_NL,
  [Locale.SV]: TEAM_SV,
};

export const getTeamTranslation = (locale: LocaleOption): ITeamTranslation =>
  TeamTranslations[(locale.toUpperCase() as Locale)] ?? TEAM_DE;
