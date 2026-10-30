// Needs useState for interactive gallery photo switching and tab selection
"use client";

import { useState } from "react";
import PhotoSlot from "@/components/app/media/PhotoSlot";

interface ListingPhotoGalleryProps {
  galleryUrls: string[];
  aerialTiles: string[];
  portalHref: string;
  streetViewHref: string;
  slotLabel: string;
  isTr: boolean;
}

const FRAME_CLASSES = "relative flex aspect-[4/3] w-full flex-col justify-between overflow-hidden border-2 border-ink bg-ink";
const TAB_BASE = "cursor-pointer px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] uppercase transition-colors";
const TAB_ACTIVE = `${TAB_BASE} bg-ink text-paper-bright`;
const TAB_INACTIVE = `${TAB_BASE} border border-rule bg-paper-bright text-ink-soft hover:text-ink`;
const TOP_BAR_CLASSES = "relative z-10 flex items-center justify-between bg-gradient-to-b from-ink/80 to-transparent p-2.5";
const BADGE_CLASSES = "bg-ink/85 px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] text-paper-bright uppercase";
const NAV_BTN = "flex size-8 cursor-pointer items-center justify-center border border-paper-bright/40 bg-ink/80 font-mono text-sm text-paper-bright transition-colors hover:bg-signal";
const STREET_VIEW_LABEL = "Street View & 3D ↗";

const COPY_TR = {
  title: "Taşınmaz fotoğrafı",
  badge: "RESMÎ DOSYA FOTOĞRAFI",
  fullscreen: "Tam Ekran ↗",
  prevPhoto: "Önceki fotoğraf",
  nextPhoto: "Sonraki fotoğraf",
  source: "Kaynak: Resmî İhale Dosyası",
  aerialTab: "Uydu & Hava Görünümü",
  aerialHint: "Taşınmaz çevresi uydu görünümü · Tıklayınca Sokak Görünümü açılır",
} as const;

const COPY_DE = {
  title: "Objektfoto",
  badge: "AMTLICHES OBJEKTFOTO",
  fullscreen: "Vollbild ↗",
  prevPhoto: "Vorheriges Foto",
  nextPhoto: "Nächstes Foto",
  source: "Quelle: Gutachten / Exposé / Justizportal",
  aerialTab: "Luftbild & Satellit",
  aerialHint: "Orthofoto des Zielgebiets · Klick öffnet Google Street View & 3D-Ansicht",
} as const;

export default function ListingPhotoGallery({ galleryUrls, aerialTiles, portalHref, streetViewHref, slotLabel, isTr }: ListingPhotoGalleryProps) {
  const hasPhotos = galleryUrls.length > 0;
  const hasAerial = aerialTiles.length === 4;
  const [mode, setMode] = useState<"photos" | "aerial">(hasPhotos ? "photos" : "aerial");
  const [index, setIndex] = useState(0);

  if (!hasPhotos && !hasAerial) {
    return <PhotoSlot label={slotLabel} href={portalHref} />;
  }

  const copy = isTr ? COPY_TR : COPY_DE;
  const activeMode = mode === "photos" && hasPhotos ? "photos" : "aerial";
  const safeIndex = hasPhotos ? index % galleryUrls.length : 0;
  const currentPhoto = galleryUrls[safeIndex];
  const photoTabLabel = isTr ? `Taşınmaz Fotoğrafları (${galleryUrls.length})` : `Objektfotos (${galleryUrls.length})`;
  const aerialTabLabel = copy.aerialTab;

  return (
    <div className="flex flex-col gap-2">
      {hasPhotos && hasAerial && (
        <div className="flex items-center gap-1.5">
          <button type="button" aria-pressed={activeMode === "photos"} onClick={() => setMode("photos")} className={activeMode === "photos" ? TAB_ACTIVE : TAB_INACTIVE}>
            {photoTabLabel}
          </button>
          <button type="button" aria-pressed={activeMode === "aerial"} onClick={() => setMode("aerial")} className={activeMode === "aerial" ? TAB_ACTIVE : TAB_INACTIVE}>
            {aerialTabLabel}
          </button>
        </div>
      )}

      {activeMode === "photos" ? (
        <div className={FRAME_CLASSES}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentPhoto} alt={`${slotLabel} ${safeIndex + 1}`} className="absolute inset-0 size-full object-cover" />
          <div className={TOP_BAR_CLASSES}>
            <span className={BADGE_CLASSES}>
              {copy.badge} · {safeIndex + 1} / {galleryUrls.length}
            </span>
            <a href={currentPhoto} target="_blank" rel="noreferrer" className="bg-paper-bright/90 px-2 py-0.5 font-mono text-[10px] font-semibold text-ink uppercase hover:bg-signal hover:text-paper-bright">
              {copy.fullscreen}
            </a>
          </div>

          {galleryUrls.length > 1 && (
            <div className="relative z-10 flex items-center justify-between px-2.5">
              <button type="button" aria-label={copy.prevPhoto} onClick={() => setIndex((prev) => (prev - 1 + galleryUrls.length) % galleryUrls.length)} className={NAV_BTN}>
                ←
              </button>
              <button type="button" aria-label={copy.nextPhoto} onClick={() => setIndex((prev) => (prev + 1) % galleryUrls.length)} className={NAV_BTN}>
                →
              </button>
            </div>
          )}

          <div className="relative z-10 bg-gradient-to-t from-ink/85 to-transparent p-2 text-right">
            <span className="font-mono text-[10px] text-paper-bright/80">{copy.source}</span>
          </div>
        </div>
      ) : (
        <a href={streetViewHref} target="_blank" rel="noreferrer" className={`${FRAME_CLASSES} group`}>
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            {aerialTiles.map((tileUrl, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={i} src={tileUrl} alt="" className="size-full object-cover" />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="size-12 rounded-full border-2 border-signal bg-signal/15 shadow-sm transition-transform group-hover:scale-110" />
          </div>
          <div className={TOP_BAR_CLASSES}>
            <span className={BADGE_CLASSES}>{aerialTabLabel}</span>
            <span className="bg-paper-bright/95 px-2 py-0.5 font-mono text-[10px] font-semibold text-ink uppercase group-hover:bg-signal group-hover:text-paper-bright">{STREET_VIEW_LABEL}</span>
          </div>
          <div className="relative z-10 bg-gradient-to-t from-ink/85 to-transparent p-2">
            <span className="font-mono text-[10px] text-paper-bright/85">{copy.aerialHint}</span>
          </div>
        </a>
      )}

      {activeMode === "photos" && galleryUrls.length > 1 && (
        <div className="grid grid-cols-6 gap-1.5">
          {galleryUrls.slice(0, 6).map((url, idx) => (
            <button
              key={url}
              type="button"
              aria-label={`${copy.title} ${idx + 1}`}
              aria-current={idx === safeIndex ? "true" : undefined}
              onClick={() => setIndex(idx)}
              className={`relative aspect-[4/3] cursor-pointer overflow-hidden border ${safeIndex === idx ? "border-2 border-signal" : "border-rule opacity-75 hover:opacity-100"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
