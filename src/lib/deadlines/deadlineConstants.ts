import { DeadlineLaw } from "@/types/deadline.types";

/** Routes of the Termin-Begleiter. */
export const DEADLINE_ROUTES = {
  overview: "/app/termine",
  /** ?key=… one proceeding, without key every followed one */
  download: "/app/termine/kalender",
  /** + /<token> — the subscribable calendar, no session needed */
  feed: "/api/termine/feed",
} as const;

/** Anchor of the section on the Aktenblatt. */
export const DEADLINE_ANCHOR = "fristen";

/** Local storage key prefix of the preparation steps ticked by hand. */
export const DEADLINE_CHECKLIST_PREFIX = "belowmark:fahrplan:";

/**
 * The legal basis of every computed date. Checked 26.10.2026:
 * ZVG on gesetze-im-internet.de; e-Satış = İcra ve İflâs Kanunu Uyarınca
 * Elektronik Ortamda Yapılacak Satışların Usulü Hakkında Yönetmelik
 * (RG 08.03.2022/31772, last changed RG 24.04.2025 — m.14/6 extension rule;
 * m.12, m.13, m.20 unchanged since 2022).
 */
export const DEADLINE_LAWS = {
  zvg43: { label: "§ 43 Abs. 1 ZVG", href: "https://www.gesetze-im-internet.de/zvg/__43.html" },
  zvg69Transfer: { label: "§ 69 Abs. 1, 4 ZVG · § 68 Abs. 1 ZVG", href: "https://www.gesetze-im-internet.de/zvg/__69.html" },
  zvg69Cheque: { label: "§ 69 Abs. 2 ZVG", href: "https://www.gesetze-im-internet.de/zvg/__69.html" },
  zvg73: { label: "§ 73 Abs. 1 · § 71 Abs. 2 ZVG", href: "https://www.gesetze-im-internet.de/zvg/__73.html" },
  zvg87: { label: "§ 87 Abs. 2 · §§ 89, 90 ZVG", href: "https://www.gesetze-im-internet.de/zvg/__87.html" },
  esy12: { label: "e-Satış Yön. m.12/2", href: "https://www.lexpera.com.tr/mevzuat/yonetmelikler/icra-ve-iflas-kanunu-uyarinca-elektronik-ortamda-yapilacak-satislarin-usulu-hakkinda-yonetmelik" },
  esy14: { label: "e-Satış Yön. m.14/1 · İİK m.129", href: "https://www.lexpera.com.tr/mevzuat/yonetmelikler/icra-ve-iflas-kanunu-uyarinca-elektronik-ortamda-yapilacak-satislarin-usulu-hakkinda-yonetmelik" },
  esy13Cash: { label: "e-Satış Yön. m.13/1 · İİK m.114", href: "https://www.lexpera.com.tr/mevzuat/yonetmelikler/icra-ve-iflas-kanunu-uyarinca-elektronik-ortamda-yapilacak-satislarin-usulu-hakkinda-yonetmelik" },
  esy13Letter: { label: "e-Satış Yön. m.13/2", href: "https://www.lexpera.com.tr/mevzuat/yonetmelikler/icra-ve-iflas-kanunu-uyarinca-elektronik-ortamda-yapilacak-satislarin-usulu-hakkinda-yonetmelik" },
  esy14End: { label: "e-Satış Yön. m.14/6 · m.20/1", href: "https://www.lexpera.com.tr/mevzuat/yonetmelikler/icra-ve-iflas-kanunu-uyarinca-elektronik-ortamda-yapilacak-satislarin-usulu-hakkinda-yonetmelik" },
} as const satisfies Record<string, DeadlineLaw>;

export const DEADLINE_RULES = {
  /** § 68 Abs. 1 ZVG / İİK m.114 — a tenth of the appraised value */
  depositShare: 0.1,
  /** § 69 Abs. 2 ZVG — cheque issued at the earliest on the third Werktag before */
  chequeWorkdays: 3,
  /** § 87 Abs. 2 ZVG — Verkündungstermin "soll nicht über eine Woche hinaus" */
  awardMaxDays: 7,
  /** e-Satış Yön. m.13/1 — cash deposit by 23:30 on the day before the round ends */
  cashDepositTime: "23:30",
} as const;

/** On which days before an entry the reminder goes out. Offsets are reminders, not deadlines. */
export const DEADLINE_REMIND = {
  notice: [],
  transfer: [14, 7, 3],
  cheque: [1, 0],
  hearing: [7, 1, 0],
  award: [],
  roundStart: [1],
  deposit: [7, 3, 1, 0],
  roundEnd: [1, 0],
} as const satisfies Record<string, readonly number[]>;

/** Hour (court time) after which the daily reminder run sends mails; ICS alarms use the same hour. */
export const DEADLINE_REMIND_HOUR = 8;

/** Max proceedings one user can follow. */
export const DEADLINE_MAX_FOLLOWS = 50;
