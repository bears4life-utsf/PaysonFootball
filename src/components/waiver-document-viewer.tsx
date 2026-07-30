"use client";

import Image from "next/image";
import { useState } from "react";

import {
  WAIVER_PDF_PUBLIC_PATH,
  WAIVER_PREVIEW_PUBLIC_PATH,
} from "@/lib/waiver-paths";

const MIN_ZOOM = 1;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.25;

export function WaiverDocumentViewer() {
  const [zoom, setZoom] = useState(1);

  function zoomOut() {
    setZoom((value) => Math.max(MIN_ZOOM, Number((value - ZOOM_STEP).toFixed(2))));
  }

  function zoomIn() {
    setZoom((value) => Math.min(MAX_ZOOM, Number((value + ZOOM_STEP).toFixed(2))));
  }

  return (
    <div className="overflow-hidden bg-white sm:rounded sm:border sm:border-[#C8CDD0]">
      <div className="flex flex-col gap-3 border-b border-[#C8CDD0] px-4 py-3 sm:flex-row sm:items-end sm:justify-between sm:px-5">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-tight text-[#090A0A]">
            Santaquin Orchard Days Parade Waiver
          </h2>
          <p className="mt-1 text-sm text-[#313a36]">
            Read the full waiver, then complete the form underneath.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            className="focus-ring rounded border border-[#C8CDD0] px-3 py-1.5 text-sm font-medium text-[#090A0A] enabled:hover:bg-[#F3F4F4] disabled:opacity-40"
            aria-label="Zoom out"
          >
            −
          </button>
          <span className="min-w-12 text-center text-sm text-[#313a36]">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            className="focus-ring rounded border border-[#C8CDD0] px-3 py-1.5 text-sm font-medium text-[#090A0A] enabled:hover:bg-[#F3F4F4] disabled:opacity-40"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
      </div>

      <div className="max-h-[80vh] overflow-auto bg-[#E8EAEB]">
        <div
          className="origin-top transition-[width] duration-150"
          style={{ width: `${zoom * 100}%` }}
        >
          <Image
            src={WAIVER_PREVIEW_PUBLIC_PATH}
            alt="Santaquin Orchard Days Parade Waiver document"
            width={1530}
            height={1980}
            className="h-auto w-full bg-white"
            priority
            sizes="100vw"
          />
        </div>
      </div>

      <div className="border-t border-[#C8CDD0] px-4 py-3 text-sm text-[#313a36] sm:px-5">
        <a
          href={WAIVER_PDF_PUBLIC_PATH}
          target="_blank"
          rel="noreferrer"
          className="focus-ring rounded font-medium text-[#075C35] underline underline-offset-2"
        >
          Download PDF
        </a>
      </div>
    </div>
  );
}
