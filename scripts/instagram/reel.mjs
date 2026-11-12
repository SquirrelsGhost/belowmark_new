// ---------------------------------------------------------------------------
// 9:16 Video-Reel-Generator (1080×1920, 30fps, H.264 + Stereo-AAC MP4)
// für organische Non-Follower-Reichweite im Instagram Reels-Tab.
//
// Rendert 4 hochkontrastreiche 9:16 Keyframe-Szenen via Satori (next/og)
// und encodiert daraus mit ffmpeg ein flüssiges 12-Sekunden-Reel inkl.
// dynamischem Ken-Burns-Zoom und dezentem Deep-Pulse-Audio-Track (damit
// Instagrams Audio-Classifier das Video nicht als stummes Standbild abstuft).
// ---------------------------------------------------------------------------

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import os from "node:os";
import { join, resolve } from "node:path";
import { C, F, Frame, SIZES, el, mono, upper, MarketLine } from "./brand.mjs";
import { AerialHeroBox } from "./mapTile.mjs";
import { money, number, dateLong, dateShort, time, T } from "./texts.mjs";
import { placeLine, cleanObjectTitle, extractDealInsights, nextRound } from "./data.mjs";

function findWingetFfmpeg() {
  const base = join(process.env.LOCALAPPDATA || join(os.homedir(), "AppData", "Local"), "Microsoft", "WinGet", "Packages");
  if (!existsSync(base)) return [];
  const found = [];
  try {
    for (const pkg of readdirSync(base)) {
      if (!/ffmpeg/i.test(pkg)) continue;
      const pkgDir = join(base, pkg);
      for (const sub of readdirSync(pkgDir)) {
        const exe = join(pkgDir, sub, "bin", "ffmpeg.exe");
        if (existsSync(exe)) found.push(exe);
      }
    }
  } catch {}
  return found;
}

export function resolveFfmpeg() {
  const candidates = [
    process.env.FFMPEG_PATH,
    join(process.env.LOCALAPPDATA || join(os.homedir(), "AppData", "Local"), "Microsoft", "WinGet", "Links", "ffmpeg.exe"),
    ...findWingetFfmpeg(),
    "ffmpeg",
  ].filter(Boolean);

  for (const bin of candidates) {
    if (bin === "ffmpeg") {
      try {
        execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
        return "ffmpeg";
      } catch {
        continue;
      }
    }
    if (existsSync(bin)) return bin;
  }
  return null;
}

export function buildReelSceneNodes({ listing, lang, day, aerial, date }) {
  const t = T[lang];
  const isTr = lang === "tr";
  const size = SIZES.story; // 1080 × 1920 mit Safe-Zones oben (220px) & unten (260px)
  const ins = extractDealInsights(listing);
  const v = listing.appraisedValue;
  const title = cleanObjectTitle(listing, t.segment[listing.segment]);
  const place = placeLine(listing);
  const city = listing.place.split(",")[0].trim();
  const discountPct = isTr
    ? Math.max(1, Math.round(100 - ((listing.tr?.startingBid || v * 0.5) / v) * 100))
    : 50;

  const wrap = (rubric, children) =>
    Frame({
      size,
      lang,
      date,
      rubric,
      source: t.source(date),
      disclaimer: t.disclaimer,
      cta: null,
      children,
    });

  // SZENE 1 (0–3s): SCROLL-STOP HOOK + SATELLITEN-LUFTBILD
  const scene1 = wrap(isTr ? "İCRA FIRSATI?" : "IMMOBILIE −50 %?", [
    el(
      {
        background: C.signal,
        color: C.paperBright,
        padding: "12px 22px",
        alignSelf: "flex-start",
        fontFamily: F.mono,
        fontSize: 24,
        fontWeight: 600,
        marginBottom: 18,
      },
      isTr ? `⚡ ${upper(city, lang)} · RESMİ İCRA İHALESİ` : `⚡ ${upper(city, lang)} · AMTLICHE VERSTEIGERUNG`
    ),
    AerialHeroBox({
      aerial,
      width: size.width - size.padX * 2,
      height: 520,
      badgeLeft: upper(listing.authority || "AMTSGERICHT", lang).slice(0, 32),
      badgeRight: isTr ? `−%${discountPct}` : "−50 %",
      sectorLabel: upper(place, lang),
    }),
    el(
      { fontFamily: F.display, fontSize: title.length > 18 ? 78 : 94, lineHeight: 0.94, marginTop: 28 },
      upper(title, lang)
    ),
    el(
      { fontFamily: F.serif, fontStyle: "italic", fontSize: 42, color: C.inkSoft, marginTop: 12 },
      isTr
        ? `Muhammen bedel ${money(v, lang)} — peki açılış fiyatı ne kadar?`
        : `Gutachten sagt ${money(v, lang)} — aber wo startet der 1. Termin?`
    ),
  ]);

  // SZENE 2 (3–6s): DER PREIS-DROP REVEAL
  const scene2 = wrap(isTr ? "BAŞLANGIÇ FİYATI" : "5/10-WERTGRENZE", [
    mono(isTr ? "BİLİRKİŞİ DEĞERİ (100 %)" : " GUTACHTENWERT LAUT AMTSGERICHT (100 %)", { fontSize: 24 }),
    el(
      { fontFamily: F.display, fontSize: 82, color: C.muted, textDecoration: "line-through", marginTop: 6, marginBottom: 24 },
      money(v, lang)
    ),
    MarketLine({ size, label: null }),
    el(
      { fontFamily: F.serif, fontStyle: "italic", fontSize: 40, color: C.inkSoft, marginTop: 26 },
      isTr ? "Açık artırma başlangıç bedeli:" : "Zuschlag im 1. Termin möglich ab:"
    ),
    el(
      { fontFamily: F.display, fontSize: 132, lineHeight: 0.95, color: C.signal, marginTop: 10 },
      money(ins.startBid, lang)
    ),
    ins.startPerM2
      ? el(
          {
            marginTop: 20,
            background: C.ink,
            color: C.paperBright,
            padding: "16px 26px",
            justifyContent: "space-between",
            alignItems: "center",
          },
          el({ fontFamily: F.mono, fontSize: 25 }, isTr ? "m² Başlangıç Değeri" : "Rechnerischer Startpreis / m²"),
          el({ fontFamily: F.display, fontSize: 48, color: "#ff7d73" }, `${money(ins.startPerM2, lang)}/m²`)
        )
      : null,
    el(
      { flexWrap: "wrap", gap: 14, marginTop: 26 },
      ...[
        ins.area ? `${number(ins.area, lang)} m² Wfl.` : null,
        !isTr && listing.segment !== "apartment" && listing.landAreaM2 && listing.landAreaM2 !== ins.area
          ? `${number(listing.landAreaM2, lang)} m² Grund`
          : null,
        (isTr ? listing.tr?.rooms : listing.rooms) && !/zimmer/i.test(title) ? (isTr ? listing.tr?.rooms : listing.rooms) : null,
        !isTr && listing.yearBuilt ? `Baujahr ${listing.yearBuilt}` : null,
      ]
        .filter(Boolean)
        .map((chip) =>
          el(
            { border: `3px solid ${C.ink}`, background: C.paperBright, padding: "10px 20px", fontFamily: F.mono, fontSize: 25, fontWeight: 600 },
            chip
          )
        )
    ),
  ]);

  // SZENE 3 (6–9.2s): CASH-BEDARF & HAKEN
  const trRound = isTr ? nextRound(listing, day) : null;
  const scene3 = wrap(isTr ? "MALİYET & KONTROL" : "CASH & HAKEN", [
    el({ fontFamily: F.display, fontSize: 82, lineHeight: 0.95, marginBottom: 22 }, upper(isTr ? "MASRAFLAR & DETAYLAR" : "DIE ECHTE RECHNUNG", lang)),
    MarketLine({ size, label: null }),
    el(
      {
        flexDirection: "column",
        gap: 18,
        marginTop: 28,
        padding: "24px 28px",
        background: C.paperBright,
        border: `3px solid ${C.ink}`,
        boxShadow: `10px 10px 0 ${C.ink}`,
      },
      el(
        { justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.rule}`, paddingBottom: 14 },
        el({ fontSize: 28, fontWeight: 600 }, isTr ? "10 % Teminat (Nakit/Teminat)" : "10 % Sicherheit im Termin"),
        el({ fontFamily: F.mono, fontSize: 34, fontWeight: 600, color: C.signal }, money(ins.deposit10, lang))
      ),
      el(
        { justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.rule}`, paddingBottom: 14 },
        el({ fontSize: 28 }, isTr ? `KDV (%${ins.taxPct}) + Tapu` : `GrESt (${ins.taxPct} %) + Gericht`),
        el({ fontFamily: F.mono, fontSize: 30 }, `+ ${money(ins.taxOnStart + ins.courtFeesEst, lang)}`)
      ),
      el(
        { justifyContent: "space-between", alignItems: "center", paddingTop: 4 },
        el({ fontSize: 28, fontWeight: 600 }, isTr ? "Toplam (Başlangıçta)" : "Gesamt bei 5/10-Zuschlag"),
        el({ fontFamily: F.display, fontSize: 48, color: C.ink }, money(ins.totalAtStart, lang))
      )
    ),
    el(
      {
        marginTop: 24,
        padding: "20px 24px",
        background: ins.noInsideInspection ? "#fce8e6" : C.paperDeep,
        borderLeft: `8px solid ${C.signal}`,
        flexDirection: "column",
        gap: 6,
      },
      el(
        { fontSize: 27, fontWeight: 600, color: C.ink },
        isTr
          ? `📅 İhale: ${trRound ? dateShort(trRound.start, lang) : "Yakında"}`
          : `📅 Termin: ${dateLong(listing.hearingAt, lang)} · ${time(listing.hearingAt, lang)}`
      ),
      el(
        { fontSize: 24, color: C.inkSoft },
        !isTr && ins.noInsideInspection
          ? "⚠️ Laut Aushang keine Innenbesichtigung — Sanierungspuffer einrechnen!"
          : `${listing.authority} · Immer vorab Grundbuch Abt. II & Gutachten prüfen.`
      )
    ),
  ]);

  // SZENE 4 (9.2–12s): CTA & KOMMENTAR-TRIGGER
  const scene4 = wrap("BELOWMARK.COM", [
    el({ fontFamily: F.display, fontSize: 96, lineHeight: 0.94 }, upper(isTr ? "FIRSAT MI, RİSK Mİ?" : "DEAL ODER FINGER WEG?", lang)),
    el(
      { fontFamily: F.serif, fontStyle: "italic", fontSize: 42, color: C.inkSoft, marginTop: 18, marginBottom: 32 },
      isTr
        ? `${city} ihalesine girer miydin? Yorumlara yaz 👇`
        : `Würdest du in ${city} ab ${money(ins.startBid, lang)} mitbieten? Schreib’s in die Kommentare 👇`
    ),
    el(
      {
        flexDirection: "column",
        gap: 18,
        padding: "32px 32px",
        background: C.ink,
        color: C.paperBright,
        boxShadow: `12px 12px 0 ${C.signal}`,
      },
      mono(isTr ? "81 İL · GÜNLÜK TARAMA" : "3.400+ AKTUELLE VERFAHREN", { fontSize: 22, color: "#ff8c82" }),
      el(
        { fontFamily: F.display, fontSize: 58, lineHeight: 1.02 },
        isTr ? "TÜM İCRA İHALELERİNİ ÜCRETSİZ ARA" : "ALLE ZWANGSVERSTEIGERUNGEN IN DEINER STADT"
      ),
      el(
        {
          marginTop: 10,
          background: C.signal,
          color: C.paperBright,
          padding: "20px 26px",
          justifyContent: "space-between",
          alignItems: "center",
        },
        el({ fontFamily: F.display, fontSize: 44, letterSpacing: 1.5 }, "BELOWMARK.COM"),
        el({ fontFamily: F.mono, fontSize: 24, fontWeight: 600 }, isTr ? "LİNK PROFİLDE ↑" : "LINK IN BIO ↑")
      )
    ),
  ]);

  return [scene1, scene2, scene3, scene4];
}

/**
 * Rendert die 4 Szenen-PNGs mit leichtem Zoompan + Crossfade und einem warmen,
 * seriösen Ambient-Pulse-Soundtrack (110 BPM Sub-Chime) zu einer echten MP4-Datei.
 */
export async function renderReelMp4({ scenes, renderPng, outDir, mp4File }) {
  const ffmpeg = resolveFfmpeg();
  if (!ffmpeg) {
    console.warn("[Reel] ffmpeg nicht gefunden — überspringe MP4-Erzeugung.");
    return false;
  }

  const tmpDir = resolve(outDir, ".reel-tmp");
  mkdirSync(tmpDir, { recursive: true });

  try {
    const sceneFiles = [];
    for (let i = 0; i < scenes.length; i++) {
      const f = resolve(tmpDir, `scene-${i + 1}.png`);
      await renderPng(scenes[i], SIZES.story, f);
      sceneFiles.push(f);
    }

    // 4 Szenen à ~3.1s mit sanftem Ken-Burns-Zoom (30fps, 1080x1920) + 0.25s Fade-Übergängen => ~11.6s Reel
    // Audio: Dezenter warmer D-Moll-Ambient-Akkord (146.83 Hz + 220 Hz + 293.66 Hz) mit sanftem Puls (-24 dB),
    // damit das Reel einen gültigen Stereo-AAC-Stream hat und seriös wie ein Finanz-/News-Briefing klingt.
    const filterComplex = [
      "[0:v]scale=1166:2074,zoompan=z='min(zoom+0.0007,1.065)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=96:s=1080x1920:fps=30,format=yuv420p[v0]",
      "[1:v]scale=1166:2074,zoompan=z='min(zoom+0.0007,1.065)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=96:s=1080x1920:fps=30,format=yuv420p[v1]",
      "[2:v]scale=1166:2074,zoompan=z='min(zoom+0.0007,1.065)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=96:s=1080x1920:fps=30,format=yuv420p[v2]",
      "[3:v]scale=1166:2074,zoompan=z='min(zoom+0.0007,1.065)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=96:s=1080x1920:fps=30,format=yuv420p[v3]",
      "[v0][v1]xfade=transition=fadeblack:duration=0.25:offset=2.95[vx1]",
      "[vx1][v2]xfade=transition=fadeblack:duration=0.25:offset=5.90[vx2]",
      "[vx2][v3]xfade=transition=fadeblack:duration=0.25:offset=8.85[vout]",
      "aevalsrc='0.035*sin(2*PI*146.83*t)*(0.65+0.35*sin(2*PI*1.5*t))+0.025*sin(2*PI*220*t)+0.018*sin(2*PI*293.66*t)*exp(-mod(t,0.75)*4)|0.035*sin(2*PI*146.83*t)*(0.65+0.35*sin(2*PI*1.5*t))+0.025*sin(2*PI*220.5*t)+0.018*sin(2*PI*293.66*t)*exp(-mod(t,0.75)*4)':s=44100:d=12.05,afade=t=in:st=0:d=0.4,afade=t=out:st=11.3:d=0.7[aout]",
    ].join(";");

    execFileSync(
      ffmpeg,
      [
        "-y",
        "-loop", "1", "-t", "3.2", "-i", sceneFiles[0],
        "-loop", "1", "-t", "3.2", "-i", sceneFiles[1],
        "-loop", "1", "-t", "3.2", "-i", sceneFiles[2],
        "-loop", "1", "-t", "3.2", "-i", sceneFiles[3],
        "-filter_complex", filterComplex,
        "-map", "[vout]",
        "-map", "[aout]",
        "-t", "12.0",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "20",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-c:a", "aac",
        "-b:a", "128k",
        mp4File,
      ],
      { stdio: "pipe" }
    );
    return existsSync(mp4File);
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
}
