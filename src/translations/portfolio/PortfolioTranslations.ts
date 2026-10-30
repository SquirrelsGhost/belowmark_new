import { LocaleOption } from "../../lib/constants";
import { Locale } from "../Translations";
import { PORTFOLIO_DE } from "./de/portfolioDe";
import { IPortfolioTranslation } from "./IPortfolioTranslation";
import { PORTFOLIO_TR } from "./tr/portfolioTr";

export const PortfolioTranslations: Record<Locale, IPortfolioTranslation> = {
  [Locale.DE]: PORTFOLIO_DE,
  [Locale.TR]: PORTFOLIO_TR,
};

/** The portfolio strings for the lower-case locale the app pages carry around. */
export const getPortfolioTranslation = (locale: LocaleOption): IPortfolioTranslation => (locale === "tr" ? PORTFOLIO_TR : PORTFOLIO_DE);
