import { LocaleOption } from "../../lib/constants";
import { PORTFOLIO_DE } from "./de/portfolioDe";
import { IPortfolioTranslation } from "./IPortfolioTranslation";
import { PORTFOLIO_TR } from "./tr/portfolioTr";

/** The portfolio strings for the lower-case locale the app pages carry around. */
export const getPortfolioTranslation = (locale: LocaleOption): IPortfolioTranslation => (locale === "tr" ? PORTFOLIO_TR : PORTFOLIO_DE);
