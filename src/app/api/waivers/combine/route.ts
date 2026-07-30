import { NextResponse } from "next/server";

import {
  combineWaiverPdfs,
  sanitizeWaiverPathnames,
} from "@/lib/waiver-export";
import { assertBlobConfigured, verifyAdminToken } from "@/lib/waiver";

export const runtime = "nodejs";

type Body = {
  token?: string;
  pathnames?: unknown;
};

export async function POST(request: Request) {
  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    body = {};
  }

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
    const pdfBytes = await combineWaiverPdfs(pathnames);
    const stamp = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Denver",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="parade-waivers-${stamp}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not combine waivers.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
