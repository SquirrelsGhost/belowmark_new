import { ClosingLawRef } from "@/types/closing.types";

/**
 * Every source the task list cites. German statutes link to gesetze-im-internet.de
 * (BMJ), Turkish ones to the official PDF on mevzuat.gov.tr. Checked 26.10.2026.
 */

const GII = "https://www.gesetze-im-internet.de";
const MEVZUAT = "https://www.mevzuat.gov.tr/mevzuatmetin";

const law = (label: string, href: string): ClosingLawRef => ({ label, href });

export const CLOSING_LAWS = {
  zvg49: law("§ 49 ZVG", `${GII}/zvg/__49.html`),
  zvg56: law("§ 56 ZVG", `${GII}/zvg/__56.html`),
  zvg57: law("§ 57 ZVG", `${GII}/zvg/__57.html`),
  zvg57a: law("§ 57a ZVG", `${GII}/zvg/__57a.html`),
  zvg90: law("§ 90 ZVG", `${GII}/zvg/__90.html`),
  zvg93: law("§ 93 ZVG", `${GII}/zvg/__93.html`),
  zvg98: law("§ 98 ZVG", `${GII}/zvg/__98.html`),
  zvg105: law("§ 105 ZVG", `${GII}/zvg/__105.html`),
  zvg118: law("§ 118 ZVG", `${GII}/zvg/__118.html`),
  zvg130: law("§ 130 ZVG", `${GII}/zvg/__130.html`),
  zvg133: law("§ 133 ZVG", `${GII}/zvg/__133.html`),
  zpo569: law("§ 569 ZPO", `${GII}/zpo/__569.html`),
  zpo750: law("§ 750 ZPO", `${GII}/zpo/__750.html`),
  zpo885: law("§ 885 ZPO", `${GII}/zpo/__885.html`),
  zpo885a: law("§ 885a ZPO", `${GII}/zpo/__885a.html`),
  bgb246: law("§ 246 BGB", `${GII}/bgb/__246.html`),
  bgb566a: law("§ 566a BGB", `${GII}/bgb/__566a.html`),
  bgb573: law("§ 573 BGB", `${GII}/bgb/__573.html`),
  bgb573c: law("§ 573c BGB", `${GII}/bgb/__573c.html`),
  vvg96: law("§ 96 VVG", `${GII}/vvg_2008/__96.html`),
  vvg97: law("§ 97 VVG", `${GII}/vvg_2008/__97.html`),
  vvg99: law("§ 99 VVG", `${GII}/vvg_2008/__99.html`),
  grestg15: law("§ 15 GrEStG", `${GII}/grestg_1983/__15.html`),
  grestg18: law("§ 18 GrEStG", `${GII}/grestg_1983/__18.html`),
  grestg22: law("§ 22 GrEStG", `${GII}/grestg_1983/__22.html`),
  gkg: law("KV 2214 GKG", `${GII}/gkg_2004/anlage_1.html`),
  gnotkg: law("KV 14110 GNotKG", `${GII}/gnotkg/anlage_1.html`),
  weg: law("WEG", `${GII}/woeigg/`),
  bghHausgeld: law("BGH, 13.09.2013 – V ZR 209/12", "https://rewis.io/urteile/urteil/umm-13-09-2013-v-zr-20912/"),
  gmodg: law("GModG-Infoportal (BBSR)", "https://www.gmodg.bund.de/"),

  iik: law("İİK (2004 s. Kanun)", `${MEVZUAT}/1.3.2004.pdf`),
  esatis: law("Elektronik Satış Yönetmeliği m.20 (RG 08.03.2022/31772)", "https://www.mevzuat.gov.tr/"),
  harclar: law("492 s. Harçlar Kanunu, (4) s. Tarife m.20/a", `${MEVZUAT}/1.4.492.pdf`),
  iidbHarc: law(
    "Adalet Bakanlığı İİDB, 12.01.2023 (tapu harcı)",
    "https://iidb.adalet.gov.tr/Resimler/SayfaDokuman/10012024135523Sat%C4%B1%C5%9F%20%C4%B0%C5%9Flemlerinde%20Tapu%20Harc%C4%B1n%C4%B1n%20Al%C4%B1nmas%C4%B1.pdf",
  ),
  tbk: law("TBK (6098 s. Kanun) m.310, m.351", `${MEVZUAT}/1.5.6098.pdf`),
  afet: law("6305 s. Afet Sigortaları Kanunu", `${MEVZUAT}/1.5.6305.pdf`),
  dask2026: law("DASK Genel Şartları, RG 21.08.2026/33347", "https://www.resmigazete.gov.tr/"),
  emlak: law("1319 s. Emlak Vergisi Kanunu m.23, m.33", `${MEVZUAT}/1.4.1319.pdf`),
  imar: law("3194 s. İmar Kanunu m.21", `${MEVZUAT}/1.5.3194.pdf`),
  katMulkiyeti: law("634 s. Kat Mülkiyeti Kanunu", `${MEVZUAT}/1.5.634.pdf`),
  kanun7589: law("Kanun 7589 (RG 31.07.2026), İİK m.114", "https://www.tbmm.gov.tr/"),
} as const;
