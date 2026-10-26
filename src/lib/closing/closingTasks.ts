import { CLOSING_LAWS as L } from "@/lib/closing/closingLaws";
import { MarketCode } from "@/lib/constants";
import { ClosingTaskDef } from "@/types/closing.types";

/**
 * The tasks after a Zuschlag / ihale, per market. Texts live in the translations
 * under the same id; here only what is computed: phase, due rule, sources.
 * Dates are counted from the buyer's own case dates — never assumed.
 */

const DE_TASKS: ClosingTaskDef[] = [
  // Phase 1: the days after the hearing
  { id: "de.ruling", phase: "first", basis: "practice", laws: [L.zvg90, L.gkg], due: { from: "awardDate", kind: "on" } },
  { id: "de.appeal", phase: "first", basis: "law", laws: [L.zvg98, L.zpo569], due: { from: "awardDate", days: 14, kind: "earliest" } },
  { id: "de.risk", phase: "first", basis: "law", laws: [L.zvg56], due: { from: "awardDate", kind: "on" } },
  { id: "de.insurerNotice", phase: "first", basis: "law", laws: [L.vvg99, L.vvg97], due: { from: "awardDate", kind: "on" }, remindDays: [0] },
  { id: "de.insuranceCancel", phase: "first", basis: "law", laws: [L.vvg99, L.vvg96], due: { from: "awardDate", months: 1, kind: "deadline" }, remindDays: [7, 1] },
  { id: "de.charges", phase: "first", basis: "law", laws: [L.zvg56, L.bghHausgeld], due: { from: "awardDate", kind: "on" } },

  // Phase 2: paying the cash bid
  { id: "de.interest", phase: "payment", basis: "law", laws: [L.zvg49, L.bgb246], due: { from: "awardDate", kind: "on" } },
  { id: "de.summons", phase: "payment", basis: "law", laws: [L.zvg105], due: null },
  { id: "de.financing", phase: "payment", basis: "rule", laws: [], due: { from: "distributionDate", days: -14, kind: "deadline" }, remindDays: [7] },
  { id: "de.pay", phase: "payment", basis: "law", laws: [L.zvg49], due: { from: "distributionDate", days: -5, kind: "deadline" }, remindDays: [7, 2, 0] },
  { id: "de.attend", phase: "payment", basis: "law", laws: [L.zvg49], due: { from: "distributionDate", kind: "on" }, remindDays: [1, 0] },
  { id: "de.default", phase: "payment", basis: "law", laws: [L.zvg118, L.zvg133], due: null },

  // Phase 3: tax and land register
  { id: "de.taxNotice", phase: "register", basis: "law", laws: [L.grestg18, L.grestg15], due: { from: "taxNoticeDate", months: 1, kind: "deadline" }, remindDays: [7, 1] },
  { id: "de.clearance", phase: "register", basis: "law", laws: [L.grestg22], due: null },
  { id: "de.courtFees", phase: "register", basis: "law", laws: [L.gkg, L.gnotkg], due: null },
  { id: "de.registry", phase: "register", basis: "law", laws: [L.zvg130], due: null },
  { id: "de.extract", phase: "register", basis: "practice", laws: [L.zvg130], due: null },

  // Phase 4: possession
  { id: "de.eviction", phase: "possession", basis: "law", laws: [L.zvg93, L.zpo750, L.zpo885, L.zpo885a], due: null, onlyIf: "ownerOccupied" },
  { id: "de.tenantTakeover", phase: "possession", basis: "law", laws: [L.zvg57, L.bgb566a], due: { from: "awardDate", kind: "on" }, onlyIf: "tenant" },
  {
    id: "de.tenantNotice",
    phase: "possession",
    basis: "law",
    laws: [L.zvg57a, L.bgb573c, L.bgb573],
    due: { from: "awardDate", thirdWorkday: true, kind: "deadline" },
    onlyIf: "tenant",
    check: true,
    remindDays: [5, 1],
  },
  { id: "de.handover", phase: "possession", basis: "practice", laws: [], due: { from: "handoverDate", kind: "on" } },

  // Phase 5: works
  { id: "de.inspect", phase: "works", basis: "law", laws: [L.zvg56], due: null },
  { id: "de.energy", phase: "works", basis: "law", laws: [L.gmodg], due: { from: "awardDate", months: 24, kind: "deadline" }, onlyIf: "house", check: true, remindDays: [90] },
  { id: "de.permits", phase: "works", basis: "practice", laws: [], due: null },
  { id: "de.condo", phase: "works", basis: "practice", laws: [L.weg], due: null, onlyIf: "condo" },
];

const TR_TASKS: ClosingTaskDef[] = [
  { id: "tr.pay", phase: "first", basis: "law", laws: [L.iik, L.esatis], due: { from: "awardDate", days: 7, kind: "deadline" }, remindDays: [3, 1, 0] },
  { id: "tr.fees", phase: "first", basis: "law", laws: [L.harclar, L.iidbHarc], due: { from: "awardDate", days: 7, kind: "deadline" } },
  { id: "tr.default", phase: "first", basis: "law", laws: [L.iik, L.kanun7589], due: null },
  { id: "tr.annulment", phase: "first", basis: "law", laws: [L.iik], due: { from: "awardDate", days: 7, kind: "earliest" } },

  { id: "tr.registry", phase: "register", basis: "law", laws: [L.iik], due: null },
  { id: "tr.deed", phase: "register", basis: "practice", laws: [], due: null },
  { id: "tr.dask", phase: "register", basis: "law", laws: [L.afet, L.dask2026], due: null, check: true },
  { id: "tr.propertyTax", phase: "register", basis: "law", laws: [L.emlak], due: null, check: true },

  { id: "tr.eviction", phase: "possession", basis: "law", laws: [L.iik], due: null, onlyIf: "ownerOccupied" },
  { id: "tr.tenant", phase: "possession", basis: "law", laws: [L.tbk, L.iik], due: { from: "awardDate", months: 1, kind: "deadline" }, onlyIf: "tenant", check: true, remindDays: [7, 1] },
  { id: "tr.handover", phase: "possession", basis: "practice", laws: [], due: { from: "handoverDate", kind: "on" } },

  { id: "tr.inspect", phase: "works", basis: "practice", laws: [], due: null },
  { id: "tr.permits", phase: "works", basis: "law", laws: [L.imar], due: null },
  { id: "tr.condo", phase: "works", basis: "practice", laws: [L.katMulkiyeti], due: null, onlyIf: "condo" },
];

export const CLOSING_TASKS: Record<MarketCode, ClosingTaskDef[]> = { DE: DE_TASKS, TR: TR_TASKS };

export const closingTaskIds = (market: MarketCode): Set<string> => new Set(CLOSING_TASKS[market].map((task) => task.id));
