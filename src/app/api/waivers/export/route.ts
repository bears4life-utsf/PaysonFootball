import { get, list } from "@vercel/blob";
import JSZip from "jszip";
import { NextRequest, NextResponse } from "next/server";

import {
  WAIVER_BLOB_PREFIX,
  assertBlobConfigured,
  verifyAdminToken,
} from "@/lib/waiver";

export const runtime = "nodejs";

async function streamToBuffer(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!verifyAdminToken(token)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    assertBlobConfigured();
    const zip = new JSZip();
    let cursor: string | undefined;

    do {
      const result = await list({
        prefix: WAIVER_BLOB_PREFIX,
        cursor,
      });

      for (const blob of result.blobs) {
        if (!blob.pathname.toLowerCase().endsWith(".pdf")) continue;
        const file = await get(blob.pathname, { access: "private" });
        if (!file || file.statusCode !== 200 || !file.stream) continue;
        const bytes = await streamToBuffer(file.stream);
        const filename = blob.pathname.split("/").pop() ?? blob.pathname;
        zip.file(filename, bytes);
      }

      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);

    const archive = await zip.generateAsync({ type: "uint8array" });
    const today = new Date().toISOString().slice(0, 10);

    return new NextResponse(Buffer.from(archive), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="parade-waivers-${today}.zip"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not export waivers.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
