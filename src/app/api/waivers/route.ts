import { randomUUID } from "node:crypto";

import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

import {
  assertBlobConfigured,
  buildWaiverPathname,
  isLikelySignedImage,
  signedImageToPdf,
  type WaiverSubmission,
} from "@/lib/waiver";

export const runtime = "nodejs";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function isSubmission(body: unknown): body is WaiverSubmission {
  if (!body || typeof body !== "object") return false;
  const value = body as Record<string, unknown>;
  return (
    typeof value.parentName === "string" &&
    typeof value.date === "string" &&
    typeof value.participantName === "string" &&
    typeof value.signedImagePng === "string"
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body.");
  }

  if (!isSubmission(body)) {
    return badRequest("Missing required waiver fields.");
  }

  const parentName = body.parentName.trim();
  const participantName = body.participantName.trim();
  const date = body.date.trim();

  if (parentName.length < 2) {
    return badRequest("Parent / guardian name is required.");
  }
  if (participantName.length < 2) {
    return badRequest("Parade participant name is required.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return badRequest("Date must be YYYY-MM-DD.");
  }
  if (!isLikelySignedImage(body.signedImagePng)) {
    return badRequest("Signed waiver image is required.");
  }

  try {
    assertBlobConfigured();

    const pdfBytes = await signedImageToPdf(body.signedImagePng);

    const pathname = buildWaiverPathname({
      date,
      participantName,
      parentName,
      id: randomUUID().slice(0, 8),
    });

    const blob = await put(pathname, Buffer.from(pdfBytes), {
      access: "private",
      contentType: "application/pdf",
      addRandomSuffix: false,
    });

    return NextResponse.json({
      ok: true,
      pathname: blob.pathname,
      url: blob.url,
      pdfBase64: Buffer.from(pdfBytes).toString("base64"),
      fileName: pathname.split("/").pop() ?? "signed-waiver.pdf",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save the waiver.";
    if (message.includes("Blob storage is not configured")) {
      return NextResponse.json({ error: message }, { status: 503 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
