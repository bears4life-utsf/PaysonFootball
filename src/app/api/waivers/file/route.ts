import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

import {
  WAIVER_BLOB_PREFIX,
  assertBlobConfigured,
  verifyAdminToken,
} from "@/lib/waiver";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const adminToken = request.nextUrl.searchParams.get("token");
  if (!verifyAdminToken(adminToken)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const pathname = request.nextUrl.searchParams.get("pathname");
  if (!pathname || !pathname.startsWith(WAIVER_BLOB_PREFIX)) {
    return NextResponse.json({ error: "Invalid pathname." }, { status: 400 });
  }

  try {
    assertBlobConfigured();
    const result = await get(pathname, { access: "private" });

    if (!result || result.statusCode !== 200 || !result.stream) {
      return new NextResponse("Not found", { status: 404 });
    }

    const filename = pathname.split("/").pop() ?? "waiver.pdf";
    const viewInline = request.nextUrl.searchParams.get("view") === "1";

    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType || "application/pdf",
        "Content-Disposition": `${viewInline ? "inline" : "attachment"}; filename="${filename}"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not download waiver.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
