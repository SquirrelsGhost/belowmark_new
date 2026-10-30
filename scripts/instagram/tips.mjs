// ---------------------------------------------------------------------------
// „Wissen“-Karten. Jede Karte nennt ihre Norm, damit man sie nachlesen kann.
// Nur allgemeine Regeln, keine Einzelfallberatung. Neue Karten nur mit Beleg
// (Gesetzestext auf gesetze-im-internet.de bzw. mevzuat.gov.tr) ergänzen.
// ---------------------------------------------------------------------------

export const TIPS_DE = [
  {
    kicker: "§ 85a ZVG",
    title: "Die 5/10-Grenze",
    body: "Bleibt das Meistgebot im ersten Termin unter der Hälfte des Verkehrswerts, wird der Zuschlag von Amts wegen versagt. Bestehen bleibende Rechte zählen mit.",
    note: "Im nächsten Termin gilt die Grenze nicht mehr.",
  },
  {
    kicker: "§ 74a ZVG",
    title: "Die 7/10-Grenze",
    body: "Liegt das Meistgebot im ersten Termin unter 7/10 des Verkehrswerts, kann ein Berechtigter die Versagung des Zuschlags beantragen.",
    note: "Ob das passiert, entscheidet sich erst im Termin.",
  },
  {
    kicker: "§§ 68, 69 ZVG",
    title: "Sicherheit: 10 %, kein Bargeld",
    body: "Auf Verlangen musst du in der Regel 10 % des Verkehrswerts als Sicherheit leisten. Bargeld ist ausgeschlossen: bestätigter Bundesbank-Scheck, Verrechnungsscheck eines Kreditinstituts oder rechtzeitige Überweisung an die Gerichtskasse.",
    note: "Eine Überweisung muss vor dem Termin gutgeschrieben sein.",
  },
  {
    kicker: "§ 44 ZVG",
    title: "Das geringste Gebot",
    body: "Unter das geringste Gebot kann niemand bieten. Es deckt die Verfahrenskosten und die Rechte, die dem betreibenden Gläubiger vorgehen. Festgestellt wird es erst im Termin.",
    note: "Bestehen bleibende Rechte kommen zum Gebot dazu.",
  },
  {
    kicker: "§ 90 ZVG",
    title: "Eigentum mit dem Zuschlag",
    body: "Mit dem Zuschlag wirst du Eigentümer, nicht erst mit dem Grundbucheintrag. Ab dann trägst du auch die Lasten und das Risiko.",
    note: "Das Grundbuch wird danach nur berichtigt.",
  },
  {
    kicker: "§ 56 ZVG",
    title: "Keine Gewährleistung",
    body: "Bei der Zwangsversteigerung gibt es keinen Anspruch auf Gewährleistung. Mängel, die im Gutachten fehlen, gehen zu deinen Lasten.",
    note: "Darum: Gutachten vollständig lesen, Lage selbst ansehen.",
  },
  {
    kicker: "§ 57a ZVG",
    title: "Vermietet ersteigert",
    body: "Bestehende Mietverträge gehen auf dich über. Du hast ein Sonderkündigungsrecht zum ersten zulässigen Termin, der Kündigungsschutz des BGB gilt aber weiter.",
    note: "Ein berechtigtes Interesse brauchst du trotzdem.",
  },
  {
    kicker: "§ 49 ZVG",
    title: "4 % Zinsen auf das Bargebot",
    body: "Das Bargebot ist vom Zuschlag bis zum Verteilungstermin mit 4 % zu verzinsen. Hinterlegen beendet die Verzinsung (§ 49 Abs. 4 ZVG).",
    note: "In die Kalkulation gehört deshalb auch die Zeit.",
  },
  {
    kicker: "§ 1 Abs. 1 Nr. 4 GrEStG",
    title: "Grunderwerbsteuer fällt an",
    body: "Auch das Meistgebot in der Zwangsversteigerung löst Grunderwerbsteuer aus. Der Satz hängt vom Bundesland ab und liegt zwischen 3,5 und 6,5 %.",
    note: "Dazu kommen Gerichtsgebühren für Zuschlag und Grundbuch.",
  },
];

export const TIPS_TR = [
  {
    kicker: "İİK m. 114/7",
    title: "Teminat: %10",
    body: "Taşınmaz ihalesine katılmak için muhammen bedelin %10'u oranında teminat yatırılır. Teminat yatırılmadan teklif verilemez.",
    note: "Oranı ve şartları her zaman ilandan kontrol edin.",
  },
  {
    kicker: "e-Satış",
    title: "Son 10 dakika kuralı",
    body: "Elektronik satışta son 10 dakika içinde verilen her teklif süreyi 3 dakika uzatır. Uzama toplamda en fazla bir saat sürer.",
    note: "Son saniyede teklif vermek avantaj sağlamaz.",
  },
  {
    kicker: "Muhammen bedel",
    title: "Değer eski olabilir",
    body: "Muhammen bedel, kıymet takdiri yapıldığı günün değeridir. Dosya eskiyse bugünkü piyasa ile arasında büyük fark olabilir.",
    note: "Kıymet takdiri tarihini dosyadan öğrenin.",
  },
  {
    kicker: "Hisseli satış",
    title: "Tamamı mı, payı mı?",
    body: "İlanlarda bazen taşınmazın tamamı değil, yalnızca bir hisse satılır. İlandaki alan bütün taşınmaza aittir, sizin payınıza değil.",
    note: "Hisse oranını ilan metninde arayın.",
  },
  {
    kicker: "1. ve 2. artırma",
    title: "İki tur, iki tarih",
    body: "İlanda iki artırma tarihi yer alır. Birinci artırmada istenen bedele ulaşılmazsa satış ikinci artırmada devam eder.",
    note: "Her iki tarihi ve başlangıç bedelini ilandan okuyun.",
  },
  {
    kicker: "KDV ve masraflar",
    title: "İlanı sonuna kadar okuyun",
    body: "KDV oranı, tapu harcı ve diğer masrafların kime ait olduğu satış ilanında yazar. Teklifi bu kalemlerle birlikte hesaplayın.",
    note: "Rakam ilanda yoksa, belowmark'ta da tahmin göstermeyiz.",
  },
];
