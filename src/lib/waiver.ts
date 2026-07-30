import { createHash, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { WAIVER_BLOB_PREFIX } from "@/lib/waiver-paths";

export {
  WAIVER_BLOB_PREFIX,
  WAIVER_PDF_PUBLIC_PATH,
  WAIVER_PREVIEW_PUBLIC_PATH,
} from "@/lib/waiver-paths";

const PAGE_HEIGHT = 792;

/** Coordinates tuned to Parade Waiver 2026 (letter, origin bottom-left). */
const LAYOUT = {
  parentName: { x: 90, y: PAGE_HEIGHT - 270, size: 11 },
  date: { x: 108, y: PAGE_HEIGHT - 352, size: 11 },
  participant: { x: 278, y: PAGE_HEIGHT - 380, size: 11 },
  udotSignature: { x: 72, y: PAGE_HEIGHT - 418, width: 240, height: 36 },
  citySignature: { x: 72, y: PAGE_HEIGHT - 655, width: 240, height: 36 },
} as const;

export type WaiverSubmission = {
  parentName: string;
  date: string;
  participantName: string;
  udotSignaturePng: string;
  citySignaturePng: string;
};

export type WaiverListItem = {
  pathname: string;
  url: string;
  uploadedAt: string;
  parentName: string;
  participantName: string;
  date: string;
};

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function buildWaiverPathname(input: {
  date: string;
  participantName: string;
  parentName: string;
  id: string;
}) {
  const participant = slugify(input.participantName) || "participant";
  const parent = slugify(input.parentName) || "parent";
  const date = input.date.replace(/[^\d-]/g, "") || "undated";
  return `${WAIVER_BLOB_PREFIX}${date}__${participant}__${parent}__${input.id}.pdf`;
}

export function parseWaiverPathname(pathname: string): {
  date: string;
  participantName: string;
  parentName: string;
} {
  const base = pathname.split("/").pop() ?? pathname;
  const withoutExt = base.replace(/\.pdf$/i, "");
  const parts = withoutExt.split("__");
  if (parts.length >= 4) {
    return {
      date: parts[0] ?? "",
      participantName: (parts[1] ?? "").replace(/-/g, " "),
      parentName: (parts[2] ?? "").replace(/-/g, " "),
    };
  }
  return { date: "", participantName: withoutExt, parentName: "" };
}

function dataUrlToBytes(dataUrl: string) {
  const match = /^data:image\/png;base64,(.+)$/i.exec(dataUrl.trim());
  if (!match?.[1]) {
    throw new Error("Signature must be a PNG data URL.");
  }
  return Buffer.from(match[1], "base64");
}

export function isLikelySigned(dataUrl: string) {
  try {
    const bytes = dataUrlToBytes(dataUrl);
    // Empty canvas PNGs are tiny; a real stroke is larger.
    return bytes.length > 800;
  } catch {
    return false;
  }
}

export async function stampWaiverPdf(submission: WaiverSubmission) {
  const templatePath = path.join(
    process.cwd(),
    "public",
    "waivers",
    "parade-waiver-2026.pdf",
  );
  const templateBytes = await readFile(templatePath);
  const pdf = await PDFDocument.load(templateBytes);
  const page = pdf.getPages()[0];
  if (!page) {
    throw new Error("Waiver PDF has no pages.");
  }

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const textColor = rgb(0.05, 0.05, 0.05);

  page.drawText(submission.parentName.trim(), {
    x: LAYOUT.parentName.x,
    y: LAYOUT.parentName.y,
    size: LAYOUT.parentName.size,
    font,
    color: textColor,
  });

  page.drawText(submission.date.trim(), {
    x: LAYOUT.date.x,
    y: LAYOUT.date.y,
    size: LAYOUT.date.size,
    font,
    color: textColor,
  });

  page.drawText(submission.participantName.trim(), {
    x: LAYOUT.participant.x,
    y: LAYOUT.participant.y,
    size: LAYOUT.participant.size,
    font,
    color: textColor,
  });

  const udotPng = await pdf.embedPng(dataUrlToBytes(submission.udotSignaturePng));
  page.drawImage(udotPng, {
    x: LAYOUT.udotSignature.x,
    y: LAYOUT.udotSignature.y,
    width: LAYOUT.udotSignature.width,
    height: LAYOUT.udotSignature.height,
  });

  const cityPng = await pdf.embedPng(dataUrlToBytes(submission.citySignaturePng));
  page.drawImage(cityPng, {
    x: LAYOUT.citySignature.x,
    y: LAYOUT.citySignature.y,
    width: LAYOUT.citySignature.width,
    height: LAYOUT.citySignature.height,
  });

  return pdf.save();
}

export function verifyAdminToken(token: string | null | undefined) {
  const expected = process.env.WAIVER_ADMIN_TOKEN;
  if (!expected || !token) return false;

  const left = createHash("sha256").update(token).digest();
  const right = createHash("sha256").update(expected).digest();
  return timingSafeEqual(left, right);
}

/** Vercel Blob auth: OIDC (BLOB_STORE_ID) on Vercel, or BLOB_READ_WRITE_TOKEN fallback. */
export function assertBlobConfigured() {
  if (process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN) {
    return;
  }
  throw new Error(
    "Blob storage is not configured. Connect a Vercel Blob store to this project, then redeploy.",
  );
}
