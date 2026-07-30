"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import {
  SignaturePad,
  type SignaturePadHandle,
} from "@/components/signature-pad";
import { WAIVER_PREVIEW_PUBLIC_PATH } from "@/lib/waiver-paths";

const PREVIEW_WIDTH = 1530;
const PREVIEW_HEIGHT = 1980;

/** Percent positions on the waiver image (top-left origin). */
const FIELDS = {
  parentName: { left: 14.5, top: 33.2, width: 43, height: 2.4 },
  date: { left: 17.5, top: 43.2, width: 28, height: 2.4 },
  participant: { left: 45, top: 46.8, width: 42, height: 2.4 },
  udotSignature: { left: 12, top: 51.3, width: 50, height: 4.8 },
  citySignature: { left: 12, top: 80.8, width: 50, height: 4.8 },
} as const;

function todayInputValue() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function formatDateForImage(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  return `${Number(match[2])}/${Number(match[3])}/${match[1]}`;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load waiver image."));
    image.src = src;
  });
}

function fieldStyle(field: {
  left: number;
  top: number;
  width: number;
  height: number;
}): React.CSSProperties {
  return {
    left: `${field.left}%`,
    top: `${field.top}%`,
    width: `${field.width}%`,
    height: `${field.height}%`,
  };
}

export function WaiverSigner() {
  const [parentName, setParentName] = useState("");
  const [date, setDate] = useState(todayInputValue);
  const [participantName, setParticipantName] = useState("");
  const [udotSigned, setUdotSigned] = useState(false);
  const [citySigned, setCitySigned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [signedPdf, setSignedPdf] = useState<{
    base64: string;
    fileName: string;
  } | null>(null);
  const [padKey, setPadKey] = useState(0);

  const udotRef = useRef<SignaturePadHandle>(null);
  const cityRef = useRef<SignaturePadHandle>(null);

  const canSubmit =
    parentName.trim().length > 1 &&
    date.trim().length > 0 &&
    participantName.trim().length > 1 &&
    udotSigned &&
    citySigned &&
    !submitting;

  async function buildSignedImage() {
    const background = await loadImage(WAIVER_PREVIEW_PUBLIC_PATH);
    const canvas = document.createElement("canvas");
    canvas.width = PREVIEW_WIDTH;
    canvas.height = PREVIEW_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not create signed image.");

    ctx.drawImage(background, 0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT);
    ctx.fillStyle = "#090A0A";
    ctx.textBaseline = "middle";
    ctx.font = `600 ${Math.round(PREVIEW_HEIGHT * 0.015)}px Helvetica, Arial, sans-serif`;

    const drawText = (
      text: string,
      field: { left: number; top: number; width: number; height: number },
    ) => {
      const x = (field.left / 100) * PREVIEW_WIDTH + 4;
      const y = ((field.top + field.height / 2) / 100) * PREVIEW_HEIGHT;
      ctx.fillText(text, x, y, (field.width / 100) * PREVIEW_WIDTH - 8);
    };

    drawText(parentName.trim(), FIELDS.parentName);
    drawText(formatDateForImage(date), FIELDS.date);
    drawText(participantName.trim(), FIELDS.participant);

    const drawSignature = (
      pad: SignaturePadHandle | null,
      field: { left: number; top: number; width: number; height: number },
    ) => {
      const dataUrl = pad?.toDataURL() ?? "";
      if (!dataUrl) return;
      return new Promise<void>((resolve, reject) => {
        const image = new window.Image();
        image.onload = () => {
          const x = (field.left / 100) * PREVIEW_WIDTH;
          const y = (field.top / 100) * PREVIEW_HEIGHT;
          const w = (field.width / 100) * PREVIEW_WIDTH;
          const h = (field.height / 100) * PREVIEW_HEIGHT;
          ctx.drawImage(image, x, y, w, h);
          resolve();
        };
        image.onerror = () => reject(new Error("Could not read signature."));
        image.src = dataUrl;
      });
    };

    await drawSignature(udotRef.current, FIELDS.udotSignature);
    await drawSignature(cityRef.current, FIELDS.citySignature);

    return canvas.toDataURL("image/png");
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      const signedImagePng = await buildSignedImage();
      const response = await fetch("/api/waivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName: parentName.trim(),
          date,
          participantName: participantName.trim(),
          signedImagePng,
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        pdfBase64?: string;
        fileName?: string;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Could not submit the waiver.");
      }

      if (payload?.pdfBase64) {
        setSignedPdf({
          base64: payload.pdfBase64,
          fileName: payload.fileName ?? "signed-parade-waiver.pdf",
        });
      } else {
        setSignedPdf(null);
      }

      setParentName("");
      setDate(todayInputValue());
      setParticipantName("");
      setUdotSigned(false);
      setCitySigned(false);
      setPadKey((key) => key + 1);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit the waiver.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded border border-[#075C35]/30 bg-white px-5 py-8 text-center sm:px-8">
        <h2 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight text-[#090A0A]">
          Waiver submitted
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[#313a36]">
          Thanks — your filled waiver was saved exactly as shown on the form.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {signedPdf ? (
            <a
              href={`data:application/pdf;base64,${signedPdf.base64}`}
              download={signedPdf.fileName}
              className="focus-ring rounded bg-[#075C35] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#043D25]"
            >
              Download signed PDF
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setSignedPdf(null);
              setDone(false);
            }}
            className="focus-ring rounded border border-[#C8CDD0] px-5 py-2.5 text-sm font-semibold text-[#090A0A] hover:bg-[#F3F4F4]"
          >
            Sign another waiver
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="border-b border-[#C8CDD0] bg-white px-4 py-3 sm:rounded-t sm:border sm:border-b-0 sm:border-[#C8CDD0] sm:px-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-tight text-[#090A0A]">
          Santaquin Orchard Days Parade Waiver
        </h2>
        <p className="mt-1 text-sm text-[#313a36]">
          Type on the lines and sign in the signature boxes right on the form.
        </p>
      </div>

      <div className="overflow-auto bg-[#E8EAEB] sm:border sm:border-[#C8CDD0]">
        <div className="relative mx-auto w-full max-w-4xl bg-white">
          <Image
            src={WAIVER_PREVIEW_PUBLIC_PATH}
            alt="Santaquin Orchard Days Parade Waiver"
            width={PREVIEW_WIDTH}
            height={PREVIEW_HEIGHT}
            className="pointer-events-none h-auto w-full select-none"
            priority
            sizes="100vw"
          />

          <label className="absolute" style={fieldStyle(FIELDS.parentName)}>
            <span className="sr-only">Name of Participant or Parent/Guardian</span>
            <input
              required
              value={parentName}
              onChange={(event) => setParentName(event.target.value)}
              className="h-full w-full border-0 bg-transparent px-1 text-[clamp(10px,2.2vw,14px)] text-[#090A0A] outline-none"
              autoComplete="name"
            />
          </label>

          <label className="absolute" style={fieldStyle(FIELDS.date)}>
            <span className="sr-only">Date</span>
            <input
              required
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="h-full w-full border-0 bg-transparent px-1 text-[clamp(10px,2.2vw,14px)] text-[#090A0A] outline-none"
            />
          </label>

          <label className="absolute" style={fieldStyle(FIELDS.participant)}>
            <span className="sr-only">Name of minor participant in Parade</span>
            <input
              required
              value={participantName}
              onChange={(event) => setParticipantName(event.target.value)}
              className="h-full w-full border-0 bg-transparent px-1 text-[clamp(10px,2.2vw,14px)] text-[#090A0A] outline-none"
            />
          </label>

          <div
            className="absolute rounded-sm border border-[#075C35]/35 bg-white/40"
            style={fieldStyle(FIELDS.udotSignature)}
          >
            <SignaturePad
              key={`udot-${padKey}`}
              ref={udotRef}
              variant="overlay"
              label="UDOT signature"
              onChange={setUdotSigned}
            />
          </div>

          <div
            className="absolute rounded-sm border border-[#075C35]/35 bg-white/40"
            style={fieldStyle(FIELDS.citySignature)}
          >
            <SignaturePad
              key={`city-${padKey}`}
              ref={cityRef}
              variant="overlay"
              label="Santaquin City signature"
              onChange={setCitySigned}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 px-4 sm:px-0">
        <button
          type="button"
          onClick={() => {
            udotRef.current?.clear();
            cityRef.current?.clear();
          }}
          className="focus-ring rounded text-sm font-medium text-[#075C35] underline-offset-2 hover:underline"
        >
          Clear signatures
        </button>
      </div>

      {error ? (
        <p
          className="mx-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 sm:mx-0"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="px-4 sm:px-0">
        <button
          type="submit"
          disabled={!canSubmit}
          className="focus-ring w-full rounded bg-[#075C35] px-5 py-3 text-sm font-semibold text-white transition enabled:hover:bg-[#043D25] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {submitting ? "Submitting…" : "Submit signed waiver"}
        </button>
      </div>
    </form>
  );
}
