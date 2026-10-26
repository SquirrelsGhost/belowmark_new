import { ExposePhoto } from "@/types/expose.types";

interface ExposeGalleryProps {
  photos: ExposePhoto[];
}

/** The further photos, two per row, each with the seller's caption. */
export default function ExposeGallery({ photos }: ExposeGalleryProps) {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {photos.map((photo) => (
        <li key={photo.id} className="break-inside-avoid">
          {/* eslint-disable-next-line @next/next/no-img-element -- a data URL from this browser, nothing for next/image to optimise */}
          <img src={photo.dataUrl} alt={photo.caption} width={photo.width} height={photo.height} className="aspect-[4/3] w-full border border-rule object-cover" />
          {photo.caption && <p className="mt-1 text-[11px] text-muted">{photo.caption}</p>}
        </li>
      ))}
    </ul>
  );
}
