import { createHash, timingSafeEqual } from "node:crypto";

import { PDFDocument } from "pdf-lib";

import { WAIVER_BLOB_PREFIX } from "@/lib/waiver-paths";

export {
  WAIVER_BLOB_PREFIX,
  WAIVER_PDF_PUBLIC_PATH,
  WAIVER_PREVIEW_PUBLIC_PATH,
} from "@/lib/waiver-paths";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;

export type WaiverSubmission = {
  parentName: string;
  date: string;
  participantName: string;
  signedImagePng: string;
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
    throw new Error("Signed waiver must be a PNG data URL.");
  }
  return Buffer.from(match[1], "base64");
}

export function isLikelySignedImage(dataUrl: string) {
  try {
    const bytes = dataUrlToBytes(dataUrl);
    // Full-page flattened waiver images are large.
    return bytes.length > 20_000;
  } catch {
    return false;
  }
}

/** Wrap the client-flattened waiver image in a one-page PDF. */
export async function signedImageToPdf(signedImagePng: string) {
  const imageBytes = dataUrlToBytes(signedImagePng);
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const image = await pdf.embedPng(imageBytes);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
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
