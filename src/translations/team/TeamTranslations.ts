import { LocaleOption } from "../../lib/constants";
import { Locale } from "../Translations";
import { TEAM_DE } from "./de/de";
import { TEAM_EN } from "./en/en";
import { TEAM_ES } from "./es/es";
import { TEAM_FR } from "./fr/fr";
import { ITeamTranslation } from "./ITeamTranslation";
import { TEAM_IT } from "./it/it";
import { TEAM_TR } from "./tr/tr";

export const TeamTranslations: Record<Locale, ITeamTranslation> = {
  [Locale.DE]: TEAM_DE,
  [Locale.TR]: TEAM_TR,
  [Locale.EN]: TEAM_EN,
  [Locale.IT]: TEAM_IT,
  [Locale.ES]: TEAM_ES,
  [Locale.FR]: TEAM_FR,
};

export const getTeamTranslation = (locale: LocaleOption): ITeamTranslation =>
  TeamTranslations[(locale.toUpperCase() as Locale)] ?? TEAM_DE;
