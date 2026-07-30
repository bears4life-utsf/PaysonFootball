import { list } from "@vercel/blob";
import { notFound } from "next/navigation";

import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import {
  WAIVER_BLOB_PREFIX,
  assertBlobConfigured,
  parseWaiverPathname,
  verifyAdminToken,
  type WaiverListItem,
} from "@/lib/waiver";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

async function listWaivers(): Promise<WaiverListItem[]> {
  assertBlobConfigured();
  const items: WaiverListItem[] = [];
  let cursor: string | undefined;

  do {
    const result = await list({
      prefix: WAIVER_BLOB_PREFIX,
      cursor,
    });

    for (const blob of result.blobs) {
      if (!blob.pathname.toLowerCase().endsWith(".pdf")) continue;
      const parsed = parseWaiverPathname(blob.pathname);
      items.push({
        pathname: blob.pathname,
        url: blob.url,
        uploadedAt: blob.uploadedAt.toISOString(),
        parentName: parsed.parentName,
        participantName: parsed.participantName,
        date: parsed.date,
      });
    }

    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  items.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  return items;
}

export default async function AdminWaiversPage({ searchParams }: PageProps) {
  const { token } = await searchParams;
  if (!verifyAdminToken(token)) {
    notFound();
  }

  let waivers: WaiverListItem[] = [];
  let loadError: string | null = null;

  try {
    waivers = await listWaivers();
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Could not load waivers.";
  }

  const exportHref = `/api/waivers/export?token=${encodeURIComponent(token ?? "")}`;

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F4F4]">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-tight text-[#090A0A]">
              Parade waivers
            </h1>
            <p className="mt-2 text-[#313a36]">
              {waivers.length} saved submission{waivers.length === 1 ? "" : "s"}
            </p>
          </div>
          <a
            href={exportHref}
            className="focus-ring inline-flex items-center justify-center rounded bg-[#075C35] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#043D25]"
          >
            Download all (ZIP)
          </a>
        </div>

        {loadError ? (
          <p className="mt-8 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
            {loadError}
          </p>
        ) : waivers.length === 0 ? (
          <p className="mt-8 text-[#313a36]">No signed waivers yet.</p>
        ) : (
          <div className="mt-8 overflow-x-auto rounded border border-[#C8CDD0] bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[#C8CDD0] bg-[#E8EAEB] text-[#090A0A]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Participant</th>
                  <th className="px-4 py-3 font-semibold">Parent</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Submitted</th>
                  <th className="px-4 py-3 font-semibold">PDF</th>
                </tr>
              </thead>
              <tbody>
                {waivers.map((waiver) => {
                  const downloadHref = `/api/waivers/file?pathname=${encodeURIComponent(waiver.pathname)}&token=${encodeURIComponent(token ?? "")}`;
                  return (
                    <tr key={waiver.pathname} className="border-b border-[#E8EAEB]">
                      <td className="px-4 py-3 capitalize text-[#090A0A]">
                        {waiver.participantName || "—"}
                      </td>
                      <td className="px-4 py-3 capitalize text-[#313a36]">
                        {waiver.parentName || "—"}
                      </td>
                      <td className="px-4 py-3 text-[#313a36]">
                        {waiver.date || "—"}
                      </td>
                      <td className="px-4 py-3 text-[#313a36]">
                        {new Date(waiver.uploadedAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={downloadHref}
                          className="focus-ring rounded font-medium text-[#075C35] underline underline-offset-2"
                        >
                          Download
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
