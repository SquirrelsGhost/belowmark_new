import { CAPTION_MAX } from "@/lib/expose/exposeConstants";
import { CONTROL_CLASSES, TEXT_LINK_CLASSES } from "@/lib/appStyles";
import { IExposeTranslation } from "@/translations/expose/IExposeTranslation";
import { ExposePhoto } from "@/types/expose.types";

interface ExposePhotoItemProps {
  photo: ExposePhoto;
  isTitle: boolean;
  labels: IExposeTranslation["Photos"];
  onRemove: () => void;
  onMakeTitle: () => void;
  onCaption: (caption: string) => void;
}

/** One stored photo with its caption; the caption is saved when the field is left. */
export default function ExposePhotoItem({ photo, isTitle, labels, onRemove, onMakeTitle, onCaption }: ExposePhotoItemProps) {
  return (
    <li className="flex flex-col gap-2 border border-rule bg-paper p-2">
      {/* eslint-disable-next-line @next/next/no-img-element -- a data URL from this browser, nothing for next/image to optimise */}
      <img src={photo.dataUrl} alt={photo.caption} width={photo.width} height={photo.height} className="aspect-[4/3] w-full object-cover" />
      <input
        type="text"
        aria-label={labels.Caption}
        placeholder={labels.Caption}
        maxLength={CAPTION_MAX}
        defaultValue={photo.caption}
        onBlur={(event) => event.target.value !== photo.caption && onCaption(event.target.value)}
        className={`${CONTROL_CLASSES} h-8 text-[12px]`}
      />
      <div className="flex items-center justify-between gap-2">
        {isTitle ? (
          <span className="font-mono text-[10px] tracking-[0.14em] text-signal uppercase">{labels.TitlePhoto}</span>
        ) : (
          <button type="button" onClick={onMakeTitle} className={`${TEXT_LINK_CLASSES} cursor-pointer`}>
            {labels.MakeTitle}
          </button>
        )}
        <button type="button" onClick={onRemove} className={`${TEXT_LINK_CLASSES} cursor-pointer text-muted`}>
          {labels.Remove}
        </button>
      </div>
    </li>
  );
}
