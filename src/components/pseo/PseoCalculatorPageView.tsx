import Link from "next/link";
import PseoPublicCalculator from "@/components/pseo/PseoPublicCalculator";
import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";

interface PseoCalculatorPageViewProps {
  locale: "de" | "tr";
  topEntities: ReadonlyArray<{ slug: string; name: string; totalCount: number }>;
}

export default function PseoCalculatorPageView({ locale, topEntities }: PseoCalculatorPageViewProps) {
  const isTr = locale === "tr";
  const canonicalUrl = isTr
    ? `${BELOWMARK_ORIGIN}/tr/hesaplama/icra-ihale-teminat`
    : `${BELOWMARK_ORIGIN}/rechner/5-10-und-7-10-grenze`;

  const faqs = isTr
    ? [
        {
          q: "İcra ihalesinde %50 açılış bedeli nasıl hesaplanır?",
          a: "İİK m. 114 ve Elektronik Satış Yönetmeliği uyarınca 1. ve 2. açık artırmada ihale, muhammen bedelin %50'si ile paraya çevirme ve paylaştırma giderlerinin toplamı üzerinden başlar.",
        },
        {
          q: "UYAP E-Satış teminat oranı (%10) nedir?",
          a: "İhaleye katılabilmek için taşınmazın takdir edilen muhammen bedelinin %10'u tutarında nakit teminatın veya kesin ve süresiz banka teminat mektubunun artırma bitiminden önceki gün saat 23:30'a kadar yatırılması şarttır.",
        },
        {
          q: "İhale sonrası tapu harcı ve KDV oranı kaçtır?",
          a: "İcra ihalelerinde alıcı payı tapu harcı %2'dir. KDV oranı ise 150 m² altı konutlarda genellikle %1 veya %10, işyeri ve arsalarda %20 olarak uygulanır; kesin oran satış ilanında belirtilir.",
        },
      ]
    : [
        {
          q: "Was bedeutet die 5/10-Grenze (§ 85a ZVG) bei der Zwangsversteigerung?",
          a: "Bleibt das abgegebene Meistgebot im ersten Versteigerungstermin unter 50 % (5/10) des gerichtlich festgesetzten Verkehrswerts (§ 74a Abs. 5 ZVG), muss das Vollstreckungsgericht den Zuschlag von Amts wegen versagen.",
        },
        {
          q: "Was ist der Unterschied zur 7/10-Grenze (§ 74a ZVG)?",
          a: "Liegt das Meistgebot zwischen 50 % und unter 70 % (7/10) des Verkehrswerts, kann ein berechtigter Gläubiger die Versagung des Zuschlags beantragen. Stellt der Gläubiger keinen Antrag, ist ein Zuschlag bereits ab 50 % möglich.",
        },
        {
          q: "Wie hoch ist die Sicherheitsleistung (§ 68 ZVG) im Versteigerungstermin?",
          a: "Die Bietsicherheit beträgt in der Regel 10 % des festgesetzten Verkehrswerts und muss vor dem Termin per Überweisung an die Gerichtskasse oder per Bundesbankscheck/Bankbürgschaft nachgewiesen werden.",
        },
      ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: isTr
      ? "Belowmark İcra İhale %50 Açılış, Teminat (%10) ve Tapu Harcı Hesaplama Aracı"
      : "Belowmark 5/10- & 7/10-Grenze Rechner (§ 74a / § 85a ZVG)",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: canonicalUrl,
    offers: { "@type": "Offer", price: "0", priceCurrency: isTr ? "TRY" : "EUR" },
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />

      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink-muted">
        <Link href="/" className="hover:text-ink">Belowmark</Link>
        <span>/</span>
        <Link href={isTr ? "/tr/icra-ihale" : "/zwangsversteigerungen"} className="hover:text-ink">
          {isTr ? "Türkiye İcra & İhale" : "Zwangsversteigerungen"}
        </Link>
        <span>/</span>
        <span className="font-semibold text-signal">{isTr ? "Hesaplama Aracı" : "ZVG-Rechner"}</span>
      </div>

      <h1 className="mt-4 font-display text-3xl leading-[1.08] tracking-tight text-ink sm:text-5xl">
        {isTr
          ? "İcra İhale %50 Açılış Bedeli, %10 Teminat ve Tapu Harcı Hesaplama"
          : "5/10- & 7/10-Grenze Rechner: Zwangsversteigerung (§ 74a / § 85a ZVG)"}
      </h1>
      <p className="mt-4 max-w-3xl font-serif text-lg leading-relaxed text-ink-soft">
        {isTr
          ? "Taşınmazın muhammen bedelini ve teklif oranınızı girin: UYAP E-Satış %50 asgari açılış bedelini, %10 elektronik teminat tutarını ve ihale sonrası tapu harcı + KDV toplam maliyetinizi saniyeler içinde hesaplayın."
          : "Berechnen Sie kostenlos die absolute 5/10-Wertgrenze (§ 85a ZVG), die 7/10-Gläubigergrenze (§ 74a ZVG), die 10 % Sicherheitsleistung (§ 68 ZVG), den Gerichtszuschlag und die Grunderwerbsteuer nach Bundesland."}
      </p>

      <div className="mt-8">
        <PseoPublicCalculator locale={locale} />
      </div>

      <section className="mt-12 border-t-2 border-ink pt-8">
        <h2 className="font-display text-2xl text-ink">
          {isTr ? "Sıkça Sorulan Hukuki ve Mali Sorular" : "Häufige Fragen zu Wertgrenzen & Sicherheitsleistung im ZVG"}
        </h2>
        <div className="mt-5 grid gap-4">
          {faqs.map((f) => (
            <div key={f.q} className="border border-rule-strong bg-paper-bright p-5">
              <h3 className="font-display text-lg text-ink">{f.q}</h3>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ink-soft">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-rule-strong pt-8">
        <h2 className="font-display text-xl text-ink">
          {isTr ? "Aktif İcra İhalelerini İnceleyin" : "Aktuelle Zwangsversteigerungen nach Amtsgericht prüfen"}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {topEntities.map((item) => (
            <Link
              key={item.slug}
              href={isTr ? `/tr/icra-ihale/${item.slug}` : `/amtsgericht/${item.slug}`}
              className="border border-rule-strong bg-paper px-3 py-1.5 font-mono text-xs text-ink hover:border-ink hover:bg-paper-bright"
            >
              {item.name} ({item.totalCount})
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
