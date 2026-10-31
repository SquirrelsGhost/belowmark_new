import { PricingCountryCode } from "../../lib/constants";
import { IMetaTags } from "../../services/MetaTagService";
import { AuthErrorCode } from "../../types/auth.types";

/**
 * Translation contract for everything around accounts: sign-in, sign-up,
 * password reset, e-mail confirmation, the account page and the e-mails.
 *
 * Kept apart from ITranslation so the landing page and the login can evolve
 * independently. Every locale must implement every key.
 */

/** The left column of every auth page: headline above the red line, promise below. */
export interface IAuthIntro {
  FormNumber: string;
  HeadlineTop: string;
  HeadlineBelow: string;
  Lede: string;
  Points: string[];
}

export interface IAuthPage {
  MetaTags: IMetaTags;
  Intro: IAuthIntro;
  CardLabel: string;
  Title: string;
  Description: string;
  Submit: string;
  Pending: string;
}

export interface IMailTemplate {
  Subject: string;
  Preheader: string;
  Greeting: string;
  Body: string;
  Action: string;
  Expiry: string;
  Ignore: string;
}

export interface IAuthTranslation {
  Layout: {
    BackHome: string;
    SkipToContent: string;
    MainLabel: string;
    LineLabel: string;
    FormPrefix: string;
    Secure: string;
    Imprint: string;
    Privacy: string;
    Terms: string;
  };

  Fields: {
    Email: string;
    EmailPlaceholder: string;
    Password: string;
    NewPassword: string;
    CurrentPassword: string;
    PasswordHint: string;
    ShowPassword: string;
    HidePassword: string;
    CapsLock: string;
    Remember: string;
    RememberHint: string;
    Market: string;
    MarketDe: string;
    MarketDeHint: string;
    MarketTr: string;
    MarketTrHint: string;
    Markets: Record<PricingCountryCode, { Label: string; Hint: string }>;
    MarketNote: string;
    /** "{terms}" and "{privacy}" are replaced by links */
    Terms: string;
    TermsLink: string;
    PrivacyLink: string;
    Required: string;
    Strength: {
      Label: string;
      Levels: [string, string, string, string, string];
      Requirement: string;
    };
  };

  Errors: Record<AuthErrorCode, string> & {
    SummaryTitle: string;
    /** "{minutes}" is replaced */
    RetryIn: string;
  };

  Login: IAuthPage & {
    Forgot: string;
    NoAccount: string;
    SignupLink: string;
    ResendVerification: string;
    ResendSent: string;
  };

  Signup: IAuthPage & {
    HaveAccount: string;
    LoginLink: string;
    SuccessStamp: string;
    SuccessTitle: string;
    /** "{email}" is replaced */
    SuccessBody: string;
    SuccessHint: string;
    Resend: string;
    ResendSent: string;
  };

  Forgot: IAuthPage & {
    Back: string;
    SuccessStamp: string;
    SuccessTitle: string;
    /** "{email}" is replaced */
    SuccessBody: string;
    SuccessHint: string;
  };

  Reset: IAuthPage & {
    InvalidTitle: string;
    InvalidBody: string;
    InvalidAction: string;
    SessionsNote: string;
  };

  Verify: IAuthPage & {
    InvalidTitle: string;
    InvalidBody: string;
    InvalidAction: string;
  };

  /** Account dropdown in the app masthead */
  AccountMenu: {
    Open: string;
    SignedInAs: string;
    Settings: string;
    Password: string;
    /** "{days}" = whole days left */
    Access: { admin: string; plan: string; team: string; trial: string; trialLastDay: string; free: string };
  };

  /** Quick logins on the sign-in page — only visible under `next dev` */
  DevLogin: {
    Label: string;
    Title: string;
    Note: string;
    Accounts: { de: string; tr: string; free: string; full: string; admin: string };
  };

  Account: {
    MetaTags: IMetaTags;
    Eyebrow: string;
    Title: string;
    Notices: { verified: string; password_reset: string; password_changed: string };
    Details: {
      Title: string;
      Email: string;
      Market: string;
      Verified: string;
      VerifiedValue: string;
      Trial: string;
      TrialEnded: string;
      /** Access level row: admin, booked plan, trial or free */
      Access: string;
      AccessAdmin: string;
      AccessPlan: string;
      AccessTrial: string;
      AccessFree: string;
      Since: string;
    };
    Password: {
      Title: string;
      Description: string;
      Submit: string;
      Pending: string;
    };
    Sessions: {
      Title: string;
      Description: string;
      Logout: string;
      LogoutEverywhere: string;
    };
    DashboardSoon: string;
  };

  Mail: {
    Signature: string;
    Footer: string;
    VerifyEmail: IMailTemplate;
    ResetPassword: IMailTemplate;
    AccountExists: IMailTemplate;
    PasswordChanged: Omit<IMailTemplate, "Expiry">;
  };
}
