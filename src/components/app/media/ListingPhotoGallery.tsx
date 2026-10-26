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

const FRAME_CLASSES =
  "relative flex aspect-[4/3] w-full flex-col justify-between overflow-hidden border-2 border-ink bg-ink";
const TAB_BASE =
  "cursor-pointer px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] uppercase transition-colors";
const NAV_BTN =
  "flex size-8 cursor-pointer items-center justify-center border border-paper-bright/40 bg-ink/80 font-mono text-sm text-paper-bright transition-colors hover:bg-signal";

export default function ListingPhotoGallery({
  galleryUrls,
  aerialTiles,
  portalHref,
  streetViewHref,
  slotLabel,
  isTr,
}: ListingPhotoGalleryProps) {
  const hasPhotos = galleryUrls.length > 0;
  const hasAerial = aerialTiles.length === 4;
  const [mode, setMode] = useState<"photos" | "aerial">(hasPhotos ? "photos" : "aerial");
  const [index, setIndex] = useState(0);

  if (!hasPhotos && !hasAerial) {
    return <PhotoSlot label={slotLabel} href={portalHref} />;
  }

  const activeMode = mode === "photos" && hasPhotos ? "photos" : "aerial";
  const safeIdx = hasPhotos ? index % galleryUrls.length : 0;
  const currentPhoto = galleryUrls[safeIdx];

  const photoTabLabel = isTr ? `Taşınmaz Fotoğrafları (${galleryUrls.length})` : `Objektfotos (${galleryUrls.length})`;
  const aerialTabLabel = isTr ? "Uydu & Hava Görünümü" : "Luftbild & Satellit";

  return (
    <div className="flex flex-col gap-2">
      {(hasPhotos && hasAerial) && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMode("photos")}
            className={`${TAB_BASE} ${activeMode === "photos" ? "bg-ink text-paper-bright" : "border border-rule bg-paper-bright text-ink-soft hover:text-ink"}`}
          >
            {photoTabLabel}
          </button>
          <button
            type="button"
            onClick={() => setMode("aerial")}
            className={`${TAB_BASE} ${activeMode === "aerial" ? "bg-ink text-paper-bright" : "border border-rule bg-paper-bright text-ink-soft hover:text-ink"}`}
          >
            {aerialTabLabel}
          </button>
        </div>
      )}

      {activeMode === "photos" ? (
        <div className={FRAME_CLASSES}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentPhoto}
            alt={`${slotLabel} ${safeIdx + 1}`}
            className="absolute inset-0 size-full object-cover"
          />
          <div className="relative z-10 flex items-center justify-between bg-gradient-to-b from-ink/80 to-transparent p-2.5">
            <span className="bg-ink/85 px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] text-paper-bright uppercase">
              {isTr ? "RESMÎ DOSYA FOTOĞRAFI" : "AMTLICHES OBJEKTFOTO"} · {safeIdx + 1} / {galleryUrls.length}
            </span>
            <a
              href={currentPhoto}
              target="_blank"
              rel="noreferrer"
              className="bg-paper-bright/90 px-2 py-0.5 font-mono text-[10px] font-semibold text-ink uppercase hover:bg-signal hover:text-paper-bright"
            >
              {isTr ? "Tam Ekran ↗" : "Vollbild ↗"}
            </a>
          </div>

          {galleryUrls.length > 1 && (
            <div className="relative z-10 flex items-center justify-between px-2.5">
              <button
                type="button"
                aria-label="Vorheriges Foto"
                onClick={() => setIndex((prev) => (prev - 1 + galleryUrls.length) % galleryUrls.length)}
                className={NAV_BTN}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Nächstes Foto"
                onClick={() => setIndex((prev) => (prev + 1) % galleryUrls.length)}
                className={NAV_BTN}
              >
                →
              </button>
            </div>
          )}

          <div className="relative z-10 bg-gradient-to-t from-ink/85 to-transparent p-2 text-right">
            <span className="font-mono text-[10px] text-paper-bright/80">
              {isTr ? "Kaynak: Resmî İhale Dosyası" : "Quelle: Gutachten / Exposé / Justizportal"}
            </span>
          </div>
        </div>
      ) : (
        <a
          href={streetViewHref}
          target="_blank"
          rel="noreferrer"
          className={`${FRAME_CLASSES} group`}
        >
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            {aerialTiles.map((tileUrl, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={i} src={tileUrl} alt="" className="size-full object-cover" />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="size-12 rounded-full border-2 border-signal bg-signal/15 shadow-sm transition-transform group-hover:scale-110" />
          </div>
          <div className="relative z-10 flex items-center justify-between bg-gradient-to-b from-ink/80 to-transparent p-2.5">
            <span className="bg-ink/85 px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] text-paper-bright uppercase">
              {aerialTabLabel}
            </span>
            <span className="bg-paper-bright/95 px-2 py-0.5 font-mono text-[10px] font-semibold text-ink uppercase group-hover:bg-signal group-hover:text-paper-bright">
              Street View & 3D ↗
            </span>
          </div>
          <div className="relative z-10 bg-gradient-to-t from-ink/85 to-transparent p-2">
            <span className="font-mono text-[10px] text-paper-bright/85">
              {isTr
                ? "Taşınmaz çevresi uydu görünümü · Tıklayınca Sokak Görünümü açılır"
                : "Orthofoto des Zielgebiets · Klick öffnet Google Street View & 3D-Ansicht"}
            </span>
          </div>
        </a>
      )}

      {activeMode === "photos" && galleryUrls.length > 1 && (
        <div className="grid grid-cols-6 gap-1.5">
          {galleryUrls.slice(0, 6).map((url, idx) => (
            <button
              key={url}
              type="button"
              onClick={() => setIndex(idx)}
              className={`relative aspect-[4/3] cursor-pointer overflow-hidden border ${safeIdx === idx ? "border-2 border-signal" : "border-rule opacity-75 hover:opacity-100"}`}
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
