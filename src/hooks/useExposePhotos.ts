import { useCallback, useEffect, useState } from "react";
import { PHOTO_LIMIT } from "@/lib/expose/exposeConstants";
import { PHOTOS_CHANGED, downscalePhoto, isPhotoType, readPhotos, writePhotos } from "@/lib/expose/exposePhotos";
import { ExposePhoto } from "@/types/expose.types";

export interface ExposePhotosState {
  photos: ExposePhoto[];
  isBusy: boolean;
  /** At least one file could not be read */
  hasError: boolean;
  add: (files: FileList) => Promise<void>;
  remove: (id: string) => Promise<void>;
  makeTitle: (id: string) => Promise<void>;
  setCaption: (id: string, caption: string) => Promise<void>;
}

/** The seller's photos for one proceeding, kept in IndexedDB; the first photo is the cover. */
export function useExposePhotos(listingId: string): ExposePhotosState {
  const [photos, setPhotos] = useState<ExposePhoto[]>([]);
  const [isBusy, setBusy] = useState(false);
  const [hasError, setError] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const load = () =>
      readPhotos(listingId)
        .then((stored) => !isCancelled && setPhotos(stored))
        .catch(() => !isCancelled && setPhotos([]));
    load();
    window.addEventListener(PHOTOS_CHANGED, load);
    return () => {
      isCancelled = true;
      window.removeEventListener(PHOTOS_CHANGED, load);
    };
  }, [listingId]);

  const save = useCallback((next: ExposePhoto[]) => writePhotos(listingId, next), [listingId]);

  const add = useCallback(
    async (files: FileList) => {
      setBusy(true);
      setError(false);
      const confirmedAt = new Date().toISOString();
      const room = PHOTO_LIMIT - photos.length;
      const added: ExposePhoto[] = [];
      for (const file of Array.from(files).slice(0, Math.max(0, room))) {
        if (!isPhotoType(file.type)) {
          setError(true);
          continue;
        }
        try {
          added.push(await downscalePhoto(file, confirmedAt));
        } catch {
          setError(true);
        }
      }
      if (added.length > 0) await save([...photos, ...added]);
      setBusy(false);
    },
    [photos, save],
  );

  const remove = useCallback((id: string) => save(photos.filter((photo) => photo.id !== id)), [photos, save]);
  const makeTitle = useCallback((id: string) => save([...photos.filter((photo) => photo.id === id), ...photos.filter((photo) => photo.id !== id)]), [photos, save]);
  const setCaption = useCallback((id: string, caption: string) => save(photos.map((photo) => (photo.id === id ? { ...photo, caption } : photo))), [photos, save]);

  return { photos, isBusy, hasError, add, remove, makeTitle, setCaption };
}
