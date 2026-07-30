import { createHash, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

import { WAIVER_BLOB_PREFIX } from "@/lib/waiver-paths";

export {
  WAIVER_BLOB_PREFIX,
  WAIVER_PDF_PUBLIC_PATH,
  WAIVER_PREVIEW_PUBLIC_PATH,
} from "@/lib/waiver-paths";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;

/** Coordinates for letter page, origin bottom-left. */
const LAYOUT = {
  parentName: { x: 90, y: PAGE_HEIGHT - 274, size: 12, boxW: 280, boxH: 16 },
  date: { x: 108, y: PAGE_HEIGHT - 356, size: 12, boxW: 130, boxH: 16 },
  participant: { x: 278, y: PAGE_HEIGHT - 384, size: 12, boxW: 260, boxH: 16 },
  udotSignature: { x: 72, y: PAGE_HEIGHT - 450, width: 280, height: 42 },
  citySignature: { x: 72, y: PAGE_HEIGHT - 688, width: 280, height: 42 },
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

function formatDateForPdf(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return value.trim();
  const [, year, month, day] = match;
  return `${Number(month)}/${Number(day)}/${year}`;
}

function drawField(
  page: PDFPage,
  font: PDFFont,
  text: string,
  layout: { x: number; y: number; size: number; boxW: number; boxH: number },
) {
  page.drawRectangle({
    x: layout.x - 2,
    y: layout.y - 3,
    width: layout.boxW,
    height: layout.boxH,
    color: rgb(1, 1, 1),
  });
  page.drawText(text, {
    x: layout.x,
    y: layout.y,
    size: layout.size,
    font,
    color: rgb(0.05, 0.05, 0.05),
    maxWidth: layout.boxW - 4,
  });
}

export async function stampWaiverPdf(submission: WaiverSubmission) {
  // Compose onto the rendered form image so filled fields always sit on top.
  const previewPath = path.join(
    process.cwd(),
    "public",
    "waivers",
    "parade-waiver-2026.png",
  );
  const previewBytes = await readFile(previewPath);
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const background = await pdf.embedPng(previewBytes);
  page.drawImage(background, {
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  });

  const font = await pdf.embedFont(StandardFonts.HelveticaBold);

  drawField(page, font, submission.parentName.trim(), LAYOUT.parentName);
  drawField(page, font, formatDateForPdf(submission.date), LAYOUT.date);
  drawField(page, font, submission.participantName.trim(), LAYOUT.participant);

  const udotBytes = dataUrlToBytes(submission.udotSignaturePng);
  const cityBytes = dataUrlToBytes(submission.citySignaturePng);
  const udotPng = await pdf.embedPng(udotBytes);
  const cityPng = await pdf.embedPng(cityBytes);

  page.drawRectangle({
    x: LAYOUT.udotSignature.x,
    y: LAYOUT.udotSignature.y,
    width: LAYOUT.udotSignature.width,
    height: LAYOUT.udotSignature.height,
    color: rgb(1, 1, 1),
  });
  page.drawImage(udotPng, {
    x: LAYOUT.udotSignature.x,
    y: LAYOUT.udotSignature.y,
    width: LAYOUT.udotSignature.width,
    height: LAYOUT.udotSignature.height,
  });

  page.drawRectangle({
    x: LAYOUT.citySignature.x,
    y: LAYOUT.citySignature.y,
    width: LAYOUT.citySignature.width,
    height: LAYOUT.citySignature.height,
    color: rgb(1, 1, 1),
  });
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
