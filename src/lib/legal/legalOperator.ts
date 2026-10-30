/**
 * Provider details for Impressum, AGB, Widerrufsbelehrung and Datenschutz.
 * Taken from the legal page of the old immo app (recht.html, Stand
 * 02.09.2026) — the operator has to confirm they are still correct.
 * `null` = not known yet; the legal pages then show a visible gap ⟨…⟩.
 */
export const LEGAL_OPERATOR = {
  business: "PYCIE Studio",
  owner: "Refik Emre Ak",
  street: "Rötestraße 20",
  city: "74321 Bietigheim-Bissingen",
  country: "Deutschland",
  email: "contact@belowmark.com",
  phone: "0152 24759168",
  /** Hosting provider incl. address and server location — needed for the Datenschutzerklärung */
  hosting: "IONOS SE, Elgendorfer Str. 57, 56410 Montabaur, Deutschland (Serverstandort: Deutschland / Europäische Union)" as string | null,
  /** SMTP provider that sends the mails */
  mailProvider: "IONOS SE, Elgendorfer Str. 57, 56410 Montabaur, Deutschland (Serverstandort: Deutschland / Europäische Union)" as string | null,
  supervisoryAuthority:
    "Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg, Lautenschlagerstraße 20, 70173 Stuttgart",
  court: "Bietigheim-Bissingen",
} as const;

export const operatorAddress = (): string =>
  `${LEGAL_OPERATOR.business}, ${LEGAL_OPERATOR.owner}, ${LEGAL_OPERATOR.street}, ${LEGAL_OPERATOR.city}, ${LEGAL_OPERATOR.country}`;

/** "⟨label⟩" for a gap, the value otherwise. */
export const filled = (value: string | null, gap: string): string => value ?? `⟨${gap}⟩`;
