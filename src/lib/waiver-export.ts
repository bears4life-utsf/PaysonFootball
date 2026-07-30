import { get } from "@vercel/blob";
import { PDFDocument } from "pdf-lib";

import { WAIVER_BLOB_PREFIX } from "@/lib/waiver-paths";

export async function streamToBuffer(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
}

export function sanitizeWaiverPathnames(pathnames: unknown) {
  if (!Array.isArray(pathnames)) return [];
  const unique = new Set<string>();
  for (const value of pathnames) {
    if (typeof value !== "string") continue;
    if (!value.startsWith(WAIVER_BLOB_PREFIX)) continue;
    if (!value.toLowerCase().endsWith(".pdf")) continue;
    if (value.includes("..")) continue;
    unique.add(value);
  }
  return [...unique];
}

export async function loadWaiverPdfBytes(pathname: string) {
  const file = await get(pathname, { access: "private" });
  if (!file || file.statusCode !== 200 || !file.stream) {
    throw new Error(`Could not load ${pathname}`);
  }
  return streamToBuffer(file.stream);
}

export async function combineWaiverPdfs(pathnames: string[]) {
  const combined = await PDFDocument.create();

  for (const pathname of pathnames) {
    const bytes = await loadWaiverPdfBytes(pathname);
    const source = await PDFDocument.load(bytes);
    const pages = await combined.copyPages(source, source.getPageIndices());
    for (const page of pages) {
      combined.addPage(page);
    }
  }

  return combined.save();
}
