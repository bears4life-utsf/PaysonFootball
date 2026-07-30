import JSZip from "jszip";
import { NextResponse } from "next/server";

import {
  loadWaiverPdfBytes,
  sanitizeWaiverPathnames,
} from "@/lib/waiver-export";
import { assertBlobConfigured, verifyAdminToken } from "@/lib/waiver";

export const runtime = "nodejs";

type Body = {
  token?: string;
  pathnames?: unknown;
};

async function parseBody(request: Request): Promise<Body> {
  try {
    return (await request.json()) as Body;
  } catch {
    return {};
  }
}

function utahStamp() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Denver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function POST(request: Request) {
  const body = await parseBody(request);
  if (!verifyAdminToken(body.token)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const pathnames = sanitizeWaiverPathnames(body.pathnames);
  if (pathnames.length === 0) {
    return NextResponse.json(
      { error: "Select at least one waiver." },
      { status: 400 },
    );
  }

  try {
    assertBlobConfigured();
    const zip = new JSZip();

    for (const pathname of pathnames) {
      const bytes = await loadWaiverPdfBytes(pathname);
      const filename = pathname.split("/").pop() ?? pathname;
      zip.file(filename, bytes);
    }

    const archive = await zip.generateAsync({ type: "uint8array" });
    const stamp = utahStamp();

    return new NextResponse(Buffer.from(archive), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="parade-waivers-${stamp}.zip"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not export waivers.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
