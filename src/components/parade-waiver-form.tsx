"use client";

import { useRef, useState } from "react";

import {
  SignaturePad,
  type SignaturePadHandle,
} from "@/components/signature-pad";
import { cropSignatureDataUrl } from "@/lib/crop-signature";
import {
  WAIVER_PDF_PUBLIC_PATH,
  WAIVER_PREVIEW_PUBLIC_PATH,
} from "@/lib/waiver-paths";

function todayInputValue() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function ParadeWaiverForm() {
  const [parentName, setParentName] = useState("");
  const [date, setDate] = useState(todayInputValue);
  const [participantName, setParticipantName] = useState("");
  const [udotSigned, setUdotSigned] = useState(false);
  const [citySigned, setCitySigned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [padKey, setPadKey] = useState(0);
  const [signedPdf, setSignedPdf] = useState<{
    base64: string;
    fileName: string;
  } | null>(null);

  const udotRef = useRef<SignaturePadHandle>(null);
  const cityRef = useRef<SignaturePadHandle>(null);

  const canSubmit =
    parentName.trim().length > 1 &&
    date.trim().length > 0 &&
    participantName.trim().length > 1 &&
    udotSigned &&
    citySigned &&
    !submitting;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      const udotRaw = udotRef.current?.toDataURL() ?? "";
      const cityRaw = cityRef.current?.toDataURL() ?? "";
      if (!udotRaw || !cityRaw) {
        throw new Error("Both signatures are required.");
      }

      const [udotSignaturePng, citySignaturePng] = await Promise.all([
        cropSignatureDataUrl(udotRaw),
        cropSignatureDataUrl(cityRaw),
      ]);

      const response = await fetch("/api/waivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName: parentName.trim(),
          date,
          participantName: participantName.trim(),
          udotSignaturePng,
          citySignaturePng,
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

      setSignedPdf(
        payload?.pdfBase64
          ? {
              base64: payload.pdfBase64,
              fileName: payload.fileName ?? "signed-parade-waiver.pdf",
            }
          : null,
      );
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
          Thanks — your signed waiver PDF has been saved.
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
    <div className="space-y-6">
      <div className="overflow-hidden rounded border border-[#C8CDD0] bg-white">
        <div className="border-b border-[#C8CDD0] px-4 py-3 sm:px-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-tight text-[#090A0A]">
            Read the waiver
          </h2>
          <p className="mt-1 text-sm text-[#313a36]">
            Review the document, then complete the form below.
          </p>
        </div>
        <div className="max-h-[45vh] overflow-auto bg-[#E8EAEB]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={WAIVER_PREVIEW_PUBLIC_PATH}
            alt="Santaquin Orchard Days Parade Waiver"
            className="mx-auto h-auto w-full max-w-3xl bg-white"
          />
        </div>
        <div className="border-t border-[#C8CDD0] px-4 py-3 text-sm sm:px-5">
          <a
            href={WAIVER_PDF_PUBLIC_PATH}
            target="_blank"
            rel="noreferrer"
            className="focus-ring rounded font-medium text-[#075C35] underline underline-offset-2"
          >
            Open blank PDF
          </a>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded border border-[#C8CDD0] bg-white p-5 sm:p-7"
      >
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-tight text-[#090A0A]">
            Sign the waiver
          </h2>
          <p className="mt-2 text-sm text-[#313a36]">
            Enter your information and sign both sections. We create the official
            PDF when you submit.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5 sm:col-span-2">
            <span className="text-sm font-medium text-[#090A0A]">
              Name of Participant or Parent/Guardian
            </span>
            <input
              required
              value={parentName}
              onChange={(event) => setParentName(event.target.value)}
              autoComplete="name"
              className="focus-ring w-full rounded border border-[#C8CDD0] bg-[#F3F4F4] px-3 py-2.5 text-[#090A0A]"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[#090A0A]">Date</span>
            <input
              required
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="focus-ring w-full rounded border border-[#C8CDD0] bg-[#F3F4F4] px-3 py-2.5 text-[#090A0A]"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[#090A0A]">
              Name of minor participant in Parade
            </span>
            <input
              required
              value={participantName}
              onChange={(event) => setParticipantName(event.target.value)}
              className="focus-ring w-full rounded border border-[#C8CDD0] bg-[#F3F4F4] px-3 py-2.5 text-[#090A0A]"
            />
          </label>
        </div>

        <div className="space-y-2 border-t border-[#C8CDD0] pt-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#075C35]">
                UDOT Waiver
              </p>
              <p className="text-sm font-medium text-[#090A0A]">
                Signature of participant or parent/guardian of minor
              </p>
            </div>
            <button
              type="button"
              onClick={() => udotRef.current?.clear()}
              className="focus-ring rounded text-sm font-medium text-[#075C35] underline-offset-2 hover:underline"
            >
              Clear
            </button>
          </div>
          <div className="h-[72px] overflow-hidden rounded border border-[#C8CDD0] bg-white">
            <SignaturePad
              key={`udot-${padKey}`}
              ref={udotRef}
              variant="overlay"
              label="UDOT signature"
              onChange={setUdotSigned}
            />
          </div>
        </div>

        <div className="space-y-2 border-t border-[#C8CDD0] pt-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#075C35]">
                Santaquin City Waiver
              </p>
              <p className="text-sm font-medium text-[#090A0A]">
                Signature of participant or parent/guardian of minor
              </p>
            </div>
            <button
              type="button"
              onClick={() => cityRef.current?.clear()}
              className="focus-ring rounded text-sm font-medium text-[#075C35] underline-offset-2 hover:underline"
            >
              Clear
            </button>
          </div>
          <div className="h-[72px] overflow-hidden rounded border border-[#C8CDD0] bg-white">
            <SignaturePad
              key={`city-${padKey}`}
              ref={cityRef}
              variant="overlay"
              label="Santaquin City signature"
              onChange={setCitySigned}
            />
          </div>
        </div>

        {error ? (
          <p
            className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="focus-ring w-full rounded bg-[#075C35] px-5 py-3 text-sm font-semibold text-white transition enabled:hover:bg-[#043D25] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {submitting ? "Submitting…" : "Submit signed waiver"}
        </button>
      </form>
    </div>
  );
}
