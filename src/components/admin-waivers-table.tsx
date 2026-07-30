"use client";

import { useMemo, useState } from "react";

import type { WaiverListItem } from "@/lib/waiver";

const UTAH_TIME_ZONE = "America/Denver";

type SortKey = "name" | "date";
type SortDir = "asc" | "desc";

type AdminWaiversTableProps = {
  waivers: WaiverListItem[];
  token: string;
};

function formatUtahDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: UTAH_TIME_ZONE,
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

function formatUtahTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: UTAH_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function AdminWaiversTable({ waivers, token }: AdminWaiversTableProps) {
  const [rows, setRows] = useState(waivers);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [busy, setBusy] = useState<"zip" | "pdf" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const items = [...rows];
    const direction = sortDir === "asc" ? 1 : -1;
    items.sort((a, b) => {
      if (sortKey === "name") {
        const left = a.participantName.localeCompare(b.participantName, undefined, {
          sensitivity: "base",
        });
        if (left !== 0) return left * direction;
        return a.uploadedAt.localeCompare(b.uploadedAt) * direction;
      }
      const byDate = a.uploadedAt.localeCompare(b.uploadedAt);
      if (byDate !== 0) return byDate * direction;
      return a.participantName.localeCompare(b.participantName, undefined, {
        sensitivity: "base",
      }) * direction;
    });
    return items;
  }, [rows, sortKey, sortDir]);

  const allSelected =
    sorted.length > 0 && sorted.every((waiver) => selected.has(waiver.pathname));
  const selectedCount = selected.size;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(sorted.map((waiver) => waiver.pathname)));
  }

  function toggleOne(pathname: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(pathname)) next.delete(pathname);
      else next.add(pathname);
      return next;
    });
  }

  function setSort(nextKey: SortKey) {
    if (sortKey === nextKey) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(nextKey);
    setSortDir(nextKey === "date" ? "desc" : "asc");
  }

  async function runExport(kind: "zip" | "pdf") {
    if (selectedCount === 0) {
      setError("Select at least one waiver.");
      return;
    }

    setBusy(kind);
    setError(null);

    try {
      const pathnames = sorted
        .map((waiver) => waiver.pathname)
        .filter((pathname) => selected.has(pathname));

      const endpoint =
        kind === "zip" ? "/api/waivers/export" : "/api/waivers/combine";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, pathnames }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error ?? `Could not create ${kind.toUpperCase()}.`);
      }

      const blob = await response.blob();
      const stamp = new Intl.DateTimeFormat("en-CA", {
        timeZone: UTAH_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());
      const filename =
        kind === "zip"
          ? `parade-waivers-${stamp}.zip`
          : `parade-waivers-${stamp}.pdf`;
      downloadBlob(blob, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setBusy(null);
    }
  }

  async function runDelete() {
    if (selectedCount === 0) {
      setError("Select at least one waiver.");
      return;
    }

    const confirmed = window.confirm(
      `Delete ${selectedCount} selected waiver${selectedCount === 1 ? "" : "s"}? This cannot be undone.`,
    );
    if (!confirmed) return;

    setBusy("delete");
    setError(null);

    try {
      const pathnames = sorted
        .map((waiver) => waiver.pathname)
        .filter((pathname) => selected.has(pathname));

      const response = await fetch("/api/waivers/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, pathnames }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error ?? "Could not delete waivers.");
      }

      const deleted = new Set(pathnames);
      setRows((current) => current.filter((row) => !deleted.has(row.pathname)));
      setSelected(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusy(null);
    }
  }

  const sortLabel = (key: SortKey) => {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  if (rows.length === 0) {
    return <p className="text-[#313a36]">No signed waivers yet.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="text-sm text-[#313a36]">
          {selectedCount} selected of {sorted.length}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => runExport("pdf")}
            disabled={selectedCount === 0 || busy !== null}
            className="focus-ring rounded bg-[#075C35] px-3 py-2 text-sm font-semibold text-white enabled:hover:bg-[#043D25] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy === "pdf" ? "Combining…" : "Combine selected (PDF)"}
          </button>
          <button
            type="button"
            onClick={() => runExport("zip")}
            disabled={selectedCount === 0 || busy !== null}
            className="focus-ring rounded border border-[#075C35] px-3 py-2 text-sm font-semibold text-[#075C35] enabled:hover:bg-[#075C35]/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy === "zip" ? "Zipping…" : "Zip selected"}
          </button>
          <button
            type="button"
            onClick={runDelete}
            disabled={selectedCount === 0 || busy !== null}
            className="focus-ring rounded border border-red-700 px-3 py-2 text-sm font-semibold text-red-700 enabled:hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy === "delete" ? "Deleting…" : "Delete selected"}
          </button>
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

      <div className="overflow-x-auto rounded border border-[#C8CDD0] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#C8CDD0] bg-[#E8EAEB] text-[#090A0A]">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Select all waivers"
                  className="size-4 accent-[#075C35]"
                />
              </th>
              <th className="px-4 py-3 font-semibold">
                <button
                  type="button"
                  onClick={() => setSort("name")}
                  className="focus-ring rounded font-semibold"
                >
                  Participant{sortLabel("name")}
                </button>
              </th>
              <th className="px-4 py-3 font-semibold">Parent</th>
              <th className="px-4 py-3 font-semibold">
                <button
                  type="button"
                  onClick={() => setSort("date")}
                  className="focus-ring rounded font-semibold"
                >
                  Date{sortLabel("date")}
                </button>
              </th>
              <th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold">PDF</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((waiver) => {
              const fileQuery = `pathname=${encodeURIComponent(waiver.pathname)}&token=${encodeURIComponent(token)}`;
              const downloadHref = `/api/waivers/file?${fileQuery}`;
              const viewHref = `/api/waivers/file?${fileQuery}&view=1`;
              const isChecked = selected.has(waiver.pathname);

              return (
                <tr key={waiver.pathname} className="border-b border-[#E8EAEB]">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleOne(waiver.pathname)}
                      aria-label={`Select ${waiver.participantName || "waiver"}`}
                      className="size-4 accent-[#075C35]"
                    />
                  </td>
                  <td className="px-4 py-3 capitalize text-[#090A0A]">
                    {waiver.participantName || "—"}
                  </td>
                  <td className="px-4 py-3 capitalize text-[#313a36]">
                    {waiver.parentName || "—"}
                  </td>
                  <td className="px-4 py-3 text-[#313a36]">
                    {formatUtahDate(waiver.uploadedAt)}
                  </td>
                  <td className="px-4 py-3 text-[#313a36]">
                    {formatUtahTime(waiver.uploadedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <a
                        href={viewHref}
                        target="_blank"
                        rel="noreferrer"
                        className="focus-ring rounded font-medium text-[#075C35] underline underline-offset-2"
                      >
                        View
                      </a>
                      <a
                        href={downloadHref}
                        className="focus-ring rounded font-medium text-[#075C35] underline underline-offset-2"
                      >
                        Download
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
