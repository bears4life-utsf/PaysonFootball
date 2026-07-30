import { del } from "@vercel/blob";
import { NextResponse } from "next/server";

import { sanitizeWaiverPathnames } from "@/lib/waiver-export";
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
    await del(pathnames);
    return NextResponse.json({ ok: true, deleted: pathnames.length });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not delete waivers.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
