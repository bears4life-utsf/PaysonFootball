"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type SignaturePadHandle = {
  clear: () => void;
  isSigned: () => boolean;
  toDataURL: () => string;
};

type SignaturePadProps = {
  label: string;
  variant?: "form" | "overlay";
  onChange?: (signed: boolean) => void;
};

export const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(
  function SignaturePad({ label, variant = "form", onChange }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawing = useRef(false);
    const signedRef = useRef(false);
    const onChangeRef = useRef(onChange);
    const [hasStroke, setHasStroke] = useState(false);

    useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const syncSize = () => {
        const parent = canvas.parentElement;
        if (!parent) return;
        const snapshot = signedRef.current ? canvas.toDataURL("image/png") : "";
        const ratio = window.devicePixelRatio || 1;
        const width = Math.max(parent.clientWidth, 1);
        const height = Math.max(
          parent.clientHeight || (variant === "overlay" ? 48 : 72),
          1,
        );
        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#090A0A";
        ctx.lineWidth = variant === "overlay" ? 2 : 2.25;
        ctx.clearRect(0, 0, width, height);
        if (variant === "form") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
        }
        if (snapshot) {
          const image = new Image();
          image.onload = () => ctx.drawImage(image, 0, 0, width, height);
          image.src = snapshot;
        }
      };

      syncSize();
      const observer = new ResizeObserver(syncSize);
      if (canvas.parentElement) observer.observe(canvas.parentElement);
      return () => observer.disconnect();
    }, [variant]);

    useImperativeHandle(ref, () => ({
      clear: () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        if (variant === "form") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        }
        signedRef.current = false;
        setHasStroke(false);
        onChangeRef.current?.(false);
      },
      isSigned: () => signedRef.current,
      toDataURL: () => canvasRef.current?.toDataURL("image/png") ?? "",
    }));

    function getPoint(event: React.PointerEvent<HTMLCanvasElement>) {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }

    function start(event: React.PointerEvent<HTMLCanvasElement>) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const point = getPoint(event);
      if (!canvas || !ctx || !point) return;
      drawing.current = true;
      canvas.setPointerCapture(event.pointerId);
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    }

    function move(event: React.PointerEvent<HTMLCanvasElement>) {
      if (!drawing.current) return;
      const ctx = canvasRef.current?.getContext("2d");
      const point = getPoint(event);
      if (!ctx || !point) return;
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }

    function end() {
      if (!drawing.current) return;
      drawing.current = false;
      signedRef.current = true;
      setHasStroke(true);
      onChangeRef.current?.(true);
    }

    if (variant === "overlay") {
      return (
        <canvas
          ref={canvasRef}
          aria-label={label}
          className="block h-full w-full cursor-crosshair touch-none"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          onPointerLeave={end}
        />
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-[#090A0A]">{label}</p>
          <button
            type="button"
            onClick={() => {
              const canvas = canvasRef.current;
              const ctx = canvas?.getContext("2d");
              if (!canvas || !ctx) return;
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
              signedRef.current = false;
              setHasStroke(false);
              onChangeRef.current?.(false);
            }}
            className="focus-ring rounded text-sm font-medium text-[#075C35] underline-offset-2 hover:underline"
          >
            Clear
          </button>
        </div>
        <div className="h-[72px] touch-none overflow-hidden rounded border border-[#C8CDD0] bg-white">
          <canvas
            ref={canvasRef}
            aria-label={label}
            className="block h-full w-full cursor-crosshair"
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerCancel={end}
            onPointerLeave={end}
          />
        </div>
        <p className="text-xs text-[#313a36]">
          {hasStroke ? "Signature captured." : "Sign with your mouse or finger."}
        </p>
      </div>
    );
  },
);
