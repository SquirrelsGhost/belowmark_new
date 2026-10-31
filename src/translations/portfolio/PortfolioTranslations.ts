import { LocaleOption } from "../../lib/constants";
import { Locale } from "../Translations";
import { PORTFOLIO_DE } from "./de/portfolioDe";
import { PORTFOLIO_EN } from "./en/portfolioEn";
import { PORTFOLIO_ES } from "./es/portfolioEs";
import { PORTFOLIO_FR } from "./fr/portfolioFr";
import { IPortfolioTranslation } from "./IPortfolioTranslation";
import { PORTFOLIO_IT } from "./it/portfolioIt";
import { PORTFOLIO_TR } from "./tr/portfolioTr";

export const PortfolioTranslations: Record<Locale, IPortfolioTranslation> = {
  [Locale.DE]: PORTFOLIO_DE,
  [Locale.TR]: PORTFOLIO_TR,
  [Locale.EN]: PORTFOLIO_EN,
  [Locale.IT]: PORTFOLIO_IT,
  [Locale.ES]: PORTFOLIO_ES,
  [Locale.FR]: PORTFOLIO_FR,
};

/** The portfolio strings for the lower-case locale the app pages carry around. */
export const getPortfolioTranslation = (locale: LocaleOption): IPortfolioTranslation =>
  PortfolioTranslations[(locale.toUpperCase() as Locale)] ?? PORTFOLIO_DE;
