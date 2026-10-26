// Uploads or removes the logo through Server Actions
"use client";

import { useActionState } from "react";
import { BrandActionState, removeLogoAction, uploadLogoAction } from "@/lib/clientShare/brandActions";
import { LOGO_MIMES } from "@/lib/clientShare/brandRules";
import { LABEL_CLASSES } from "@/lib/appStyles";
import { IClientShareTranslation } from "@/translations/clientShare/IClientShareTranslation";

interface BrandLogoFormProps {
  hasBrand: boolean;
  logoSrc: string | null;
  labels: IClientShareTranslation;
}

const BUTTON = "inline-flex h-9 cursor-pointer items-center border border-ink px-3 font-narrow text-[11px] font-semibold tracking-[0.08em] uppercase disabled:opacity-60";

/** The logo: upload (PNG/JPEG/WebP, checked on the server by its bytes) or remove. */
export default function BrandLogoForm({ hasBrand, logoSrc, labels }: BrandLogoFormProps) {
  const [upload, uploadAction, isUploading] = useActionState<BrandActionState, FormData>(uploadLogoAction, { ok: true });
  const [removal, removeAction, isRemoving] = useActionState<BrandActionState>(removeLogoAction, { ok: true });
  const { Brand: B, Errors } = labels;
  const error = (!upload.ok && upload.error) || (!removal.ok && removal.error) || null;

  return (
    <div className="flex flex-col gap-2">
      <span className={LABEL_CLASSES}>{B.Logo}</span>
      {!hasBrand ? (
        <p className="text-sm text-muted">{B.LogoNeedsBrand}</p>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <form action={uploadAction} className="flex flex-wrap items-center gap-3">
            <input name="logo" type="file" required accept={LOGO_MIMES.join(",")} className="max-w-64 text-[12px] file:mr-3 file:h-9 file:cursor-pointer file:border file:border-ink file:bg-paper-bright file:px-3" />
            <button type="submit" disabled={isUploading} className={BUTTON}>
              {B.LogoUpload}
            </button>
          </form>
          {logoSrc && (
            <form action={removeAction}>
              <button type="submit" disabled={isRemoving} className={`${BUTTON} border-transparent text-signal`}>
                {B.LogoRemove}
              </button>
            </form>
          )}
        </div>
      )}
      <span className="text-[11px] leading-snug text-muted">{B.LogoHint}</span>
      {error && (
        <span role="alert" className="text-sm text-signal">
          {Errors[error]}
        </span>
      )}
    </div>
  );
}
