import { FindingStance, ReportFactKey, ReportKind, ReportLanguage, ReportTopic } from "@/types/report.types";

/**
 * Fixed reading rules for Gutachten (DE: Verkehrswertgutachten nach § 74a ZVG /
 * ImmoWertV, TR: kıymet takdir / bilirkişi raporu).
 *
 * A rule only points at a sentence; the sentence itself is the statement.
 * `absent` and `unclear` are checked before `match`, so "keine Altlasten"
 * becomes a green "absent" passage and never a red one.
 */
export interface KindRule {
  kind: ReportKind;
  topic: ReportTopic;
  match: RegExp;
  absent?: RegExp;
  unclear?: RegExp;
}

export interface FactRule {
  key: ReportFactKey;
  /** The first capture group is the value as printed */
  match: RegExp;
}

const NOT_KNOWN_DE = /(nicht auszuschließen|nicht ausgeschlossen|verdacht|nicht bekannt|unbekannt|nicht ermittelt|nicht feststellbar|nicht abschließend|keine angaben|keine auskunft|nicht vorgelegt|nicht geprüft|konnte[n]? nicht|ungeklärt|nicht abschließend geklärt)/iu;

const RULES_DE: KindRule[] = [
  {
    kind: "residence",
    topic: "rights",
    match: /(wohnungsrecht|wohnrecht|dauerwohnrecht|wohnungs- und mitbenutzungsrecht)/iu,
    absent: /(kein(e|en)? (eingetragene[sn]? )?wohn(ungs)?recht|wohn(ungs)?recht[^.]{0,40}(gelöscht|nicht (mehr )?eingetragen))/iu,
    unclear: NOT_KNOWN_DE,
  },
  {
    kind: "usufruct",
    topic: "rights",
    match: /(nie(ß|ss)brauch)/iu,
    absent: /(kein(en)? nie(ß|ss)brauch|nie(ß|ss)brauch[^.]{0,40}(gelöscht|nicht (mehr )?eingetragen))/iu,
    unclear: NOT_KNOWN_DE,
  },
  {
    kind: "easement",
    topic: "rights",
    match: /(grunddienstbarkeit|wegerecht|geh- und fahrrecht|leitungsrecht|überbaurecht|beschränkte persönliche dienstbarkeit|reallast|baulast)/iu,
    absent: /(keine (grund)?dienstbarkeit|keine baulast|baulastenverzeichnis[^.]{0,60}(keine|nicht)|keine eintragung)/iu,
    unclear: NOT_KNOWN_DE,
  },
  { kind: "preemption", topic: "rights", match: /(vorkaufsrecht)/iu, absent: /(kein(e)? vorkaufsrecht)/iu },
  {
    kind: "rightsGeneral",
    topic: "rights",
    match: /(abteilung ii\b|abt\. ?ii\b|lasten und beschränkungen)/iu,
    absent: /(keine eintragung|nicht eingetragen|lastenfrei|ohne eintragung|keine lasten)/iu,
    unclear: NOT_KNOWN_DE,
  },
  { kind: "charges", topic: "charges", match: /(abteilung iii\b|abt\. ?iii\b|grundschuld|hypothek)/iu },
  {
    kind: "tenancy",
    topic: "tenancy",
    match: /(vermietet|mietvertrag|mieter(in|innen)?\b|mietverhältnis|miete von|kaltmiete|nettomiete|verpachtet|pachtvertrag|pachtverhältnis)/iu,
    absent: /(leer ?stehend|leerstand|nicht vermietet|unvermietet|eigengenutzt|eigennutzung|vom eigentümer (selbst )?(genutzt|bewohnt)|bezugsfrei|kein(e)? miet)/iu,
    unclear: NOT_KNOWN_DE,
  },
  {
    kind: "defects",
    topic: "defects",
    match: /(mängel|mangel\b|bauschäden|schäden|schaden\b|feucht|schimmel|risse|rissbildung|instandhaltungsstau|sanierungsstau|reparaturstau|undicht|hausschwamm|asbest|sanierungsbedürftig|renovierungsbedürftig|modernisierungsbedarf|instandsetzungsbedarf)/iu,
    absent: /(keine (wesentlichen |erkennbaren |sichtbaren |augenscheinlichen )*(bau)?(mängel|schäden)|mängelfrei|schadensfrei)/iu,
  },
  {
    kind: "contamination",
    topic: "contamination",
    match: /(altlast|kontaminat|bodenverunreinigung|schadstoff|bodenbelastung)/iu,
    absent: /(keine altlast|kein altlastenverdacht|nicht im altlasten|keine hinweise auf (altlasten|kontamination|bodenverunreinigung)|altlastenfrei|nicht als altlast)/iu,
    unclear: NOT_KNOWN_DE,
  },
  {
    kind: "heritage",
    topic: "heritage",
    match: /(denkmal|ensembleschutz|denkmalschutz|denkmalliste)/iu,
    absent: /(kein(e|en)? (bau)?denkmal|nicht (unter |dem )?denkmalschutz|nicht als (bau)?denkmal|nicht in der denkmalliste|kein denkmalschutz)/iu,
  },
  {
    kind: "leasehold",
    topic: "leasehold",
    match: /(erbbaurecht|erbbauzins|erbbaugrundbuch|erbbauberechtigt)/iu,
    absent: /(kein erbbaurecht)/iu,
  },
  {
    kind: "inspection",
    topic: "inspection",
    match: /(innenbesichtigung|besichtigung|ortstermin|nicht betreten|von außen|außenbesichtigung|zutritt)/iu,
    unclear: /(nicht möglich|nicht ermöglicht|verweigert|nicht gewährt|nicht betreten|nur von außen|keine innenbesichtigung|nicht zugänglich|nicht erschienen)/iu,
  },
];

const NOT_KNOWN_TR = /(bilinmemekte|tespit edilemedi|belirlenemedi|bilgi (alınamadı|verilmedi)|anlaşılamadı)/iu;

const RULES_TR: KindRule[] = [
  { kind: "residence", topic: "rights", match: /(oturma hakk|sükna hakk|sükn[aâ])/iu, unclear: NOT_KNOWN_TR },
  { kind: "usufruct", topic: "rights", match: /(intifa hakk|intifa)/iu, unclear: NOT_KNOWN_TR },
  { kind: "easement", topic: "rights", match: /(irtifak|geçit hakk|mecra)/iu },
  { kind: "preemption", topic: "rights", match: /(şufa|önalım)/iu },
  {
    kind: "rightsGeneral",
    topic: "rights",
    match: /(şerh|beyanlar hanesi|takyidat|kısıtlama)/iu,
    absent: /(şerh[^.]{0,40}(bulunmamaktadır|yoktur)|takyidat bulunmamaktadır)/iu,
  },
  { kind: "charges", topic: "charges", match: /(ipotek|haciz)/iu },
  {
    kind: "tenancy",
    topic: "tenancy",
    match: /(kirac|kira sözleşme|kirada|kira bedeli|işgalci|tahliye|fuzuli şagil)/iu,
    absent: /(boş (olduğu|durumda|vaziyette)|boştur|kullanılmamakta|malik tarafından kullanıl|borçlu tarafından kullanıl)/iu,
    unclear: NOT_KNOWN_TR,
  },
  {
    kind: "defects",
    topic: "defects",
    match: /(hasar|çatlak|rutubet|nem |küf|bakımsız|onarım|tadilat gerek|yıpran|sızıntı|deforme)/iu,
    absent: /(hasar (bulunmamaktadır|yoktur|tespit edilmemiştir)|bakımlı)/iu,
  },
  { kind: "contamination", topic: "contamination", match: /(kirlilik|kirlenmiş|kontamin|tehlikeli atık)/iu },
  {
    kind: "heritage",
    topic: "heritage",
    match: /(sit alan|tescilli|kültür varlığ|koruma amaçlı imar|anıt eser|koruma kurulu)/iu,
    absent: /(sit alanı (içinde|kapsamında) (değil|bulunmamaktadır)|tescilli değil)/iu,
  },
  { kind: "leasehold", topic: "leasehold", match: /(üst hakk|üst hakkı)/iu },
  {
    kind: "inspection",
    topic: "inspection",
    match: /(keşif|yerinde inceleme|mahallinde)/iu,
    unclear: /(içeri(sine)? girilemedi|kapalı olduğundan|incelenemedi|dışarıdan)/iu,
  },
];

const FACTS_DE: FactRule[] = [
  { key: "marketValue", match: /verkehrswert.{0,120}?((?:\d{1,3}(?:\.\d{3})+(?:,\d{2})?|\d+(?:,\d{2})?)\s*(?:€|eur\b|euro\b))/iu },
  { key: "valuationDate", match: /(?:wertermittlungsstichtag|bewertungsstichtag|qualitätsstichtag)[^\d]{0,30}(\d{1,2}\.\s?\d{1,2}\.\s?\d{2,4})/iu },
  { key: "yearBuilt", match: /baujahr[^\d]{0,30}((?:ca\.\s?)?1[6-9]\d\d|(?:ca\.\s?)?20\d\d)/iu },
  { key: "livingArea", match: /wohnfläche[^\d]{0,40}(\d{1,4}(?:,\d{1,2})?\s*m²)/iu },
  { key: "plotArea", match: /grundstücks(?:größe|fläche)[^\d]{0,40}(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?\s*m²)/iu },
];

const FACTS_TR: FactRule[] = [
  { key: "marketValue", match: /(?:muhammen bedel|kıymet(?:i)?|değeri).{0,80}?(\d{1,3}(?:\.\d{3})+(?:,\d{2})?\s*(?:tl\b|₺))/iu },
  { key: "valuationDate", match: /(?:rapor tarihi|keşif tarihi|değerleme tarihi)[^\d]{0,20}(\d{1,2}[./]\d{1,2}[./]\d{2,4})/iu },
  { key: "yearBuilt", match: /(?:yapım yılı|inşa yılı|yapı yaşı)[^\d]{0,20}(1[89]\d\d|20\d\d)/iu },
  { key: "livingArea", match: /(?:net|brüt) (?:kullanım )?alan[ıi]?[^\d]{0,20}(\d{1,4}(?:,\d{1,2})?\s*m²)/iu },
  { key: "plotArea", match: /(?:yüzölçüm(?:ü)?|arsa alanı)[^\d]{0,20}(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?\s*m²)/iu },
];

export const REPORT_RULES: Record<ReportLanguage, { kinds: KindRule[]; facts: FactRule[] }> = {
  de: { kinds: RULES_DE, facts: FACTS_DE },
  tr: { kinds: RULES_TR, facts: FACTS_TR },
};

/** Negations right before or after the keyword ("kein Wohnrecht", "Altlasten bestehen nicht"). */
const NEGATION_BEFORE: Record<ReportLanguage, RegExp> = {
  de: /((\bkein\w*|\bohne)\s+(\S+\s+){0,2}|\bnicht\s+)$/iu,
  tr: /$^/u,
};
const NEGATION_AFTER: Record<ReportLanguage, RegExp> = {
  de: /^[^.;]{0,60}?(besteh\w* (auch )?nicht|lieg\w* nicht vor|nicht vorhanden|nicht verzeichnet|nicht eingetragen|nicht erkennbar|nicht festgestellt|wurden? nicht (festgestellt|gefunden)|gelöscht)/iu,
  tr: /^[^.;]{0,60}?(bulunmamaktadır|bulunmamakta|yoktur|mevcut değil|tespit edilmemiştir|rastlanmamıştır)/iu,
};

/**
 * Stance of a sentence for one rule: explicit "unclear" wording first (it often
 * contains a "nicht" itself), then negations, then the plain mention.
 */
export function stanceOf(rule: KindRule, sentence: string, hit: RegExpExecArray, language: ReportLanguage): FindingStance {
  if (rule.unclear?.test(sentence) && !rule.absent?.test(sentence)) return "unclear";
  if (rule.absent?.test(sentence)) return "absent";
  const before = sentence.slice(Math.max(0, hit.index - 40), hit.index);
  const after = sentence.slice(hit.index + hit[0].length);
  if (NEGATION_BEFORE[language].test(before) || NEGATION_AFTER[language].test(after)) return "absent";
  return "present";
}
