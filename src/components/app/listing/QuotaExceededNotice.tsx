import Link from "next/link";
import { APP_ROUTES } from "@/lib/appConstants";
import { LocaleOption } from "@/lib/constants";

interface QuotaExceededNoticeProps {
  locale: LocaleOption;
  retryAfterMinutes: number;
  isLocked: boolean;
}

const COPY = {
  de: {
    kicker: "Sicherheitsschutz · Abruflimit erreicht",
    title: "Ungewöhnlich hohe Abruffrequenz erkannt",
    bodyFree:
      "Im kostenlosen Konto ist das Kontingent für Einzelabrufe zum Schutz vor automatisiertem Datenabzug begrenzt. Mit dem Investor-Tarif schalten Sie das volle Arbeitskontingent, alle Verkehrswerte und Gutachten frei.",
    bodyPaid:
      "Zum Schutz vor automatisiertem Massen-Scraping ist die Anzahl gleichzeitiger Abrufe begrenzt. Bitte warten Sie einen kurzen Moment, bevor Sie weitere Verfahren öffnen.",
    warning:
      "Wichtiger Hinweis (§ 9 AGB): Automatisiertes Auslesen (Scraping/Bots) oder das Umgehen von Schutzmechanismen führt zur sofortigen, dauerhaften Kontosperrung ohne Anspruch auf Rückerstattung bereits gezahlter Entgelte.",
    retryPrefix: "Erneuter Abruf möglich in ca.",
    minutes: "Min.",
    ctaFree: "Investor-Tarif freischalten",
    ctaBack: "Zurück zur Übersicht",
  },
  tr: {
    kicker: "Güvenlik Koruması · Sorgu Sınırı",
    title: "Olağandışı sorgu sıklığı algılandı",
    bodyFree:
      "Otomatik veri çekimini önlemek amacıyla ücretsiz hesaplarda günlük detay görüntüleme sayısı sınırlandırılmıştır. Tam erişim, muhammen bedeller ve şartnameler için Yatırımcı paketine geçebilirsiniz.",
    bodyPaid:
      "Otomatik toplu veri çekimini (scraping) engellemek için anlık sorgu sınırı uygulanmaktadır. Lütfen kısa bir süre bekleyip tekrar deneyin.",
    warning:
      "Önemli Uyarı (§ 9 AGB): Otomatik veri çekimi (scraping/bot) veya güvenlik sınırlarını aşma girişimleri, ödenmiş ücretlerin iadesi olmaksızın hesabın derhal ve kalıcı olarak kapatılmasına yol açar.",
    retryPrefix: "Tekrar deneme süresi:",
    minutes: "dk.",
    ctaFree: "Yatırımcı Paketine Geç",
    ctaBack: "Listeye Dön",
  },
} as const;

export default function QuotaExceededNotice({ locale, retryAfterMinutes, isLocked }: QuotaExceededNoticeProps) {
  const text = locale === "tr" ? COPY.tr : COPY.de;
  return (
    <section className="my-8 border-2 border-ink bg-paper-bright p-6 sm:p-8">
      <p className="font-mono text-[11px] tracking-[0.16em] text-signal uppercase">{text.kicker}</p>
      <h2 className="mt-2 font-narrow text-2xl font-bold text-ink">{text.title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
        {isLocked ? text.bodyFree : text.bodyPaid}
      </p>
      <p className="mt-3 max-w-2xl border-l-2 border-signal pl-3 font-mono text-xs leading-relaxed text-ink">
        {text.warning}
      </p>
      <p className="mt-3 font-mono text-xs text-muted">
        {text.retryPrefix} {retryAfterMinutes} {text.minutes}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {isLocked && (
          <Link
            href="/buchen"
            className="bg-signal px-4 py-2 font-narrow text-xs font-bold tracking-[0.14em] text-paper-bright uppercase hover:bg-ink"
          >
            {text.ctaFree}
          </Link>
        )}
        <Link
          href={APP_ROUTES.search}
          className="border border-ink px-4 py-2 font-narrow text-xs font-bold tracking-[0.14em] text-ink uppercase hover:bg-paper-warm"
        >
          {text.ctaBack}
        </Link>
      </div>
    </section>
  );
}
