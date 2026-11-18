import NoticeField from "@/components/notice/NoticeField";
import Icon from "@/components/ui/Icon";
import Redacted from "@/components/ui/Redacted";
import Stamp from "@/components/ui/Stamp";
import { HomeNoticeCardConfig } from "@/lib/homeMarketData";
import { ITranslation } from "@/translations/ITranslation";

interface NoticeCardProps {
  t: ITranslation["HomePage"]["Notice"]["Card"];
  redaction: string;
  config: HomeNoticeCardConfig;
}

const LOCKED_LINK = "inline-flex items-center gap-2 border border-ink/40 px-3 py-2 font-mono text-[11px] tracking-wider text-muted uppercase";
const SUBLABEL_CLASSES = "font-mono text-[11px] tracking-wider text-muted uppercase";

/** A court notice pinned to the board: country-aware file format, currency, hints and stamps. */
export default function NoticeCard({ t, redaction, config }: NoticeCardProps) {
  const hints = config.taxHintOverride
    ? [t.Hints[0], t.Hints[1], config.taxHintOverride].filter(Boolean)
    : t.Hints;

  return (
    <article className="relative mx-auto max-w-xl -rotate-1 border border-ink/70 bg-paper-bright p-6 shadow-[0_30px_60px_-30px_rgb(18_17_15/0.45)] transition-transform duration-500 hover:rotate-0 sm:p-8">
      <span aria-hidden="true" className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-2 bg-paper-deep/90 shadow-sm" />
      <div className="absolute top-5 right-5">
        <Stamp label={t.Example} tone="ink" tilt="right" />
      </div>
      <p className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">{config.courtOverride ?? t.Court}</p>
      <p className="mt-1 font-display text-3xl">
        <Redacted label={redaction} width="lg" />
      </p>
      <dl className="mt-6 grid grid-cols-2 gap-x-6 border-t border-ink pt-4">
        <NoticeField label={t.FileNo}>
          {config.filePrefix}
          <Redacted label={redaction} width="xs" />
          {config.fileSuffix}
        </NoticeField>
        <NoticeField label={t.Hearing}>{t.HearingValue}</NoticeField>
        <NoticeField label={t.Kind}>{t.KindValue}</NoticeField>
        <NoticeField label={t.State}>{config.stateValueOverride ?? t.StateValue}</NoticeField>
      </dl>
      <div className="relative mt-8 grid grid-cols-2 gap-6 py-2">
        <div>
          <p className={SUBLABEL_CLASSES}>{t.Appraisal}</p>
          <p className="mt-1 font-display text-4xl">
            <Redacted label={redaction} width="md" /> {config.currencySymbol}
          </p>
        </div>
        <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-1 bg-signal" />
        <span aria-hidden="true" className="absolute top-1/2 right-6 mt-4 size-4 rounded-full bg-ink" />
        <div className="col-start-1 pt-10">
          <p className="font-mono text-[11px] tracking-wider text-signal uppercase">{config.limitLabelOverride ?? t.Limit}</p>
          <p className="mt-1 font-display text-4xl text-signal">
            <Redacted label={redaction} width="sm" /> {config.currencySymbol}
          </p>
        </div>
      </div>
      <div className="mt-6 border-t border-dashed border-ink/40 pt-4">
        <p className={SUBLABEL_CLASSES}>{t.HintsTitle}</p>
        <ul className="mt-3 flex flex-col gap-2">
          {hints.map((hint) => (
            <li key={hint} className="flex items-start gap-3 text-sm">
              <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rotate-45 bg-caution" />
              {hint}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <span className={LOCKED_LINK}>
          <Icon name="arrowUpRight" className="size-3.5" />
          {config.portalLinkOverride ?? t.PortalLink}
        </span>
        <span className={LOCKED_LINK}>
          <Icon name="file" className="size-3.5" />
          {t.PdfLink}
        </span>
      </div>
      <div className="absolute right-6 bottom-24 sm:right-10">
        <Stamp label={t.Stamp} tone="signal" tilt="left" />
      </div>
    </article>
  );
}
