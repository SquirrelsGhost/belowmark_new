import { LocaleOption } from "../../lib/constants";
import { Locale } from "../Translations";
import { TEAM_DE } from "./de/de";
import { ITeamTranslation } from "./ITeamTranslation";
import { TEAM_TR } from "./tr/tr";

export const TeamTranslations: Record<Locale, ITeamTranslation> = {
  [Locale.DE]: TEAM_DE,
  [Locale.TR]: TEAM_TR,
};

export const getTeamTranslation = (locale: LocaleOption): ITeamTranslation => (locale === "tr" ? TEAM_TR : TEAM_DE);
