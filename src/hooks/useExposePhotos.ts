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
        .catch(() => {
          if (!isCancelled) {
            setPhotos([]);
            setError(true);
          }
        });
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
      try {
        const confirmedAt = new Date().toISOString();
        const current = await readPhotos(listingId).catch(() => photos);
        const room = PHOTO_LIMIT - current.length;
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
        if (added.length > 0) await save([...current, ...added]);
      } catch {
        setError(true);
      } finally {
        setBusy(false);
      }
    },
    [listingId, photos, save],
  );

  const remove = useCallback(
    async (id: string) => {
      setBusy(true);
      try {
        const current = await readPhotos(listingId).catch(() => photos);
        await save(current.filter((photo) => photo.id !== id));
      } catch {
        setError(true);
      } finally {
        setBusy(false);
      }
    },
    [listingId, photos, save],
  );
  const makeTitle = useCallback(
    async (id: string) => {
      setBusy(true);
      try {
        const current = await readPhotos(listingId).catch(() => photos);
        await save([...current.filter((photo) => photo.id === id), ...current.filter((photo) => photo.id !== id)]);
      } catch {
        setError(true);
      } finally {
        setBusy(false);
      }
    },
    [listingId, photos, save],
  );
  const setCaption = useCallback(
    async (id: string, caption: string) => {
      setBusy(true);
      try {
        const current = await readPhotos(listingId).catch(() => photos);
        await save(current.map((photo) => (photo.id === id ? { ...photo, caption } : photo)));
      } catch {
        setError(true);
      } finally {
        setBusy(false);
      }
    },
    [listingId, photos, save],
  );

  return { photos, isBusy, hasError, add, remove, makeTitle, setCaption };
}
