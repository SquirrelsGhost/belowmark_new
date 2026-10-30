import { PHOTO_DB, PHOTO_MAX_EDGE, PHOTO_QUALITY, PHOTO_TYPES } from "@/lib/expose/exposeConstants";
import { ExposePhoto } from "@/types/expose.types";

/**
 * The seller's photos in IndexedDB of this browser, one record per proceeding.
 * Nothing is uploaded: the exposé is printed from here.
 */

/** Fired on this tab after a write, so every component reading the photos refreshes. */
export const PHOTOS_CHANGED = "belowmark:expose-photos";

interface PhotoRecord {
  listingId: string;
  photos: ExposePhoto[];
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(PHOTO_DB.name, PHOTO_DB.version);
    request.onupgradeneeded = () => request.result.createObjectStore(PHOTO_DB.store, { keyPath: "listingId" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const request = action(db.transaction(PHOTO_DB.store, mode).objectStore(PHOTO_DB.store));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

export async function readPhotos(listingId: string): Promise<ExposePhoto[]> {
  const record = await run<PhotoRecord | undefined>("readonly", (store) => store.get(listingId));
  return record?.photos ?? [];
}

export async function writePhotos(listingId: string, photos: ExposePhoto[]): Promise<void> {
  const record: PhotoRecord = { listingId, photos };
  if (photos.length === 0) await run("readwrite", (store) => store.delete(listingId));
  else await run("readwrite", (store) => store.put(record));
  window.dispatchEvent(new Event(PHOTOS_CHANGED));
}

export const isPhotoType = (type: string): boolean => (PHOTO_TYPES as readonly string[]).includes(type);

/**
 * Draws the file onto a canvas at most PHOTO_MAX_EDGE wide or high and keeps a JPEG.
 * Re-encoding drops every EXIF field, the GPS position included.
 */
export async function downscalePhoto(file: File, confirmedAt: string): Promise<ExposePhoto> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    const scale = Math.min(1, PHOTO_MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("canvas unavailable");
    context.drawImage(bitmap, 0, 0, width, height);
    return {
      id: crypto.randomUUID(),
      dataUrl: canvas.toDataURL("image/jpeg", PHOTO_QUALITY),
      width,
      height,
      caption: "",
      rightsConfirmedAt: confirmedAt,
    };
  } finally {
    bitmap.close();
  }
}
