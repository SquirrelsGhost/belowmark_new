// Reads files the seller picks, downscales them in the browser and keeps them in IndexedDB
"use client";

import { useState } from "react";
import ExposePhotoItem from "@/components/expose/ExposePhotoItem";
import { useExposePhotos } from "@/hooks/useExposePhotos";
import { fill } from "@/lib/appFormat";
import { PHOTO_LIMIT, PHOTO_TYPES } from "@/lib/expose/exposeConstants";
import { IExposeTranslation } from "@/translations/expose/IExposeTranslation";

interface ExposePhotoManagerProps {
  listingId: string;
  labels: IExposeTranslation["Photos"];
}

const ADD_CLASSES =
  "inline-flex h-10 cursor-pointer items-center bg-ink px-4 font-narrow text-xs font-semibold tracking-[0.08em] text-paper-bright uppercase has-disabled:cursor-not-allowed has-disabled:opacity-40";

/** Screen-only: the seller's own photos. Adding needs the rights confirmation first. Never printed. */
export default function ExposePhotoManager({ listingId, labels }: ExposePhotoManagerProps) {
  const { photos, isBusy, hasError, add, remove, makeTitle, setCaption } = useExposePhotos(listingId);
  const [hasRights, setRights] = useState(false);
  const isFull = photos.length >= PHOTO_LIMIT;
  return (
    <section aria-label={labels.Title} className="flex flex-col gap-3 border-2 border-ink bg-paper-bright p-5">
      <div>
        <h2 className="font-narrow text-sm font-bold tracking-[0.14em] uppercase">{labels.Title}</h2>
        <p className="mt-1 text-[13px] leading-snug text-ink-soft">{labels.Lead}</p>
      </div>
      <label className="flex items-start gap-2 text-[13px] leading-snug">
        <input type="checkbox" checked={hasRights} onChange={(event) => setRights(event.target.checked)} className="mt-0.5 size-4 accent-signal" />
        {labels.Rights}
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <label className={ADD_CLASSES}>
          {labels.Add}
          <input
            type="file"
            multiple
            accept={PHOTO_TYPES.join(",")}
            disabled={!hasRights || isFull || isBusy}
            onChange={(event) => {
              if (event.target.files) add(event.target.files);
              event.target.value = "";
            }}
            className="sr-only"
          />
        </label>
        <span className="font-mono text-[11px] text-muted">{`${photos.length} / ${PHOTO_LIMIT}`}</span>
        {isBusy && <span className="text-[12px] text-muted">{labels.Busy}</span>}
        {isFull && <span className="text-[12px] text-muted">{fill(labels.Limit, { max: PHOTO_LIMIT })}</span>}
      </div>
      {hasError && <p role="alert" className="text-[12px] text-signal">{labels.Error}</p>}
      {photos.length === 0 ? (
        <p className="bg-hatch px-2 py-1.5 text-[12px] text-ink-soft">{labels.Empty}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((photo, index) => (
            <ExposePhotoItem
              key={photo.id}
              photo={photo}
              isTitle={index === 0}
              labels={labels}
              onRemove={() => remove(photo.id)}
              onMakeTitle={() => makeTitle(photo.id)}
              onCaption={(caption) => setCaption(photo.id, caption)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
