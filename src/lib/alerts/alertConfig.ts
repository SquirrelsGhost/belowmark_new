/** Constants of the saved-search alerts. */

export const ALERT_ROUTES = {
  manage: "/app/alerts",
  run: "/api/alerts/run",
} as const;

export const ALERTS = {
  /** Saved searches per account */
  maxPerUser: 10,
  nameMaxLength: 120,
  /** Proceedings listed per alert in one mail; the rest is a link to the search */
  maxHitsPerMail: 15,
  /** Rows written per insert while seeding a new alert */
  seedBatchSize: 500,
} as const;
