"use server";

import { revalidatePath } from "next/cache";
import { checkAccent, normalizeUrl, sniffLogo } from "@/lib/clientShare/brandRules";
import { CLIENT_SHARE, CLIENT_SHARE_ROUTES } from "@/lib/clientShare/clientShareConfig";
import { getProUser } from "@/lib/clientShare/proAccess";
import { BrokerBrandService } from "@/services/BrokerBrandService";
import { ClientShareErrorCode } from "@/types/clientShare.types";

/** Result of a letterhead action; the UI translates the code. */
export interface BrandActionState {
  ok: boolean;
  error?: ClientShareErrorCode;
  saved?: boolean;
}

const field = (formData: FormData, name: string, max: number): string => String(formData.get(name) ?? "").trim().slice(0, max);

/** Optional link field: empty is fine, anything else has to be a real http(s) address. */
const linkField = (formData: FormData, name: string): string | null | false => {
  const value = field(formData, name, CLIENT_SHARE.urlMax * 2);
  if (!value) return null;
  return normalizeUrl(value) ?? false;
};

/** Server Action: saves name, contact line, links and accent colour of the letterhead. */
export async function saveBrandAction(_: BrandActionState, formData: FormData): Promise<BrandActionState> {
  const user = await getProUser();
  if (!user?.isPro) return { ok: false, error: "plan" };

  const displayName = field(formData, "displayName", CLIENT_SHARE.displayNameMax);
  if (!displayName) return { ok: false, error: "nameRequired" };
  const accent = field(formData, "accentColor", 7).toLowerCase();
  const accentCheck = accent ? checkAccent(accent) : "ok";
  if (accentCheck === "invalid") return { ok: false, error: "colorInvalid" };
  if (accentCheck === "tooLight") return { ok: false, error: "colorTooLight" };
  const website = linkField(formData, "website");
  const imprintUrl = linkField(formData, "imprintUrl");
  if (website === false || imprintUrl === false) return { ok: false, error: "urlInvalid" };

  try {
    await BrokerBrandService.save(user.id, {
      displayName,
      contactLine: field(formData, "contactLine", CLIENT_SHARE.contactMax) || null,
      website,
      imprintUrl,
      accentColor: accent || null,
    });
  } catch (error) {
    console.error("[saveBrandAction]", error);
    return { ok: false, error: "failed" };
  }
  revalidatePath(CLIENT_SHARE_ROUTES.manage);
  return { ok: true, saved: true };
}

/** Server Action: stores the uploaded logo after checking its real type and size. */
export async function uploadLogoAction(_: BrandActionState, formData: FormData): Promise<BrandActionState> {
  const user = await getProUser();
  if (!user?.isPro) return { ok: false, error: "plan" };
  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "logoType" };
  if (file.size > CLIENT_SHARE.logoMaxBytes) return { ok: false, error: "logoSize" };

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const mime = sniffLogo(bytes);
    if (!mime) return { ok: false, error: "logoType" };
    if (!(await BrokerBrandService.setLogo(user.id, mime, bytes))) return { ok: false, error: "nameRequired" };
  } catch (error) {
    console.error("[uploadLogoAction]", error);
    return { ok: false, error: "failed" };
  }
  revalidatePath(CLIENT_SHARE_ROUTES.manage);
  return { ok: true, saved: true };
}

/** Server Action: removes the logo; the name stays. */
export async function removeLogoAction(): Promise<BrandActionState> {
  const user = await getProUser();
  if (!user) return { ok: false, error: "failed" };
  try {
    await BrokerBrandService.removeLogo(user.id);
  } catch (error) {
    console.error("[removeLogoAction]", error);
    return { ok: false, error: "failed" };
  }
  revalidatePath(CLIENT_SHARE_ROUTES.manage);
  return { ok: true };
}
